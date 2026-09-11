import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle, XCircle, Award, TrendingUp, BarChart3, 
  QrCode, Download, Search, Filter, ShieldCheck, AlertTriangle, 
  Languages, Clock, Building2, Eye, RefreshCw
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { CertificateRecord, Language } from '../../types';
import { translations } from '../../data/translations';
import { offlineStorage } from '../../utils/offlineStorage';
import { QRScannerModal } from './QRScannerModal';
import { DigitalCertificateModal } from '../Certificate/DigitalCertificateModal';

interface AdminDashboardProps {
  language: Language;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ language }) => {
  const t = translations[language];

  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [scannerOpen, setScannerOpen] = useState<boolean>(false);
  const [selectedCertForView, setSelectedCertForView] = useState<CertificateRecord | null>(null);

  // Load certificates and subscribe to offline storage updates
  useEffect(() => {
    setCertificates(offlineStorage.getCertificates());
    const unsubscribe = offlineStorage.subscribe(() => {
      setCertificates(offlineStorage.getCertificates());
    });
    return unsubscribe;
  }, []);

  // Filter records
  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = 
      cert.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.workerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.certificateId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.moduleName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || cert.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesLang = languageFilter === 'all' || cert.language.toLowerCase() === languageFilter.toLowerCase();
    const matchesDept = departmentFilter === 'all' || cert.organization.toLowerCase().includes(departmentFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesLang && matchesDept;
  });

  // Export Compliance Report CSV
  const handleExportCSV = () => {
    const headers = ["Certificate ID", "Worker ID", "Worker Name", "Module", "Score (%)", "Status", "Date", "Expiry Date", "Language", "Organization", "Standard"];
    const rows = filteredCertificates.map(c => [
      c.certificateId,
      c.workerId,
      `"${c.workerName}"`,
      `"${c.moduleName}"`,
      c.score,
      c.status,
      c.date,
      c.expiryDate,
      c.language,
      `"${c.organization}"`,
      `"${c.complianceStandard}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SurakshaAR_Compliance_Audit_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Recharts Data
  const languageData = [
    { name: 'Hindi (हिंदी)', value: 58, color: '#f59e0b' },
    { name: 'Santali (ᱥᱟᱱᱛᱟᱲᱤ)', value: 28, color: '#10b981' },
    { name: 'English', value: 14, color: '#38bdf8' }
  ];

  const departmentData = [
    { department: 'Underground Pit #3', trained: 420, passRate: 88 },
    { department: 'Refineries Unit 4', trained: 340, passRate: 92 },
    { department: 'Open Cast Mining', trained: 290, passRate: 84 },
    { department: 'Steel Smelter Pit', trained: 198, passRate: 79 }
  ];

  const [quickScanInput, setQuickScanInput] = useState<string>('');

  const handleQuickVerify = () => {
    if (!quickScanInput.trim()) {
      setScannerOpen(true);
      return;
    }
    const match = certificates.find(
      c => c.certificateId.toLowerCase().includes(quickScanInput.toLowerCase().trim()) ||
           c.workerId.toLowerCase().includes(quickScanInput.toLowerCase().trim())
    );
    if (match) {
      setSelectedCertForView(match);
    } else {
      setScannerOpen(true);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 sm:p-8 flex flex-col gap-6 text-slate-800">
      {/* Top Banner / Actions (Geometric Balance Header) */}
      <div className="bg-white border border-slate-200 p-6 rounded shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              {t.regionalTrainingOverview}
            </h1>
            <div className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-500 uppercase tracking-wider">
              {t.easternSectorZone}
            </div>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {t.regionalTrainingDesc}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            id="btn-admin-scan-qr"
            onClick={() => setScannerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm uppercase tracking-tight rounded shadow-sm transition-all active:scale-95"
          >
            <QrCode className="w-4 h-4 text-white" />
            <span>{t.scanQRCode}</span>
          </button>

          <button
            id="btn-admin-download-csv"
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm uppercase tracking-tight rounded transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-green-400" />
            <span>{t.downloadReport}</span>
          </button>
        </div>
      </div>

      {/* KPI 4-Card Grid (Geometric Balance Archetype) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Workers */}
        <div className="bg-white p-5 border border-slate-200 rounded shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{t.totalWorkers}</div>
            <div className="text-3xl font-bold text-slate-900">1,248</div>
          </div>
          <div className="text-xs text-green-600 mt-2 font-semibold">{t.thisMonthGrowth}</div>
        </div>

        {/* Certificates Issued */}
        <div className="bg-white p-5 border border-slate-200 rounded shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{t.certificatesIssued}</div>
            <div className="text-3xl font-bold text-slate-900">1,087</div>
          </div>
          <div className="text-xs text-slate-500 mt-2 font-semibold">{t.passRateText}</div>
        </div>

        {/* Average Score */}
        <div className="bg-white p-5 border border-slate-200 rounded shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{t.averageScore}</div>
            <div className="text-3xl font-bold text-slate-900">81%</div>
          </div>
          <div className="text-xs text-orange-600 mt-2 font-semibold">{t.targetScoreText}</div>
        </div>

        {/* Active Hazards */}
        <div className="bg-white p-5 border border-slate-200 rounded shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{t.activeHazards}</div>
            <div className="text-3xl font-bold text-slate-900">04</div>
          </div>
          <div className="text-xs text-red-600 mt-2 font-semibold">{t.requiresReviewText}</div>
        </div>
      </div>

      {/* 3-Column Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Col 1 & 2: Recent Safety Assessments Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded flex flex-col shadow-sm">
          {/* Card Header with Filters */}
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold uppercase text-xs tracking-widest text-slate-500">
                {t.recentAssessments}
              </h2>
              <span className="text-xs text-slate-400">{t.recentAssessmentsDesc}</span>
            </div>

            {/* Quick Filter Inputs */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t.searchWorkerPlaceholder}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded pl-8 pr-2.5 py-1 text-xs text-slate-800 placeholder:text-slate-400 outline-none w-36 sm:w-44 focus:border-orange-500"
                />
              </div>

              <select
                value={languageFilter}
                onChange={e => setLanguageFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-medium text-slate-600 outline-none"
              >
                <option value="all">{t.allLanguages}</option>
                <option value="hindi">हिन्दी (Hindi)</option>
                <option value="santali">ᱥᱟᱱᱛᱟᱲᱤ (Santali)</option>
                <option value="english">English</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[10px] text-slate-400 uppercase bg-slate-50 border-b border-slate-200">
                <tr className="h-10">
                  <th className="px-5 font-semibold">{t.thWorkerId}</th>
                  <th className="px-5 font-semibold">{t.thModule}</th>
                  <th className="px-5 font-semibold">{t.thLanguage}</th>
                  <th className="px-5 font-semibold">{t.thScore}</th>
                  <th className="px-5 font-semibold">{t.thVerification}</th>
                  <th className="px-5 font-semibold text-right">{t.thAction}</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {filteredCertificates.length > 0 ? (
                  filteredCertificates.map((cert, index) => {
                    const isEven = index % 2 === 1;
                    const langBadgeClass = 
                      cert.language.toLowerCase().includes('santali')
                        ? 'bg-blue-50 text-blue-700'
                        : cert.language.toLowerCase().includes('hindi')
                        ? 'bg-orange-50 text-orange-700'
                        : 'bg-slate-100 text-slate-700';

                    return (
                      <tr key={cert.certificateId} className={`h-14 transition-colors hover:bg-orange-50/30 ${isEven ? 'bg-slate-50/50' : 'bg-white'}`}>
                        <td className="px-5">
                          <div className="font-mono text-xs font-semibold text-slate-800">{cert.workerId}</div>
                          <div className="text-[11px] text-slate-500">{cert.workerName}</div>
                        </td>
                        <td className="px-5 text-xs text-slate-700 font-medium">
                          {cert.moduleName}
                        </td>
                        <td className="px-5">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${langBadgeClass}`}>
                            {cert.language}
                          </span>
                        </td>
                        <td className="px-5">
                          <span className={`font-bold ${cert.score >= 70 ? 'text-green-600' : 'text-red-500'}`}>
                            {cert.score}%
                          </span>
                        </td>
                        <td className="px-5">
                          {cert.status === 'Valid' ? (
                            <span className="text-green-500 text-[10px] uppercase font-black flex items-center gap-1">
                              <span>●</span> {t.verifiedStatus}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[10px] uppercase font-black flex items-center gap-1">
                              <span>●</span> {t.pendingRetryStatus}
                            </span>
                          )}
                        </td>
                        <td className="px-5 text-right">
                          <button
                            onClick={() => setSelectedCertForView(cert)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-bold"
                          >
                            {t.viewAction}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-xs text-slate-400">
                      {t.noMatchingRecords}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Col 3: Certificate Scanner Widget & Module Participation */}
        <div className="flex flex-col gap-6">
          {/* Certificate Scanner Widget Card */}
          <div className="bg-slate-800 text-white p-6 rounded border border-slate-900 shadow-lg flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-white p-1 rounded-sm mb-4 shadow-sm">
              <div className="w-full h-full border-2 border-slate-800 flex items-center justify-center">
                <div className="grid grid-cols-4 grid-rows-4 gap-0.5 w-16 h-16">
                  <div className="bg-slate-800"></div>
                  <div className="bg-slate-800"></div>
                  <div></div>
                  <div className="bg-slate-800"></div>
                  <div className="bg-slate-800"></div>
                  <div></div>
                  <div className="bg-slate-800"></div>
                  <div className="bg-slate-800"></div>
                  <div></div>
                  <div className="bg-slate-800"></div>
                  <div className="bg-slate-800"></div>
                  <div></div>
                  <div className="bg-slate-800"></div>
                  <div></div>
                  <div className="bg-slate-800"></div>
                  <div className="bg-slate-800"></div>
                </div>
              </div>
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-orange-400 mb-1">
              {t.certScannerTitle}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {t.certScannerDesc}
            </p>
            <input
              type="text"
              placeholder={t.certScannerPlaceholder}
              value={quickScanInput}
              onChange={e => setQuickScanInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleQuickVerify()}
              className="w-full bg-slate-700 border-none rounded p-2 text-sm text-center text-white placeholder:text-slate-400 mb-2 outline-none focus:ring-1 focus:ring-orange-400 font-mono"
            />
            <button
              onClick={handleQuickVerify}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded text-sm font-bold uppercase tracking-tighter transition-all active:scale-95 shadow-sm"
            >
              {t.verifyStatusBtn}
            </button>
          </div>

          {/* Module Participation Card */}
          <div className="bg-white border border-slate-200 rounded flex-1 flex flex-col p-5 shadow-sm">
            <h2 className="font-bold uppercase text-[10px] tracking-widest text-slate-500 mb-4">
              {t.moduleParticipationTitle}
            </h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{language === 'hi' ? 'अग्नि एवं विस्फोट' : language === 'sat' ? 'ᱥᱮᱸᱜᱮᱞ ᱟᱨ ᱵᱚᱢ' : 'Fire & Explosion'}</span>
                  <span>512</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-400 rounded-full transition-all" style={{ width: '75%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{language === 'hi' ? 'गैस एवं सीमित स्थान' : language === 'sat' ? 'ᱜᱮᱥ ᱟᱨ ᱠᱷᱟᱫᱟᱱ ᱵᱷᱤᱛᱨᱤ' : 'Gas & Confined Spaces'}</span>
                  <span>420</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: '62%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{language === 'hi' ? 'पीपीई अनुपालन' : language === 'sat' ? 'PPE ᱨᱩᱠᱷᱤᱭᱟᱹ' : 'PPE Compliance'}</span>
                  <span>316</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: '48%' }} />
                </div>
              </div>
            </div>

            {/* Language Usage Index Footer */}
            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 uppercase font-black">
              <span>{t.langUsageIndexTitle}</span>
              <div className="flex gap-2">
                <span className="text-orange-500">HI 45%</span>
                <span className="text-blue-500">ST 30%</span>
                <span className="text-slate-600">EN 25%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Visualizers Section (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Language Breakdown Chart */}
        <div className="bg-white border border-slate-200 p-5 rounded shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Languages className="w-3.5 h-3.5 text-orange-500" />
                {t.langDistributionTitle}
              </h3>
              <span className="text-[10px] text-slate-400 font-semibold">{t.triLingualTag}</span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              {t.langDistributionDesc}
            </p>
          </div>

          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {languageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '4px', fontSize: '12px', color: '#1e293b' }}
                  formatter={(val: any) => [`${val}%`, language === 'hi' ? 'श्रमिक हिस्सा' : language === 'sat' ? 'ᱠᱟᱹᱢᱤᱭᱟᱹ ᱦᱟᱹᱴᱤᱧ' : 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center gap-3 text-[11px] pt-2 border-t border-slate-100">
            {languageData.map(l => (
              <div key={l.name} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                <span className="text-slate-600">{l.name.split(' ')[0]}: <strong>{l.value}%</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Department Compliance Bar Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-5 rounded shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
              {t.deptPassRatesTitle}
            </h3>
            <span className="text-[10px] text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-200">
              {t.avgComplianceTag}
            </span>
          </div>

          <div className="h-48 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData}>
                <XAxis dataKey="department" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '4px', fontSize: '12px', color: '#1e293b' }}
                />
                <Bar dataKey="passRate" name={language === 'hi' ? 'उत्तीर्ण दर (%)' : language === 'sat' ? 'ᱯᱟᱥ ᱦᱟᱨ (%)' : 'Pass Rate (%)'} fill="#f97316" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            <span>{t.highRiskNotice}</span>
            <span className="text-orange-600 font-semibold">{t.dgmsStandardBadge}</span>
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {scannerOpen && (
        <QRScannerModal
          language={language}
          onClose={() => setScannerOpen(false)}
        />
      )}

      {/* Certificate Viewer Modal */}
      {selectedCertForView && (
        <DigitalCertificateModal
          certificate={selectedCertForView}
          language={language}
          onClose={() => setSelectedCertForView(null)}
          onVerifyInAdmin={() => {
            setSelectedCertForView(null);
            setScannerOpen(true);
          }}
        />
      )}
    </div>
  );
};
