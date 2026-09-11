import React, { useState, useEffect, useRef } from 'react';
import { Zap, ShieldAlert, CheckCircle2, AlertOctagon, Flame, Eye, LifeBuoy } from 'lucide-react';
import { Language } from '../../types';
import { audioAssistant } from '../../utils/audioAssistant';
import { translations } from '../../data/translations';
import { haptics } from '../../utils/haptics';
import { GameArcCanvas } from './GameArcCanvas';

interface ElectricalArcScenarioProps {
  stepIndex: number;
  language: Language;
  onStepComplete: () => void;
  isPlaneLocked: boolean;
  onAwardPoints?: (points: number, reason: string) => void;
  onIncorrectAction?: (reason: string) => void;
}

export const ElectricalArcScenario: React.FC<ElectricalArcScenarioProps> = ({
  stepIndex,
  language,
  onStepComplete,
  isPlaneLocked,
  onAwardPoints,
  onIncorrectAction
}) => {
  const t = translations[language];

  // Electrical States
  const [boundaryIdentified, setBoundaryIdentified] = useState<boolean>(false);
  const [ppeArcSuitDonned, setPpeArcSuitDonned] = useState<boolean>(false);
  const [voltageTested, setVoltageTested] = useState<boolean>(false);
  const [rescueHookDeployed, setRescueHookDeployed] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const hasTriggeredStep0Ref = useRef<boolean>(false);

  useEffect(() => {
    if (stepIndex !== 0) {
      hasTriggeredStep0Ref.current = false;
    }
  }, [stepIndex]);

  // Audio crackling while arc is active in steps 1 & 2
  useEffect(() => {
    if (!voltageTested && stepIndex > 0) {
      audioAssistant.playArcCrackling(2800);
      const interval = setInterval(() => {
        if (!voltageTested) {
          audioAssistant.playArcCrackling(2200);
        }
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [voltageTested, stepIndex]);

  // Auto advance on plane lock for step 0
  useEffect(() => {
    if (stepIndex === 0 && isPlaneLocked && !hasTriggeredStep0Ref.current) {
      hasTriggeredStep0Ref.current = true;
      const timer = setTimeout(() => {
        haptics.trigger('plane_lock', 'High-Voltage Switchyard Anchored');
        audioAssistant.playSuccessChime();
        onAwardPoints?.(10, language === 'hi' ? 'सतह पहचानी गई' : 'AR Surface plane locked');
        onStepComplete();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [stepIndex, isPlaneLocked, onStepComplete, onAwardPoints, language]);

  // Handle Arc Flash Boundary (Step 1)
  const handleCheckBoundary = () => {
    haptics.trigger('warning', 'Arc Flash Boundary Established');
    setBoundaryIdentified(true);
    audioAssistant.playSuccessChime();
    onAwardPoints?.(15, language === 'hi' ? 'आर्क फ्लैश सीमा चिह्नित (+15 अंक)' : 'Arc flash boundary identified (+15 PTS)');
    setSuccessToast(
      language === 'hi'
        ? 'आर्क फ्लैश व पिघली धातु सीमा (1.5m) चिह्नित! बिना सूट के प्रवेश वर्जित।'
        : language === 'sat'
        ? 'ᱵᱤᱡᱽᱞᱤ ᱟᱨ ᱞᱚᱞᱚ ᱢᱮᱬᱦᱮᱫ ᱵᱚᱛᱚᱨ ᱥᱤᱢᱟᱹ ᱪᱤᱱᱦᱟᱹᱣ ᱮᱱᱟ!'
        : 'Arc Flash & Molten Metal Prohibited Boundary (1.5m) Established!'
    );
    setTimeout(() => {
      setSuccessToast(null);
      onStepComplete();
    }, 1400);
  };

  // Handle Cat-4 Arc Flash PPE Donning (Step 2)
  const handleDonArcSuit = () => {
    haptics.trigger('ppe_equip', 'Category-4 40 cal Arc Suit Latched');
    setPpeArcSuitDonned(true);
    audioAssistant.playSuccessChime();
    onAwardPoints?.(15, language === 'hi' ? '40 cal सूट व 36kV दस्ताने पहने (+15 अंक)' : 'Category-4 Arc Suit equipped (+15 PTS)');
    setSuccessToast(
      language === 'hi'
        ? '40 cal/cm² आर्क फ्लैश सूट + 36kV इंसुलेटेड दस्ताने सुरक्षित पहने गए!'
        : language === 'sat'
        ? '40 cal ᱟᱨᱠ ᱥᱩᱴ ᱟᱨ ᱵᱤᱡᱽᱞᱤ ᱢᱳᱡᱟ ᱦᱚᱨᱚᱜ ᱮᱱᱟ!'
        : 'Category-4 40 cal/cm² Arc Flash Suit & 36kV Gloves Equipped!'
    );
    setTimeout(() => {
      setSuccessToast(null);
      onStepComplete();
    }, 1400);
  };

  // Handle Hot Stick Voltage Detector (Step 3)
  const handleProbeVoltage = () => {
    haptics.trigger('voltage_probe', 'Hot Stick Zero Voltage Confirmed');
    setVoltageTested(true);
    audioAssistant.playGasDetectorBeep('critical');
    audioAssistant.playSuccessChime();
    onAwardPoints?.(15, language === 'hi' ? 'हॉट स्टिक शून्य वोल्टेज सत्यापित (+15 अंक)' : 'Zero voltage verified with hot stick (+15 PTS)');
    setSuccessToast(
      language === 'hi'
        ? 'हॉट स्टिक टेस्ट: 33kV बसबार डी-एनर्जाइज्ड (0.0 kV)! सुरक्षित।'
        : language === 'sat'
        ? 'ᱦᱚᱴ ᱥᱴᱤᱠ ᱴᱮᱥᱴ: 33kV ᱞᱟᱭᱤᱱ ᱨᱮ ᱠᱟᱨᱮᱱᱴ ᱵᱟᱹᱱᱩᱜ-ᱟ (0.0 kV)!'
        : 'Hot Stick Test-Before-Touch: 33kV Busbar Confirmed Dead (0.0 kV)!'
    );
    setTimeout(() => {
      setSuccessToast(null);
      onStepComplete();
    }, 1500);
  };

  // Handle Insulated Shepherd's Rescue Hook (Step 4)
  const handleDeployRescueHook = () => {
    haptics.trigger('rescue_hook', 'Dielectric Rescue Hook Deployed');
    setRescueHookDeployed(true);
    audioAssistant.playMechanicalLeverPull();
    audioAssistant.playSuccessChime();
    onAwardPoints?.(15, language === 'hi' ? 'इंसुलेटेड रेस्क्यू हुक तैनात (+15 अंक)' : 'Dielectric rescue hook deployed (+15 PTS)');
    setSuccessToast(
      language === 'hi'
        ? 'इंसुलेटेड रेस्क्यू हुक द्वारा पीड़ित को सुरक्षित अलग किया गया!'
        : language === 'sat'
        ? 'ᱤᱱᱥᱩᱞᱮᱴᱮᱰ ᱦᱩᱠ ᱛᱮ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱥᱟᱦᱟ ᱠᱮᱫᱮᱭᱟᱢ (ᱨᱩᱠᱷᱤᱭᱟᱹ ᱜᱮᱭᱟ)!'
        : 'Insulated Rescue Hook Deployed! Non-conductive extraction safe.'
    );
    setTimeout(() => {
      setSuccessToast(null);
      onStepComplete();
    }, 1500);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Toast Notifications */}
      {successToast && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-green-950/95 border-2 border-green-500 text-green-100 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{successToast}</span>
        </div>
      )}

      {errorMessage && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-red-950/95 border-2 border-red-500 text-red-100 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-pulse">
          <AlertOctagon className="w-5 h-5 text-red-400 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{errorMessage}</span>
        </div>
      )}

      {/* 3D AR Ground Switchgear & High Voltage Plasma Arc Flash Engine */}
      <div className="absolute bottom-[180px] sm:bottom-[200px] left-1/2 -translate-x-1/2 pointer-events-none z-10 flex flex-col items-center">
        <GameArcCanvas
          isArcActive={!voltageTested}
          voltageTested={stepIndex === 3 || voltageTested}
          rescueHookDeployed={rescueHookDeployed}
          width={360}
          height={320}
        />

        {/* Real-time High Voltage Status Badge */}
        <div className="relative -mt-6 bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-1 shadow-xl flex items-center gap-2 text-[11px] font-bold">
          <Zap className={`w-4 h-4 ${voltageTested ? 'text-emerald-400' : 'text-cyan-400 animate-pulse'}`} />
          <span className={voltageTested ? 'text-emerald-300' : 'text-cyan-300'}>
            {voltageTested ? '0.0 kV DE-ENERGIZED (SAFE)' : '33,000V LIVE ELECTRICAL HAZARD'}
          </span>
        </div>
      </div>

      {/* STEP 1: Arc Flash Boundary Identification */}
      {stepIndex === 1 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[calc(100%-1.5rem)] bg-slate-950/95 backdrop-blur-xl border-2 border-cyan-400 rounded-3xl p-4 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col items-center gap-3 pointer-events-auto">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-black uppercase text-cyan-400 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-cyan-400" />
              {language === 'hi' ? 'आर्क फ्लैश सीमा निरीक्षण' : 'Arc Flash Boundary Perimeter'}
            </span>
            <span className="px-2.5 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-600 rounded-full text-[10px] font-bold">
              1.5M PROHIBITED
            </span>
          </div>

          <p className="text-xs text-slate-200 text-center font-medium">
            {language === 'hi'
              ? '33kV स्विचगियर के चारों ओर 1.5 मीटर की खतरनाक आर्क सीमा स्थापित करें।'
              : 'Establish the 1.5-meter prohibited arc flash boundary perimeter.'}
          </p>

          <button
            id="btn-check-boundary"
            onClick={handleCheckBoundary}
            className="w-full py-4 bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer animate-bounce border-2 border-white/60"
          >
            <Zap className="w-5 h-5 text-slate-950" />
            <span>{language === 'hi' ? 'सीमा चिह्नित करें (ESTABLISH BOUNDARY)' : 'Establish Arc Flash Boundary'}</span>
          </button>
        </div>
      )}

      {/* STEP 2: Don Category-4 Arc Suit */}
      {stepIndex === 2 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[calc(100%-1.5rem)] bg-slate-950/95 backdrop-blur-xl border-2 border-amber-500 rounded-3xl p-4 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col gap-3 pointer-events-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              {language === 'hi' ? '40 cal/cm² आर्क फ्लैश सूट' : 'Category-4 40 cal/cm² Arc Suit'}
            </span>
            <span className="text-xs font-bold text-amber-300 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-600">
              {ppeArcSuitDonned ? 'DONNED' : 'REQUIRED'}
            </span>
          </div>

          <p className="text-xs text-slate-200 text-center font-medium">
            {language === 'hi'
              ? '40 cal/cm² आर्क सूट, फेस शील्ड और 36kV इंसुलेटेड दस्ताने पहनें।'
              : 'Don Category-4 40 cal/cm² suit, hood, face shield and 36kV Class 4 dielectric gloves.'}
          </p>

          <button
            id="btn-don-arc-suit"
            onClick={handleDonArcSuit}
            disabled={ppeArcSuitDonned}
            className={`w-full py-4 rounded-2xl font-black uppercase tracking-wider text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer border-2 ${
              ppeArcSuitDonned
                ? 'bg-green-700 text-white border-green-500 cursor-default'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 border-white/60 animate-pulse'
            }`}
          >
            <ShieldAlert className="w-5 h-5" />
            <span>
              {ppeArcSuitDonned
                ? (language === 'hi' ? 'आर्क सूट पहना गया' : 'Category-4 Arc Suit Donned')
                : (language === 'hi' ? 'आर्क सूट व 36kV दस्ताने पहनें' : 'DON 40 CAL SUIT & 36KV GLOVES')}
            </span>
          </button>
        </div>
      )}

      {/* STEP 3: Hot Stick Voltage Detector */}
      {stepIndex === 3 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[calc(100%-1.5rem)] bg-slate-950/95 backdrop-blur-xl border-2 border-yellow-500 rounded-3xl p-4 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col gap-3 pointer-events-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-yellow-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-yellow-400" />
              {language === 'hi' ? 'हॉट स्टिक वोल्टेज डिटेक्टर' : 'High-Voltage Hot Stick Probe'}
            </span>
            <span className="text-xs font-bold text-yellow-300 bg-yellow-950 px-2.5 py-0.5 rounded-full border border-yellow-600">
              {voltageTested ? '0.0 kV SAFE' : 'LIVE 33kV'}
            </span>
          </div>

          <p className="text-xs text-slate-200 text-center font-medium">
            {language === 'hi'
              ? 'हॉट स्टिक द्वारा बसबार की जांच करें और शून्य वोल्टेज सत्यापित करें।'
              : 'Execute test-before-touch protocol with dielectric hot stick on medium voltage busbars.'}
          </p>

          <button
            id="btn-probe-voltage"
            onClick={handleProbeVoltage}
            disabled={voltageTested}
            className={`w-full py-4 rounded-2xl font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all transform active:scale-95 text-xs sm:text-sm cursor-pointer border-2 ${
              voltageTested
                ? 'bg-green-700 text-white border-green-500 cursor-default'
                : 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 border-white/60 animate-bounce'
            }`}
          >
            <Zap className="w-5 h-5" />
            <span>
              {voltageTested
                ? (language === 'hi' ? '0.0 kV डी-एनर्जाइज्ड प्रमाणित' : '0.0 kV DE-ENERGIZED CONFIRMED')
                : (language === 'hi' ? 'वोल्टेज टेस्ट करें (TEST BEFORE TOUCH)' : 'PROBE BUSBAR (TEST-BEFORE-TOUCH)')}
            </span>
          </button>
        </div>
      )}

      {/* STEP 4: Insulated Rescue Hook */}
      {stepIndex === 4 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[calc(100%-1.5rem)] bg-slate-950/95 backdrop-blur-xl border-2 border-emerald-500 rounded-3xl p-4 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col items-center gap-3 pointer-events-auto">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-black uppercase text-emerald-400 flex items-center gap-1.5">
              <LifeBuoy className="w-4 h-4 text-emerald-500" />
              {language === 'hi' ? 'इंसुलेटेड रेस्क्यू हुक' : 'Dielectric Body Rescue Hook'}
            </span>
            <span className="text-xs font-bold text-emerald-300 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-600">
              {rescueHookDeployed ? 'DEPLOYED' : 'READY'}
            </span>
          </div>

          <p className="text-xs text-slate-200 text-center font-medium">
            {language === 'hi'
              ? 'इंसुलेटेड डाईइलेक्ट्रिक हुक द्वारा पीड़ित को लाइव कंडक्टर से सुरक्षित खींचें।'
              : 'Deploy rated fiberglass shepherd hook to safely retrieve victim without secondary shock.'}
          </p>

          <button
            id="btn-deploy-rescue-hook"
            onClick={handleDeployRescueHook}
            disabled={rescueHookDeployed}
            className={`w-full py-4 rounded-2xl font-black uppercase tracking-wider text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer border-2 ${
              rescueHookDeployed
                ? 'bg-emerald-600 text-white border-emerald-500 cursor-default'
                : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 border-white/60 animate-pulse'
            }`}
          >
            <LifeBuoy className="w-5 h-5" />
            <span>
              {rescueHookDeployed
                ? (language === 'hi' ? 'रेस्क्यू हुक तैनात' : 'Dielectric Hook Deployed')
                : (language === 'hi' ? 'इंसुलेटेड हुक द्वारा बचाव करें' : 'DEPLOY INSULATED RESCUE HOOK')}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
