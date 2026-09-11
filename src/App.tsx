import React, { useState, useEffect, useCallback } from 'react';
import { 
  Flame, Wind, ShieldCheck, ShieldAlert, Award, QrCode, 
  Volume2, VolumeX, Sparkles, User, RefreshCw, Wifi, WifiOff, 
  Layers, HardHat, CheckCircle2, ChevronRight, Play, Bot,
  ExternalLink, BarChart3, BookOpen, AlertTriangle, Smartphone, Download, HardDrive
} from 'lucide-react';
import { SafetyModule, Language, WorkerProfile, CertificateRecord } from './types';
import { safetyModules } from './data/modulesData';
import { translations } from './data/translations';
import { mockWorkers } from './data/mockCertificates';
import { audioAssistant } from './utils/audioAssistant';
import { offlineStorage } from './utils/offlineStorage';
import { haptics } from './utils/haptics';

// AR Components
import { ARCameraFeed } from './components/ARView/ARCameraFeed';
import { ARHUD } from './components/ARView/ARHUD';
import { FireSafetyScenario } from './components/ARView/FireSafetyScenario';
import { GasLeakScenario } from './components/ARView/GasLeakScenario';
import { MachinerySafetyScenario } from './components/ARView/MachinerySafetyScenario';
import { HeightSafetyScenario } from './components/ARView/HeightSafetyScenario';
import { ElectricalArcScenario } from './components/ARView/ElectricalArcScenario';

// Assessment & Certificate Components
import { AssessmentModal } from './components/Assessment/AssessmentModal';
import { DigitalCertificateModal } from './components/Certificate/DigitalCertificateModal';

// Admin Components
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { QRScannerModal } from './components/Admin/QRScannerModal';
import { AICoachModal } from './components/AICoach/AICoachModal';

// Demo & Worker Components
import { SIHDemoBar } from './components/Demo/SIHDemoBar';
import { RegisterWorkerModal } from './components/Worker/RegisterWorkerModal';

// Mobile PWA & Offline Components
import { MobileTopBar } from './components/Mobile/MobileTopBar';
import { MobileBottomNav } from './components/Mobile/MobileBottomNav';
import { OfflineBanner } from './components/Mobile/OfflineBanner';
import { OfflineCenterModal } from './components/Mobile/OfflineCenterModal';
import { InstallAppModal } from './components/Mobile/InstallAppModal';

export default function App() {
  // Application State
  const [language, setLanguage] = useState<Language>('en');
  const [currentWorker, setCurrentWorker] = useState<WorkerProfile>(mockWorkers[0]);
  const [activeTab, setActiveTab] = useState<'training' | 'certificates' | 'admin'>('training');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  
  // AR Simulation State
  const [activeModule, setActiveModule] = useState<SafetyModule | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [stepCompleted, setStepCompleted] = useState<boolean>(false);
  const [isPlaneLocked, setIsPlaneLocked] = useState<boolean>(false);
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(true);
  const [safetyPoints, setSafetyPoints] = useState<number>(0);
  const [hudFeedback, setHudFeedback] = useState<{
    type: 'success' | 'warning' | 'error';
    message: string;
  } | null>(null);

  // Modals
  const [assessmentOpen, setAssessmentOpen] = useState<boolean>(false);
  const [selectedCertForModal, setSelectedCertForModal] = useState<CertificateRecord | null>(null);
  const [aiCoachOpen, setAICoachOpen] = useState<boolean>(false);
  const [qrScannerOpen, setQrScannerOpen] = useState<boolean>(false);
  const [offlineCenterOpen, setOfflineCenterOpen] = useState<boolean>(false);
  const [installModalOpen, setInstallModalOpen] = useState<boolean>(false);
  const [registerModalOpen, setRegisterModalOpen] = useState<boolean>(false);

  // Offline Sync & Certificate State
  const [certificates, setCertificates] = useState<CertificateRecord[]>(() => offlineStorage.getCertificates());
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const t = translations[language];

  // Subscribe to offline sync and storage updates
  useEffect(() => {
    setCertificates(offlineStorage.getCertificates());
    setIsOffline(offlineStorage.isSimulatedOffline());
    setPendingSyncCount(offlineStorage.getPendingSyncItems().length);

    const unsubscribe = offlineStorage.subscribe(() => {
      setCertificates(offlineStorage.getCertificates());
      setIsOffline(offlineStorage.isSimulatedOffline());
      setPendingSyncCount(offlineStorage.getPendingSyncItems().length);
    });

    return unsubscribe;
  }, []);

  // Voice greeting when language changes or module starts
  const handleLanguageChange = (newLang: Language) => {
    haptics.trigger('tap');
    setLanguage(newLang);
    const greeting = newLang === 'hi' 
      ? 'सुरक्षा एआर में आपका स्वागत है। अपनी सुरक्षा प्रशिक्षण मॉड्यूल चुनें।' 
      : newLang === 'sat' 
      ? 'Suraksha AR ᱨᱮ ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ᱾ ᱟᱢᱟᱜ ᱴᱨᱮᱱᱤᱝ ᱵᱟᱪᱷᱟᱣ ᱢᱮ᱾' 
      : 'Welcome to Suraksha AR. Select your industrial safety training module.';
    audioAssistant.speak(greeting, newLang);
  };

  // Launch AR Simulation
  const handleStartModule = (mod: SafetyModule) => {
    haptics.trigger('step');
    setActiveModule(mod);
    setCurrentStepIndex(0);
    setStepCompleted(false);
    setIsPlaneLocked(false);
    setSafetyPoints(0);
    setHudFeedback(null);

    // Initial audio instruction
    const initialStep = mod.steps[0];
    if (initialStep) {
      const prompt = initialStep.audioPrompt[language] || initialStep.instruction[language];
      audioAssistant.speak(prompt, language);
    }
  };

  // Feedback & Scoring in AR Scenario
  const handleAwardPoints = useCallback((points: number, reason: string) => {
    setSafetyPoints(prev => prev + points);
    setHudFeedback({
      type: 'success',
      message: reason
    });
    haptics.trigger('success');
    setTimeout(() => {
      setHudFeedback(null);
    }, 3200);
  }, []);

  const handleIncorrectAction = useCallback((reason: string) => {
    setHudFeedback({
      type: 'warning',
      message: reason
    });
    haptics.trigger('warning');
    setTimeout(() => {
      setHudFeedback(null);
    }, 4000);
  }, []);

  // Quick AR Launch from mobile button
  const handleQuickARLaunch = () => {
    haptics.trigger('alarm');
    // Launch Fire Safety module by default or prompt
    const defaultMod = safetyModules[0];
    if (defaultMod) {
      handleStartModule(defaultMod);
    }
  };

  // Step Completion in AR
  const handleARStepComplete = useCallback(() => {
    haptics.trigger('success');
    setStepCompleted(true);
  }, []);

  // Advance to Next Step in AR
  const handleProceedNextStep = () => {
    if (!activeModule) return;

    if (currentStepIndex + 1 < activeModule.steps.length) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      setStepCompleted(false);
      haptics.trigger('step');

      const nextStep = activeModule.steps[nextIndex];
      if (nextStep && isVoiceActive) {
        const prompt = nextStep.audioPrompt[language] || nextStep.instruction[language];
        audioAssistant.speak(prompt, language);
      }
    } else {
      // Completed all steps -> Trigger Assessment!
      haptics.trigger('success');
      setAssessmentOpen(true);
    }
  };

  // Manual Offline Toggle
  const handleToggleOffline = () => {
    haptics.trigger('warning');
    const nextOffline = !isOffline;
    offlineStorage.setSimulatedOffline(nextOffline);
  };

  // Trigger Batch Sync
  const handleManualSync = async () => {
    haptics.trigger('tap');
    const result = await offlineStorage.syncPendingNow();
    setSyncMessage(result.message);
    if (result.success) {
      haptics.trigger('success');
    } else {
      haptics.trigger('error');
    }
    setTimeout(() => setSyncMessage(null), 4000);
  };

  // Worker Certificates List (Derived from reactive state)
  const workerCertificates = certificates.filter(
    c => c.workerId === currentWorker.id
  );

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* MOBILE-FIRST TOP BAR (Visible on mobile/tablets) */}
      <div className="md:hidden">
        <MobileTopBar
          language={language}
          onLanguageChange={handleLanguageChange}
          onOpenOfflineCenter={() => setOfflineCenterOpen(true)}
          onOpenInstallModal={() => setInstallModalOpen(true)}
          onOpenAICoach={() => setAICoachOpen(true)}
        />
      </div>

      {/* DESKTOP HEADER & TOP NAVIGATION BAR (Visible on md and above) */}
      <header className="hidden md:block sticky top-0 z-40 bg-[#0F172A] text-white border-b border-slate-700 px-4 sm:px-8 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          {/* Logo & Platform Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-sm flex items-center justify-center font-bold text-lg text-white shadow-sm">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-xl text-white">
                  SURAKSHA <span className="text-orange-400">AR</span>
                </span>
                <span className="px-2.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                  {t.easternSectorZone}
                </span>
                <span className="px-2 py-0.5 bg-orange-500/20 border border-orange-500/40 rounded text-[10px] font-bold text-orange-400">
                  {t.mobileOfflineApp}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {t.headerSubtitle}
              </p>
            </div>
          </div>

          {/* Navigation Tabs - Geometric Balanced Pill Links */}
          <nav className="flex items-center gap-1.5 bg-slate-800/90 p-1 rounded border border-slate-700">
            <button
              id="tab-training"
              onClick={() => { haptics.trigger('tap'); setActiveTab('training'); setActiveModule(null); }}
              className={`px-3.5 py-1.5 rounded text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'training'
                  ? 'bg-slate-900 text-orange-400 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${activeTab === 'training' ? 'bg-orange-400' : 'bg-transparent'}`} />
              <Layers className="w-3.5 h-3.5" />
              <span>{t.trainingModules}</span>
            </button>

            <button
              id="tab-certificates"
              onClick={() => { haptics.trigger('tap'); setActiveTab('certificates'); setActiveModule(null); }}
              className={`px-3.5 py-1.5 rounded text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'certificates'
                  ? 'bg-slate-900 text-orange-400 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${activeTab === 'certificates' ? 'bg-orange-400' : 'bg-transparent'}`} />
              <Award className="w-3.5 h-3.5" />
              <span>{t.workerWallet}</span>
              {workerCertificates.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-orange-500 text-white text-[10px] font-black">
                  {workerCertificates.length}
                </span>
              )}
            </button>

            <button
              id="tab-admin"
              onClick={() => { haptics.trigger('tap'); setActiveTab('admin'); setActiveModule(null); }}
              className={`px-3.5 py-1.5 rounded text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'admin'
                  ? 'bg-slate-900 text-orange-400 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${activeTab === 'admin' ? 'bg-orange-400' : 'bg-transparent'}`} />
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{t.adminDashboard}</span>
            </button>
          </nav>

          {/* Right Controls: Language, Offline Sync, Worker Select, Install & AI Coach */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Language Switcher Button Group */}
            <div className="flex items-center gap-1 text-xs font-medium">
              <button
                id="btn-lang-hi"
                onClick={() => handleLanguageChange('hi')}
                className={`px-2.5 py-1 rounded transition-colors ${language === 'hi' ? 'bg-orange-500 text-white font-bold' : 'border border-slate-700 bg-slate-800 text-slate-300 hover:text-white'}`}
              >
                हिन्दी
              </button>
              <button
                id="btn-lang-sat"
                onClick={() => handleLanguageChange('sat')}
                className={`px-2.5 py-1 rounded transition-colors ${language === 'sat' ? 'bg-orange-500 text-white font-bold' : 'border border-slate-700 bg-slate-800 text-slate-300 hover:text-white'}`}
              >
                Santali
              </button>
              <button
                id="btn-lang-en"
                onClick={() => handleLanguageChange('en')}
                className={`px-2.5 py-1 rounded transition-colors ${language === 'en' ? 'bg-orange-500 text-white font-bold' : 'border border-slate-700 bg-slate-800 text-slate-300 hover:text-white'}`}
              >
                English
              </button>
            </div>

            {/* Offline Center Action Trigger */}
            <button
              onClick={() => { haptics.trigger('tap'); setOfflineCenterOpen(true); }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-semibold transition-all ${
                isOffline
                  ? 'bg-red-950/80 border-red-500 text-red-300'
                  : 'bg-slate-800 border-slate-700 text-green-400'
              }`}
              title="Open Deep Mine & Offline Center"
            >
              {isOffline ? <WifiOff className="w-3.5 h-3.5 text-red-400" /> : <HardDrive className="w-3.5 h-3.5 text-orange-400" />}
              <span>{isOffline ? t.deepMineOffline : t.offlineReady}</span>
              {pendingSyncCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              )}
            </button>

            {/* Install PWA Mobile App */}
            <button
              id="btn-open-install-modal"
              onClick={() => { haptics.trigger('tap'); setInstallModalOpen(true); }}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold rounded transition-all active:scale-95 uppercase tracking-tight"
              title="Install mobile app"
            >
              <Smartphone className="w-3.5 h-3.5 text-orange-400" />
              <span>{t.installApp}</span>
            </button>

            {/* Worker Selector */}
            <select
              value={currentWorker.id}
              onChange={e => {
                const w = mockWorkers.find(x => x.id === e.target.value);
                if (w) {
                  haptics.trigger('tap');
                  setCurrentWorker(w);
                }
              }}
              className="bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs font-medium text-slate-200 outline-none max-w-[130px] sm:max-w-[170px] truncate"
            >
              {mockWorkers.map(w => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.role})
                </option>
              ))}
            </select>

            {/* AI Safety Coach Button */}
            <button
              id="btn-open-ai-coach"
              onClick={() => { haptics.trigger('tap'); setAICoachOpen(true); }}
              className="flex items-center gap-1.5 px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded transition-all active:scale-95 uppercase tracking-tight shadow-sm"
            >
              <Bot className="w-3.5 h-3.5 text-white" />
              <span>{t.aiCoach}</span>
            </button>

            {/* SIH Demo Mode Toggle */}
            <button
              id="btn-toggle-demo-mode"
              onClick={() => {
                haptics.trigger('tap');
                setIsDemoMode(!isDemoMode);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded transition-all active:scale-95 uppercase tracking-tight ${
                isDemoMode
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-400/40'
                  : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300'
              }`}
              title="SIH 2026 Jury Walkthrough Mode"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>{t.demoMode}</span>
            </button>
          </div>
        </div>
      </header>

      {/* SIH 2-MINUTE JURY DEMO BAR */}
      {isDemoMode && !activeModule && (
        <SIHDemoBar
          language={language}
          currentWorker={currentWorker}
          activeModule={activeModule}
          onOpenRegister={() => setRegisterModalOpen(true)}
          onLaunchModule={(modId) => {
            const targetMod = safetyModules.find(m => m.id === modId) || safetyModules[0];
            handleStartModule(targetMod);
          }}
          onLaunchAssessment={() => {
            const targetMod = activeModule || safetyModules[0];
            setActiveModule(targetMod);
            setAssessmentOpen(true);
          }}
          onViewCertificate={() => {
            const existing = certificates.find(c => c.workerId === currentWorker.id) || certificates[0];
            if (existing) {
              setSelectedCertForModal(existing);
            } else {
              setActiveTab('certificates');
            }
          }}
          onOpenScanner={() => {
            setQrScannerOpen(true);
          }}
          onCloseDemo={() => setIsDemoMode(false)}
        />
      )}

      {/* OFFLINE STATUS BANNER */}
      {!activeModule && (
        <OfflineBanner language={language} onOpenOfflineCenter={() => setOfflineCenterOpen(true)} />
      )}

      {/* Toast for Sync feedback */}
      {syncMessage && (
        <div className="bg-emerald-900 border-b border-emerald-500 text-emerald-100 px-4 py-2 text-center text-xs font-bold z-50">
          {syncMessage}
        </div>
      )}

      {/* 2. Main Body Container with Mobile Padding */}
      <main className="flex-1 flex flex-col pb-20 md:pb-8">
        {/* ACTIVE AR SIMULATION VIEW */}
        {activeModule ? (
          <div className="relative flex-1 w-full h-full min-h-[calc(100vh-64px)] bg-black overflow-hidden flex flex-col">
            <ARCameraFeed
              language={language}
              isPlaneLocked={isPlaneLocked}
              onPlaneLockChange={setIsPlaneLocked}
              scenarioType={
                activeModule.id === 'fire_explosion'
                  ? 'fire'
                  : activeModule.id === 'gas_confined_space'
                  ? 'gas'
                  : activeModule.id === 'machinery_safety'
                  ? 'machinery'
                  : activeModule.id === 'ppe_hazard'
                  ? 'height'
                  : 'electrical'
              }
            >
              {/* Dynamic AR Scenario Rendering */}
              {activeModule.id === 'fire_explosion' && (
                <FireSafetyScenario
                  stepIndex={currentStepIndex}
                  language={language}
                  onStepComplete={handleARStepComplete}
                  isPlaneLocked={isPlaneLocked}
                  onAwardPoints={handleAwardPoints}
                  onIncorrectAction={handleIncorrectAction}
                />
              )}
              {activeModule.id === 'gas_confined_space' && (
                <GasLeakScenario
                  stepIndex={currentStepIndex}
                  language={language}
                  onStepComplete={handleARStepComplete}
                  isPlaneLocked={isPlaneLocked}
                  onAwardPoints={handleAwardPoints}
                  onIncorrectAction={handleIncorrectAction}
                />
              )}
              {activeModule.id === 'machinery_safety' && (
                <MachinerySafetyScenario
                  stepIndex={currentStepIndex}
                  language={language}
                  onStepComplete={handleARStepComplete}
                  isPlaneLocked={isPlaneLocked}
                />
              )}
              {activeModule.id === 'ppe_hazard' && (
                <HeightSafetyScenario
                  stepIndex={currentStepIndex}
                  language={language}
                  onStepComplete={handleARStepComplete}
                  isPlaneLocked={isPlaneLocked}
                />
              )}
              {activeModule.id === 'first_aid' && (
                <ElectricalArcScenario
                  stepIndex={currentStepIndex}
                  language={language}
                  onStepComplete={handleARStepComplete}
                  isPlaneLocked={isPlaneLocked}
                />
              )}
            </ARCameraFeed>

            {/* AR Top & Bottom HUD Controls */}
            <ARHUD
              currentStep={activeModule.steps[currentStepIndex]}
              totalSteps={activeModule.steps.length}
              currentStepIndex={currentStepIndex}
              language={language}
              onExit={() => setActiveModule(null)}
              onNextStep={handleProceedNextStep}
              canProceed={stepCompleted}
              isPlaneLocked={isPlaneLocked}
              onReAnchor={() => setIsPlaneLocked(false)}
              isVoiceActive={isVoiceActive}
              onToggleVoice={() => setIsVoiceActive(!isVoiceActive)}
              safetyPoints={safetyPoints}
              moduleTitle={activeModule.title[language] || activeModule.title.en}
              feedback={hudFeedback}
            />
          </div>
        ) : activeTab === 'training' ? (
          /* WORKER TRAINING MODULES CATALOG VIEW (Geometric Balance Theme) */
          <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 md:p-8 flex flex-col gap-6">
            {/* Worker Greeting & Mobile Offline Readiness Card */}
            <div className="bg-white border border-slate-200 rounded p-4 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                {currentWorker.idPhotoUrl ? (
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border-2 border-emerald-500 shadow-sm bg-slate-900 shrink-0 cursor-pointer"
                    onClick={() => setRegisterModalOpen(true)}
                    title="Click to view verified ID badge"
                  >
                    <img 
                      src={currentWorker.idPhotoUrl} 
                      alt={currentWorker.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-emerald-600 text-[8px] text-white font-bold text-center">
                      VERIFIED
                    </div>
                  </div>
                ) : (
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded bg-orange-500 flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-sm shrink-0">
                    {currentWorker.name[0]}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      {currentWorker.name}
                    </h2>
                    <span className="text-[11px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded border border-slate-200">
                      ID: {currentWorker.id}
                    </span>
                    {currentWorker.idPhotoUrl && (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Genuine ID</span>
                      </span>
                    )}
                    <button
                      onClick={() => {
                        haptics.trigger('tap');
                        setRegisterModalOpen(true);
                      }}
                      className="text-[11px] text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-2 py-0.5 rounded transition-all active:scale-95"
                      title="Switch or register a new industrial worker"
                    >
                      <User className="w-3 h-3" />
                      <span>{language === 'hi' ? 'आईडी / पंजीकरण' : language === 'sat' ? 'ᱠᱟᱹᱢᱤᱭᱟᱹ ᱵᱚᱫᱚᱞ' : 'ID & Registration'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {currentWorker.role} • {currentWorker.facility} • <strong>{currentWorker.language.toUpperCase()}</strong>
                  </p>
                </div>
              </div>

              {/* Status summary & voice test */}
              <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                <div className="bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded text-center">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">{t.certifiedBadge}</span>
                  <span className="text-xs sm:text-sm font-bold text-green-600">
                    {workerCertificates.length} {language === 'sat' ? 'ᱴᱨᱮᱱᱤᱝ' : language === 'hi' ? 'मॉड्यूल' : 'Modules'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      haptics.trigger('tap');
                      audioAssistant.speak(translations[language].voiceAssistant, language);
                    }}
                    className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded shadow-sm transition-all active:scale-95"
                    title="Test Audio Assistant"
                  >
                    <Volume2 className="w-4 h-4 text-orange-500" />
                  </button>

                  <button
                    onClick={() => {
                      haptics.trigger('tap');
                      setOfflineCenterOpen(true);
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-bold uppercase tracking-tight flex items-center gap-1.5 shadow-sm"
                  >
                    <HardDrive className="w-3.5 h-3.5 text-orange-400" />
                    <span>{t.offlineHub || (language === 'sat' ? 'ᱚᱯᱷᱞᱟᱭᱤᱱ ᱦᱟᱵᱽ' : language === 'hi' ? 'ऑफलाइन केंद्र' : 'Offline Hub')}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modules Grid */}
            <div>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {t.trainingModules}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {t.modulesSubtitle}
                  </p>
                </div>

                <span className="text-xs text-orange-700 font-bold bg-orange-50 px-3 py-1 rounded border border-orange-200">
                  {t.offlineReady100}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                {safetyModules.map(module => {
                  const isCompleted = workerCertificates.some(c => c.moduleKey === module.id);
                  const certRecord = workerCertificates.find(c => c.moduleKey === module.id);

                  return (
                    <div
                      key={module.id}
                      className="bg-white border border-slate-200 rounded p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-slate-300 flex flex-col justify-between gap-4 sm:gap-5 transition-all group"
                    >
                      <div className="space-y-3">
                        {/* Top Badge & Duration */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200">
                            {module.badge}
                          </span>
                          <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
                            ⏱️ {module.durationMinutes} {t.minsDuration} • {t.passingScoreLabel} {module.requiredPassingScore}%
                          </span>
                        </div>

                        {/* Title & Description */}
                        <div>
                          <div className="flex items-center gap-2">
                            {module.id === 'fire_explosion' ? (
                              <div className="w-7 h-7 rounded bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                                <Flame className="w-4 h-4" />
                              </div>
                            ) : (
                              <div className="w-7 h-7 rounded bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                                <Wind className="w-4 h-4" />
                              </div>
                            )}
                            <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                              {module.title[language]}
                            </h4>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed mt-2 font-normal">
                            {module.description[language]}
                          </p>
                        </div>

                        {/* Objectives List */}
                        <div className="space-y-1.5 pt-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {t.interactiveSequence}
                          </span>
                          <ul className="space-y-1.5">
                            {module.steps.map((step) => (
                              <li key={step.id} className="text-xs text-slate-700 flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
                                <span>{step.title[language]}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Bottom Action Footer */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
                        {isCompleted && certRecord ? (
                          <div className="flex items-center gap-1.5 text-xs text-green-700 font-bold bg-green-50 border border-green-200 px-3 py-1 rounded">
                            <ShieldCheck className="w-4 h-4 text-green-600" />
                            <span>{t.certifiedBadge} ({certRecord.score}%)</span>
                          </div>
                        ) : (
                          <div className="text-xs text-slate-500 font-medium">
                            {t.statusOfflineReady}
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          {isCompleted && certRecord && (
                            <button
                              onClick={() => {
                                haptics.trigger('tap');
                                setSelectedCertForModal(certRecord);
                              }}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded border border-slate-200 transition-all"
                            >
                              {t.viewCertificate}
                            </button>
                          )}

                          <button
                            id={`btn-launch-${module.id}`}
                            onClick={() => handleStartModule(module)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-tight rounded shadow-sm transition-all active:scale-95"
                          >
                            <Play className="w-3.5 h-3.5 fill-white text-white" />
                            <span>{t.startModule}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Pipeline Modules Roadmap */}
            <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  {t.upcomingRoadmapTitle}
                </h4>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-semibold uppercase">{t.roadmapStandardTag}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-50 border border-slate-200 p-3.5 sm:p-4 rounded text-slate-600">
                  <div className="font-bold text-slate-800">{t.mod3Title}</div>
                  <p className="text-[11px] text-slate-500 mt-1">{t.mod3Desc}</p>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded mt-2 inline-block font-semibold">{t.q3Tag}</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3.5 sm:p-4 rounded text-slate-600">
                  <div className="font-bold text-slate-800">{t.mod4Title}</div>
                  <p className="text-[11px] text-slate-500 mt-1">{t.mod4Desc}</p>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded mt-2 inline-block font-semibold">{t.q3Tag}</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3.5 sm:p-4 rounded text-slate-600">
                  <div className="font-bold text-slate-800">{t.mod5Title}</div>
                  <p className="text-[11px] text-slate-500 mt-1">{t.mod5Desc}</p>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded mt-2 inline-block font-semibold">{t.q4Tag}</span>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'certificates' ? (
          /* WORKER'S PERSONAL CERTIFICATE WALLET VIEW */
          <div className="max-w-5xl mx-auto w-full p-4 sm:p-6 md:p-8 flex flex-col gap-6">
            <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {currentWorker.name} {t.walletTitleSuffix}
                </h2>
                <p className="text-xs text-slate-500">
                  {t.walletDesc}
                </p>
              </div>
              <button
                onClick={() => {
                  haptics.trigger('tap');
                  setQrScannerOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-tight rounded self-stretch sm:self-auto justify-center"
              >
                <QrCode className="w-4 h-4 text-orange-400" />
                <span>{t.verifyQrBtn}</span>
              </button>
            </div>

            {workerCertificates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {workerCertificates.map(cert => (
                  <div
                    key={cert.certificateId}
                    className="bg-white border-2 border-orange-200 rounded p-5 sm:p-6 shadow-sm flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                          {cert.moduleKey === 'fire_explosion' 
                            ? (language === 'sat' ? 'ᱥᱮᱸᱜᱮᱞ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ' : language === 'hi' ? 'अग्नि सुरक्षा प्रमाणपत्र' : 'FIRE SAFETY CERTIFICATE') :
                           cert.moduleKey === 'gas_confined_space' 
                            ? (language === 'sat' ? 'ᱜᱮᱥ ᱞᱤᱠ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ' : language === 'hi' ? 'गैस रिसाव सुरक्षा प्रमाणपत्र' : 'GAS LEAK SAFETY CERTIFICATE') :
                           cert.moduleKey === 'machinery_safety' 
                            ? (language === 'sat' ? 'ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱟᱨ LOTO ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ' : language === 'hi' ? 'कन्वेयर व LOTO प्रमाणपत्र' : 'CONVEYOR & LOTO CERTIFICATE') :
                           cert.moduleKey === 'ppe_hazard' 
                            ? (language === 'sat' ? 'ᱩᱥᱩᱞ ᱟᱨ ᱦᱟᱨᱱᱮᱥ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ' : language === 'hi' ? 'ऊंचाई व हार्नेस सुरक्षा प्रमाणपत्र' : 'HEIGHTS & HARNESS CERTIFICATE') :
                            (language === 'sat' ? 'ᱤᱞᱮᱠᱴᱨᱤᱠᱟᱞ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ' : language === 'hi' ? 'इलेक्ट्रिकल व आर्क फ्लैश प्रमाणपत्र' : 'ELECTRICAL & ARC FLASH CERTIFICATE')}
                        </span>
                        <span className="text-xs font-bold bg-green-50 text-green-700 border border-green-200 px-2.5 py-0.5 rounded">
                          {t.gradeLabel}: {cert.score}%
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-slate-900">{cert.moduleName}</h3>
                      
                      <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs font-mono space-y-1 text-slate-700">
                        <div className="flex justify-between">
                          <span className="text-slate-400">{t.certIdLabel}:</span>
                          <span className="text-slate-900 font-bold truncate max-w-[180px]">{cert.certificateId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">{t.issueDateLabel}:</span>
                          <span>{cert.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">{t.validTillLabel}:</span>
                          <span className="text-green-700 font-semibold">{cert.expiryDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">{t.standardLabel}:</span>
                          <span className="text-[10px] text-slate-500 truncate max-w-[180px]">{cert.complianceStandard}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className={`text-[11px] font-semibold ${cert.synced ? 'text-green-600' : 'text-orange-600'}`}>
                        {cert.synced ? t.cloudSynced : t.savedLocally}
                      </span>

                      <button
                        onClick={() => {
                          haptics.trigger('tap');
                          setSelectedCertForModal(cert);
                        }}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-tight rounded shadow-sm transition-all active:scale-95"
                      >
                        {t.viewCertificate}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded p-8 text-center flex flex-col items-center gap-3 shadow-sm">
                <Award className="w-12 h-12 text-slate-400" />
                <h3 className="text-base font-bold text-slate-900">{t.noCertsTitle}</h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  {t.noCertsDesc}
                </p>
                <button
                  onClick={() => {
                    haptics.trigger('tap');
                    setActiveTab('training');
                  }}
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-tight rounded shadow-sm"
                >
                  {t.goToTrainingBtn}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ADMIN COMPLIANCE & VERIFICATION DASHBOARD */
          <AdminDashboard language={language} />
        )}
      </main>

      {/* MOBILE BOTTOM NAVIGATION DOCK (Thumb accessible on phones & tablets) */}
      {!activeModule && (
        <MobileBottomNav
          activeTab={activeTab}
          language={language}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setActiveModule(null);
          }}
          onOpenAICoach={() => setAICoachOpen(true)}
          onQuickARLaunch={handleQuickARLaunch}
          certCount={workerCertificates.length}
        />
      )}

      {/* MODALS */}

      {/* 1. Global Assessment Modal */}
      {assessmentOpen && activeModule && (
        <AssessmentModal
          module={activeModule}
          worker={currentWorker}
          language={language}
          onClose={() => {
            setAssessmentOpen(false);
            setActiveModule(null);
          }}
          onReturnToTraining={() => {
            setAssessmentOpen(false);
          }}
          onCertificateIssued={(cert) => {
            setAssessmentOpen(false);
            setActiveModule(null);
            setSelectedCertForModal(cert);
            setCertificates(offlineStorage.getCertificates());
          }}
        />
      )}

      {/* 2. Digital Certificate View Modal */}
      {selectedCertForModal && (
        <DigitalCertificateModal
          certificate={selectedCertForModal}
          language={language}
          onClose={() => setSelectedCertForModal(null)}
          onVerifyInAdmin={() => {
            setSelectedCertForModal(null);
            setActiveTab('admin');
            setQrScannerOpen(true);
          }}
        />
      )}

      {/* 3. AI Safety Coach Modal */}
      {aiCoachOpen && (
        <AICoachModal
          language={language}
          onClose={() => setAICoachOpen(false)}
          currentContext={activeModule ? activeModule.title.en : 'General Mining & Industrial Safety'}
        />
      )}

      {/* 4. QR Code Scanner Modal */}
      {qrScannerOpen && (
        <QRScannerModal
          language={language}
          onClose={() => setQrScannerOpen(false)}
        />
      )}

      {/* 5. Deep Mine & Offline Center Modal */}
      {offlineCenterOpen && (
        <OfflineCenterModal
          language={language}
          onClose={() => setOfflineCenterOpen(false)}
        />
      )}

      {/* 6. PWA Mobile App Installation Modal */}
      {installModalOpen && (
        <InstallAppModal
          language={language}
          onClose={() => setInstallModalOpen(false)}
        />
      )}

      {/* 7. Worker Registration & Profile Modal */}
      {registerModalOpen && (
        <RegisterWorkerModal
          currentWorker={currentWorker}
          language={language}
          onClose={() => setRegisterModalOpen(false)}
          onSaveWorker={(updated) => {
            setCurrentWorker(updated);
            setLanguage(updated.language);
          }}
        />
      )}
    </div>
  );
}

