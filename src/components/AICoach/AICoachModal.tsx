import React, { useState } from 'react';
import { Sparkles, Send, Volume2, XCircle, Bot, User, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { Language } from '../../types';
import { translations } from '../../data/translations';
import { audioAssistant } from '../../utils/audioAssistant';

interface AICoachModalProps {
  language: Language;
  onClose: () => void;
  currentContext?: string;
}

export const AICoachModal: React.FC<AICoachModalProps> = ({
  language,
  onClose,
  currentContext = 'General Industrial & Mining Safety'
}) => {
  const t = translations[language];

  const [inputQuery, setInputQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<{
    sender: 'user' | 'ai';
    text: string;
    timestamp: string;
  }>>([
    {
      sender: 'ai',
      text: language === 'hi' 
        ? 'नमस्ते! मैं आपका सुरक्षा कोच (Safety Coach) हूँ। औद्योगिक आग, गैस रिसाव या सीमित स्थान नियमों के बारे में मुझसे कोई भी प्रश्न पूछें।'
        : language === 'sat'
        ? 'ᱡᱚᱦᱟᱨ! ᱤᱧ ᱫᱚ ᱟᱢᱟᱜ Suraksha Coach ᱠᱟᱱᱟᱹᱧ᱾ ᱥᱮᱸᱜᱮᱞ, ᱜᱮᱥ ᱞᱤᱠ ᱵᱟᱝᱠᱷᱟᱱ ᱠᱷᱟᱫᱟᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱵᱟᱵᱚᱛ ᱡᱟᱦᱟᱸᱱᱟᱜ ᱠᱩᱞᱤ ᱫᱟᱲᱮᱭᱟᱜ-ᱟᱢ᱾'
        : 'Welcome! I am your DGMS & OSHA certified Industrial Safety Coach. Ask me any procedural question regarding fire response, confined spaces, gas hazards, or emergency protocols.',
      timestamp: 'Just now'
    }
  ]);

  // Suggested prompts
  const samplePrompts = [
    {
      en: 'Can I use CO2 extinguisher on a live 440V transformer?',
      hi: 'क्या 440V बिजली के ट्रांसफार्मर पर CO2 अग्निशामक का उपयोग सुरक्षित है?',
      sat: '440V ᱵᱤᱡᱽᱞᱤ ᱨᱮ CO2 ᱵᱮᱵᱷᱟᱨ ᱜᱟᱱᱚᱜ-ᱟ?'
    },
    {
      en: 'What is the safe atmospheric limit for H2S gas and Oxygen?',
      hi: 'H2S गैस और ऑक्सीजन (O2) का सुरक्षित स्तर क्या है?',
      sat: 'H2S ᱜᱮᱥ ᱟᱨ O2 ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱤᱢᱟᱹ ᱛᱤᱱᱟᱹᱜ?'
    },
    {
      en: 'What to do if my buddy collapses inside a confined vessel?',
      hi: 'सीमित स्थान में साथी के बेहोश होने पर क्या करना चाहिए?',
      sat: 'ᱠᱷᱟᱫᱟᱱ ᱵᱷᱤᱛᱨᱤ ᱨᱮ ᱜᱟᱛᱮ ᱵᱮᱦᱚᱸᱥ ᱞᱮᱱᱠᱷᱟᱱ ᱪᱮᱫ ᱪᱤᱠᱟᱹᱭᱟ?'
    }
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || loading) return;

    const userMsg = {
      sender: 'user' as const,
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          language: language === 'sat' ? 'Santali' : language === 'hi' ? 'Hindi' : 'English',
          context: currentContext
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiMsg = {
          sender: 'ai' as const,
          text: data.response || 'Stay safe and follow official standard operating procedures.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        throw new Error('AI Coach service unavailable');
      }
    } catch (err) {
      const fallbackMsg = {
        sender: 'ai' as const,
        text: language === 'hi'
          ? 'सुरक्षा नियम: आपात स्थिति में तुरंत अलार्म बजाएं, सुरक्षित निकास मार्ग से बाहर निकलें, और SCBA व हार्नेस के बिना सीमित स्थान में कभी अकेले प्रवेश न करें।'
          : language === 'sat'
          ? 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱱᱤᱭᱚᱢ: ᱟᱞᱟᱨᱢ ᱚᱛᱟᱭ ᱢᱮ, ᱨᱩᱠᱷᱤᱭᱟᱹ ᱰᱟᱦᱟᱨ ᱛᱮ ᱚᱰᱚᱠᱚᱜ ᱢᱮ, SCBA ᱵᱮᱜᱚᱨ ᱵᱟᱝ ᱵᱚᱞᱚᱱ ᱢᱟ᱾'
          : 'Safety Protocol: Pull the nearest emergency alarm, evacuate via illuminated exit routes, and never enter a confined space without calibrated gas readings and SCBA equipment.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
    audioAssistant.speak(text, language);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col h-[85vh] max-h-[680px]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950/80 via-slate-950 to-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {t.aiCoachTitle}
                </h3>
                <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded uppercase">
                  Gemini 2.5
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                {t.aiCoachSubtitle} ({language.toUpperCase()})
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/40">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[80%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-100 shadow-md'
              }`}>
                <p className="whitespace-pre-line font-normal">{m.text}</p>
                
                <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-slate-700/40 text-[10px] text-slate-400">
                  <span>{m.timestamp}</span>
                  {m.sender === 'ai' && (
                    <button
                      onClick={() => handleSpeak(m.text)}
                      className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
                      title="Read aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{t.listenVoice}</span>
                    </button>
                  )}
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-amber-400 bg-slate-900 border border-slate-800 p-3 rounded-2xl w-fit">
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span>{t.analyzingStandards}</span>
            </div>
          )}
        </div>

        {/* Sample Prompt Chips */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px] scrollbar-none">
          <span className="text-slate-400 shrink-0 text-[10px] uppercase font-bold">{t.quickPromptsLabel}:</span>
          {samplePrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(p[language] || p.en)}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-800 rounded-lg whitespace-nowrap shrink-0 transition-colors"
            >
              {p[language] || p.en}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder={
              language === 'hi' 
                ? 'सुरक्षा प्रश्न लिखें या पूछें...' 
                : language === 'sat' 
                ? 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱠᱩᱞᱤ ᱚᱞ ᱢᱮ...' 
                : 'Ask a safety procedure or hazard response question...'
            }
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 outline-none"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputQuery.trim() || loading}
            className="p-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 rounded-xl font-bold shadow-md transition-all active:scale-95 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
