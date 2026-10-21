import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Mic, 
  Volume2, 
  Globe, 
  Check, 
  Play, 
  Sliders, 
  Sparkles, 
  Radio, 
  ShieldCheck, 
  Cpu, 
  Search,
  CheckCircle2,
  VolumeX,
  Languages,
  Clock,
  UserCheck,
  Zap
} from 'lucide-react';
import { VoiceConfig, VoiceLanguageOption, VoicePreset, VoicePresetId, AgeProfile } from '../../types/assistant';
import { audioService, VOICE_PRESETS } from '../../services/audioService';

export const SUPPORTED_VOICE_LANGUAGES: VoiceLanguageOption[] = [
  {
    code: 'bn-BD',
    shortCode: 'bn',
    name: 'Bangla (Bangladesh)',
    nativeName: 'বাংলা (বাংলাদেশ)',
    flag: '🇧🇩',
    region: 'South Asia',
    sampleGreeting: 'হ্যালো! আমি এসএইচ এআই অ্যাসিস্ট্যান্ট। আমি কীভাবে আপনাকে সাহায্য করতে পারি?',
    accents: [
      { code: 'bn-BD', label: 'Dhaka Standard (প্রমিত বাংলা)' },
      { code: 'bn-BD-ctg', label: 'Chattogram' },
      { code: 'bn-BD-syl', label: 'Sylhet' }
    ]
  },
  {
    code: 'bn-IN',
    shortCode: 'bn',
    name: 'Bangla (India / Kolkata)',
    nativeName: 'বাংলা (ভারত / কলকাতা)',
    flag: '🇮🇳',
    region: 'South Asia',
    sampleGreeting: 'নমস্কার! এসএইচ এআই আপনার সেবায় সর্বদা প্রস্তুত।',
    accents: [
      { code: 'bn-IN', label: 'Kolkata Standard' }
    ]
  },
  {
    code: 'en-US',
    shortCode: 'en',
    name: 'English (United States)',
    nativeName: 'English (US)',
    flag: '🇺🇸',
    region: 'Global',
    sampleGreeting: 'Hello! I am SH AI Assistant. How can I help you today?',
    accents: [
      { code: 'en-US', label: 'Standard American' },
      { code: 'en-US-neural', label: 'Neural AI Fast' }
    ]
  },
  {
    code: 'en-GB',
    shortCode: 'en',
    name: 'English (United Kingdom)',
    nativeName: 'English (UK)',
    flag: '🇬🇧',
    region: 'Global',
    sampleGreeting: 'Greetings! SH AI Assistant ready to assist you.',
    accents: [
      { code: 'en-GB', label: 'British RP' }
    ]
  },
  {
    code: 'hi-IN',
    shortCode: 'hi',
    name: 'Hindi (India)',
    nativeName: 'हिन्दी (भारत)',
    flag: '🇮🇳',
    region: 'South Asia',
    sampleGreeting: 'नमस्ते! मैं SH AI असिस्टेंट हूँ। मैं आपकी क्या सहायता कर सकता हूँ?',
    accents: [
      { code: 'hi-IN', label: 'Delhi Standard Hindi' }
    ]
  },
  {
    code: 'ar-SA',
    shortCode: 'ar',
    name: 'Arabic (Saudi Arabia)',
    nativeName: 'العربية (السعودية)',
    flag: '🇸🇦',
    region: 'Middle East',
    sampleGreeting: 'مرحباً بك! أنا مساعد SH الذكي، كيف أستطيع مساعدتك اليوم؟',
    accents: [
      { code: 'ar-SA', label: 'Modern Standard Arabic' }
    ]
  },
  {
    code: 'ur-PK',
    shortCode: 'ur',
    name: 'Urdu (Pakistan)',
    nativeName: 'اردو (پاکستان)',
    flag: '🇵🇰',
    region: 'South Asia',
    sampleGreeting: 'السلام علیکم! میں آپ کا SH AI معاون ہوں۔ کیا خدمت کر سکتا ہوں؟',
    accents: [
      { code: 'ur-PK', label: 'Standard Urdu' }
    ]
  },
  {
    code: 'es-ES',
    shortCode: 'es',
    name: 'Spanish (Spain)',
    nativeName: 'Español (España)',
    flag: '🇪🇸',
    region: 'Global',
    sampleGreeting: '¡Hola! Soy SH AI Assistant. ¿En qué puedo ayudarte hoy?',
    accents: [
      { code: 'es-ES', label: 'Castilian' },
      { code: 'es-MX', label: 'Latin America' }
    ]
  },
  {
    code: 'fr-FR',
    shortCode: 'fr',
    name: 'French (France)',
    nativeName: 'Français (France)',
    flag: '🇫🇷',
    region: 'Global',
    sampleGreeting: 'Bonjour! Je suis votre assistant SH AI. Que puis-je faire pour vous?',
    accents: [
      { code: 'fr-FR', label: 'Standard Paris' }
    ]
  },
  {
    code: 'de-DE',
    shortCode: 'de',
    name: 'German (Germany)',
    nativeName: 'Deutsch (Deutschland)',
    flag: '🇩🇪',
    region: 'Global',
    sampleGreeting: 'Hallo! Ich bin dein SH AI Assistent. Wie kann ich dir helfen?',
    accents: [
      { code: 'de-DE', label: 'Hochdeutsch' }
    ]
  },
  {
    code: 'ja-JP',
    shortCode: 'ja',
    name: 'Japanese (Japan)',
    nativeName: '日本語 (日本)',
    flag: '🇯🇵',
    region: 'Asia Pacific',
    sampleGreeting: 'こんにちは！SH AIアシスタントです。何かご用でしょうか？',
    accents: [
      { code: 'ja-JP', label: 'Tokyo Standard' }
    ]
  },
  {
    code: 'zh-CN',
    shortCode: 'zh',
    name: 'Chinese (Mandarin)',
    nativeName: '中文 (普通话)',
    flag: '🇨🇳',
    region: 'Asia Pacific',
    sampleGreeting: '您好！我是 SH AI 智能语音助手，很高兴为您服务。',
    accents: [
      { code: 'zh-CN', label: 'Beijing Standard' }
    ]
  },
  {
    code: 'tr-TR',
    shortCode: 'tr',
    name: 'Turkish (Turkey)',
    nativeName: 'Türkçe (Türkiye)',
    flag: '🇹🇷',
    region: 'Middle East',
    sampleGreeting: 'Merhaba! Ben SH AI Asistanı. Size nasıl yardımcı olabilirim?',
    accents: [
      { code: 'tr-TR', label: 'Istanbul Standard' }
    ]
  },
  {
    code: 'ko-KR',
    shortCode: 'ko',
    name: 'Korean (South Korea)',
    nativeName: '한국어 (대한민국)',
    flag: '🇰🇷',
    region: 'Asia Pacific',
    sampleGreeting: '안녕하세요! SH AI 음성 비서입니다. 무엇을 도와드릴까요?',
    accents: [
      { code: 'ko-KR', label: 'Seoul Standard' }
    ]
  }
];

interface VoiceSettingsScreenProps {
  onBack: () => void;
  voiceConfig?: VoiceConfig;
  onUpdateConfig?: (config: VoiceConfig) => void;
}

export const VoiceSettingsScreen: React.FC<VoiceSettingsScreenProps> = ({
  onBack,
  voiceConfig,
  onUpdateConfig
}) => {
  const [config, setConfig] = useState<VoiceConfig>(
    voiceConfig || audioService.getConfig()
  );
  const [activeTab, setActiveTab] = useState<'presets' | 'age' | 'time-bg' | 'languages'>('presets');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [isPlayingSample, setIsPlayingSample] = useState<string | null>(null);
  const [saveBanner, setSaveBanner] = useState<string | null>(null);

  const currentLangObj = SUPPORTED_VOICE_LANGUAGES.find(
    l => l.code === config.selectedLanguage
  ) || SUPPORTED_VOICE_LANGUAGES[0];

  const currentPreset = VOICE_PRESETS.find(p => p.id === (config.presetId || 'friday-420')) || VOICE_PRESETS[0];
  const timeGreeting = audioService.getTimeGreeting();

  const triggerSaveFeedback = (msg: string) => {
    setSaveBanner(msg);
    setTimeout(() => setSaveBanner(null), 2500);
  };

  const handleSelectPreset = (preset: VoicePreset) => {
    audioService.playCyberChime('activate');
    const updated = {
      ...config,
      presetId: preset.id,
      speechRate: preset.defaultRate,
      speechPitch: preset.defaultPitch,
      voiceGender: preset.gender,
      wakeWordPhrase: preset.wakeWordBn
    };
    setConfig(updated);
    audioService.updateConfig(updated);
    if (onUpdateConfig) onUpdateConfig(updated);
    audioService.speak(preset.previewSample, config.selectedLanguage, {
      rate: preset.defaultRate,
      pitch: preset.defaultPitch
    });
    triggerSaveFeedback(`প্রিসেট সক্রিয়: ${preset.nameBn}`);
  };

  const handleSelectAgeProfile = (profile: AgeProfile) => {
    audioService.playCyberChime('success');
    audioService.applyAgeProfile(profile);
    const updated = audioService.getConfig();
    setConfig(updated);
    if (onUpdateConfig) onUpdateConfig(updated);

    const labels: Record<AgeProfile, string> = {
      child: 'শিশু মোড (Child Safe 6-12 yrs)',
      teen: 'কিশোর মোড (Teen Gaming 13-19 yrs)',
      adult: 'প্রাপ্তবয়স্ক মোড (Adult Pro 20-55 yrs)',
      senior: 'প্রবীণ মোড (Senior Care 56+ yrs)'
    };
    audioService.speak(`${labels[profile]} সক্রিয় করা হয়েছে`, config.selectedLanguage);
    triggerSaveFeedback(labels[profile]);
  };

  const handleToggleBackgroundListening = () => {
    audioService.playCyberChime('beep');
    const updated = { ...config, backgroundListening: !config.backgroundListening };
    setConfig(updated);
    audioService.updateConfig(updated);
    if (onUpdateConfig) onUpdateConfig(updated);
    triggerSaveFeedback(updated.backgroundListening ? 'ব্যাকগ্রাউন্ড ভয়েস অন' : 'ব্যাকগ্রাউন্ড ভয়েস অফ');
  };

  const handleToggleTimeGreeting = () => {
    audioService.playCyberChime('beep');
    const updated = { ...config, timeGreetingEnabled: !config.timeGreetingEnabled };
    setConfig(updated);
    audioService.updateConfig(updated);
    if (onUpdateConfig) onUpdateConfig(updated);
    triggerSaveFeedback(updated.timeGreetingEnabled ? 'সময় অনুযায়ী অভিবাদন অন' : 'সময় অনুযায়ী অভিবাদন অফ');
  };

  const handleSelectLanguage = (lang: VoiceLanguageOption) => {
    audioService.playCyberChime('beep');
    const updated = { ...config, selectedLanguage: lang.code };
    setConfig(updated);
    audioService.updateConfig(updated);
    if (onUpdateConfig) onUpdateConfig(updated);
    playSample(lang);
    triggerSaveFeedback(`ভাষা: ${lang.nativeName}`);
  };

  const handleRateChange = (rate: number) => {
    const updated = { ...config, speechRate: rate };
    setConfig(updated);
    audioService.updateConfig(updated);
    if (onUpdateConfig) onUpdateConfig(updated);
  };

  const handlePitchChange = (pitch: number) => {
    const updated = { ...config, speechPitch: pitch };
    setConfig(updated);
    audioService.updateConfig(updated);
    if (onUpdateConfig) onUpdateConfig(updated);
  };

  const playPresetAudio = (preset: VoicePreset) => {
    setIsPlayingSample(preset.id);
    audioService.speak(preset.previewSample, config.selectedLanguage, {
      rate: preset.defaultRate,
      pitch: preset.defaultPitch
    });
    setTimeout(() => setIsPlayingSample(null), 4500);
  };

  const playSample = (lang: VoiceLanguageOption) => {
    setIsPlayingSample(lang.code);
    audioService.speakSample(lang.sampleGreeting, lang.code, config.speechRate, config.speechPitch);
    setTimeout(() => setIsPlayingSample(null), 4500);
  };

  // Filter languages
  const filteredLanguages = SUPPORTED_VOICE_LANGUAGES.filter(lang => {
    const matchesSearch = 
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedRegion === 'all') return matchesSearch;
    if (selectedRegion === 'south-asia') return matchesSearch && lang.region === 'South Asia';
    if (selectedRegion === 'global') return matchesSearch && lang.region === 'Global';
    if (selectedRegion === 'asia') return matchesSearch && (lang.region === 'Asia Pacific' || lang.region === 'Middle East');
    return matchesSearch;
  });

  return (
    <div className="w-full h-full flex flex-col justify-between bg-gradient-to-b from-[#070e22] via-[#0d1838] to-[#061129] text-white select-none p-4 pb-20 overflow-y-auto space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1 staircase-1">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-slate-200 hover:text-cyan-400 active:scale-95 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="text-center">
          <h2 className="text-sm font-bold text-white tracking-wide flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            ৪২০ ফ্রাইডে ও ভয়েস ইঞ্জিন
          </h2>
          <p className="text-[10px] text-cyan-300 font-medium">Apple iOS 26 Liquid Voice Architecture</p>
        </div>

        <button
          onClick={() => playPresetAudio(currentPreset)}
          className="w-9 h-9 rounded-xl bg-cyan-500/25 border border-cyan-400/50 flex items-center justify-center text-cyan-200 hover:scale-105 active:scale-95 transition"
          title="Play Active Preset Voice"
        >
          <Play className="w-4 h-4 fill-cyan-400 text-cyan-400" />
        </button>
      </div>

      {/* Save Toast Feedback */}
      {saveBanner && (
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-emerald-950/80 backdrop-blur-xl border border-emerald-400/40 text-emerald-300 text-xs shadow-lg staircase-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{saveBanner}</span>
          </div>
          <span className="text-[10px] bg-emerald-900/60 px-2 py-0.5 rounded-md font-mono">OK</span>
        </div>
      )}

      {/* iOS Liquid Nav Segmented Switcher */}
      <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 staircase-2">
        {[
          { id: 'presets', label: '৪২০ ফ্রাইডে', icon: Zap },
          { id: 'age', label: 'বয়স কন্ট্রোল', icon: UserCheck },
          { id: 'time-bg', label: 'সময় ও ব্যাকগ্রাউন্ড', icon: Clock },
          { id: 'languages', label: 'ভাষা ও সুর', icon: Languages }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                audioService.playCyberChime('beep');
                setActiveTab(tab.id as any);
              }}
              className={`py-2 px-1 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_2px_10px_rgba(56,189,248,0.4)]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: 420 FRIDAY & VOICE PRESETS */}
      {activeTab === 'presets' && (
        <div className="space-y-3.5">
          {/* Featured Hero: ৪২০ ফ্রাইডে */}
          <div className="relative rounded-3xl p-4.5 bg-gradient-to-br from-[#0c2847]/90 via-[#0a1e38]/85 to-[#08182b]/90 backdrop-blur-3xl border-2 border-cyan-400/60 shadow-[0_12px_40px_rgba(56,189,248,0.25),inset_0_1px_1px_rgba(255,255,255,0.4)] overflow-hidden staircase-3">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 to-emerald-400 flex items-center justify-center text-slate-950 font-black text-sm shadow-[0_4px_16px_rgba(56,189,248,0.5)]">
                  ৪২০
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-white tracking-wide">৪২০ ফ্রাইডে (FRIDAY 420)</h3>
                    <span className="text-[9px] bg-cyan-400/20 border border-cyan-400/60 text-cyan-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      টিয়ার-১ ট্যাকটিক্যাল
                    </span>
                  </div>
                  <p className="text-[11px] text-cyan-200/80 mt-0.5">হাইপার-রেসপনসিভ সাইবার এজেন্ট ও ফুল পিসি কন্ট্রোলার</p>
                </div>
              </div>

              {config.presetId === 'friday-420' ? (
                <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Check className="w-3 h-3 stroke-[3]" /> একটিভ
                </span>
              ) : (
                <button
                  onClick={() => handleSelectPreset(VOICE_PRESETS[0])}
                  className="px-3 py-1.5 rounded-xl bg-cyan-400 text-slate-950 font-black text-xs hover:brightness-110 active:scale-95 transition cursor-pointer shadow-md"
                >
                  চালু করুন
                </button>
              )}
            </div>

            {/* Persona Dialogue Preview */}
            <div className="mt-3 p-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-cyan-500/30 text-xs text-cyan-100 font-sans italic leading-relaxed">
              "{VOICE_PRESETS[0].previewSample}"
            </div>

            {/* Tactical stats row */}
            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[9px] text-slate-400 block">ওয়েক ওয়ার্ড</span>
                <span className="text-xs font-mono font-bold text-cyan-300">হেই ৪২০ ফ্রাইডে</span>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[9px] text-slate-400 block">স্পিড রেট</span>
                <span className="text-xs font-mono font-bold text-emerald-300">1.15x টার্বো</span>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[9px] text-slate-400 block">কণ্ঠস্বর প্রোফাইল</span>
                <span className="text-xs font-mono font-bold text-purple-300">Neural Cyber</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between pt-1">
              <button
                onClick={() => playPresetAudio(VOICE_PRESETS[0])}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-cyan-200 border border-white/20 transition cursor-pointer"
              >
                {isPlayingSample === 'friday-420' ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                    <span>কথা বলছে...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                    <span>ভয়েস শুনুন (Voice Preview)</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleSelectPreset(VOICE_PRESETS[0])}
                className="text-xs px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-bold hover:brightness-110 active:scale-95 transition cursor-pointer"
              >
                {config.presetId === 'friday-420' ? 'পুনরায় সক্রিয়' : '৪২০ ফ্রাইডে নির্বাচন করুন'}
              </button>
            </div>
          </div>

          {/* Other Preset Cards */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-300 px-1 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              অন্যান্য মার্ভেল ও নিউরাল প্রিসেট ({VOICE_PRESETS.length - 1})
            </h4>

            {VOICE_PRESETS.slice(1).map((preset, idx) => {
              const isSelected = config.presetId === preset.id;
              const isPlaying = isPlayingSample === preset.id;
              const staircaseClass = `staircase-${idx + 4}`;

              return (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-3.5 rounded-2xl border backdrop-blur-xl transition duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-white/15 border-cyan-400 shadow-[0_8px_25px_rgba(56,189,248,0.25)]'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  } ${staircaseClass}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{preset.nameBn}</span>
                        <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded-full text-slate-300 font-mono">
                          {preset.badge}
                        </span>
                        {isSelected && (
                          <span className="text-[9px] bg-cyan-400 text-slate-950 px-1.5 py-0.2 rounded font-black">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{preset.descriptionBn}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-cyan-300 font-mono">
                        <span>🎙️ {preset.wakeWordBn}</span>
                        <span>⚡ {preset.defaultRate}x</span>
                        <span>🎵 {preset.gender}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => playPresetAudio(preset)}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition cursor-pointer ${
                          isPlaying
                            ? 'bg-rose-500 text-white animate-pulse'
                            : 'bg-white/10 border border-white/20 text-slate-300 hover:text-cyan-300'
                        }`}
                        title="Play Sample"
                      >
                        {isPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      </button>

                      <div
                        onClick={() => handleSelectPreset(preset)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition ${
                          isSelected ? 'bg-cyan-400 text-slate-950' : 'border border-slate-700 text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: AGE-ADAPTIVE VOICE CONTROL */}
      {activeTab === 'age' && (
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 staircase-3">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              বয়স ভিত্তিক অ্যাডাপ্টিভ কন্ট্রোল ইঞ্জিন
            </h3>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              আপনার বয়স সিলেক্ট করুন। অ্যাপটি স্বয়ংক্রিয়ভাবে কথা বলার গতি, সুর, ফিল্টারিং ও সিস্টেম কন্ট্রোলের স্বাধীনতা পরিবর্তন করবে।
            </p>
          </div>

          {[
            {
              id: 'child',
              title: '👶 শিশু মোড (Child Safe • ৬-১২ বছর)',
              badge: 'Kids Safe Mode',
              color: 'from-amber-400 to-orange-500',
              rate: '0.88x (ধীর ও স্পষ্ট)',
              preset: 'কিডস বাডি (Kids Buddy)',
              features: ['সেফ সার্চ ও শিক্ষামূলক কনটেন্ট ফিল্টার', 'সহজ শব্দ ও প্রফুল্ল কণ্ঠস্বর', 'পিসি জটিল কমান্ডে অভিভাবক প্রটেকশন']
            },
            {
              id: 'teen',
              title: '⚡ কিশোর মোড (Teen Hyper • ১৩-১৯ বছর)',
              badge: 'Gaming & High-Energy',
              color: 'from-fuchsia-500 to-indigo-500',
              rate: '1.20x (সুপারফাস্ট)',
              preset: '৪২০ ফ্রাইডে টার্বো (FRIDAY 420 Turbo)',
              features: ['গেমিং ও কোডিং ভয়েস কমান্ড', 'দ্রুত প্রতিক্রিয়া ও আরজিবি থিম ইন্টিগ্রেশন', 'মাল্টিমিডিয়া ও ডিসকর্ড শর্টকাট']
            },
            {
              id: 'adult',
              title: '💼 প্রাপ্তবয়স্ক মোড (Adult Pro • ২০-৫৫ বছর)',
              badge: 'Default Pro Tier',
              color: 'from-cyan-400 to-blue-500',
              rate: '1.15x (ব্যালান্সড)',
              preset: '৪২০ ফ্রাইডে ট্যাকটিক্যাল (FRIDAY 420 Standard)',
              features: ['ফুল পিসি কন্ট্রোল (মাউস, কিবোর্ড ও ফাইল)', 'ওপেন-সোর্স এআই ও অটোমেটেড ওটিএ সিস্টেম', 'অটো-সিস্টেম অ্যাপ লঞ্চার ও ভয়েস এক্সিকিউশন']
            },
            {
              id: 'senior',
              title: '👓 প্রবীণ মোড (Senior Care • ৫৬+ বছর)',
              badge: 'High-Clarity Accessibility',
              color: 'from-emerald-400 to-teal-500',
              rate: '0.85x (ধীর ও সাবলীল)',
              preset: 'শায়লা বাংলা নিউরাল (Shaila BD)',
              features: ['অতিরিক্ত স্পষ্ট বাংলা উচ্চারণ', 'জরুরি ১-ট্যাপ ফোন ডায়াল ও হেলথ শর্টকাট', 'হাই-কনট্রাস্ট ও সহজ নেভিগেশন']
            }
          ].map((profile, idx) => {
            const isSelected = (config.ageProfile || 'adult') === profile.id;
            const staircaseClass = `staircase-${idx + 4}`;

            return (
              <div
                key={profile.id}
                onClick={() => handleSelectAgeProfile(profile.id as AgeProfile)}
                className={`p-4 rounded-3xl border backdrop-blur-2xl transition duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-white/15 border-emerald-400 shadow-[0_10px_30px_rgba(16,185,129,0.25)] ring-1 ring-emerald-400/40'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                } ${staircaseClass}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">{profile.title}</h4>
                      {isSelected && (
                        <span className="text-[9px] bg-emerald-400 text-slate-950 px-2 py-0.5 rounded-full font-black">
                          সক্রিয় প্রোফাইল
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-cyan-300 font-mono block mt-0.5">
                      প্রিসেট: {profile.preset} • গতি: {profile.rate}
                    </span>
                  </div>

                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-emerald-400 text-slate-950' : 'border border-slate-700'
                  }`}>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>

                <ul className="mt-2.5 space-y-1 text-[11px] text-slate-300">
                  {profile.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: TIME-AWARE CONTEXT & BACKGROUND VOICE */}
      {activeTab === 'time-bg' && (
        <div className="space-y-3.5">
          {/* Live Contextual Time Card */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-950/60 via-slate-900/60 to-cyan-950/60 backdrop-blur-3xl border border-cyan-400/30 shadow-lg staircase-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl filter drop-shadow-md">{timeGreeting.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">বর্তমান সময়: {timeGreeting.periodBn} ({timeGreeting.greetingBn})</span>
                    <span className="text-[9px] bg-cyan-400/20 text-cyan-300 px-2 py-0.5 rounded-full font-mono">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    {timeGreeting.suggestionBn}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-300">সময় অনুযায়ী স্বয়ংক্রিয় শুভেচ্ছা:</span>
              <button
                onClick={handleToggleTimeGreeting}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition duration-200 cursor-pointer ${
                  config.timeGreetingEnabled ? 'bg-cyan-500 justify-end' : 'bg-slate-800 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-slate-950 shadow-md"></div>
              </button>
            </div>
          </div>

          {/* Background Continuous Wake Word Listening */}
          <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-md staircase-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                  <Mic className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>ব্যাকগ্রাউন্ড ভয়েস কন্ট্রোল (Background Wake)</span>
                    <span className="text-[9px] bg-cyan-400/20 text-cyan-200 px-1.5 py-0.2 rounded font-mono">
                      সতত সক্রিয়
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    অ্যাপ মিনিমাইজ বা ব্যাকগ্রাউন্ডে থাকলেও ভয়েস নির্দেশে অ্যাকশন নিন
                  </p>
                </div>
              </div>

              <button
                onClick={handleToggleBackgroundListening}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition duration-200 cursor-pointer shrink-0 ${
                  config.backgroundListening ? 'bg-cyan-500 justify-end' : 'bg-slate-800 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-slate-950 shadow-md"></div>
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-xs text-slate-300 leading-relaxed">
              সক্রিয় ওয়েক ওয়ার্ড: <strong className="text-cyan-300 font-mono">"{config.wakeWordPhrase || 'হেই ৪২০ ফ্রাইডে'}"</strong>। যে কোনো সময় উচ্চারণ করলে অ্যাসিস্ট্যান্ট প্রতিক্রিয়া জানাবে এবং পিসি বা ফোন ফাংশন ট্রিগার করবে।
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LANGUAGES & FINE TUNING */}
      {activeTab === 'languages' && (
        <div className="space-y-3.5">
          {/* Pitch & Speed Tuning */}
          <div className="rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 p-4 space-y-3 staircase-3">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              ভয়েস গতি ও সুর টিউনিং (Speech Speed & Pitch)
            </span>

            {/* Speed Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Speed (গতি)</span>
                <span className="text-cyan-300 font-mono font-bold">{config.speechRate}x</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.5"
                step="0.05"
                value={config.speechRate}
                onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Pitch Slider */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Pitch (কণ্ঠের গভীরতা/সুর)</span>
                <span className="text-cyan-300 font-mono font-bold">{config.speechPitch}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.3"
                step="0.05"
                value={config.speechPitch}
                onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Languages Directory */}
          <div className="space-y-2.5 pt-1 staircase-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                ভাষা নির্বাচন ({SUPPORTED_VOICE_LANGUAGES.length} Languages)
              </h3>
              <span className="text-[10px] text-cyan-300 font-mono">Bangla, English & World</span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search language (বাংলা, English, Hindi)..."
                className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-hidden focus:border-cyan-400"
              />
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-0.5">
              {filteredLanguages.map((lang) => {
                const isSelected = config.selectedLanguage === lang.code;
                const isPlayingThis = isPlayingSample === lang.code;

                return (
                  <div
                    key={lang.code}
                    className={`flex items-center justify-between p-3 rounded-2xl border backdrop-blur-xl transition duration-150 cursor-pointer ${
                      isSelected 
                        ? 'bg-white/20 border-cyan-400 shadow-[0_4px_20px_rgba(56,189,248,0.25)]' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                    onClick={() => handleSelectLanguage(lang)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{lang.flag}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                            {lang.nativeName}
                          </h4>
                          {isSelected && (
                            <span className="text-[9px] bg-cyan-400 text-slate-950 px-1.5 py-0.2 rounded font-bold">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400">
                          {lang.name} • <span className="font-mono text-cyan-300">{lang.code}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => playSample(lang)}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition cursor-pointer ${
                          isPlayingThis 
                            ? 'bg-rose-500 text-white animate-pulse' 
                            : 'bg-white/10 border border-white/20 text-slate-300 hover:text-cyan-300 hover:border-cyan-400'
                        }`}
                        title="Play preview"
                      >
                        {isPlayingThis ? <Volume2 className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      </button>

                      <div 
                        onClick={() => handleSelectLanguage(lang)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          isSelected ? 'bg-cyan-400 text-slate-950' : 'border border-slate-700 text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Done & Apply Button */}
      <div className="pt-2 staircase-6">
        <button
          onClick={() => {
            audioService.playCyberChime('success');
            onBack();
          }}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 text-slate-950 font-black text-xs shadow-[0_4px_25px_rgba(56,189,248,0.45)] hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4 text-slate-950" />
          <span>Save Voice Settings (সেটিংস সংরক্ষণ করুন)</span>
        </button>
      </div>
    </div>
  );
};
