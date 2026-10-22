import { VoiceConfig, VoicePreset, VoicePresetId, AgeProfile, TimeGreeting } from '../types/assistant';

export const VOICE_PRESETS: VoicePreset[] = [
  {
    id: 'friday-420',
    name: 'FRIDAY 420 Tactical Cyber Agent',
    nameBn: 'ফ্রাইডে ৪২০ ট্যাকটিক্যাল',
    badge: 'F-420',
    persona: 'Tactical Assistant',
    wakeWord: 'Hey Friday 420',
    wakeWordBn: 'হেই ফ্রাইডে ৪২০',
    defaultRate: 1.15,
    defaultPitch: 1.1,
    gender: 'neural',
    description: 'Hyper-responsive cyber assistant with sharp tactical reflexes and fluent Bangla-English switching.',
    descriptionBn: 'বাংলা এবং ইংরেজি সাপোর্টেড ট্যাকটিক্যাল এআই অ্যাসিস্ট্যান্ট।',
    previewSample: 'Boss, Friday 420 online and ready.',
    accentGlow: 'from-cyan-400 via-sky-500 to-emerald-400',
    isPopular: true
  },
  {
    id: 'bangla-shaila',
    name: 'Shaila Bangla Neural',
    nameBn: 'সায়লা বাংলা নিউরাল',
    badge: 'BD Pro',
    persona: 'Bangladeshi Assistant',
    wakeWord: 'Hey Shaila',
    wakeWordBn: 'হেই সায়লা',
    defaultRate: 1.0,
    defaultPitch: 1.05,
    gender: 'female',
    description: 'Warm, expressive, authentic native Bangladeshi neural voice.',
    descriptionBn: 'সহজ এবং সাবলীল বাংলা ভয়েস অ্যাসিস্ট্যান্ট।',
    previewSample: 'আসসালামু আলাইকুম, আমি আপনার সায়লা অ্যাসিস্ট্যান্ট।',
    accentGlow: 'from-emerald-400 to-teal-500',
    isPopular: true
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
    wakeWordPhrase: 'Hey Friday 420',
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

  updateConfig(newConfig: Partial<VoiceConfig>) {
    this.currentConfig = { ...this.currentConfig, ...newConfig };
  }

  getConfig(): VoiceConfig {
    return this.currentConfig;
  }

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

  applyAgeProfile(profile: AgeProfile) {
    this.updateConfig({ ageProfile: profile });
  }

  getTimeGreeting(): TimeGreeting {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return { period: 'morning', periodBn: 'সকাল', greetingBn: 'শুভ সকাল', greetingEn: 'Good Morning!', suggestionBn: 'আজকের প্ল্যান শুরু করা যাক।', icon: '🌅' };
    } else if (hour >= 12 && hour < 17) {
      return { period: 'afternoon', periodBn: 'দুপুর', greetingBn: 'শুভ দুপুর', greetingEn: 'Good Afternoon!', suggestionBn: 'কেমন চলছে আপনার কাজ?', icon: '☀️' };
    } else if (hour >= 17 && hour < 21) {
      return { period: 'evening', periodBn: 'সন্ধ্যা', greetingBn: 'শুভ সন্ধ্যা', greetingEn: 'Good Evening!', suggestionBn: 'সন্ধ্যার কাজগুলো দেখে নিন।', icon: '🌆' };
    } else {
      return { period: 'night', periodBn: 'রাত', greetingBn: 'শুভ রাত্রি', greetingEn: 'Good Night!', suggestionBn: 'শান্তিময় রাত কাটুক।', icon: '🌙' };
    }
  }

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
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, now);
        gain.gain.setValueAtTime(0.09, now);
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
    } catch (e) {}
  }

  speak(text: string, lang?: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = this.currentConfig.speechRate;
    utterance.pitch = this.currentConfig.speechPitch;
    utterance.lang = lang || this.currentConfig.selectedLanguage;
    window.speechSynthesis.speak(utterance);
  }

  stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  startListening(onResult: (transcript: string) => void, onError: (error: string) => void, lang?: string): boolean {
    if (typeof window === 'undefined') return false;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      onError("Speech Recognition not supported.");
      return false;
    }
    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = lang || this.currentConfig.selectedLanguage;
      this.recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        onResult(transcript);
      };
      this.recognition.onerror = (event: any) => {
        onError(event.error);
        this.isListening = false;
      };
      this.recognition.onend = () => { this.isListening = false; };
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (err: any) {
      onError(err.message);
      return false;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try { this.recognition.stop(); } catch (e) {}
      this.isListening = false;
    }
  }
}

export const audioService = new AudioService();
