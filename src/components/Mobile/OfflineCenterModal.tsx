import React, { useState, useEffect } from 'react';
import { 
  WifiOff, Wifi, HardDrive, RefreshCw, CheckCircle2, 
  ShieldCheck, AlertTriangle, X, Download, Server, Cpu, Database
} from 'lucide-react';
import { Language } from '../../types';
import { offlineStorage } from '../../utils/offlineStorage';
import { pwaManager, OfflineCacheStats } from '../../utils/pwaManager';
import { haptics } from '../../utils/haptics';

interface OfflineCenterModalProps {
  language: Language;
  onClose: () => void;
}

export const OfflineCenterModal: React.FC<OfflineCenterModalProps> = ({
  language,
  onClose
}) => {
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [pendingSyncs, setPendingSyncs] = useState<number>(0);
  const [certsCount, setCertsCount] = useState<number>(0);
  const [stats, setStats] = useState<OfflineCacheStats | null>(null);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  useEffect(() => {
    const certs = offlineStorage.getCertificates();
    const pending = offlineStorage.getPendingSyncItems();
    setIsSimulatedOffline(offlineStorage.isSimulatedOffline());
    setPendingSyncs(pending.length);
    setCertsCount(certs.length);

    pwaManager.getCacheStats(certs.length, pending.length).then(setStats);

    const unsub = offlineStorage.subscribe(() => {
      const updatedCerts = offlineStorage.getCertificates();
      const updatedPending = offlineStorage.getPendingSyncItems();
      setIsSimulatedOffline(offlineStorage.isSimulatedOffline());
      setPendingSyncs(updatedPending.length);
      setCertsCount(updatedCerts.length);
      pwaManager.getCacheStats(updatedCerts.length, updatedPending.length).then(setStats);
    });

    return unsub;
  }, []);

  const handleToggleOffline = () => {
    haptics.trigger('warning');
    const nextState = !isSimulatedOffline;
    offlineStorage.setSimulatedOffline(nextState);
    setIsSimulatedOffline(nextState);
  };

  const handleManualSync = async () => {
    haptics.trigger('tap');
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await offlineStorage.syncPendingNow();
      setSyncResult(res.message);
      if (res.success) {
        haptics.trigger('success');
      } else {
        haptics.trigger('error');
      }
    } catch (e) {
      setSyncResult('Sync connection failed. Offline data remains safe.');
      haptics.trigger('error');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded shadow-2xl overflow-hidden my-auto flex flex-col">
        {/* Header */}
        <div className="bg-[#0F172A] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-orange-400">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest block">
                {language === 'sat' ? 'ᱥᱩᱨᱚᱠᱥᱟ ᱚᱯᱷᱞᱟᱭᱤᱱ ᱤᱧᱡᱤᱱ' : language === 'hi' ? 'सुरक्षा ऑफलाइन इंजन' : 'SURAKSHA OFFLINE ENGINE'}
              </span>
              <h2 className="text-sm sm:text-base font-bold text-white leading-tight">
                {language === 'sat' ? 'ᱠᱷᱟᱫᱟᱱ ᱵᱷᱤᱛᱨᱤ ᱟᱨ ᱚᱯᱷᱞᱟᱭᱤᱱ ᱥᱮᱱᱴᱟᱨ' : language === 'hi' ? 'गहरी खदान व ऑफलाइन मोड केंद्र' : 'Deep Mine & Offline Mode Center'}
              </h2>
            </div>
          </div>

          <button
            onClick={() => { haptics.trigger('tap'); onClose(); }}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 bg-slate-50/50 max-h-[75vh] overflow-y-auto">
          {/* 1. Deep-Mine Tunnel Simulation Switch */}
          <div className={`p-4 rounded border transition-all ${
            isSimulatedOffline 
              ? 'bg-orange-50 border-orange-300' 
              : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${
                  isSimulatedOffline ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {isSimulatedOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                    {isSimulatedOffline 
                      ? (language === 'sat' ? 'ᱠᱷᱟᱫᱟᱱ ᱚᱯᱷᱞᱟᱭᱤᱱ ᱢᱳᱰ ᱪᱟᱹᱞᱩ (0kb)' : language === 'hi' ? 'गहरी खदान मोड सक्रिय (0kb नेटवर्क)' : 'Deep Mine Mode Active (0kb Bandwidth)')
                      : (language === 'sat' ? 'ᱚᱱᱞᱟᱭᱤᱱ ᱢᱳᱰ' : language === 'hi' ? 'सतह ऑनलाइन मोड' : 'Surface Online Mode')}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {isSimulatedOffline
                      ? (language === 'sat' ? 'ᱥᱟᱱᱟᱢ AR ᱴᱨᱮᱱᱤᱝ, ᱨᱚᱲ, ᱯᱚᱨᱤᱠᱷᱟ ᱟᱨ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱯᱩᱨᱟᱹᱯᱩᱨᱤ ᱚᱯᱷᱞᱟᱭᱤᱱ ᱪᱟᱹᱞᱩᱜ ᱠᱟᱱᱟ᱾' : language === 'hi' ? 'सभी AR प्रशिक्षण, ऑडियो मार्गदर्शन, परीक्षाएं और प्रमाणपत्र 100% स्थानीय स्टोरेज से चल रहे हैं।' : 'All AR training, speech, assessments & certificates are running 100% locally from device storage.')
                      : (language === 'sat' ? 'ᱥᱟᱨᱵᱷᱟᱨ ᱥᱟᱶ ᱡᱚᱲᱟᱣ ᱢᱮᱱᱟᱜ-ᱟ᱾' : language === 'hi' ? 'केंद्रीय DGMS सर्वर से जुड़ा हुआ है। शून्य-सिग्नल जांचने के लिए स्विच करें।' : 'Connected to central DGMS verification servers. Toggle to simulate underground zero-signal operation.')}
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                id="btn-toggle-offline-mode"
                onClick={handleToggleOffline}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors shrink-0 ${
                  isSimulatedOffline ? 'bg-orange-500' : 'bg-slate-300'
                }`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  isSimulatedOffline ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          {/* 2. Offline Cached Asset Readiness Checklist */}
          <div className="bg-white border border-slate-200 p-4 rounded shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-orange-500" />
              {language === 'sat' ? 'ᱚᱯᱷᱞᱟᱭᱤᱱ ᱠᱮᱥ ᱮᱥᱮᱴ ᱠᱚ (100% ᱨᱮᱰᱤ)' : language === 'hi' ? 'स्थानीय कैश्ड सामग्री (100% ऑफलाइन तैयार)' : 'Pre-Cached Local Assets (100% Offline Ready)'}
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-700">
                  {language === 'sat' ? '4 ᱜᱚᱴᱟᱝ AR 3D ᱥᱤᱱᱟᱨᱤᱭᱳ' : language === 'hi' ? '4 AR 3D इंटरैक्टिव परिदृश्य' : '4 AR 3D Interactive Scenarios'}
                </span>
                <span className="flex items-center gap-1 text-green-600 font-bold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {language === 'sat' ? 'ᱨᱮᱰᱤ' : language === 'hi' ? 'तैयार' : 'Ready'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-700">
                  {language === 'sat' ? 'ᱥᱟᱱᱛᱟᱲᱤ, ᱦᱤᱱᱫᱤ ᱟᱨ ᱤᱝᱨᱮᱡᱤ ᱚᱰᱤᱭᱳ ᱯᱮᱠ' : language === 'hi' ? 'हिन्दी, संथाली व अंग्रेजी ऑडियो पैक' : 'Hindi, Santali & English Audio Packs'}
                </span>
                <span className="flex items-center gap-1 text-green-600 font-bold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {language === 'sat' ? 'ᱨᱮᱰᱤ' : language === 'hi' ? 'तैयार' : 'Ready'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-700">
                  {language === 'sat' ? 'ᱚᱯᱷᱞᱟᱭᱤᱱ DGMS ᱯᱚᱨᱤᱠᱷᱟ ᱵᱮᱸᱠ' : language === 'hi' ? 'ऑफलाइन DGMS परीक्षा प्रश्न बैंक' : 'Offline DGMS Compliance Exam Banks'}
                </span>
                <span className="flex items-center gap-1 text-green-600 font-bold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {language === 'sat' ? 'ᱨᱮᱰᱤ' : language === 'hi' ? 'तैयार' : 'Ready'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-700">
                  {language === 'sat' ? 'QR ᱠᱳᱰ ᱵᱮᱱᱟᱣ ᱤᱧᱡᱤᱱ' : language === 'hi' ? 'क्लाइंट-साइड QR हस्ताक्षर जनरेटर' : 'Client-Side QR Signature Generator'}
                </span>
                <span className="flex items-center gap-1 text-green-600 font-bold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {language === 'sat' ? 'ᱨᱮᱰᱤ' : language === 'hi' ? 'तैयार' : 'Ready'}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Pending Cloud Sync Queue */}
          <div className="bg-white border border-slate-200 p-4 rounded shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-blue-500" />
                {language === 'sat' ? 'ᱠᱞᱟᱣᱩᱰ ᱥᱤᱝᱠ ᱠᱤᱣ' : language === 'hi' ? 'क्लाउड सिंक कतार' : 'Cloud Sync Queue'}
              </h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                pendingSyncs > 0 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
              }`}>
                {pendingSyncs > 0 
                  ? (language === 'sat' ? `${pendingSyncs} ᱥᱤᱝᱠ ᱵᱟᱹᱠᱤ` : language === 'hi' ? `${pendingSyncs} सिंक शेष` : `${pendingSyncs} Pending Sync`) 
                  : (language === 'sat' ? 'ᱥᱟᱱᱟᱢ ᱥᱤᱝᱠ ᱟᱠᱟᱱᱟ' : language === 'hi' ? 'सभी सिंक हैं' : 'All Synced')}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 mb-3">
              {language === 'sat'
                ? 'ᱠᱷᱟᱫᱟᱱ ᱵᱷᱤᱛᱨᱤ ᱨᱮ ᱟᱨᱡᱟᱣ ᱟᱠᱟᱱ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱠᱚ ᱞᱚᱠᱟᱞ ᱨᱮ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱛᱟᱦᱮᱸᱱᱟ ᱟᱨ Wi-Fi ᱧᱟᱢ ᱞᱮᱱᱠᱷᱟᱱ ᱚᱴᱚᱢᱮᱴᱤᱠ ᱥᱤᱝᱠ ᱦᱩᱭᱩᱜ-ᱟ᱾'
                : language === 'hi'
                ? 'भूमिगत खदान में अर्जित प्रमाणपत्र स्थानीय रूप से सुरक्षित रहते हैं और सतह पर नेटवर्क मिलते ही स्वतः सिंक हो जाते हैं।'
                : 'Certificates generated while working in underground mine shafts are encrypted locally and automatically synced when reconnected to surface Wi-Fi.'}
            </p>

            {syncResult && (
              <div className={`p-2.5 rounded text-xs font-semibold mb-3 ${
                syncResult.includes('Success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-orange-50 text-orange-700 border border-orange-200'
              }`}>
                {syncResult}
              </div>
            )}

            <button
              onClick={handleManualSync}
              disabled={syncing || pendingSyncs === 0}
              className="w-full py-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-40 text-white rounded text-xs font-bold uppercase tracking-tight flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>
                {syncing 
                  ? (language === 'sat' ? 'ᱥᱤᱝᱠ ᱪᱟᱹᱞᱩᱜ ᱠᱟᱱᱟ...' : language === 'hi' ? 'सिंक हो रहा है...' : 'Synchronizing Ledger...') 
                  : (language === 'sat' ? `${pendingSyncs} ᱨᱮᱠᱚᱨᱰ ᱱᱤᱛᱚᱜ ᱥᱤᱝᱠ ᱢᱮ` : language === 'hi' ? `अब ${pendingSyncs} ऑफलाइन रिकॉर्ड सिंक करें` : `Sync ${pendingSyncs} Offline Records Now`)}
              </span>
            </button>
          </div>

          {/* 4. Local Storage Health & Reset Data */}
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-200">
            {stats && (
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>{language === 'sat' ? 'ᱠᱮᱥ ᱡᱟᱭᱜᱟ:' : language === 'hi' ? 'स्टोरेज कैश:' : 'Storage Cached:'} {stats.storageEstimateMb} MB</span>
                <span>{language === 'sat' ? 'ᱨᱮᱠᱚᱨᱰ:' : language === 'hi' ? 'सक्रिय रिकॉर्ड:' : 'Active Records:'} {certsCount}</span>
              </div>
            )}
            {certsCount > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to reset all earned training certificates on this device?')) {
                    offlineStorage.clearAllCertificates();
                    haptics.trigger('warning');
                  }
                }}
                className="text-[11px] text-red-600 hover:text-red-700 font-medium text-left underline"
              >
                {language === 'sat' ? 'ᱱᱚᱶᱟ ᱰᱤᱵᱷᱟᱭᱤᱥ ᱨᱮᱱᱟᱜ ᱥᱟᱱᱟᱢ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱢᱮᱴᱟᱣ ᱢᱮ' : language === 'hi' ? 'इस डिवाइस के सभी अर्जित प्रमाणपत्र रीसेट करें' : 'Reset all earned certificates on this device'}
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white p-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => { haptics.trigger('tap'); onClose(); }}
            className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-tight rounded transition-all active:scale-95 shadow-sm"
          >
            {language === 'sat' ? 'ᱦᱩᱭ ᱮᱱᱟ' : language === 'hi' ? 'पूर्ण' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
