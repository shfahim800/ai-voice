import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Wifi, 
  Mic, 
  MessageSquare, 
  Monitor, 
  Wrench, 
  Layers, 
  Cpu, 
  ChevronRight,
  Sparkles,
  Download,
  Smartphone,
  FolderSync,
  Radio,
  Sliders,
  Settings,
  ShieldCheck,
  DownloadCloud,
  CheckCircle,
  Play,
  Share2
} from 'lucide-react';
import { ScreenType, AppTheme } from '../../types/assistant';
import { audioService } from '../../services/audioService';
import { themeService } from '../../services/themeService';
import { apiHubService } from '../../services/apiHubService';
import { pcControlService } from '../../services/pcControlService';
import { autoUpdateService } from '../../services/autoUpdateService';
import { BatteryWidget } from '../widgets/BatteryWidget';

interface HomeScreenProps {
  userName: string;
  onNavigate: (screen: ScreenType) => void;
  onOpenApkModal: () => void;
  activePluginCount?: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userName = 'SH Fahim',
  onNavigate,
  onOpenApkModal,
  activePluginCount = 14,
}) => {
  const [theme, setTheme] = useState<AppTheme>(themeService.getTheme());
  const [activeAgent, setActiveAgent] = useState(apiHubService.getActiveAgent());
  const [pcConfig, setPcConfig] = useState(pcControlService.getConfig());
  const [updateNotif, setUpdateNotif] = useState(autoUpdateService.getNotification());
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const unsubTheme = themeService.subscribe((t) => setTheme(t));
    const unsubAgent = apiHubService.subscribe(() => setActiveAgent(apiHubService.getActiveAgent()));
    const unsubPc = pcControlService.subscribe(() => setPcConfig(pcControlService.getConfig()));
    const unsubUpdate = autoUpdateService.subscribe(() => setUpdateNotif(autoUpdateService.getNotification()));

    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateClock();
    const timer = setInterval(updateClock, 10000);

    return () => {
      unsubTheme();
      unsubAgent();
      unsubPc();
      unsubUpdate();
      clearInterval(timer);
    };
  }, []);

  const handleTileClick = (screen: ScreenType) => {
    audioService.playCyberChime('beep');
    onNavigate(screen);
  };

  const isIos = theme === 'ios-26-liquid' || theme === 'ios-blur' || theme === 'ios-glass-clear';
  const timeGreeting = audioService.getTimeGreeting();

  const getGlassCardStyle = () => {
    if (theme === 'ios-26-liquid') {
      return 'backdrop-blur-3xl bg-white/[0.12] border border-white/25 shadow-[0_12px_40px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.35)] text-white hover:border-white/40';
    }
    if (theme === 'ios-blur') {
      return 'backdrop-blur-2xl bg-white/[0.08] border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.37)] text-white hover:border-white/40';
    }
    if (theme === 'cyberpunk-neon') {
      return 'bg-[#060b1c]/95 border-2 border-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:border-[#ff0055] text-white';
    }
    return 'bg-gradient-to-r from-[#0c1e33] to-[#081526] border border-cyan-500/30 shadow-[0_4px_25px_rgba(8,47,73,0.35)] text-white';
  };

  // Apple-style squircle app models
  const appleApps = [
    {
      id: 'voice',
      name: 'Voice AI',
      subtitle: '৪২০ ফ্রাইডে',
      screen: 'voice' as ScreenType,
      gradient: 'from-sky-400 via-blue-500 to-indigo-600',
      icon: Mic,
      badge: '৪২০'
    },
    {
      id: 'pc-control',
      name: 'PC Control',
      subtitle: 'ওয়াইফাই মাউস/কিবোর্ড',
      screen: 'pc-control' as ScreenType,
      gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
      icon: Monitor,
      badge: pcConfig.connected ? 'Online' : 'Offline'
    },
    {
      id: 'api-hub',
      name: 'Agent Hub',
      subtitle: 'ওপেন সোর্স এআই',
      screen: 'api-hub' as ScreenType,
      gradient: 'from-violet-500 via-purple-600 to-fuchsia-600',
      icon: Layers,
      badge: activeAgent?.type || 'Ollama'
    },
    {
      id: 'system-apps',
      name: 'System Apps',
      subtitle: 'ফোন কন্ট্রোল',
      screen: 'system-apps' as ScreenType,
      gradient: 'from-amber-400 via-orange-500 to-rose-500',
      icon: Smartphone,
      badge: '15 Apps'
    },
    {
      id: 'social-media',
      name: 'Social AI',
      subtitle: 'সোশ্যাল মিডিয়া',
      screen: 'social-media' as ScreenType,
      gradient: 'from-blue-500 via-indigo-600 to-pink-500',
      icon: Share2,
      badge: 'Voice'
    },
    {
      id: 'chat',
      name: 'AI Chat',
      subtitle: 'স্মার্ট চ্যাট',
      screen: 'chat' as ScreenType,
      gradient: 'from-cyan-400 via-sky-500 to-blue-600',
      icon: MessageSquare,
      badge: undefined
    },
    {
      id: 'tools',
      name: 'Smart Tools',
      subtitle: 'টুলস ও গ্যাজেট',
      screen: 'tools' as ScreenType,
      gradient: 'from-pink-500 via-rose-500 to-red-600',
      icon: Wrench,
      badge: undefined
    },
    {
      id: 'plugins',
      name: 'Plugins',
      subtitle: 'ফিউচার সফটওয়্যার',
      screen: 'plugins' as ScreenType,
      gradient: 'from-indigo-400 via-blue-600 to-purple-700',
      icon: Cpu,
      badge: `${activePluginCount}`
    },
    {
      id: 'software-update',
      name: 'Auto Update',
      subtitle: 'সাইলেন্ট আপডেট',
      screen: 'software-update' as ScreenType,
      gradient: 'from-teal-400 via-emerald-500 to-green-600',
      icon: DownloadCloud,
      badge: 'OTA'
    }
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 overflow-y-auto space-y-3.5 pb-24 select-none relative">
      {/* iOS 26 Dynamic Island & Status Pill */}
      <div className="flex items-center justify-between pt-1 staircase-1">
        <button 
          onClick={() => onNavigate('settings')}
          className="w-9 h-9 rounded-[18px] bg-white/10 backdrop-blur-2xl border border-white/20 flex items-center justify-center text-slate-200 hover:text-cyan-400 transition active:scale-95 shadow-sm cursor-pointer"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Dynamic Island Capsule */}
        <div 
          onClick={() => onNavigate('api-hub')}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-white/20 backdrop-blur-3xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer hover:border-cyan-400/50 transition active:scale-98"
        >
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-[11px] font-bold text-white tracking-wide font-mono">
            {timeStr || '12:00'}
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-[10px] text-cyan-300 font-bold truncate max-w-[100px]">
            ৪২০ ফ্রাইডে
          </span>
        </div>

        <button 
          onClick={() => onNavigate('connected-devices')}
          className="w-9 h-9 rounded-[18px] bg-white/10 backdrop-blur-2xl border border-white/20 flex items-center justify-center text-emerald-400 transition active:scale-95 shadow-sm cursor-pointer"
          title="Network & Devices"
        >
          <Wifi className="w-4 h-4" />
        </button>
      </div>

      {/* Auto-Update Silent Notification Banner if present */}
      {updateNotif && (
        <div 
          onClick={() => onNavigate('software-update')}
          className="p-2.5 rounded-2xl bg-cyan-950/90 border border-cyan-400/70 text-cyan-200 text-xs flex items-center justify-between shadow-[0_0_20px_rgba(56,189,248,0.25)] animate-fade-in cursor-pointer staircase-2"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-[11px] font-medium">{updateNotif}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0" />
        </div>
      )}

      {/* Hero iOS 26 Liquid Frosted Card */}
      <div className={`relative overflow-hidden rounded-[26px] p-4 transition-all duration-300 staircase-2 ${getGlassCardStyle()}`}>
        {/* Soft specular light curve */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />

        <div className="flex items-center gap-3.5 relative z-10">
          {/* Avatar with Apple glowing bezel */}
          <div className="relative shrink-0">
            <div className="w-13 h-13 rounded-[20px] bg-gradient-to-tr from-cyan-400 via-sky-400 to-indigo-600 p-[2px] shadow-[0_4px_20px_rgba(56,189,248,0.45)]">
              <div className="w-full h-full rounded-[18px] bg-[#030712] flex items-center justify-center overflow-hidden">
                <span className="text-lg font-bold bg-gradient-to-r from-cyan-300 to-sky-400 bg-clip-text text-transparent">
                  SH
                </span>
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#030712] rounded-full" />
          </div>

          {/* User info with dynamic time greeting */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-mono font-bold text-cyan-400 flex items-center gap-1">
                <span>{timeGreeting.icon}</span>
                <span>{timeGreeting.periodBn} • iOS 26 Liquid</span>
              </span>
            </div>
            <h3 className="text-sm font-bold text-white truncate">
              {timeGreeting.greetingBn} {userName}
            </h3>
            <p className="text-[11px] text-slate-300 truncate">
              ৪২০ ফ্রাইডে: {pcConfig.connected ? `PC সিঙ্কড (${pcConfig.ip})` : 'স্ট্যান্ডবাই'}
            </p>
          </div>
        </div>
      </div>

      {/* Battery Widget */}
      <div className="staircase-3">
        <BatteryWidget />
      </div>

      {/* Quick Launch Action Cards (Voice & PC) */}
      <div className="grid grid-cols-2 gap-2.5 staircase-4">
        {/* Voice Trigger Card */}
        <div
          onClick={() => handleTileClick('voice')}
          className={`cursor-pointer rounded-[22px] p-3.5 transition active:scale-[0.97] flex flex-col justify-between ${getGlassCardStyle()}`}
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-[16px] bg-sky-500/20 text-sky-400 border border-sky-400/40 flex items-center justify-center">
              <Mic className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-bold text-sky-300 uppercase px-1.5 py-0.5 rounded-full bg-sky-950/60 border border-sky-500/30">
              ৪২০ ফ্রাইডে
            </span>
          </div>
          <div className="mt-2.5">
            <h4 className="text-xs font-bold text-white">Voice Assistant</h4>
            <p className="text-[10px] text-slate-400">৪২০ ফ্রাইডে সক্রিয় করুন</p>
          </div>
        </div>

        {/* PC Control Trigger Card */}
        <div
          onClick={() => handleTileClick('pc-control')}
          className={`cursor-pointer rounded-[22px] p-3.5 transition active:scale-[0.97] flex flex-col justify-between ${getGlassCardStyle()}`}
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-[16px] bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 flex items-center justify-center">
              <Monitor className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-bold text-emerald-300 uppercase px-1.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30">
              Wi-Fi
            </span>
          </div>
          <div className="mt-2.5">
            <h4 className="text-xs font-bold text-white">PC Trackpad</h4>
            <p className="text-[10px] text-slate-400">মাউস ও ফাইল ট্রান্সফার</p>
          </div>
        </div>
      </div>

      {/* Apple iOS 26 Squircle App Grid */}
      <div className="space-y-2 pt-1 staircase-5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Applications & Tools
          </span>
          <span className="text-[10px] text-cyan-400 font-mono">Apple Squircle Model</span>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {appleApps.map((app) => {
            const Icon = app.icon;
            return (
              <div
                key={app.id}
                onClick={() => handleTileClick(app.screen)}
                className="flex flex-col items-center group cursor-pointer active:scale-90 transition-transform duration-150"
              >
                {/* Apple Squircle Icon with specular top shine */}
                <div className={`relative w-14 h-14 rounded-[22px] bg-gradient-to-br ${app.gradient} p-0.5 shadow-[0_8px_20px_rgba(0,0,0,0.45)] group-hover:shadow-[0_12px_28px_rgba(56,189,248,0.35)] transition-all`}>
                  {/* Subtle inner gloss curve */}
                  <div className="absolute inset-0 rounded-[21px] bg-gradient-to-b from-white/30 via-transparent to-black/20 pointer-events-none" />
                  
                  <div className="w-full h-full rounded-[20px] flex items-center justify-center text-white">
                    <Icon className="w-6 h-6 stroke-[2.2] drop-shadow-md" />
                  </div>

                  {/* Badge Counter */}
                  {app.badge && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-rose-500 border border-white text-[9px] font-bold text-white shadow-md">
                      {app.badge}
                    </span>
                  )}
                </div>

                {/* App Label */}
                <span className="text-[11px] font-medium text-slate-200 mt-1.5 text-center leading-tight truncate w-full px-0.5">
                  {app.name}
                </span>
                <span className="text-[9px] text-slate-500 truncate w-full text-center">
                  {app.subtitle}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Apple iOS 26 Dynamic Glass Dock */}
      <div className="fixed bottom-3 left-4 right-4 max-w-sm mx-auto z-40 staircase-6">
        <div className="ios-glass-dock rounded-[28px] p-2 flex items-center justify-around shadow-2xl border border-white/20">
          <button
            onClick={() => handleTileClick('home')}
            className="w-11 h-11 rounded-[18px] bg-cyan-500/20 text-cyan-300 flex items-center justify-center transition active:scale-90"
            title="Home"
          >
            <Sparkles className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleTileClick('chat')}
            className="w-11 h-11 rounded-[18px] bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition active:scale-90"
            title="AI Chat"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleTileClick('voice')}
            className="w-12 h-12 rounded-[20px] bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-[0_4px_20px_rgba(56,189,248,0.5)] transition active:scale-90 -mt-2"
            title="Voice Assistant"
          >
            <Mic className="w-6 h-6 stroke-[2.4]" />
          </button>
          <button
            onClick={() => handleTileClick('pc-control')}
            className="w-11 h-11 rounded-[18px] bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition active:scale-90"
            title="PC Control"
          >
            <Monitor className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleTileClick('settings')}
            className="w-11 h-11 rounded-[18px] bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition active:scale-90"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
