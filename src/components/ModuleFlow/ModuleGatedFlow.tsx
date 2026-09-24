import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  SafetyModule, Language, WorkerProfile, CertificateRecord, 
  ModuleFlowStage, ModuleProgressRecord, MistakeReviewItem 
} from '../../types';
import { offlineStorage } from '../../utils/offlineStorage';
import { audioAssistant } from '../../utils/audioAssistant';
import { haptics } from '../../utils/haptics';
import { PASS_THRESHOLD } from '../../utils/constants';

// Subcomponents
import { ModuleFlowStepper } from './ModuleFlowStepper';
import { ModuleTestStage } from './ModuleTestStage';
import { ResultsReviewScreen } from './ResultsReviewScreen';
import { CertificateScreen } from './CertificateScreen';

// AR Components
import { ARCameraFeed } from '../ARView/ARCameraFeed';
import { ARHUD } from '../ARView/ARHUD';
import { FireSafetyScenario } from '../ARView/FireSafetyScenario';
import { GasLeakScenario } from '../ARView/GasLeakScenario';
import { MachinerySafetyScenario } from '../ARView/MachinerySafetyScenario';
import { HeightSafetyScenario } from '../ARView/HeightSafetyScenario';
import { ElectricalArcScenario } from '../ARView/ElectricalArcScenario';

interface ModuleGatedFlowProps {
  module: SafetyModule;
  worker: WorkerProfile;
  language: Language;
  onExit: () => void;
  onCertificateIssued: (cert: CertificateRecord) => void;
  onVerifyInAdmin?: (certId: string) => void;
}

export const ModuleGatedFlow: React.FC<ModuleGatedFlowProps> = ({
  module,
  worker,
  language,
  onExit,
  onCertificateIssued,
  onVerifyInAdmin,
}) => {
  // 1. Initial State from offlineStorage
  const [progress, setProgress] = useState<ModuleProgressRecord>(() => {
    return offlineStorage.getModuleProgress(worker.id, module.id, module.steps.length);
  });

  // Re-fetch progress if worker or module changes, or when storage updates
  useEffect(() => {
    const current = offlineStorage.getModuleProgress(worker.id, module.id, module.steps.length);
    setProgress(current);

    const unsubscribe = offlineStorage.subscribe(() => {
      const updated = offlineStorage.getModuleProgress(worker.id, module.id, module.steps.length);
      setProgress(updated);
    });
    return unsubscribe;
  }, [worker.id, module.id, module.steps.length]);

  // Determine starting stage:
  // - If already passed: go directly to certificate stage (no re-training forced)
  // - If test already taken and has mistakes/results: go to results or training
  // - Otherwise: start at training
  const [currentStage, setCurrentStage] = useState<ModuleFlowStage>(() => {
    const initial = offlineStorage.getModuleProgress(worker.id, module.id, module.steps.length);
    if (initial.passed && initial.bestScore >= PASS_THRESHOLD) {
      return 'certificate';
    }
    return 'training';
  });

  // AR Training internal state
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [stepCompleted, setStepCompleted] = useState<boolean>(false);
  const [isPlaneLocked, setIsPlaneLocked] = useState<boolean>(false);
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(true);
  const [safetyPoints, setSafetyPoints] = useState<number>(0);
  const [hudFeedback, setHudFeedback] = useState<{
    type: 'success' | 'warning' | 'error';
    message: string;
  } | null>(null);

  // Latest test submission state for Results screen
  const [lastTestResult, setLastTestResult] = useState<{
    score: number;
    passed: boolean;
    correctCount: number;
    mistakes: MistakeReviewItem[];
    timeTakenSeconds?: number;
  } | null>(() => {
    if (progress.lastScore !== undefined) {
      const mistakes = progress.lastMistakes || [];
      const totalQ = module.assessmentQuestions.length;
      const incorrectQ = mistakes.length;
      return {
        score: progress.lastScore,
        passed: progress.lastScore >= PASS_THRESHOLD,
        correctCount: Math.max(0, totalQ - incorrectQ),
        mistakes
      };
    }
    return null;
  });

  // Sync test result whenever progress gets updated with a score
  useEffect(() => {
    if (progress.lastScore !== undefined) {
      const mistakes = progress.lastMistakes || [];
      const totalQ = module.assessmentQuestions.length;
      const incorrectQ = mistakes.length;
      setLastTestResult({
        score: progress.lastScore,
        passed: progress.lastScore >= PASS_THRESHOLD,
        correctCount: Math.max(0, totalQ - incorrectQ),
        mistakes
      });
    }
  }, [progress.lastScore, progress.lastMistakes, module.assessmentQuestions.length]);

  const isInternalHashChangeRef = useRef<boolean>(false);

  // Sync with Hash Route and guard against unauthorized stage jumping
  useEffect(() => {
    const handleHashChange = () => {
      if (isInternalHashChangeRef.current) {
        isInternalHashChangeRef.current = false;
        return;
      }
      const hash = window.location.hash;
      const match = hash.match(/stage=(training|test|results|certificate)/);
      if (match && match[1]) {
        const targetStage = match[1] as ModuleFlowStage;
        handleSelectStage(targetStage);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Set initial hash without loop
    isInternalHashChangeRef.current = true;
    window.location.hash = `module=${module.id}&stage=${currentStage}`;

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [module.id]);

  // Stage Switch Handler with Strict Route & Gating Guard
  const handleSelectStage = (targetStage: ModuleFlowStage) => {
    // Guard 1: Cannot access Test if training is not complete
    if (targetStage === 'test' && !progress.trainingCompleted) {
      haptics.trigger('warning');
      setHudFeedback({
        type: 'warning',
        message: language === 'hi' 
          ? 'सुरक्षा परीक्षा केवल प्रशिक्षण पूरा होने के बाद ही खुलेगी।' 
          : 'Complete all practical AR training steps to unlock this exam.'
      });
      setCurrentStage('training');
      isInternalHashChangeRef.current = true;
      window.location.hash = `module=${module.id}&stage=training`;
      return;
    }

    // Guard 2: Cannot access Results if no test has been submitted
    if (targetStage === 'results' && progress.testAttempts === 0 && !lastTestResult) {
      haptics.trigger('warning');
      return;
    }

    // Guard 3: Cannot access Certificate if not passed
    if (targetStage === 'certificate' && (!progress.passed || progress.bestScore < PASS_THRESHOLD)) {
      haptics.trigger('warning');
      return;
    }

    haptics.trigger('tap');
    setCurrentStage(targetStage);
    isInternalHashChangeRef.current = true;
    window.location.hash = `module=${module.id}&stage=${targetStage}`;
  };

  // Feedback & Points in AR
  const handleAwardPoints = useCallback((points: number, reason: string) => {
    setSafetyPoints(prev => prev + points);
    setHudFeedback({ type: 'success', message: reason });
    haptics.trigger('success');
    setTimeout(() => setHudFeedback(null), 3200);
  }, []);

  const handleIncorrectAction = useCallback((reason: string) => {
    setHudFeedback({ type: 'warning', message: reason });
    haptics.trigger('warning');
    setTimeout(() => setHudFeedback(null), 4000);
  }, []);

  // Step Completion in AR Training
  const handleARStepComplete = useCallback(() => {
    haptics.trigger('success');
    setStepCompleted(true);

    // Save step progress in offlineStorage
    const updated = offlineStorage.markStepCompleted(
      worker.id,
      module.id,
      currentStepIndex,
      module.steps.length
    );
    setProgress(updated);
  }, [worker.id, module.id, currentStepIndex, module.steps.length]);

  // Advance to Next Step in AR Training
  const handleProceedNextStep = () => {
    // Record current step as complete in case not already
    const updated = offlineStorage.markStepCompleted(
      worker.id,
      module.id,
      currentStepIndex,
      module.steps.length
    );
    setProgress(updated);

    if (currentStepIndex + 1 < module.steps.length) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      setStepCompleted(false);
      haptics.trigger('step');

      const nextStep = module.steps[nextIndex];
      if (nextStep && isVoiceActive) {
        const prompt = nextStep.audioPrompt[language] || nextStep.instruction[language];
        audioAssistant.speak(prompt, language);
      }
    } else {
      // Completed the final step of training!
      haptics.trigger('success');
      // Mark training fully complete
      const finalProgress = {
        ...updated,
        trainingCompleted: true
      };
      offlineStorage.saveModuleProgress(finalProgress);
      setProgress(finalProgress);

      audioAssistant.playSuccessChime();
      const congratsSpeech = language === 'hi'
        ? 'बधाई! आपने व्यावहारिक प्रशिक्षण पूरा कर लिया है। अब आप सुरक्षा परीक्षा के लिए तैयार हैं।'
        : language === 'sat'
        ? 'ᱥᱟᱨᱦᱟᱣ! ᱴᱨᱮᱱᱤᱝ ᱢᱩᱪᱟᱹᱫ ᱮᱱᱟ᱾ ᱱᱤᱛᱚᱜ ᱯᱚᱨᱤᱠᱷᱟ ᱮᱢ ᱢᱮ᱾'
        : 'Congratulations! You have completed all training steps. The safety assessment is now unlocked.';
      audioAssistant.speak(congratsSpeech, language);

      // Automatically advance to Stage 2: Test!
      setCurrentStage('test');
      isInternalHashChangeRef.current = true;
      window.location.hash = `module=${module.id}&stage=test`;
    }
  };

  // Submit test from Stage 2
  const handleTestSubmit = (
    score: number,
    passed: boolean,
    correctCount: number,
    mistakes: MistakeReviewItem[],
    cert?: CertificateRecord
  ) => {
    // 1. Record test result in offlineStorage
    const updated = offlineStorage.recordTestResult(
      worker.id,
      module.id,
      score,
      passed,
      mistakes,
      cert?.certificateId,
      cert?.date
    );
    setProgress(updated);

    // 2. If certificate issued, save to certificates storage
    if (passed && cert) {
      offlineStorage.saveCertificate(cert);
      onCertificateIssued(cert);
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }

    // 3. Set last test result state
    setLastTestResult({
      score,
      passed,
      correctCount,
      mistakes,
      timeTakenSeconds: 50
    });

    // 4. Always advance to Stage 3: Results & Mistakes Review!
    haptics.trigger(passed ? 'success' : 'error');
    setCurrentStage('results');
    isInternalHashChangeRef.current = true;
    window.location.hash = `module=${module.id}&stage=results`;
  };

  // Retrieve current certificate for Stage 4
  const currentCertificate = 
    offlineStorage.getCertificates().find(c => c.workerId === worker.id && c.moduleKey === module.id) ||
    (progress.certificateId ? {
      certificateId: progress.certificateId,
      workerId: worker.id,
      workerName: worker.name,
      moduleKey: module.id,
      moduleName: module.title[language] || module.title.en,
      score: progress.bestScore,
      date: progress.certificateDate || '23-Aug-2026',
      expiryDate: '23-Aug-2027',
      status: 'Valid' as const,
      language: language === 'sat' ? 'Santali' : language === 'hi' ? 'Hindi' : 'English',
      organization: worker.facility || 'Eastern Coalfields & Heavy Industries Ltd.',
      complianceStandard: 'DGMS / OSHA 1910 Compliance Framework',
      synced: false,
      workerIdPhotoUrl: worker.idPhotoUrl,
      idVerified: worker.idVerified ?? true,
    } : null);

  return (
    <div className="flex-1 min-h-0 flex flex-col w-full h-full bg-slate-950 select-none overflow-hidden">
      {/* 1. TOP PROGRESS STEPPER (Gated Flow: Training -> Test -> Results -> Certificate) */}
      <ModuleFlowStepper
        currentStage={currentStage}
        progress={progress}
        language={language}
        onSelectStage={handleSelectStage}
      />

      {/* 2. STAGE VIEWS */}
      <div className="flex-1 min-h-0 flex flex-col relative w-full h-full overflow-hidden">
        {currentStage === 'training' ? (
          /* STAGE 1: PRACTICAL AR TRAINING */
          <div className="relative flex-1 min-h-0 w-full h-full bg-black overflow-hidden flex flex-col">
            <ARCameraFeed
              language={language}
              isPlaneLocked={isPlaneLocked}
              onPlaneLockChange={setIsPlaneLocked}
              scenarioType={
                module.id === 'fire_explosion'
                  ? 'fire'
                  : module.id === 'gas_confined_space'
                  ? 'gas'
                  : module.id === 'machinery_safety'
                  ? 'machinery'
                  : module.id === 'ppe_hazard'
                  ? 'height'
                  : 'electrical'
              }
            >
              {/* Dynamic AR Scenario Rendering */}
              {module.id === 'fire_explosion' && (
                <FireSafetyScenario
                  stepIndex={currentStepIndex}
                  language={language}
                  onStepComplete={handleARStepComplete}
                  isPlaneLocked={isPlaneLocked}
                  onAwardPoints={handleAwardPoints}
                  onIncorrectAction={handleIncorrectAction}
                />
              )}
              {module.id === 'gas_confined_space' && (
                <GasLeakScenario
                  stepIndex={currentStepIndex}
                  language={language}
                  onStepComplete={handleARStepComplete}
                  isPlaneLocked={isPlaneLocked}
                  onAwardPoints={handleAwardPoints}
                  onIncorrectAction={handleIncorrectAction}
                />
              )}
              {module.id === 'machinery_safety' && (
                <MachinerySafetyScenario
                  stepIndex={currentStepIndex}
                  language={language}
                  onStepComplete={handleARStepComplete}
                  isPlaneLocked={isPlaneLocked}
                />
              )}
              {module.id === 'ppe_hazard' && (
                <HeightSafetyScenario
                  stepIndex={currentStepIndex}
                  language={language}
                  onStepComplete={handleARStepComplete}
                  isPlaneLocked={isPlaneLocked}
                />
              )}
              {module.id === 'first_aid' && (
                <ElectricalArcScenario
                  stepIndex={currentStepIndex}
                  language={language}
                  onStepComplete={handleARStepComplete}
                  isPlaneLocked={isPlaneLocked}
                />
              )}
            </ARCameraFeed>

            {/* AR Top & Bottom HUD Controls */}
            <ARHUD
              currentStep={module.steps[currentStepIndex]}
              totalSteps={module.steps.length}
              currentStepIndex={currentStepIndex}
              language={language}
              onExit={onExit}
              onNextStep={handleProceedNextStep}
              canProceed={stepCompleted || progress.completedStepIndices.includes(currentStepIndex)}
              isPlaneLocked={isPlaneLocked}
              onReAnchor={() => setIsPlaneLocked(false)}
              isVoiceActive={isVoiceActive}
              onToggleVoice={() => setIsVoiceActive(!isVoiceActive)}
              safetyPoints={safetyPoints}
              moduleTitle={module.title[language] || module.title.en}
              feedback={hudFeedback}
            />
          </div>
        ) : currentStage === 'test' ? (
          /* STAGE 2: SAFETY ASSESSMENT / TEST (Gated on Training Completion) */
          <div className="flex-1 py-8 px-3 sm:px-6 overflow-y-auto bg-[#F8FAFC]">
            <ModuleTestStage
              module={module}
              worker={worker}
              language={language}
              isTrainingComplete={progress.trainingCompleted}
              completedStepsCount={progress.completedStepIndices.length}
              totalStepsCount={module.steps.length}
              onGoToTraining={() => handleSelectStage('training')}
              onSubmitTest={handleTestSubmit}
            />
          </div>
        ) : currentStage === 'results' ? (
          /* STAGE 3: RESULTS + MISTAKES REVIEW */
          <div className="flex-1 py-8 px-3 sm:px-6 overflow-y-auto bg-[#F8FAFC]">
            {lastTestResult ? (
              <ResultsReviewScreen
                module={module}
                worker={worker}
                language={language}
                score={lastTestResult.score}
                totalQuestions={module.assessmentQuestions.length}
                correctCount={lastTestResult.correctCount}
                timeTakenSeconds={lastTestResult.timeTakenSeconds}
                mistakes={lastTestResult.mistakes}
                allQuestionsCount={module.assessmentQuestions.length}
                onProceedToCertificate={() => handleSelectStage('certificate')}
                onRetakeTest={() => {
                  offlineStorage.resetModuleTestAttempt(worker.id, module.id);
                  handleSelectStage('test');
                }}
                onReviewTraining={() => handleSelectStage('training')}
              />
            ) : (
              <div className="text-center py-12 text-slate-500">
                <p>No assessment result recorded yet.</p>
                <button
                  onClick={() => handleSelectStage('test')}
                  className="mt-3 px-4 py-2 bg-orange-500 text-white rounded-lg text-xs font-bold"
                >
                  Take Test
                </button>
              </div>
            )}
          </div>
        ) : (
          /* STAGE 4: CERTIFICATE GENERATION & WALLET DOWNLOAD */
          <div className="flex-1 py-6 px-3 sm:px-6 overflow-y-auto">
            {currentCertificate ? (
              <CertificateScreen
                certificate={currentCertificate}
                worker={worker}
                language={language}
                onRetakeTest={() => {
                  offlineStorage.resetModuleTestAttempt(worker.id, module.id);
                  handleSelectStage('test');
                }}
                onReviewTraining={() => handleSelectStage('training')}
                onVerifyInAdmin={() => {
                  if (onVerifyInAdmin && currentCertificate) {
                    onVerifyInAdmin(currentCertificate.certificateId);
                  }
                }}
              />
            ) : (
              <div className="text-center py-12 text-slate-500">
                <p>Certificate not issued yet. Pass the assessment with score ≥ {PASS_THRESHOLD}% to receive your certified credential.</p>
                <button
                  onClick={() => handleSelectStage('test')}
                  className="mt-3 px-4 py-2 bg-orange-500 text-white rounded-lg text-xs font-bold"
                >
                  Take Test
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
