import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mic, Square, Play, Volume2, Smartphone, Sparkles, Layers, Zap, UserCheck, Clock, Monitor, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import { audioService } from '../../services/audioService';
import { askAssistantAI } from '../../services/geminiService';
import { VoiceWave } from '../widgets/VoiceWave';
import { systemAppsService } from '../../services/systemAppsService';
import { socialMediaService } from '../../services/socialMediaService';
import { apiHubService } from '../../services/apiHubService';

interface VoiceScreenProps {
  onBack: () => void;
  onNavigate?: (screen: any) => void;
  apiKey?: string;
}

export const VoiceScreen: React.FC<VoiceScreenProps> = ({ onBack, onNavigate, apiKey }) => {
  const [isListening, setIsListening] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [reply, setReply] = useState('শুনছি... বলুন...');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const voiceConfig = audioService.getConfig();
  const timeGreeting = audioService.getTimeGreeting();

  useEffect(() => {
    startListeningSession();
    return () => {
      audioService.stopListening();
      audioService.stopSpeaking();
    };
  }, []);

  const startListeningSession = () => {
    setIsListening(true);
    setTranscript('');
    const isBangla = voiceConfig.selectedLanguage.startsWith('bn');
    const isFriday420 = (voiceConfig.presetId || 'friday-420') === 'friday-420';

    setReply(
      isFriday420
        ? `৪২০ ফ্রাইডে শুনছে... বলুন বস!`
        : isBangla 
          ? 'শুনছি... বলুন... (Listening...)' 
          : 'Listening... Speak now...'
    );
    
    const started = audioService.startListening(
      async (text) => {
        setTranscript(text);
        if (text.length > 2) {
          audioService.stopListening();
          setIsListening(false);

          // 1. Check if user is issuing a phone System App command (e.g. camera, torch, dialer, alarm, etc.)
          const sysCmd = systemAppsService.processVoiceCommand(text, voiceConfig.selectedLanguage);
          if (sysCmd.matched) {
            setReply(sysCmd.speechReply);
            setIsSpeaking(true);
            audioService.speak(sysCmd.speechReply);
            audioService.playCyberChime('success');

            if (sysCmd.action === 'torch_on' || sysCmd.action === 'torch_sos') {
              systemAppsService.toggleTorch(true);
            } else if (sysCmd.action === 'torch_off') {
              systemAppsService.toggleTorch(false);
            }

            setTimeout(() => {
              setIsSpeaking(false);
              if (onNavigate) {
                onNavigate('system-apps');
              }
            }, 1800);
            return;
          }

          // 2. Check if user is issuing a Social Media voice command (Facebook, WhatsApp, YouTube, TikTok, etc.)
          const socialCmd = socialMediaService.processVoiceCommand(text, voiceConfig.selectedLanguage);
          if (socialCmd.matched) {
            setReply(socialCmd.speechReply);
            setIsSpeaking(true);
            audioService.speak(socialCmd.speechReply);
            audioService.playCyberChime('success');

            if (socialCmd.deepLink) {
              setTimeout(() => {
                window.open(socialCmd.deepLink, '_blank', 'noopener,noreferrer');
              }, 1200);
            }

            setTimeout(() => {
              setIsSpeaking(false);
              if (onNavigate) {
                onNavigate('social-media');
              }
            }, 1800);
            return;
          }

          // 3. Otherwise query Ultra-Fast Multi-Agent Swarm (15 agents parallel race)
          setReply(isBangla ? '৪২০ ফ্রাইডে ১৫টি এজেন্টের মাধ্যমে বিশ্লেষণ করছে...' : 'Swarm analyzing across 15 AI agents...');
          
          try {
            // High-speed parallel query
            const fastReply = await apiHubService.queryAgent(text);
            setReply(fastReply);
            setIsSpeaking(true);
            audioService.speak(fastReply.replace(/\[.*?\]:\s*/, ''));
            setTimeout(() => setIsSpeaking(false), 5000);
          } catch (e) {
            // Fallback
            try {
              const res = await askAssistantAI(text, apiKey);
              setReply(res.text);
              setIsSpeaking(true);
              audioService.speak(res.text);
              setTimeout(() => setIsSpeaking(false), 5000);
            } catch {
              setReply(isBangla ? 'দুঃখিত বস, পুনরায় বলুন।' : 'Sorry, could not process. Please speak again.');
            }
          }
        }
      },
      (error) => {
        console.warn('Speech error:', error);
        setReply(isBangla ? 'মাইক্রোফোন সক্রিয় করুন বা টেস্ট কমান্ড চাপুন।' : 'Microphone ready. Tap a quick command.');
        setIsListening(false);
      },
      voiceConfig.selectedLanguage
    );

    if (!started) {
      setReply('৪২০ ফ্রাইডে স্ট্যান্ডবাই... নিচের কমান্ড চাপুন');
    }
  };

  const stopSession = () => {
    audioService.stopListening();
    audioService.stopSpeaking();
    setIsListening(false);
    setIsSpeaking(false);
    audioService.playCyberChime('alert');
  };

  const handleQuickCommand = async (cmd: string) => {
    setTranscript(cmd);
    setIsListening(false);
    setReply('৪২০ ফ্রাইডে প্রসেসিং...');
    const fastReply = await apiHubService.queryAgent(cmd);
    setReply(fastReply);
    setIsSpeaking(true);
    audioService.speak(fastReply.replace(/\[.*?\]:\s*/, ''));
    setTimeout(() => setIsSpeaking(false), 5000);
  };

  return (
    <div className="relative w-full h-full min-h-[660px] bg-gradient-to-b from-[#060e22] via-[#0b1736] to-[#040b1c] flex flex-col justify-between p-5 select-none overflow-hidden text-white">
      {/* Background iOS liquid specular glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-0 w-[240px] h-[240px] bg-indigo-500/15 rounded-full blur-[90px] pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between z-10 staircase-1">
        <button 
          onClick={onBack}
          className="w-9 h-9 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 flex items-center justify-center text-slate-200 hover:text-cyan-400 active:scale-95 transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <h2 className="text-sm font-black text-white tracking-wide">৪২০ ফ্রাইডে AI</h2>
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-0.5">
            <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-cyan-400 animate-ping' : 'bg-slate-500'}`}></span>
            <span className="text-[10px] text-cyan-300 font-medium">
              {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Standby'}
            </span>
            <span className="text-[9px] bg-white/10 px-2 py-0.2 rounded-full border border-white/15 text-slate-300 font-mono">
              {voiceConfig.selectedLanguage}
            </span>
          </div>
        </div>

        <button
          onClick={() => onNavigate && onNavigate('voice-settings')}
          className="w-9 h-9 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 flex items-center justify-center text-slate-200 hover:text-cyan-400 active:scale-95 transition cursor-pointer"
          title="Voice & Preset Settings"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Time-Aware & Age Adaptive Status Pills */}
      <div className="flex items-center justify-center gap-1.5 py-1 z-10 flex-wrap staircase-2">
        <div className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-[10px] text-cyan-200 flex items-center gap-1 shadow-xs">
          <span>{timeGreeting.icon}</span>
          <span>{timeGreeting.periodBn} ({timeGreeting.greetingBn})</span>
        </div>

        <div className="px-2.5 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 backdrop-blur-xl border border-cyan-400/40 text-[10px] text-cyan-300 font-bold flex items-center gap-1">
          <Zap className="w-3 h-3 text-cyan-400" />
          <span>৪২০ ফ্রাইডে</span>
        </div>

        <div className="px-2 py-1 rounded-full bg-white/10 backdrop-blur-xl border border-white/15 text-[10px] text-slate-300 font-mono">
          👤 {voiceConfig.ageProfile || 'adult'} mode
        </div>
      </div>

      {/* Center Holographic Voice Orb */}
      <div className="relative flex flex-col items-center justify-center my-auto z-10 py-3 staircase-3">
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Animated concentric pulse waves */}
          <motion.div 
            animate={{ 
              scale: isListening || isSpeaking ? [1, 1.25, 1] : 1,
              opacity: isListening || isSpeaking ? [0.3, 0.7, 0.3] : 0.2
            }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full border border-cyan-400/50 glow-cyan"
          />

          <motion.div 
            animate={{ 
              scale: isListening || isSpeaking ? [1.1, 1.35, 1.1] : 1,
              opacity: isListening || isSpeaking ? [0.2, 0.5, 0.2] : 0.1
            }}
            transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
            className="absolute -inset-4 rounded-full border border-indigo-500/40"
          />

          {/* Rotating dashed ring */}
          <div className="absolute inset-2 rounded-full border border-dashed border-cyan-400/50 animate-tech-spin"></div>

          {/* High-tech Inner Glowing Sphere */}
          <div 
            className="w-36 h-36 rounded-full bg-gradient-to-tr from-[#032b43] via-[#0284c7] to-[#38bdf8] border-2 border-white/60 shadow-[0_0_50px_rgba(56,189,248,0.7),inset_0_1px_2px_rgba(255,255,255,0.7)] flex flex-col items-center justify-center cursor-pointer active:scale-95 transition"
            onClick={isListening ? stopSession : startListeningSession}
          >
            <Mic className={`w-12 h-12 ${isListening ? 'text-white animate-pulse' : 'text-cyan-100'} stroke-[2.2] drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]`} />
            <span className="text-[10px] font-black text-white/90 mt-1 uppercase tracking-wider">
              {isListening ? 'শুনছি...' : '৪২০ ফ্রাইডে'}
            </span>
          </div>
        </div>

        {/* Dynamic Prompt / Subtitle */}
        <div className="text-center mt-5 px-4 max-w-sm">
          <p className="text-base font-bold text-white tracking-wide font-sans leading-relaxed">
            {reply}
          </p>
          {transcript && (
            <p className="text-xs text-cyan-300 mt-1 italic">
              "{transcript}"
            </p>
          )}
        </div>

        {/* Real-time VoiceWave Audio Visualizer Component */}
        <div className="w-full max-w-xs mt-3">
          <VoiceWave 
            isListening={isListening} 
            isSpeaking={isSpeaking} 
            height={64} 
            sensitivity={1.5}
          />
        </div>
      </div>

      {/* Spoken preset quick chips & System Apps Launcher */}
      <div className="flex items-center justify-center gap-1.5 overflow-x-auto py-2 z-10 text-[11px] no-scrollbar staircase-4">
        <button 
          onClick={() => onNavigate && onNavigate('social-media')}
          className="bg-gradient-to-r from-blue-950/80 to-cyan-950/80 backdrop-blur-xl border border-cyan-400/50 hover:border-cyan-400 text-cyan-300 font-bold px-3 py-1.5 rounded-full transition flex items-center gap-1 shrink-0 cursor-pointer shadow-md"
          title="Open Social Media Voice Hub"
        >
          <Share2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>🌐 সোশ্যাল মিডিয়া</span>
        </button>

        <button 
          onClick={() => onNavigate && onNavigate('system-apps')}
          className="bg-gradient-to-r from-emerald-950/80 to-cyan-950/80 backdrop-blur-xl border border-emerald-400/50 hover:border-emerald-400 text-emerald-300 font-bold px-3 py-1.5 rounded-full transition flex items-center gap-1 shrink-0 cursor-pointer shadow-md"
          title="Open System Apps Voice Controller"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
          <span>📱 সিস্টেম অ্যাপস</span>
        </button>

        <button 
          onClick={() => handleQuickCommand('৪২০ ফ্রাইডে পিসি ও মোবাইল সিস্টেম স্ট্যাটাস বলো')}
          className="bg-white/10 backdrop-blur-xl border border-white/20 text-cyan-300 px-3 py-1.5 rounded-full transition shrink-0 cursor-pointer font-medium hover:bg-white/15"
        >
          ⚡ সিস্টেম রিপোর্ট
        </button>

        <button 
          onClick={() => onNavigate && onNavigate('pc-control')}
          className="bg-white/10 backdrop-blur-xl border border-white/20 text-teal-300 px-3 py-1.5 rounded-full transition shrink-0 cursor-pointer font-medium hover:bg-white/15 flex items-center gap-1"
        >
          <Monitor className="w-3 h-3 text-teal-400" />
          <span>🖥️ পিসি কন্ট্রোল</span>
        </button>

        <button 
          onClick={() => {
            const cmd = 'ক্যামেরা খোলো';
            setTranscript(cmd);
            const res = systemAppsService.processVoiceCommand(cmd, voiceConfig.selectedLanguage);
            setReply(res.speechReply);
            audioService.speak(res.speechReply);
            if (onNavigate) onNavigate('system-apps');
          }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 text-rose-300 px-3 py-1.5 rounded-full transition shrink-0 cursor-pointer font-medium hover:bg-white/15"
        >
          📷 ক্যামেরা
        </button>

        <button 
          onClick={() => {
            const cmd = 'টর্চলাইট অন করো';
            setTranscript(cmd);
            const res = systemAppsService.processVoiceCommand(cmd, voiceConfig.selectedLanguage);
            setReply(res.speechReply);
            audioService.speak(res.speechReply);
            systemAppsService.toggleTorch(true);
            if (onNavigate) onNavigate('system-apps');
          }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 text-amber-300 px-3 py-1.5 rounded-full transition shrink-0 cursor-pointer font-medium hover:bg-white/15"
        >
          🔦 টর্চলাইট
        </button>
      </div>

      {/* Stop / Speak Action Button */}
      <div className="flex items-center justify-center pb-3 z-10 staircase-5">
        {isListening ? (
          <button
            onClick={stopSession}
            className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-rose-600 to-red-600 border border-white/30 text-white font-bold text-xs shadow-[0_4px_25px_rgba(244,63,94,0.45)] hover:brightness-110 active:scale-95 transition cursor-pointer"
          >
            <Square className="w-4 h-4 fill-white" />
            <span>Tap to stop (থামুন)</span>
          </button>
        ) : (
          <button
            onClick={startListeningSession}
            className="flex items-center gap-2.5 px-7 py-3 rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 border border-white/40 text-slate-950 font-black text-xs shadow-[0_4px_25px_rgba(56,189,248,0.5)] hover:brightness-110 active:scale-95 transition cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
            <span>Tap to speak (কথা বলুন)</span>
          </button>
        )}
      </div>
    </div>
  );
};
