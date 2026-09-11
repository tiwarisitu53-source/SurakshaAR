import React, { useEffect, useState } from 'react';
import { Award, ShieldCheck, QrCode, Printer, CheckCircle2, Clock, X, ExternalLink, Building2, User } from 'lucide-react';
import { CertificateRecord, Language } from '../../types';
import { translations } from '../../data/translations';
import { generateQRCodeDataUrl } from '../../utils/qrGenerator';

interface DigitalCertificateModalProps {
  certificate: CertificateRecord;
  language: Language;
  onClose: () => void;
  onVerifyInAdmin?: (certId: string) => void;
}

export const DigitalCertificateModal: React.FC<DigitalCertificateModalProps> = ({
  certificate,
  language,
  onClose,
  onVerifyInAdmin
}) => {
  const t = translations[language];
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

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

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded shadow-2xl overflow-hidden my-auto flex flex-col print:border-none print:shadow-none print:w-full print:max-w-none">
        {/* Top Control Bar */}
        <div className="bg-slate-900 px-5 py-3 border-b border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded uppercase tracking-wider ${
              certificate.synced 
                ? 'bg-green-950 text-green-400 border border-green-800' 
                : 'bg-orange-950 text-orange-400 border border-orange-800'
            }`}>
              {certificate.synced ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                  <span>{t.centralLedgerSynced}</span>
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 text-orange-400" />
                  <span>{t.offlineStoredPending}</span>
                </>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase tracking-tight rounded transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.printCertificate}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Canvas */}
        <div className="p-6 sm:p-8 bg-white text-slate-900 flex flex-col gap-5 print:bg-white print:text-slate-900 print:p-8">
          {/* Header & Seals */}
          <div className="flex items-start justify-between border-b-2 border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-6 h-6 text-orange-500" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-orange-500">
                  {t.nationalSafetyHeader}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 uppercase tracking-tight">
                {t.certificateOfCompetency}
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {t.issuedInAccordance}
              </p>
            </div>

            {/* Official DGMS Gold Emblem Badge */}
            <div className="hidden sm:flex flex-col items-center justify-center w-16 h-16 rounded border-2 border-orange-400 bg-orange-50 text-orange-600 font-black text-[9px] text-center shadow-sm leading-tight p-1">
              <span>DGMS</span>
              <span>{t.verifiedBadge}</span>
              <span>2026</span>
            </div>
          </div>

          {/* Certificate Body */}
          <div className="space-y-4 text-center sm:text-left">
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {t.certifyText}
            </p>

            {/* Worker Highlight Box with Genuine Photo ID */}
            <div className="bg-slate-50 border border-slate-200 rounded p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {certificate.workerIdPhotoUrl ? (
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden border-2 border-emerald-500 shadow-sm shrink-0 bg-slate-900 flex items-center justify-center">
                    <img 
                      src={certificate.workerIdPhotoUrl} 
                      alt="Verified Candidate ID" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-emerald-600 text-[7px] text-white font-black text-center py-0.5">
                      GENUINE
                    </div>
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 font-bold shrink-0">
                    <User className="w-6 h-6" />
                  </div>
                )}
                <div className="text-left">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                      {certificate.workerName}
                    </h3>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Candidate Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {t.workerIdLabel}: <strong className="font-mono text-slate-800">{certificate.workerId}</strong>
                  </p>
                </div>
              </div>

              {/* Score Badge */}
              <div className="bg-green-50 border border-green-200 px-4 py-2 rounded text-center">
                <span className="text-[10px] uppercase font-bold text-green-700 block">
                  {t.gradeAchieved}
                </span>
                <span className="text-xl font-bold text-green-700">
                  {certificate.score}%
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {t.simulationCompletedText}
            </p>

            {/* Module Name Box */}
            <div className="bg-orange-50/50 border border-orange-200 rounded p-3.5 text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold tracking-wider text-orange-600 block">
                {t.complianceSpecialization}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {certificate.moduleName}
              </h2>
              <span className="text-xs text-slate-500 block mt-0.5">
                {t.standardLabel}: {certificate.complianceStandard}
              </span>
            </div>
          </div>

          {/* Grid: Dates, Organization & QR Code */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 items-center">
            {/* Meta Info */}
            <div className="sm:col-span-2 space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">{t.certificateId}:</span>
                <span className="font-mono font-bold text-slate-900">{certificate.certificateId}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">{t.issueDate}:</span>
                <span className="font-semibold text-slate-800">{certificate.date}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">{t.validTill}:</span>
                <span className="font-semibold text-green-600">{certificate.expiryDate}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-500">{t.organization}:</span>
                <span className="font-medium text-slate-800 text-right truncate max-w-[200px]">{certificate.organization}</span>
              </div>
            </div>

            {/* Verifiable High-Res QR Code */}
            <div className="flex flex-col items-center justify-center p-2 bg-slate-50 rounded border border-slate-200 shadow-sm">
              {qrDataUrl ? (
                <img 
                  src={qrDataUrl} 
                  alt="Compliance Verification QR Code" 
                  className="w-24 h-24 object-contain"
                />
              ) : (
                <div className="w-24 h-24 flex items-center justify-center bg-slate-100 text-slate-400">
                  <QrCode className="w-8 h-8" />
                </div>
              )}
              <span className="text-[9px] font-bold text-slate-700 uppercase tracking-wider mt-1 text-center">
                {t.scanToVerify}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Admin Action */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between gap-3 print:hidden">
          <div className="text-xs text-slate-500 font-medium">
            {t.certifiedViaEngine}
          </div>

          {onVerifyInAdmin && (
            <button
              onClick={() => onVerifyInAdmin(certificate.certificateId)}
              className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-tight rounded shadow-sm transition-all active:scale-95"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{t.verifyInAdmin}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
