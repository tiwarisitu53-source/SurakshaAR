import React, { useState } from 'react';
import { 
  ShieldCheck, ShieldAlert, Award, RotateCcw, 
  BookOpen, ChevronDown, ChevronUp, CheckCircle2, 
  XCircle, AlertTriangle, ArrowRight, HelpCircle 
} from 'lucide-react';
import { SafetyModule, WorkerProfile, Language, MistakeReviewItem } from '../../types';
import { PASS_THRESHOLD } from '../../utils/constants';

interface ResultsReviewScreenProps {
  module: SafetyModule;
  worker: WorkerProfile;
  language: Language;
  score: number;
  totalQuestions: number;
  correctCount: number;
  timeTakenSeconds?: number;
  mistakes: MistakeReviewItem[];
  allQuestionsCount: number;
  onProceedToCertificate: () => void;
  onRetakeTest: () => void;
  onReviewTraining: () => void;
}

export const ResultsReviewScreen: React.FC<ResultsReviewScreenProps> = ({
  module,
  worker,
  language,
  score,
  totalQuestions,
  correctCount,
  timeTakenSeconds = 45,
  mistakes,
  allQuestionsCount,
  onProceedToCertificate,
  onRetakeTest,
  onReviewTraining,
}) => {
  const isPassed = score >= PASS_THRESHOLD;
  const incorrectCount = mistakes.length;
  const [showAllCorrect, setShowAllCorrect] = useState<boolean>(false);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 flex flex-col gap-6 animate-fadeIn">
      {/* 1. Primary Verdict Banner */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border-2 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md ${
          isPassed
            ? 'bg-gradient-to-br from-emerald-50 to-white border-emerald-400'
            : 'bg-gradient-to-br from-red-50 to-white border-red-300'
        }`}
      >
        <div className="flex items-center gap-5 text-center sm:text-left flex-col sm:flex-row">
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
              isPassed
                ? 'bg-emerald-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {isPassed ? (
              <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12" />
            ) : (
              <ShieldAlert className="w-10 h-10 sm:w-12 sm:h-12" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
              <span
                className={`text-xs font-black uppercase tracking-wider px-3 py-0.5 rounded-full ${
                  isPassed
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-red-100 text-red-800 border border-red-300'
                }`}
              >
                {isPassed
                  ? (language === 'hi' ? 'उत्तीर्ण • DGMS अनुपालन प्रमाणित' : language === 'sat' ? 'ᱯᱟᱥ ᱮᱱᱟ • DGMS ᱥᱟᱹᱠᱷᱤᱭᱟᱹᱛ' : 'PASSED • DGMS COMPLIANT')
                  : (language === 'hi' ? 'अनुत्तीर्ण • पुनः परीक्षा आवश्यक' : language === 'sat' ? 'ᱵᱟᱝ ᱯᱟᱥ ᱞᱮᱱᱟ • ᱫᱚᱲᱦᱟ ᱪᱮᱥᱴᱟ' : 'MINIMUM THRESHOLD NOT MET')}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Req: ≥{PASS_THRESHOLD}%
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              {isPassed ? (
                <>
                  {language === 'hi' ? `बधाई हो, ${worker.name}!` : language === 'sat' ? `ᱥᱟᱨᱦᱟᱣ, ${worker.name}!` : `Congratulations, ${worker.name}!`}
                </>
              ) : (
                <>
                  {language === 'hi' ? 'पुनः अध्ययन एवं परीक्षा आवश्यक' : language === 'sat' ? 'ᱟᱨᱢᱤᱫᱷᱟᱣ ᱪᱮᱥᱴᱟᱭ ᱢᱮ' : 'Assessment Threshold Unreached'}
                </>
              )}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg leading-relaxed">
              {isPassed
                ? (language === 'hi'
                    ? `आपने ${score}% अंक हासिल कर परीक्षा पास कर ली है। आपका डिजिटल प्रमाणपत्र तैयार है।`
                    : language === 'sat'
                    ? `ᱟᱢ ᱫᱚ ${score}% ᱱᱚᱢᱵᱚᱨ ᱧᱟᱢ ᱠᱟᱛᱮ ᱯᱟᱥ ᱮᱱᱟᱢ᱾ ᱟᱢᱟᱜ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱛᱮᱭᱟᱨ ᱮᱱᱟ᱾`
                    : `You achieved a certified score of ${score}%. Your tamper-proof safety certificate is now issued.`)
                : (language === 'hi'
                    ? `खनन सुरक्षा विनियमों के तहत न्यूनतम ${PASS_THRESHOLD}% अंक अनिवार्य हैं। नीचे दी गई अपनी गलतियों की समीक्षा करें और दोबारा परीक्षा दें।`
                    : language === 'sat'
                    ? `ᱠᱷᱟᱫᱟᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱞᱟᱹᱜᱤᱫ ${PASS_THRESHOLD}% ᱞᱟᱹᱠᱛᱤᱭᱟ᱾ ᱞᱟᱛᱟᱨ ᱨᱮ ᱵᱷᱩᱞ ᱠᱩᱠᱞᱤ ᱠᱚ ᱧᱮᱞ ᱢᱮ ᱟᱨ ᱟᱨᱢᱤᱫᱷᱟᱣ ᱯᱚᱨᱤᱠᱷᱟ ᱮᱢ ᱢᱮ᱾`
                    : `Under DGMS standards, minimum ${PASS_THRESHOLD}% is required for safety certification. Review your mistakes below and retake the test.`)}
            </p>
          </div>
        </div>

        {/* Big Score Pill */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 sm:p-5 text-center shrink-0 min-w-[140px] shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            {language === 'hi' ? 'प्राप्तांक' : language === 'sat' ? 'ᱱᱚᱢᱵᱚᱨ' : 'FINAL SCORE'}
          </span>
          <span
            className={`text-4xl sm:text-5xl font-black block my-0.5 ${
              isPassed ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {score}%
          </span>
          <span className="text-xs font-semibold text-slate-500">
            {correctCount} / {totalQuestions} {language === 'hi' ? 'सही उत्तर' : 'Correct'}
          </span>
        </div>
      </div>

      {/* 2. Key Action CTAs */}
      <div className="flex items-center justify-between gap-3 flex-wrap bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            id="btn-results-review-training"
            onClick={onReviewTraining}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold uppercase tracking-tight rounded-xl transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-orange-500" />
            <span>{language === 'hi' ? 'प्रशिक्षण पुनः देखें' : language === 'sat' ? 'ᱴᱨᱮᱱᱤᱝ ᱟᱨᱦᱚᱸ ᱧᱮᱞ' : 'Review Training'}</span>
          </button>

          <button
            id="btn-results-retake-test"
            onClick={onRetakeTest}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs sm:text-sm font-bold uppercase tracking-tight rounded-xl transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-orange-400" />
            <span>{language === 'hi' ? 'परीक्षा दोबारा दें' : language === 'sat' ? 'ᱫᱚᱲᱦᱟ ᱯᱚᱨᱤᱠᱷᱟ' : 'Retake Test'}</span>
          </button>
        </div>

        {isPassed ? (
          <button
            id="btn-results-proceed-certificate"
            onClick={onProceedToCertificate}
            className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-black uppercase tracking-tight rounded-xl shadow-md transition-all active:scale-95 cursor-pointer ml-auto"
          >
            <Award className="w-4 h-4 text-white" />
            <span>{language === 'hi' ? 'डिजिटल प्रमाणपत्र देखें →' : language === 'sat' ? 'ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱧᱮᱞ ᱢᱮ →' : 'View & Download Certificate →'}</span>
          </button>
        ) : (
          <div className="text-xs text-red-600 font-bold flex items-center gap-1.5 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? `प्रमाणपत्र अनलॉक करने हेतु ${PASS_THRESHOLD}% आवश्यक` : `Score ≥${PASS_THRESHOLD}% to unlock certificate`}</span>
          </div>
        )}
      </div>

      {/* 3. VISUALLY PROMINENT MISTAKES REVIEW SECTION */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2 pt-2">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <span>
                {language === 'hi' ? 'गलतियों की विस्तृत समीक्षा (Mistakes Review)' : language === 'sat' ? 'ᱵᱷᱩᱞ ᱠᱩᱠᱞᱤ ᱠᱚ (Mistakes)' : 'Mistakes Review'}
              </span>
              <span className="text-xs font-black bg-red-100 text-red-700 px-2 py-0.5 rounded-full border border-red-300">
                {incorrectCount} {incorrectCount === 1 ? 'Error' : 'Errors'}
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'hi'
                ? 'औद्योगिक दुर्घटनाओं से बचाव के लिए इन सुरक्षा नियमों को ध्यानपूर्वक समझें।'
                : 'Understand critical safety rationales to avoid industrial mine hazards.'}
            </p>
          </div>
        </div>

        {/* Mistakes List */}
        {mistakes.length > 0 ? (
          <div className="space-y-4">
            {mistakes.map((mistake, idx) => (
              <div
                key={mistake.questionId}
                className="bg-white border-2 border-red-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3"
              >
                {/* Question Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-0.5 rounded border border-red-200 inline-block">
                      {language === 'hi' ? `गलत प्रश्न #${mistake.questionNumber}` : `Mistake #${idx + 1}`}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {mistake.prompt[language] || mistake.prompt.en}
                    </h4>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <XCircle className="w-5 h-5" />
                  </div>
                </div>

                {/* Answers Comparison Box */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {/* Worker's Selected Wrong Answer */}
                  <div className="bg-red-50/70 border border-red-200 rounded-xl p-3 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-red-700 font-bold uppercase text-[10px] tracking-wider">
                      <XCircle className="w-3.5 h-3.5 text-red-500" />
                      <span>{language === 'hi' ? 'आपका चयनित उत्तर (गलत):' : 'Your Answer (Incorrect):'}</span>
                    </div>
                    <p className="text-red-900 font-medium text-xs sm:text-sm pl-5">
                      {mistake.userAnswerText}
                    </p>
                  </div>

                  {/* Correct Safety Answer */}
                  <div className="bg-emerald-50/70 border border-emerald-300 rounded-xl p-3 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold uppercase text-[10px] tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{language === 'hi' ? 'सही सुरक्षा उत्तर:' : 'Correct Safety Procedure:'}</span>
                    </div>
                    <p className="text-emerald-950 font-bold text-xs sm:text-sm pl-5">
                      {mistake.correctAnswerText}
                    </p>
                  </div>
                </div>

                {/* Safety Explanation */}
                {mistake.explanation && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 flex items-start gap-2.5">
                    <HelpCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider mb-0.5">
                        {language === 'hi' ? 'DGMS सुरक्षा निर्देश (Official Safety Rationale):' : 'DGMS Safety Directive:'}
                      </span>
                      <p className="text-slate-600 leading-relaxed font-normal">
                        {mistake.explanation[language] || mistake.explanation.en}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center text-emerald-800 space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold">
              {language === 'hi' ? 'शानदार! कोई गलती नहीं।' : 'Flawless! Zero Mistakes Recorded.'}
            </h4>
            <p className="text-xs text-emerald-700 max-w-md mx-auto">
              {language === 'hi' 
                ? 'आपने इस सुरक्षा मॉड्यूल के सभी प्रश्नों का 100% सही उत्तर दिया है।' 
                : 'You answered every assessment question correctly in this attempt.'}
            </p>
          </div>
        )}

        {/* 4. Collapsible Option to Review Correct Questions */}
        {correctCount > 0 && (
          <div className="pt-2">
            <button
              onClick={() => setShowAllCorrect(!showAllCorrect)}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              {showAllCorrect ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              <span>
                {showAllCorrect 
                  ? (language === 'hi' ? 'सही प्रश्नों को छुपाएं' : 'Hide Correct Questions') 
                  : (language === 'hi' ? `सही हल किए गए प्रश्न देखें (${correctCount})` : `Show Correctly Answered Questions (${correctCount})`)}
              </span>
            </button>

            {showAllCorrect && (
              <div className="mt-3 space-y-2.5">
                {module.assessmentQuestions.map((q, idx) => {
                  const wasMistake = mistakes.some(m => m.questionId === q.id);
                  if (wasMistake) return null; // Only show correct questions here

                  const correctText = q.type === 'sequence'
                    ? (q.sequenceItems?.slice().sort((a, b) => a.correctOrder - b.correctOrder).map(it => it.text[language] || it.text.en).join(' → ') || 'Correct sequence')
                    : (q.options?.find(o => o.isCorrect)?.text[language] || q.options?.find(o => o.isCorrect)?.text.en || 'Correct answer');

                  return (
                    <div
                      key={q.id}
                      className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-3.5 text-xs text-slate-800 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-bold text-slate-900">
                            {idx + 1}. {q.prompt[language] || q.prompt.en}
                          </span>
                        </div>
                        <p className="text-emerald-800 pl-6 text-[11px] font-medium">
                          ✓ {correctText}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Correct
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
