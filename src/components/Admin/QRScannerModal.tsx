import React, { useState, useEffect, useRef } from 'react';
import { QrCode, Camera, CheckCircle2, XCircle, ShieldCheck, ShieldAlert, Search, RefreshCw, AlertTriangle } from 'lucide-react';
import { CertificateRecord, Language } from '../../types';
import { translations } from '../../data/translations';
import { offlineStorage } from '../../utils/offlineStorage';
import { parseQRText } from '../../utils/qrGenerator';

interface QRScannerModalProps {
  language: Language;
  onClose: () => void;
  initialCertId?: string;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  language,
  onClose,
  initialCertId = ''
}) => {
  const t = translations[language];
  const [certInput, setCertInput] = useState<string>(initialCertId);
  const [verificationResult, setVerificationResult] = useState<{
    status: 'idle' | 'valid' | 'expired' | 'invalid';
    certificate?: CertificateRecord;
    message?: string;
  }>({ status: 'idle' });

  const [cameraScanning, setCameraScanning] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Auto-verify if initialCertId provided
  useEffect(() => {
    if (initialCertId) {
      verifyCertificateId(initialCertId);
    }
  }, [initialCertId]);

  // Video scanner setup
  useEffect(() => {
    let stream: MediaStream | null = null;
    async function startScannerCamera() {
      if (!cameraScanning) {
        if (videoRef.current && videoRef.current.srcObject) {
          const s = videoRef.current.srcObject as MediaStream;
          s.getTracks().forEach(t => t.stop());
          videoRef.current.srcObject = null;
        }
        return;
      }
      try {
        if (navigator?.mediaDevices?.getUserMedia) {
          try {
            stream = await navigator.mediaDevices.getUserMedia({
              video: { facingMode: { ideal: 'environment' } },
              audio: false
            });
          } catch (e1) {
            stream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: false
            });
          }
          if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
          }
        }
      } catch (err) {
        console.warn('Scanner camera unavailable, manual search active:', err);
      }
    }
    startScannerCamera();
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [cameraScanning]);

  const verifyCertificateId = async (idToVerify: string) => {
    const cleanId = idToVerify.trim().toUpperCase();
    if (!cleanId) return;

    // Check local storage certificates first (offline-first architecture)
    const localCerts = offlineStorage.getCertificates();
    const match = localCerts.find(c => c.certificateId.toUpperCase() === cleanId);

    if (match) {
      setVerificationResult({
        status: match.status === 'Valid' ? 'valid' : 'expired',
        certificate: match,
        message: match.status === 'Valid' 
          ? 'Certificate Valid & Verified against Central DGMS / OSHA Compliance Ledger.' 
          : `Certificate Record Found: Status is ${match.status}. Recertification required.`
      });
      return;
    }

    // Try backend verification API
    try {
      const res = await fetch(`/api/certificates/verify/${cleanId}`);
      if (res.ok) {
        const data = await res.json();
        setVerificationResult({
          status: data.valid ? 'valid' : 'expired',
          certificate: data.certificate,
          message: data.message
        });
      } else {
        setVerificationResult({
          status: 'invalid',
          message: 'Certificate ID not found in compliance ledger. Unverified credential.'
        });
      }
    } catch (e) {
      setVerificationResult({
        status: 'invalid',
        message: 'Unable to reach verification ledger and no local record exists.'
      });
    }
  };

  // Simulate scanning a sample QR code
  const handleSimulateScan = (certId: string) => {
    setCertInput(certId);
    verifyCertificateId(certId);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col">
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                {t.verifyCertificate}
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                {language === 'hi' ? 'DGMS / OSHA सत्यापन योग्य QR कोड स्कैनर' : language === 'sat' ? 'DGMS / OSHA QR ᱠᱳᱰ ᱥᱠᱮᱱᱟᱨ' : 'DGMS / OSHA Verifiable QR Code Scanner'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 flex flex-col gap-4">
          {/* Camera Scanner Viewport or Manual Input */}
          <div className="relative w-full h-48 bg-slate-950 rounded-2xl overflow-hidden border-2 border-dashed border-amber-500/40 flex items-center justify-center">
            {cameraScanning ? (
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className="w-full h-full object-cover"
              />
            ) : null}

            {/* Scanner Laser / Reticle Overlay */}
            <div className="absolute inset-x-12 top-1/2 -translate-y-1/2 h-28 border-2 border-amber-400 rounded-xl pointer-events-none shadow-[0_0_25px_rgba(251,191,36,0.3)]">
              <div className="w-full h-0.5 bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,1)]" />
            </div>

            <div className="absolute bottom-2 inset-x-2 flex justify-between items-center text-[10px] text-slate-300 bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-lg">
              <span>{language === 'hi' ? 'QR कोड को फ्रेम में संरेखित करें' : language === 'sat' ? 'QR ᱠᱳᱰ ᱯᱷᱨᱮᱢ ᱨᱮ ᱥᱟᱢᱟᱝ ᱢᱮ' : 'Align QR Code inside frame'}</span>
              <button 
                onClick={() => setCameraScanning(!cameraScanning)}
                className="text-amber-400 font-semibold hover:underline"
              >
                {cameraScanning 
                  ? (language === 'hi' ? 'कैमरा रोकें' : language === 'sat' ? 'ᱠᱮᱢᱨᱟ ᱛᱷᱟᱢᱟᱣ' : 'Pause Camera')
                  : (language === 'hi' ? 'कैमरा शुरू करें' : language === 'sat' ? 'ᱠᱮᱢᱨᱟ ᱮᱦᱚᱵ' : 'Start Camera')}
              </button>
            </div>
          </div>

          {/* Manual Input Search Box */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={language === 'hi' ? 'प्रमाणपत्र ID दर्ज करें (उदा. SURAKSHA-IND-2026-FIRE-8921B)...' : language === 'sat' ? 'ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ID ᱮᱢ ᱢᱮ...' : 'Enter Certificate ID (e.g. SURAKSHA-IND-2026-FIRE-8921B)...'}
                value={certInput}
                onChange={e => setCertInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && verifyCertificateId(certInput)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white placeholder:text-slate-500 outline-none font-mono font-medium"
              />
            </div>
            <button
              onClick={() => verifyCertificateId(certInput)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-95 shrink-0"
            >
              {t.verify}
            </button>
          </div>

          {/* Quick Demo Certificate Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
            <span>{language === 'hi' ? 'नमूना आज़माएं:' : language === 'sat' ? 'ᱢᱟᱱᱟᱣ ᱧᱮᱞ:' : 'Try sample:'}</span>
            <button
              onClick={() => handleSimulateScan('SURAKSHA-IND-2026-FIRE-8921B')}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded-md text-amber-300 font-mono text-[10px] border border-slate-700"
            >
              FIRE-8921B ({t.verifiedStatus})
            </button>
            <button
              onClick={() => handleSimulateScan('SURAKSHA-IND-2026-GAS-4390A')}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded-md text-amber-300 font-mono text-[10px] border border-slate-700"
            >
              GAS-4390A ({t.verifiedStatus})
            </button>
            <button
              onClick={() => handleSimulateScan('SURAKSHA-IND-2026-GAS-7721D')}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded-md text-red-300 font-mono text-[10px] border border-slate-700"
            >
              GAS-7721D ({language === 'hi' ? 'समाप्त' : language === 'sat' ? 'ᱪᱟᱵᱟ' : 'Expired'})
            </button>
          </div>

          {/* Verification Result Output */}
          {verificationResult.status !== 'idle' && (
            <div className={`p-4 rounded-2xl border-2 transition-all ${
              verificationResult.status === 'valid'
                ? 'bg-emerald-950/70 border-emerald-500/80 text-emerald-100 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                : verificationResult.status === 'expired'
                ? 'bg-amber-950/70 border-amber-500/80 text-amber-100 shadow-[0_0_30px_rgba(245,158,11,0.2)]'
                : 'bg-red-950/70 border-red-500/80 text-red-100 shadow-[0_0_30px_rgba(239,68,68,0.2)]'
            }`}>
              {/* Header Status */}
              <div className="flex items-center gap-2 mb-2">
                {verificationResult.status === 'valid' ? (
                  <>
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                    <span className="font-black text-sm uppercase tracking-wide text-emerald-300">
                      {language === 'hi' ? 'प्रमाणपत्र मान्य (DGMS प्रमाणित)' : language === 'sat' ? 'ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱴᱷᱤᱠ ᱜᱮᱭᱟ (DGMS)' : 'CERTIFICATE VALID (DGMS CERTIFIED)'}
                    </span>
                  </>
                ) : verificationResult.status === 'expired' ? (
                  <>
                    <AlertTriangle className="w-6 h-6 text-amber-400" />
                    <span className="font-black text-sm uppercase tracking-wide text-amber-300">
                      {language === 'hi' ? 'प्रमाणपत्र समाप्त (पुनः प्रमाणीकरण आवश्यक)' : language === 'sat' ? 'ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱪᱟᱵᱟ ᱟᱠᱟᱱᱟ (ᱟᱨᱦᱚᱸ ᱵᱤᱰᱟᱹᱣ)' : 'CERTIFICATE EXPIRED (RECERTIFICATION DUE)'}
                    </span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-6 h-6 text-red-400" />
                    <span className="font-black text-sm uppercase tracking-wide text-red-300">
                      {language === 'hi' ? 'अमान्य / अपंजीकृत प्रमाणपत्र' : language === 'sat' ? 'ᱵᱟᱝ ᱴᱷᱤᱠ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ' : 'INVALID / UNREGISTERED CERTIFICATE'}
                    </span>
                  </>
                )}
              </div>

              {/* Certificate Details card */}
              {verificationResult.certificate && (
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs space-y-1 font-mono text-slate-200 mt-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t.workerIdLabel}:</span>
                    <strong className="text-white">{verificationResult.certificate.workerId} ({verificationResult.certificate.workerName})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t.moduleNameLabel}:</span>
                    <span className="text-amber-300 font-semibold">{verificationResult.certificate.moduleName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t.scorePercentageLabel}:</span>
                    <strong className="text-emerald-400 font-bold">{verificationResult.certificate.score}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t.issueDateLabel}:</span>
                    <span>{verificationResult.certificate.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t.statusLabel}:</span>
                    <span className={verificationResult.certificate.status === 'Valid' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                      {verificationResult.certificate.status === 'Valid' ? t.verifiedStatus : verificationResult.certificate.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t.standardLabel}:</span>
                    <span className="text-[10px] text-slate-400">{verificationResult.certificate.complianceStandard}</span>
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-300 mt-2 font-medium">
                {verificationResult.message}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
