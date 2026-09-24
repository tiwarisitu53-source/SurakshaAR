import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, RefreshCw, Layers, Shield, Sparkles, Video, AlertCircle } from 'lucide-react';
import { Language } from '../../types';
import { translations } from '../../data/translations';

interface ARCameraFeedProps {
  children?: React.ReactNode;
  language: Language;
  isPlaneLocked: boolean;
  onPlaneLockChange: (locked: boolean) => void;
  scenarioType: 'fire' | 'gas' | 'machinery' | 'height' | 'electrical';
}

export const ARCameraFeed: React.FC<ARCameraFeedProps> = ({
  children,
  language,
  isPlaneLocked,
  onPlaneLockChange,
  scenarioType
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [gridScanProgress, setGridScanProgress] = useState<number>(0);
  const [simulationMode, setSimulationMode] = useState<boolean>(false);
  const [cameraInitializing, setCameraInitializing] = useState<boolean>(false);
  const [userPromptNeeded, setUserPromptNeeded] = useState<boolean>(false);

  const t = translations[language];

  // Stop any active camera streams safely
  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (e) {}
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Progressive camera initialization function with multi-tier fallback
  const initCamera = useCallback(async (forceEnable: boolean = false) => {
    if (simulationMode && !forceEnable) {
      stopStream();
      setCameraActive(false);
      setCameraInitializing(false);
      return;
    }

    if (forceEnable) {
      setSimulationMode(false);
    }

    setCameraInitializing(true);
    setCameraError(null);
    stopStream();

    if (!navigator?.mediaDevices?.getUserMedia) {
      setCameraError(
        language === 'hi'
          ? 'इस ब्राउज़र में कैमरा API समर्थित नहीं है। 3D वर्चुअल वर्कशॉप सक्रिय है।'
          : 'Camera API is not supported in this browser context. 3D Virtual Workshop is active.'
      );
      setCameraActive(false);
      setCameraInitializing(false);
      setSimulationMode(true);
      return;
    }

    let stream: MediaStream | null = null;

    // 1st attempt: Facing mode constraint (without overconstrained dimensions)
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode }
        },
        audio: false
      });
    } catch (err1) {
      // 2nd attempt: Basic unconstrained video
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      } catch (err2: any) {
        // 3rd attempt: Enumerate devices and select first video device
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDev = devices.find(d => d.kind === 'videoinput');
          if (videoDev?.deviceId) {
            stream = await navigator.mediaDevices.getUserMedia({
              video: { deviceId: { ideal: videoDev.deviceId } },
              audio: false
            });
          } else {
            throw err2;
          }
        } catch (err3: any) {
          console.warn('Camera stream acquisition failed:', err3);
          const isDenied = err3?.name === 'NotAllowedError' || err3?.name === 'PermissionDeniedError';
          const isNotFound = err3?.name === 'NotFoundError' || err3?.name === 'DevicesNotFoundError';

          if (isDenied) {
            setCameraError(
              language === 'hi'
                ? 'कैमरा अनुमति अस्वीकृत या अवरुद्ध है। कैमरा चालू करने के लिए "कैमरा अनुमति दें" पर क्लिक करें।'
                : 'Camera permission denied or blocked in browser. Click "Enable Camera" to grant access.'
            );
            setUserPromptNeeded(true);
          } else if (isNotFound) {
            setCameraError(
              language === 'hi'
                ? 'सिस्टम पर कोई वेबकैम नहीं मिला। 3D वर्चुअल वर्कशॉप सक्रिय है।'
                : 'No camera hardware detected. 3D Virtual Workshop is active.'
            );
            setSimulationMode(true);
          } else {
            setCameraError(
              language === 'hi'
                ? 'कैमरा वर्तमान में उपलब्ध नहीं है। 3D सिमुलेटर में प्रशिक्षण जारी रखें।'
                : 'Camera stream unavailable. Continue training in the 3D Virtual Workshop.'
            );
            setUserPromptNeeded(true);
          }
          setCameraActive(false);
          setCameraInitializing(false);
          return;
        }
      }
    }

    if (stream) {
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('muted', 'true');
        videoRef.current.setAttribute('autoplay', 'true');
        try {
          await videoRef.current.play();
        } catch (e) {
          console.warn('Video auto-play handled:', e);
        }
      }
      setCameraActive(true);
      setCameraError(null);
      setCameraInitializing(false);
      setUserPromptNeeded(false);
      setSimulationMode(false);
    }
  }, [facingMode, simulationMode, language]);

  // Initial attempt on mount
  useEffect(() => {
    initCamera(false);

    return () => {
      stopStream();
    };
  }, [initCamera]);

  // Plane scanning simulation effect
  useEffect(() => {
    if (isPlaneLocked) {
      setGridScanProgress(100);
      return;
    }

    setGridScanProgress(0);
    const interval = setInterval(() => {
      setGridScanProgress(prev => {
        if (prev >= 100) {
          return 100;
        }
        return prev + 25;
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isPlaneLocked]);

  // Safely notify parent once grid scan reaches 100% after render
  useEffect(() => {
    if (!isPlaneLocked && gridScanProgress >= 100) {
      onPlaneLockChange(true);
    }
  }, [gridScanProgress, isPlaneLocked, onPlaneLockChange]);

  const toggleCameraFacing = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  const toggleSimulation = () => {
    if (cameraActive && !simulationMode) {
      stopStream();
      setSimulationMode(true);
      setCameraActive(false);
    } else {
      setSimulationMode(false);
      initCamera(true);
    }
  };

  return (
    <div className="relative flex-1 min-h-0 w-full h-full bg-slate-950 overflow-hidden select-none">
      {/* 1. Real Video Stream Background - ALWAYS MOUNTED in DOM to prevent React ref detachment */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        onLoadedMetadata={() => {
          videoRef.current?.play().catch(() => {});
        }}
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 ${
          cameraActive && !simulationMode ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* 2. Realistic Simulated Industrial / Mine Environment Backdrop */}
      {(!cameraActive || simulationMode) && (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-slate-900 via-slate-950 to-neutral-950 z-0 overflow-hidden">
          {/* Industrial Wall & Girders SVG Scene */}
          <div className="absolute inset-0 opacity-40">
            <svg className="w-full h-full" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="industrial-wall-pattern" width="60" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 0 20 L 60 20 M 30 0 L 30 20 M 0 40 L 60 40 M 60 20 L 60 40" fill="none" stroke="#334155" strokeWidth="1" />
                </pattern>
                <linearGradient id="wall-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="60%" stopColor="#0f172a" />
                  <stop offset="100%" stopColor="#020617" />
                </linearGradient>
                <linearGradient id="ground-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#090d16" stopOpacity="0.95" />
                </linearGradient>
              </defs>
              {/* Back Wall */}
              <rect width="100%" height="60%" fill="url(#wall-grad)" />
              <rect width="100%" height="60%" fill="url(#industrial-wall-pattern)" opacity="0.25" />

              {/* Steel Support Beams & High Voltage Conduits */}
              <line x1="15%" y1="0" x2="15%" y2="60%" stroke="#475569" strokeWidth="12" />
              <line x1="85%" y1="0" x2="85%" y2="60%" stroke="#475569" strokeWidth="12" />
              <line x1="0" y1="20%" x2="100%" y2="20%" stroke="#64748b" strokeWidth="6" strokeDasharray="12 6" />
              <line x1="0" y1="40%" x2="100%" y2="40%" stroke="#475569" strokeWidth="4" />

              {/* Industrial Warning Hazard Stripes Banner */}
              <rect x="12%" y="15%" width="76%" height="14" fill="#eab308" opacity="0.3" />
            </svg>
          </div>

          {/* Perspective Floor */}
          <div 
            className="absolute bottom-0 inset-x-0 h-[45%] bg-slate-900 border-t border-slate-700/50"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(30, 41, 59, 0.9) 0%, rgba(2, 6, 23, 1) 100%)',
              transform: 'perspective(500px) rotateX(25deg)',
              transformOrigin: 'bottom'
            }}
          />

          {/* Camera Permission / Action Prompt Banner in 3D Viewport when not active */}
          {!cameraActive && !simulationMode && (
            <div className="absolute top-28 left-1/2 -translate-x-1/2 z-30 w-11/12 max-w-sm bg-slate-900/95 border border-orange-500/50 rounded-2xl p-4 text-center backdrop-blur-md shadow-2xl space-y-2.5">
              <div className="flex items-center justify-center gap-2 text-orange-400 font-bold text-xs uppercase tracking-wider">
                <Camera className="w-4 h-4 animate-bounce" />
                <span>{language === 'hi' ? 'लाइव एआर कैमरा चालू करें' : language === 'sat' ? 'ᱠᱮᱢᱮᱨᱟ ᱪᱟᱹᱞᱩᱭ ᱢᱮ' : 'Enable Live Camera Feed'}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'hi' 
                  ? 'कैमरा चालू करने के लिए अनुमति दें, या 3D वर्चुअल वर्कशॉप में सीधे प्रशिक्षण लें।' 
                  : 'Grant browser camera access for live video AR pass-through, or continue with the 3D Virtual Workshop.'}
              </p>
              <div className="flex items-center justify-center gap-2 flex-wrap pt-1">
                <button
                  id="btn-permit-camera"
                  onClick={() => initCamera(true)}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'कैमरा अनुमति दें' : 'Enable Camera'}</span>
                </button>
                <button
                  id="btn-switch-3d-sim"
                  onClick={() => setSimulationMode(true)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
                >
                  <span>{language === 'hi' ? '3D सिमुलेटर' : 'Use 3D Workshop'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ARCore Ground Reticle & Plane Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Animated Perspective Grid */}
        <div 
          className="absolute bottom-0 inset-x-0 h-[50%] opacity-40 transition-opacity duration-700"
          style={{
            backgroundImage: `
              linear-gradient(to right, ${isPlaneLocked ? 'rgba(52, 211, 153, 0.4)' : 'rgba(251, 191, 36, 0.35)'} 1px, transparent 1px),
              linear-gradient(to bottom, ${isPlaneLocked ? 'rgba(52, 211, 153, 0.4)' : 'rgba(251, 191, 36, 0.35)'} 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
            transform: 'perspective(450px) rotateX(45deg) translateY(20px)',
            transformOrigin: 'bottom'
          }}
        />

        {/* Reticle in Center during Scanning */}
        {!isPlaneLocked && (
          <div className="absolute top-[58%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
            <div className="relative w-24 h-24 border-2 border-dashed border-amber-400/80 rounded-full animate-spin flex items-center justify-center">
              <div className="w-4 h-4 bg-amber-400 rounded-full animate-ping" />
            </div>
            <span className="text-[11px] font-bold text-amber-300 bg-slate-900/80 px-2.5 py-1 rounded-full border border-amber-400/50 backdrop-blur-sm">
              ARCore Surface: {gridScanProgress}%
            </span>
          </div>
        )}

        {/* Plane Locked Confirmation Ring */}
        {isPlaneLocked && (
          <div className="absolute top-[68%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-40">
            <div className="w-72 h-36 border border-emerald-400/60 rounded-[100%] shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-pulse" />
          </div>
        )}
      </div>

      {/* Camera Status & Controls Top Right */}
      <div className="absolute top-20 right-3 sm:right-4 z-40 flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          {/* Status Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/90 border border-slate-700/80 rounded-lg text-[11px] font-semibold text-slate-200 backdrop-blur-md shadow-sm">
            <span className={`w-2 h-2 rounded-full ${cameraActive && !simulationMode ? 'bg-green-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>
              {cameraActive && !simulationMode 
                ? (language === 'sat' ? 'ᱞᱟᱭᱤᱵᱷ ᱠᱮᱢᱮᱨᱟ' : language === 'hi' ? 'लाइव कैमरा' : 'Live Camera') 
                : (language === 'sat' ? '3D ᱥᱤᱢᱩᱞᱮᱴᱚᱨ' : language === 'hi' ? '3D सिमुलेटर' : '3D Simulator')}
            </span>
          </div>

          <button
            id="btn-toggle-ar-camera"
            onClick={toggleSimulation}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md border border-slate-700/80 rounded-lg text-slate-200 text-xs font-bold shadow-lg transition-all active:scale-95 cursor-pointer"
            title={language === 'sat' ? 'ᱠᱮᱢᱮᱨᱟ ᱟᱨ 3D ᱢᱩᱫᱽ ᱨᱮ ᱵᱚᱫᱚᱞ' : language === 'hi' ? 'कैमरा और 3D सिमुलेटर बदलें' : 'Toggle between Live Camera and 3D Mine Simulator'}
          >
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">
              {cameraActive && !simulationMode 
                ? (language === 'sat' ? '3D ᱥᱤᱢᱩᱞᱮᱴᱚᱨ ᱪᱟᱹᱞᱩᱭ ᱢᱮ' : language === 'hi' ? '3D सिमुलेटर पर जाएं' : 'Switch to 3D Simulator') 
                : (language === 'sat' ? 'ᱠᱮᱢᱮᱨᱟ ᱪᱟᱹᱞᱩᱭ ᱢᱮ' : language === 'hi' ? 'कैमरा चालू करें' : 'Activate Camera')}
            </span>
          </button>

          {cameraActive && !simulationMode && (
            <button
              id="btn-flip-ar-camera"
              onClick={toggleCameraFacing}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md border border-slate-700/80 rounded-lg text-slate-200 text-xs font-semibold shadow-lg transition-all active:scale-95 cursor-pointer"
              title={language === 'sat' ? 'ᱠᱮᱢᱮᱨᱟ ᱟᱹᱪᱩᱨ ᱢᱮ' : language === 'hi' ? 'कैमरा पलटें' : 'Flip camera'}
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          )}
        </div>

        {/* Camera Permission / Error Notice if camera is unavailable */}
        {cameraError && !simulationMode && (
          <div className="bg-slate-900/95 border border-amber-500/70 text-slate-200 px-3 py-2 rounded-xl text-[11px] flex items-center gap-2.5 shadow-xl max-w-xs animate-fade-in backdrop-blur-md">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="leading-tight flex-1">{cameraError}</span>
            <button
              onClick={() => initCamera(true)}
              className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded text-[10px] shrink-0 transition-all cursor-pointer"
            >
              {language === 'sat' ? 'ᱪᱮᱥᱴᱟ' : language === 'hi' ? 'पुनः प्रयास' : 'Retry'}
            </button>
          </div>
        )}
      </div>

      {/* 3. Dynamic Scenario AR Interactive Objects (Children Layer) */}
      <div className="absolute inset-0 w-full h-full z-20 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

