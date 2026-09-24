import React from 'react';
import { 
  CheckCircle2, Lock, BookOpen, FileQuestion, 
  AlertCircle, Award, ChevronRight 
} from 'lucide-react';
import { ModuleFlowStage, ModuleProgressRecord, Language } from '../../types';
import { PASS_THRESHOLD } from '../../utils/constants';

interface ModuleFlowStepperProps {
  currentStage: ModuleFlowStage;
  progress: ModuleProgressRecord;
  language: Language;
  onSelectStage: (stage: ModuleFlowStage) => void;
}

export const ModuleFlowStepper: React.FC<ModuleFlowStepperProps> = ({
  currentStage,
  progress,
  language,
  onSelectStage,
}) => {
  const stepsCompleted = progress.completedStepIndices.length;
  const totalSteps = progress.totalStepsCount || 5;
  const isTrainingComplete = progress.trainingCompleted;
  const isTestAttempted = progress.testAttempts > 0;
  const isPassed = progress.passed && (progress.bestScore >= PASS_THRESHOLD);

  const stages: Array<{
    id: ModuleFlowStage;
    label: { en: string; hi: string; sat: string };
    shortBadge?: string;
    isLocked: boolean;
    isCompleted: boolean;
    lockReason?: { en: string; hi: string; sat: string };
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      id: 'training',
      label: {
        en: '1. Training',
        hi: '1. प्रशिक्षण',
        sat: '1. ᱴᱨᱮᱱᱤᱝ'
      },
      shortBadge: `${stepsCompleted}/${totalSteps} ${language === 'hi' ? 'चरण' : language === 'sat' ? 'ᱫᱷᱟᱯ' : 'steps'}`,
      isLocked: false,
      isCompleted: isTrainingComplete,
      icon: BookOpen
    },
    {
      id: 'test',
      label: {
        en: '2. Safety Test',
        hi: '2. सुरक्षा परीक्षा',
        sat: '2. ᱯᱚᱨᱤᱠᱷᱟ'
      },
      shortBadge: isTestAttempted ? `${progress.bestScore}%` : undefined,
      isLocked: !isTrainingComplete,
      isCompleted: isTestAttempted,
      lockReason: {
        en: 'Complete all training steps to unlock test',
        hi: 'परीक्षा खोलने के लिए सभी प्रशिक्षण चरण पूरे करें',
        sat: 'ᱯᱚᱨᱤᱠᱷᱟ ᱡᱷᱤᱡ ᱞᱟᱹᱜᱤᱫ ᱡᱚᱛᱚ ᱴᱨᱮᱱᱤᱝ ᱢᱩᱪᱟᱹᱫ ᱢᱮ'
      },
      icon: FileQuestion
    },
    {
      id: 'results',
      label: {
        en: '3. Results & Mistakes',
        hi: '3. परिणाम व समीक्षा',
        sat: '3. ᱚᱨᱡᱚ ᱟᱨ ᱥᱩᱫᱷᱟᱹᱨ'
      },
      shortBadge: isTestAttempted ? (isPassed ? 'PASS' : 'FAIL') : undefined,
      isLocked: !isTestAttempted,
      isCompleted: isTestAttempted,
      lockReason: {
        en: 'Submit safety test to view results & review mistakes',
        hi: 'गलतियाँ और परिणाम देखने के लिए परीक्षा जमा करें',
        sat: 'ᱚᱨᱡᱚ ᱧᱮᱞ ᱞᱟᱹᱜᱤᱫ ᱯᱚᱨᱤᱠᱷᱟ ᱮᱢ ᱢᱮ'
      },
      icon: AlertCircle
    },
    {
      id: 'certificate',
      label: {
        en: '4. Certificate',
        hi: '4. डिजिटल प्रमाणपत्र',
        sat: '4. ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ'
      },
      shortBadge: isPassed ? 'VERIFIED' : undefined,
      isLocked: !isPassed,
      isCompleted: isPassed,
      lockReason: {
        en: `Score ≥${PASS_THRESHOLD}% required to unlock certificate`,
        hi: `प्रमाणपत्र हेतु न्यूनतम ${PASS_THRESHOLD}% अंक आवश्यक हैं`,
        sat: `ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱞᱟᱹᱜᱤᱫ ${PASS_THRESHOLD}% ᱞᱟᱹᱠᱛᱤᱭᱟ`
      },
      icon: Award
    }
  ];

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 px-3 sm:px-6 py-1.5 shadow-sm shrink-0">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-1 sm:gap-2.5 overflow-x-auto no-scrollbar py-0.5">
        {stages.map((stage, idx) => {
          const isActive = currentStage === stage.id;
          const Icon = stage.icon;

          return (
            <React.Fragment key={stage.id}>
              {idx > 0 && (
                <div className="hidden xs:flex items-center text-slate-600 shrink-0">
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              )}

              <button
                id={`stepper-btn-${stage.id}`}
                disabled={stage.isLocked}
                onClick={() => !stage.isLocked && onSelectStage(stage.id)}
                title={stage.isLocked ? stage.lockReason?.[language] : undefined}
                className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all select-none shrink-0 ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-sm ring-2 ring-orange-400/40'
                    : stage.isLocked
                    ? 'opacity-40 text-slate-400 cursor-not-allowed bg-slate-800/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800 bg-slate-800/80 cursor-pointer'
                }`}
              >
                {/* Status Indicator Icon */}
                {stage.isLocked ? (
                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                ) : stage.isCompleted && !isActive ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                )}

                <span className="font-bold text-[11px] sm:text-xs">
                  {stage.label[language] || stage.label.en}
                </span>

                {stage.shortBadge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : stage.isCompleted
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {stage.shortBadge}
                  </span>
                )}
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
