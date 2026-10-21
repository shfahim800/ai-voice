import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Mic, 
  MicOff, 
  Send, 
  Share2, 
  Play, 
  Search, 
  Sparkles, 
  MessageSquare, 
  Video, 
  Compass, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  Copy, 
  RefreshCw,
  Phone,
  Flame,
  Music,
  Plus
} from 'lucide-react';
import { audioService } from '../../services/audioService';
import { 
  socialMediaService, 
  SocialPlatformId, 
  SocialActionType,
  SocialHistoryItem 
} from '../../services/socialMediaService';

interface SocialMediaScreenProps {
  onBack: () => void;
  onNavigate?: (screen: any) => void;
}

export const SocialMediaScreen: React.FC<SocialMediaScreenProps> = ({ onBack, onNavigate }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatformId | 'all'>('all');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceFeedback, setVoiceFeedback] = useState<string | null>(null);

  // Post composer state
  const [composerText, setComposerText] = useState('আজকের দিনটি শুভ হোক! ৪২০ ফ্রাইডে এআই দিয়ে পোস্ট করছি ✨');
  const [targetPlatforms, setTargetPlatforms] = useState<Record<SocialPlatformId, boolean>>({
    facebook: true,
    threads: true,
    twitter: true,
    instagram: false,
    whatsapp: false,
    tiktok: false,
    youtube: false
  });

  // WhatsApp sender state
  const [waPhone, setWaPhone] = useState('+8801700000000');
  const [waMessage, setWaMessage] = useState('হ্যালো! ৪২০ ফ্রাইডে ভয়েস অ্যাসিস্ট্যান্ট থেকে মেসেজ পাঠাচ্ছি।');

  // YouTube search state
  const [ytQuery, setYtQuery] = useState('Bangla Relaxing Lo-Fi Songs 2026');
  const [activeYtVideo, setActiveYtVideo] = useState<string | null>(null);

  // TikTok tag state
  const [tiktokTag, setTiktokTag] = useState('bangladesh');

  // Activity History
  const [history, setHistory] = useState<SocialHistoryItem[]>(socialMediaService.getHistory());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      audioService.stopListening();
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const startVoiceController = () => {
    audioService.playCyberChime('activate');
    setIsVoiceActive(true);
    setVoiceTranscript('');
    setVoiceFeedback('সোশ্যাল মিডিয়া ভয়েস কমান্ড শুনছি... বলুন!');

    const started = audioService.startListening(
      (text) => {
        setVoiceTranscript(text);
        if (text.length > 2) {
          audioService.stopListening();
          setIsVoiceActive(false);

          const result = socialMediaService.processVoiceCommand(text);
          if (result.matched) {
            setVoiceFeedback(result.speechReply);
            audioService.speak(result.speechReply);
            audioService.playCyberChime('success');
            setHistory(socialMediaService.getHistory());

            if (result.deepLink) {
              setTimeout(() => {
                window.open(result.deepLink, '_blank', 'noopener,noreferrer');
              }, 1200);
            }
          } else {
            const fallbackReply = `কমান্ডটি বুঝেছি: "${text}"। নিচের সোশ্যাল মিডিয়া বাটন থেকে সরাসরি পোস্ট বা সার্চ করতে পারেন।`;
            setVoiceFeedback(fallbackReply);
            audioService.speak(fallbackReply);
          }
        }
      },
      (err) => {
        setIsVoiceActive(false);
        setVoiceFeedback('মাইক্রোফোন সংযোগে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন বা নিচের কমান্ড চাপুন।');
      },
      'bn-BD'
    );

    if (!started) {
      setIsVoiceActive(false);
      setVoiceFeedback('ভয়েস রিকগনিশন সাপোর্ট ব্রাউজারে সক্রিয় করুন।');
    }
  };

  const handleExecuteVoiceChip = (cmdText: string) => {
    audioService.playCyberChime('beep');
    setVoiceTranscript(cmdText);
    const result = socialMediaService.processVoiceCommand(cmdText);
    if (result.matched) {
      setVoiceFeedback(result.speechReply);
      audioService.speak(result.speechReply);
      audioService.playCyberChime('success');
      setHistory(socialMediaService.getHistory());

      if (result.deepLink) {
        setTimeout(() => {
          window.open(result.deepLink, '_blank', 'noopener,noreferrer');
        }, 800);
      }
    }
  };

  const handleDirectAction = (platform: SocialPlatformId, action: SocialActionType, payload?: any) => {
    audioService.playCyberChime('activate');
    const result = socialMediaService.executeAction(platform, action, payload);
    setHistory(socialMediaService.getHistory());
    showToast(`${platform.toUpperCase()} ${action} চালু হয়েছে`);
  };

  const handleMultiPostPublish = () => {
    if (!composerText.trim()) return;
    audioService.playCyberChime('success');

    let count = 0;
    Object.entries(targetPlatforms).forEach(([plat, enabled]) => {
      if (enabled) {
        count++;
        socialMediaService.executeAction(plat as SocialPlatformId, 'post', { text: composerText });
      }
    });

    setHistory(socialMediaService.getHistory());
    showToast(`${count}টি প্ল্যাটফর্মে পোস্ট প্রস্তুত হয়েছে!`);
  };

  const handleSendWhatsApp = () => {
    if (!waMessage.trim()) return;
    audioService.playCyberChime('activate');
    socialMediaService.executeAction('whatsapp', 'message', { phone: waPhone, text: waMessage });
    setHistory(socialMediaService.getHistory());
    showToast('হোয়াটসঅ্যাপ মেসেজ পাঠানো হচ্ছে');
  };

  const handleSearchYouTube = () => {
    if (!ytQuery.trim()) return;
    audioService.playCyberChime('activate');
    socialMediaService.executeAction('youtube', 'search', { query: ytQuery });
    setHistory(socialMediaService.getHistory());
  };

  const platformsList = [
    { id: 'all', label: 'সবগুলো (All)' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'whatsapp', label: 'WhatsApp' },
    { id: 'youtube', label: 'YouTube' },
    { id: 'tiktok', label: 'TikTok' },
    { id: 'threads', label: 'Threads' },
    { id: 'twitter', label: 'X (Twitter)' }
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#030712] select-none p-4 pb-20 overflow-y-auto space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-cyan-950/90 border border-cyan-400 text-cyan-200 text-xs font-semibold shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex items-center justify-between pt-1 staircase-1">
        <div className="flex items-center gap-2.5">
          <button 
            onClick={onBack}
            className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-cyan-400 transition active:scale-95"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-cyan-400" />
              Social Media AI Hub
            </h2>
            <p className="text-[10px] text-cyan-400 font-medium">ভয়েস ও অটোমেটেড সোশ্যাল মিডিয়া কন্ট্রোলার</p>
          </div>
        </div>

        <button
          onClick={startVoiceController}
          className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition active:scale-95 ${
            isVoiceActive 
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse'
              : 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/25'
          }`}
        >
          {isVoiceActive ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          <span>{isVoiceActive ? 'শুনছি...' : 'ভয়েস কন্ট্রোল'}</span>
        </button>
      </div>

      {/* Voice Assistant Live Feedback Card */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900/90 to-cyan-950/60 border border-cyan-500/30 shadow-[0_4px_20px_rgba(56,189,248,0.15)] staircase-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider">
              {isVoiceActive ? 'Voice Listening Active' : 'Friendly FRIDAY Voice Companion'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Bangla & English</span>
        </div>

        <p className="text-xs text-white leading-relaxed font-medium">
          {voiceFeedback || 'বলুন: "ফেসবুকে পোস্ট করো শুভ সকাল" অথবা "হোয়াটসঅ্যাপে মেসেজ পাঠাও" অথবা "ইউটিউবে গান চালাও"'}
        </p>

        {voiceTranscript && (
          <div className="mt-2 p-2 rounded-lg bg-black/40 border border-cyan-500/20 text-[11px] text-cyan-200">
            <span className="text-slate-400">শোনা গেছে: </span>"{voiceTranscript}"
          </div>
        )}

        {/* Quick Voice Command Chips */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
          <button 
            onClick={() => handleExecuteVoiceChip('ফেসবুকে পোস্ট করো শুভ সকাল বন্ধুরা!')}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-300 hover:bg-blue-500/30 transition active:scale-95"
          >
            📘 ফেসবুকে পোস্ট
          </button>
          <button 
            onClick={() => handleExecuteVoiceChip('হোয়াটসঅ্যাপে মেসেজ পাঠাও হ্যালো কেমন আছো')}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 transition active:scale-95"
          >
            💬 হোয়াটসঅ্যাপ মেসেজ
          </button>
          <button 
            onClick={() => handleExecuteVoiceChip('ইউটিউবে গান চালাও Bangla Chill Lo-Fi')}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30 transition active:scale-95"
          >
            ▶️ ইউটিউবে গান
          </button>
          <button 
            onClick={() => handleExecuteVoiceChip('ইন্সটাগ্রামে রিলস দেখাও')}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-pink-500/20 border border-pink-500/40 text-pink-300 hover:bg-pink-500/30 transition active:scale-95"
          >
            📸 ইন্সটা রিলস
          </button>
          <button 
            onClick={() => handleExecuteVoiceChip('টিকটকে ট্রেন্ডিং দেখাও')}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500/30 transition active:scale-95"
          >
            🎵 টিকটক ট্রেন্ড
          </button>
          <button 
            onClick={() => handleExecuteVoiceChip('থ্রেডসে পোস্ট করো নতুন আপডেট')}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-700/60 border border-slate-600 text-slate-200 hover:bg-slate-700 transition active:scale-95"
          >
            🧵 থ্রেডসে পোস্ট
          </button>
        </div>
      </div>

      {/* Platform Filter Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 staircase-3">
        {platformsList.map(p => (
          <button
            key={p.id}
            onClick={() => {
              audioService.playCyberChime('beep');
              setSelectedPlatform(p.id as any);
            }}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition active:scale-95 ${
              selectedPlatform === p.id 
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* 1. Multi-Platform Smart Post Composer */}
      {(selectedPlatform === 'all' || selectedPlatform === 'facebook' || selectedPlatform === 'threads' || selectedPlatform === 'twitter') && (
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 staircase-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Smart Social Post Composer (পোস্ট তৈরি)
            </h3>
            <span className="text-[10px] text-slate-400">Cross-Platform Sync</span>
          </div>

          <textarea
            value={composerText}
            onChange={(e) => setComposerText(e.target.value)}
            rows={3}
            placeholder="আপনার পোস্টের বার্তা লিখুন বা মুখে বলুন..."
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-400 resize-none"
          />

          {/* Platform Toggles */}
          <div className="flex items-center gap-3 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer text-blue-300">
              <input
                type="checkbox"
                checked={targetPlatforms.facebook}
                onChange={(e) => setTargetPlatforms(prev => ({ ...prev, facebook: e.target.checked }))}
                className="rounded accent-blue-500"
              />
              <span>Facebook</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-200">
              <input
                type="checkbox"
                checked={targetPlatforms.threads}
                onChange={(e) => setTargetPlatforms(prev => ({ ...prev, threads: e.target.checked }))}
                className="rounded accent-slate-400"
              />
              <span>Threads</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-sky-300">
              <input
                type="checkbox"
                checked={targetPlatforms.twitter}
                onChange={(e) => setTargetPlatforms(prev => ({ ...prev, twitter: e.target.checked }))}
                className="rounded accent-sky-500"
              />
              <span>X (Twitter)</span>
            </label>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => {
                audioService.playCyberChime('beep');
                setComposerText(prev => prev + ' 🚀 #SH_AI #Technology #2026');
              }}
              className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              + হ্যাশট্যাগ যোগ করো
            </button>

            <button
              onClick={handleMultiPostPublish}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/20 active:scale-95 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>পোস্ট পাবলিশ করো</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. WhatsApp Direct Messenger & Dialer */}
      {(selectedPlatform === 'all' || selectedPlatform === 'whatsapp') && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-teal-950/40 border border-emerald-500/30 space-y-3 staircase-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              WhatsApp Voice & Quick Messenger
            </h3>
            <span className="text-[10px] text-emerald-400 font-mono">Direct API Intent</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="sm:col-span-1">
              <label className="text-[10px] text-slate-400 block mb-1">ফোন নম্বর (Phone / Contact)</label>
              <input
                type="text"
                value={waPhone}
                onChange={(e) => setWaPhone(e.target.value)}
                placeholder="+8801700000000"
                className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-emerald-400 font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] text-slate-400 block mb-1">মেসেজ (Text / Voice Dictation)</label>
              <input
                type="text"
                value={waMessage}
                onChange={(e) => setWaMessage(e.target.value)}
                placeholder="মেসেজ লিখুন..."
                className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-emerald-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDirectAction('whatsapp', 'call', { phone: waPhone })}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-1 hover:bg-emerald-500/30 active:scale-95"
              >
                <Phone className="w-3 h-3" />
                কল ডায়াল
              </button>
              <button
                onClick={() => handleDirectAction('whatsapp', 'status', { text: waMessage })}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs hover:text-white active:scale-95"
              >
                স্ট্যাটাস দিন
              </button>
            </div>

            <button
              onClick={handleSendWhatsApp}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>হোয়াটসঅ্যাপ পাঠান</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. YouTube Full Command Center */}
      {(selectedPlatform === 'all' || selectedPlatform === 'youtube') && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-950/40 via-slate-900/90 to-rose-950/40 border border-red-500/30 space-y-3 staircase-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 text-red-400" />
              YouTube Command & Media Center (ইউটিউব অ্যাক্সেস)
            </h3>
            <span className="text-[10px] text-red-400 font-mono">Full Access</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={ytQuery}
              onChange={(e) => setYtQuery(e.target.value)}
              placeholder="সার্চ করুন বা বলুন: 'নতুন গান'..."
              className="grow p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-red-400"
            />
            <button
              onClick={handleSearchYouTube}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-600/30 active:scale-95 transition shrink-0"
            >
              <Search className="w-3.5 h-3.5" />
              <span>প্লে / সার্চ</span>
            </button>
          </div>

          {/* Quick YouTube categories */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => {
                setYtQuery('Bangla Chill Lo-Fi Beats');
                handleDirectAction('youtube', 'search', { query: 'Bangla Chill Lo-Fi Beats' });
              }}
              className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-red-500/40 text-left flex flex-col gap-1 active:scale-95"
            >
              <Music className="w-3.5 h-3.5 text-red-400" />
              <span className="text-[11px] font-bold text-white">Bangla Lo-Fi</span>
              <span className="text-[9px] text-slate-400">রিল্যাক্সিং মিউজিক</span>
            </button>

            <button
              onClick={() => handleDirectAction('youtube', 'shorts')}
              className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-red-500/40 text-left flex flex-col gap-1 active:scale-95"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-bold text-white">YouTube Shorts</span>
              <span className="text-[9px] text-slate-400">ট্রেন্ডিং শর্টস</span>
            </button>

            <button
              onClick={() => {
                setYtQuery('Top AI Tech News 2026');
                handleDirectAction('youtube', 'search', { query: 'Top AI Tech News 2026' });
              }}
              className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-red-500/40 text-left flex flex-col gap-1 active:scale-95"
            >
              <Video className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px] font-bold text-white">Tech & AI</span>
              <span className="text-[9px] text-slate-400">লেটেস্ট প্রযুক্তি</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Instagram & TikTok Explorer */}
      {(selectedPlatform === 'all' || selectedPlatform === 'instagram' || selectedPlatform === 'tiktok') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 staircase-7">
          {/* Instagram Actions */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-950/30 via-slate-900/90 to-purple-950/30 border border-pink-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-pink-400" />
                Instagram Hub
              </h3>
              <span className="text-[10px] text-pink-400">Reels & Story</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleDirectAction('instagram', 'reels')}
                className="p-2.5 rounded-xl bg-pink-500/15 border border-pink-500/30 hover:bg-pink-500/25 text-pink-200 font-semibold text-center active:scale-95 transition"
              >
                🎬 Trending Reels
              </button>
              <button
                onClick={() => handleDirectAction('instagram', 'story')}
                className="p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/30 hover:bg-purple-500/25 text-purple-200 font-semibold text-center active:scale-95 transition"
              >
                ✨ Add to Story
              </button>
              <button
                onClick={() => handleDirectAction('instagram', 'message')}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-semibold text-center active:scale-95 transition"
              >
                💬 Open Direct (DM)
              </button>
              <button
                onClick={() => handleDirectAction('instagram', 'post')}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-semibold text-center active:scale-95 transition"
              >
                📸 Main Feed
              </button>
            </div>
          </div>

          {/* TikTok Actions */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/30 via-slate-900/90 to-cyan-950/30 border border-purple-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-purple-400" />
                TikTok Viral Studio
              </h3>
              <span className="text-[10px] text-purple-400">Sounds & Tags</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tiktokTag}
                onChange={(e) => setTiktokTag(e.target.value)}
                placeholder="Tag name (e.g. viral)"
                className="grow p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-purple-400 font-mono"
              />
              <button
                onClick={() => handleDirectAction('tiktok', 'trending', { query: tiktokTag })}
                className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold active:scale-95 transition shrink-0"
              >
                ট্যাগ সার্চ
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleDirectAction('tiktok', 'trending')}
                className="p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-200 font-semibold text-center active:scale-95 transition"
              >
                🔥 Explore Viral
              </button>
              <button
                onClick={() => handleDirectAction('tiktok', 'trending', { query: 'trending_sounds' })}
                className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-200 font-semibold text-center active:scale-95 transition"
              >
                🎵 Trending Audio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Live Activity Timeline */}
      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2.5 staircase-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            Social Action History (সাম্প্রতিক কার্যক্রম)
          </h3>
          <button
            onClick={() => {
              socialMediaService.clearHistory();
              setHistory([]);
            }}
            className="text-[10px] text-slate-500 hover:text-rose-400 transition"
          >
            ক্লিয়ার
          </button>
        </div>

        <div className="space-y-1.5">
          {history.length === 0 ? (
            <p className="text-[11px] text-slate-500 text-center py-2">কোনো সাম্প্রতিক কার্যক্রম নেই।</p>
          ) : (
            history.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white uppercase text-[10px] tracking-wider">{item.platform}</span>
                      <span className="text-[10px] text-slate-400 font-mono">· {item.action}</span>
                    </div>
                    {item.text && (
                      <p className="text-[11px] text-slate-300 truncate max-w-[200px] sm:max-w-xs">{item.text}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-slate-500 font-mono">{item.timestamp}</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 text-[9px] font-mono font-bold">
                    {item.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
