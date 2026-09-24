import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Activity, 
  ShieldAlert, 
  CheckCircle2, 
  UserCheck, 
  Lock, 
  AlertTriangle, 
  Radio, 
  Sparkles, 
  Wind, 
  Fan, 
  Gauge, 
  Layers, 
  ArrowDown,
  Volume2,
  Maximize2
} from 'lucide-react';
import { Language } from '../../types';
import { audioAssistant } from '../../utils/audioAssistant';
import { haptics } from '../../utils/haptics';
import { translations } from '../../data/translations';
import { GameGasCanvas } from './GameGasCanvas';

interface GasLeakScenarioProps {
  stepIndex: number;
  language: Language;
  onStepComplete: () => void;
  isPlaneLocked: boolean;
  onAwardPoints?: (points: number, reason: string) => void;
  onIncorrectAction?: (reason: string) => void;
}

export const GasLeakScenario: React.FC<GasLeakScenarioProps> = ({
  stepIndex,
  language,
  onStepComplete,
  isPlaneLocked,
  onAwardPoints,
  onIncorrectAction
}) => {
  const t = translations[language];

  // Gas Detection Stratified Sequence State
  const [probeStratum, setProbeStratum] = useState<'surface' | 'top' | 'mid' | 'bottom'>('surface');
  const [probeDepthValue, setProbeDepthValue] = useState<number>(0.2); // 0.2 surface, 0.4 top, 0.7 mid, 0.95 bottom
  const [isSamplingActive, setIsSamplingActive] = useState<boolean>(false);
  const [testedLevels, setTestedLevels] = useState<{ top: boolean; mid: boolean; bottom: boolean }>({
    top: false,
    mid: false,
    bottom: false
  });
  const [gasReadingsLogged, setGasReadingsLogged] = useState<boolean>(false);

  // Ventilation Sequence State
  const [isBlowerRunning, setIsBlowerRunning] = useState<boolean>(false);
  const [lotoApplied, setLotoApplied] = useState<boolean>(false);
  const [ventilationProgress, setVentilationProgress] = useState<number>(0);

  // General Scenario State
  const [selectedPPE, setSelectedPPE] = useState<'cloth_mask' | 'scba_kit' | null>(null);
  const [buddyVerified, setBuddyVerified] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const hasTriggeredStep0Ref = useRef<boolean>(false);

  useEffect(() => {
    if (stepIndex !== 0) {
      hasTriggeredStep0Ref.current = false;
    }
  }, [stepIndex]);

  // Step 0: Auto advance on AR plane anchor lock
  useEffect(() => {
    if (stepIndex === 0 && isPlaneLocked && !hasTriggeredStep0Ref.current) {
      hasTriggeredStep0Ref.current = true;
      const timer = setTimeout(() => {
        haptics.trigger('plane_lock', 'Confined Space Portal Anchored');
        audioAssistant.playSuccessChime();
        onAwardPoints?.(10, language === 'hi' ? 'खदान पोर्टल AR सतह लॉक (+10 अंक)' : 'Confined portal surface locked (+10 PTS)');
        onStepComplete();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [stepIndex, isPlaneLocked, onStepComplete, onAwardPoints, language]);

  // Periodic gas detector beep sound when in hazardous unventilated state
  useEffect(() => {
    if (stepIndex === 1 && !gasReadingsLogged) {
      const interval = setInterval(() => {
        if (probeStratum === 'bottom') {
          audioAssistant.playGasDetectorBeep('critical');
        } else if (probeStratum === 'top' || probeStratum === 'mid') {
          audioAssistant.playGasDetectorBeep('warning');
        } else {
          audioAssistant.playGasDetectorBeep('normal');
        }
      }, 2200);
      return () => clearInterval(interval);
    }
  }, [stepIndex, probeStratum, gasReadingsLogged]);

  // Handle clicking / lowering sniffer probe to sample stratified gas layers
  const handleSampleStratum = useCallback(
    (stratum: 'top' | 'mid' | 'bottom') => {
      const sampleLabel = 
        stratum === 'bottom' ? 'Deep Sump H2S Sampled (24 PPM)' :
        stratum === 'mid' ? 'Mid Pit O2 Sampled (16.8%)' : 
        'Top CH4 Methane Sampled (22% LEL)';
      haptics.trigger('gas_sample', sampleLabel);
      setIsSamplingActive(true);
      setProbeStratum(stratum);

      let targetDepth = 0.4;
      let soundType: 'warning' | 'critical' = 'warning';
      if (stratum === 'top') {
        targetDepth = 0.38; // -1.0m Methane CH4
        soundType = 'warning';
      } else if (stratum === 'mid') {
        targetDepth = 0.68; // -2.5m Oxygen O2
        soundType = 'warning';
      } else if (stratum === 'bottom') {
        targetDepth = 0.96; // -4.0m Lethal H2S
        soundType = 'critical';
      }
      setProbeDepthValue(targetDepth);

      audioAssistant.playGasDetectorBeep(soundType);

      // Mark stratum as tested
      setTestedLevels(prev => {
        const next = { ...prev, [stratum]: true };
        return next;
      });

      setTimeout(() => {
        setIsSamplingActive(false);
      }, 1000);
    },
    []
  );

  // Tapping the 3D sniffer probe cycles through strata or triggers sampling
  const handleProbeClick = useCallback(() => {
    if (stepIndex !== 1) return;
    haptics.trigger('gas_sample', '3D Sniffer Probe Lowered');

    if (probeStratum === 'surface' || !testedLevels.top) {
      handleSampleStratum('top');
    } else if (probeStratum === 'top' || !testedLevels.mid) {
      handleSampleStratum('mid');
    } else if (probeStratum === 'mid' || !testedLevels.bottom) {
      handleSampleStratum('bottom');
    } else {
      handleSampleStratum('bottom');
    }
  }, [stepIndex, probeStratum, testedLevels, handleSampleStratum]);

  // Complete and log multi-gas readings into digital entry permit
  const handleLogGasReadings = () => {
    haptics.trigger('loto_lock', 'Permit Gas Readings Certified');
    setGasReadingsLogged(true);
    audioAssistant.playGasDetectorBeep('critical');
    audioAssistant.playSuccessChime();
    onAwardPoints?.(15, language === 'hi' ? 'गैस स्तर डिजिटल परमिट में दर्ज (+15 अंक)' : 'Stratified atmosphere logged on digital permit (+15 PTS)');
    setSuccessToast(
      language === 'hi' 
        ? 'गैस स्तर डिजिटल परमिट में दर्ज: O2 16.8%, H2S 24 PPM (घातक खतरा!)' 
        : language === 'sat' 
        ? 'ᱜᱮᱥ ᱨᱮᱠᱚᱨᱰ ᱮᱱᱟ: O2 16.8%, H2S 24 PPM (ᱵᱚᱛᱚᱨ!)' 
        : 'Stratified Atmosphere Logged: O2 16.8%, H2S 24 PPM, CH4 22% LEL (IDLH Danger!)'
    );
    setTimeout(() => {
      setSuccessToast(null);
      onStepComplete();
    }, 1400);
  };

  // Step 2: PPE Equipment selection
  const handleSelectPPE = (type: 'cloth_mask' | 'scba_kit') => {
    if (type === 'cloth_mask') {
      haptics.trigger('error');
      audioAssistant.playErrorBuzz();
      const warnMsg = language === 'hi'
        ? 'घातक त्रुटि: साधारण डस्ट मास्क ऑक्सीजन नहीं बनाता, ऑपरेटर का दम घुट जाएगा!'
        : language === 'sat'
        ? 'ᱵᱷᱩᱞ: ᱥᱟᱫᱷᱟᱨᱚᱱ ᱢᱟᱥᱠ ᱛᱮ ᱚᱠᱥᱤᱡᱮᱱ ᱵᱟᱝ ᱧᱟᱢᱚᱜ-ᱟ!'
        : 'FATAL ERROR: Filter masks do NOT supply oxygen in deficient air! Requires SCBA.';
      onIncorrectAction?.(warnMsg);
      setErrorMessage(warnMsg);
      setTimeout(() => setErrorMessage(null), 3500);
      return;
    }

    haptics.trigger('ppe_equip', 'SCBA 300 Bar & Harness Fitted');
    setSelectedPPE('scba_kit');
    audioAssistant.playSuccessChime();
    onAwardPoints?.(15, language === 'hi' ? 'SCBA किट व हार्नेस सुरक्षित पहना (+15 अंक)' : 'Positive-Pressure SCBA equipped (+15 PTS)');
    setSuccessToast(
      language === 'hi'
        ? 'SCBA पॉजिटिव प्रेशर श्वसन किट (300 Bar) व हार्नेस सुरक्षित पहना गया!'
        : language === 'sat'
        ? 'SCBA ᱥᱟᱦᱮᱫ ᱢᱟᱥᱠ ᱴᱷᱤᱠ ᱦᱚᱨᱚᱜ ᱮᱱᱟ!'
        : 'Positive-Pressure SCBA & 5-Point Full Body Harness Fitted!'
    );
    setTimeout(() => {
      setSuccessToast(null);
      onStepComplete();
    }, 1400);
  };

  // Step 3: Standby buddy & lifeline verification
  const handleVerifyBuddy = () => {
    haptics.trigger('buddy_lifeline', 'Standby Buddy & Lifeline Carabiner Locked');
    setBuddyVerified(true);
    audioAssistant.playSuccessChime();
    onAwardPoints?.(15, language === 'hi' ? 'सुरक्षा रस्सी और बडी संचार सत्यापित (+15 अंक)' : 'Standby buddy & lifeline connected (+15 PTS)');
    setSuccessToast(
      language === 'hi'
        ? 'सुरक्षा रस्सी (Lifeline) और 2-वे वॉकी-टॉकी संचार सत्यापित!'
        : language === 'sat'
        ? 'ᱜᱟᱛᱮ (Buddy) ᱥᱟᱶ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱫᱟᱹᱲᱤ ᱡᱚᱲᱟᱣ ᱮᱱᱟ!'
        : 'Standby Buddy Verified & Retrieval Winch Lifeline Connected!'
    );
    setTimeout(() => {
      setSuccessToast(null);
      onStepComplete();
    }, 1400);
  };

  // Step 4: Ventilation Sequence (Industrial Blower + Flexible Duct + LOTO)
  const handleStartVentilation = useCallback(() => {
    if (isBlowerRunning || lotoApplied) return;
    haptics.trigger('blower_start', '4500 CFM Axial Blower Purge Started');

    // 1. Mechanical switch click
    audioAssistant.playMechanicalLeverPull();
    setIsBlowerRunning(true);

    // 2. Forced air blower roaring sound
    audioAssistant.playAirBlower(4000);

    // 3. Dynamic ventilation purge animation progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      setVentilationProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setLotoApplied(true);
        haptics.trigger('loto_lock', 'LOTO Padlock #881 Clamped on Valve');
        audioAssistant.playSuccessChime();
        onAwardPoints?.(15, language === 'hi' ? 'वेंटिलेशन चालू व LOTO लॉक संपन्न (+15 अंक)' : 'Forced air blower purged toxins & LOTO applied (+15 PTS)');
        setSuccessToast(
          language === 'hi'
            ? '4500 CFM ब्लोअर ने जहरीली गैस बाहर निकाली व गैस वाल्व पर LOTO ताला लगा!'
            : language === 'sat'
            ? 'ᱦᱚᱭ ᱵᱽᱞᱳᱣᱟᱨ ᱪᱟᱹᱞᱩ ᱮᱱᱟ ᱟᱨ LOTO ᱛᱟᱞᱟ ᱞᱟᱜᱟᱣ ᱮᱱᱟ!'
            : 'Axial Blower Purged Confined Pit & LOTO Padlock #881 Locked In Place!'
        );
        setTimeout(() => {
          setSuccessToast(null);
          onStepComplete();
        }, 1600);
      }
    }, 600);
  }, [isBlowerRunning, lotoApplied, onAwardPoints, onStepComplete, language]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Toast Notifications */}
      {errorMessage && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-red-950/95 border-2 border-red-500 text-red-100 px-4 py-2.5 rounded-2xl shadow-2xl text-xs sm:text-sm font-bold flex items-center gap-2 animate-bounce">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successToast && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-950/95 border-2 border-emerald-500 text-emerald-100 px-4 py-2.5 rounded-2xl shadow-2xl text-xs sm:text-sm font-bold flex items-center gap-2 animate-pulse">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* 3D AR STAGE: Subterranean Shaft, Sniffer Probe & Industrial Ventilation Blower */}
      <div className="absolute top-1/2 -translate-y-[45%] sm:-translate-y-[42%] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-auto">
        {/* Floating 3D AR Interactive Target Rings (Step-specific visual callouts) */}
        {stepIndex === 1 && (
          <div className="flex items-center gap-1.5 mb-1 bg-slate-950/90 border border-yellow-500/80 rounded-2xl px-3 py-1.5 shadow-2xl backdrop-blur-md animate-pulse">
            <Activity className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            <span className="text-[11px] font-black text-yellow-300">
              {language === 'hi' 
                ? '🎯 AR प्रोब या नीचे दिए स्तरों पर टैप करें' 
                : language === 'sat' 
                ? '🎯 AR ᱯᱨᱳᱵᱽ ᱥᱮ ᱛᱟᱞᱟ ᱨᱮ ᱚᱛᱟᱭ ᱢᱮ' 
                : '🎯 TAP 3D PROBE OR STRATA BUTTONS TO SAMPLE'}
            </span>
          </div>
        )}

        {stepIndex === 4 && (
          <div className="flex items-center gap-1.5 mb-1 bg-slate-950/90 border border-emerald-500/80 rounded-2xl px-3 py-1.5 shadow-2xl backdrop-blur-md animate-bounce">
            <Fan className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-spin" />
            <span className="text-[11px] font-black text-emerald-300">
              {isBlowerRunning 
                ? (language === 'hi' ? '💨 4500 CFM ब्लोअर हवा शुद्ध कर रहा है...' : '💨 PURGING TOXIC GAS (4500 CFM)...')
                : (language === 'hi' ? '💨 AR ब्लोअर पर टैप करके हवा शुद्ध करें' : '💨 TAP 3D BLOWER TO START VENTILATION')}
            </span>
          </div>
        )}

        {/* 3D Canvas with click handling on Probe and Blower */}
        <div className="relative">
          <GameGasCanvas
            stepIndex={stepIndex}
            isVentilated={lotoApplied}
            probeDepth={probeDepthValue}
            isTesting={isSamplingActive}
            isBlowerRunning={isBlowerRunning}
            currentStratum={probeStratum}
            testedLevels={testedLevels}
            onProbeClick={handleProbeClick}
            onBlowerClick={handleStartVentilation}
            width={380}
            height={340}
          />

          {/* Interactive 3D Callout Target on Blower (Step 4) */}
          {stepIndex === 4 && !isBlowerRunning && (
            <button
              onClick={handleStartVentilation}
              className="absolute top-[60%] left-[8%] bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 px-2.5 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider shadow-[0_0_20px_rgba(249,115,22,0.8)] border-2 border-white animate-bounce flex items-center gap-1 cursor-pointer active:scale-95"
              title="Click 3D Blower to power on"
            >
              <Fan className="w-3 h-3 text-slate-950" />
              <span>{language === 'hi' ? 'ब्लोअर चलाएं' : 'START BLOWER'}</span>
            </button>
          )}

          {/* Interactive 3D Stratified Sampling Depth Badges (Step 1) */}
          {stepIndex === 1 && (
            <div className="absolute right-1 top-[22%] flex flex-col gap-1.5">
              {/* Stratum 1: Top CH4 */}
              <button
                onClick={() => handleSampleStratum('top')}
                className={`px-2 py-1 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1 transition-all shadow-lg cursor-pointer border ${
                  probeStratum === 'top'
                    ? 'bg-amber-500 text-slate-950 border-white scale-105 ring-2 ring-amber-400'
                    : testedLevels.top
                    ? 'bg-slate-900/90 text-amber-400 border-amber-500/50'
                    : 'bg-slate-950/80 text-slate-300 border-slate-700 hover:border-amber-400'
                }`}
              >
                <span>-1.0m CH4:</span>
                <span className="font-black">22% LEL</span>
                {testedLevels.top && <CheckCircle2 className="w-2.5 h-2.5 text-amber-300" />}
              </button>

              {/* Stratum 2: Mid O2 */}
              <button
                onClick={() => handleSampleStratum('mid')}
                className={`px-2 py-1 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1 transition-all shadow-lg cursor-pointer border ${
                  probeStratum === 'mid'
                    ? 'bg-sky-500 text-slate-950 border-white scale-105 ring-2 ring-sky-400'
                    : testedLevels.mid
                    ? 'bg-slate-900/90 text-sky-400 border-sky-500/50'
                    : 'bg-slate-950/80 text-slate-300 border-slate-700 hover:border-sky-400'
                }`}
              >
                <span>-2.5m O2:</span>
                <span className="font-black">16.8% DEF</span>
                {testedLevels.mid && <CheckCircle2 className="w-2.5 h-2.5 text-sky-300" />}
              </button>

              {/* Stratum 3: Bottom H2S */}
              <button
                onClick={() => handleSampleStratum('bottom')}
                className={`px-2 py-1 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1 transition-all shadow-lg cursor-pointer border ${
                  probeStratum === 'bottom'
                    ? 'bg-red-500 text-white border-white scale-105 ring-2 ring-red-400 animate-pulse'
                    : testedLevels.bottom
                    ? 'bg-slate-900/90 text-red-400 border-red-500/50'
                    : 'bg-slate-950/80 text-slate-300 border-slate-700 hover:border-red-400'
                }`}
              >
                <span>-4.0m H2S:</span>
                <span className="font-black">24 PPM ☠️</span>
                {testedLevels.bottom && <CheckCircle2 className="w-2.5 h-2.5 text-red-300" />}
              </button>
            </div>
          )}
        </div>

        {/* Real-time Atmospheric Status Badge Under Pit Opening */}
        <div className="relative -mt-4 bg-slate-900/95 border border-slate-700 rounded-xl px-4 py-1.5 shadow-2xl flex items-center gap-2 text-[11px] font-bold backdrop-blur-md">
          <span className={`w-2.5 h-2.5 rounded-full ${lotoApplied ? 'bg-emerald-400 animate-pulse' : 'bg-red-500 animate-ping'}`} />
          <span className={lotoApplied ? 'text-emerald-300' : 'text-amber-300'}>
            {lotoApplied 
              ? (language === 'hi' ? 'वायुमंडल पूर्ण शुद्ध (20.9% O2 सुरक्षित)' : 'Purged & Safe (20.9% O2 Breathable)') 
              : isBlowerRunning
              ? (language === 'hi' ? `हवा शुद्धिकरण जारी: ${ventilationProgress}%` : `Forced Air Purging: ${ventilationProgress}%`)
              : (language === 'hi' ? 'जहरीली गैस H2S / मीथेन स्तर IDLH घातक' : 'IDLH Hazard: Toxic H2S / CH4 Strata Active')}
          </span>
        </div>
      </div>

      {/* AR STEP 1: Multi-Gas Atmospheric Meter HUD (Stratified Reading & Logging) */}
      {stepIndex === 1 && (
        <div className="absolute bottom-13 sm:bottom-14 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[calc(100%-1.5rem)] bg-slate-950/95 backdrop-blur-xl border-2 border-yellow-500 rounded-3xl p-3 sm:p-4 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col gap-2 pointer-events-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-yellow-400" />
              {language === 'hi' ? 'मल्टी-गैस स्तरीकृत विश्लेषक' : language === 'sat' ? '᱔-ᱜᱮᱥ ᱦᱚᱭ ᱡᱟᱸᱪ ᱢᱤᱴᱟᱨ' : 'Stratified 4-Gas Detector (3 Depths)'}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black bg-red-950 text-red-300 border border-red-500 px-2 py-0.5 rounded animate-pulse">
                IDLH ALARM
              </span>
            </div>
          </div>

          {/* Stratified Depth Readings Grid */}
          <div className="grid grid-cols-3 gap-2">
            {/* Top Stratum: CH4 Methane */}
            <div 
              onClick={() => handleSampleStratum('top')}
              className={`border rounded-xl p-1.5 sm:p-2 text-center cursor-pointer transition-all active:scale-95 ${
                probeStratum === 'top'
                  ? 'bg-amber-950/80 border-amber-400 ring-1 ring-amber-400'
                  : testedLevels.top
                  ? 'bg-slate-900 border-amber-500/60'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                <span className="text-[9px] text-slate-400 font-bold">Top -1m (CH4)</span>
                {testedLevels.top && <CheckCircle2 className="w-2.5 h-2.5 text-amber-400" />}
              </div>
              <span className="text-sm sm:text-base font-black text-amber-400">22% LEL</span>
              <span className="text-[8px] text-amber-300 block font-semibold">
                {language === 'hi' ? 'विस्फोटक सीमा' : 'EXPLOSIVE'}
              </span>
            </div>

            {/* Mid Stratum: O2 Oxygen */}
            <div 
              onClick={() => handleSampleStratum('mid')}
              className={`border rounded-xl p-1.5 sm:p-2 text-center cursor-pointer transition-all active:scale-95 ${
                probeStratum === 'mid'
                  ? 'bg-sky-950/80 border-sky-400 ring-1 ring-sky-400'
                  : testedLevels.mid
                  ? 'bg-slate-900 border-sky-500/60'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                <span className="text-[9px] text-slate-400 font-bold">Mid -2.5m (O2)</span>
                {testedLevels.mid && <CheckCircle2 className="w-2.5 h-2.5 text-sky-400" />}
              </div>
              <span className="text-sm sm:text-base font-black text-red-400">16.8%</span>
              <span className="text-[8px] text-red-300 block font-semibold">
                {language === 'hi' ? 'कमी (<19.5%)' : 'DEFICIENT'}
              </span>
            </div>

            {/* Bottom Stratum: H2S Hydrogen Sulfide */}
            <div 
              onClick={() => handleSampleStratum('bottom')}
              className={`border rounded-xl p-1.5 sm:p-2 text-center cursor-pointer transition-all active:scale-95 ${
                probeStratum === 'bottom'
                  ? 'bg-red-950/80 border-red-400 ring-1 ring-red-400'
                  : testedLevels.bottom
                  ? 'bg-slate-900 border-red-500/60'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                <span className="text-[9px] text-slate-400 font-bold">Deep -4m (H2S)</span>
                {testedLevels.bottom && <CheckCircle2 className="w-2.5 h-2.5 text-red-400" />}
              </div>
              <span className="text-sm sm:text-base font-black text-red-400">24 PPM</span>
              <span className="text-[8px] text-red-300 block font-semibold">
                {language === 'hi' ? 'घातक (सीमा 10)' : 'LETHAL TOXIC'}
              </span>
            </div>
          </div>

          {/* Action Button: Log Gas Readings */}
          <button
            id="btn-log-gas-readings"
            onClick={handleLogGasReadings}
            className="w-full py-3 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-[0_0_30px_rgba(234,179,8,0.6)] transition-all active:scale-95 flex items-center justify-center gap-2 animate-bounce cursor-pointer border-2 border-white/60"
          >
            <CheckCircle2 className="w-5 h-5 text-slate-950" />
            <span>
              {language === 'hi' 
                ? 'सभी 3 स्तर दर्ज करें (डिजिटल परमिट में लॉग करें)' 
                : language === 'sat' 
                ? 'ᱜᱮᱥ ᱨᱮᱠᱚᱨᱰ ᱢᱮ (Log Readings)' 
                : 'Log Stratified Gas Readings into Entry Permit'}
            </span>
          </button>
        </div>
      )}

      {/* AR STEP 2: PPE Equipment Station (Interactive) */}
      {stepIndex === 2 && (
        <div className="absolute bottom-13 sm:bottom-14 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[calc(100%-1.5rem)] flex justify-center gap-3 pointer-events-auto">
          {/* Cloth Dust Mask (Inadequate) */}
          <div
            onClick={() => handleSelectPPE('cloth_mask')}
            className="flex-1 bg-slate-950/95 hover:bg-red-950/60 border-2 border-red-500 rounded-3xl p-3 sm:p-4 text-center cursor-pointer shadow-xl transition-all transform hover:scale-105 active:scale-95 flex flex-col items-center gap-1.5"
          >
            <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
              <ShieldAlert className="w-5 h-5 text-red-400" />
            </div>
            <span className="text-xs font-bold text-white">
              {language === 'hi' ? 'कपड़ा / डस्ट मास्क' : 'Standard Dust Mask'}
            </span>
            <span className="text-[10px] text-red-400 font-semibold bg-red-950/80 px-2 py-0.5 rounded">
              {language === 'hi' ? 'ऑक्सीजन रहित (असुरक्षित)' : 'Zero Oxygen Supply'}
            </span>
          </div>

          {/* SCBA Self-Contained Breathing Apparatus (Correct) */}
          <div
            onClick={() => handleSelectPPE('scba_kit')}
            className="flex-1 bg-slate-950/95 hover:bg-emerald-950/80 border-2 border-emerald-400 rounded-3xl p-3 sm:p-4 text-center cursor-pointer shadow-[0_0_35px_rgba(52,211,153,0.5)] transition-all transform hover:scale-105 active:scale-95 flex flex-col items-center gap-1.5 animate-pulse"
          >
            <div className="w-9 h-9 bg-emerald-600 border-2 border-white rounded-full flex items-center justify-center text-white shadow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-bold text-emerald-300">
              {language === 'hi' ? 'SCBA पॉजिटिव प्रेशर किट' : 'SCBA 300 Bar Breathing Kit'}
            </span>
            <span className="text-[10px] text-emerald-200 font-bold bg-emerald-900 px-2 py-0.5 rounded">
              {language === 'hi' ? '100% स्वच्छ वायु' : '100% Pure O2'}
            </span>
          </div>
        </div>
      )}

      {/* AR STEP 3: Standby Buddy & Lifeline Verification */}
      {stepIndex === 3 && (
        <div className="absolute bottom-13 sm:bottom-14 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[calc(100%-1.5rem)] bg-slate-950/95 backdrop-blur-xl border-2 border-sky-400 rounded-3xl p-3.5 sm:p-4 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col items-center gap-2.5 pointer-events-auto">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-black uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-sky-400" />
              {language === 'hi' ? 'सुरक्षा बडी और लाइफलाइन' : 'Standby Attendant & Retrieval Lifeline'}
            </span>
            <span className="text-[10px] font-bold text-sky-300 bg-sky-950 px-2.5 py-0.5 rounded-full border border-sky-600">
              COMMUNICATION
            </span>
          </div>
          <p className="text-xs text-slate-200 text-center font-medium">
            {language === 'hi'
              ? 'प्रवेश से पहले बाहर तैनात सुरक्षा साथी से वॉकी-टॉकी संचार व विंच हार्नेस रस्सी जोड़ें।'
              : 'Confirm continuous radio link with attendant and anchor harness D-ring to mechanical retrieval winch.'}
          </p>
          <button
            id="btn-verify-buddy"
            onClick={handleVerifyBuddy}
            className="w-full py-3 bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-[0_0_30px_rgba(56,189,248,0.6)] transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer border-2 border-white/60 animate-pulse"
          >
            <Radio className="w-5 h-5 text-slate-950 animate-pulse" />
            <span>
              {language === 'hi' ? 'बडी व लाइफलाइन कनेक्ट करें' : 'Verify Standby Buddy & Lifeline'}
            </span>
          </button>
        </div>
      )}

      {/* AR STEP 4: LOTO Isolation & Axial Forced Air Blower Purging */}
      {stepIndex === 4 && (
        <div className="absolute bottom-13 sm:bottom-14 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[calc(100%-1.5rem)] bg-slate-950/95 backdrop-blur-xl border-2 border-emerald-400 rounded-3xl p-3.5 sm:p-4 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col items-center gap-2.5 pointer-events-auto">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Fan className="w-4 h-4 text-emerald-400 animate-spin" />
              {language === 'hi' ? '4500 CFM ब्लोअर व LOTO ताला' : '4500 CFM Axial Blower & LOTO Valve'}
            </span>
            <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-600">
              {isBlowerRunning ? 'PURGING AIR' : 'READY TO PURGE'}
            </span>
          </div>
          <p className="text-xs text-slate-200 text-center font-medium">
            {language === 'hi'
              ? 'AR में ब्लोअर या नीचे दिए बटन पर टैप करें: डक्ट से नीचे ताजी हवा झोंकें और गैस वाल्व पर LOTO ताला लगाएं।'
              : 'Tap the 3D blower or button below: Deploy positive-pressure ventilation duct to shaft bottom & lock incoming gas valves.'}
          </p>
          <button
            id="btn-apply-loto-gas"
            onClick={handleStartVentilation}
            disabled={isBlowerRunning}
            className={`w-full py-3 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 border-2 border-white/60 shadow-[0_0_30px_rgba(52,211,153,0.6)] ${
              isBlowerRunning 
                ? 'bg-emerald-400 opacity-90 cursor-wait' 
                : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 cursor-pointer animate-bounce'
            }`}
          >
            {isBlowerRunning ? (
              <>
                <Fan className="w-5 h-5 text-slate-950 animate-spin" />
                <span>{language === 'hi' ? `हवा शुद्धिकरण जारी... (${ventilationProgress}%)` : `Purging Confined Pit... (${ventilationProgress}%)`}</span>
              </>
            ) : (
              <>
                <Lock className="w-5 h-5 text-slate-950" />
                <span>
                  {language === 'hi' ? 'AR ब्लोअर चलाएं व LOTO ताला लगाएं' : 'Start 3D Blower & Apply LOTO Lockout'}
                </span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
