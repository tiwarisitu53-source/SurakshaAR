import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, CheckCircle2, AlertOctagon, Anchor, Award, ArrowUpCircle, Link, Activity } from 'lucide-react';
import { Language } from '../../types';
import { audioAssistant } from '../../utils/audioAssistant';
import { translations } from '../../data/translations';
import { haptics } from '../../utils/haptics';
import { GameHeightCanvas } from './GameHeightCanvas';

interface HeightSafetyScenarioProps {
  stepIndex: number;
  language: Language;
  onStepComplete: () => void;
  isPlaneLocked: boolean;
  onAwardPoints?: (points: number, reason: string) => void;
  onIncorrectAction?: (reason: string) => void;
}

export const HeightSafetyScenario: React.FC<HeightSafetyScenarioProps> = ({
  stepIndex,
  language,
  onStepComplete,
  isPlaneLocked,
  onAwardPoints,
  onIncorrectAction
}) => {
  const t = translations[language];

  // Height Safety states
  const [scaffoldTagChecked, setScaffoldTagChecked] = useState<boolean>(false);
  const [harnessFitted, setHarnessFitted] = useState<boolean>(false);
  const [lanyardHooksConnected, setLanyardHooksConnected] = useState<number>(0); // 0, 1, 2
  const [anchorLoadTested, setAnchorLoadTested] = useState<boolean>(false);
  const [traumaStrapDeployed, setTraumaStrapDeployed] = useState<boolean>(false);
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
        haptics.trigger('plane_lock', 'High-Elevation Work Platform Anchored');
        audioAssistant.playSuccessChime();
        onAwardPoints?.(10, language === 'hi' ? 'सतह पहचानी गई' : 'AR Surface plane locked');
        onStepComplete();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [stepIndex, isPlaneLocked, onStepComplete, onAwardPoints, language]);

  // Handle Scaffold Tag Inspection (Step 1)
  const handleInspectScaffoldTag = () => {
    haptics.trigger('scaffold_inspect', 'Scaffold Green Tag Certified');
    setScaffoldTagChecked(true);
    audioAssistant.playSuccessChime();
    onAwardPoints?.(15, language === 'hi' ? 'मचान ग्रीन टैग सत्यापित (+15 अंक)' : 'Scaffold Green Tag Verified (+15 PTS)');
    setSuccessToast(
      language === 'hi'
        ? 'मचान (Scaffolding) ग्रीन टैग सत्यापित! लोड क्षमता: 450 kg (सुरक्षित)'
        : language === 'sat'
        ? 'ᱥᱠᱮᱯᱷᱳᱞᱰᱤᱝ ᱜᱽᱨᱤᱱ ᱴᱮᱜᱽ ᱴᱷᱤᱠ ᱮᱱᱟ! (ᱨᱩᱠᱷᱤᱭᱟᱹ ᱜᱮᱭᱟ)'
        : 'Scaffold Green Tag Verified! Base jacks, toe-boards & handrails PASS.'
    );
    setTimeout(() => {
      setSuccessToast(null);
      onStepComplete();
    }, 1400);
  };

  // Handle Double-Lanyard 100% Tie-off Hook Connection (Step 2)
  const handleConnectLanyard = () => {
    const nextCount = lanyardHooksConnected + 1;
    setLanyardHooksConnected(nextCount);
    audioAssistant.playMechanicalLeverPull();

    if (nextCount === 1) {
      haptics.trigger('buddy_lifeline', 'Lanyard Snap Hook #1 Latched');
      audioAssistant.playSuccessChime();
      onAwardPoints?.(10, 'Hook #1 Snapped (+10 PTS)');
      setSuccessToast(
        language === 'hi'
          ? 'पहला हुक जुड़ा (50% सुरक्षित)। अब दूसरा हुक कनेक्ट करें!'
          : language === 'sat'
          ? 'ᱯᱩᱭᱞᱩ ᱦᱩᱠ ᱞᱟᱜᱟᱣ ᱮᱱᱟ᱾ ᱫᱚᱥᱟᱨ ᱦᱩᱠ ᱡᱚᱲᱟᱣ ᱢᱮ!'
          : 'Hook #1 Snapped! Connect Hook #2 for 100% Continuous Tie-Off.'
      );
    } else if (nextCount >= 2) {
      haptics.trigger('buddy_lifeline', '100% Dual-Lanyard Tie-Off Locked');
      audioAssistant.playSuccessChime();
      onAwardPoints?.(15, language === 'hi' ? '100% टाई-ऑफ पूर्ण (+15 अंक)' : '100% Continuous Tie-Off Confirmed (+15 PTS)');
      setSuccessToast(
        language === 'hi'
          ? '100% टाई-ऑफ पूर्ण! दोनों शॉक-एब्जॉर्बर स्नैप हुक लाइफलाइन पर लॉक हैं।'
          : language === 'sat'
          ? '100% ᱴᱟᱭ-ᱚᱯᱷ ᱯᱩᱨᱟᱹᱣ ᱮᱱᱟ! ᱵᱟᱱᱟᱨ ᱦᱩᱠ ᱞᱚᱠ ᱮᱱᱟ᱾'
          : '100% Continuous Dual-Lanyard Tie-Off Confirmed! Zero Free-Fall Exposure.'
      );
      setTimeout(() => {
        setSuccessToast(null);
        onStepComplete();
      }, 1400);
    }
  };

  // Handle Overhead Anchor Point Load Test (Step 3)
  const handleTestAnchor = () => {
    haptics.trigger('anchor_test', 'Overhead Anchor 22.2 kN Load Verified');
    setAnchorLoadTested(true);
    audioAssistant.playSuccessChime();
    onAwardPoints?.(15, language === 'hi' ? 'एंकर लोड टेस्ट पास (22.2 kN) (+15 अंक)' : 'Anchor Load Tested 22.2 kN (+15 PTS)');
    setSuccessToast(
      language === 'hi'
        ? 'एंकर लोड टेस्ट: 22.2 kN (5,000 lbs) क्षमता सत्यापित! पूर्ण सुरक्षित।'
        : language === 'sat'
        ? 'एंकर ᱴᱮᱥᱴ ᱯᱟᱥ: 22.2 kN (ᱨᱩᱠᱷᱤᱭᱟᱹ ᱜᱮᱭᱟ)!'
        : 'Overhead Anchor Verified: 22.2 kN (5,000 lbs) Certified for Dual Tie-off.'
    );
    setTimeout(() => {
      setSuccessToast(null);
      onStepComplete();
    }, 1400);
  };

  // Handle Suspension Trauma Relief Strap (Step 4)
  const handleDeployTraumaStrap = () => {
    haptics.trigger('trauma_strap', 'Suspension Trauma Relief Deployed');
    setTraumaStrapDeployed(true);
    audioAssistant.playSuccessChime();
    onAwardPoints?.(15, language === 'hi' ? 'ट्रॉमा स्ट्रैप खोला (+15 अंक)' : 'Trauma Relief Strap Deployed (+15 PTS)');
    setSuccessToast(
      language === 'hi'
        ? 'सस्पेंशन ट्रॉमा रिलीफ स्ट्रैप खोला गया! पैरों में रक्त संचार चालू।'
        : language === 'sat'
        ? 'ᱴᱨᱚᱢᱟ ᱥᱴᱨᱮᱯ ᱠᱷᱩᱞᱟᱹ ᱮᱱᱟ! ᱡᱟᱸᱜᱟ ᱨᱮ ᱢᱟᱭᱟᱢ ᱥᱮᱱᱚᱜ ᱠᱟᱱᱟ᱾'
        : 'Suspension Trauma Relief Strap Deployed! Venous pooling prevented.'
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

      {/* 3D AR Ground & Scaffold Platform Graphics Engine (Elevated so it never overlaps buttons) */}
      <div className="absolute bottom-[64px] sm:bottom-[72px] left-1/2 -translate-x-1/2 pointer-events-none z-10 flex flex-col items-center">
        <GameHeightCanvas
          hooksConnected={lanyardHooksConnected}
          anchorTested={anchorLoadTested}
          traumaStrapDeployed={traumaStrapDeployed}
          width={380}
          height={340}
        />

        {/* Height Level Badge */}
        <div className="relative -mt-6 bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-1 shadow-xl flex items-center gap-2 text-[11px] font-bold">
          <ArrowUpCircle className="w-4 h-4 text-sky-400" />
          <span className="text-slate-200">
            {language === 'hi' ? 'ऊंचाई स्तर: 15.4 मीटर (मचान)' : 'Scaffold Elevation: 15.4m (Fall Hazard Zone)'}
          </span>
        </div>
      </div>

      {/* STEP 1: Scaffold Green Tag Verification - Pinned to bottom, crystal clear & clickable */}
      {stepIndex === 1 && (
        <div className="absolute bottom-13 sm:bottom-14 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[calc(100%-1.5rem)] bg-slate-950/95 backdrop-blur-xl border-2 border-emerald-400 rounded-3xl p-4 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col items-center gap-3 pointer-events-auto">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {language === 'hi' ? 'मचान ग्रीन टैग निरीक्षण' : 'Scaffold Green Inspection Tag'}
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-600 rounded-full text-[10px] font-bold">
              {scaffoldTagChecked ? 'PASS' : 'PENDING'}
            </span>
          </div>

          <p className="text-xs text-slate-200 text-center font-medium">
            {language === 'hi'
              ? 'मचान के खंभे पर लगे ग्रीन टैग, बेस-जैक और टो-बोर्ड की जांच करें।'
              : 'Verify valid scaffold inspection tag, certified 450 kg load, and toe-boards.'}
          </p>

          <button
            id="btn-inspect-scaffold-tag"
            onClick={handleInspectScaffoldTag}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-black text-sm uppercase tracking-wider rounded-2xl shadow-[0_0_30px_rgba(52,211,153,0.6)] transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer animate-pulse border-2 border-white/60"
          >
            <CheckCircle2 className="w-5 h-5 text-slate-950" />
            <span>{language === 'hi' ? 'ग्रीन टैग सत्यापित करें (VERIFY TAG)' : 'VERIFY GREEN SCAFFOLD TAG'}</span>
          </button>
        </div>
      )}

      {/* STEP 2: Double-Lanyard 100% Tie-Off Connection */}
      {stepIndex === 2 && (
        <div className="absolute bottom-13 sm:bottom-14 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[calc(100%-1.5rem)] bg-slate-950/95 backdrop-blur-xl border-2 border-amber-500 rounded-3xl p-4 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col gap-3 pointer-events-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Link className="w-4 h-4 text-amber-500" />
              {language === 'hi' ? '100% दोहरा लैनयार्ड टाई-ऑफ' : '100% Dual-Lanyard Tie-Off'}
            </span>
            <span className="text-xs font-black text-amber-300 bg-amber-950 border border-amber-600 px-3 py-0.5 rounded-full">
              {lanyardHooksConnected}/2 HOOKS LOCKED
            </span>
          </div>

          <p className="text-xs text-slate-200 font-medium text-center">
            {lanyardHooksConnected === 0
              ? (language === 'hi' ? 'पहला स्नैप हुक लाइफलाइन से जोड़ें।' : 'Snap Hook #1 to the overhead static lifeline.')
              : (language === 'hi' ? '100% सुरक्षा के लिए दूसरा हुक भी जोड़ें।' : 'Snap Hook #2 for 100% continuous dual tie-off protection.')}
          </p>

          <button
            id="btn-connect-lanyard"
            onClick={handleConnectLanyard}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 rounded-2xl font-black uppercase tracking-wider text-sm shadow-[0_0_30px_rgba(245,158,11,0.6)] flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer animate-pulse border-2 border-white/60"
          >
            <Link className="w-5 h-5 text-slate-950" />
            <span>
              {lanyardHooksConnected === 0
                ? (language === 'hi' ? 'पहला हुक जोड़ें (SNAP HOOK #1)' : 'SNAP HOOK #1 TO LIFELINE')
                : (language === 'hi' ? 'दूसरा हुक जोड़ें (100% TIE-OFF)' : 'SNAP HOOK #2 FOR 100% TIE-OFF')}
            </span>
          </button>
        </div>
      )}

      {/* STEP 3: Anchor Point Tension Load Test */}
      {stepIndex === 3 && (
        <div className="absolute bottom-13 sm:bottom-14 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[calc(100%-1.5rem)] bg-slate-950/95 backdrop-blur-xl border-2 border-sky-400 rounded-3xl p-4 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col gap-3 pointer-events-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <Anchor className="w-4 h-4 text-sky-400" />
              {language === 'hi' ? 'एंकर पॉइंट 22.2 kN लोड टेस्ट' : 'Overhead Anchor 22.2 kN Load Test'}
            </span>
            <span className="text-xs font-bold text-sky-300 bg-sky-950 px-2.5 py-0.5 rounded-full border border-sky-600">
              {anchorLoadTested ? 'CERTIFIED' : 'TEST REQUIRED'}
            </span>
          </div>

          <p className="text-xs text-slate-200 font-medium text-center">
            {language === 'hi'
              ? 'एंकर पॉइंट पर 22.2 kN (5000 lbs) खिंचाव परीक्षण करने के लिए बटन दबाएं।'
              : 'Execute simulated 22.2 kN (5,000 lbs) mechanical pull-test on overhead D-ring.'}
          </p>

          <button
            id="btn-test-anchor"
            onClick={handleTestAnchor}
            disabled={anchorLoadTested}
            className={`w-full py-4 rounded-2xl font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all transform active:scale-95 text-sm cursor-pointer border-2 ${
              anchorLoadTested
                ? 'bg-green-700 text-white border-green-500 cursor-default'
                : 'bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-slate-950 border-white/60 animate-bounce'
            }`}
          >
            <Activity className="w-5 h-5" />
            <span>
              {anchorLoadTested
                ? (language === 'hi' ? 'एंकर टेस्ट पास (22.2 kN Certified)' : 'ANCHOR LOAD PASSED (22.2 kN)')
                : (language === 'hi' ? 'एंकर तनाव टेस्ट करें (LOAD TEST)' : 'PERFORM 22.2 kN PULL-TEST')}
            </span>
          </button>
        </div>
      )}

      {/* STEP 4: Suspension Trauma Relief Strap */}
      {stepIndex === 4 && (
        <div className="absolute bottom-13 sm:bottom-14 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[calc(100%-1.5rem)] bg-slate-950/95 backdrop-blur-xl border-2 border-emerald-500 rounded-3xl p-4 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col items-center gap-3 pointer-events-auto">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-500" />
              {language === 'hi' ? 'सस्पेंशन ट्रॉमा रिलीफ स्ट्रैप' : 'Suspension Trauma Relief Stirrup'}
            </span>
            <span className="text-xs font-bold text-emerald-300 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-600">
              {traumaStrapDeployed ? 'DEPLOYED' : 'READY'}
            </span>
          </div>

          <p className="text-xs text-slate-200 font-medium text-center">
            {language === 'hi'
              ? 'हार्नेस पाउच से ट्रॉमा स्ट्रैप खोलें ताकि पैर रखकर रक्त प्रवाह चालू रहे।'
              : 'Unpack foot stirrup straps to relieve femoral pressure and prevent orthostatic shock.'}
          </p>

          <button
            id="btn-deploy-trauma-strap"
            onClick={handleDeployTraumaStrap}
            disabled={traumaStrapDeployed}
            className={`w-full py-4 rounded-2xl font-black uppercase tracking-wider text-sm shadow-xl flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer border-2 ${
              traumaStrapDeployed
                ? 'bg-emerald-700 text-white border-emerald-500 cursor-default'
                : 'bg-gradient-to-r from-emerald-400 to-green-600 hover:from-emerald-300 hover:to-green-500 text-slate-950 border-white/60 animate-pulse'
            }`}
          >
            <ShieldAlert className="w-5 h-5" />
            <span>
              {traumaStrapDeployed
                ? (language === 'hi' ? 'स्ट्रैप तैनात (रक्त प्रवाह सुरक्षित)' : 'STIRRUP DEPLOYED (BLOOD FLOW SAFE)')
                : (language === 'hi' ? 'ट्रॉमा रिलीफ स्ट्रैप खोलें' : 'DEPLOY SUSPENSION RELIEF STRAP')}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
