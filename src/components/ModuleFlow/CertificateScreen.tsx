import React, { useEffect, useState } from 'react';
import { 
  Award, ShieldCheck, Download, Printer, RotateCcw, 
  BookOpen, QrCode, CheckCircle2, Clock, ExternalLink, 
  User, Check, Sparkles 
} from 'lucide-react';
import { CertificateRecord, Language, WorkerProfile } from '../../types';
import { generateQRCodeDataUrl } from '../../utils/qrGenerator';
import { downloadCertificatePNG } from '../../utils/certificateDownloader';
import { haptics } from '../../utils/haptics';

interface CertificateScreenProps {
  certificate: CertificateRecord;
  worker: WorkerProfile;
  language: Language;
  onRetakeTest: () => void;
  onReviewTraining: () => void;
  onVerifyInAdmin?: () => void;
}

export const CertificateScreen: React.FC<CertificateScreenProps> = ({
  certificate,
  worker,
  language,
  onRetakeTest,
  onReviewTraining,
  onVerifyInAdmin,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  useEffect(() => {
    async function loadQR() {
      const payload = {
        certId: certificate.certificateId,
        worker: `${certificate.workerName} (${certificate.workerId})`,
        module: certificate.moduleName,
        score: `${certificate.score}%`,
        date: certificate.date,
        status: certificate.status,
        auth: 'DGMS-CERT-LEDGER-VERIFIED'
      };
      const url = await generateQRCodeDataUrl(payload);
      setQrDataUrl(url);
    }
    loadQR();
  }, [certificate]);

  const handleDownloadPNG = async () => {
    haptics.trigger('success');
    setIsDownloading(true);
    try {
      await downloadCertificatePNG(certificate);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (e) {
      console.error('Download error:', e);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    haptics.trigger('tap');
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 flex flex-col gap-6 animate-fadeIn">
      {/* Top Action Bar */}
      <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-black tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              ✓ DGMS Verified Credential
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ID: {certificate.certificateId}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            {language === 'hi' ? 'आधिकारिक डिजिटल सुरक्षा प्रमाणपत्र' : language === 'sat' ? 'ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ' : 'Official Industrial Safety Certificate'}
          </h2>
        </div>

        {/* Download & Print CTAs */}
        <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto justify-end">
          <button
            id="btn-download-cert-png"
            onClick={handleDownloadPNG}
            disabled={isDownloading}
            className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs sm:text-sm uppercase tracking-tight rounded-xl shadow-md transition-all cursor-pointer"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>{language === 'hi' ? 'डाउनलोड हुआ!' : 'Downloaded!'}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{isDownloading ? (language === 'hi' ? 'तैयार हो रहा है...' : 'Generating...') : (language === 'hi' ? 'प्रमाणपत्र डाउनलोड करें (PNG)' : 'Download Certificate (PNG)')}</span>
              </>
            )}
          </button>

          <button
            id="btn-print-cert"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 active:scale-95 text-white font-bold text-xs sm:text-sm uppercase tracking-tight rounded-xl transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-orange-400" />
            <span>{language === 'hi' ? 'प्रिंट / PDF' : 'Print / PDF'}</span>
          </button>
        </div>
      </div>

      {/* The Printable Certificate Canvas / Card */}
      <div 
        id="printable-certificate-view"
        className="bg-white border-4 border-slate-900 rounded-2xl p-6 sm:p-10 shadow-xl relative overflow-hidden print:border-none print:shadow-none print:p-0"
      >
        {/* Decorative inner orange border */}
        <div className="absolute inset-2 border-2 border-orange-400 rounded-xl pointer-events-none" />

        {/* Certificate Header Banner */}
        <div className="flex items-start justify-between border-b-2 border-slate-100 pb-5 mb-6 relative">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-6 h-6 text-orange-500" />
              <span className="text-[10px] font-black tracking-widest uppercase text-orange-600">
                DIRECTORATE GENERAL OF MINES SAFETY (DGMS)
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
              Certificate of Competency
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Conferred under the Indian Mines Act & DGMS Coal Mines Regulations 2017
            </p>
          </div>

          {/* Official Seal Emblem */}
          <div className="flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-orange-500 bg-orange-50 text-orange-700 font-black text-[9px] text-center shadow-inner leading-tight p-1 shrink-0">
            <span className="text-[11px]">DGMS</span>
            <span className="text-[8px] uppercase font-bold text-slate-600">VERIFIED</span>
            <span className="text-[10px]">2026</span>
          </div>
        </div>

        {/* Candidate & Specialization Details */}
        <div className="space-y-6 relative">
          <p className="text-xs sm:text-sm text-slate-500 font-serif italic text-center sm:text-left">
            This is to certify that industrial candidate
          </p>

          {/* Worker Info Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              {certificate.workerIdPhotoUrl ? (
                <div className="relative w-14 h-14 rounded-lg overflow-hidden border-2 border-emerald-500 shadow-sm shrink-0 bg-slate-900">
                  <img
                    src={certificate.workerIdPhotoUrl}
                    alt={certificate.workerName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-emerald-600 text-[7px] text-white font-black text-center py-0.2">
                    GENUINE
                  </div>
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 font-bold shrink-0">
                  <User className="w-6 h-6" />
                </div>
              )}

              <div className="text-center sm:text-left">
                <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    {certificate.workerName}
                  </h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2 py-0.5 rounded">
                    Candidate Verified ✓
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  ID: <strong className="text-slate-800">{certificate.workerId}</strong> • Facility: {certificate.organization}
                </p>
              </div>
            </div>

            {/* Score Pill */}
            <div className="bg-emerald-50 border border-emerald-300 px-5 py-2.5 rounded-xl text-center shrink-0">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                COMPLIANCE SCORE
              </span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-700">
                {certificate.score}%
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 font-serif italic text-center sm:text-left">
            has demonstrated operational mastery in Augmented Reality simulation and passed examination for:
          </p>

          {/* Module Box */}
          <div className="bg-orange-50/70 border border-orange-200 rounded-xl p-4 sm:p-5">
            <span className="text-[10px] uppercase font-black tracking-widest text-orange-600 block mb-1">
              APPROVED COMPETENCY SPECIALIZATION
            </span>
            <h2 className="text-base sm:text-xl font-bold text-slate-900">
              {certificate.moduleName}
            </h2>
            <span className="text-xs text-slate-600 block mt-1">
              Standard: {certificate.complianceStandard}
            </span>
          </div>

          {/* Metadata & QR Verification */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 items-center">
            <div className="sm:col-span-2 space-y-2 text-xs font-mono text-slate-700">
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-400">CERTIFICATE ID:</span>
                <span className="font-bold text-slate-900">{certificate.certificateId}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-400">DATE ISSUED:</span>
                <span>{certificate.date}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-400">VALID THROUGH:</span>
                <span className="text-emerald-700 font-bold">{certificate.expiryDate}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-400">STATUS:</span>
                <span className="text-emerald-700 font-bold">AUTHENTIC / ACTIVE</span>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-sm shrink-0">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QR Verification"
                  className="w-24 h-24 object-contain"
                />
              ) : (
                <div className="w-24 h-24 flex items-center justify-center bg-slate-100 text-slate-400">
                  <QrCode className="w-8 h-8" />
                </div>
              )}
              <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wider mt-1 text-center">
                Scan to Verify
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Post-Certificate Practice & Retake Controls */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between gap-3 flex-wrap">
        <div className="text-xs text-slate-500 font-medium">
          {language === 'hi' 
            ? 'आप अपनी सुरक्षा दक्षता बढ़ाने के लिए किसी भी समय प्रशिक्षण दोहरा सकते हैं या दोबारा परीक्षा दे सकते हैं।' 
            : 'You may revisit AR training or re-attempt the assessment to practice anytime.'}
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-cert-review-training"
            onClick={onReviewTraining}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase rounded-lg transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-orange-500" />
            <span>{language === 'hi' ? 'प्रशिक्षण पुनः देखें' : 'Review Training'}</span>
          </button>

          <button
            id="btn-cert-retake-test"
            onClick={onRetakeTest}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase rounded-lg transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-orange-400" />
            <span>{language === 'hi' ? 'पुनः परीक्षा दें' : 'Retake Test'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
