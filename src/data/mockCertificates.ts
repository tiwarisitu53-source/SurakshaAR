import { CertificateRecord, WorkerProfile } from '../types';
import { generateSampleIdCardDataUrl } from '../utils/idCardGenerator';

export const initialWorkerProfiles: WorkerProfile[] = [
  {
    id: 'EMP-4102',
    name: 'Ramesh Soren',
    role: 'Blasting & Underground Mining Crew Lead',
    facility: 'Eastern Coalfields Pit #3',
    language: 'sat',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    idPhotoUrl: generateSampleIdCardDataUrl('Ramesh Soren', 'EMP-4102', 'Blasting Crew Lead', 'Eastern Coalfields Pit #3'),
    idVerified: true,
    idVerificationTimestamp: '10-Sep-2026 08:30 IST',
    idType: 'DGMS Statutory Mining Pass'
  },
  {
    id: 'EMP-3891',
    name: 'Amit Kumar Sharma',
    role: 'Chemical Refining Plant Technician',
    facility: 'Bharat Refineries Unit 4',
    language: 'hi',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    idPhotoUrl: generateSampleIdCardDataUrl('Amit Kumar Sharma', 'EMP-3891', 'Chemical Refining Tech', 'Bharat Refineries Unit 4'),
    idVerified: true,
    idVerificationTimestamp: '10-Sep-2026 09:15 IST',
    idType: 'Industrial Smart ID Card'
  },
  {
    id: 'EMP-5044',
    name: 'Sunita Murmu',
    role: 'Heavy Dragline & Electrical Operator',
    facility: 'Jharia Open Cast Project Block B',
    language: 'sat',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    idPhotoUrl: generateSampleIdCardDataUrl('Sunita Murmu', 'EMP-5044', 'Heavy Dragline Operator', 'Jharia Open Cast Block B'),
    idVerified: true,
    idVerificationTimestamp: '09-Sep-2026 14:00 IST',
    idType: 'DGMS Statutory Mining Pass'
  },
  {
    id: 'EMP-2190',
    name: 'Rajesh Verma',
    role: 'High-Voltage Substation Electrician',
    facility: 'Bokaro Steel Smelter Plant',
    language: 'hi',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    idPhotoUrl: generateSampleIdCardDataUrl('Rajesh Verma', 'EMP-2190', 'High-Voltage Electrician', 'Bokaro Steel Smelter Plant'),
    idVerified: true,
    idVerificationTimestamp: '08-Sep-2026 11:20 IST',
    idType: 'Industrial Smart ID Card'
  },
  {
    id: 'EMP-6120',
    name: 'David Besra',
    role: 'Safety Sentinel & Lifeline Attendant',
    facility: 'Tata Steel Ore Mines Noamundi',
    language: 'en',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    idPhotoUrl: generateSampleIdCardDataUrl('David Besra', 'EMP-6120', 'Safety Sentinel', 'Tata Steel Ore Mines Noamundi'),
    idVerified: true,
    idVerificationTimestamp: '07-Sep-2026 16:45 IST',
    idType: 'DGMS Statutory Mining Pass'
  }
];

export const mockWorkers = initialWorkerProfiles;

// Trainee certificates start empty - certificates are ONLY minted upon successfully completing AR modules and passing assessments (>= 70%)
export const initialCertificatesDatabase: CertificateRecord[] = [];

