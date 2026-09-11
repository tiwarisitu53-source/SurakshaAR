export type Language = 'en' | 'hi' | 'sat';

export type AppRole = 'worker' | 'admin';

export type ModuleKey = 
  | 'fire_explosion' 
  | 'gas_confined_space' 
  | 'machinery_safety' 
  | 'ppe_hazard' 
  | 'first_aid';

export interface LocalizedString {
  en: string;
  hi: string;
  sat: string; // Santali with Ol Chiki & Roman phonetic
}

export interface WorkerProfile {
  id: string;
  name: string;
  role: string;
  facility: string;
  language: Language;
  avatar: string;
  idPhotoUrl?: string; // Captured or uploaded photo of the worker's ID card / badge for genuine verification
  idVerified?: boolean; // Verified genuine status
  idVerificationTimestamp?: string;
  idType?: string; // e.g. 'DGMS Mining Pass' | 'Worker Smart Card' | 'National ID'
}

export interface ARObjectAnchor {
  id: string;
  name: LocalizedString;
  type: 
    | 'fire_primary' 
    | 'fire_electrical'
    | 'extinguisher_co2' 
    | 'extinguisher_water' 
    | 'extinguisher_dcp' 
    | 'exit_safe' 
    | 'exit_blocked' 
    | 'exit_hazard' 
    | 'gas_leak_plume' 
    | 'ppe_scba' 
    | 'ppe_cloth_mask' 
    | 'gas_detector' 
    | 'buddy_worker' 
    | 'loto_valve' 
    | 'danger_panel'
    | 'conveyor_belt'
    | 'pinch_point'
    | 'pull_cord_switch'
    | 'loto_padlock'
    | 'scaffold_tag'
    | 'safety_harness'
    | 'double_lanyard'
    | 'anchor_cable'
    | 'arc_boundary'
    | 'hot_stick_detector'
    | 'rescue_hook';
  x: number; // Percentage 0-100 across simulated viewport or camera plane
  y: number;
  z: number; // Scale depth
  isSafe?: boolean;
  isTarget?: boolean;
  hazardLevel?: 'low' | 'medium' | 'critical';
  details?: LocalizedString;
}

export interface ARSimulationStep {
  id: string;
  stepNumber: number;
  title: LocalizedString;
  instruction: LocalizedString;
  warning?: LocalizedString;
  audioPrompt: LocalizedString;
  actionRequired: 
    | 'scan_floor' 
    | 'raise_alarm' 
    | 'select_extinguisher' 
    | 'pass_pull' 
    | 'pass_aim' 
    | 'pass_squeeze' 
    | 'pass_sweep' 
    | 'select_safe_exit'
    | 'read_gas_meter'
    | 'select_correct_ppe'
    | 'verify_buddy'
    | 'mark_hazard_zone'
    | 'inspect_pinch_point'
    | 'pull_emergency_cord'
    | 'apply_loto_hasp'
    | 'inspect_scaffold_tag'
    | 'connect_double_lanyard'
    | 'test_anchor_point'
    | 'check_arc_boundary'
    | 'voltage_detector_probe'
    | 'use_rescue_hook';
  hint: LocalizedString;
  feedbackCorrect: LocalizedString;
  feedbackWrong: LocalizedString;
}

export interface AssessmentQuestion {
  id: string;
  type: 'mcq' | 'ar_spatial' | 'sequence';
  prompt: LocalizedString;
  audioPrompt: LocalizedString;
  options?: Array<{
    id: string;
    text: LocalizedString;
    isCorrect: boolean;
    explanation: LocalizedString;
  }>;
  sequenceItems?: Array<{
    id: string;
    text: LocalizedString;
    correctOrder: number;
  }>;
  spatialTargetId?: string;
  explanation: LocalizedString;
}

export interface SafetyModule {
  id: ModuleKey;
  title: LocalizedString;
  description: LocalizedString;
  badge: string;
  durationMinutes: number;
  hazardCategory: string;
  isAvailable: boolean;
  requiredPassingScore: number;
  steps: ARSimulationStep[];
  assessmentQuestions: AssessmentQuestion[];
}

export interface CertificateRecord {
  certificateId: string;
  workerId: string;
  workerName: string;
  moduleKey: ModuleKey;
  moduleName: string;
  score: number;
  date: string;
  expiryDate: string;
  status: 'Valid' | 'Expired' | 'Revoked';
  language: string;
  organization: string;
  complianceStandard: string;
  synced: boolean;
  qrPayload?: string;
  workerIdPhotoUrl?: string;
  idVerified?: boolean;
}

export interface OfflineSyncItem {
  id: string;
  type: 'assessment_result' | 'certificate_generation';
  payload: any;
  timestamp: string;
  synced: boolean;
}

export interface AdminKPIs {
  workersTrained: number;
  passedCount: number;
  failedCount: number;
  certificatesIssued: number;
  moduleCompletionRate: number;
  averageScore: number;
  expiringCertificates: number;
  languageStats: {
    hindi: number;
    santali: number;
    english: number;
  };
}
