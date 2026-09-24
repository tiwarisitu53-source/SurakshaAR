import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, ShieldAlert, Sparkles, ArrowRight, X, Eye, AlertTriangle, Award, CheckCircle2, ChevronUp, ChevronDown, HelpCircle, Vibrate, VibrateOff, BookOpen } from 'lucide-react';
import { ARSimulationStep, Language } from '../../types';
import { translations } from '../../data/translations';
import { audioAssistant } from '../../utils/audioAssistant';
import { haptics, HapticEvent, HAPTIC_METADATA } from '../../utils/haptics';

interface ARHUDProps {
  currentStep: ARSimulationStep;
  totalSteps: number;
  currentStepIndex: number;
  language: Language;
  onExit: () => void;
  onNextStep?: () => void;
  canProceed: boolean;
  isPlaneLocked: boolean;
  onReAnchor?: () => void;
  isVoiceActive: boolean;
  onToggleVoice: () => void;
  safetyPoints?: number;
  moduleTitle?: string;
  feedback?: { type: 'correct' | 'incorrect' | 'success' | 'warning' | 'error'; message: string } | null;
}

export const ARHUD: React.FC<ARHUDProps> = ({
  currentStep,
  totalSteps,
  currentStepIndex,
  language,
  onExit,
  onNextStep,
  canProceed,
  isPlaneLocked,
  onReAnchor,
  isVoiceActive,
  onToggleVoice,
  safetyPoints = 0,
  moduleTitle,
  feedback
}) => {
  const t = translations[language];
  // Slide-in drawer state: default to closed (peek mode) so central AR animation viewport is 100% visible
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(haptics.isEnabled());
  const [activeHapticEvent, setActiveHapticEvent] = useState<HapticEvent | null>(null);

  // Subscribe to real-time safety haptics
  useEffect(() => {
    let timeoutId: any = null;
    const unsubscribe = haptics.subscribe((event) => {
      // Exclude simple basic UI taps to keep AR HUD focused on safety interactions
      if (event.pattern === 'tap') return;

      setActiveHapticEvent(event);
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setActiveHapticEvent(null);
      }, 2200);
    });

    return () => {
      unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const handleToggleDrawer = () => {
    haptics.trigger('tap');
    setIsDrawerOpen((prev) => !prev);
  };

  const handleToggleHaptics = () => {
    const nextState = haptics.toggleEnabled();
    setHapticsEnabled(nextState);
  };

  const handleSpeakCurrentStep = () => {
    haptics.trigger('tap');
    const prompt = currentStep.audioPrompt[language] || currentStep.instruction[language];
    audioAssistant.speak(prompt, language);
  };

  const handleExit = () => {
    haptics.trigger('tap');
    onExit();
  };

  const handleProceed = () => {
    haptics.trigger('step');
    if (onNextStep) onNextStep();
  };

  return (
    <div id="ar-hud-overlay" className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2 sm:p-3 z-40 select-none overflow-hidden">
      {/* Top Section: Navigation Bar & Compact Floating Instruction Banner */}
      <div className="flex flex-col gap-1.5 w-full max-w-2xl mx-auto pointer-events-auto shrink-0">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between gap-1.5 flex-wrap">
          {/* Left: Step indicator, Module badge and Exit */}
          <div className="flex items-center gap-1.5">
            <button
              id="btn-exit-ar"
              onClick={handleExit}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700 hover:border-red-500/80 rounded-xl text-slate-200 hover:text-white text-xs sm:text-sm font-bold uppercase tracking-tight transition-all shadow-lg active:scale-95 cursor-pointer"
              title={t.exitTraining}
            >
              <X className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden xs:inline">{t.exitTraining}</span>
            </button>

            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 font-bold shadow-lg">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
              <span>
                {language === 'hi'
                  ? `चरण ${currentStepIndex + 1} / ${totalSteps}`
                  : language === 'sat'
                  ? `ᱫᱷᱟᱯ ${currentStepIndex + 1} / ${totalSteps}`
                  : `Step ${currentStepIndex + 1} / ${totalSteps}`}
              </span>
            </div>

            {moduleTitle && (
              <div className="hidden sm:flex items-center px-2 py-1 bg-orange-500/20 border border-orange-500/40 rounded-xl text-[11px] font-bold text-orange-300">
                {moduleTitle}
              </div>
            )}
          </div>

          {/* Right: Safety Points, Voice Assistant & AR Surface Status */}
          <div className="flex items-center gap-1.5">
            {/* Real-time Safety Points Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/20 border border-amber-500/50 rounded-xl text-amber-300 text-xs sm:text-sm font-black shadow-lg">
              <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{safetyPoints}</span>
              <span className="text-[10px] text-amber-400/80 uppercase font-semibold">PTS</span>
            </div>

            {/* Audio read-aloud button */}
            <button
              id="btn-speak-instruction"
              onClick={handleSpeakCurrentStep}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-lg active:scale-95 cursor-pointer uppercase tracking-tight"
              title={t.voiceAssistant}
            >
              <Volume2 className="w-3.5 h-3.5 text-white" />
              <span className="hidden md:inline">{t.voiceAssistant}</span>
            </button>

            {/* Voice Mute Toggle */}
            <button
              id="btn-toggle-voice"
              onClick={() => { haptics.trigger('tap'); onToggleVoice(); }}
              className={`p-1.5 rounded-xl backdrop-blur-md border transition-all cursor-pointer ${
                isVoiceActive 
                  ? 'bg-slate-900/90 border-slate-700 text-slate-300 hover:bg-slate-800' 
                  : 'bg-red-500/90 border-red-400 text-white'
              }`}
              title={isVoiceActive ? t.audioGuideActive : t.audioGuideMute}
            >
              {isVoiceActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Haptic Tactile Feedback Toggle */}
            <button
              id="btn-toggle-haptics"
              onClick={handleToggleHaptics}
              className={`p-1.5 rounded-xl backdrop-blur-md border transition-all cursor-pointer ${
                hapticsEnabled 
                  ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 hover:bg-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                  : 'bg-slate-900/90 border-slate-700 text-slate-500 hover:bg-slate-800'
              }`}
              title={
                hapticsEnabled 
                  ? (language === 'hi' ? 'हैप्टिक कंपन सक्रिय' : language === 'sat' ? 'ᱦᱮᱯᱴᱤᱠ ᱪᱟᱹᱞᱩ' : 'Tactile Haptics Active') 
                  : (language === 'hi' ? 'हैप्टिक कंपन बंद' : language === 'sat' ? 'ᱦᱮᱯᱴᱤᱠ ᱵᱚᱸᱫᱽ' : 'Tactile Haptics Disabled')
              }
            >
              {hapticsEnabled ? <Vibrate className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> : <VibrateOff className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            {/* AR Surface status badge */}
            <div 
              onClick={() => { haptics.trigger('tap'); onReAnchor && onReAnchor(); }}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl backdrop-blur-md border text-xs font-medium cursor-pointer ${
                isPlaneLocked 
                  ? 'bg-green-950/80 border-green-700 text-green-300' 
                  : 'bg-orange-950/80 border-orange-700 text-orange-300 animate-pulse'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>{isPlaneLocked ? t.planeDetected : t.scanningSurface}</span>
            </div>
          </div>
        </div>

        {/* Top Objective Bar - Ultra-compact, triggers bottom drawer toggle */}
        <div 
          onClick={handleToggleDrawer}
          className="flex items-center justify-between px-3 py-1 bg-slate-950/85 backdrop-blur-md border border-amber-500/40 rounded-xl shadow-lg transition-all cursor-pointer hover:bg-slate-900/90 group"
          title={isDrawerOpen ? 'Close bottom instruction drawer' : 'Slide open bottom instruction drawer'}
        >
          {/* Step objective title */}
          <div className="flex items-center gap-2 overflow-hidden mr-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
            <span className="text-xs font-black uppercase tracking-tight text-amber-300 truncate">
              {currentStep.title[language]}
            </span>
          </div>

          {/* Guide Drawer Trigger Button */}
          <div
            id="btn-toggle-instruction-guide"
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-bold transition-all shrink-0 shadow-sm ${
              isDrawerOpen
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'bg-slate-900 text-amber-300 border border-amber-500/40 group-hover:border-amber-400'
            }`}
          >
            <BookOpen className="w-3 h-3 shrink-0" />
            <span>{isDrawerOpen ? (language === 'hi' ? 'ड्रॉअर बंद करें' : 'Hide Drawer') : (language === 'hi' ? 'निर्देश गाइड ▲' : 'Guide Drawer ▲')}</span>
            {isDrawerOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          </div>
        </div>
      </div>

      {/* Slide-In Bottom Drawer for Mission Instructions (Pinned seamlessly at bottom of AR container) */}
      <div
        id="ar-bottom-instruction-drawer"
        className="absolute bottom-0 left-0 right-0 z-40 pointer-events-none flex flex-col items-center justify-end"
      >
        {/* Backdrop overlay (dismiss on click outside without occluding top center) */}
        {isDrawerOpen && (
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="absolute inset-0 z-30 bg-slate-950/40 backdrop-blur-[2px] pointer-events-auto transition-opacity duration-300"
          />
        )}

        {/* The Drawer Card */}
        <div
          className={`pointer-events-auto w-full max-w-xl bg-slate-950/95 backdrop-blur-2xl border-t-2 border-x-2 border-amber-500/70 rounded-t-3xl shadow-[0_-12px_45px_rgba(0,0,0,0.85)] z-40 transition-transform duration-300 ease-out flex flex-col ${
            isDrawerOpen ? 'translate-y-0' : 'translate-y-[calc(100%-46px)]'
          }`}
          style={{ maxHeight: 'min(32vh, 260px)' }}
        >
          {/* Drawer Drag / Tap Handle Header (Always visible at the bottom edge in peek mode) */}
          <div
            id="btn-drawer-handle"
            onClick={handleToggleDrawer}
            className="flex flex-col items-center px-4 pt-1.5 pb-2 cursor-pointer bg-gradient-to-b from-slate-900/90 to-slate-950 select-none hover:bg-slate-900 transition-colors shrink-0 group border-b border-slate-800/80"
          >
            {/* Grabber Pill */}
            <div className="w-12 h-1 rounded-full bg-slate-600 group-hover:bg-amber-400 transition-colors mb-1.5" />

            <div className="w-full flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 truncate">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 shrink-0">
                  {language === 'hi' ? 'निर्देश गाइड' : language === 'sat' ? 'ᱥᱮᱪᱮᱫ ᱫᱤᱥᱟᱹ' : 'Mission Guide'}
                </span>
                <span className="text-xs font-black text-slate-200 truncate">
                  {currentStep.title[language]}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-semibold text-slate-400 hidden sm:inline">
                  {isDrawerOpen
                    ? (language === 'hi' ? 'नीचे खिसकाएं' : 'Slide down')
                    : (language === 'hi' ? 'ऊपर खिसकाएं' : 'Slide up')}
                </span>
                <div className="p-1 rounded-lg bg-slate-800 text-amber-400 border border-slate-700">
                  {isDrawerOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </div>
              </div>
            </div>
          </div>

          {/* Drawer Body - Scrollable if needed, strictly confined to bottom max 32vh */}
          <div className="p-3 sm:p-4 overflow-y-auto space-y-2.5">
            {/* Step count & quick audio listen bar */}
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {language === 'hi'
                  ? `चरण ${currentStepIndex + 1} / ${totalSteps}`
                  : `Step ${currentStepIndex + 1} of ${totalSteps}`}
              </span>

              <div className="flex items-center gap-2">
                <button
                  id="btn-speak-drawer-instruction"
                  onClick={handleSpeakCurrentStep}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  title={t.voiceAssistant}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'बोलकर सुनें' : 'Listen'}</span>
                </button>

                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Close Drawer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Hazard Warning banner if applicable */}
            {currentStep.warning && (
              <div className="bg-red-950/90 border border-red-500/70 p-2 rounded-xl flex items-start gap-2 text-red-200 text-xs shadow-md">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="font-bold">{currentStep.warning[language]}</span>
              </div>
            )}

            {/* Direct Action Instruction */}
            <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl">
              <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
                {currentStep.instruction[language]}
              </p>
            </div>

            {/* Field Hint */}
            <div className="flex items-center gap-2 text-[11px] text-sky-300 font-semibold bg-sky-950/50 px-2.5 py-1.5 rounded-xl border border-sky-500/30">
              <Eye className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>
                {language === 'hi'
                  ? `संकेत: ${currentStep.hint[language]}`
                  : `Hint: ${currentStep.hint[language]}`}
              </span>
            </div>

            {/* Proceed Action inside Drawer if Step is Completed */}
            {canProceed && onNextStep && (
              <button
                onClick={handleProceed}
                className="w-full mt-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg active:scale-95 cursor-pointer transition-all border border-white/40"
              >
                <span>{currentStepIndex + 1 === totalSteps ? t.completeModule : t.nextStep}</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Floating Status & Toast Notifications (Elevated at Top so 3D animation center stays clear) */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 pointer-events-auto flex flex-col items-center gap-2 z-50">
        {/* Active Tactile Haptic Feedback Pulse Toast */}
        {activeHapticEvent && (
          <div
            id="ar-tactile-feedback-toast"
            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-950/95 border-2 border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.65)] backdrop-blur-md animate-pulse transition-all"
          >
            <div className="relative flex items-center justify-center">
              <span className="text-xl select-none">{HAPTIC_METADATA[activeHapticEvent.pattern]?.icon || '📳'}</span>
              <span className="absolute -inset-1.5 rounded-full border-2 border-amber-400 animate-ping opacity-70 pointer-events-none" />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                  {language === 'hi' ? 'हैप्टिक कंपन पुष्टि' : language === 'sat' ? 'ᱦᱮᱯᱴᱤᱠ ᱯᱷᱤᱰᱵᱮᱠ' : 'Tactile Haptic Confirmed'}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-[9px] font-mono font-bold text-amber-300 uppercase">
                  {activeHapticEvent.pattern.replace('_', ' ')}
                </span>
              </div>
              <span className="text-xs font-black text-white">
                {activeHapticEvent.customLabel || activeHapticEvent.label[language] || activeHapticEvent.label.en}
              </span>
            </div>
          </div>
        )}

        {feedback && (
          <div
            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-2xl border-2 font-bold text-xs sm:text-sm transition-all animate-bounce ${
              feedback.type === 'correct' || feedback.type === 'success'
                ? 'bg-emerald-950/95 border-emerald-400 text-emerald-100 shadow-[0_0_30px_rgba(52,211,153,0.5)]'
                : 'bg-red-950/95 border-red-400 text-red-100 shadow-[0_0_30px_rgba(239,68,68,0.5)]'
            }`}
          >
            {feedback.type === 'correct' || feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {!isPlaneLocked && (
          <div className="bg-slate-900/95 backdrop-blur-md border border-orange-500/50 px-4 py-2.5 rounded-2xl text-center max-w-sm shadow-2xl animate-pulse">
            <AlertTriangle className="w-5 h-5 text-orange-400 mx-auto mb-1" />
            <p className="text-xs font-semibold text-orange-200">{t.scanningSurface}</p>
          </div>
        )}
      </div>

      {/* Bottom Floating Proceed/Next Step Button (ONLY when step completed and drawer is closed) */}
      {canProceed && onNextStep && !isDrawerOpen && (
        <div className="absolute bottom-13 right-3 sm:bottom-14 sm:right-6 z-50 pointer-events-auto">
          <button
            id="btn-proceed-next-step"
            onClick={handleProceed}
            className="flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-[0_0_30px_rgba(249,115,22,0.7)] animate-bounce active:scale-95 cursor-pointer transition-all border-2 border-white/50"
          >
            <span>{currentStepIndex + 1 === totalSteps ? t.completeModule : t.nextStep}</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
          </button>
        </div>
      )}
    </div>
  );
};
