import React, { useState, useEffect } from 'react';
import { 
  Wifi, WifiOff, HardDrive, Download, Volume2, 
  VolumeX, Bot, Smartphone, Battery, BatteryCharging, RefreshCw
} from 'lucide-react';
import { Language } from '../../types';
import { translations } from '../../data/translations';
import { offlineStorage } from '../../utils/offlineStorage';
import { audioAssistant } from '../../utils/audioAssistant';
import { pwaManager } from '../../utils/pwaManager';
import { haptics } from '../../utils/haptics';

interface MobileTopBarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenOfflineCenter: () => void;
  onOpenInstallModal: () => void;
  onOpenAICoach: () => void;
}

export const MobileTopBar: React.FC<MobileTopBarProps> = ({
  language,
  onLanguageChange,
  onOpenOfflineCenter,
  onOpenInstallModal,
  onOpenAICoach
}) => {
  const t = translations[language];
  const [isOffline, setIsOffline] = useState<boolean>(offlineStorage.isSimulatedOffline());
  const [pendingCount, setPendingCount] = useState<number>(offlineStorage.getPendingSyncItems().length);
  const [isMuted, setIsMuted] = useState<boolean>(audioAssistant.getIsMuted());
  const [currentTime, setCurrentTime] = useState<string>('09:30');
  const [isInstallable, setIsInstallable] = useState<boolean>(pwaManager.getIsInstallable());

  useEffect(() => {
    // Update mobile simulated time
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);

    const unsubStorage = offlineStorage.subscribe(() => {
      setIsOffline(offlineStorage.isSimulatedOffline());
      setPendingCount(offlineStorage.getPendingSyncItems().length);
    });

    const unsubPWA = pwaManager.subscribe(() => {
      setIsInstallable(pwaManager.getIsInstallable());
    });

    return () => {
      clearInterval(interval);
      unsubStorage();
      unsubPWA();
    };
  }, []);

  const handleMuteToggle = () => {
    haptics.trigger('tap');
    const nextMute = !isMuted;
    audioAssistant.setMuted(nextMute);
    setIsMuted(nextMute);
  };

  return (
    <div className="bg-[#0F172A] text-white border-b border-slate-700/80 sticky top-0 z-40">
      {/* Mobile Native Status Bar Line (Simulated Notch Bar) */}
      <div className="flex items-center justify-between px-3 py-1 text-[10px] text-slate-400 font-mono border-b border-slate-800/60 select-none">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-slate-300">{currentTime}</span>
          <span className="text-[9px] px-1 py-0.2 bg-slate-800 rounded text-slate-400">
            {language === 'hi' ? 'DGMS ज़ोन 4' : language === 'sat' ? 'DGMS ᱡᱳᱱ 4' : 'DGMS Zone 4'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isOffline ? (
            <span className="flex items-center gap-1 text-red-400 font-bold">
              <WifiOff className="w-3 h-3" />
              <span>{language === 'hi' ? 'ऑफ़लाइन' : language === 'sat' ? 'ᱚᱯᱷᱞᱟᱭᱤᱱ' : 'Offline'}</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-green-400 font-bold">
              <Wifi className="w-3 h-3" />
              <span>4G LTE</span>
            </span>
          )}
          <span className="flex items-center gap-0.5 text-slate-300">
            <Battery className="w-3.5 h-3.5 text-green-400" />
            <span>94%</span>
          </span>
        </div>
      </div>

      {/* Primary Mobile Header Bar */}
      <div className="px-3 py-2 flex items-center justify-between gap-2">
        {/* Brand & Sector */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-orange-500 rounded flex items-center justify-center font-bold text-sm text-white shadow-sm shrink-0">
            S
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-white">
                {language === 'hi' ? 'सुरक्षा' : language === 'sat' ? 'ᱥᱩᱨᱚᱠᱥᱟ' : 'SURAKSHA'} <span className="text-orange-400">AR</span>
              </span>
            </div>
            <p className="text-[9px] text-slate-400 font-medium">
              {language === 'hi' ? 'ऑफ़लाइन मोबाइल सुरक्षा ऐप' : language === 'sat' ? 'ᱚᱯᱷᱞᱟᱭᱤᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱮᱯ' : 'Offline Mobile Safety App'}
            </p>
          </div>
        </div>

        {/* Action Buttons: Language, Sound, Offline, Install */}
        <div className="flex items-center gap-1.5">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-800 p-0.5 rounded border border-slate-700 text-[10px]">
            <button
              onClick={() => { haptics.trigger('tap'); onLanguageChange('hi'); }}
              className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                language === 'hi' ? 'bg-orange-500 text-white' : 'text-slate-300'
              }`}
            >
              हिं
            </button>
            <button
              onClick={() => { haptics.trigger('tap'); onLanguageChange('sat'); }}
              className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                language === 'sat' ? 'bg-orange-500 text-white' : 'text-slate-300'
              }`}
            >
              ST
            </button>
            <button
              onClick={() => { haptics.trigger('tap'); onLanguageChange('en'); }}
              className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                language === 'en' ? 'bg-orange-500 text-white' : 'text-slate-300'
              }`}
            >
              EN
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={handleMuteToggle}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors"
            title={isMuted ? t.audioGuideMute : t.audioGuideActive}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-orange-400" />}
          </button>

          {/* Offline Center Trigger */}
          <button
            onClick={() => { haptics.trigger('tap'); onOpenOfflineCenter(); }}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold border transition-all ${
              isOffline
                ? 'bg-red-950/80 border-red-500 text-red-300'
                : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
            title="Open Deep Mine & Offline Center"
          >
            <HardDrive className="w-3 h-3 text-orange-400" />
            <span className="hidden xs:inline">
              {isOffline ? (language === 'hi' ? 'डीप माइन' : language === 'sat' ? 'ᱠᱷᱟᱫᱟᱱ' : 'Deep Mine') : (language === 'hi' ? 'ऑफ़लाइन' : language === 'sat' ? 'ᱚᱯᱷᱞᱟᱭᱤᱱ' : 'Offline')}
            </span>
            {pendingCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            )}
          </button>

          {/* PWA Install Button */}
          <button
            onClick={() => { haptics.trigger('tap'); onOpenInstallModal(); }}
            className="flex items-center gap-1 px-2 py-1 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-[10px] font-bold uppercase tracking-tight rounded transition-all shadow-sm"
            title="Install Mobile Application"
          >
            <Download className="w-3 h-3" />
            <span className="hidden sm:inline">{t.installApp}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
