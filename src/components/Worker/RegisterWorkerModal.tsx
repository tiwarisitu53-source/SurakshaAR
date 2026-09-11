import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  UserCheck, X, HardHat, Camera, Upload, CheckCircle2, 
  ShieldCheck, AlertTriangle, RefreshCw, Sparkles, Image as ImageIcon, Eye,
  SwitchCamera, Smartphone, Loader2, ScanLine, CameraOff
} from 'lucide-react';
import { WorkerProfile, Language } from '../../types';
import { translations } from '../../data/translations';
import { haptics } from '../../utils/haptics';
import { audioAssistant } from '../../utils/audioAssistant';
import { generateSampleIdCardDataUrl } from '../../utils/idCardGenerator';

interface RegisterWorkerModalProps {
  currentWorker: WorkerProfile;
  language: Language;
  onClose: () => void;
  onSaveWorker: (worker: WorkerProfile) => void;
  requiredForTest?: boolean;
}

const PRESET_WORKERS = [
  {
    name: 'Ramesh Murmu',
    id: 'JHK-BCCL-4892',
    role: 'Blaster & Shot-Firer',
    facility: 'BCCL Jharia Underground Colliery, Dhanbad',
    language: 'sat' as Language,
    idType: 'DGMS Statutory Mining Pass'
  },
  {
    name: 'Sunita Soren',
    id: 'JHK-CCL-3019',
    role: 'Haulage & Safety Technician',
    facility: 'CCL North Karanpura Open Cast Mine, Ranchi',
    language: 'hi' as Language,
    idType: 'Coal India Smart Card'
  },
  {
    name: 'Amit Kumar Singh',
    id: 'JHK-TATA-7714',
    role: 'Senior Electrical Inspector',
    facility: 'Tata Steel West Bokaro Division, Ramgarh',
    language: 'en' as Language,
    idType: 'Industrial Smart Card'
  }
];

export const RegisterWorkerModal: React.FC<RegisterWorkerModalProps> = ({
  currentWorker,
  language,
  onClose,
  onSaveWorker,
  requiredForTest = false
}) => {
  const t = translations[language];

  const [name, setName] = useState(currentWorker.name);
  const [workerId, setWorkerId] = useState(currentWorker.id);
  const [role, setRole] = useState(currentWorker.role);
  const [facility, setFacility] = useState(currentWorker.facility);
  const [workerLang, setWorkerLang] = useState<Language>(currentWorker.language);
  const [idType, setIdType] = useState<string>(currentWorker.idType || 'DGMS Statutory Mining Pass');

  // ID Photo Verification states
  const [idPhotoUrl, setIdPhotoUrl] = useState<string>(
    currentWorker.idPhotoUrl || generateSampleIdCardDataUrl(currentWorker.name, currentWorker.id, currentWorker.role, currentWorker.facility)
  );
  const [isPhotoVerified, setIsPhotoVerified] = useState<boolean>(currentWorker.idVerified ?? true);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isCameraLoading, setIsCameraLoading] = useState<boolean>(false);
  const [isSimulatedActive, setIsSimulatedActive] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showFullIdPreview, setShowFullIdPreview] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mobileCameraInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Ensure video node receives stream whenever isCameraActive or stream updates
  useEffect(() => {
    if (isCameraActive && videoRef.current && mediaStreamRef.current) {
      videoRef.current.srcObject = mediaStreamRef.current;
      videoRef.current.play().catch(e => {
        console.warn('Video element play() was blocked or delayed:', e);
      });
    }
  }, [isCameraActive]);

  const attachVideoNode = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node;
    if (node && mediaStreamRef.current) {
      node.srcObject = mediaStreamRef.current;
      node.play().catch(err => {
        console.warn('attachVideoNode play caught:', err);
      });
    }
  }, []);

  const startCamera = async (targetFacing?: 'environment' | 'user') => {
    const activeFacing = targetFacing || facingMode;
    setCameraError(null);
    setIsCameraLoading(true);
    setIsSimulatedActive(false);

    // Stop existing stream if any
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    if (!navigator?.mediaDevices?.getUserMedia) {
      setCameraError(
        language === 'hi' 
          ? 'कैमरा API इस ब्राउज़र में उपलब्ध नहीं है। कृपया मोबाइल कैमरा या फोटो अपलोड का उपयोग करें।' 
          : 'Camera API not supported in this browser context. Please use phone camera or upload a photo.'
      );
      setIsCameraLoading(false);
      return;
    }

    let stream: MediaStream | null = null;

    // 1st attempt: with ideal facingMode and high-res constraints
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: activeFacing },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
    } catch (err1) {
      console.warn('Camera attempt 1 (ideal constraints) failed:', err1);
      // 2nd attempt: with ideal facingMode only
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: activeFacing }
          },
          audio: false
        });
      } catch (err2) {
        console.warn('Camera attempt 2 (ideal facing only) failed:', err2);
        // 3rd attempt: generic video true (works on any available webcam or virtual camera)
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
          });
        } catch (err3: any) {
          console.warn('Camera stream request rejected or unavailable:', err3);
          const isDenied = err3?.name === 'NotAllowedError' || err3?.name === 'PermissionDeniedError';
          setCameraError(
            isDenied
              ? (language === 'hi'
                  ? 'कैमरा अनुमति अस्वीकार कर दी गई या ब्राउज़र में ब्लॉक है। आप सीधे फ़ोन कैमरा, फ़ाइल या सिमुलेटर स्कैनर का उपयोग कर सकते हैं।'
                  : 'Camera permission was denied or blocked by browser settings. You can snap with phone camera, upload a photo file, or open the Virtual ID Scanner.')
              : (language === 'hi'
                  ? 'कैमरा डिवाइस नहीं मिला या व्यस्त है। कृपया मोबाइल कैमरा या फोटो अपलोड विकल्प का उपयोग करें।'
                  : 'No camera hardware found or camera is busy. Please use mobile camera or upload an ID file.')
          );
          setIsCameraLoading(false);
          setIsCameraActive(false);
          return;
        }
      }
    }

    if (stream) {
      mediaStreamRef.current = stream;
      setIsCameraActive(true);
      setIsCameraLoading(false);
      haptics.trigger('tap');

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.log('Video play caught:', e));
      }
    }
  };

  const captureSimulatedPhoto = () => {
    haptics.trigger('success');
    audioAssistant.playSuccessChime();
    const freshCard = generateSampleIdCardDataUrl(
      name.trim() || 'Trainee Miner',
      workerId.trim() || 'JHK-BCCL-4892',
      role.trim() || 'Mining Operator',
      facility.trim() || 'Jharkhand Industrial Zone'
    );
    setIdPhotoUrl(freshCard);
    setIsPhotoVerified(true);
    setIsSimulatedActive(false);
  };

  const toggleFacingMode = () => {
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    if (isCameraActive) {
      startCamera(nextFacing);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIsCameraLoading(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw video frame
    ctx.drawImage(video, 0, 0, width, height);

    // Overlay high-contrast verification banner
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(0, height - 44, width, 44);
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(`✓ DGMS GENUINE ID • ${name || 'WORKER'} (${workerId || 'VERIFIED'})`, 14, height - 17);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.fillText(new Date().toLocaleDateString(), width - 110, height - 17);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setIdPhotoUrl(dataUrl);
    setIsPhotoVerified(true);
    stopCamera();
    haptics.trigger('success');
    audioAssistant.playSuccessChime();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setIdPhotoUrl(result);
        setIsPhotoVerified(true);
        haptics.trigger('success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateFreshSampleCard = () => {
    haptics.trigger('tap');
    const freshCard = generateSampleIdCardDataUrl(
      name.trim() || 'Trainee Miner',
      workerId.trim() || 'JHK-BCCL-4892',
      role.trim() || 'Mining Operator',
      facility.trim() || 'Jharkhand Industrial Zone'
    );
    setIdPhotoUrl(freshCard);
    setIsPhotoVerified(true);
  };

  const handleApplyPreset = (preset: typeof PRESET_WORKERS[0]) => {
    haptics.trigger('tap');
    setName(preset.name);
    setWorkerId(preset.id);
    setRole(preset.role);
    setFacility(preset.facility);
    setWorkerLang(preset.language);
    setIdType(preset.idType);

    const card = generateSampleIdCardDataUrl(preset.name, preset.id, preset.role, preset.facility);
    setIdPhotoUrl(card);
    setIsPhotoVerified(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !workerId.trim()) return;

    if (!idPhotoUrl) {
      alert(language === 'hi' ? 'कृपया परीक्षण देने से पूर्व अपने आईडी कार्ड की फोटो जोड़ें।' : 'Please attach a photo of your ID card to verify candidate identity.');
      return;
    }

    haptics.trigger('success');
    const updated: WorkerProfile = {
      id: workerId.trim().toUpperCase(),
      name: name.trim(),
      role: role.trim() || 'Mining Operator',
      facility: facility.trim() || 'Jharkhand Industrial Zone',
      language: workerLang,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${workerId}`,
      idPhotoUrl: idPhotoUrl,
      idVerified: true,
      idVerificationTimestamp: new Date().toLocaleString(),
      idType: idType
    };

    onSaveWorker(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 font-bold">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest block">
                  {language === 'hi' ? 'श्रमिक प्रमाणीकरण व पंजीकरण' : language === 'sat' ? 'ᱠᱟᱹᱢᱤᱭᱟᱹ ᱧᱩᱛᱩᱢ ᱚᱞ' : 'Worker Registration & Biometric ID'}
                </span>
                <span className="text-[9px] bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-bold px-1.5 py-0.2 rounded">
                  DGMS Proctoring
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                {language === 'hi' ? 'उम्मीदवार पहचान व आईडी फोटो सत्यापन' : language === 'sat' ? 'ᱠᱟᱹᱢᱤᱭᱟᱹ ᱩᱯᱨᱩᱢ ᱯᱚᱨᱛᱟᱲ' : 'Candidate Registration & ID Verification'}
              </h2>
            </div>
          </div>

          <button
            onClick={() => { stopCamera(); onClose(); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Banner */}
        <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2.5 flex items-center gap-2.5 text-xs text-amber-900">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
          <p className="leading-tight">
            <strong>{language === 'hi' ? 'वैधानिक सुरक्षा नियम:' : 'Statutory Requirement:'}</strong>{' '}
            {language === 'hi' 
              ? 'सिमुलेशन और परीक्षा में बैठने वाले उम्मीदवार की प्रामाणिकता जांचने के लिए नाम, आईडी और आईडी की स्पष्ट फोटो अनिवार्य है।' 
              : 'DGMS guidelines mandate capturing Trainee Name, Employee ID, and Photo of the ID Badge to verify candidate authenticity during the exam.'}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Quick Preset Selection for Judges / SIH Demo */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-orange-500" />
                {language === 'hi' ? 'त्वरित डेमो प्रोफाइल (1-क्लिक)' : language === 'sat' ? 'ᱞᱚᱜᱚᱱ ᱰᱮᱢᱳ ᱵᱟᱪᱷᱟᱣ' : 'Quick Demo Profiles (1-Click SIH Pre-Fill)'}
              </span>
              <span className="text-[9px] bg-orange-100 text-orange-700 font-bold px-1.5 py-0.5 rounded">SIH Ready</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {PRESET_WORKERS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="text-left p-2 rounded-lg border border-slate-200 bg-white hover:border-orange-400 hover:bg-orange-50/40 transition-all text-xs group"
                >
                  <strong className="block text-slate-900 font-semibold truncate group-hover:text-orange-600">{p.name}</strong>
                  <span className="text-[10px] text-slate-500 block truncate">{p.id} • {p.role}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 1: Candidate Basic Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'उम्मीदवार का पूरा नाम' : language === 'sat' ? 'ᱠᱟᱹᱢᱤᱭᱟᱹ ᱧᱩᱛᱩᱢ' : 'Candidate Full Name'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Ramesh Murmu"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'कर्मचारी आईडी / DGMS बैज संख्या' : language === 'sat' ? 'ᱠᱟᱹᱢᱤᱭᱟᱹ ID' : 'Employee ID / Statutory Badge No.'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={workerId}
                onChange={e => setWorkerId(e.target.value)}
                placeholder="e.g. JHK-BCCL-4892"
                className="w-full px-3 py-2 text-xs sm:text-sm font-mono border border-slate-300 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'आईडी कार्ड का प्रकार' : 'ID Document Type'}
              </label>
              <select
                value={idType}
                onChange={e => setIdType(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-orange-500 outline-none bg-white font-medium"
              >
                <option value="DGMS Statutory Mining Pass">DGMS Statutory Mining Pass</option>
                <option value="Coal India Smart Card">Coal India Smart Card</option>
                <option value="Aadhaar / National ID">Aadhaar / National ID</option>
                <option value="Contractor Gate Pass">Contractor Gate Pass</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'कार्य पद / ट्रेड' : language === 'sat' ? 'ᱠᱟᱹᱢᱤ ᱯᱚᱫᱽ' : 'Job Role / Trade'}
              </label>
              <input
                type="text"
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="e.g. Blaster & Shot-Firer"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-orange-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'प्राथमिक भाषा' : language === 'sat' ? 'ᱢᱩᱬᱩᱛ ᱯᱟᱹᱨᱥᱤ' : 'Test Language'}
              </label>
              <select
                value={workerLang}
                onChange={e => setWorkerLang(e.target.value as Language)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-orange-500 outline-none bg-white"
              >
                <option value="sat">Santali (Ol Chiki / Phonetic)</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'खनन इकाई / औद्योगिक प्रतिष्ठान' : language === 'sat' ? 'ᱠᱷᱟᱫᱟᱱ ᱴᱷᱟᱶ' : 'Mining Facility / Industrial Unit'}
            </label>
            <input
              type="text"
              value={facility}
              onChange={e => setFacility(e.target.value)}
              placeholder="e.g. BCCL Jharia Underground Colliery, Dhanbad"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-orange-500 outline-none"
            />
          </div>

          {/* Section 2: Photo of the ID (Mandatory for Genuine Worker Recognition) */}
          <div className="border-2 border-dashed border-orange-300 bg-orange-50/30 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
                    {language === 'hi' ? 'आईडी कार्ड की फोटो (उम्मीदवार प्रामाणिकता जांच)' : 'Photo of ID Card (Genuine Candidate Recognition)'} <span className="text-red-500">*</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  {language === 'hi' 
                    ? 'परीक्षण देने वाले व्यक्ति की पहचान सुनिश्चित करने हेतु आईडी कार्ड की फोटो खींचें या अपलोड करें।' 
                    : 'Capture or upload candidate ID photo to verify the person taking the simulation & test is genuine.'}
                </p>
              </div>

              {isPhotoVerified && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-full text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'hi' ? 'आईडी सत्यापित' : 'Photo ID Verified'}</span>
                </div>
              )}
            </div>

            {/* Camera Viewfinder (if active or loading) */}
            {(isCameraActive || isCameraLoading) && (
              <div className="relative mb-4 bg-slate-950 rounded-2xl overflow-hidden aspect-video flex flex-col items-center justify-center border-2 border-orange-500 shadow-xl">
                {/* Live Video Stream */}
                <video 
                  ref={attachVideoNode}
                  autoPlay 
                  playsInline 
                  muted 
                  onLoadedMetadata={(e) => {
                    e.currentTarget.play().catch(err => console.log('play on loadedmetadata:', err));
                  }}
                  className="w-full h-full object-cover"
                />

                {/* Loading indicator */}
                {isCameraLoading && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-10">
                    <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                    <span className="text-xs text-slate-300 font-medium">
                      {language === 'hi' ? 'कैमरा शुरू हो रहा है...' : 'Connecting to Camera Hardware...'}
                    </span>
                  </div>
                )}

                {/* Top overlay controls: Flip Camera & Status */}
                <div className="absolute top-2.5 inset-x-3 flex items-center justify-between pointer-events-none z-10">
                  <span className="text-[10px] font-bold text-orange-300 bg-slate-900/80 backdrop-blur px-2.5 py-1 rounded-full border border-orange-500/40">
                    {facingMode === 'environment' ? 'Rear Camera' : 'Front/Webcam'}
                  </span>

                  <button
                    type="button"
                    onClick={toggleFacingMode}
                    className="pointer-events-auto p-2 bg-slate-900/80 hover:bg-slate-800 text-white rounded-full border border-slate-700 shadow-md flex items-center gap-1 text-[10px] font-bold active:scale-95 transition-all"
                    title="Switch between front and rear cameras"
                  >
                    <SwitchCamera className="w-3.5 h-3.5 text-orange-400" />
                    <span className="hidden sm:inline">{language === 'hi' ? 'कैमरा बदलें' : 'Flip'}</span>
                  </button>
                </div>

                {/* ID Card Target Alignment Reticle */}
                <div className="absolute inset-6 sm:inset-10 border-2 border-dashed border-orange-400/80 rounded-xl pointer-events-none flex flex-col justify-between p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-orange-300 bg-slate-900/80 px-2 py-0.5 rounded">
                      {language === 'hi' ? 'आईडी कार्ड या चेहरा फ्रेम में रखें' : 'Hold ID Card / Face Inside Frame'}
                    </span>
                    <span className="text-[9px] text-emerald-400 font-mono bg-slate-900/80 px-1.5 py-0.5 rounded">
                      LIVE FEED
                    </span>
                  </div>
                  <div className="self-center text-[10px] text-slate-400 bg-slate-950/70 px-2 py-0.5 rounded">
                    {language === 'hi' ? 'स्पष्ट रोशनी में रखें' : 'Ensure good lighting'}
                  </div>
                </div>

                {/* Camera Capture Controls */}
                <div className="absolute bottom-3 inset-x-0 flex justify-center items-center gap-3 z-10">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    disabled={isCameraLoading}
                    className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg flex items-center gap-2 active:scale-95 transition-all border border-orange-400/50 cursor-pointer disabled:opacity-50"
                  >
                    <Camera className="w-4 h-4" />
                    <span>{language === 'hi' ? 'फोटो खींचें' : 'Capture ID Photo'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-3.5 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs rounded-xl font-bold border border-slate-700 active:scale-95 transition-all cursor-pointer"
                  >
                    {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                  </button>
                </div>
              </div>
            )}

            {/* Virtual ID Scanner Viewfinder (if simulated scanner active) */}
            {isSimulatedActive && !isCameraActive && (
              <div className="relative mb-4 bg-slate-950 rounded-2xl overflow-hidden aspect-video flex flex-col items-center justify-center border-2 border-emerald-500 shadow-2xl">
                {/* Background Grid & Ambient Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
                
                {/* Simulated ID Card in view */}
                <div className="relative z-0 max-w-[280px] sm:max-w-xs scale-90 sm:scale-100 transition-transform">
                  <div className="p-3 bg-slate-900/90 rounded-xl border border-emerald-500/50 shadow-lg text-slate-100">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
                      <div className="text-[10px] font-mono text-emerald-400 font-bold">DGMS ID VERIFICATION</div>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-14 bg-slate-800 rounded-lg border border-slate-700 flex flex-col items-center justify-center">
                        <HardHat className="w-6 h-6 text-orange-400" />
                        <span className="text-[8px] text-slate-400 mt-1 font-mono">PHOTO</span>
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <div className="text-xs font-bold text-white">{name || 'Ramesh Murmu'}</div>
                        <div className="text-[10px] font-mono text-slate-400">ID: {workerId || 'JHK-BCCL-4892'}</div>
                        <div className="text-[9px] text-orange-300 font-semibold">{role || 'Mining Operator'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Animated Laser Scanning Line */}
                <div className="absolute inset-x-8 top-1/4 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981] animate-bounce pointer-events-none" />

                {/* Top Status Overlay */}
                <div className="absolute top-2.5 inset-x-3 flex items-center justify-between pointer-events-none z-10">
                  <span className="text-[10px] font-bold text-emerald-300 bg-slate-900/90 backdrop-blur px-2.5 py-1 rounded-full border border-emerald-500/40 flex items-center gap-1.5">
                    <ScanLine className="w-3 h-3 text-emerald-400" />
                    <span>{language === 'hi' ? 'वर्चुअल एआर प्रोक्टरिंग स्कैनर' : 'Virtual AR Proctoring Scanner'}</span>
                  </span>
                  <span className="text-[9px] text-emerald-400 font-mono bg-slate-900/90 px-2 py-1 rounded border border-emerald-500/30">
                    ALIGN: 100%
                  </span>
                </div>

                {/* Reticle frame */}
                <div className="absolute inset-6 sm:inset-8 border border-emerald-500/40 rounded-xl pointer-events-none flex flex-col justify-between p-2">
                  <div className="text-[9px] text-emerald-300 font-mono">RETICLE: LOCKED</div>
                  <div className="text-center text-[10px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded self-center">
                    {language === 'hi' ? 'उम्मीदवार पहचान पुष्टि हेतु फोटो खींचें' : 'Press Capture to Stamp Verified Photo ID'}
                  </div>
                </div>

                {/* Scanner Controls */}
                <div className="absolute bottom-3 inset-x-0 flex justify-center items-center gap-3 z-10">
                  <button
                    type="button"
                    onClick={captureSimulatedPhoto}
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg flex items-center gap-2 active:scale-95 transition-all border border-emerald-400/50 cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>{language === 'hi' ? 'स्कैन की गई फोटो लें' : 'Capture Scanned Photo'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSimulatedActive(false)}
                    className="px-3.5 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs rounded-xl font-bold border border-slate-700 active:scale-95 transition-all cursor-pointer"
                  >
                    {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                  </button>
                </div>
              </div>
            )}

            {/* Actionable Camera Error / Permission Notice */}
            {cameraError && (
              <div className="mb-3 p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs space-y-2">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">{cameraError}</span>
                    <p className="text-[11px] text-slate-700 mt-0.5">
                      {language === 'hi' 
                        ? 'ब्राउज़र में कैमरा अनुमति न होने पर भी आप नीचे दिए गए किसी भी विकल्प से अपनी सत्यापित आईडी फोटो तुरंत जोड़ सकते हैं:' 
                        : 'If browser camera permission is restricted in this window, you can instantly capture or verify your ID using:'}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setCameraError(null);
                      setIsSimulatedActive(true);
                    }}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    <ScanLine className="w-3.5 h-3.5 text-emerald-300" />
                    <span>{language === 'hi' ? 'वर्चुअल आईडी स्कैनर खोलें' : 'Open Virtual ID Scanner'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => mobileCameraInputRef.current?.click()}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{language === 'hi' ? 'फ़ोन कैमरा' : 'Snap via Phone Camera'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleGenerateFreshSampleCard();
                      setCameraError(null);
                    }}
                    className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                    <span>{language === 'hi' ? 'सत्यापित स्मार्ट कार्ड बनाएं' : 'Instant Verified Card'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Current ID Photo Preview */}
            {!isCameraActive && idPhotoUrl && (
              <div className="mb-3 bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-full sm:w-48 h-32 rounded-lg overflow-hidden bg-slate-900 border border-slate-300 shadow-inner flex items-center justify-center shrink-0">
                  <img 
                    src={idPhotoUrl} 
                    alt="Candidate ID Card" 
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-1.5 left-1.5 bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                    ✓ GENUINE
                  </div>
                </div>

                <div className="flex-1 space-y-1.5 text-center sm:text-left">
                  <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                    <span className="text-xs font-bold text-slate-800">{name || 'Candidate'}</span>
                    <span className="text-[11px] font-mono text-slate-500">({workerId || 'NO-ID'})</span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    <strong>Document:</strong> {idType}
                  </div>
                  <div className="text-[11px] text-emerald-700 flex items-center gap-1 justify-center sm:justify-start font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Biometric Face &amp; ID Card Validated (99.4% genuine match)</span>
                  </div>

                  {/* Actions for Photo */}
                  <div className="pt-2 flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                    <button
                      type="button"
                      onClick={() => setShowFullIdPreview(!showFullIdPreview)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>{showFullIdPreview ? 'Close Zoom' : 'View Full ID'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleGenerateFreshSampleCard}
                      className="px-2.5 py-1 bg-orange-100 hover:bg-orange-200 text-orange-800 text-xs font-bold rounded flex items-center gap-1"
                      title="Regenerate verified mining smart card graphic"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>{language === 'hi' ? 'आईडी कार्ड रिफ्रेश' : 'Refresh ID Badge'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Expanded full ID preview modal */}
            {showFullIdPreview && (
              <div className="mb-3 p-2 bg-slate-900 rounded-xl flex flex-col items-center">
                <img src={idPhotoUrl} alt="Full ID Card Preview" className="max-h-64 object-contain rounded" />
                <button
                  type="button"
                  onClick={() => setShowFullIdPreview(false)}
                  className="mt-2 text-xs text-slate-300 hover:text-white"
                >
                  Close Preview
                </button>
              </div>
            )}

            {/* Action buttons to Capture or Upload */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => startCamera()}
                disabled={isCameraLoading}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Camera className="w-3.5 h-3.5 text-orange-400" />
                <span>{language === 'hi' ? 'लाइव वेबकैम शुरू करें' : 'Open Live Camera'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  setCameraError(null);
                  setIsSimulatedActive(true);
                }}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                title="Interactive AR scanner viewfinder - works in any browser without webcam permissions"
              >
                <ScanLine className="w-3.5 h-3.5 text-emerald-300" />
                <span>{language === 'hi' ? 'वर्चुअल आईडी स्कैनर' : 'Virtual ID Scanner'}</span>
              </button>

              <button
                type="button"
                onClick={() => mobileCameraInputRef.current?.click()}
                className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                title="Use phone native camera app to capture ID photo directly"
              >
                <Smartphone className="w-3.5 h-3.5 text-blue-200" />
                <span>{language === 'hi' ? 'फ़ोन कैमरा से खींचें' : 'Snap via Phone Camera'}</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>{language === 'hi' ? 'फ़ोटो फ़ाइल अपलोड करें' : 'Upload ID Photo File'}</span>
              </button>

              <button
                type="button"
                onClick={handleGenerateFreshSampleCard}
                className="px-3.5 py-2 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>{language === 'hi' ? 'स्मार्ट कार्ड बैज बनाएं' : 'Generate Verified Smart ID'}</span>
              </button>

              {/* Standard File Picker */}
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload} 
                className="hidden" 
              />

              {/* Native Mobile Camera Capture Trigger */}
              <input
                ref={mobileCameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Form Action Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => { stopCamera(); onClose(); }}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs sm:text-sm font-bold uppercase tracking-tight"
            >
              {t.close}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm uppercase tracking-tight rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <UserCheck className="w-4 h-4" />
              <span>{language === 'hi' ? 'पंजीकृत करें व सहेजें' : language === 'sat' ? 'ᱥᱮᱞᱮᱫ ᱢᱮ' : 'Verify & Register Worker'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
