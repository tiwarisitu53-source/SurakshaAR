import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, Award, RotateCcw, Volume2, ArrowRight, ShieldCheck, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';
import { AssessmentQuestion, Language, SafetyModule, WorkerProfile, CertificateRecord } from '../../types';
import { translations } from '../../data/translations';
import { audioAssistant } from '../../utils/audioAssistant';
import { offlineStorage } from '../../utils/offlineStorage';
import { AIVoiceCoachWidget } from '../AICoach/AIVoiceCoachWidget';
import { PASS_THRESHOLD } from '../../utils/constants';

interface AssessmentModalProps {
  module: SafetyModule;
  worker: WorkerProfile;
  language: Language;
  onClose: () => void;
  onCertificateIssued: (cert: CertificateRecord) => void;
  onReturnToTraining?: () => void;
}

export const AssessmentModal: React.FC<AssessmentModalProps> = ({
  module,
  worker,
  language,
  onClose,
  onCertificateIssued,
  onReturnToTraining
}) => {
  const t = translations[language];
  const questions = module.assessmentQuestions;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  // Sequence question ordered ids state
  const [sequenceOrders, setSequenceOrders] = useState<Record<string, string[]>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [scorePercentage, setScorePercentage] = useState<number>(0);
  const [passed, setPassed] = useState<boolean>(false);
  const [startTime] = useState<number>(() => Date.now());
  const [timeTakenSeconds, setTimeTakenSeconds] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [showReview, setShowReview] = useState<boolean>(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Cleanup speech on modal unmount
  useEffect(() => {
    return () => {
      audioAssistant.stopSpeaking();
    };
  }, []);

  // Speak question prompt only
  const handleSpeakQuestion = () => {
    if (!currentQuestion) return;
    const prompt = currentQuestion.audioPrompt?.[language] || currentQuestion.prompt[language];
    audioAssistant.speak(prompt, language);
  };

  // Speak a single option text
  const handleSpeakOption = (optionPrefix: string, text: string) => {
    const speechScript = `${optionPrefix}: ${text}`;
    audioAssistant.speak(speechScript, language);
  };

  // Select MCQ option
  const handleSelectOption = (questionId: string, optionId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  // Move sequence item up or down
  const handleShiftSequence = (questionId: string, itemIndex: number, direction: 'up' | 'down') => {
    const currentList = sequenceOrders[questionId] || currentQuestion.sequenceItems?.map(i => i.id) || [];
    const targetIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
    if (targetIndex < 0 || targetIndex >= currentList.length) return;

    const updated = [...currentList];
    const temp = updated[itemIndex];
    updated[itemIndex] = updated[targetIndex];
    updated[targetIndex] = temp;

    setSequenceOrders(prev => ({
      ...prev,
      [questionId]: updated
    }));
  };

  // Submit and evaluate assessment
  const handleSubmitAssessment = () => {
    audioAssistant.stopSpeaking();
    let totalPoints = questions.length;
    let earnedPoints = 0;

    questions.forEach(q => {
      if (q.type === 'mcq') {
        const selectedOptId = selectedAnswers[q.id];
        const correctOpt = q.options?.find(o => o.isCorrect);
        if (selectedOptId && correctOpt && selectedOptId === correctOpt.id) {
          earnedPoints += 1;
        }
      } else if (q.type === 'sequence') {
        const userOrder = sequenceOrders[q.id] || q.sequenceItems?.map(i => i.id) || [];
        const isExactMatch = q.sequenceItems?.every((item, idx) => {
          return userOrder[idx] === item.id;
        });
        if (isExactMatch) {
          earnedPoints += 1;
        } else {
          // Partial credit if first 2 match
          if (userOrder[0] === q.sequenceItems?.[0]?.id) {
            earnedPoints += 0.5;
          }
        }
      }
    });

    const calculatedScore = Math.round((earnedPoints / totalPoints) * 100);
    const isPassing = calculatedScore >= module.requiredPassingScore;

    const durationSec = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    setTimeTakenSeconds(durationSec);
    setCorrectCount(Math.round(earnedPoints));
    setScorePercentage(calculatedScore);
    setPassed(isPassing);
    setSubmitted(true);

    if (isPassing) {
      audioAssistant.playSuccessChime();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      // Spoken congratulatory voice message in chosen language
      setTimeout(() => {
        const passSpeech = 
          language === 'sat'
            ? `ᱥᱟᱨᱦᱟᱣ ${worker.name}! ᱟᱢ ᱯᱟᱥ ᱮᱱᱟᱢ, ᱱᱚᱢᱵᱚᱨ ${calculatedScore}% ᱧᱟᱢ ᱟᱠᱟᱫ-ᱟᱢ᱾ ᱟᱢᱟᱜ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱛᱮᱭᱟᱨ ᱮᱱᱟ᱾`
            : language === 'hi'
            ? `बधाई हो ${worker.name}! आपने ${calculatedScore}% अंक के साथ सुरक्षा परीक्षा उत्तीर्ण कर ली है। आपका डिजिटल प्रमाणपत्र जारी हो गया है।`
            : `Congratulations ${worker.name}! You have passed the assessment with ${calculatedScore}%. Your certified digital credential is now ready.`;
        audioAssistant.speak(passSpeech, language);
      }, 500);

      // Create Certificate with module-specific metadata
      const modulePrefix = 
        module.id === 'fire_explosion' ? 'FIRE' :
        module.id === 'gas_confined_space' ? 'GAS' :
        module.id === 'machinery_safety' ? 'LOTO' :
        module.id === 'ppe_hazard' ? 'HEIGHT' : 'ELEC';

      const certId = `SURAKSHA-IND-2026-${modulePrefix}-${Math.floor(1000 + Math.random() * 9000)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;

      const complianceStandard = 
        module.id === 'fire_explosion' ? 'DGMS / OSHA 1910.157 (Portable Fire Equipment & Suppression)' :
        module.id === 'gas_confined_space' ? 'DGMS / OSHA 1910.146 (Permit-Required Confined Spaces)' :
        module.id === 'machinery_safety' ? 'DGMS CMR 2017 / OSHA 1910.147 (Lockout-Tagout Machinery Safety)' :
        module.id === 'ppe_hazard' ? 'DGMS / OSHA 1926 Subpart M (Fall Protection & 100% Tie-Off)' :
        'DGMS / NFPA 70E / IEEE 1584 (Arc Flash & High Voltage Safety)';
      
      const newCert: CertificateRecord = {
        certificateId: certId,
        workerId: worker.id,
        workerName: worker.name,
        moduleKey: module.id,
        moduleName: module.title[language] || module.title.en,
        score: calculatedScore,
        date: '23-Aug-2026',
        expiryDate: '23-Aug-2027',
        status: 'Valid',
        language: language === 'sat' ? 'Santali' : language === 'hi' ? 'Hindi' : 'English',
        organization: worker.facility || 'Eastern Coalfields & Heavy Industries Ltd.',
        complianceStandard,
        synced: false,
        workerIdPhotoUrl: worker.idPhotoUrl,
        idVerified: worker.idVerified ?? true,
        qrPayload: JSON.stringify({
          certId,
          worker: `${worker.name} (${worker.id})`,
          module: module.title.en,
          score: `${calculatedScore}%`,
          date: '23-Aug-2026',
          status: 'Valid',
          auth: 'DGMS-CERT-LEDGER-VERIFIED'
        })
      };

      // Save to offline storage
      offlineStorage.saveCertificate(newCert);
      onCertificateIssued(newCert);
    } else {
      audioAssistant.playErrorBuzz();
      setTimeout(() => {
        const failSpeech = 
          language === 'sat'
            ? `ᱫᱟᱭᱟᱠᱟᱛᱮ ᱟᱨᱢᱤᱫᱷᱟᱣ ᱪᱮᱥᱴᱟᱭ ᱢᱮ᱾ ᱯᱟᱥ ᱞᱟᱹᱜᱤᱫ 70% ᱞᱟᱹᱠᱛᱤᱭᱟ᱾`
            : language === 'hi'
            ? `सुरक्षा नियमों का पुनः अध्ययन करें। उत्तीर्ण होने के लिए न्यूनतम 70% अंक आवश्यक हैं।`
            : `Please review safety procedures and try again. A minimum of 70% is required to pass.`;
        audioAssistant.speak(failSpeech, language);
      }, 400);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setSequenceOrders({});
    setCurrentQuestionIndex(0);
    setSubmitted(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200/90 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 font-bold shadow-sm">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-orange-400 uppercase tracking-widest block">
                {module.badge}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                {module.title[language]} - {t.takeAssessment}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              audioAssistant.stopSpeaking();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Proctored Candidate Identification Verification Banner */}
        <div className="bg-slate-100 border-b border-slate-200 px-5 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            {worker.idPhotoUrl ? (
              <img 
                src={worker.idPhotoUrl} 
                alt={worker.name} 
                className="w-8 h-8 rounded-lg border border-slate-300 object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center font-bold text-white text-xs">
                {worker.name[0]}
              </div>
            )}
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                Proctored Examinee
              </span>
              <span className="font-bold text-slate-800">
                {worker.name} <span className="font-mono text-slate-500 font-normal">({worker.id})</span>
              </span>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-lg">
            PASS: {PASS_THRESHOLD}%
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto max-h-[75vh] bg-slate-50/50 space-y-6">
          {!submitted ? (
            /* ACTIVE QUESTION VIEW */
            <div className="flex flex-col gap-4">
              {/* 1. AI VOICE COACH BAR */}
              <AIVoiceCoachWidget
                currentQuestion={currentQuestion}
                language={language}
                moduleTitle={module.title[language] || module.title.en}
                autoReadDefault={true}
              />

              {/* 2. Question Progress Tracker */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span className="font-bold text-slate-800 uppercase tracking-wider">
                  {language === 'sat' 
                    ? `ᱠᱩᱠᱞᱤ ${currentQuestionIndex + 1} / ${questions.length}` 
                    : language === 'hi' 
                    ? `प्रश्न ${currentQuestionIndex + 1} / ${questions.length}` 
                    : `Question ${currentQuestionIndex + 1} of ${questions.length}`}
                </span>
                <span className="text-[11px] text-orange-600 font-bold uppercase">
                  {t.passingScore}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300 rounded-full"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* 3. Question Prompt Card */}
              <div className="bg-white border border-slate-200/90 p-4 sm:p-5 rounded-xl shadow-sm flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200 inline-block">
                    {currentQuestion.type === 'mcq' 
                      ? (language === 'sat' ? 'ᱵᱟᱪᱷᱟᱣ ᱠᱩᱠᱞᱤ (MCQ)' : language === 'hi' ? 'बहुविकल्पीय प्रश्न (MCQ)' : 'Multiple Choice') 
                      : (language === 'sat' ? 'ᱥᱟᱡᱟᱣ ᱠᱩᱠᱞᱤ (Sequence)' : language === 'hi' ? 'क्रम निर्धारण (Sequence)' : 'Sequential Order')}
                  </span>
                  <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {currentQuestion.prompt[language] || currentQuestion.prompt.en}
                  </p>
                </div>
                <button
                  onClick={handleSpeakQuestion}
                  className="p-2.5 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl text-orange-600 shrink-0 transition-all active:scale-95 shadow-sm"
                  title="Read question prompt in selected language"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* 4. MCQ Options with individual voice buttons */}
              {currentQuestion.type === 'mcq' && currentQuestion.options && (
                <div className="flex flex-col gap-2.5">
                  {currentQuestion.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[currentQuestion.id] === opt.id;
                    const letterLabel = ['A', 'B', 'C', 'D'][optIdx] || `${optIdx + 1}`;
                    const prefixForSpeech = 
                      language === 'sat' ? `ᱵᱟᱪᱷᱟᱣ ${letterLabel}` :
                      language === 'hi' ? `विकल्प ${letterLabel}` :
                      `Option ${letterLabel}`;
                    const optText = opt.text[language] || opt.text.en;

                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                        className={`p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-orange-50/80 border-orange-500 text-slate-900 shadow-md ring-1 ring-orange-500/30'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {letterLabel}
                          </span>
                          <span className="text-xs sm:text-sm font-semibold leading-relaxed">
                            {optText}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {/* Speak this specific option */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSpeakOption(prefixForSpeech, optText);
                            }}
                            className="p-1.5 bg-slate-100 hover:bg-orange-100 text-slate-500 hover:text-orange-600 rounded-lg border border-slate-200 transition-colors"
                            title={`Speak option ${letterLabel}`}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Selection indicator */}
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-orange-500 bg-orange-500 text-white' : 'border-slate-300'
                          }`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 5. Sequence Questions with voice reading */}
              {currentQuestion.type === 'sequence' && currentQuestion.sequenceItems && (
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-bold uppercase tracking-wider">
                      {language === 'sat' 
                        ? 'ᱱᱚᱶᱟ ᱠᱟᱹᱢᱤ ᱦᱚᱨᱟ ᱴᱷᱤᱠ ᱞᱟᱭᱤᱱ ᱨᱮ ᱥᱟᱡᱟᱣ ᱢᱮ:' 
                        : language === 'hi' 
                        ? 'सही क्रम में व्यवस्थित करें:' 
                        : 'Arrange items into correct sequence:'}
                    </span>
                  </div>
                  {(sequenceOrders[currentQuestion.id] || currentQuestion.sequenceItems.map(i => i.id)).map((itemId, idx) => {
                    const itemData = currentQuestion.sequenceItems?.find(i => i.id === itemId);
                    if (!itemData) return null;
                    const itemText = itemData.text[language] || itemData.text.en;
                    const stepPrefix = 
                      language === 'sat' ? `ᱫᱷᱟᱯ ${idx + 1}` :
                      language === 'hi' ? `चरण ${idx + 1}` :
                      `Step ${idx + 1}`;

                    return (
                      <div
                        key={itemId}
                        className="bg-white border border-slate-200 p-3.5 rounded-xl flex items-center justify-between gap-3 text-xs sm:text-sm text-slate-800 shadow-sm"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <span className="w-6 h-6 rounded-lg bg-orange-100 border border-orange-200 text-orange-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-semibold">{itemText}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleSpeakOption(stepPrefix, itemText)}
                            className="p-1.5 bg-slate-100 hover:bg-orange-100 text-slate-600 hover:text-orange-600 rounded-lg border border-slate-200 transition-colors mr-1"
                            title={`Read step ${idx + 1}`}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            disabled={idx === 0}
                            onClick={() => handleShiftSequence(currentQuestion.id, idx, 'up')}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 rounded text-xs font-bold text-slate-700 transition-colors"
                          >
                            ▲
                          </button>
                          <button
                            disabled={idx === currentQuestion.sequenceItems!.length - 1}
                            onClick={() => handleShiftSequence(currentQuestion.id, idx, 'down')}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 rounded text-xs font-bold text-slate-700 transition-colors"
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* RESULTS VIEW */
            <div className="flex flex-col items-center text-center gap-4 py-6">
              {passed ? (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-green-50 border-2 border-green-500 flex items-center justify-center text-green-600 shadow-md animate-bounce">
                    <ShieldCheck className="w-9 h-9" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                      {language === 'sat' ? 'ᱥᱟᱹᱠᱷᱤᱭᱟᱹᱛ ᱯᱟᱥ ᱮᱱᱟ (COMPLIANCE PASSED)' : language === 'hi' ? 'प्रमाणीकरण उत्तीर्ण' : 'COMPLIANCE PASSED'}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                      {language === 'sat' 
                        ? `ᱥᱟᱨᱦᱟᱣ, ${worker.name}!` 
                        : language === 'hi' 
                        ? `बधाई हो, ${worker.name}!` 
                        : `Congratulations, ${worker.name}!`}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md">
                      {language === 'sat'
                        ? `ᱟᱢ ᱫᱚ ${scorePercentage}% ᱱᱚᱢᱵᱚᱨ ᱧᱟᱢ ᱠᱟᱛᱮ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱟᱨ QR ᱠᱳᱰ ᱟᱨᱡᱟᱣ ᱠᱮᱫ-ᱟᱢ᱾`
                        : language === 'hi'
                        ? `आपने ${scorePercentage}% अंक प्राप्त कर अपना DGMS/OSHA डिजिटल प्रमाणपत्र और सत्यापन QR कोड हासिल किया है।`
                        : `You achieved a certified score of ${scorePercentage}%. Your DGMS compliance certificate with a unique tamper-proof QR code has been generated.`}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-red-50 border-2 border-red-500 flex items-center justify-center text-red-600 shadow-md">
                    <ShieldAlert className="w-9 h-9" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                      {language === 'sat' ? '70% ᱵᱟᱝ ᱦᱩᱭ ᱞᱮᱱᱟ (RETAKE REQUIRED)' : language === 'hi' ? 'न्यूनतम अंक अपर्याप्त (पुनः प्रयास करें)' : 'MINIMUM THRESHOLD NOT REACHED'}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-2">
                      {language === 'sat' 
                        ? `ᱱᱚᱢᱵᱚᱨ: ${scorePercentage}% (ᱯᱟᱥ ᱞᱟᱹᱜᱤᱫ: 70%)` 
                        : language === 'hi'
                        ? `प्राप्तांक: ${scorePercentage}% (उत्तीर्ण हेतु: 70%)`
                        : `Score: ${scorePercentage}% (Passing is 70%)`}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md">
                      {language === 'sat'
                        ? 'ᱠᱷᱟᱫᱟᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱱᱤᱭᱚᱢ ᱞᱟᱹᱜᱤᱫ 70% ᱞᱟᱹᱠᱛᱤᱭᱟ᱾ ᱫᱟᱭᱟᱠᱟᱛᱮ ᱟᱨᱢᱤᱫᱷᱟᱣ ᱪᱮᱥᱴᱟᱭ ᱢᱮ᱾'
                        : language === 'hi'
                        ? 'औद्योगिक सुरक्षा नियमों के अनुसार न्यूनतम 70% दक्षता आवश्यक है। कृपया सुरक्षा निर्देशों को पुनः पढ़कर दोबारा प्रयास करें।'
                        : 'Industrial safety regulations require minimum 70% proficiency. Please review the safety warnings and retry the assessment.'}
                    </p>
                  </div>
                </>
              )}

              {/* Performance Statistics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full text-left my-2">
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[10px] uppercase font-bold text-slate-500">{t.score}</div>
                  <div className={`text-lg sm:text-xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                    {scorePercentage}%
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">Req: {module.requiredPassingScore}%</div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[10px] uppercase font-bold text-slate-500">{t.correctAnswers}</div>
                  <div className="text-lg sm:text-xl font-bold text-slate-800">
                    {correctCount} <span className="text-xs text-slate-400 font-normal">/ {questions.length}</span>
                  </div>
                  <div className="text-[10px] text-green-600 font-medium">{Math.round((correctCount / questions.length) * 100)}% accuracy</div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[10px] uppercase font-bold text-slate-500">{t.incorrectAnswers}</div>
                  <div className="text-lg sm:text-xl font-bold text-slate-800">
                    {questions.length - correctCount}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">Review below</div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[10px] uppercase font-bold text-slate-500">{t.timeTaken}</div>
                  <div className="text-lg sm:text-xl font-bold text-slate-800">
                    {Math.floor(timeTakenSeconds / 60)}m {timeTakenSeconds % 60}s
                  </div>
                  <div className="text-[10px] text-orange-600 font-medium">Timed session</div>
                </div>
              </div>

              {/* Review Toggle */}
              <div className="w-full text-left">
                <button
                  onClick={() => setShowReview(prev => !prev)}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 underline flex items-center gap-1.5 py-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showReview ? t.hideReview : t.reviewAnswers}</span>
                </button>

                {showReview && (
                  <div className="mt-3 space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {questions.map((q, idx) => {
                      let isCorrect = false;
                      let userChoiceText = 'None';
                      let correctChoiceText = '';

                      if (q.type === 'mcq') {
                        const userOpt = q.options?.find(o => o.id === selectedAnswers[q.id]);
                        const correctOpt = q.options?.find(o => o.isCorrect);
                        isCorrect = userOpt?.isCorrect === true;
                        userChoiceText = userOpt ? (userOpt.text[language] || userOpt.text.en) : (language === 'hi' ? 'कोई नहीं' : 'Unanswered');
                        correctChoiceText = correctOpt ? (correctOpt.text[language] || correctOpt.text.en) : '';
                      } else {
                        const userOrder = sequenceOrders[q.id] || q.sequenceItems?.map(i => i.id) || [];
                        isCorrect = q.sequenceItems?.every((item, i) => userOrder[i] === item.id) || false;
                        userChoiceText = isCorrect ? 'Correct order' : 'Incorrect sequence';
                        correctChoiceText = q.sequenceItems?.map(i => i.text[language] || i.text.en).join(' → ') || '';
                      }

                      return (
                        <div key={q.id} className={`p-3 rounded-xl border text-xs ${isCorrect ? 'bg-green-50/60 border-green-200' : 'bg-red-50/60 border-red-200'}`}>
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-slate-900">
                              {idx + 1}. {q.prompt[language] || q.prompt.en}
                            </span>
                            {isCorrect ? (
                              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                            )}
                          </div>
                          {!isCorrect && (
                            <div className="mt-1.5 space-y-0.5 text-[11px]">
                              <p className="text-red-700">
                                <strong className="font-semibold">{language === 'hi' ? 'आपका उत्तर:' : 'Your answer:'}</strong> {userChoiceText}
                              </p>
                              <p className="text-green-800">
                                <strong className="font-semibold">{language === 'hi' ? 'सही उत्तर:' : 'Correct:'}</strong> {correctChoiceText}
                              </p>
                            </div>
                          )}
                          {q.explanation && (
                            <p className="text-[10px] text-slate-600 mt-1.5 pt-1 border-t border-slate-200/60">
                              ℹ️ {q.explanation[language] || q.explanation.en}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-white p-4 border-t border-slate-200 flex items-center justify-between gap-3">
          {!submitted ? (
            <>
              <button
                onClick={() => {
                  audioAssistant.stopSpeaking();
                  setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
                }}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-30 text-xs sm:text-sm font-bold uppercase tracking-tight transition-all"
              >
                {language === 'sat' ? 'ᱛᱟᱭᱚᱢ' : language === 'hi' ? 'पिछला' : 'Previous'}
              </button>

              {isLastQuestion ? (
                <button
                  id="btn-submit-assessment"
                  onClick={handleSubmitAssessment}
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs sm:text-sm uppercase tracking-tight rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
                >
                  <span>{language === 'sat' ? 'ᱯᱚᱨᱤᱠᱷᱟ ᱡᱚᱢᱟᱭ ᱢᱮ' : language === 'hi' ? 'परीक्षा जमा करें' : 'Submit Exam & Grade'}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    audioAssistant.stopSpeaking();
                    setCurrentQuestionIndex(prev => prev + 1);
                  }}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm uppercase tracking-tight rounded-xl transition-all active:scale-95 flex items-center gap-1.5 shadow-sm"
                >
                  <span>{language === 'sat' ? 'ᱞᱟᱦᱟ ᱠᱩᱠᱞᱤ' : language === 'hi' ? 'अगला प्रश्न' : 'Next Question'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </>
          ) : (
            <div className="w-full flex items-center justify-between gap-2 sm:gap-3 flex-wrap">
              {passed ? (
                <>
                  <button
                    onClick={() => {
                      audioAssistant.stopSpeaking();
                      onClose();
                    }}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs sm:text-sm font-bold uppercase tracking-tight"
                  >
                    {t.close}
                  </button>
                  <button
                    id="btn-view-issued-certificate"
                    onClick={() => {
                      audioAssistant.stopSpeaking();
                      const certs = offlineStorage.getCertificates();
                      const latest = certs[0];
                      if (latest) {
                        onCertificateIssued(latest);
                      }
                    }}
                    className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs sm:text-sm uppercase tracking-tight rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
                  >
                    <Award className="w-4 h-4" />
                    <span>{t.viewCertificate}</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        audioAssistant.stopSpeaking();
                        onClose();
                      }}
                      className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs sm:text-sm font-bold uppercase tracking-tight"
                    >
                      {t.close}
                    </button>
                    {onReturnToTraining && (
                      <button
                        id="btn-return-to-training"
                        onClick={() => {
                          audioAssistant.stopSpeaking();
                          onReturnToTraining();
                        }}
                        className="px-3 sm:px-4 py-2 rounded-xl border border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100 text-xs sm:text-sm font-bold uppercase tracking-tight"
                      >
                        {t.returnToTraining}
                      </button>
                    )}
                  </div>
                  <button
                    id="btn-retry-assessment"
                    onClick={handleRetry}
                    className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs sm:text-sm uppercase tracking-tight rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{t.retakeAssessment}</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
