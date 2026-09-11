import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, HardDrive, CheckCircle2, ChevronRight } from 'lucide-react';
import { Language } from '../../types';
import { translations } from '../../data/translations';
import { offlineStorage } from '../../utils/offlineStorage';
import { haptics } from '../../utils/haptics';

interface OfflineBannerProps {
  language?: Language;
  onOpenOfflineCenter: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ language = 'en', onOpenOfflineCenter }) => {
  const t = translations[language] || translations.en;
  const [isOffline, setIsOffline] = useState<boolean>(offlineStorage.isSimulatedOffline());
  const [pendingCount, setPendingCount] = useState<number>(offlineStorage.getPendingSyncItems().length);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  useEffect(() => {
    const unsub = offlineStorage.subscribe(() => {
      setIsOffline(offlineStorage.isSimulatedOffline());
      setPendingCount(offlineStorage.getPendingSyncItems().length);
    });
    return unsub;
  }, []);

  const handleQuickSync = async (e: React.MouseEvent) => {
    e.stopPropagation();
    haptics.trigger('tap');
    setIsSyncing(true);
    try {
      await offlineStorage.syncPendingNow();
      haptics.trigger('success');
    } catch {
      haptics.trigger('error');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div 
      onClick={() => { haptics.trigger('tap'); onOpenOfflineCenter(); }}
      className={`px-3 py-1.5 text-xs font-semibold flex items-center justify-between gap-2 cursor-pointer transition-colors ${
        isOffline 
          ? 'bg-amber-900/90 border-b border-amber-600 text-amber-100' 
          : pendingCount > 0 
          ? 'bg-orange-900/90 border-b border-orange-600 text-orange-100'
          : 'bg-slate-900 border-b border-slate-800 text-slate-300'
      }`}
    >
      <div className="flex items-center gap-2 truncate">
        {isOffline ? (
          <WifiOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        ) : (
          <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
        )}
        <span className="truncate text-[11px]">
          {isOffline
            ? t.deepMineBanner
            : pendingCount > 0
            ? (language === 'hi' ? `${pendingCount} प्रमाणपत्र ऑफ़लाइन वॉलेट में कतारबद्ध हैं` : language === 'sat' ? `${pendingCount} ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱚᱯᱷᱞᱟᱭᱤᱱ ᱨᱮ ᱢᱮᱱᱟᱜ-ᱟ` : `${pendingCount} certificates queued in offline wallet`)
            : (language === 'hi' ? 'ऑफ़लाइन तैयार: सभी मॉड्यूल एवं DGMS परीक्षण डिवाइस पर संग्रहीत' : language === 'sat' ? 'ᱚᱯᱷᱞᱟᱭᱤᱱ ᱨᱮᱰᱤ: ᱡᱚᱛᱚ ᱢᱚᱰᱩᱞ ᱟᱨ DGMS ᱵᱤᱰᱟᱹᱣ ᱥᱟᱧᱪᱟᱣ ᱢᱮᱱᱟᱜ-ᱟ' : 'Offline Ready: All modules & DGMS tests cached on device')}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {pendingCount > 0 && !isOffline && (
          <button
            onClick={handleQuickSync}
            disabled={isSyncing}
            className="px-2 py-0.5 bg-orange-500 hover:bg-orange-600 text-white rounded text-[10px] font-bold flex items-center gap-1 shadow-sm"
          >
            <RefreshCw className={`w-2.5 h-2.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{language === 'hi' ? `सिंक (${pendingCount})` : language === 'sat' ? `ᱥᱤᱝᱠ (${pendingCount})` : `Sync (${pendingCount})`}</span>
          </button>
        )}
        <div className="flex items-center text-[10px] font-bold text-orange-300 hover:text-white gap-0.5">
          <span>{t.manage}</span>
          <ChevronRight className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
};
