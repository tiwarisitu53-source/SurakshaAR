import React from 'react';
import { Layers, Award, BarChart3, Bot, Camera, Shield } from 'lucide-react';
import { Language } from '../../types';
import { translations } from '../../data/translations';
import { haptics } from '../../utils/haptics';

interface MobileBottomNavProps {
  activeTab: 'training' | 'certificates' | 'admin';
  language: Language;
  onSelectTab: (tab: 'training' | 'certificates' | 'admin') => void;
  onOpenAICoach: () => void;
  onQuickARLaunch: () => void;
  certCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  language,
  onSelectTab,
  onOpenAICoach,
  onQuickARLaunch,
  certCount
}) => {
  const t = translations[language];

  const handleTabClick = (tab: 'training' | 'certificates' | 'admin') => {
    haptics.trigger('tap');
    onSelectTab(tab);
  };

  const handleCoachClick = () => {
    haptics.trigger('tap');
    onOpenAICoach();
  };

  const handleARClick = () => {
    haptics.trigger('step');
    onQuickARLaunch();
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0F172A] border-t border-slate-700/80 px-2 py-1.5 backdrop-blur-lg pb-safe">
      <div className="flex items-center justify-around max-w-md mx-auto relative">
        {/* 1. Modules Tab */}
        <button
          id="mobile-nav-modules"
          onClick={() => handleTabClick('training')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded transition-all ${
            activeTab === 'training'
              ? 'text-orange-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Layers className="w-5 h-5" />
            {activeTab === 'training' && (
              <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-orange-400 rounded-full" />
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight mt-0.5">
            {language === 'hi' ? 'मॉड्यूल' : language === 'sat' ? 'ᱴᱨᱮᱱᱤᱝ' : 'Modules'}
          </span>
        </button>

        {/* 2. Certificates / Wallet Tab */}
        <button
          id="mobile-nav-wallet"
          onClick={() => handleTabClick('certificates')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded transition-all relative ${
            activeTab === 'certificates'
              ? 'text-orange-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Award className="w-5 h-5" />
            {certCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {certCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight mt-0.5">
            {language === 'hi' ? 'प्रमाणपत्र' : language === 'sat' ? 'ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ' : 'Wallet'}
          </span>
        </button>

        {/* 3. Center Floating AR Camera Action Button */}
        <div className="relative -top-3">
          <button
            id="mobile-nav-quick-ar"
            onClick={handleARClick}
            className="w-12 h-12 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30 border-2 border-[#0F172A] transition-all"
            title="Launch AR Hazard Camera"
          >
            <Camera className="w-6 h-6" />
          </button>
          <span className="text-[9px] font-bold text-orange-400 block text-center mt-0.5 tracking-tighter">
            AR CAM
          </span>
        </div>

        {/* 4. Compliance Admin Tab */}
        <button
          id="mobile-nav-compliance"
          onClick={() => handleTabClick('admin')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded transition-all ${
            activeTab === 'admin'
              ? 'text-orange-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <BarChart3 className="w-5 h-5" />
            {activeTab === 'admin' && (
              <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-orange-400 rounded-full" />
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight mt-0.5">
            {language === 'hi' ? 'निरीक्षण' : language === 'sat' ? 'ᱞᱮᱡᱟᱨ' : 'Ledger'}
          </span>
        </button>

        {/* 5. AI Voice Safety Coach Tab */}
        <button
          id="mobile-nav-coach"
          onClick={handleCoachClick}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded text-slate-400 hover:text-orange-400 transition-all"
        >
          <Bot className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-tight mt-0.5">
            {language === 'hi' ? 'AI कोच' : language === 'sat' ? 'AI ᱜᱚᱜᱚᱲᱚ' : 'AI Coach'}
          </span>
        </button>
      </div>
    </div>
  );
};
