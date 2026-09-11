import { Language } from '../types';

export interface TranslationDict {
  appTitle: string;
  appSubtitle: string;
  easternSectorZone: string;
  mobileOfflineApp: string;
  headerSubtitle: string;
  trainingModules: string;
  workerWallet: string;
  adminDashboard: string;
  deepMineOffline: string;
  offlineReady: string;
  installApp: string;
  aiCoach: string;
  deepMineBanner: string;
  manage: string;
  roleWorker: string;
  roleAdmin: string;
  offlineStatus: string;
  onlineStatus: string;
  syncPending: string;
  syncNow: string;
  audioGuideActive: string;
  audioGuideMute: string;
  startARSession: string;
  resumeTraining: string;
  modulesTitle: string;
  modulesSubtitle: string;
  offlineReady100: string;
  minsDuration: string;
  passingScoreLabel: string;
  interactiveSequence: string;
  statusOfflineReady: string;
  certifiedBadge: string;
  startModule: string;
  viewCertificate: string;
  takeAssessment: string;
  scoreLabel: string;
  passingScore: string;
  retakeAssessment: string;
  verifyCertificate: string;
  scanQRCode: string;
  cameraActive: string;
  cameraFallback: string;
  switchCamera: string;
  planeDetected: string;
  scanningSurface: string;
  arInstructionHeader: string;
  safetyWarning: string;
  exitTraining: string;
  nextStep: string;
  completeModule: string;
  workerProfile: string;
  complianceLedger: string;
  downloadReport: string;
  searchWorker: string;
  filterByDepartment: string;
  filterByStatus: string;
  filterByLanguage: string;
  all: string;
  valid: string;
  expired: string;
  passed: string;
  failed: string;
  voiceAssistant: string;
  askAICoach: string;
  dgmsCompliant: string;
  oshaStandard: string;
  certificateId: string;
  workerId: string;
  issueDate: string;
  validTill: string;
  organization: string;
  authorizedSignature: string;
  printCertificate: string;
  close: string;
  // Admin dashboard specific
  regionalTrainingOverview: string;
  regionalTrainingDesc: string;
  totalWorkers: string;
  thisMonthGrowth: string;
  certificatesIssued: string;
  passRateText: string;
  averageScore: string;
  targetScoreText: string;
  activeHazards: string;
  requiresReviewText: string;
  recentAssessments: string;
  recentAssessmentsDesc: string;
  searchWorkerPlaceholder: string;
  allLanguages: string;
  thWorkerId: string;
  thModule: string;
  thLanguage: string;
  thScore: string;
  thVerification: string;
  thAction: string;
  verifiedStatus: string;
  pendingRetryStatus: string;
  viewAction: string;
  noMatchingRecords: string;
  certScannerTitle: string;
  certScannerDesc: string;
  certScannerPlaceholder: string;
  verifyStatusBtn: string;
  moduleParticipationTitle: string;
  langUsageIndexTitle: string;
  langDistributionTitle: string;
  triLingualTag: string;
  langDistributionDesc: string;
  deptPassRatesTitle: string;
  avgComplianceTag: string;
  highRiskNotice: string;
  dgmsStandardBadge: string;
  // Wallet specific
  walletTitleSuffix: string;
  walletDesc: string;
  verifyQrBtn: string;
  gradeLabel: string;
  certIdLabel: string;
  issueDateLabel: string;
  validTillLabel: string;
  standardLabel: string;
  cloudSynced: string;
  savedLocally: string;
  noCertsTitle: string;
  noCertsDesc: string;
  goToTrainingBtn: string;
  // Roadmap
  upcomingRoadmapTitle: string;
  roadmapStandardTag: string;
  mod3Title: string;
  mod3Desc: string;
  mod4Title: string;
  mod4Desc: string;
  mod5Title: string;
  mod5Desc: string;
  q3Tag: string;
  q4Tag: string;
  // SIH Enhancements
  safetyPointsLabel: string;
  objectiveLabel: string;
  timeTakenLabel: string;
  correctCountLabel: string;
  incorrectCountLabel: string;
  registerWorkerBtn: string;
  sihDemoMode: string;
  demoWorker: string;
  blockchainVerified: string;
  verifyPublicLedger: string;
  demoMode: string;
  demoModeDesc: string;
  offlineHub: string;
  aiCoachTitle: string;
  aiCoachSubtitle: string;
  listenVoice: string;
  analyzingStandards: string;
  quickPromptsLabel: string;
  verify: string;
  workerIdLabel: string;
  moduleNameLabel: string;
  scorePercentageLabel: string;
  statusLabel: string;
  score: string;
  correctAnswers: string;
  incorrectAnswers: string;
  timeTaken: string;
  hideReview: string;
  reviewAnswers: string;
  returnToTraining: string;
  centralLedgerSynced: string;
  offlineStoredPending: string;
  nationalSafetyHeader: string;
  certificateOfCompetency: string;
  issuedInAccordance: string;
  verifiedBadge: string;
  certifyText: string;
  gradeAchieved: string;
  simulationCompletedText: string;
  complianceSpecialization: string;
  scanToVerify: string;
  certifiedViaEngine: string;
  verifyInAdmin: string;
}

const rawTranslations: Record<Language, TranslationDict> = {
  en: {
    appTitle: "SurakshaAR",
    appSubtitle: "Industrial & Mining AR Safety Training System",
    easternSectorZone: "Eastern Sector - Zone 4",
    mobileOfflineApp: "📱 Mobile & Offline App",
    headerSubtitle: "Industrial & Mining Safety AR Training • 100% Offline DGMS / OSHA Compliance",
    trainingModules: "Training Modules",
    workerWallet: "Worker Wallet",
    adminDashboard: "Admin Dashboard",
    deepMineOffline: "Deep Mine Offline",
    offlineReady: "Offline Ready",
    installApp: "Install App",
    aiCoach: "AI Coach",
    deepMineBanner: "⚡ Deep Mine Mode: 100% offline cache running (0kb network required)",
    manage: "Manage",
    roleWorker: "Worker AR View",
    roleAdmin: "Admin Compliance Portal",
    offlineStatus: "Offline Mode (Local Storage Active)",
    onlineStatus: "Online & Synced",
    syncPending: "records pending sync",
    syncNow: "Sync Records Now",
    audioGuideActive: "Voice Guidance ON",
    audioGuideMute: "Voice Guidance Muted",
    startARSession: "Launch AR Simulation",
    resumeTraining: "Continue AR Training",
    modulesTitle: "Industrial Safety Training Modules",
    modulesSubtitle: "Mobile spatial AR simulation with live camera inspection and offline certification.",
    offlineReady100: "⚡ 100% Offline Ready",
    minsDuration: "Mins",
    passingScoreLabel: "Passing:",
    interactiveSequence: "Interactive AR Sequence:",
    statusOfflineReady: "Status: Offline Ready",
    certifiedBadge: "Certified",
    startModule: "Start Training",
    viewCertificate: "View Certificate",
    takeAssessment: "Begin Compliance Assessment",
    scoreLabel: "Assessment Score",
    passingScore: "Passing Threshold: 70%",
    retakeAssessment: "Retry Assessment",
    verifyCertificate: "Verify Compliance Certificate",
    scanQRCode: "Scan Certificate QR",
    cameraActive: "Live AR Camera Active (ARCore Surface Tracking)",
    cameraFallback: "Industrial Simulation Mode Active",
    switchCamera: "Switch Camera / Scene",
    planeDetected: "AR Floor Surface Anchored",
    scanningSurface: "Point camera at floor & move gently to detect AR planes...",
    arInstructionHeader: "Current AR Safety Objective",
    safetyWarning: "CRITICAL HAZARD WARNING",
    exitTraining: "Exit AR Mode",
    nextStep: "Proceed to Next Action",
    completeModule: "Complete Scenario & Start Exam",
    workerProfile: "Worker Identity",
    complianceLedger: "DGMS / OSHA Central Compliance Ledger",
    downloadReport: "Export Compliance CSV",
    searchWorker: "Search by Worker Name, ID or Certificate...",
    filterByDepartment: "Department",
    filterByStatus: "Certification Status",
    filterByLanguage: "Training Language",
    all: "All Records",
    valid: "Valid & Certified",
    expired: "Expired / Due",
    passed: "Passed (>=70%)",
    failed: "Failed (<70%)",
    voiceAssistant: "Spoken Safety Audio",
    askAICoach: "Ask Gemini Safety Coach",
    dgmsCompliant: "DGMS Coal & Metal Mines Regs 2017 Compliant",
    oshaStandard: "OSHA 1910 Industrial Safety Standards",
    certificateId: "Certificate ID",
    workerId: "Worker Employee ID",
    issueDate: "Date of Certification",
    validTill: "Valid Until",
    organization: "Authorized Industrial Entity",
    authorizedSignature: "Chief Safety Officer (Safety Directorate)",
    printCertificate: "Print / Save PDF Certificate",
    close: "Close",
    // Admin dashboard specific
    regionalTrainingOverview: "Regional Training Overview",
    regionalTrainingDesc: "Verifiable compliance tracking, live QR inspection portal, and offline-synced worker credentials.",
    totalWorkers: "Total Workers",
    thisMonthGrowth: "+12% this month",
    certificatesIssued: "Certificates Issued",
    passRateText: "87.1% Pass Rate",
    averageScore: "Average Score",
    targetScoreText: "Target: 85%",
    activeHazards: "Active Hazards",
    requiresReviewText: "Requires Review",
    recentAssessments: "Recent Safety Assessments",
    recentAssessmentsDesc: "DGMS & OSHA Real-time Verification Ledger",
    searchWorkerPlaceholder: "Search worker/ID...",
    allLanguages: "All Languages",
    thWorkerId: "Worker ID",
    thModule: "Module",
    thLanguage: "Language",
    thScore: "Score",
    thVerification: "Verification",
    thAction: "Action",
    verifiedStatus: "Verified",
    pendingRetryStatus: "Pending Retry",
    viewAction: "View",
    noMatchingRecords: "No compliance records match your search criteria.",
    certScannerTitle: "Certificate Scanner",
    certScannerDesc: "Enter ID or scan code to verify compliance status",
    certScannerPlaceholder: "ID: SURAKSHA-IND-XXXX",
    verifyStatusBtn: "Verify Status",
    moduleParticipationTitle: "Module Participation",
    langUsageIndexTitle: "Language Usage Index",
    langDistributionTitle: "Language Distribution",
    triLingualTag: "Tri-lingual",
    langDistributionDesc: "Adoption of vernacular Hindi & Santali voice instructions for ground workers.",
    deptPassRatesTitle: "Department Pass Rates & Workers Trained",
    avgComplianceTag: "Avg 86% DGMS Compliance",
    highRiskNotice: "High-risk zones require minimum 70% threshold before site entry",
    dgmsStandardBadge: "100% DGMS Standard",
    // Wallet specific
    walletTitleSuffix: "'s Digital Certificate Wallet",
    walletDesc: "Offline-verified credentials with cryptographic tamper-proof QR verification codes.",
    verifyQrBtn: "Verify QR",
    gradeLabel: "Grade:",
    certIdLabel: "Cert ID:",
    issueDateLabel: "Issue Date:",
    validTillLabel: "Valid Till:",
    standardLabel: "Standard:",
    cloudSynced: "● Cloud Synced",
    savedLocally: "● Saved Locally",
    noCertsTitle: "No Certificates Issued Yet",
    noCertsDesc: "Complete the hands-on AR training module and pass the assessment to earn your official DGMS compliance certificate.",
    goToTrainingBtn: "Go to Training Modules",
    // Roadmap
    upcomingRoadmapTitle: "Upcoming Industrial AR Modules Roadmap",
    roadmapStandardTag: "DGMS Standards",
    mod3Title: "Module 3 — Heavy Conveyor & LOTO",
    mod3Desc: "Conveyor belt nip points, pinch guard inspection, and electrical LOTO isolation.",
    mod4Title: "Module 4 — Working at Heights & Harness",
    mod4Desc: "Scaffolding pre-check, double lanyard 100% tie-off, and suspension trauma relief.",
    mod5Title: "Module 5 — First Aid & CPR Response",
    mod5Desc: "AED placement, tourniquet application, and mine pit evacuation stretcher triage.",
    q3Tag: "Q3 Roadmap",
    q4Tag: "Q4 Roadmap",
    // SIH Enhancements
    safetyPointsLabel: "Safety Points",
    objectiveLabel: "Training Objective",
    timeTakenLabel: "Time Taken",
    correctCountLabel: "Correct",
    incorrectCountLabel: "Incorrect",
    registerWorkerBtn: "Register Worker",
    sihDemoMode: "SIH Demo Mode",
    demoWorker: "Demo Trainee",
    blockchainVerified: "Blockchain-ready certificate verification architecture",
    verifyPublicLedger: "Verify in Compliance Ledger",
    demoMode: "SIH Demo Mode",
    demoModeDesc: "Fast 2-minute jury walkthrough for DGMS / OSHA compliance pipeline",
    offlineHub: "Offline Hub",
    aiCoachTitle: "AI Safety Coach (Gemini)",
    aiCoachSubtitle: "Real-time industrial voice & text compliance mentor",
    listenVoice: "Listen Voice",
    analyzingStandards: "Analyzing safety standards...",
    quickPromptsLabel: "Quick Prompts",
    verify: "Verify",
    workerIdLabel: "Worker ID",
    moduleNameLabel: "Module Name",
    scorePercentageLabel: "Score Achieved",
    statusLabel: "Status",
    score: "Score",
    correctAnswers: "Correct Answers",
    incorrectAnswers: "Incorrect Answers",
    timeTaken: "Time Taken",
    hideReview: "Hide Review",
    reviewAnswers: "Review Answers",
    returnToTraining: "Return to Training",
    centralLedgerSynced: "Synced to Central Compliance Ledger",
    offlineStoredPending: "Offline Local Storage (Pending Sync)",
    nationalSafetyHeader: "GOVERNMENT OF INDIA • DIRECTORATE GENERAL OF MINES SAFETY",
    certificateOfCompetency: "NATIONAL CERTIFICATE OF OCCUPATIONAL SAFETY COMPETENCY",
    issuedInAccordance: "Issued in accordance with DGMS Circulars & OSHA 1910 Industrial Regulations",
    verifiedBadge: "DGMS VERIFIED",
    certifyText: "This is to officially certify that",
    gradeAchieved: "Evaluation Score",
    simulationCompletedText: "has successfully completed rigorous practical augmented reality simulation and statutory knowledge evaluation in",
    complianceSpecialization: "Statutory Compliance Specialization",
    scanToVerify: "Scan to verify tamper-proof digital cryptographic ledger signature",
    certifiedViaEngine: "Certified via Suraksha AR Decentralized Compliance Engine",
    verifyInAdmin: "Verify in Admin Ledger"
  },
  hi: {
    appTitle: "सुरक्षा-AR",
    appSubtitle: "औद्योगिक एवं खदान सुरक्षा संवर्धित वास्तविकता (AR) प्रशिक्षण",
    easternSectorZone: "पूर्वी क्षेत्र - जोन 4",
    mobileOfflineApp: "📱 मोबाइल एवं ऑफ़लाइन ऐप",
    headerSubtitle: "औद्योगिक एवं खदान सुरक्षा AR प्रशिक्षण • 100% ऑफ़लाइन DGMS / OSHA अनुपालन",
    trainingModules: "प्रशिक्षण मॉड्यूल",
    workerWallet: "श्रमिक वॉलेट",
    adminDashboard: "प्रबंधक डैशबोर्ड",
    deepMineOffline: "डीप माइन ऑफ़लाइन",
    offlineReady: "ऑफ़लाइन तैयार",
    installApp: "ऐप इंस्टॉल करें",
    aiCoach: "AI सुरक्षा कोच",
    deepMineBanner: "⚡ डीप माइन मोड: 100% ऑफ़लाइन कैश सक्रिय (0kb नेटवर्क आवश्यक)",
    manage: "प्रबंधन",
    roleWorker: "श्रमिक AR मोड",
    roleAdmin: "प्रबंधक अनुपालन पोर्टल",
    offlineStatus: "ऑफ़लाइन मोड (स्थानीय डेटा सुरक्षित)",
    onlineStatus: "ऑनलाइन एवं सर्वर सिंक",
    syncPending: "प्रमाणपत्र सिंक हेतु शेष",
    syncNow: "अभी सर्वर से सिंक करें",
    audioGuideActive: "ध्वनि मार्गदर्शन चालू",
    audioGuideMute: "ध्वनि बंद",
    startARSession: "AR सुरक्षा अभ्यास शुरू करें",
    resumeTraining: "AR प्रशिक्षण जारी रखें",
    modulesTitle: "औद्योगिक सुरक्षा प्रशिक्षण मॉड्यूल",
    modulesSubtitle: "लाइव कैमरा निरीक्षण एवं ऑफ़लाइन प्रमाणन के साथ मोबाइल स्थानिक AR सिमुलेशन।",
    offlineReady100: "⚡ 100% ऑफ़लाइन तैयार",
    minsDuration: "मिनट",
    passingScoreLabel: "उत्तीर्ण:",
    interactiveSequence: "इंटरैक्टिव AR अनुक्रम:",
    statusOfflineReady: "स्थिति: ऑफ़लाइन तैयार",
    certifiedBadge: "प्रमाणित",
    startModule: "अभ्यास शुरू करें",
    viewCertificate: "प्रमाणपत्र देखें",
    takeAssessment: "योग्यता परीक्षा शुरू करें",
    scoreLabel: "परीक्षा अंक",
    passingScore: "उत्तीर्ण अंक: 70%",
    retakeAssessment: "पुनः परीक्षा दें",
    verifyCertificate: "प्रमाणपत्र सत्यापन",
    scanQRCode: "प्रमाणपत्र QR स्कैन करें",
    cameraActive: "लाइव AR कैमरा चालू (ARCore धरातल ट्रैकिंग)",
    cameraFallback: "औद्योगिक सिमुलेशन मोड",
    switchCamera: "कैमरा / दृश्य बदलें",
    planeDetected: "AR धरातल सफलतापूर्वक लॉक हुआ",
    scanningSurface: "कैमरा को फर्श की ओर रखें और धीरे-धीरे घुमाएं...",
    arInstructionHeader: "वर्तमान AR सुरक्षा चरण",
    safetyWarning: "अति-गंभीर खतरा चेतावनी",
    exitTraining: "AR मोड से बाहर निकलें",
    nextStep: "अगले कदम पर जाएं",
    completeModule: "अभ्यास पूर्ण एवं परीक्षा दें",
    workerProfile: "श्रमिक पहचान",
    complianceLedger: "DGMS / OSHA केंद्रीय अनुपालन रजिस्टर",
    downloadReport: "अनुपालन रिपोर्ट डाउनलोड (CSV)",
    searchWorker: "श्रमिक का नाम, आईडी या कोड खोजें...",
    filterByDepartment: "विभाग / खदान",
    filterByStatus: "प्रमाणन स्थिति",
    filterByLanguage: "प्रशिक्षण भाषा",
    all: "सभी रिकॉर्ड",
    valid: "प्रमाणित एवं वैध",
    expired: "समय समाप्त / नवीनीकरण आवश्यक",
    passed: "उत्तीर्ण (>=70%)",
    failed: "अनुत्तीर्ण (<70%)",
    voiceAssistant: "ध्वनि निर्देश सुनें",
    askAICoach: "AI सुरक्षा सलाहकार से पूछें",
    dgmsCompliant: "DGMS खान सुरक्षा नियम 2017 प्रमाणित",
    oshaStandard: "OSHA 1910 औद्योगिक सुरक्षा मानक",
    certificateId: "प्रमाणपत्र संख्या",
    workerId: "श्रमिक कर्मचारी कोड",
    issueDate: "प्रमाणन तिथि",
    validTill: "मान्यता समाप्ति तिथि",
    organization: "अधिकृत औद्योगिक संस्थान",
    authorizedSignature: "मुख्य सुरक्षा अधिकारी (सुरक्षा निदेशालय)",
    printCertificate: "प्रमाणपत्र प्रिंट / PDF सेव करें",
    close: "बंद करें",
    // Admin dashboard specific
    regionalTrainingOverview: "क्षेत्रीय प्रशिक्षण समीक्षा",
    regionalTrainingDesc: "सत्यापन योग्य अनुपालन ट्रैकिंग, लाइव QR निरीक्षण पोर्टल और ऑफ़लाइन-सिंक श्रमिक क्रेडेंशियल।",
    totalWorkers: "कुल श्रमिक",
    thisMonthGrowth: "+12% इस माह",
    certificatesIssued: "जारी प्रमाणपत्र",
    passRateText: "87.1% उत्तीर्ण दर",
    averageScore: "औसत प्राप्तांक",
    targetScoreText: "लक्ष्य: 85%",
    activeHazards: "सक्रिय खतरे",
    requiresReviewText: "समीक्षा आवश्यक",
    recentAssessments: "हालिया सुरक्षा मूल्यांकन",
    recentAssessmentsDesc: "DGMS एवं OSHA वास्तविक समय सत्यापन रजिस्टर",
    searchWorkerPlaceholder: "श्रमिक का नाम, आईडी या कोड खोजें...",
    allLanguages: "सभी भाषाएं",
    thWorkerId: "श्रमिक कोड",
    thModule: "मॉड्यूल",
    thLanguage: "भाषा",
    thScore: "अंक",
    thVerification: "सत्यापन",
    thAction: "कार्रवाई",
    verifiedStatus: "सत्यापित",
    pendingRetryStatus: "पुनः प्रयास लंबित",
    viewAction: "देखें",
    noMatchingRecords: "खोज मानदंड से मेल खाता कोई रिकॉर्ड नहीं मिला।",
    certScannerTitle: "प्रमाणपत्र स्कैनर",
    certScannerDesc: "अनुपालन स्थिति सत्यापित करने के लिए आईडी दर्ज करें या कोड स्कैन करें",
    certScannerPlaceholder: "आईडी: SURAKSHA-IND-XXXX",
    verifyStatusBtn: "स्थिति सत्यापित करें",
    moduleParticipationTitle: "मॉड्यूल भागीदारी",
    langUsageIndexTitle: "भाषा उपयोग सूचकांक",
    langDistributionTitle: "भाषा वितरण",
    triLingualTag: "त्रिभाषी",
    langDistributionDesc: "ज़मीनी श्रमिकों के लिए स्थानीय हिन्दी एवं संताली आवाज़ निर्देशों का उपयोग।",
    deptPassRatesTitle: "विभाग उत्तीर्ण दर एवं प्रशिक्षित श्रमिक",
    avgComplianceTag: "औसत 86% DGMS अनुपालन",
    highRiskNotice: "साइट प्रवेश से पहले उच्च जोखिम वाले क्षेत्रों के लिए न्यूनतम 70% थ्रेशोल्ड आवश्यक है",
    dgmsStandardBadge: "100% DGMS मानक",
    // Wallet specific
    walletTitleSuffix: " का डिजिटल प्रमाणपत्र वॉलेट",
    walletDesc: "क्रिप्टोग्राफिक छेड़छाड़-रोधी QR सत्यापन कोड के साथ ऑफ़लाइन सत्यापित क्रेडेंशियल।",
    verifyQrBtn: "QR सत्यापित करें",
    gradeLabel: "ग्रेड:",
    certIdLabel: "प्रमाणपत्र कोड:",
    issueDateLabel: "जारी तिथि:",
    validTillLabel: "मान्यता समाप्ति:",
    standardLabel: "मानक:",
    cloudSynced: "● क्लाउड सिंक पूर्ण",
    savedLocally: "● स्थानीय रूप से सुरक्षित",
    noCertsTitle: "अभी तक कोई प्रमाणपत्र जारी नहीं हुआ",
    noCertsDesc: "व्यावहारिक AR प्रशिक्षण मॉड्यूल पूरा करें और अपना आधिकारिक DGMS अनुपालन प्रमाणपत्र प्राप्त करने के लिए मूल्यांकन उत्तीर्ण करें।",
    goToTrainingBtn: "प्रशिक्षण मॉड्यूल पर जाएं",
    // Roadmap
    upcomingRoadmapTitle: "आगामी औद्योगिक AR मॉड्यूल रोडमैप",
    roadmapStandardTag: "DGMS मानक",
    mod3Title: "मॉड्यूल 3 — भारी कन्वेयर एवं LOTO",
    mod3Desc: "कन्वेयर बेल्ट निप पॉइंट, पिंच गार्ड निरीक्षण और विद्युत LOTO आइसोलेशन।",
    mod4Title: "मॉड्यूल 4 — ऊंचाई पर कार्य एवं हार्नेस सुरक्षा",
    mod4Desc: "मचान पूर्व-निरीक्षण, डबल लैनयार्ड 100% टाई-ऑफ और सस्पेंशन ट्रॉमा रिलीफ।",
    mod5Title: "मॉड्यूल 5 — प्राथमिक चिकित्सा एवं सीपीआर",
    mod5Desc: "AED का उपयोग, टूर्निकेट बांधना और खदान से स्ट्रेचर बचाव।",
    q3Tag: "तिमाही 3 रोडमैप",
    q4Tag: "तिमाही 4 रोडमैप",
    // SIH Enhancements
    safetyPointsLabel: "सुरक्षा अंक",
    objectiveLabel: "प्रशिक्षण उद्देश्य",
    timeTakenLabel: "लिया गया समय",
    correctCountLabel: "सही",
    incorrectCountLabel: "गलत",
    registerWorkerBtn: "नया श्रमिक पंजीकरण",
    sihDemoMode: "SIH डेमो मोड",
    demoWorker: "डेमो श्रमिक",
    blockchainVerified: "ब्लॉकचेन-सक्षम प्रमाणपत्र सत्यापन प्रणाली",
    verifyPublicLedger: "अनुपालन लेज़र में सत्यापित करें",
    demoMode: "SIH डेमो मोड",
    demoModeDesc: "जूरी मूल्यांकन के लिए 2-मिनट त्वरित DGMS / OSHA अनुपालन वॉकथ्रू",
    offlineHub: "ऑफ़लाइन हब",
    aiCoachTitle: "AI सुरक्षा कोच (जेमिनी)",
    aiCoachSubtitle: "वास्तविक समय औद्योगिक आवाज़ और पाठ अनुपालन मार्गदर्शक",
    listenVoice: "आवाज़ सुनें",
    analyzingStandards: "सुरक्षा मानकों का विश्लेषण...",
    quickPromptsLabel: "त्वरित प्रश्न",
    verify: "सत्यापित करें",
    workerIdLabel: "कर्मचारी आईडी",
    moduleNameLabel: "मॉड्यूल का नाम",
    scorePercentageLabel: "अर्जित स्कोर",
    statusLabel: "स्थिति",
    score: "स्कोर",
    correctAnswers: "सही उत्तर",
    incorrectAnswers: "गलत उत्तर",
    timeTaken: "लिया गया समय",
    hideReview: "समीक्षा छिपाएं",
    reviewAnswers: "उत्तरों की समीक्षा करें",
    returnToTraining: "प्रशिक्षण पर लौटें",
    centralLedgerSynced: "केंद्रीय अनुपालन लेज़र में सिंक किया गया",
    offlineStoredPending: "ऑफ़लाइन स्थानीय संग्रह (सिंक लंबित)",
    nationalSafetyHeader: "भारत सरकार • खान सुरक्षा महानिदेशालय (DGMS)",
    certificateOfCompetency: "व्यावसायिक सुरक्षा योग्यता का राष्ट्रीय प्रमाणपत्र",
    issuedInAccordance: "DGMS परिपत्रों और OSHA 1910 औद्योगिक नियमों के तहत जारी",
    verifiedBadge: "DGMS सत्यापित",
    certifyText: "यह आधिकारिक रूप से प्रमाणित किया जाता है कि",
    gradeAchieved: "मूल्यांकन स्कोर",
    simulationCompletedText: "ने व्यावहारिक संवर्धित वास्तविकता (AR) सिमुलेशन और वैधानिक ज्ञान मूल्यांकन सफलतापूर्वक पूरा किया:",
    complianceSpecialization: "वैधानिक अनुपालन विशेषज्ञता",
    scanToVerify: "क्रिप्टोग्राफिक लेज़र हस्ताक्षर सत्यापित करने हेतु स्कैन करें",
    certifiedViaEngine: "सुरक्षा AR विकेंद्रीकृत अनुपालन इंजन द्वारा प्रमाणित",
    verifyInAdmin: "एडमिन लेज़र में जांचें"
  },
  sat: {
    appTitle: "ᱥᱩᱨᱚᱠᱥᱟ-AR",
    appSubtitle: "ᱠᱷᱟᱫᱟᱱ ᱟᱨ ᱠᱟᱹᱨᱜᱟᱲ ᱨᱩᱠᱷᱤᱭᱟᱹ AR ᱥᱮᱪᱮᱫ",
    easternSectorZone: "ᱥᱟᱢᱟᱝ ᱴᱚᱴᱷᱟ - ᱡᱳᱱ 4",
    mobileOfflineApp: "📱 ᱢᱳᱵᱟᱭᱤᱞ ᱟᱨ ᱚᱯᱷᱞᱟᱭᱤᱱ ᱮᱯ",
    headerSubtitle: "ᱠᱷᱟᱫᱟᱱ ᱟᱨ ᱠᱟᱹᱨᱜᱟᱲ ᱨᱩᱠᱷᱤᱭᱟᱹ AR ᱥᱮᱪᱮᱫ • 100% ᱚᱯᱷᱞᱟᱭᱤᱱ DGMS ᱢᱟᱱᱚᱠ",
    trainingModules: "ᱥᱮᱪᱮᱫ ᱢᱚᱰᱩᱞ",
    workerWallet: "ᱠᱟᱹᱢᱤᱭᱟᱹ ᱣᱟᱞᱮᱴ",
    adminDashboard: "ᱟᱹᱢᱟᱹᱞᱤ ᱰᱮᱥᱵᱳᱨᱰ",
    deepMineOffline: "ᱠᱷᱟᱫᱟᱱ ᱚᱯᱷᱞᱟᱭᱤᱱ",
    offlineReady: "ᱚᱯᱷᱞᱟᱭᱤᱱ ᱨᱮᱰᱤ",
    installApp: "ᱮᱯ ᱤᱱᱥᱴᱚᱞ ᱢᱮ",
    aiCoach: "AI ᱨᱩᱠᱷᱤᱭᱟᱹ ᱠᱳᱪ",
    deepMineBanner: "⚡ ᱠᱷᱟᱫᱟᱱ ᱢᱳᱰ: 100% ᱚᱯᱷᱞᱟᱭᱤᱱ ᱠᱮᱥ (0kb ᱱᱮᱴᱣᱚᱨᱠ ᱞᱟᱹᱠᱛᱤ)",
    manage: "ᱵᱮᱵᱚᱥᱛᱷᱟ",
    roleWorker: "ᱠᱟᱹᱢᱤᱭᱟᱹ AR ᱧᱮᱞ",
    roleAdmin: "ᱟᱹᱢᱟᱹᱞᱤ ᱯᱚᱨᱴᱟᱞ",
    offlineStatus: "ᱚᱯᱷᱞᱟᱭᱤᱱ ᱢᱳᱰ (ᱞᱳᱠᱟᱞ ᱥᱟᱧᱪᱟᱣ)",
    onlineStatus: "ᱚᱱᱞᱟᱭᱤᱱ ᱡᱚᱲᱟᱣ",
    syncPending: "ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱥᱤᱝᱠ ᱵᱟᱹᱠᱤ",
    syncNow: "ᱥᱟᱨᱵᱷᱟᱨ ᱥᱟᱞᱟᱜ ᱡᱚᱲᱟᱣ ᱢᱮ",
    audioGuideActive: "ᱨᱚᱲ ᱛᱮ ᱞᱟᱹᱭ ᱪᱟᱹᱞᱩ",
    audioGuideMute: "ᱨᱚᱲ ᱵᱚᱸᱫᱽ",
    startARSession: "AR ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱮᱪᱮᱫ ᱮᱦᱚᱵ",
    resumeTraining: "ᱥᱮᱪᱮᱫ ᱞᱟᱦᱟᱭ ᱢᱮ",
    modulesTitle: "ᱠᱟᱹᱨᱜᱟᱲ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱮᱪᱮᱫ ᱢᱚᱰᱩᱞ",
    modulesSubtitle: "ᱞᱟᱭᱤᱵᱽ ᱠᱮᱢᱮᱨᱟ ᱡᱟᱸᱪ ᱟᱨ ᱚᱯᱷᱞᱟᱭᱤᱱ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱥᱟᱶ ᱢᱳᱵᱟᱭᱤᱞ AR ᱥᱮᱪᱮᱫ᱾",
    offlineReady100: "⚡ 100% ᱚᱯᱷᱞᱟᱭᱤᱱ ᱨᱮᱰᱤ",
    minsDuration: "ᱴᱤᱲᱤᱡ",
    passingScoreLabel: "ᱯᱟᱥ:",
    interactiveSequence: "AR ᱠᱟᱹᱢᱤ ᱫᱷᱟᱯ:",
    statusOfflineReady: "ᱦᱟᱞᱚᱛ: ᱚᱯᱷᱞᱟᱭᱤᱱ ᱨᱮᱰᱤ",
    certifiedBadge: "ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱧᱟᱢ",
    startModule: "ᱥᱮᱪᱮᱫ ᱮᱦᱚᱵ",
    viewCertificate: "ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱧᱮᱞ",
    takeAssessment: "ᱵᱤᱰᱟᱹᱣ ᱮᱢ ᱢᱮ",
    scoreLabel: "ᱵᱤᱰᱟᱹᱣ ᱱᱚᱢᱵᱚᱨ",
    passingScore: "ᱯᱟᱥ ᱱᱚᱢᱵᱚᱨ: 70%",
    retakeAssessment: "ᱫᱚᱦᱲᱟ ᱵᱤᱰᱟᱹᱣ ᱮᱢ ᱢᱮ",
    verifyCertificate: "ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱯᱩᱨᱩᱴᱷ ᱢᱮ",
    scanQRCode: "QR ᱠᱳᱰ ᱥᱠᱮᱱ ᱢᱮ",
    cameraActive: "ᱠᱮᱢᱮᱨᱟ AR ᱪᱟᱹᱞᱩ ᱢᱮᱱᱟᱜ-ᱟ",
    cameraFallback: "ᱥᱤᱢᱩᱞᱮᱥᱚᱱ ᱢᱳᱰ",
    switchCamera: "ᱠᱮᱢᱮᱨᱟ ᱵᱚᱫᱚᱞ ᱢᱮ",
    planeDetected: "AR ᱚᱛ ᱞᱟᱜᱟᱣ ᱮᱱᱟ",
    scanningSurface: "ᱠᱮᱢᱮᱨᱟ ᱚᱛ ᱥᱮᱫ ᱟᱹᱪᱩᱨ ᱢᱮ AR ᱞᱟᱹᱜᱤᱫ...",
    arInstructionHeader: "ᱱᱤᱛᱚᱜᱟᱜ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱠᱟᱹᱢᱤ",
    safetyWarning: "ᱟᱹᱰᱤ ᱢᱟᱨᱟᱝ ᱵᱚᱛᱚᱨ ᱥᱟᱹᱠᱷᱭᱟᱹᱛ",
    exitTraining: "AR ᱠᱷᱚᱱ ᱚᱰᱚᱠᱚᱜ ᱢᱮ",
    nextStep: "ᱞᱟᱦᱟ ᱥᱮᱫ ᱥᱮᱱᱚᱜ ᱢᱮ",
    completeModule: "ᱥᱮᱪᱮᱫ ᱢᱩᱪᱟᱹᱫ ᱟᱨ ᱵᱤᱰᱟᱹᱣ",
    workerProfile: "ᱠᱟᱹᱢᱤᱭᱟᱹ ᱩᱯᱨᱩᱢ",
    complianceLedger: "DGMS ᱨᱩᱠᱷᱤᱭᱟᱹ ᱨᱮᱡᱤᱥᱴᱟᱨ",
    downloadReport: "ᱨᱤᱯᱳᱨᱴ CSV ᱟᱹᱛᱩᱨ ᱢᱮ",
    searchWorker: "ᱠᱟᱹᱢᱤᱭᱟᱹ ᱧᱩᱛᱩᱢ ᱥᱮ ID ᱯᱟᱸᱡᱟᱭ ᱢᱮ...",
    filterByDepartment: "ᱵᱤᱵᱷᱟᱜᱽ / ᱠᱷᱟᱫᱟᱱ",
    filterByStatus: "ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱦᱟᱞᱚᱛ",
    filterByLanguage: "ᱯᱟᱹᱨᱥᱤ",
    all: "ᱡᱚᱛᱚ ᱨᱮᱠᱚᱨᱰ",
    valid: "ᱥᱟᱹᱨᱤ ᱟᱨ ᱴᱷᱤᱠ",
    expired: "ᱚᱠᱛᱚ ᱪᱟᱵᱟ ᱟᱠᱟᱱ",
    passed: "ᱯᱟᱥ ᱟᱠᱟᱱ (>=70%)",
    failed: "ᱯᱷᱮᱞ ᱟᱠᱟᱱ (<70%)",
    voiceAssistant: "ᱨᱚᱲ ᱛᱮ ᱟᱸᱡᱚᱢ ᱢᱮ",
    askAICoach: "AI ᱜᱚᱜᱚᱲᱚᱭᱤᱡ ᱠᱩᱞᱤᱭᱮᱢ",
    dgmsCompliant: "DGMS ᱠᱷᱟᱫᱟᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱟᱹᱱ 2017 ᱞᱮᱠᱟᱛᱮ",
    oshaStandard: "OSHA 1910 ᱨᱩᱠᱷᱤᱭᱟᱹ ᱢᱟᱱᱚᱠ",
    certificateId: "ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱮᱞ",
    workerId: "ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱳᱰ",
    issueDate: "ᱮᱢ ᱟᱠᱟᱱ ᱢᱟᱹᱦᱤᱛ",
    validTill: "ᱪᱟᱵᱟᱜ ᱢᱟᱹᱦᱤᱛ",
    organization: "ᱠᱟᱹᱨᱜᱟᱲ ᱧᱩᱛᱩᱢ",
    authorizedSignature: "ᱢᱩᱬᱩᱛ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱟᱹᱢᱟᱹᱞᱤ",
    printCertificate: "ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱯᱨᱤᱱᱴ / PDF",
    close: "ᱵᱚᱸᱫᱽ ᱢᱮ",
    // Admin dashboard specific
    regionalTrainingOverview: "ᱴᱚᱴᱷᱟᱠᱤᱭᱟᱹ ᱥᱮᱪᱮᱫ ᱧᱮᱞ",
    regionalTrainingDesc: "ᱯᱩᱨᱩᱴᱷ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱴᱨᱮᱠᱤᱝ, ᱞᱟᱭᱤᱵᱽ QR ᱡᱟᱸᱪ ᱯᱚᱨᱴᱟᱞ ᱟᱨ ᱚᱯᱷᱞᱟᱭᱤᱱ ᱥᱤᱝᱠ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱩᱯᱨᱩᱢ᱾",
    totalWorkers: "ᱡᱚᱛᱚ ᱠᱟᱹᱢᱤᱭᱟᱹ",
    thisMonthGrowth: "+12% ᱱᱚᱣᱟ ᱪᱟᱸᱫᱚ",
    certificatesIssued: "ᱮᱢ ᱟᱠᱟᱱ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ",
    passRateText: "87.1% ᱯᱟᱥ ᱦᱟᱨ",
    averageScore: "ᱜᱩᱸᱴ ᱱᱚᱢᱵᱚᱨ",
    targetScoreText: "ᱴᱟᱨᱜᱮᱴ: 85%",
    activeHazards: "ᱱᱤᱛᱚᱜᱟᱜ ᱵᱚᱛᱚᱨ",
    requiresReviewText: "ᱧᱮᱞ ᱞᱟᱹᱠᱛᱤ",
    recentAssessments: "ᱱᱤᱛᱚᱜᱟᱜ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱵᱤᱰᱟᱹᱣ",
    recentAssessmentsDesc: "DGMS ᱟᱨ OSHA ᱨᱤᱭᱟᱞ-ᱴᱟᱭᱤᱢ ᱨᱮᱡᱤᱥᱴᱟᱨ",
    searchWorkerPlaceholder: "ᱠᱟᱹᱢᱤᱭᱟᱹ ᱧᱩᱛᱩᱢ ᱥᱮ ID ᱯᱟᱸᱡᱟᱭ ᱢᱮ...",
    allLanguages: "ᱡᱚᱛᱚ ᱯᱟᱹᱨᱥᱤ",
    thWorkerId: "ᱠᱟᱹᱢᱤᱭᱟᱹ ID",
    thModule: "ᱢᱚᱰᱩᱞ",
    thLanguage: "ᱯᱟᱹᱨᱥᱤ",
    thScore: "ᱱᱚᱢᱵᱚᱨ",
    thVerification: "ᱯᱩᱨᱩᱴᱷ",
    thAction: "ᱠᱟᱹᱢᱤ",
    verifiedStatus: "ᱯᱩᱨᱩᱴᱷ ᱟᱠᱟᱱ",
    pendingRetryStatus: "ᱫᱚᱦᱲᱟ ᱵᱟᱹᱠᱤ",
    viewAction: "ᱧᱮᱞ ᱢᱮ",
    noMatchingRecords: "ᱪᱮᱫ ᱨᱮᱠᱚᱨᱰ ᱦᱚᱸ ᱵᱟᱝ ᱧᱟᱢ ᱞᱮᱱᱟ᱾",
    certScannerTitle: "ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱥᱠᱮᱱᱟᱨ",
    certScannerDesc: "ᱨᱩᱠᱷᱤᱭᱟᱹ ᱦᱟᱞᱚᱛ ᱧᱮᱞ ᱞᱟᱹᱜᱤᱫ ID ᱚᱞ ᱢᱮ ᱥᱮ QR ᱥᱠᱮᱱ ᱢᱮ",
    certScannerPlaceholder: "ID: SURAKSHA-IND-XXXX",
    verifyStatusBtn: "ᱦᱟᱞᱚᱛ ᱯᱩᱨᱩᱴᱷ ᱢᱮ",
    moduleParticipationTitle: "ᱢᱚᱰᱩᱞ ᱥᱮᱞᱮᱫ",
    langUsageIndexTitle: "ᱯᱟᱹᱨᱥᱤ ᱵᱮᱵᱷᱟᱨ ᱥᱩᱪᱤ",
    langDistributionTitle: "ᱯᱟᱹᱨᱥᱤ ᱦᱟᱹᱴᱤᱧ",
    triLingualTag: "ᱯᱮ-ᱯᱟᱹᱨᱥᱤ",
    langDistributionDesc: "ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱚ ᱞᱟᱹᱜᱤᱫ ᱥᱟᱱᱛᱟᱲᱤ ᱟᱨ ᱦᱤᱱᱫᱤ ᱨᱚᱲ ᱛᱮ ᱥᱮᱪᱮᱫ᱾",
    deptPassRatesTitle: "ᱵᱤᱵᱷᱟᱜᱽ ᱯᱟᱥ ᱦᱟᱨ ᱟᱨ ᱥᱮᱪᱮᱫ ᱠᱟᱹᱢᱤᱭᱟᱹ",
    avgComplianceTag: "ᱜᱩᱸᱴ 86% DGMS ᱨᱩᱠᱷᱤᱭᱟᱹ",
    highRiskNotice: "ᱠᱟᱹᱢᱤ ᱴᱷᱟᱶ ᱵᱚᱞᱚᱱ ᱢᱟᱬᱟᱝ ᱨᱮ ᱠᱚᱢ ᱠᱷᱚᱱ ᱠᱚᱢ 70% ᱱᱚᱢᱵᱚᱨ ᱞᱟᱹᱠᱛᱤ",
    dgmsStandardBadge: "100% DGMS ᱢᱟᱱᱚᱠ",
    // Wallet specific
    walletTitleSuffix: " ᱭᱟᱜ ᱰᱤᱡᱤᱴᱟᱞ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱣᱟᱞᱮᱴ",
    walletDesc: "ᱠᱨᱤᱯᱴᱳᱜᱽᱨᱟᱯᱷᱤᱠ QR ᱠᱳᱰ ᱥᱟᱶ ᱚᱯᱷᱞᱟᱭᱤᱱ ᱯᱩᱨᱩᱴᱷ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ᱾",
    verifyQrBtn: "QR ᱯᱩᱨᱩᱴᱷ ᱢᱮ",
    gradeLabel: "ᱜᱽᱨᱮᱰ:",
    certIdLabel: "ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱮᱞ:",
    issueDateLabel: "ᱮᱢ ᱢᱟᱹᱦᱤᱛ:",
    validTillLabel: "ᱪᱟᱵᱟᱜ ᱢᱟᱹᱦᱤᱛ:",
    standardLabel: "ᱢᱟᱱᱚᱠ:",
    cloudSynced: "● ᱠᱞᱟᱣᱩᱰ ᱥᱤᱝᱠ ᱯᱩᱨᱟᱹᱣ",
    savedLocally: "● ᱞᱳᱠᱟᱞ ᱥᱟᱧᱪᱟᱣ",
    noCertsTitle: "ᱱᱤᱛ ᱫᱷᱟᱹᱵᱤᱡ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱵᱟᱹᱱᱩᱜ-ᱟ",
    noCertsDesc: "AR ᱥᱮᱪᱮᱫ ᱯᱩᱨᱟᱹᱣ ᱢᱮ ᱟᱨ ᱵᱤᱰᱟᱹᱣ ᱨᱮ ᱯᱟᱥ ᱠᱟᱛᱮ DGMS ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱧᱟᱢ ᱢᱮ᱾",
    goToTrainingBtn: "ᱥᱮᱪᱮᱫ ᱢᱚᱰᱩᱞ ᱛᱮ ᱥᱮᱱᱚᱜ ᱢᱮ",
    // Roadmap
    upcomingRoadmapTitle: "ᱞᱟᱦᱟ ᱨᱮᱱᱟᱜ ᱠᱟᱹᱨᱜᱟᱲ AR ᱢᱚᱰᱩᱞ",
    roadmapStandardTag: "DGMS ᱢᱟᱱᱚᱠ",
    mod3Title: "ᱢᱚᱰᱩᱞ 3 — ᱵᱮᱞᱴ ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱟᱨ LOTO",
    mod3Desc: "ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱵᱮᱞᱴ ᱱᱤᱯ ᱯᱚᱭᱮᱱᱴ, ᱜᱟᱨᱰ ᱡᱟᱸᱪ ᱟᱨ ᱵᱤᱡᱽᱞᱤ LOTO ᱵᱚᱸᱫᱽ᱾",
    mod4Title: "ᱢᱚᱰᱩᱞ 4 — ᱪᱮᱛᱟᱱ ᱨᱮ ᱠᱟᱹᱢᱤ ᱟᱨ ᱦᱟᱨᱱᱮᱥ ᱨᱩᱠᱷᱤᱭᱟᱹ",
    mod4Desc: "ᱥᱠᱮᱯᱷᱳᱞᱰ ᱡᱟᱸᱪ, ᱵᱟᱱᱟᱨ ᱦᱩᱠ ᱴᱟᱭ-ᱚᱯᱷ ᱟᱨ ᱧᱩᱨ ᱛᱟᱭᱚᱢ ᱨᱩᱠᱷᱤᱭᱟᱹ᱾",
    mod5Title: "ᱢᱚᱰᱩᱞ 5 — ᱮᱛᱚᱦᱚᱵ ᱨᱟᱱ ᱟᱨ CPR ᱜᱚᱲᱚ",
    mod5Desc: "AED ᱵᱮᱵᱷᱟᱨ, ᱢᱟᱭᱟᱢ ᱵᱚᱸᱫᱽ ᱟᱨ ᱠᱷᱟᱫᱟᱱ ᱠᱷᱚᱱ ᱥᱴᱨᱮᱪᱟᱨ ᱛᱮ ᱨᱟᱠᱟᱵ᱾",
    q3Tag: "Q3 ᱨᱳᱰᱢᱮᱯ",
    q4Tag: "Q4 ᱨᱳᱰᱢᱮᱯ",
    // SIH Enhancements
    safetyPointsLabel: "ᱨᱩᱠᱷᱤᱭᱟᱹ ᱯᱚᱭᱮᱱᱴ",
    objectiveLabel: "ᱥᱮᱪᱮᱫ ᱩᱫᱽᱫᱮᱥ",
    timeTakenLabel: "ᱦᱟᱛᱟᱣ ᱚᱠᱛᱚ",
    correctCountLabel: "ᱴᱷᱤᱠ",
    incorrectCountLabel: "ᱵᱷᱩᱞ",
    registerWorkerBtn: "ᱱᱟᱶᱟ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱧᱩᱛᱩᱢ",
    sihDemoMode: "SIH ᱰᱮᱢᱳ ᱢᱳᱰ",
    demoWorker: "ᱰᱮᱢᱳ ᱠᱟᱹᱢᱤᱭᱟᱹ",
    blockchainVerified: "ᱵᱞᱚᱠᱪᱮᱱ-ᱥᱟᱹᱠᱷᱤᱭᱟᱹᱛ ᱯᱚᱨᱛᱟᱲ ᱥᱤᱥᱴᱚᱢ",
    verifyPublicLedger: "ᱞᱮᱡᱟᱨ ᱨᱮ ᱯᱚᱨᱛᱟᱲ ᱢᱮ",
    demoMode: "SIH ᱰᱮᱢᱳ ᱢᱳᱰ",
    demoModeDesc: "DGMS / OSHA ᱢᱟᱱᱚᱠ ᱞᱟᱹᱜᱤᱫ 2-ᱢᱤᱱᱤᱴ ᱡᱩᱨᱤ ᱰᱮᱢᱳ ᱪᱟᱹᱞᱩ",
    offlineHub: "ᱚᱯᱷᱞᱟᱭᱤᱱ ᱛᱟᱞᱢᱟ",
    aiCoachTitle: "AI ᱨᱩᱠᱷᱤᱭᱟᱹ ᱠᱳᱪ (Gemini)",
    aiCoachSubtitle: "ᱨᱤᱭᱟᱞ-ᱴᱟᱭᱤᱢ ᱠᱟᱹᱨᱜᱟᱲ ᱨᱚᱲ ᱟᱨ ᱚᱞ ᱢᱟᱱᱚᱠ ᱫᱤᱥᱟᱹ-ᱩᱫᱩᱜ",
    listenVoice: "ᱨᱚᱲ ᱟᱸᱡᱚᱢ ᱢᱮ",
    analyzingStandards: "ᱨᱩᱠᱷᱤᱭᱟᱹ ᱢᱟᱱᱚᱠ ᱯᱟᱲᱦᱟᱣ ᱦᱩᱭᱩᱜ ᱠᱟᱱᱟ...",
    quickPromptsLabel: "ᱞᱚᱜᱚᱱ ᱠᱩᱠᱞᱤ",
    verify: "ᱯᱚᱨᱛᱟᱲ ᱢᱮ",
    workerIdLabel: "ᱠᱟᱹᱢᱤᱭᱟᱹ ID",
    moduleNameLabel: "ᱢᱚᱰᱩᱞ ᱧᱩᱛᱩᱢ",
    scorePercentageLabel: "ᱟᱢᱮᱴ ᱥᱠᱳᱨ",
    statusLabel: "ᱦᱟᱞᱚᱛ",
    score: "ᱥᱠᱳᱨ",
    correctAnswers: "ᱴᱷᱤᱠ ᱛᱮᱞᱟ",
    incorrectAnswers: "ᱵᱷᱩᱞ ᱛᱮᱞᱟ",
    timeTaken: "ᱦᱟᱛᱟᱣ ᱚᱠᱛᱚ",
    hideReview: "ᱥᱟᱹᱠᱷᱤᱭᱟᱹᱛ ᱩᱠᱩᱭ ᱢᱮ",
    reviewAnswers: "ᱛᱮᱞᱟ ᱠᱚ ᱧᱮᱞ ᱨᱩᱣᱟᱹᱲ ᱢᱮ",
    returnToTraining: "ᱴᱨᱮᱱᱤᱝ ᱛᱮ ᱨᱩᱣᱟᱹᱲ ᱢᱮ",
    centralLedgerSynced: "ᱛᱟᱞᱢᱟ ᱞᱮᱡᱟᱨ ᱨᱮ ᱥᱤᱝᱠ ᱟᱠᱟᱱᱟ",
    offlineStoredPending: "ᱚᱯᱷᱞᱟᱭᱤᱱ ᱨᱮᱠᱚᱨᱰ (ᱥᱤᱝᱠ ᱵᱟᱹᱠᱤ)",
    nationalSafetyHeader: "ᱥᱤᱧᱚᱛ ᱥᱚᱨᱠᱟᱨ • ᱠᱷᱟᱫᱟᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱢᱚᱦᱟᱱᱤᱫᱮᱥᱚᱠ (DGMS)",
    certificateOfCompetency: "ᱠᱟᱹᱢᱤ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱟᱹᱠᱷᱤᱭᱟᱹᱛ ᱡᱟᱹᱛᱤᱭᱟᱹᱨᱤ ᱯᱚᱨᱢᱟᱱ-ᱥᱟᱠᱟᱢ",
    issuedInAccordance: "DGMS ᱟᱨ OSHA 1910 ᱠᱟᱹᱨᱜᱟᱲ ᱱᱤᱭᱚᱢ ᱞᱮᱠᱟᱛᱮ ᱪᱟᱞ ᱦᱩᱭ ᱮᱱᱟ",
    verifiedBadge: "DGMS ᱯᱚᱨᱛᱟᱲ",
    certifyText: "ᱱᱚᱶᱟ ᱥᱟᱹᱠᱷᱤᱭᱟᱹᱛ ᱮᱢ ᱦᱩᱭᱩᱜ ᱠᱟᱱᱟ ᱡᱮ",
    gradeAchieved: "ᱯᱚᱨᱤᱠᱷᱟ ᱥᱠᱳᱨ",
    simulationCompletedText: "ᱱᱩᱭ ᱫᱚ AR ᱥᱤᱢᱩᱞᱮᱥᱚᱱ ᱟᱨ DGMS ᱯᱚᱨᱤᱠᱷᱟ ᱥᱟᱹᱛ ᱟᱠᱟᱫᱟᱭ:",
    complianceSpecialization: "ᱟᱹᱭᱤᱱ ᱞᱮᱠᱟᱛᱮ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱦᱟᱹᱴᱤᱧ",
    scanToVerify: "ᱠᱨᱤᱯᱴᱳᱜᱽᱨᱟᱯᱷᱤᱠ ᱞᱮᱡᱟᱨ ᱥᱩᱦᱤ ᱯᱚᱨᱛᱟᱲ ᱞᱟᱹᱜᱤᱫ ᱥᱠᱮᱱ ᱢᱮ",
    certifiedViaEngine: "ᱥᱩᱨᱚᱠᱥᱟ AR ᱤᱧᱡᱤᱱ ᱦᱚᱛᱮᱛᱮ ᱥᱟᱹᱠᱷᱤᱭᱟᱹᱛ",
    verifyInAdmin: "ᱟᱹᱢᱟᱹᱞᱤ ᱞᱮᱡᱟᱨ ᱨᱮ ᱯᱚᱨᱛᱟᱲ ᱢᱮ"
  }
};

function createFallbackDict(dict: TranslationDict, fallback: TranslationDict): TranslationDict {
  return new Proxy(dict, {
    get(target, prop) {
      if (typeof prop === 'string' && prop in target && (target as any)[prop] !== undefined) {
        return (target as any)[prop];
      }
      return (fallback as any)[prop] || '';
    }
  });
}

const safeDictionaryMap: Record<Language, TranslationDict> = {
  en: rawTranslations.en,
  hi: createFallbackDict(rawTranslations.hi, rawTranslations.en),
  sat: createFallbackDict(rawTranslations.sat, rawTranslations.en),
};

export const translations: Record<Language, TranslationDict> = new Proxy(safeDictionaryMap, {
  get(target, prop) {
    if (typeof prop === 'string' && prop in target) {
      return (target as any)[prop];
    }
    return target.en;
  }
});


