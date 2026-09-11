import React, { useState, useEffect, useRef } from 'react';
import { Cog, ShieldAlert, CheckCircle2, AlertOctagon, Lock, Power, RotateCcw, Sparkles } from 'lucide-react';
import { Language } from '../../types';
import { audioAssistant } from '../../utils/audioAssistant';
import { translations } from '../../data/translations';
import { haptics } from '../../utils/haptics';
import { GameMachineryCanvas } from './GameMachineryCanvas';

interface MachinerySafetyScenarioProps {
  stepIndex: number;
  language: Language;
  onStepComplete: () => void;
  isPlaneLocked: boolean;
  onAwardPoints?: (points: number, reason: string) => void;
  onIncorrectAction?: (reason: string) => void;
}

export const MachinerySafetyScenario: React.FC<MachinerySafetyScenarioProps> = ({
  stepIndex,
  language,
  onStepComplete,
  isPlaneLocked,
  onAwardPoints,
  onIncorrectAction
}) => {
  const t = translations[language];

  // Machinery States
  const [pinchPointIdentified, setPinchPointIdentified] = useState<boolean>(false);
  const [beltSpeed, setBeltSpeed] = useState<number>(100); // 100% running down to 0%
  const [eStopPulled, setEStopPulled] = useState<boolean>(false);
  const [lotoHaspApplied, setLotoHaspApplied] = useState<boolean>(false);
  const [zeroEnergyVerified, setZeroEnergyVerified] = useState<boolean>(false);
  const [testPushCount, setTestPushCount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const hasTriggeredStep0Ref = useRef<boolean>(false);

  useEffect(() => {
    if (stepIndex !== 0) {
      hasTriggeredStep0Ref.current = false;
    }
  }, [stepIndex]);

  // Auto advance on plane lock for step 0
  useEffect(() => {
    if (stepIndex === 0 && isPlaneLocked && !hasTriggeredStep0Ref.current) {
      hasTriggeredStep0Ref.current = true;
      const timer = setTimeout(() => {
        haptics.trigger('plane_lock', 'Heavy Machinery Bay Anchored');
        audioAssistant.playSuccessChime();
        onAwardPoints?.(10, language === 'hi' ? 'सतह पहचानी गई' : 'AR Surface plane locked');
        onStepComplete();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [stepIndex, isPlaneLocked, onStepComplete, onAwardPoints, language]);

  // Handle Pinch Point Inspection (Step 1)
  const handleInspectPinchPoint = () => {
    haptics.trigger('warning', 'In-Running Pinch Point Hazard Marked');
    setPinchPointIdentified(true);
    audioAssistant.playSuccessChime();
    onAwardPoints?.(15, language === 'hi' ? 'कन्वेयर निप-पॉइंट चिह्नित (+15 अंक)' : 'In-running nip point identified (+15 PTS)');
    setSuccessToast(
      language === 'hi'
        ? 'कन्वेयर निप-पॉइंट चिह्नित! भारी अंग क्षति का गंभीर खतरा।'
        : language === 'sat'
        ? 'ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱱᱤᱯ ᱯᱚᱭᱮᱱᱴ ᱧᱮᱞ ᱮᱱᱟ! ᱟᱹᱰᱤ ᱵᱚᱛᱚᱨ ᱴᱷᱟᱶ᱾'
        : 'Rotating Nip Point Identified! High Crush & In-Running Hazard.'
    );
    setTimeout(() => {
      setSuccessToast(null);
      onStepComplete();
    }, 1400);
  };

  // Handle Emergency Pull Cord Pull (Step 2)
  const handlePullCord = () => {
    if (eStopPulled) return;
    haptics.trigger('e_stop', 'Emergency Pull-Cord Tripped');
    setEStopPulled(true);
    setBeltSpeed(0);
    audioAssistant.playMechanicalLeverPull();
    setTimeout(() => {
      audioAssistant.playAlarmSiren(1800);
    }, 200);
    onAwardPoints?.(15, language === 'hi' ? 'आपातकालीन पुल-कॉर्ड ट्रिप किया (+15 अंक)' : 'Emergency pull cord tripped (+15 PTS)');
    setSuccessToast(
      language === 'hi'
        ? 'आपातकालीन पुल-कॉर्ड ट्रिप हुआ! कन्वेयर मोटर तुरंत रुक गई।'
        : language === 'sat'
        ? 'ᱤᱢᱟᱨᱡᱮᱱᱥᱤ ᱫᱟᱹᱲᱤ ᱚᱨ ᱮᱱᱟ! ᱢᱤᱥᱤᱱ ᱞᱚᱜᱚᱱ ᱛᱤᱸᱜᱩ ᱮᱱᱟ᱾'
        : 'Emergency Pull-Cord Tripped! Drive Motor Decelerated to 0 RPM.'
    );
    setTimeout(() => {
      setSuccessToast(null);
      onStepComplete();
    }, 1500);
  };

  // Handle LOTO Hasp & Padlock Clamp (Step 3)
  const handleApplyLOTO = () => {
    haptics.trigger('loto_lock', 'LOTO Padlock #415V Clamped');
    setLotoHaspApplied(true);
    audioAssistant.playMechanicalLeverPull();
    audioAssistant.playSuccessChime();
    onAwardPoints?.(15, language === 'hi' ? 'LOTO हैस्प व लाल ताला लगाया (+15 अंक)' : 'LOTO hasp & padlock clamped (+15 PTS)');
    setSuccessToast(
      language === 'hi'
        ? 'LOTO मल्टी-हैस्प व लाल ताला #LOTO-415V लॉक किया गया!'
        : language === 'sat'
        ? 'LOTO ᱛᱟᱞᱟ ᱟᱨ ᱴᱮᱜᱽ #LOTO-415V ᱞᱟᱜᱟᱣ ᱮᱱᱟ!'
        : 'LOTO Lockout Hasp & Danger Tag Secured on 415V MCC Switch!'
    );
    setTimeout(() => {
      setSuccessToast(null);
      onStepComplete();
    }, 1400);
  };

  // Handle Zero Energy Test Pushbutton (Step 4)
  const handleTestZeroEnergy = () => {
    haptics.trigger('voltage_probe', 'Zero Residual Energy Verified');
    const newCount = testPushCount + 1;
    setTestPushCount(newCount);

    if (newCount >= 1) {
      setZeroEnergyVerified(true);
      audioAssistant.playSuccessChime();
      onAwardPoints?.(15, language === 'hi' ? 'शून्य ऊर्जा अवस्था सत्यापित (+15 अंक)' : 'Zero energy state verified (+15 PTS)');
      setSuccessToast(
        language === 'hi'
          ? 'शून्य ऊर्जा अवस्था (Zero Energy State) सत्यापित! कोई अवशिष्ट वोल्टेज नहीं।'
          : language === 'sat'
          ? 'Zero Energy ᱴᱷᱤᱠ ᱮᱱᱟ! ᱢᱤᱥᱤᱱ ᱨᱮ ᱠᱟᱨᱮᱱᱴ ᱵᱟᱹᱱᱩᱜ-ᱟ᱾'
          : 'Zero Energy State Verified! Residual Kinetic & Electric Energy Cleared.'
      );
      setTimeout(() => {
        setSuccessToast(null);
        onStepComplete();
      }, 1500);
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Toast Notifications */}
      {successToast && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 bg-green-950/95 border-2 border-green-500 text-green-100 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{successToast}</span>
        </div>
      )}

      {errorMessage && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 bg-red-950/95 border-2 border-red-500 text-red-100 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-pulse">
          <AlertOctagon className="w-5 h-5 text-red-400 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{errorMessage}</span>
        </div>
      )}

      {/* 3D AR Ground Plane Heavy Conveyor & Rotating Gear Machinery (Elevated for full visibility) */}
      <div className="absolute bottom-[180px] sm:bottom-[200px] left-1/2 -translate-x-1/2 pointer-events-none z-10 flex flex-col items-center">
        <GameMachineryCanvas
          beltSpeed={beltSpeed}
          eStopPulled={eStopPulled}
          lotoApplied={lotoHaspApplied}
          width={380}
          height={320}
        />

        {/* Real-time RPM Speed Status Badge */}
        <div className="relative -mt-6 bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-1 shadow-xl flex items-center gap-2 text-[11px] font-bold">
          <span className={`w-2.5 h-2.5 rounded-full ${beltSpeed > 0 ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`} />
          <span className={beltSpeed > 0 ? 'text-amber-300' : 'text-emerald-300'}>
            {beltSpeed > 0 ? `1450 RPM (RUNNING: ${beltSpeed}%)` : '0 RPM (HALTED & SAFE)'}
          </span>
        </div>
      </div>

      {/* STEP 1: Identify Rotating Nip Points / Pinch Zones - Pinned to bottom, clear & clickable */}
      {stepIndex === 1 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[calc(100%-1.5rem)] bg-slate-950/95 backdrop-blur-xl border-2 border-red-500 rounded-3xl p-4 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col items-center gap-3 pointer-events-auto">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-black uppercase tracking-wider text-red-400 flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 text-red-500" />
              {language === 'hi' ? 'घूर्णन निप पॉइंट पहचान' : 'Rotating Nip Point Hazard'}
            </span>
            <span className="px-2.5 py-0.5 bg-red-950 text-red-300 border border-red-600 rounded-full text-[10px] font-bold">
              UNGUARDED
            </span>
          </div>

          <p className="text-xs text-slate-200 text-center font-medium">
            {language === 'hi'
              ? 'कन्वेयर बेल्ट व पुली के बीच इन-रनिंग निप पॉइंट को चिह्नित करने के लिए बटन दबाएं।'
              : 'Tap to flag the high-hazard in-running nip point between moving belt and drive pulley.'}
          </p>

          <button
            id="btn-inspect-pinch-point"
            onClick={handleInspectPinchPoint}
            className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.6)] transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer animate-pulse border-2 border-white/60"
          >
            <AlertOctagon className="w-5 h-5 text-white" />
            <span>{language === 'hi' ? 'निप पॉइंट चिह्नित करें (FLAG HAZARD)' : 'FLAG IN-RUNNING NIP POINT'}</span>
          </button>
        </div>
      )}

      {/* STEP 2: Emergency Pull-Cord Tripwire Activation */}
      {stepIndex === 2 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[calc(100%-1.5rem)] bg-slate-950/95 backdrop-blur-xl border-2 border-red-500 rounded-3xl p-4 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col gap-3 pointer-events-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-red-400 flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 text-red-500" />
              {language === 'hi' ? 'आपातकालीन स्टॉप पुल-कॉर्ड' : 'Emergency Pull-Cord (E-Stop)'}
            </span>
            <span className={`text-xs font-mono font-black px-2.5 py-0.5 rounded-full ${beltSpeed > 0 ? 'bg-red-900 text-red-200 animate-pulse' : 'bg-green-900 text-green-200'}`}>
              {beltSpeed > 0 ? `Speed: ${beltSpeed}%` : 'HALTED'}
            </span>
          </div>

          <p className="text-xs text-slate-200 text-center font-medium">
            {language === 'hi'
              ? 'मोटर को तुरंत बंद करने के लिए लाल पुल-कॉर्ड केबल स्विच खींचें।'
              : 'Pull the continuous trip wire cable switch along conveyor frame to kill motor power.'}
          </p>

          <button
            id="btn-pull-emergency-cord"
            onClick={handlePullCord}
            disabled={eStopPulled}
            className={`w-full py-4 rounded-2xl font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all transform active:scale-95 text-sm cursor-pointer border-2 ${
              eStopPulled 
                ? 'bg-green-700 text-white border-green-500 cursor-default' 
                : 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white border-white/60 animate-bounce'
            }`}
          >
            <Power className="w-5 h-5" />
            <span>
              {eStopPulled
                ? (language === 'hi' ? 'मोटर बंद कर दी गई (0 RPM)' : 'CONVEYOR HALTED (0 RPM)')
                : (language === 'hi' ? 'पुल-कॉर्ड रस्सी खींचें (PULL CABLE)' : 'PULL EMERGENCY CORD TO STOP')}
            </span>
          </button>
        </div>
      )}

      {/* STEP 3: Apply LOTO Isolation & Padlock on 415V Isolator */}
      {stepIndex === 3 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[calc(100%-1.5rem)] bg-slate-950/95 backdrop-blur-xl border-2 border-amber-500 rounded-3xl p-4 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col gap-3 pointer-events-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-amber-500" />
              415V MCC Motor Feeder Isolator Switch
            </span>
            <span className="text-xs font-bold text-amber-300 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-600">
              {lotoHaspApplied ? 'LOCKED' : 'UNLOCKED'}
            </span>
          </div>

          <p className="text-xs text-slate-200 text-center font-medium">
            {language === 'hi'
              ? '415V आइसोलेटर स्विच पर LOTO सुरक्षा हैस्प और डेंजर टैग लॉक करें।'
              : 'Attach multi-lockout scissor hasp and personal danger lockout padlock to electrical switch.'}
          </p>

          <button
            id="btn-apply-loto-hasp"
            onClick={handleApplyLOTO}
            disabled={lotoHaspApplied}
            className={`w-full py-4 rounded-2xl font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all transform active:scale-95 text-sm cursor-pointer border-2 ${
              lotoHaspApplied
                ? 'bg-green-700 text-white border-green-500 cursor-default'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 border-white/60 animate-pulse'
            }`}
          >
            <Lock className="w-5 h-5" />
            <span>
              {lotoHaspApplied
                ? (language === 'hi' ? 'LOTO ताला और डेंजर टैग सुरक्षित!' : 'LOTO PADLOCK #881 & TAG ATTACHED!')
                : (language === 'hi' ? 'LOTO क्लैंप व लाल ताला लगाएं' : 'APPLY LOTO HASP & DANGER TAG')}
            </span>
          </button>
        </div>
      )}

      {/* STEP 4: Test Zero Energy State Verification */}
      {stepIndex === 4 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[calc(100%-1.5rem)] bg-slate-950/95 backdrop-blur-xl border-2 border-emerald-500 rounded-3xl p-4 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col items-center gap-3 pointer-events-auto">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              {language === 'hi' ? 'शून्य ऊर्जा सत्यापन (Zero Energy Push-Test)' : 'Zero Energy Push-Test Protocol'}
            </span>
            <span className="text-xs font-bold text-emerald-300 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-600">
              {zeroEnergyVerified ? '0.0V SAFE' : 'PUSH TEST'}
            </span>
          </div>

          <p className="text-xs text-slate-200 text-center font-medium">
            {language === 'hi'
              ? 'स्थानीय स्टार्ट बटन दबाकर पुष्टि करें कि मोटर बिल्कुल चालू नहीं हो रही है।'
              : 'Push local START button to verify positive physical disconnection before hands-on entry.'}
          </p>

          <button
            id="btn-test-zero-energy"
            onClick={handleTestZeroEnergy}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 rounded-2xl font-black uppercase tracking-wider text-sm shadow-[0_0_30px_rgba(52,211,153,0.6)] flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer animate-pulse border-2 border-white/60"
          >
            <Power className="w-5 h-5 text-slate-950" />
            <span>{language === 'hi' ? 'लोकल स्टार्ट बटन दबाएं (TEST)' : 'TEST LOCAL START BUTTON (0 RPM)'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
