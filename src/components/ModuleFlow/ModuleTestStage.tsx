import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Volume2, ArrowRight, ArrowLeft, 
  HelpCircle, ShieldCheck, Lock, BookOpen, AlertTriangle, 
  ChevronUp, ChevronDown, Award, Bot, Sparkles, Check
} from 'lucide-react';
import { 
  AssessmentQuestion, Language, SafetyModule, 
  WorkerProfile, MistakeReviewItem, CertificateRecord 
} from '../../types';
import { audioAssistant } from '../../utils/audioAssistant';
import { PASS_THRESHOLD } from '../../utils/constants';
import { AIVoiceCoachWidget } from '../AICoach/AIVoiceCoachWidget';
import { haptics } from '../../utils/haptics';

interface ModuleTestStageProps {
  module: SafetyModule;
  worker: WorkerProfile;
  language: Language;
  isTrainingComplete: boolean;
  completedStepsCount: number;
  totalStepsCount: number;
  onGoToTraining: () => void;
  onSubmitTest: (
    score: number,
    passed: boolean,
    correctCount: number,
    mistakes: MistakeReviewItem[],
    cert?: CertificateRecord
  ) => void;
}

export const ModuleTestStage: React.FC<ModuleTestStageProps> = ({
  module,
  worker,
  language,
  isTrainingComplete,
  completedStepsCount,
  totalStepsCount,
  onGoToTraining,
  onSubmitTest,
}) => {
  const questions = module.assessmentQuestions;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [sequenceOrders, setSequenceOrders] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {};
    questions.forEach(q => {
      if (q.type === 'sequence' && q.sequenceItems && q.sequenceItems.length > 1) {
        // Reverse items initially so worker arranges them into correct order
        initial[q.id] = [...q.sequenceItems].reverse().map(i => i.id);
      }
    });
    return initial;
  });
  const [showVoiceCoach, setShowVoiceCoach] = useState<boolean>(false);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      audioAssistant.stopSpeaking();
    };
  }, []);

  // Guard: If training is not completed, show locked state!
  if (!isTrainingComplete) {
    return (
      <div className="w-full max-w-2xl mx-auto p-8 sm:p-12 my-8 bg-white border border-slate-200 rounded-3xl shadow-sm text-center flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-amber-50 border-2 border-amber-200 text-amber-600 flex items-center justify-center shadow-inner">
          <Lock className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-700">
            {language === 'hi' ? 'परीक्षा अवरुद्ध है (DGMS Gated Assessment)' : 'Official Gated Assessment'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {language === 'hi' ? 'प्रशिक्षण पूरा करने के बाद ही परीक्षा खुलेगी' : language === 'sat' ? 'ᱯᱚᱨᱤᱠᱷᱟ ᱡᱷᱤᱡ ᱞᱟᱹᱜᱤᱫ ᱴᱨᱮᱱᱤᱝ ᱢᱩᱪᱟᱹᱫ ᱢᱮ' : 'Complete AR Training to Unlock Assessment'}
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed pt-1">
            {language === 'hi'
              ? `इस मॉड्यूल की आधिकारिक सुरक्षा परीक्षा देने से पहले आपको सभी ${totalStepsCount} व्यावहारिक AR प्रशिक्षण चरण पूरे करने होंगे। वर्तमान प्रगति: ${completedStepsCount}/${totalStepsCount} चरण।`
              : `DGMS & OSHA safety protocols require completing all ${totalStepsCount} practical AR training steps before taking the official examination. Current progress: ${completedStepsCount}/${totalStepsCount} steps completed.`}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-sm space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span>{language === 'hi' ? 'प्रशिक्षण प्रगति' : 'Training Completion'}</span>
            <span className="text-orange-600">{Math.round((completedStepsCount / totalStepsCount) * 100)}%</span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${(completedStepsCount / totalStepsCount) * 100}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-500 text-left">
            {completedStepsCount} of {totalStepsCount} interactive steps verified
          </div>
        </div>

        <button
          id="btn-unlock-resume-training"
          onClick={() => {
            haptics.trigger('tap');
            onGoToTraining();
          }}
          className="flex items-center gap-2 px-8 py-3.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-sm uppercase tracking-tight rounded-2xl shadow-md transition-all cursor-pointer mt-2"
        >
          <BookOpen className="w-4 h-4" />
          <span>{language === 'hi' ? 'व्यावहारिक प्रशिक्षण जारी रखें' : 'Continue Practical Training'}</span>
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleSpeakQuestion = () => {
    if (!currentQuestion) return;
    haptics.trigger('tap');
    const prompt = currentQuestion.audioPrompt?.[language] || currentQuestion.prompt[language];
    audioAssistant.speak(prompt, language);
  };

  const handleSpeakOption = (optionPrefix: string, text: string) => {
    haptics.trigger('tap');
    const speechScript = `${optionPrefix}: ${text}`;
    audioAssistant.speak(speechScript, language);
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    haptics.trigger('tap');
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleShiftSequence = (questionId: string, itemIndex: number, direction: 'up' | 'down') => {
    haptics.trigger('tap');
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

  // Count answered questions
  const answeredCount = questions.filter(q => {
    if (q.type === 'mcq') return !!selectedAnswers[q.id];
    if (q.type === 'sequence') return true;
    return false;
  }).length;

  const handleGradeAndSubmit = () => {
    audioAssistant.stopSpeaking();
    haptics.trigger('tap');

    let totalPoints = questions.length;
    let earnedPoints = 0;
    const mistakes: MistakeReviewItem[] = [];

    questions.forEach((q, idx) => {
      if (q.type === 'mcq') {
        const selectedOptId = selectedAnswers[q.id];
        const selectedOpt = q.options?.find(o => o.id === selectedOptId);
        const correctOpt = q.options?.find(o => o.isCorrect);

        const isCorrect = !!(selectedOptId && correctOpt && selectedOptId === correctOpt.id);

        if (isCorrect) {
          earnedPoints += 1;
        } else {
          mistakes.push({
            questionId: q.id,
            questionNumber: idx + 1,
            prompt: q.prompt,
            questionType: 'mcq',
            userAnswerText: selectedOpt 
              ? (selectedOpt.text[language] || selectedOpt.text.en) 
              : (language === 'hi' ? 'उत्तर नहीं दिया (Unanswered)' : 'Unanswered'),
            correctAnswerText: correctOpt 
              ? (correctOpt.text[language] || correctOpt.text.en) 
              : 'Correct Safety Standard',
            isCorrect: false,
            explanation: q.explanation || correctOpt?.explanation
          });
        }
      } else if (q.type === 'sequence') {
        const sortedCorrect = [...(q.sequenceItems || [])].sort((a, b) => a.correctOrder - b.correctOrder);
        const userOrder = sequenceOrders[q.id] || q.sequenceItems?.map(i => i.id) || [];
        const isExactMatch = sortedCorrect.every((item, orderIdx) => {
          return userOrder[orderIdx] === item.id;
        });

        if (isExactMatch) {
          earnedPoints += 1;
        } else {
          const userSequenceLabels = userOrder.map((id, i) => {
            const item = q.sequenceItems?.find(it => it.id === id);
            return `${i + 1}. ${item ? (item.text[language] || item.text.en) : ''}`;
          }).join(' → ');

          const correctSequenceLabels = sortedCorrect.map((it, i) => {
            return `${i + 1}. ${it.text[language] || it.text.en}`;
          }).join(' → ');

          mistakes.push({
            questionId: q.id,
            questionNumber: idx + 1,
            prompt: q.prompt,
            questionType: 'sequence',
            userAnswerText: userSequenceLabels,
            correctAnswerText: correctSequenceLabels,
            isCorrect: false,
            explanation: q.explanation
          });
        }
      }
    });

    const calculatedScore = Math.round((earnedPoints / totalPoints) * 100);
    const isPassing = calculatedScore >= PASS_THRESHOLD;

    // Generate certificate record if passed
    let certRecord: CertificateRecord | undefined = undefined;
    if (isPassing) {
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

      const today = new Date();
      const dateStr = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const nextYear = new Date(today);
      nextYear.setFullYear(today.getFullYear() + 1);
      const expiryStr = nextYear.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

      certRecord = {
        certificateId: certId,
        workerId: worker.id,
        workerName: worker.name,
        moduleKey: module.id,
        moduleName: module.title[language] || module.title.en,
        score: calculatedScore,
        date: dateStr,
        expiryDate: expiryStr,
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
          date: dateStr,
          status: 'Valid',
          auth: 'DGMS-CERT-LEDGER-VERIFIED'
        })
      };
    }

    onSubmitTest(calculatedScore, isPassing, Math.round(earnedPoints), mistakes, certRecord);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 sm:py-8 px-3 sm:px-6 space-y-6 animate-fadeIn">
      {/* 1. Official Examination Station Header (Spacious, Anti-Slop, High Authority) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Examinee Info */}
        <div className="flex items-center gap-3.5">
          {worker.idPhotoUrl ? (
            <img 
              src={worker.idPhotoUrl} 
              alt={worker.name} 
              className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500 shadow-sm"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-base shadow-sm">
              {worker.name[0]}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {worker.name}
              </h2>
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                ID: {worker.id}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>{worker.role || 'Industrial Specialist'}</span>
              <span>·</span>
              <span>{worker.facility || 'Eastern Coalfields & Heavy Industries'}</span>
            </div>
          </div>
        </div>

        {/* Exam Compliance Metadata */}
        <div className="flex items-center gap-4 border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto justify-between md:justify-end text-right">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Compliance Standard
            </span>
            <span className="text-xs font-semibold text-slate-800">
              DGMS & OSHA Certified
            </span>
          </div>

          <div className="h-8 w-px bg-slate-200" />

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Pass Threshold
            </span>
            <span className="text-xs font-black text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200">
              ≥ {PASS_THRESHOLD}%
            </span>
          </div>
        </div>
      </div>

      {/* 2. Question Progression Bar with Clickable Index Navigator */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-sm">
              {language === 'sat' 
                ? `ᱠᱩᱠᱞᱤ ${currentQuestionIndex + 1} / ${questions.length}` 
                : language === 'hi' 
                ? `प्रश्न ${currentQuestionIndex + 1} / ${questions.length}` 
                : `Question ${currentQuestionIndex + 1} of ${questions.length}`}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500">
              {answeredCount} of {questions.length} answered
            </span>
          </div>

          {/* Toggle Safety Voice Coach */}
          <button
            onClick={() => setShowVoiceCoach(!showVoiceCoach)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              showVoiceCoach 
                ? 'bg-orange-500 text-white shadow-sm' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>{showVoiceCoach ? 'Hide Audio Coach' : 'Audio Coach'}</span>
          </button>
        </div>

        {/* Visual Question Jump Pills */}
        <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar">
          {questions.map((q, qIdx) => {
            const isAnswered = q.type === 'mcq' ? !!selectedAnswers[q.id] : true;
            const isCurrent = qIdx === currentQuestionIndex;

            return (
              <button
                key={q.id}
                onClick={() => {
                  haptics.trigger('tap');
                  audioAssistant.stopSpeaking();
                  setCurrentQuestionIndex(qIdx);
                }}
                className={`flex-1 min-w-[42px] h-10 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-orange-500 text-white shadow-md ring-2 ring-orange-400/50'
                    : isAnswered
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
                title={`Question ${qIdx + 1}`}
              >
                <span>{qIdx + 1}</span>
                {isAnswered && !isCurrent && (
                  <Check className="w-3 h-3 text-emerald-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Collapsible Audio Voice Coach (Clean, Non-Intrusive) */}
      {showVoiceCoach && (
        <div className="animate-fadeIn">
          <AIVoiceCoachWidget
            currentQuestion={currentQuestion}
            language={language}
            moduleTitle={module.title[language] || module.title.en}
            autoReadDefault={false}
          />
        </div>
      )}

      {/* 4. Question Prompt Card (Spacious, Clear Typographic Presence) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
            {currentQuestion.type === 'mcq' 
              ? (language === 'sat' ? 'ᱵᱟᱪᱷᱟᱣ ᱠᱩᱠᱞᱤ (Multiple Choice)' : language === 'hi' ? 'बहुविकल्पीय प्रश्न (Multiple Choice)' : 'Multiple Choice Safety Assessment') 
              : (language === 'sat' ? 'ᱥᱟᱡᱟᱣ ᱠᱩᱠᱞᱤ (Sequential Order)' : language === 'hi' ? 'क्रम निर्धारण (Procedure Sequence)' : 'Emergency Response Sequence')}
          </span>

          <button
            onClick={handleSpeakQuestion}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl text-orange-700 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-sm"
            title="Read question aloud"
          >
            <Volume2 className="w-4 h-4 text-orange-600" />
            <span className="hidden sm:inline">
              {language === 'hi' ? 'प्रश्न सुनें' : 'Listen'}
            </span>
          </button>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
          {currentQuestion.prompt[language] || currentQuestion.prompt.en}
        </h3>
      </div>

      {/* 5. Options Area (Generous Padding, High Contrast, Distinct States) */}
      {currentQuestion.type === 'mcq' && currentQuestion.options && (
        <div className="space-y-3.5">
          {currentQuestion.options.map((opt, optIdx) => {
            const isSelected = selectedAnswers[currentQuestion.id] === opt.id;
            const letterLabel = ['A', 'B', 'C', 'D'][optIdx] || `${optIdx + 1}`;
            const optText = opt.text[language] || opt.text.en;
            const prefix = language === 'hi' ? `विकल्प ${letterLabel}` : `Option ${letterLabel}`;

            return (
              <div
                key={opt.id}
                onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-orange-50/70 border-orange-500 shadow-md ring-2 ring-orange-500/20 text-slate-900'
                    : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/40 text-slate-800 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <span
                    className={`w-9 h-9 rounded-xl text-sm font-bold flex items-center justify-center shrink-0 transition-all ${
                      isSelected 
                        ? 'bg-orange-500 text-white shadow-sm' 
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {letterLabel}
                  </span>
                  <span className="text-sm sm:text-base font-medium leading-relaxed">
                    {optText}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeakOption(prefix, optText);
                    }}
                    className="p-2 bg-slate-100 hover:bg-orange-100 text-slate-500 hover:text-orange-600 rounded-xl border border-slate-200 transition-colors"
                    title="Listen to option"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected 
                        ? 'border-orange-500 bg-orange-500 text-white shadow-sm' 
                        : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 6. Sequence Questions (Spacious, Clear Step Order) */}
      {currentQuestion.type === 'sequence' && currentQuestion.sequenceItems && (
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs sm:text-sm text-slate-700 flex items-center gap-2">
            <span className="font-bold text-slate-900">
              {language === 'hi' ? 'निर्देश:' : 'Instructions:'}
            </span>
            <span>
              {language === 'hi'
                ? 'सुरक्षा मानकों के अनुसार इन चरणों को सही क्रम में व्यवस्थित करने के लिए ऊपर या नीचे तीर का उपयोग करें।'
                : 'Arrange the emergency response steps in the exact chronological sequence mandated by safety protocols.'}
            </span>
          </div>

          <div className="space-y-3">
            {(sequenceOrders[currentQuestion.id] || currentQuestion.sequenceItems.map(i => i.id)).map((itemId, idx) => {
              const itemData = currentQuestion.sequenceItems?.find(i => i.id === itemId);
              if (!itemData) return null;
              const itemText = itemData.text[language] || itemData.text.en;
              const stepPrefix = language === 'hi' ? `चरण ${idx + 1}` : `Step ${idx + 1}`;

              return (
                <div
                  key={itemId}
                  className="bg-white border-2 border-slate-200/90 p-4 sm:p-5 rounded-2xl flex items-center justify-between gap-4 text-sm text-slate-800 shadow-sm"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span className="w-8 h-8 rounded-xl bg-orange-100 border border-orange-200 text-orange-800 font-black text-sm flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-sm sm:text-base leading-relaxed">
                      {itemText}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSpeakOption(stepPrefix, itemText)}
                      className="p-2 bg-slate-100 hover:bg-orange-100 text-slate-600 hover:text-orange-600 rounded-xl border border-slate-200 transition-colors mr-1"
                      title="Listen"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    <button
                      disabled={idx === 0}
                      onClick={() => handleShiftSequence(currentQuestion.id, idx, 'up')}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 rounded-xl text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-1 transition-all"
                      title="Move up"
                    >
                      <ChevronUp className="w-4 h-4" />
                      <span className="hidden sm:inline">Up</span>
                    </button>
                    <button
                      disabled={idx === currentQuestion.sequenceItems!.length - 1}
                      onClick={() => handleShiftSequence(currentQuestion.id, idx, 'down')}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 rounded-xl text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-1 transition-all"
                      title="Move down"
                    >
                      <ChevronDown className="w-4 h-4" />
                      <span className="hidden sm:inline">Down</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. Navigation & Submission Controls (Spacious, Clear Hierarchy) */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200 gap-4 flex-wrap">
        <button
          onClick={() => {
            audioAssistant.stopSpeaking();
            setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
          }}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-30 text-xs sm:text-sm font-bold uppercase transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'hi' ? 'पिछला प्रश्न' : 'Previous'}</span>
        </button>

        <div className="flex items-center gap-3 ml-auto">
          {isLastQuestion ? (
            <button
              id="btn-submit-assessment-stage"
              onClick={handleGradeAndSubmit}
              className="flex items-center gap-2.5 px-7 py-3.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs sm:text-sm uppercase tracking-tight rounded-2xl shadow-lg transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'hi' ? 'परीक्षा जमा करें व परिणाम देखें' : 'Submit Exam & Review Mistakes'}</span>
            </button>
          ) : (
            <button
              onClick={() => {
                audioAssistant.stopSpeaking();
                setCurrentQuestionIndex(prev => prev + 1);
              }}
              className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm uppercase tracking-tight rounded-2xl transition-all active:scale-95 cursor-pointer shadow-md"
            >
              <span>{language === 'hi' ? 'अगला प्रश्न' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
