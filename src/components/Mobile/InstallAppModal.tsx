import React, { useState, useEffect } from 'react';
import { 
  Download, Smartphone, Share, PlusSquare, 
  CheckCircle2, X, Shield, Sparkles, Monitor
} from 'lucide-react';
import { Language } from '../../types';
import { pwaManager } from '../../utils/pwaManager';
import { haptics } from '../../utils/haptics';

interface InstallAppModalProps {
  language?: Language;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ language = 'en', onClose }) => {
  const [isInstallable, setIsInstallable] = useState<boolean>(pwaManager.getIsInstallable());
  const [isStandalone, setIsStandalone] = useState<boolean>(pwaManager.getIsStandalone());
  const [installSuccess, setInstallSuccess] = useState<boolean>(false);

  useEffect(() => {
    const unsub = pwaManager.subscribe(() => {
      setIsInstallable(pwaManager.getIsInstallable());
      setIsStandalone(pwaManager.getIsStandalone());
    });
    return unsub;
  }, []);

  const handleInstallClick = async () => {
    haptics.trigger('tap');
    const outcome = await pwaManager.promptInstall();
    if (outcome === 'accepted') {
      haptics.trigger('success');
      setInstallSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 w-full max-w-md rounded shadow-2xl overflow-hidden my-auto flex flex-col">
        {/* Header */}
        <div className="bg-[#0F172A] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-orange-500 flex items-center justify-center text-white font-bold shadow-sm">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest block">
                {language === 'sat' ? 'PWA ᱢᱳᱵᱟᱭᱤᱞ ᱮᱯ' : language === 'hi' ? 'PWA मोबाइल एप्लिकेशन' : 'PWA MOBILE APPLICATION'}
              </span>
              <h2 className="text-base font-bold text-white leading-tight">
                {language === 'sat' ? 'Suraksha AR ᱤᱱᱥᱴᱚᱞ ᱢᱮ' : language === 'hi' ? 'सुरक्षा AR इंस्टॉल करें' : 'Install Suraksha AR'}
              </h2>
            </div>
          </div>

          <button
            onClick={() => { haptics.trigger('tap'); onClose(); }}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 bg-slate-50/50">
          {installSuccess || isStandalone ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 rounded-full bg-green-50 text-green-600 border-2 border-green-500 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {language === 'sat' ? 'ᱮᱯ ᱤᱱᱥᱴᱚᱞ ᱮᱱᱟ ᱟᱨ ᱚᱯᱷᱞᱟᱭᱤᱱ ᱨᱮᱰᱤ!' : language === 'hi' ? 'एप्लिकेशन इंस्टॉल हो गया और ऑफलाइन तैयार है!' : 'Application Installed & Offline Ready!'}
              </h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                {language === 'sat'
                  ? 'Suraksha AR ᱱᱤᱛᱚᱜ ᱟᱢᱟᱜ ᱢᱳᱵᱟᱭᱤᱞ ᱦᱳᱢ ᱥᱠᱨᱤᱱ ᱠᱷᱚᱱ ᱪᱟᱹᱞᱩ ᱜᱟᱱᱚᱜ-ᱟ᱾ ᱤᱱᱴᱟᱨᱱᱮᱴ ᱵᱮᱜᱚᱨ ᱥᱟᱱᱟᱢ ᱢᱳᱰᱩᱞ ᱠᱟᱹᱢᱤᱭᱟ᱾'
                  : language === 'hi'
                  ? 'सुरक्षा AR अब आपकी मोबाइल होम स्क्रीन पर उपलब्ध है। बिना इंटरनेट कनेक्शन के सभी मॉड्यूल सुचारू रूप से काम करेंगे।'
                  : 'Suraksha AR is now accessible right from your mobile home screen. All modules will work seamlessly with zero internet connection.'}
              </p>
            </div>
          ) : (
            <>
              {/* Value Props */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded shadow-sm">
                  <div className="w-7 h-7 rounded bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {language === 'sat' ? '100% ᱚᱯᱷᱞᱟᱭᱤᱱ ᱫᱟᱲᱮ' : language === 'hi' ? '100% ऑफलाइन क्षमता' : '100% Offline Capability'}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {language === 'sat' ? 'ᱠᱩᱭᱞᱟᱹ ᱠᱷᱟᱫᱟᱱ ᱟᱨ ᱥᱩᱨ-ᱥᱩᱯᱩᱨ ᱴᱚᱴᱷᱟ ᱨᱮ ᱱᱮᱴᱣᱚᱨᱠ ᱵᱮᱜᱚᱨ ᱪᱟᱞᱟᱣ ᱢᱮ᱾' : language === 'hi' ? 'गहरी कोयला खदानों और दूरदराज के क्षेत्रों में बिना मोबाइल नेटवर्क के उपयोग करें।' : 'Operate in deep coal mines, tunnels and remote plants without cellular network.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded shadow-sm">
                  <div className="w-7 h-7 rounded bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {language === 'sat' ? 'ᱞᱚᱜᱚᱱ AR ᱠᱮᱢᱮᱨᱟ ᱴᱨᱮᱠᱤᱝ' : language === 'hi' ? 'तेज AR कैमरा व स्थान ट्रैकिंग' : 'Fast AR Camera & Spatial Tracking'}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {language === 'sat' ? 'ᱢᱳᱵᱟᱭᱤᱞ ᱦᱟᱨᱰᱣᱮᱭᱟᱨ ᱠᱮᱢᱮᱨᱟ ᱛᱮ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱵᱤᱰᱟᱹᱣ ᱢᱮ᱾' : language === 'hi' ? 'स्थानिक खतरे की जांच के साथ सहज मोबाइल हार्डवेयर कैमरा अनुभव।' : 'Native mobile hardware camera performance with spatial hazard inspection.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Install Methods */}
              {isInstallable ? (
                <div className="pt-2">
                  <button
                    id="btn-confirm-pwa-install"
                    onClick={handleInstallClick}
                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded font-bold text-sm uppercase tracking-tight flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>{language === 'sat' ? 'ᱰᱤᱵᱷᱟᱭᱤᱥ ᱨᱮ ᱮᱯ ᱤᱱᱥᱴᱚᱞ ᱢᱮ' : language === 'hi' ? 'डिवाइस पर ऐप इंस्टॉल करें' : 'Install App on Device'}</span>
                  </button>
                </div>
              ) : isIOS ? (
                <div className="bg-white border border-slate-200 p-4 rounded text-xs space-y-2 shadow-sm">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    {language === 'sat' ? 'iPhone / iPad ᱨᱮ ᱪᱮᱫᱞᱮᱠᱟ ᱤᱱᱥᱴᱚᱞ ᱦᱩᱭᱩᱜ-ᱟ:' : language === 'hi' ? 'iPhone व iPad पर कैसे इंस्टॉल करें:' : 'How to install on iPhone & iPad:'}
                  </h4>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-600 font-medium">
                    <li className="flex items-center gap-1.5">
                      <span>1. Safari ᱨᱮ</span>
                      <Share className="w-3.5 h-3.5 text-blue-600 inline" />
                      <span className="font-bold">Share</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span>2. ᱞᱟᱛᱟᱨ ᱥᱮᱱ ᱪᱟᱞᱟᱣ ᱠᱟᱛᱮ</span>
                      <PlusSquare className="w-3.5 h-3.5 text-slate-700 inline" />
                      <span className="font-bold">"Add to Home Screen"</span>
                    </li>
                    <li>3. <strong>"Add"</strong> ᱚᱛᱟᱭ ᱢᱮ</li>
                  </ol>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 p-4 rounded text-xs space-y-2 shadow-sm">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    {language === 'sat' ? 'Android / Chrome ᱨᱮ ᱪᱮᱫᱞᱮᱠᱟ ᱤᱱᱥᱴᱚᱞ ᱦᱩᱭᱩᱜ-ᱟ:' : language === 'hi' ? 'Android / Chrome पर कैसे इंस्टॉल करें:' : 'How to install on Android / Chrome:'}
                  </h4>
                  <p className="text-slate-600 text-[11px]">
                    {language === 'sat' 
                      ? 'ᱵᱨᱟᱣᱩᱡᱟᱨ ᱨᱮᱱᱟᱜ ᱪᱮᱛᱟᱱ ᱨᱮ (⋮) ᱚᱛᱟ ᱠᱟᱛᱮ "Install app" ᱵᱟᱝᱠᱷᱟᱱ "Add to Home Screen" ᱵᱟᱪᱷᱟᱣ ᱢᱮ᱾'
                      : language === 'hi'
                      ? 'ब्राउज़र के मेनू (ऊपर दाईं ओर तीन बिंदु ⋮) पर टैप करें, फिर "ऐप इंस्टॉल करें" या "होम स्क्रीन पर जोड़ें" चुनें।'
                      : 'Tap your browser\'s menu (three dots ⋮ in the top right), then select "Install app" or "Add to Home Screen".'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white p-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => { haptics.trigger('tap'); onClose(); }}
            className="px-4 py-1.5 rounded border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold uppercase tracking-tight transition-colors"
          >
            {language === 'sat' ? 'ᱵᱚᱸᱫᱽ' : language === 'hi' ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
