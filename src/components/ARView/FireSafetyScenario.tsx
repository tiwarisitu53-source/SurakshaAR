import React, { useState, useEffect, useRef } from 'react';
import { Flame, Bell, CheckCircle2, XCircle, ShieldAlert, DoorOpen, Wind, Target, Play, RotateCcw, AlertTriangle, Droplets } from 'lucide-react';
import { Language } from '../../types';
import { audioAssistant } from '../../utils/audioAssistant';
import { haptics } from '../../utils/haptics';
import { translations } from '../../data/translations';
import { GameFireCanvas } from './GameFireCanvas';

interface FireSafetyScenarioProps {
  stepIndex: number;
  language: Language;
  onStepComplete: () => void;
  isPlaneLocked: boolean;
  onAwardPoints?: (points: number, reason: string) => void;
  onIncorrectAction?: (reason: string) => void;
}

export const FireSafetyScenario: React.FC<FireSafetyScenarioProps> = ({
  stepIndex,
  language,
  onStepComplete,
  isPlaneLocked,
  onAwardPoints,
  onIncorrectAction
}) => {
  const t = translations[language];

  // Scenario internal states
  const [alarmTriggered, setAlarmTriggered] = useState<boolean>(false);
  const [isAlarmHandlePulled, setIsAlarmHandlePulled] = useState<boolean>(false);
  const [selectedExtinguisher, setSelectedExtinguisher] = useState<'water' | 'dcp' | 'co2'>('dcp');
  const [isSprayingContinuous, setIsSprayingContinuous] = useState<boolean>(false);
  
  const [passState, setPassState] = useState<{
    pinPulled: boolean;
    aimed: boolean;
    squeezed: boolean;
    sweeping: boolean;
    sweepProgress: number; // 0 to 100
  }>({
    pinPulled: false,
    aimed: false,
    squeezed: false,
    sweeping: false,
    sweepProgress: 0
  });

  const [fireExtinguished, setFireExtinguished] = useState<boolean>(false);
  const [selectedExit, setSelectedExit] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const hasTriggeredStep0Ref = useRef<boolean>(false);
  const sprayIntervalRef = useRef<number | null>(null);
  const sweepProgressRef = useRef<number>(0);

  useEffect(() => {
    sweepProgressRef.current = passState.sweepProgress;
  }, [passState.sweepProgress]);

  useEffect(() => {
    if (stepIndex !== 0) {
      hasTriggeredStep0Ref.current = false;
    }
  }, [stepIndex]);

  // Sound effect for realistic game fire crackle & roar
  useEffect(() => {
    if (!fireExtinguished && stepIndex > 0) {
      audioAssistant.startFireSound();
    } else {
      audioAssistant.stopFireSound();
    }

    return () => {
      audioAssistant.stopFireSound();
    };
  }, [fireExtinguished, stepIndex]);

  // Auto advance trigger on plane lock for step 0
  useEffect(() => {
    if (stepIndex === 0 && isPlaneLocked && !hasTriggeredStep0Ref.current) {
      hasTriggeredStep0Ref.current = true;
      const timer = setTimeout(() => {
        haptics.trigger('plane_lock', 'Fire Zone AR Surface Anchored');
        audioAssistant.playSuccessChime();
        onAwardPoints?.(10, language === 'hi' ? 'सतह पहचानी गई' : 'AR Surface plane locked');
        onStepComplete();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [stepIndex, isPlaneLocked, onStepComplete, onAwardPoints, language]);

  // Handle Realistic Mechanical Fire Alarm Lever Pull (Step 1)
  const handlePullAlarmLever = () => {
    if (alarmTriggered) return;
    haptics.trigger('e_stop', 'Fire Alarm Lever Tripped');
    setIsAlarmHandlePulled(true);
    setAlarmTriggered(true);

    // Play mechanical ratchet/clank sound of handle pulling down
    audioAssistant.playMechanicalLeverPull();

    // After brief mechanical latch snap, sound loud evacuation sirens
    setTimeout(() => {
      audioAssistant.playAlarmSiren(2600);
      onAwardPoints?.(15, language === 'hi' ? 'आपातकालीन अलार्म खींचा (+15 अंक)' : 'Emergency alarm pulled promptly (+15 PTS)');
      setSuccessToast(
        language === 'hi'
          ? 'आपातकालीन अलार्म बज उठा! संयंत्र निकासी सायरन सक्रिय।'
          : language === 'sat'
          ? 'ᱟᱞᱟᱨᱢ ᱥᱟᱰᱮ ᱮᱱᱟ! ᱡᱚᱛᱚ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱚ ᱵᱟᱰᱟᱭ ᱧᱟᱢ ᱠᱮᱫ-ᱟ᱾'
          : 'Emergency Siren Activated! Facility Evacuation Horns Sounding!'
      );
      setTimeout(() => {
        setSuccessToast(null);
        onStepComplete();
      }, 1600);
    }, 300);
  };

  // Handle Extinguisher Selection
  const handleSelectExtinguisher = (type: 'water' | 'dcp' | 'co2') => {
    setSelectedExtinguisher(type);
    haptics.trigger('ppe_equip', `${type.toUpperCase()} Extinguisher Unlatched`);

    if (type === 'water') {
      audioAssistant.playSuccessChime();
      const warnMsg = language === 'hi'
        ? 'पानी चुना गया! ध्यान दें: सामान्यतः बिजली पर सूखा पाउडर उपयोग होता है, पर पानी का स्प्रे सिमुलेशन सक्रिय है।'
        : 'Water Extinguisher Selected! (Demonstrating realistic high-pressure water stream & steam sizzle!)';
      setSuccessToast(warnMsg);
      onAwardPoints?.(10, 'Water Jet Extinguisher Equipped (+10 PTS)');
      setTimeout(() => {
        setSuccessToast(null);
        onStepComplete();
      }, 1500);
      return;
    }

    audioAssistant.playSuccessChime();
    onAwardPoints?.(15, language === 'hi' ? 'विद्युत सुरक्षित DCP/CO2 चुना (+15 अंक)' : 'Non-conductive Extinguisher Selected (+15 PTS)');
    setSuccessToast(
      language === 'hi' 
        ? 'DCP/CO2 का सही चुनाव किया गया!' 
        : language === 'sat' 
        ? 'DCP ᱴᱷᱤᱠ ᱵᱟᱪᱷᱟᱣ!' 
        : 'Correct Extinguisher Selected (Non-conductive)!'
    );
    setTimeout(() => {
      setSuccessToast(null);
      onStepComplete();
    }, 1200);
  };

  // Handle P.A.S.S. steps
  const handlePullPin = () => {
    haptics.trigger('pin_pull', 'Safety Pin & Tamper Seal Pulled');
    setPassState(prev => ({ ...prev, pinPulled: true }));
    audioAssistant.playMechanicalLeverPull();
    audioAssistant.playSuccessChime();
    onAwardPoints?.(5, language === 'hi' ? 'P.A.S.S. सुरक्षा पिन निकाला' : 'PASS Step 1: Safety Pin Pulled (+5 PTS)');
  };

  const handleAim = () => {
    if (!passState.pinPulled) {
      haptics.trigger('error', 'Pull Safety Pin First');
      audioAssistant.playErrorBuzz();
      onIncorrectAction?.(language === 'hi' ? 'पहले पिन निकालें!' : 'Pull safety pin first!');
      return;
    }
    haptics.trigger('scan', 'Aim Locked at Flame Base');
    setPassState(prev => ({ ...prev, aimed: true }));
    audioAssistant.playSuccessChime();
    onAwardPoints?.(5, language === 'hi' ? 'आग की जड़ पर निशाना साधा' : 'PASS Step 2: Aimed at base (+5 PTS)');
  };

  const handleSqueeze = () => {
    if (!passState.aimed) {
      haptics.trigger('error', 'Aim at Base First');
      audioAssistant.playErrorBuzz();
      onIncorrectAction?.(language === 'hi' ? 'पहले नोजल को आग की जड़ पर साधें!' : 'Aim at flame base before squeezing!');
      return;
    }
    haptics.trigger('extinguisher_squeeze', 'Discharge Handle Squeezed');
    setPassState(prev => ({ ...prev, squeezed: true, sweeping: true }));
    audioAssistant.playWaterStreamAndSizzle(2000);
    onAwardPoints?.(5, language === 'hi' ? 'लीवर दबाया' : 'PASS Step 3: Lever squeezed (+5 PTS)');
  };

  // Spraying action (either click or hold)
  const handleSprayBurst = (increment: number = 25) => {
    if (!passState.squeezed || fireExtinguished) return;
    
    // Trigger pressurized chemical agent spray pulse haptic
    haptics.trigger('spray_burst', 'Pressurized Agent Discharged');

    // Play sizzling steam hiss + pressurized stream
    audioAssistant.playWaterStreamAndSizzle(1400);

    const nextProgress = Math.min(100, sweepProgressRef.current + increment);
    sweepProgressRef.current = nextProgress;

    setPassState(prev => ({
      ...prev,
      sweepProgress: nextProgress
    }));

    if (nextProgress >= 100 && !fireExtinguished) {
      stopContinuousSpray();
      setFireExtinguished(true);
      haptics.trigger('success', 'Fire Successfully Extinguished');
      audioAssistant.playSuccessChime();
      onAwardPoints?.(15, language === 'hi' ? 'आग पूरी तरह बुझाई (+15 अंक)' : 'PASS Step 4: Sweep Extinguished Fire (+15 PTS)');
      setSuccessToast(
        language === 'hi' ? 'आग पूरी तरह बुझ गई!' : language === 'sat' ? 'ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱮᱱᱟ!' : 'Fire 100% Extinguished!'
      );
      setTimeout(() => {
        setSuccessToast(null);
        onStepComplete();
      }, 1600);
    }
  };

  // Continuous hold-to-spray support
  const startContinuousSpray = () => {
    if (!passState.squeezed || fireExtinguished) return;
    setIsSprayingContinuous(true);
    handleSprayBurst(10);
    sprayIntervalRef.current = window.setInterval(() => {
      handleSprayBurst(10);
    }, 280);
  };

  const stopContinuousSpray = () => {
    setIsSprayingContinuous(false);
    if (sprayIntervalRef.current) {
      clearInterval(sprayIntervalRef.current);
      sprayIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (sprayIntervalRef.current) {
        clearInterval(sprayIntervalRef.current);
      }
    };
  }, []);

  // Handle Exit selection
  const handleSelectExit = (exitNum: number) => {
    setSelectedExit(exitNum);
    if (exitNum === 2) {
      haptics.trigger('step', 'Safe Emergency Exit Confirmed');
      audioAssistant.playSuccessChime();
      onAwardPoints?.(15, language === 'hi' ? 'सुरक्षित निकास मार्ग चुना (+15 अंक)' : 'Safe Emergency Exit Reached (+15 PTS)');
      setSuccessToast(
        language === 'hi' ? 'सुरक्षित निकास द्वार चुना गया!' : language === 'sat' ? 'ᱨᱩᱠᱷᱤᱭᱟᱹ Exit ᱵᱟᱪᱷᱟᱣ ᱮᱱᱟ!' : 'Safe Emergency Exit Reached!'
      );
      setTimeout(() => {
        setSuccessToast(null);
        onStepComplete();
      }, 1400);
    } else {
      haptics.trigger('error', 'Hazardous Blocked Exit');
      audioAssistant.playErrorBuzz();
      const blockedMsg = exitNum === 1
        ? (language === 'hi' ? 'निकास 1 मलबे और स्टील बीम से अवरुद्ध है!' : language === 'sat' ? 'Exit 1 ᱫᱚ ᱵᱚᱸᱫᱽ ᱜᱮᱭᱟ!' : 'Exit 1 is blocked by collapsed steel beams!')
        : (language === 'hi' ? 'निकास 3 खतरनाक रासायनिक भंडार कक्ष की ओर जाता है!' : language === 'sat' ? 'Exit 3 ᱫᱚ ᱵᱚᱛᱚᱨ ᱴᱷᱟᱶ ᱠᱟᱱᱟ!' : 'Exit 3 leads directly into combustible fuel storage!');
      onIncorrectAction?.(blockedMsg);
      setErrorMessage(blockedMsg);
      setTimeout(() => setErrorMessage(null), 3500);
    }
  };

  // Flame remaining scale based on sweep progress
  const flameHeightScale = Math.max(0, 1 - passState.sweepProgress / 100);

  return (
    <div className="relative w-full h-full overflow-hidden">
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

      {/* 3D AR Ground Plane Fire - Anchored Directly on the Floor When Phone Points Down */}
      <div 
        className="absolute bottom-[64px] sm:bottom-[72px] left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-700 z-10 flex flex-col items-center"
        style={{
          opacity: fireExtinguished ? 0.35 : 1,
          transform: `translateX(-50%) scale(${0.95 + flameHeightScale * 0.25})`
        }}
      >
        {/* Game Dynamic Ground Fire Canvas */}
        <div className="relative w-[380px] h-[380px] sm:w-[420px] sm:h-[420px] pointer-events-none">
          <GameFireCanvas
            flameHeightScale={flameHeightScale}
            isExtinguished={fireExtinguished}
            isDischarging={passState.squeezed && (isSprayingContinuous || passState.sweeping)}
            sprayType={selectedExtinguisher === 'water' ? 'water' : 'dcp'}
            sweepProgress={passState.sweepProgress}
            width={400}
            height={400}
          />
        </div>

        {/* Floor Equipment Source (Electrical Box & Oil Barrels Grounded on Floor) */}
        <div className="relative -mt-12 w-52 bg-slate-900/90 border-2 border-slate-700 rounded-xl p-2 shadow-2xl flex flex-col gap-1 text-center">
          <div className="flex items-center justify-between text-[9px] font-black uppercase text-amber-400 tracking-wider">
            <span>{language === 'hi' ? '440V ट्रांसफार्मर' : '440V TRANSFORMER'}</span>
            <span className="text-red-400 animate-pulse">CLASS B / C FIRE</span>
          </div>
          <div className="w-full bg-slate-800 rounded py-0.5 text-[10px] font-bold text-slate-300">
            {language === 'hi' ? 'हाइड्रोलिक तेल रिसाव (ज्वलनशील)' : 'Hydraulic Oil Sump (Flammable)'}
          </div>
        </div>
      </div>

      {/* AR STEP 1: Full-Featured AR Wall-Mounted Emergency Fire Alarm Pull Station on Screen */}
      {stepIndex === 1 && (
        <div className="absolute top-[16%] sm:top-[18%] left-1/2 -translate-x-1/2 z-40 flex flex-col items-center pointer-events-auto">
          {/* Pulsing Strobe Beacon on Top of Station */}
          <div className="relative flex items-center justify-center">
            <div className={`w-12 h-6 rounded-t-full border-2 border-white shadow-lg transition-all ${
              alarmTriggered 
                ? 'bg-amber-300 shadow-[0_0_50px_rgba(251,191,36,1)] animate-ping' 
                : 'bg-red-700 shadow-md'
            }`} />
            <div className="absolute -top-1 w-4 h-4 rounded-full bg-white/80 animate-pulse" />
          </div>

          {/* Heavy Cast-Metal Industrial Pull Station Box */}
          <div 
            onClick={handlePullAlarmLever}
            className="w-56 sm:w-64 bg-gradient-to-b from-red-600 via-red-700 to-red-900 border-4 border-white rounded-3xl p-4 sm:p-5 shadow-[0_0_50px_rgba(239,68,68,0.85)] cursor-pointer select-none transition-all transform hover:scale-105 active:scale-95 group flex flex-col items-center gap-2.5"
          >
            {/* Header Plate */}
            <div className="w-full bg-red-950/80 border border-red-400/60 rounded-xl py-1 text-center">
              <span className="text-xs sm:text-sm font-black text-white tracking-widest uppercase">
                {language === 'hi' ? 'आपातकालीन फायर अलार्म' : 'FIRE ALARM'}
              </span>
            </div>

            {/* Instruction Banner */}
            <div className="text-[10px] font-bold text-red-100 text-center uppercase tracking-wider">
              {language === 'hi' ? 'आपातकाल में नीचे खींचें' : 'PULL DOWN IN CASE OF EMERGENCY'}
            </div>

            {/* Realistic Mechanical Pull Handle */}
            <div className="relative w-full h-20 sm:h-24 bg-red-950/90 border-2 border-red-500 rounded-2xl p-2 flex flex-col items-center justify-center overflow-hidden shadow-inner">
              {/* Pivot Axle */}
              <div className="absolute top-2 w-full flex justify-between px-3">
                <div className="w-3 h-3 rounded-full bg-slate-400 border border-slate-600 shadow" />
                <div className="w-3 h-3 rounded-full bg-slate-400 border border-slate-600 shadow" />
              </div>

              {/* Pivoting Handle Body */}
              <div 
                className={`relative w-36 bg-gradient-to-b from-slate-100 to-slate-300 border-2 border-slate-700 rounded-xl py-2 px-3 shadow-2xl flex flex-col items-center transition-all duration-300 ${
                  isAlarmHandlePulled 
                    ? 'translate-y-4 rotate-6 bg-amber-300 border-amber-600 shadow-[0_10px_25px_rgba(245,158,11,0.7)]' 
                    : 'group-hover:translate-y-1'
                }`}
              >
                <span className="text-xs font-black text-slate-900 tracking-wider">
                  {isAlarmHandlePulled ? 'PULLED' : 'PULL DOWN'}
                </span>
                <span className="text-sm font-black text-red-600 animate-bounce">
                  {isAlarmHandlePulled ? '✓ ACTIVE' : '▼'}
                </span>
              </div>
            </div>

            {/* Bottom Status Prompt */}
            <div className="w-full bg-white text-red-700 text-center font-black text-xs py-2 rounded-xl uppercase tracking-wider shadow">
              {language === 'hi' 
                ? (isAlarmHandlePulled ? 'सायरन चालू हो गया!' : 'हैंडल खींचने के लिए टैप करें') 
                : (isAlarmHandlePulled ? 'SIREN SOUNDING!' : 'TAP / PULL DOWN TO ACTIVATE')}
            </div>
          </div>
        </div>
      )}

      {/* AR STEP 2: Fire Extinguisher Selection (Water, DCP, CO2) - Pinned to bottom, clear & clickable */}
      {stepIndex === 2 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[calc(100%-1.5rem)] bg-slate-950/95 backdrop-blur-xl border-2 border-amber-500 rounded-3xl p-3 sm:p-4 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col gap-2.5 pointer-events-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-amber-400">
              {language === 'hi' ? 'उचित अग्निशामक चुनें' : 'SELECT FIRE EXTINGUISHER'}
            </span>
            <span className="text-[10px] text-amber-300 font-bold bg-amber-950 px-2 py-0.5 rounded-full border border-amber-600">
              CLASS B/C FIRE
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {/* 1. Water Extinguisher (Interactive Water Jet Demo) */}
            <div 
              onClick={() => handleSelectExtinguisher('water')}
              className="bg-slate-900/90 hover:bg-slate-800 border-2 border-cyan-400 rounded-2xl p-2 sm:p-2.5 shadow-xl cursor-pointer text-center flex flex-col items-center gap-1 transition-all transform hover:-translate-y-1 active:scale-95"
            >
              <div className="w-8 h-10 bg-gradient-to-b from-red-600 to-blue-700 border border-cyan-300 rounded flex items-center justify-center text-white font-black text-[9px] shadow">
                <Droplets className="w-4 h-4 text-cyan-200" />
              </div>
              <span className="text-[11px] font-bold text-cyan-300 leading-tight">
                {language === 'hi' ? 'पानी यंत्र' : 'Water Jet'}
              </span>
              <span className="text-[9px] text-cyan-400 font-semibold leading-none">
                {language === 'hi' ? 'पानी स्प्रे' : 'Water Stream'}
              </span>
            </div>

            {/* 2. Dry Chemical Powder DCP (Correct for electrical) */}
            <div 
              onClick={() => handleSelectExtinguisher('dcp')}
              className="bg-slate-900/95 hover:bg-emerald-950/80 border-2 border-emerald-400 rounded-2xl p-2 sm:p-2.5 shadow-[0_0_25px_rgba(52,211,153,0.5)] cursor-pointer text-center flex flex-col items-center gap-1 transition-all transform hover:-translate-y-1 active:scale-95 animate-pulse"
            >
              <div className="w-8 h-10 bg-blue-600 border border-yellow-400 rounded flex items-center justify-center text-white font-bold text-[9px] shadow">
                DCP
              </div>
              <span className="text-[11px] font-bold text-emerald-300 leading-tight">
                {language === 'hi' ? 'DCP सूखा' : 'Dry ABC'}
              </span>
              <span className="text-[9px] text-emerald-400 font-bold leading-none">
                {language === 'hi' ? 'विद्युत सुरक्षित' : 'Safe for 440V'}
              </span>
            </div>

            {/* 3. Carbon Dioxide CO2 */}
            <div 
              onClick={() => handleSelectExtinguisher('co2')}
              className="bg-slate-900/90 hover:bg-slate-800 border-2 border-slate-400 rounded-2xl p-2 sm:p-2.5 shadow-xl cursor-pointer text-center flex flex-col items-center gap-1 transition-all transform hover:-translate-y-1 active:scale-95"
            >
              <div className="w-8 h-10 bg-slate-950 border border-slate-300 rounded flex items-center justify-center text-white font-bold text-[9px] shadow">
                CO₂
              </div>
              <span className="text-[11px] font-bold text-slate-200 leading-tight">
                {language === 'hi' ? 'CO2 गैस' : 'CO2 Gas'}
              </span>
              <span className="text-[9px] text-sky-400 font-semibold leading-none">
                {language === 'hi' ? 'अचालक' : 'Non-conduct'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* AR STEP 3: Video Game Extinguisher / Water Jet Cockpit - Pinned to bottom, clear & clickable */}
      {stepIndex === 3 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[calc(100%-1.5rem)] bg-slate-950/95 backdrop-blur-xl border-2 border-amber-500 rounded-3xl p-3.5 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col gap-2.5 pointer-events-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>
                {selectedExtinguisher === 'water'
                  ? (language === 'hi' ? 'पानी स्प्रे सिम्युलेटर' : 'Water Jet Stream Cockpit')
                  : (language === 'hi' ? 'PASS अग्निशामक सिम्युलेटर' : 'P.A.S.S. Extinguisher Simulator')}
              </span>
            </span>
            <span className="text-xs font-black text-slate-100 bg-slate-800 px-3 py-0.5 rounded-full border border-slate-700">
              {language === 'hi' 
                ? `आग बुझी: ${passState.sweepProgress}%` 
                : `Extinguished: ${passState.sweepProgress}%`}
            </span>
          </div>

          {/* Fire Extinguishing Health Progress Bar */}
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 via-emerald-400 to-emerald-500 transition-all duration-300"
              style={{ width: `${passState.sweepProgress}%` }}
            />
          </div>

          {/* PASS Action Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {/* 1. PULL */}
            <button
              onClick={handlePullPin}
              disabled={passState.pinPulled}
              className={`py-3 px-1 rounded-xl text-[11px] font-black flex flex-col items-center gap-1 transition-all cursor-pointer ${
                passState.pinPulled
                  ? 'bg-emerald-950 border border-emerald-500 text-emerald-300 opacity-90'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg animate-bounce border border-white/60'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${passState.pinPulled ? 'text-emerald-400' : 'text-slate-950'}`} />
              <span>1. PULL Pin</span>
            </button>

            {/* 2. AIM */}
            <button
              onClick={handleAim}
              disabled={!passState.pinPulled || passState.aimed}
              className={`py-3 px-1 rounded-xl text-[11px] font-black flex flex-col items-center gap-1 transition-all ${
                passState.aimed
                  ? 'bg-emerald-950 border border-emerald-500 text-emerald-300 opacity-90'
                  : passState.pinPulled
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg animate-bounce border border-white/60 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Target className={`w-4 h-4 ${passState.aimed ? 'text-emerald-400' : ''}`} />
              <span>2. AIM Base</span>
            </button>

            {/* 3. SQUEEZE */}
            <button
              onClick={handleSqueeze}
              disabled={!passState.aimed || passState.squeezed}
              className={`py-3 px-1 rounded-xl text-[11px] font-black flex flex-col items-center gap-1 transition-all ${
                passState.squeezed
                  ? 'bg-emerald-950 border border-emerald-500 text-emerald-300 opacity-90'
                  : passState.aimed
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg animate-bounce border border-white/60 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Play className={`w-4 h-4 ${passState.squeezed ? 'text-emerald-400' : ''}`} />
              <span>3. SQUEEZE</span>
            </button>

            {/* 4. SWEEP / SPRAY BUTTON */}
            <button
              onClick={() => handleSprayBurst(25)}
              onMouseDown={startContinuousSpray}
              onMouseUp={stopContinuousSpray}
              onTouchStart={startContinuousSpray}
              onTouchEnd={stopContinuousSpray}
              disabled={!passState.squeezed || fireExtinguished}
              className={`py-3 px-1 rounded-xl text-[11px] font-black flex flex-col items-center gap-1 transition-all select-none ${
                fireExtinguished
                  ? 'bg-emerald-600 text-white'
                  : passState.squeezed
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 shadow-[0_0_25px_rgba(52,211,153,0.8)] animate-pulse border-2 border-white cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Wind className="w-4 h-4" />
              <span>
                {selectedExtinguisher === 'water' ? 'SPRAY WATER' : '4. SWEEP'}
              </span>
            </button>
          </div>

          {/* Video Game First-Person Spray Prompt */}
          {passState.squeezed && !fireExtinguished && (
            <div className="bg-emerald-950/70 border border-emerald-500/50 rounded-xl px-3 py-1.5 flex items-center justify-between text-xs text-emerald-200">
              <span>
                {language === 'hi'
                  ? '💧 नोजल को आग पर घुमाते हुए पानी/पाउडर स्प्रे करें'
                  : '💧 Hold / Tap button to spray high-pressure stream onto ground fire!'}
              </span>
              <span className="font-bold text-white bg-emerald-700 px-2 py-0.5 rounded text-[10px]">
                {isSprayingContinuous ? 'BLASTING!' : 'READY'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* AR STEP 4: Spatial Emergency Exits (Interactive 3D Doors) */}
      {stepIndex === 4 && (
        <div className="absolute inset-x-4 top-[24%] z-30 flex justify-between gap-3 max-w-3xl mx-auto pointer-events-auto">
          {/* Exit Door 1: Blocked */}
          <div 
            onClick={() => handleSelectExit(1)}
            className="flex-1 bg-slate-950/90 hover:bg-red-950/60 border-2 border-red-500/80 rounded-2xl p-3 sm:p-4 text-center cursor-pointer shadow-xl transition-all transform hover:scale-105 active:scale-95 flex flex-col items-center gap-2"
          >
            <div className="w-12 h-16 bg-red-900/60 border border-red-400 rounded flex items-center justify-center text-red-300">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
            <span className="text-xs font-bold text-white">
              {language === 'hi' ? 'निकास द्वार #1' : 'Exit Door #1'}
            </span>
            <span className="text-[10px] text-red-400 font-semibold bg-red-950/80 px-2 py-0.5 rounded">
              {language === 'hi' ? 'मलबे से अवरुद्ध' : 'Blocked by Debris'}
            </span>
          </div>

          {/* Exit Door 2: SAFE & CLEAR (Green running man) */}
          <div 
            onClick={() => handleSelectExit(2)}
            className="flex-1 bg-slate-950/90 hover:bg-emerald-950/80 border-2 border-emerald-400 rounded-2xl p-3 sm:p-4 text-center cursor-pointer shadow-[0_0_40px_rgba(52,211,153,0.6)] transition-all transform hover:scale-105 active:scale-95 flex flex-col items-center gap-2 animate-pulse"
          >
            <div className="w-12 h-16 bg-emerald-600 border-2 border-white rounded flex items-center justify-center text-white shadow-lg">
              <DoorOpen className="w-8 h-8 text-white" />
            </div>
            <span className="text-xs font-bold text-emerald-300">
              {language === 'hi' ? 'निकास द्वार #2' : 'Exit Door #2'}
            </span>
            <span className="text-[10px] text-emerald-200 font-bold bg-emerald-900 px-2 py-0.5 rounded">
              {language === 'hi' ? 'सुरक्षित निकास मार्ग' : 'CLEAR ROUTE TO MUSTER'}
            </span>
          </div>

          {/* Exit Door 3: Fuel Storage Hazard */}
          <div 
            onClick={() => handleSelectExit(3)}
            className="flex-1 bg-slate-950/90 hover:bg-red-950/60 border-2 border-red-500/80 rounded-2xl p-3 sm:p-4 text-center cursor-pointer shadow-xl transition-all transform hover:scale-105 active:scale-95 flex flex-col items-center gap-2"
          >
            <div className="w-12 h-16 bg-amber-950/60 border border-amber-400 rounded flex items-center justify-center text-amber-300">
              <ShieldAlert className="w-8 h-8 text-amber-400" />
            </div>
            <span className="text-xs font-bold text-white">
              {language === 'hi' ? 'निकास द्वार #3' : 'Exit Door #3'}
            </span>
            <span className="text-[10px] text-amber-400 font-semibold bg-amber-950/80 px-2 py-0.5 rounded">
              {language === 'hi' ? 'रासायनिक गैस कक्ष' : 'Chemical Storage'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
