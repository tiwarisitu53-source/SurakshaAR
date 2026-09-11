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
  const [cameraInitializing, setCameraInitializing] = useState<boolean>(true);

  const t = translations[language];

  // Progressive camera initialization function
  const initCamera = useCallback(async () => {
    if (simulationMode) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      setCameraActive(false);
      setCameraInitializing(false);
      return;
    }

    setCameraInitializing(true);
    setCameraError(null);

    // Stop any existing stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (!navigator?.mediaDevices?.getUserMedia) {
      setCameraError('Camera API not supported in this browser context.');
      setCameraActive(false);
      setCameraInitializing(false);
      return;
    }

    let stream: MediaStream | null = null;

    // 1st attempt: Ideal environment constraints
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
    } catch (err1) {
      console.warn('Ideal camera constraints failed, attempting generic video request...', err1);
      // 2nd attempt: Basic unconstrained video request
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      } catch (err2: any) {
        console.warn('Camera access denied or unavailable:', err2);
        const errMsg = err2?.name === 'NotAllowedError' || err2?.name === 'PermissionDeniedError'
          ? 'Camera permission denied. Click to allow or use 3D Mine Simulator.'
          : err2?.name === 'NotFoundError' || err2?.name === 'DevicesNotFoundError'
          ? 'No camera hardware found. 3D Mine Simulator enabled.'
          : 'Unable to access camera. 3D Mine Simulator active.';
        setCameraError(errMsg);
        setCameraActive(false);
        setCameraInitializing(false);
        return;
      }
    }

    if (stream) {
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(e => console.log('Video auto-play handled:', e));
          }
        } catch (e) {
          console.log('Video play error handled:', e);
        }
      }
      setCameraActive(true);
      setCameraError(null);
      setCameraInitializing(false);
    }
  }, [facingMode, simulationMode]);

  // Trigger camera on mount and when facingMode or simulationMode changes
  useEffect(() => {
    initCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
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
    }, 500);

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
    setSimulationMode(prev => !prev);
  };

  return (
    <div className="relative w-full h-full min-h-[520px] bg-slate-950 overflow-hidden select-none">
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
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
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
      <div className="absolute top-16 right-3 sm:right-4 z-40 flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          {/* Status Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/90 border border-slate-700/80 rounded text-[11px] font-semibold text-slate-200 backdrop-blur-md shadow-sm">
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
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md border border-slate-700/80 rounded text-slate-200 text-xs font-bold shadow-lg transition-all active:scale-95"
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
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md border border-slate-700/80 rounded text-slate-200 text-xs font-semibold shadow-lg transition-all active:scale-95"
              title={language === 'sat' ? 'ᱠᱮᱢᱮᱨᱟ ᱟᱹᱪᱩᱨ ᱢᱮ' : language === 'hi' ? 'कैमरा पलटें' : 'Flip camera'}
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          )}
        </div>

        {/* Camera Permission / Error Notice if camera is unavailable */}
        {cameraError && !simulationMode && (
          <div className="bg-amber-950/90 border border-amber-500/70 text-amber-200 px-3 py-1.5 rounded text-[11px] flex items-center gap-2 shadow-lg max-w-xs animate-fade-in">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="leading-tight">{cameraError}</span>
            <button
              onClick={() => initCamera()}
              className="underline font-bold text-white hover:text-amber-300 shrink-0 ml-1"
            >
              {language === 'sat' ? 'ᱫᱚᱦᱲᱟ ᱪᱮᱥᱴᱟ' : language === 'hi' ? 'पुनः प्रयास' : 'Retry'}
            </button>
          </div>
        )}
      </div>

      {/* 3. Dynamic Scenario AR Interactive Objects (Children Layer) */}
      <div className="absolute inset-0 z-20 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

