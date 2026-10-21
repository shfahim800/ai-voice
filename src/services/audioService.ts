// Web Audio API & Speech Synthesis / Speech Recognition for SH AI Assistant
import { VoiceConfig, VoicePreset, VoicePresetId, AgeProfile, TimeGreeting } from '../types/assistant';

export const VOICE_PRESETS: VoicePreset[] = [
  {
    id: 'friday-420',
    name: 'FRIDAY 420 Tactical Cyber Agent',
    nameBn: '৪২০ ফ্রাইডে (ট্যাকটিক্যাল সাইবার এজেন্ট)',
    badge: '৪২০ ফ্রাইডে',
    persona: 'টিয়ার-১ সাইবার ট্যাকটিক্যাল ফ্রাইডে এজেন্ট',
    wakeWord: 'Hey Friday 420',
    wakeWordBn: 'হেই ৪২০ ফ্রাইডে',
    defaultRate: 1.15,
    defaultPitch: 1.1,
    gender: 'neural',
    description: 'Hyper-responsive cyber assistant with sharp tactical reflexes, fluent Bangla-English switching, and PC control authority.',
    descriptionBn: 'সুপারফাস্ট ট্যাকটিক্যাল এআই - ক্ষিপ্র প্রতিক্রিয়া, বাংলা ও ইংরেজিতে সাবলীল ভয়েস কমান্ড এবং সিস্টেম নিয়ন্ত্রণের সম্পূর্ণ ক্ষমতা।',
    previewSample: 'হ্যালো বস! ৪২০ ফ্রাইডে সিস্টেম অনলাইন। আপনার পিসি ও মোবাইল সম্পূর্ণ রেডি। কী হুকুম?',
    accentGlow: 'from-cyan-400 via-sky-500 to-emerald-400',
    isPopular: true
  },
  {
    id: 'friday-stark',
    name: 'F.R.I.D.A.Y. Stark Core',
    nameBn: 'ফ্রাইডে স্টার্ক কোর (আয়রন ম্যান স্যুট)',
    badge: 'F.R.I.D.A.Y.',
    persona: 'মার্ভেল স্যুট টেকনিক্যাল কো-পাইলট',
    wakeWord: 'Hey Friday',
    wakeWordBn: 'হেই ফ্রাইডে',
    defaultRate: 1.05,
    defaultPitch: 1.15,
    gender: 'female',
    description: 'Irish-accented tactical HUD assistant inspired by Marvel Stark Industries, analytical and poised.',
    descriptionBn: 'মার্ভেল আয়রন স্যুট অ্যাসিস্ট্যান্ট ফ্রাইডে - শান্ত, আত্মবিশ্বাসী এবং বিশ্লেষণধর্মী কন্ঠ।',
    previewSample: 'Boss, F.R.I.D.A.Y. online. All systems nominal. Flight telemetry and PC controls locked.',
    accentGlow: 'from-sky-400 to-indigo-500'
  },
  {
    id: 'jarvis',
    name: 'J.A.R.V.I.S. Sovereign Protocol',
    nameBn: 'জার্ভিস সভরিন প্রোটোকল',
    badge: 'J.A.R.V.I.S.',
    persona: 'ব্রিটিশ বাফলার ও ডিপ ইন্টেলিজেন্স',
    wakeWord: 'Hey Jarvis',
    wakeWordBn: 'হেই জার্ভিস',
    defaultRate: 0.95,
    defaultPitch: 0.9,
    gender: 'male',
    description: 'Polite, distinguished British butler AI with deep resonant cadence and analytical depth.',
    descriptionBn: 'ক্লাসিক ব্রিটিশ বাফলার আর্কিটেকচার - বিনম্র, গভীর বুদ্ধিমত্তা ও সুনির্দিষ্ট সিদ্ধান্ত।',
    previewSample: 'At your service, sir. I have routed all background protocols and stand ready for your instruction.',
    accentGlow: 'from-amber-400 to-orange-500'
  },
  {
    id: 'bangla-shaila',
    name: 'Shaila Bangla Neural (শায়লা)',
    nameBn: 'শায়লা বাংলা নিউরাল',
    badge: 'শায়লা BD',
    persona: 'বাংলাদেশি প্রমিত মিষ্টি নিউরাল কণ্ঠ',
    wakeWord: 'Hey Shaila',
    wakeWordBn: 'হেই শায়লা',
    defaultRate: 1.0,
    defaultPitch: 1.05,
    gender: 'female',
    description: 'Warm, expressive, authentic native Bangladeshi neural voice with natural prosody and intonation.',
    descriptionBn: 'বাংলাদেশের স্থানীয় মার্জিত ও প্রাকৃতিক সুরের আধুনিক নিউরাল কণ্ঠ।',
    previewSample: 'নমস্কার ও আসসালামু আলাইকুম! আমি শায়লা, আপনার সেবায় সর্বদা উপস্থিত। কী করতে পারি?',
    accentGlow: 'from-emerald-400 to-teal-500',
    isPopular: true
  },
  {
    id: 'cyber-siri',
    name: 'Apple Siri 26 Pro',
    nameBn: 'অ্যাপল সিরি ২৬ প্রো',
    badge: 'Siri 26',
    persona: 'কিউপারটিনো আইওএস নেক্সট-জেন কম্প্যানিয়ন',
    wakeWord: 'Hey Siri',
    wakeWordBn: 'হেই সিরি',
    defaultRate: 1.05,
    defaultPitch: 1.0,
    gender: 'neural',
    description: 'Ultra-fluid Cupertino aesthetic voice, smooth cadence, calibrated for Apple iOS 26 ecosystem.',
    descriptionBn: 'অ্যাপল আইওএস ২৬ নেক্সট-জেন ব্লেন্ড - সুপার মসৃণ কিউপারটিনো একুরেসী।',
    previewSample: "Here's what I found for you across all your linked Apple and PC devices.",
    accentGlow: 'from-fuchsia-500 to-pink-500'
  },
  {
    id: 'kids-buddy',
    name: 'Kids Buddy (কিডস বাডি)',
    nameBn: 'কিডস বাডি (ছোটদের নিরাপদ মোড)',
    badge: 'Kids Safe',
    persona: 'ছোটদের আনন্দময় শিক্ষামূলক দোস্ত',
    wakeWord: 'Hey Buddy',
    wakeWordBn: 'হেই বাডি',
    defaultRate: 0.88,
    defaultPitch: 1.25,
    gender: 'female',
    description: 'Gentle, patient, cheerful voice tuned for children with clear pronunciation and positive reinforcement.',
    descriptionBn: 'বাচ্চাদের জন্য বন্ধুত্বপূর্ণ, ধীর ও শিক্ষামূলক কণ্ঠ।',
    previewSample: 'হাই ফ্রেন্ড! চলো আজকে নতুন কিছু মজার পড়া বা সুন্দর বিজ্ঞান পরীক্ষা শিখি!',
    accentGlow: 'from-yellow-400 to-pink-400'
  }
];

class AudioService {
  private audioCtx: AudioContext | null = null;
  private recognition: any = null;
  private isListening: boolean = false;
  private currentConfig: VoiceConfig = {
    selectedLanguage: 'bn-BD',
    autoDetectLanguage: true,
    speechRate: 1.15,
    speechPitch: 1.1,
    voiceGender: 'neural',
    wakeWordEnabled: true,
    wakeWordPhrase: 'হেই ৪২০ ফ্রাইডে',
    noiseSuppression: true,
    offlineVoiceModel: false,
    presetId: 'friday-420',
    ageProfile: 'adult',
    backgroundListening: true,
    timeGreetingEnabled: true
  };

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  // Update voice configuration settings
  updateConfig(newConfig: Partial<VoiceConfig>) {
    this.currentConfig = { ...this.currentConfig, ...newConfig };
  }

  getConfig(): VoiceConfig {
    return this.currentConfig;
  }

  // Apply a selected voice preset
  applyPreset(presetId: VoicePresetId): VoicePreset | undefined {
    const preset = VOICE_PRESETS.find(p => p.id === presetId);
    if (preset) {
      this.updateConfig({
        presetId: preset.id,
        speechRate: preset.defaultRate,
        speechPitch: preset.defaultPitch,
        voiceGender: preset.gender,
        wakeWordPhrase: preset.wakeWordBn
      });
    }
    return preset;
  }

  // Apply Age-Adaptive settings
  applyAgeProfile(profile: AgeProfile) {
    if (profile === 'child') {
      this.updateConfig({
        ageProfile: 'child',
        speechRate: 0.88,
        speechPitch: 1.25,
        presetId: 'kids-buddy',
        wakeWordPhrase: 'হেই বাডি'
      });
    } else if (profile === 'teen') {
      this.updateConfig({
        ageProfile: 'teen',
        speechRate: 1.2,
        speechPitch: 1.1,
        presetId: 'friday-420',
        wakeWordPhrase: 'Hey Friday 420'
      });
    } else if (profile === 'adult') {
      this.updateConfig({
        ageProfile: 'adult',
        speechRate: 1.15,
        speechPitch: 1.1,
        presetId: 'friday-420',
        wakeWordPhrase: 'হেই ৪২০ ফ্রাইডে'
      });
    } else if (profile === 'senior') {
      this.updateConfig({
        ageProfile: 'senior',
        speechRate: 0.85,
        speechPitch: 0.95,
        presetId: 'bangla-shaila',
        wakeWordPhrase: 'হেই শায়লা'
      });
    }
  }

  // Detect time of day for contextual greetings
  getTimeGreeting(): TimeGreeting {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return {
        period: 'morning',
        periodBn: 'সকাল',
        greetingBn: 'সুপ্রভাত!',
        greetingEn: 'Good Morning!',
        suggestionBn: 'আজকের দিনটি শুরু করার জন্য সিস্টেম রেডি। পিসির মনিটর ও মর্নিং ব্রিফিং চেক করবেন?',
        icon: '🌅'
      };
    } else if (hour >= 12 && hour < 17) {
      return {
        period: 'afternoon',
        periodBn: 'দুপুর',
        greetingBn: 'শুভ দুপুর!',
        greetingEn: 'Good Afternoon!',
        suggestionBn: 'দুপুরের কাজের জন্য ৪২০ ফ্রাইডে প্রস্তুত। পিসি ওয়ার্কস্পেস ও ফাইল সিঙ্কড আছে।',
        icon: '☀️'
      };
    } else if (hour >= 17 && hour < 21) {
      return {
        period: 'evening',
        periodBn: 'সন্ধ্যা',
        greetingBn: 'শুভ সন্ধ্যা!',
        greetingEn: 'Good Evening!',
        suggestionBn: 'সন্ধ্যার রিলাক্সিং মোড চালু। মিউজিক চালাবেন নাকি ডেইলি সামারি শুনবেন?',
        icon: '🌇'
      };
    } else {
      return {
        period: 'night',
        periodBn: 'রাত',
        greetingBn: 'শুভ রাত্রি!',
        greetingEn: 'Good Night!',
        suggestionBn: 'লেট নাইট মোড সক্রিয়। চোখের সুরক্ষায় ট্রু ডার্ক ও সাইলেন্ট নোটিফিকেশন অন রয়েছে।',
        icon: '🌙'
      };
    }
  }

  // Futuristic tech sound effect for button clicks and triggers
  playCyberChime(type: 'beep' | 'activate' | 'success' | 'alert' = 'beep') {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      const now = this.audioCtx.currentTime;

      if (type === 'activate') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.3);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880, now + 0.1); // A5
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'alert') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.setValueAtTime(200, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      }
    } catch (e) {
      // Audio policy catch
    }
  }

  // Multi-language text-to-speech
  speak(text: string, lang?: string, options?: { rate?: number; pitch?: number; gender?: string }) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options?.rate ?? this.currentConfig.speechRate;
    utterance.pitch = options?.pitch ?? this.currentConfig.speechPitch;

    // Determine language: explicit > auto-detect > selected language
    let targetLang = lang || this.currentConfig.selectedLanguage;
    if (this.currentConfig.autoDetectLanguage) {
      if (/[\u0980-\u09FF]/.test(text)) {
        targetLang = 'bn-BD';
      } else if (/[\u0900-\u097F]/.test(text)) {
        targetLang = 'hi-IN';
      } else if (/[\u0600-\u06FF]/.test(text)) {
        targetLang = 'ar-SA';
      } else if (/[\u3040-\u30FF\u4E00-\u9FAF]/.test(text)) {
        targetLang = 'ja-JP';
      } else if (/[a-zA-Z]/.test(text) && targetLang.startsWith('bn')) {
        targetLang = 'en-US';
      }
    }
    utterance.lang = targetLang;

    const voices = window.speechSynthesis.getVoices();
    const primaryCode = targetLang.split('-')[0].toLowerCase();
    
    // Pick appropriate voice
    const matchedVoice = voices.find(v => {
      const vLang = v.lang.toLowerCase();
      return vLang === targetLang.toLowerCase() || vLang.startsWith(primaryCode);
    });

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  // Test sample speech in specified language
  speakSample(text: string, langCode: string, rate = 1.0, pitch = 1.0) {
    this.speak(text, langCode, { rate, pitch });
  }

  stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // Start Voice Recognition with configured or provided multi-language code
  startListening(
    onResult: (transcript: string) => void,
    onError: (error: string) => void,
    lang?: string
  ): boolean {
    if (typeof window === 'undefined') return false;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      onError("Speech Recognition not supported in this browser. Try Chrome on Android or Desktop.");
      return false;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = lang || this.currentConfig.selectedLanguage || 'bn-BD';

      this.recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        onResult(currentTranscript);
      };

      this.recognition.onerror = (event: any) => {
        onError(event.error);
        this.isListening = false;
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.start();
      this.isListening = true;
      this.playCyberChime('activate');
      return true;
    } catch (err: any) {
      onError(err.message || 'Error starting speech recognition');
      return false;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {}
      this.isListening = false;
    }
  }
}

export const audioService = new AudioService();
