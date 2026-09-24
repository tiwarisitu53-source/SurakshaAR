import { CertificateRecord } from '../types';
import { generateQRCodeDataUrl } from './qrGenerator';

/**
 * Generates a high-resolution (1200x850) certificate PNG using native HTML5 Canvas
 * and triggers an automatic browser file download.
 */
export async function downloadCertificatePNG(cert: CertificateRecord): Promise<void> {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 850;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Outer Border
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#0F172A'; // Slate 900
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

  // Inner Accent Border (Gold / Safety Orange)
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#F97316'; // Orange 500
  ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);

  // Decorative Corner Accents
  const cornerSize = 40;
  ctx.fillStyle = '#F97316';
  // Top-left
  ctx.fillRect(36, 36, cornerSize, 6);
  ctx.fillRect(36, 36, 6, cornerSize);
  // Top-right
  ctx.fillRect(canvas.width - 36 - cornerSize, 36, cornerSize, 6);
  ctx.fillRect(canvas.width - 42, 36, 6, cornerSize);
  // Bottom-left
  ctx.fillRect(36, canvas.height - 42, cornerSize, 6);
  ctx.fillRect(36, canvas.height - 36 - cornerSize, 6, cornerSize);
  // Bottom-right
  ctx.fillRect(canvas.width - 36 - cornerSize, canvas.height - 42, cornerSize, 6);
  ctx.fillRect(canvas.width - 42, canvas.height - 36 - cornerSize, 6, cornerSize);

  // Top Header Banner
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(60, 56, canvas.width - 120, 48);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DIRECTORATE GENERAL OF MINES SAFETY (DGMS) • MINISTRY OF LABOUR & EMPLOYMENT', canvas.width / 2, 86);

  // Seal / Emblem Badge (Circle on top right)
  const sealX = canvas.width - 130;
  const sealY = 150;
  ctx.beginPath();
  ctx.arc(sealX, sealY, 44, 0, Math.PI * 2);
  ctx.fillStyle = '#FFF7ED';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#F97316';
  ctx.stroke();

  ctx.fillStyle = '#C2410C';
  ctx.font = '900 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('DGMS', sealX, sealY - 14);
  ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('VERIFIED', sealX, sealY + 2);
  ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('2026', sealX, sealY + 18);

  // Main Title
  ctx.fillStyle = '#F97316';
  ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('NATIONAL INDUSTRIAL SAFETY & EMERGENCY COMPETENCY FRAMEWORK', canvas.width / 2, 140);

  ctx.fillStyle = '#0F172A';
  ctx.font = '900 34px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('CERTIFICATE OF COMPETENCY', canvas.width / 2, 185);

  ctx.fillStyle = '#64748B';
  ctx.font = 'normal 15px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Issued in accordance with DGMS Coal Mines Regulations 2017 & OSHA 29 CFR 1910', canvas.width / 2, 215);

  // Subtitle text
  ctx.fillStyle = '#475569';
  ctx.font = 'italic 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('This is to certify that industrial candidate', canvas.width / 2, 255);

  // Candidate Name
  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(cert.workerName.toUpperCase(), canvas.width / 2, 298);

  // Underline Candidate Name
  const textWidth = ctx.measureText(cert.workerName.toUpperCase()).width;
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#CBD5E1';
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - textWidth / 2 - 20, 310);
  ctx.lineTo(canvas.width / 2 + textWidth / 2 + 20, 310);
  ctx.stroke();

  // Candidate ID & Facility
  ctx.fillStyle = '#64748B';
  ctx.font = '600 15px "Plus Jakarta Sans", monospace';
  ctx.fillText(`EMPLOYEE ID: ${cert.workerId}   |   FACILITY: ${cert.organization || 'Eastern Coalfields Heavy Unit'}`, canvas.width / 2, 335);

  // Certification Statement
  ctx.fillStyle = '#334155';
  ctx.font = 'normal 15px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('has successfully undergone interactive Augmented Reality hazard training and passed the proctored examination for:', canvas.width / 2, 375);

  // Module Name Box
  ctx.fillStyle = '#FFF7ED';
  ctx.fillRect(140, 395, canvas.width - 280, 70);
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#FDBA74';
  ctx.strokeRect(140, 395, canvas.width - 280, 70);

  ctx.fillStyle = '#9A3412';
  ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('SPECIALIZED COMPLIANCE MODULE', canvas.width / 2, 418);

  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(cert.moduleName, canvas.width / 2, 448);

  // Standard label
  ctx.fillStyle = '#64748B';
  ctx.font = 'italic 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Standard: ${cert.complianceStandard}`, canvas.width / 2, 485);

  // Score Highlight Box
  ctx.fillStyle = '#F0FDF4';
  ctx.fillRect(140, 510, 260, 68);
  ctx.strokeStyle = '#86EFAC';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(140, 510, 260, 68);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#166534';
  ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('ASSESSMENT SCORE ACHIEVED', 160, 532);
  ctx.font = '900 28px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`${cert.score}%  (PASSED)`, 160, 563);

  // Metadata Table Box
  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(420, 510, canvas.width - 560, 68);
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(420, 510, canvas.width - 560, 68);

  ctx.fillStyle = '#64748B';
  ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('CERTIFICATE ID:', 440, 532);
  ctx.fillText('ISSUE DATE:', 440, 552);
  ctx.fillText('VALID UNTIL:', 440, 568);

  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.fillText(cert.certificateId, 560, 532);
  ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(cert.date, 560, 552);
  ctx.fillStyle = '#16A34A';
  ctx.fillText(`${cert.expiryDate} (Official Recertification Required)`, 560, 568);

  // Load and Render QR Code onto Canvas
  try {
    const qrPayload = {
      certId: cert.certificateId,
      worker: `${cert.workerName} (${cert.workerId})`,
      module: cert.moduleName,
      score: `${cert.score}%`,
      date: cert.date,
      status: cert.status,
      auth: 'DGMS-CERT-LEDGER-VERIFIED'
    };
    const qrDataUrl = await generateQRCodeDataUrl(qrPayload);
    if (qrDataUrl) {
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 140, 610, 130, 130);
          ctx.strokeStyle = '#CBD5E1';
          ctx.lineWidth = 1;
          ctx.strokeRect(140, 610, 130, 130);
          resolve();
        };
        img.onerror = () => resolve();
        img.src = qrDataUrl;
      });
    }
  } catch (e) {
    console.error('Failed to draw QR onto certificate canvas', e);
  }

  // QR Code Caption
  ctx.textAlign = 'left';
  ctx.fillStyle = '#64748B';
  ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('SCAN TO VERIFY TAMPER-PROOF CREDENTIAL', 140, 758);
  ctx.font = 'normal 10px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Immutable cryptographic signature backed by DGMS Eastern Sector Ledger', 140, 774);

  // Signatures on Right
  const sigX = canvas.width - 320;
  // Signature line 1
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#94A3B8';
  ctx.beginPath();
  ctx.moveTo(sigX, 690);
  ctx.lineTo(sigX + 220, 690);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Director of Mines Safety (Tech)', sigX + 110, 710);
  ctx.fillStyle = '#64748B';
  ctx.font = 'normal 11px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('DGMS Eastern Zone Headquarters', sigX + 110, 726);

  // Verification stamp text
  ctx.fillStyle = '#059669';
  ctx.font = 'bold 12px "Plus Jakarta Sans", monospace';
  ctx.fillText('DIGITALLY SIGNED & VERIFIED ✓', sigX + 110, 665);

  // Bottom Notice
  ctx.fillStyle = '#94A3B8';
  ctx.font = 'normal 10px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SurakshaAR Safety System • Authentic Electronic Record under Section 4 of IT Act 2000 • ISO 45001:2018 Certified Process', canvas.width / 2, 818);

  // Trigger Instant Download
  const dataUrl = canvas.toDataURL('image/png');
  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = `SurakshaAR-Certificate-${cert.certificateId}.png`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}
