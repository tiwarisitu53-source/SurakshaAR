import { Language, AssessmentQuestion } from '../types';
import { transliterateSantaliForSpeech } from './santaliPhonetics';

type SpeechStateListener = (isSpeaking: boolean, currentText?: string) => void;

class AudioAssistantEngine {
  private isMuted: boolean = false;
  private audioCtx: AudioContext | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private speechRate: number = 1.0;
  private isSpeaking: boolean = false;
  private listeners: Set<SpeechStateListener> = new Set();
  private fireSoundNodes: { source: AudioBufferSourceNode; gain: GainNode } | null = null;

  constructor() {
    // Lazy AudioContext initialization on first user interaction
  }

  public subscribe(listener: SpeechStateListener): () => void {
    this.listeners.add(listener);
    listener(this.isSpeaking);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(isSpeaking: boolean, text?: string) {
    this.isSpeaking = isSpeaking;
    this.listeners.forEach(l => l(isSpeaking, text));
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      this.notify(false);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setSpeechRate(rate: number) {
    this.speechRate = Math.max(0.7, Math.min(1.5, rate));
  }

  public getSpeechRate(): number {
    return this.speechRate;
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  /**
   * Speak text in chosen language (English, Hindi, or Santali).
   * For Santali, phonetically transliterates Ol Chiki so the TTS engine speaks natural Santali phrasing.
   */
  public speak(text: string, language: Language = 'en', onEndCallback?: () => void) {
    if (this.isMuted || typeof window === 'undefined' || !window.speechSynthesis) {
      if (onEndCallback) onEndCallback();
      return;
    }

    try {
      window.speechSynthesis.cancel();

      // Clean text for speech synthesis
      let cleanText = text.replace(/[*_#•]/g, '').trim();

      if (language === 'sat') {
        // Transliterate Ol Chiki to phonetic speech for accurate pronunciation
        cleanText = transliterateSantaliForSpeech(cleanText);
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);

      // Voice language and rate configurations
      if (language === 'hi') {
        utterance.lang = 'hi-IN';
        utterance.rate = 0.95 * this.speechRate;
      } else if (language === 'sat') {
        // Indian Hindi/English phonetic voice profile produces clear Santali articulation
        utterance.lang = 'hi-IN';
        utterance.rate = 0.85 * this.speechRate;
        utterance.pitch = 1.05;
      } else {
        utterance.lang = 'en-IN';
        utterance.rate = 1.0 * this.speechRate;
      }

      // Try finding preferred voices in the browser
      const voices = window.speechSynthesis.getVoices?.() || [];
      if (voices.length > 0) {
        if (language === 'hi' || language === 'sat') {
          const hiVoice = voices.find(v => v.lang.includes('hi') || v.name.toLowerCase().includes('hindi') || v.name.toLowerCase().includes('india'));
          if (hiVoice) utterance.voice = hiVoice;
        } else {
          const enVoice = voices.find(v => (v.lang.includes('en-IN') || v.lang.includes('en-GB') || v.lang.includes('en-US')) && !v.name.includes('Google'));
          if (enVoice) utterance.voice = enVoice;
        }
      }

      utterance.onstart = () => {
        this.notify(true, cleanText);
      };

      utterance.onend = () => {
        this.notify(false);
        this.currentUtterance = null;
        if (onEndCallback) onEndCallback();
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis utterance event:', e);
        this.notify(false);
        this.currentUtterance = null;
        if (onEndCallback) onEndCallback();
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
      this.notify(false);
      if (onEndCallback) onEndCallback();
    }
  }

  /**
   * Reads an entire assessment question including prompt and all answer options or sequence steps
   * in the specified language (Santali, Hindi, or English).
   */
  public readAssessmentQuestion(question: AssessmentQuestion, language: Language = 'en', onComplete?: () => void) {
    if (!question) return;

    let fullScript = '';

    if (language === 'sat') {
      const qPrompt = question.audioPrompt?.sat || question.prompt?.sat || question.prompt?.en;
      fullScript = `ᱠᱩᱠᱞᱤ: ${qPrompt}. `;

      if (question.type === 'mcq' && question.options) {
        const optionPrefixes = ['ᱯᱩᱭᱞᱩ ᱵᱟᱪᱷᱟᱣ A', 'ᱫᱚᱥᱟᱨ ᱵᱟᱪᱷᱟᱣ B', 'ᱛᱮᱥᱟᱨ ᱵᱟᱪᱷᱟᱣ C', 'ᱯᱩᱱᱟᱜ ᱵᱟᱪᱷᱟᱣ D'];
        question.options.forEach((opt, idx) => {
          const optText = opt.text.sat || opt.text.en;
          const prefix = optionPrefixes[idx] || `ᱵᱟᱪᱷᱟᱣ ${idx + 1}`;
          fullScript += `${prefix}: ${optText}. `;
        });
      } else if (question.type === 'sequence' && question.sequenceItems) {
        fullScript += 'ᱱᱚᱶᱟ ᱠᱟᱹᱢᱤ ᱦᱚᱨᱟ ᱥᱟᱡᱟᱣ ᱢᱮ: ';
        question.sequenceItems.forEach((item, idx) => {
          const itemText = item.text.sat || item.text.en;
          fullScript += `ᱫᱷᱟᱯ ${idx + 1}: ${itemText}. `;
        });
      }
    } else if (language === 'hi') {
      const qPrompt = question.audioPrompt?.hi || question.prompt?.hi || question.prompt?.en;
      fullScript = `प्रश्न: ${qPrompt}. `;

      if (question.type === 'mcq' && question.options) {
        const optionLetters = ['ए', 'बी', 'सी', 'डी'];
        question.options.forEach((opt, idx) => {
          const optText = opt.text.hi || opt.text.en;
          const letter = optionLetters[idx] || `${idx + 1}`;
          fullScript += `विकल्प ${letter}: ${optText}. `;
        });
      } else if (question.type === 'sequence' && question.sequenceItems) {
        fullScript += 'उचित क्रम में व्यवस्थित करें: ';
        question.sequenceItems.forEach((item, idx) => {
          const itemText = item.text.hi || item.text.en;
          fullScript += `चरण ${idx + 1}: ${itemText}. `;
        });
      }
    } else {
      const qPrompt = question.audioPrompt?.en || question.prompt?.en;
      fullScript = `Question: ${qPrompt}. `;

      if (question.type === 'mcq' && question.options) {
        const optionLetters = ['A', 'B', 'C', 'D'];
        question.options.forEach((opt, idx) => {
          const optText = opt.text.en;
          const letter = optionLetters[idx] || `${idx + 1}`;
          fullScript += `Option ${letter}: ${optText}. `;
        });
      } else if (question.type === 'sequence' && question.sequenceItems) {
        fullScript += 'Arrange in correct sequence: ';
        question.sequenceItems.forEach((item, idx) => {
          const itemText = item.text.en;
          fullScript += `Step ${idx + 1}: ${itemText}. `;
        });
      }
    }

    this.speak(fullScript, language, onComplete);
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      this.notify(false);
    }
  }

  // Synthesized Industrial Acoustic Sounds via Web Audio API
  public playAlarmSiren(durationMs: number = 1800) {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';

    const now = ctx.currentTime;
    // Modulate pitch between 600Hz and 950Hz
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.linearRampToValueAtTime(950, now + 0.4);
    osc.frequency.linearRampToValueAtTime(600, now + 0.8);
    osc.frequency.linearRampToValueAtTime(950, now + 1.2);
    osc.frequency.linearRampToValueAtTime(600, now + 1.6);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (durationMs / 1000));

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + (durationMs / 1000));
  }

  public playExtinguisherDischarge(durationMs: number = 1200) {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    // Generate white noise for fire extinguisher powder hiss
    const bufferSize = ctx.sampleRate * (durationMs / 1000);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1400;
    filter.Q.value = 1.2;

    const gain = ctx.createGain();
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + (durationMs / 1000));

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + (durationMs / 1000));
  }

  public playGasDetectorBeep(severity: 'normal' | 'warning' | 'critical' = 'warning') {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const freq = severity === 'critical' ? 2400 : severity === 'warning' ? 1800 : 1200;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.value = freq;

    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  public playSuccessChime() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const startTime = now + idx * 0.08;
      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  }

  public playErrorBuzz() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = 140;

    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  /**
   * Sound of mechanical lever pull (fire alarm pull station handle, breaker switch)
   */
  public playMechanicalLeverPull() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Heavy metallic latch click followed by spring snap
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(420, now);
    osc1.frequency.exponentialRampToValueAtTime(110, now + 0.08);
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.12);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(880, now + 0.04);
    osc2.frequency.exponentialRampToValueAtTime(220, now + 0.15);
    gain2.gain.setValueAtTime(0.25, now + 0.04);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.04);
    osc2.stop(now + 0.2);
  }

  /**
   * High-pressure water or extinguisher spray with intense steam sizzle on hot fire
   */
  public playWaterStreamAndSizzle(durationMs: number = 1200) {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * (durationMs / 1000);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // White noise with turbulent water rush & boiling steam sizzle
      data[i] = (Math.random() * 2 - 1) * (0.8 + Math.sin(i * 0.02) * 0.2);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Highpass filter for intense boiling hiss + bandpass for roaring stream
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2200;

    const gain = ctx.createGain();
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + (durationMs / 1000));

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + (durationMs / 1000));
  }

  /**
   * High-voltage electric arc flash plasma crackling sound
   */
  public playArcCrackling(durationMs: number = 1000) {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // 50Hz/60Hz deep AC hum + aggressive snapping sawtooth sparks
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.linearRampToValueAtTime(120, now + 0.2);
    osc.frequency.linearRampToValueAtTime(80, now + 0.4);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + (durationMs / 1000));

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + (durationMs / 1000));
  }

  /**
   * Ventilation air blower whoosh sound
   */
  public playAirBlower(durationMs: number = 1500) {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * (durationMs / 1000);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;

    const gain = ctx.createGain();
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + (durationMs / 1000));

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + (durationMs / 1000));
  }

  /**
   * Synthesize realistic game ambient fire roar and crackle loop
   */
  public startFireSound() {
    if (this.isMuted || this.fireSoundNodes) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const bufferLength = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferLength, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferLength; i++) {
        // Pink noise generator with intermittent crackle spikes
        const white = Math.random() * 2 - 1;
        b0 = 0.99765 * b0 + white * 0.0555179;
        b1 = 0.96300 * b1 + white * 0.0750759;
        b2 = 0.57000 * b2 + white * 0.1538520;
        let sample = (b0 + b1 + b2) * 0.18;

        // Occasional ember crackle pop
        if (Math.random() < 0.003) {
          sample += (Math.random() * 2 - 1) * 0.55;
        }
        data[i] = sample;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 450;

      const gain = ctx.createGain();
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.5);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      source.start();
      this.fireSoundNodes = { source, gain };
    } catch (e) {
      console.warn('Could not start fire sound synthesis', e);
    }
  }

  public stopFireSound() {
    if (!this.fireSoundNodes) return;
    const ctx = this.getAudioContext();
    if (!ctx) {
      this.fireSoundNodes = null;
      return;
    }

    try {
      const now = ctx.currentTime;
      this.fireSoundNodes.gain.gain.setValueAtTime(this.fireSoundNodes.gain.gain.value, now);
      this.fireSoundNodes.gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      const node = this.fireSoundNodes.source;
      setTimeout(() => {
        try {
          node.stop();
          node.disconnect();
        } catch (_) {}
      }, 360);
    } catch (e) {
      // Ignored
    } finally {
      this.fireSoundNodes = null;
    }
  }

  // Synthesizes a crisp, sub-bass or micro-transient acoustic tactile pulse tailored to distinct safety haptic patterns
  public playTactileFeedback(pattern: string) {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      switch (pattern) {
        case 'loto_lock': {
          // Resonant heavy padlock clamp: rapid double-click dropping to solid thump
          const osc1 = ctx.createOscillator();
          const gain1 = ctx.createGain();
          osc1.type = 'square';
          osc1.frequency.setValueAtTime(320, now);
          osc1.frequency.exponentialRampToValueAtTime(70, now + 0.08);

          gain1.gain.setValueAtTime(0.22, now);
          gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = 650;

          osc1.connect(filter);
          filter.connect(gain1);
          gain1.connect(ctx.destination);

          osc1.start(now);
          osc1.stop(now + 0.1);
          break;
        }

        case 'pin_pull': {
          // Sharp metallic release snap
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(980, now);
          osc.frequency.exponentialRampToValueAtTime(320, now + 0.06);

          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.08);
          break;
        }

        case 'extinguisher_squeeze': {
          // Spring lever compression thud
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(240, now);
          osc.frequency.exponentialRampToValueAtTime(110, now + 0.07);

          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.09);
          break;
        }

        case 'spray_burst': {
          // Micro powder burst puff (35ms white noise transient)
          const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.04), ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
          const noise = ctx.createBufferSource();
          noise.buffer = buffer;

          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.value = 1600;
          filter.Q.value = 1.5;

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

          noise.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          noise.start(now);
          break;
        }

        case 'ppe_equip': {
          // Snug dual buckle snap
          [0, 0.035].forEach((offset, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(idx === 0 ? 520 : 680, now + offset);
            osc.frequency.exponentialRampToValueAtTime(140, now + offset + 0.04);

            gain.gain.setValueAtTime(0.2, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.045);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + offset);
            osc.stop(now + offset + 0.05);
          });
          break;
        }

        case 'gas_sample': {
          // Atmospheric sonar sensor ping
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1150, now);
          osc.frequency.exponentialRampToValueAtTime(840, now + 0.07);

          gain.gain.setValueAtTime(0.16, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.09);
          break;
        }

        case 'buddy_lifeline': {
          // Forged steel carabiner latch ringing ping
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(1350, now);
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(680, now);

          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.11);
          osc2.stop(now + 0.11);
          break;
        }

        case 'blower_start': {
          // Induction motor surge thrum
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(80, now);
          osc.frequency.linearRampToValueAtTime(220, now + 0.12);

          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = 400;

          gain.gain.setValueAtTime(0.24, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.15);
          break;
        }

        case 'voltage_probe': {
          // Hot stick dielectric sensor beep
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(1950, now);

          gain.gain.setValueAtTime(0.14, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.07);
          break;
        }

        case 'rescue_hook': {
          // Dielectric hook engagement thud
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(190, now);
          osc.frequency.exponentialRampToValueAtTime(90, now + 0.09);

          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.11);
          break;
        }

        case 'e_stop': {
          // Heavy emergency stop impact
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(110, now);
          osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = 280;

          gain.gain.setValueAtTime(0.32, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.14);
          break;
        }

        case 'anchor_test': {
          // 22.2 kN tensile structural thrum
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(95, now);
          osc.frequency.linearRampToValueAtTime(130, now + 0.05);
          osc.frequency.exponentialRampToValueAtTime(50, now + 0.14);

          gain.gain.setValueAtTime(0.28, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.16);
          break;
        }

        case 'trauma_strap': {
          // Webbing tear-away release tick
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);

          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.07);
          break;
        }

        case 'scaffold_inspect': {
          // Stamp / verification click
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(420, now);
          osc.frequency.exponentialRampToValueAtTime(160, now + 0.06);

          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.08);
          break;
        }

        case 'plane_lock': {
          // Spatial anchor harmonic chime
          [523.25, 659.25, 1046.5].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;

            const t = now + idx * 0.04;
            gain.gain.setValueAtTime(0.12, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t);
            osc.stop(t + 0.18);
          });
          break;
        }

        default: {
          // Standard tactile tick
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(380, now);
          osc.frequency.exponentialRampToValueAtTime(120, now + 0.03);

          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.04);
        }
      }
    } catch (e) {
      // Ignore audio synthesis errors on locked or inactive contexts
    }
  }
}

export const audioAssistant = new AudioAssistantEngine();
