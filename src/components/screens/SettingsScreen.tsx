import React, { useState } from 'react';
import { 
  Mic, 
  Palette, 
  ShieldCheck, 
  Bell, 
  Wifi, 
  Info, 
  ChevronRight,
  Sparkles,
  Heart,
  CheckCircle2,
  X,
  FileCode,
  DownloadCloud,
  Smartphone,
  Monitor,
  Layers,
  Search,
  Grid,
  Radio,
  Cpu,
  Zap,
  Lock,
  ChevronDown
} from 'lucide-react';
import { ScreenType } from '../../types/assistant';
import { audioService } from '../../services/audioService';
import { downloadHtmlCodeZip } from '../../services/apkGenerator';
import { themeService } from '../../services/themeService';

interface SettingsScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onOpenApkModal: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onNavigate,
  onOpenApkModal
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const currentVoiceConfig = audioService.getConfig();
  const currentThemeConfig = themeService.getConfig();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-gradient-to-b from-[#050b1d] via-[#091533] to-[#040b1a] text-white select-none p-4 pb-20 overflow-y-auto space-y-4">
      {/* iOS Top Bar */}
      <div className="pt-1 px-1 flex items-center justify-between staircase-1">
        <h1 className="text-2xl font-black text-white tracking-tight font-sans">Settings</h1>
        <span className="text-[10px] bg-white/10 backdrop-blur-xl border border-white/20 px-2.5 py-1 rounded-full text-cyan-300 font-mono">
          iOS 26 Liquid
        </span>
      </div>

      {/* iOS Search Bar */}
      <div className="relative staircase-2">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search / সেটিংস খুঁজুন"
          className="w-full bg-white/10 backdrop-blur-2xl border border-white/15 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-400 focus:outline-hidden focus:border-cyan-400/60 shadow-xs"
        />
      </div>

      {/* In-app Toast Banner */}
      {toastMessage && (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-950/80 backdrop-blur-2xl border border-emerald-400/40 text-emerald-200 text-xs shadow-lg staircase-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Apple Profile Card */}
      <div 
        onClick={() => {
          audioService.playCyberChime('beep');
          showToast('Apple ID / AI Studio Sovereign Profile Active');
        }}
        className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-md cursor-pointer hover:bg-white/15 transition active:scale-[0.99] staircase-2"
      >
        <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-600 p-0.5 shadow-md">
          <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-white font-bold text-sm">
            SH
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-bold text-white truncate">SH Fahim</h3>
            <span className="text-[9px] bg-cyan-400/20 text-cyan-300 px-1.5 py-0.2 rounded-full font-mono">
              Pro
            </span>
          </div>
          <p className="text-[11px] text-slate-300 truncate mt-0.5">
            Apple ID, iCloud+, ৪২০ ফ্রাইডে স্যুট
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
      </div>

      {/* GROUP 1: CONNECTIVITY & SYSTEM APPS */}
      <div className="space-y-1.5 staircase-3">
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
          Wireless & Remote Control
        </h4>
        <div className="ios-grouped-table divide-y divide-white/10">
          {/* PC Control */}
          <div
            onClick={() => {
              audioService.playCyberChime('beep');
              onNavigate('pc-control');
            }}
            className="flex items-center justify-between p-3 hover:bg-white/10 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="ios-icon-squircle w-7 h-7 bg-blue-500">
                <Monitor className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Wi-Fi PC Control (পিসি কন্ট্রোল)</span>
                <span className="text-[10px] text-slate-400">মাউস, কিবোর্ড ও ওয়াইফাই ফাইল ট্রান্সফার</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-emerald-400 font-mono">Connected</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* System Apps */}
          <div
            onClick={() => {
              audioService.playCyberChime('beep');
              onNavigate('system-apps');
            }}
            className="flex items-center justify-between p-3 hover:bg-white/10 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="ios-icon-squircle w-7 h-7 bg-emerald-500">
                <Smartphone className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">সিস্টেম অ্যাপস কন্ট্রোলার</span>
                <span className="text-[10px] text-slate-400">ক্যামেরা, টর্চ, ডায়ালার ও ১৫টি সিস্টেম টুল</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400">15 Apps</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Connected Devices */}
          <div
            onClick={() => {
              audioService.playCyberChime('beep');
              onNavigate('connected-devices');
            }}
            className="flex items-center justify-between p-3 hover:bg-white/10 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="ios-icon-squircle w-7 h-7 bg-orange-500">
                <Radio className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Connected Devices</span>
                <span className="text-[10px] text-slate-400">ব্লুটুথ, এয়ারপ্লে ও পেয়ার্ড গ্যাজেট</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400">2 Paired</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* GROUP 2: INTELLIGENCE & 420 FRIDAY VOICE ENGINE */}
      <div className="space-y-1.5 staircase-4">
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
          Intelligence & Voice
        </h4>
        <div className="ios-grouped-table divide-y divide-white/10">
          {/* Voice & 420 Friday */}
          <div
            onClick={() => {
              audioService.playCyberChime('beep');
              onNavigate('voice-settings');
            }}
            className="flex items-center justify-between p-3 hover:bg-white/10 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="ios-icon-squircle w-7 h-7 bg-gradient-to-tr from-purple-600 to-indigo-500">
                <Mic className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Voice Engine & ৪২০ ফ্রাইডে</span>
                <span className="text-[10px] text-slate-400">
                  {currentVoiceConfig.selectedLanguage} • ওয়েক ওয়ার্ড • বয়স কন্ট্রোল
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-cyan-300 font-bold bg-cyan-500/20 px-2 py-0.5 rounded-full border border-cyan-400/40">
                ৪২০ ফ্রাইডে
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Open Source AI & Agent Hub */}
          <div
            onClick={() => {
              audioService.playCyberChime('beep');
              onNavigate('api-hub');
            }}
            className="flex items-center justify-between p-3 hover:bg-white/10 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="ios-icon-squircle w-7 h-7 bg-fuchsia-600">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Open-Source AI & Agent Hub</span>
                <span className="text-[10px] text-slate-400">Ollama, Hugging Face, OpenRouter, কাস্টম এপিআই</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-fuchsia-300">Free APIs</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* AI Settings */}
          <div
            onClick={() => {
              audioService.playCyberChime('beep');
              onNavigate('ai-settings');
            }}
            className="flex items-center justify-between p-3 hover:bg-white/10 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="ios-icon-squircle w-7 h-7 bg-cyan-600">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">AI Models & Reasoning</span>
                <span className="text-[10px] text-slate-400">Gemini 2.5 Flash, DeepSeek, Temperature</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400">Flash 2.5</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* GROUP 3: APPEARANCE, SECURITY & EXTENSIONS */}
      <div className="space-y-1.5 staircase-5">
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
          Design & Protection
        </h4>
        <div className="ios-grouped-table divide-y divide-white/10">
          {/* Appearance */}
          <div
            onClick={() => {
              audioService.playCyberChime('beep');
              onNavigate('appearance');
            }}
            className="flex items-center justify-between p-3 hover:bg-white/10 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="ios-icon-squircle w-7 h-7 bg-pink-500">
                <Palette className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Appearance & Themes (আইওএস ব্লার)</span>
                <span className="text-[10px] text-slate-400">{currentThemeConfig.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-pink-300 font-mono">iOS 26 Liquid</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Security & Permissions */}
          <div
            onClick={() => {
              audioService.playCyberChime('beep');
              onNavigate('security-permissions');
            }}
            className="flex items-center justify-between p-3 hover:bg-white/10 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="ios-icon-squircle w-7 h-7 bg-rose-600">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Security & Permissions (নিরাপত্তা)</span>
                <span className="text-[10px] text-slate-400">বায়োমেট্রিক, মিলিটারি এনক্রিপশন ও অ্যাপ লক</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-emerald-400 font-mono">Audited</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Plugins */}
          <div
            onClick={() => {
              audioService.playCyberChime('beep');
              onNavigate('plugins');
            }}
            className="flex items-center justify-between p-3 hover:bg-white/10 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="ios-icon-squircle w-7 h-7 bg-indigo-600">
                <Grid className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Plugins & Software Library</span>
                <span className="text-[10px] text-slate-400">14+ সফটওয়্যার ও ফিচার প্লাগইনস</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-indigo-300">14 Active</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* GROUP 4: SOFTWARE UPDATES & SYSTEM EXPORTS */}
      <div className="space-y-1.5 staircase-6">
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
          System & Updates
        </h4>
        <div className="ios-grouped-table divide-y divide-white/10">
          {/* Software & Auto Update */}
          <div
            onClick={() => {
              audioService.playCyberChime('beep');
              onNavigate('software-update');
            }}
            className="flex items-center justify-between p-3 hover:bg-white/10 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="ios-icon-squircle w-7 h-7 bg-slate-600">
                <DownloadCloud className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Software Update (স্বয়ংক্রিয় আপডেট)</span>
                <span className="text-[10px] text-slate-400">ব্যাকগ্রাউন্ড সাইলেন্ট অটো-আপডেট ও ওটিএ সিস্টেম</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-cyan-300 font-mono">v2.6.0 (Latest)</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* HTML Code ZIP */}
          <div
            onClick={async () => {
              audioService.playCyberChime('beep');
              showToast('HTML Code ZIP ডাউনলোড হচ্ছে...');
              await downloadHtmlCodeZip();
            }}
            className="flex items-center justify-between p-3 hover:bg-white/10 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="ios-icon-squircle w-7 h-7 bg-amber-600">
                <FileCode className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">HTML Code ZIP (ওয়েব সোর্স)</span>
                <span className="text-[10px] text-slate-400">Standalone HTML5 + React 19 সম্পূর্ণ কোড</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          {/* Android APK */}
          <div
            onClick={() => {
              audioService.playCyberChime('beep');
              onOpenApkModal();
            }}
            className="flex items-center justify-between p-3 hover:bg-white/10 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="ios-icon-squircle w-7 h-7 bg-emerald-600">
                <Smartphone className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Android APK Export (মোবাইল অ্যাপ)</span>
                <span className="text-[10px] text-slate-400">SDK 36, Java 21, WebAPK & Gradle বিল্ড</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-emerald-400 font-mono">Ready</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* About */}
          <div
            onClick={() => {
              audioService.playCyberChime('beep');
              showToast('SH AI Assistant v2.6.0. Next-Gen Cupertino & 420 Friday Architecture.');
            }}
            className="flex items-center justify-between p-3 hover:bg-white/10 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="ios-icon-squircle w-7 h-7 bg-blue-600">
                <Info className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">About SH AI Assistant</span>
                <span className="text-[10px] text-slate-400">Apple iOS 26 Liquid • Android 16 • F.R.I.D.A.Y. 420</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400">2.6.0</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* iOS Footer Card */}
      <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-center staircase-7">
        <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <span>Crafted with</span>
          <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          <span>for SH Fahim • Apple iOS 26 Design</span>
        </p>
        <span className="text-[9px] text-slate-500 font-mono mt-1 block">
          Model: Apple iOS 26 Sovereign • Engine: ৪২০ ফ্রাইডে
        </span>
      </div>
    </div>
  );
};
