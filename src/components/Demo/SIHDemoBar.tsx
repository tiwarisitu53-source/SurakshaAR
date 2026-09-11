import React, { useState } from 'react';
import { 
  Sparkles, CheckCircle2, ChevronRight, Play, Award, 
  QrCode, UserPlus, X, HelpCircle, ShieldCheck, Zap
} from 'lucide-react';
import { Language, WorkerProfile, SafetyModule, CertificateRecord } from '../../types';
import { translations } from '../../data/translations';
import { offlineStorage } from '../../utils/offlineStorage';
import { haptics } from '../../utils/haptics';

interface SIHDemoBarProps {
  language: Language;
  currentWorker: WorkerProfile;
  activeModule: SafetyModule | null;
  onOpenRegister: () => void;
  onLaunchModule: (moduleId: string) => void;
  onLaunchAssessment: () => void;
  onViewCertificate: () => void;
  onOpenScanner: () => void;
  onCloseDemo: () => void;
}

export const SIHDemoBar: React.FC<SIHDemoBarProps> = ({
  language,
  currentWorker,
  activeModule,
  onOpenRegister,
  onLaunchModule,
  onLaunchAssessment,
  onViewCertificate,
  onOpenScanner,
  onCloseDemo
}) => {
  const t = translations[language];
  const [minimized, setMinimized] = useState<boolean>(false);
  const [fastFilled, setFastFilled] = useState<boolean>(false);

  const certificates = offlineStorage.getCertificates();
  const hasCertificate = certificates.length > 0;

  // Generate an instant demo certificate so a judge can test QR verification immediately
  const handleInstantPreFillCert = () => {
    haptics.trigger('success');
    const demoCertId = `SURAKSHA-IND-2026-FIRE-8921B`;
    const newCert: CertificateRecord = {
      certificateId: demoCertId,
      workerId: currentWorker.id,
      workerName: currentWorker.name,
      moduleKey: 'fire_explosion',
      moduleName: 'Industrial Fire & Chemical Explosion Safety',
      score: 92,
      date: '23-Aug-2026',
      expiryDate: '23-Aug-2027',
      status: 'Valid',
      language: language === 'sat' ? 'Santali' : language === 'hi' ? 'Hindi' : 'English',
      organization: currentWorker.facility || 'Eastern Coalfields Dhanbad Unit',
      complianceStandard: 'DGMS / OSHA 1910.157 (Portable Fire Equipment & Suppression)',
      synced: true,
      workerIdPhotoUrl: currentWorker.idPhotoUrl,
      idVerified: true,
      qrPayload: JSON.stringify({
        certId: demoCertId,
        worker: `${currentWorker.name} (${currentWorker.id})`,
        module: 'Industrial Fire & Chemical Explosion Safety',
        score: '92%',
        date: '23-Aug-2026',
        status: 'Valid',
        auth: 'DGMS-CERT-LEDGER-VERIFIED'
      })
    };

    offlineStorage.saveCertificate(newCert);
    setFastFilled(true);
    setTimeout(() => {
      onViewCertificate();
    }, 300);
  };

  if (minimized) {
    return (
      <div className="bg-slate-900 border-b border-orange-500/40 px-3 py-1.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
          </span>
          <span className="font-bold text-orange-400 text-xs">
            {t.demoMode}
          </span>
          <span className="text-slate-400 hidden sm:inline text-[11px]">
            {language === 'hi' ? '2-मिनट त्वरित जूरी वॉकथ्रू सक्रिय' : '2-Min Jury Walkthrough Active'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMinimized(false)}
            className="text-[11px] font-bold text-orange-400 hover:text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700"
          >
            {language === 'hi' ? 'दिखाएं' : 'Expand'}
          </button>
          <button
            onClick={onCloseDemo}
            className="text-slate-400 hover:text-white p-0.5"
            title="Exit Demo Mode"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 border-b-2 border-orange-500 text-white p-3 sm:p-4 shadow-lg transition-all">
      <div className="max-w-7xl mx-auto flex flex-col gap-2.5">
        {/* Top Title Bar */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-orange-500 text-slate-950 flex items-center justify-center font-black text-xs">
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xs sm:text-sm text-orange-400 tracking-wide uppercase">
                  {t.demoMode} — 2-Min Jury Evaluation Pipeline
                </span>
                <span className="text-[9px] font-bold bg-green-500/20 text-green-400 border border-green-500/40 px-2 py-0.2 rounded-full">
                  DGMS / OSHA Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                {t.demoModeDesc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleInstantPreFillCert}
              className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Instantly generate a valid certificate for quick QR testing"
            >
              <Award className="w-3 h-3" />
              <span>{language === 'hi' ? 'त्वरित डेमो प्रमाणपत्र भरें' : 'Instant Demo Certificate'}</span>
            </button>

            <button
              onClick={() => setMinimized(true)}
              className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-900 border border-slate-800"
            >
              {language === 'hi' ? 'छिपाएं' : 'Minimize'}
            </button>

            <button
              onClick={onCloseDemo}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close Demo Bar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 6-Stage Interactive Stepper for Judges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1 text-xs">
          {/* 1. Worker Profile & Genuine ID Photo Verification */}
          <button
            onClick={() => { haptics.trigger('tap'); onOpenRegister(); }}
            className={`flex items-center justify-between p-2 rounded-lg border transition-all text-left group ${
              currentWorker.idPhotoUrl
                ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/70 hover:bg-slate-800'
                : 'bg-orange-950/40 border-orange-500 hover:bg-orange-900/50'
            }`}
          >
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400 block">1. {language === 'hi' ? 'आईडी पंजीकरण' : '1. ID Verify'}</span>
                {currentWorker.idPhotoUrl ? (
                  <span className="text-[8px] bg-emerald-500/20 text-emerald-300 font-bold px-1 rounded">Photo ✓</span>
                ) : (
                  <span className="text-[8px] bg-orange-500/30 text-orange-300 font-bold px-1 rounded animate-pulse">Required</span>
                )}
              </div>
              <strong className="text-white text-xs truncate block max-w-[110px] group-hover:text-orange-400">{currentWorker.name}</strong>
            </div>
            <UserPlus className="w-3.5 h-3.5 text-orange-400 shrink-0" />
          </button>

          {/* 2. AR Fire Safety */}
          <button
            onClick={() => { haptics.trigger('tap'); onLaunchModule('fire_explosion'); }}
            className={`flex items-center justify-between p-2 rounded-lg border transition-all text-left group ${
              activeModule?.id === 'fire_explosion' 
                ? 'bg-orange-500/20 border-orange-500 text-orange-300' 
                : 'bg-slate-900 border-slate-800 hover:border-orange-500/70 hover:bg-slate-800'
            }`}
          >
            <div>
              <span className="text-[10px] text-slate-400 block">2. {language === 'hi' ? 'सिमुलेशन 1' : 'Sim 1'}</span>
              <strong className="text-white text-xs block group-hover:text-orange-400">AR Fire Exting.</strong>
            </div>
            <Play className="w-3.5 h-3.5 text-orange-400 shrink-0" />
          </button>

          {/* 3. AR Gas Leak */}
          <button
            onClick={() => { haptics.trigger('tap'); onLaunchModule('gas_confined_space'); }}
            className={`flex items-center justify-between p-2 rounded-lg border transition-all text-left group ${
              activeModule?.id === 'gas_confined_space' 
                ? 'bg-orange-500/20 border-orange-500 text-orange-300' 
                : 'bg-slate-900 border-slate-800 hover:border-orange-500/70 hover:bg-slate-800'
            }`}
          >
            <div>
              <span className="text-[10px] text-slate-400 block">3. {language === 'hi' ? 'सिमुलेशन 2' : 'Sim 2'}</span>
              <strong className="text-white text-xs block group-hover:text-orange-400">AR Gas & LOTO</strong>
            </div>
            <Play className="w-3.5 h-3.5 text-orange-400 shrink-0" />
          </button>

          {/* 4. Assessment */}
          <button
            onClick={() => { haptics.trigger('tap'); onLaunchAssessment(); }}
            className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-orange-500/70 hover:bg-slate-800 transition-all text-left group"
          >
            <div>
              <span className="text-[10px] text-slate-400 block">4. {language === 'hi' ? 'मूल्यांकन' : 'Exam (70%)'}</span>
              <strong className="text-white text-xs block group-hover:text-orange-400">DGMS Assess</strong>
            </div>
            <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
          </button>

          {/* 5. Certificate */}
          <button
            onClick={() => { haptics.trigger('tap'); onViewCertificate(); }}
            className={`flex items-center justify-between p-2 rounded-lg border transition-all text-left group ${
              hasCertificate
                ? 'bg-emerald-950/40 border-emerald-500/60 hover:bg-emerald-900/40'
                : 'bg-slate-900 border-slate-800 hover:border-orange-500/70 hover:bg-slate-800'
            }`}
          >
            <div>
              <span className="text-[10px] text-slate-400 block">5. {language === 'hi' ? 'प्रमाणपत्र' : 'Credential'}</span>
              <strong className="text-white text-xs block group-hover:text-orange-400">
                {hasCertificate ? 'View Digital Cert' : 'Generate Cert'}
              </strong>
            </div>
            <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          </button>

          {/* 6. QR Scanner Verification */}
          <button
            onClick={() => { haptics.trigger('tap'); onOpenScanner(); }}
            className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-orange-500/70 hover:bg-slate-800 transition-all text-left group"
          >
            <div>
              <span className="text-[10px] text-slate-400 block">6. {language === 'hi' ? 'सत्यापन' : 'Verification'}</span>
              <strong className="text-white text-xs block group-hover:text-orange-400">QR / Ledger Verify</strong>
            </div>
            <QrCode className="w-3.5 h-3.5 text-orange-400 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
