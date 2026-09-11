import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Square, Play, Sparkles, Bot, HelpCircle, FastForward, CheckCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { AssessmentQuestion, Language } from '../../types';
import { audioAssistant } from '../../utils/audioAssistant';
import { translations } from '../../data/translations';

interface AIVoiceCoachWidgetProps {
  currentQuestion?: AssessmentQuestion;
  language: Language;
  onExplainRequest?: () => void;
  autoReadDefault?: boolean;
  moduleTitle?: string;
}

export const AIVoiceCoachWidget: React.FC<AIVoiceCoachWidgetProps> = ({
  currentQuestion,
  language,
  onExplainRequest,
  autoReadDefault = true,
  moduleTitle = 'Industrial Safety Module'
}) => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [currentSpokenText, setCurrentSpokenText] = useState<string>('');
  const [autoRead, setAutoRead] = useState<boolean>(autoReadDefault);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [explainingLoading, setExplainingLoading] = useState<boolean>(false);

  const t = translations[language];

  // Subscribe to speech state changes
  useEffect(() => {
    const unsubscribe = audioAssistant.subscribe((speaking, text) => {
      setIsSpeaking(speaking);
      if (text) setCurrentSpokenText(text);
    });
    return () => unsubscribe();
  }, []);

  // Auto-read question on question index/content change if enabled
  useEffect(() => {
    if (!currentQuestion) return;
    setAiExplanation(null);

    if (autoRead && !audioAssistant.getIsMuted()) {
      // Small timeout to allow transition
      const timer = setTimeout(() => {
        audioAssistant.readAssessmentQuestion(currentQuestion, language);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [currentQuestion?.id, language, autoRead]);

  const handleReadFull = () => {
    if (!currentQuestion) return;
    audioAssistant.readAssessmentQuestion(currentQuestion, language);
  };

  const handleStop = () => {
    audioAssistant.stopSpeaking();
  };

  const handleToggleMute = () => {
    const newMuted = !audioAssistant.getIsMuted();
    audioAssistant.setMuted(newMuted);
    if (newMuted) {
      audioAssistant.stopSpeaking();
    }
  };

  const handleRateChange = (rate: number) => {
    setSpeechRate(rate);
    audioAssistant.setSpeechRate(rate);
  };

  // AI explanation for current question in chosen language
  const handleFetchExplanation = async () => {
    if (!currentQuestion) return;
    setExplainingLoading(true);
    try {
      const qText = currentQuestion.prompt[language] || currentQuestion.prompt.en;
      const response = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `Provide a direct 2-sentence safety coaching explanation for trainee on this question: "${qText}". Highlight the critical hazard rule.`,
          language: language === 'sat' ? 'santali' : language === 'hi' ? 'hindi' : 'english',
          moduleContext: moduleTitle
        })
      });

      if (response.ok) {
        const data = await response.json();
        const explText = data.answer || getFallbackLocalExplanation();
        setAiExplanation(explText);
        audioAssistant.speak(explText, language);
      } else {
        const fallback = getFallbackLocalExplanation();
        setAiExplanation(fallback);
        audioAssistant.speak(fallback, language);
      }
    } catch (e) {
      const fallback = getFallbackLocalExplanation();
      setAiExplanation(fallback);
      audioAssistant.speak(fallback, language);
    } finally {
      setExplainingLoading(false);
    }
  };

  const getFallbackLocalExplanation = (): string => {
    if (!currentQuestion) return '';
    const correctOpt = currentQuestion.options?.find(o => o.isCorrect);
    if (correctOpt?.explanation) {
      return correctOpt.explanation[language] || correctOpt.explanation.en;
    }
    if (language === 'sat') {
      return 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱱᱤᱭᱚᱢ: ᱡᱚᱛᱚ ᱠᱷᱚᱱ ᱢᱟᱬᱟᱝ ᱨᱮ ᱟᱞᱟᱨᱢ ᱚᱛᱟᱭ ᱢᱮ ᱟᱨ ᱴᱷᱤᱠ ᱥᱩᱨᱚᱠᱥᱟ ᱥᱟᱢᱟᱱ ᱵᱮᱵᱷᱟᱨ ᱢᱮ᱾';
    }
    if (language === 'hi') {
      return 'सुरक्षा नियम: सदैव मानक संचालन प्रक्रिया (SOP) का पालन करें और कार्य से पहले उचित सुरक्षा उपकरण पहनें।';
    }
    return 'Safety rule: Always follow standard procedures and use non-conductive PPE before attempting any intervention.';
  };

  const languageBadge = 
    language === 'sat' ? 'ᱥᱟᱱᱛᱟᱲᱤ (Santali Voice)' :
    language === 'hi' ? 'हिंदी (Hindi Voice)' :
    'English (Voice Guide)';

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-3 sm:p-4 text-white shadow-lg relative overflow-hidden transition-all">
      {/* Background ambient gradient glow */}
      <div className={`absolute -right-12 -top-12 w-32 h-32 rounded-full blur-2xl pointer-events-none transition-opacity duration-500 ${
        isSpeaking ? 'bg-orange-500/25 opacity-100' : 'bg-sky-500/10 opacity-50'
      }`} />

      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 relative z-10">
        <div className="flex items-center gap-2.5">
          {/* Avatar with speaking wave ring */}
          <div className="relative">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border transition-all ${
              isSpeaking 
                ? 'bg-orange-500 text-slate-950 border-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.6)] animate-pulse' 
                : 'bg-slate-800 text-orange-400 border-slate-700'
            }`}>
              <Bot className="w-5 h-5" />
            </div>
            {isSpeaking && (
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500" />
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-1">
                AI Voice Coach
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40">
                {languageBadge}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {isSpeaking 
                ? (language === 'sat' ? 'ᱨᱚᱲ ᱠᱟᱱᱟᱭ... (Speaking)' : language === 'hi' ? 'बोल रहा है... (Speaking)' : 'Speaking now...')
                : (language === 'sat' ? 'ᱟᱢ ᱞᱟᱹᱜᱤᱫ ᱠᱩᱠᱞᱤ ᱯᱟᱲᱦᱟᱣ ᱮᱫᱟᱭ' : language === 'hi' ? 'आपके लिए प्रश्न और विकल्प पढ़ेगा' : 'Reads questions & options aloud in chosen language')}
            </p>
          </div>
        </div>

        {/* Right action icons */}
        <div className="flex items-center gap-1.5">
          {/* Speech Rate Pills */}
          <div className="hidden sm:flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700">
            {[0.8, 1.0, 1.2].map((r) => (
              <button
                key={r}
                onClick={() => handleRateChange(r)}
                className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                  speechRate === r
                    ? 'bg-orange-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title={`Speech speed: ${r}x`}
              >
                {r}x
              </button>
            ))}
          </div>

          {/* Toggle Mute */}
          <button
            onClick={handleToggleMute}
            className={`p-2 rounded-xl border transition-all ${
              audioAssistant.getIsMuted()
                ? 'bg-red-950/60 border-red-500/50 text-red-400 hover:bg-red-900/80'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
            title={audioAssistant.getIsMuted() ? 'Unmute voice' : 'Mute voice'}
          >
            {audioAssistant.getIsMuted() ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Spoken text marquee/preview or animated equalizer when active */}
      {isSpeaking && (
        <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center gap-3 bg-slate-950/60 p-2 rounded-xl">
          {/* Animated sound bars */}
          <div className="flex items-end gap-0.5 h-4 shrink-0 px-1">
            <span className="w-1 bg-orange-400 rounded animate-[bounce_0.6s_infinite_100ms] h-3" />
            <span className="w-1 bg-orange-400 rounded animate-[bounce_0.6s_infinite_300ms] h-4" />
            <span className="w-1 bg-orange-400 rounded animate-[bounce_0.6s_infinite_150ms] h-2" />
            <span className="w-1 bg-orange-400 rounded animate-[bounce_0.6s_infinite_400ms] h-3.5" />
          </div>
          <p className="text-[11px] text-orange-200 line-clamp-1 italic font-medium flex-1">
            "{currentSpokenText || 'Audio guidance active...'}"
          </p>
          <button
            onClick={handleStop}
            className="flex items-center gap-1 text-[11px] font-bold text-red-400 hover:text-red-300 bg-red-950/40 px-2 py-0.5 rounded border border-red-800/60 shrink-0 active:scale-95"
          >
            <Square className="w-3 h-3 fill-current" />
            <span>Stop</span>
          </button>
        </div>
      )}

      {/* Main interactive controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
        {/* Play Full Question & Options */}
        <button
          onClick={isSpeaking ? handleStop : handleReadFull}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 ${
            isSpeaking
              ? 'bg-red-600 hover:bg-red-500 text-white'
              : 'bg-orange-500 hover:bg-orange-400 text-slate-950'
          }`}
        >
          {isSpeaking ? (
            <>
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>{language === 'sat' ? 'ᱨᱚᱲ ᱵᱚᱸᱫᱽ ᱢᱮ (Stop)' : language === 'hi' ? 'आवाज़ रोकें (Stop)' : 'Stop Audio'}</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>
                {language === 'sat' 
                  ? 'ᱯᱩᱨᱟᱹ ᱠᱩᱠᱞᱤ ᱟᱸᱡᱚᱢ ᱢᱮ (Read Question & Options)' 
                  : language === 'hi'
                  ? 'पूरा प्रश्न और विकल्प सुनें'
                  : 'Read Question & Options'}
              </span>
            </>
          )}
        </button>

        {/* AI Explain Helper */}
        <button
          onClick={handleFetchExplanation}
          disabled={explainingLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-bold text-xs transition-all active:scale-95 disabled:opacity-50"
          title="Get AI voice explanation for this concept in chosen language"
        >
          <Sparkles className={`w-3.5 h-3.5 ${explainingLoading ? 'animate-spin' : 'text-amber-400'}`} />
          <span>
            {explainingLoading 
              ? (language === 'sat' ? 'ᱵᱩᱡᱷᱟᱹᱣ ᱮᱫᱟᱭ...' : language === 'hi' ? 'समझा रहा है...' : 'Explaining...') 
              : (language === 'sat' ? 'AI ᱠᱷᱚᱱ ᱵᱩᱡᱷᱟᱹᱣ ᱢᱮ (Explain)' : language === 'hi' ? 'AI कोच से समझें' : 'AI Explanation')}
          </span>
        </button>

        {/* Auto-read toggle */}
        <label className="ml-auto flex items-center gap-2 cursor-pointer select-none text-[11px] text-slate-300 hover:text-white">
          <input
            type="checkbox"
            checked={autoRead}
            onChange={(e) => setAutoRead(e.target.checked)}
            className="w-3.5 h-3.5 accent-orange-500 rounded cursor-pointer"
          />
          <span className="hidden sm:inline">
            {language === 'sat' ? 'ᱚᱴᱚ-ᱯᱟᱲᱦᱟᱣ (Auto-Read)' : language === 'hi' ? 'ऑटो-रीड चालू (Auto-Read)' : 'Auto-Read on next question'}
          </span>
          <span className="sm:hidden">Auto</span>
        </label>
      </div>

      {/* AI Explanation Drawer if fetched */}
      {aiExplanation && (
        <div className="mt-3 p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl text-xs text-amber-100 animate-fade-in flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-300 text-[11px] uppercase tracking-wider">
                {language === 'sat' ? 'AI ᱠᱳᱪ ᱵᱩᱡᱷᱟᱹᱣ (AI Coach Explanation)' : language === 'hi' ? 'AI कोच व्याख्या' : 'AI Coach Safety Reasoning'}
              </span>
              <button
                onClick={() => setAiExplanation(null)}
                className="text-[10px] text-amber-400/80 hover:text-white underline"
              >
                Dismiss
              </button>
            </div>
            <p className="leading-relaxed text-amber-100 whitespace-pre-line">
              {aiExplanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
