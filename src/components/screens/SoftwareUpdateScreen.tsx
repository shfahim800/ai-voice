import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  DownloadCloud, 
  RefreshCw, 
  CheckCircle2, 
  Sparkles, 
  Smartphone, 
  Layers, 
  ShieldCheck, 
  GitBranch, 
  HardDrive, 
  Clock, 
  ChevronRight, 
  FileCheck, 
  Zap, 
  Radio, 
  ExternalLink,
  Sliders,
  Check,
  CheckCircle,
  Bell,
  Cpu
} from 'lucide-react';
import { audioService } from '../../services/audioService';
import { autoUpdateService, RELEASE_CATALOG } from '../../services/autoUpdateService';
import confetti from 'canvas-confetti';

interface SoftwareUpdateScreenProps {
  onBack: () => void;
  onOpenApkModal: () => void;
}

export const SoftwareUpdateScreen: React.FC<SoftwareUpdateScreenProps> = ({
  onBack,
  onOpenApkModal
}) => {
  const [updateConfig, setUpdateConfig] = useState(autoUpdateService.getConfig());
  const [isChecking, setIsChecking] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [downloadInfo, setDownloadInfo] = useState(autoUpdateService.getDownloadProgress());

  useEffect(() => {
    const unsub = autoUpdateService.subscribe(() => {
      setUpdateConfig(autoUpdateService.getConfig());
      setDownloadInfo(autoUpdateService.getDownloadProgress());
      const notif = autoUpdateService.getNotification();
      if (notif) {
        setToastMessage(notif);
      }
    });
    return () => unsub();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleManualCheck = async () => {
    audioService.playCyberChime('activate');
    setIsChecking(true);
    triggerToast('সার্ভারে নতুন ভার্সন চেক করা হচ্ছে...');

    const hasNew = await autoUpdateService.checkForUpdates(false);
    setIsChecking(false);

    if (hasNew) {
      audioService.playCyberChime('success');
      triggerToast('নতুন ভার্সন পাওয়া গেছে! স্বয়ংক্রিয় ডাউনলোড শুরু হচ্ছে...');
    } else {
      audioService.playCyberChime('beep');
      triggerToast('আপনার অ্যাপ ইতিমধ্যেই লেটেস্ট ভার্সনে আপ-টু-ডেট আছে।');
    }
  };

  const handleApplyNow = () => {
    audioService.playCyberChime('activate');
    autoUpdateService.applyUpdateSilently();
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f0ff', '#10b981', '#38bdf8']
      });
    } catch {}
    triggerToast('নতুন সফটওয়্যার আপডেট সফলভাবে ইনস্টল করা হয়েছে!');
  };

  const isAvailable = autoUpdateService.isUpdateAvailable();

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#030712] select-none p-4 pb-20 overflow-y-auto space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
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
              <DownloadCloud className="w-4 h-4 text-cyan-400" />
              Software & Auto Update
            </h2>
            <p className="text-[10px] text-cyan-400 font-medium">স্বয়ংক্রিয় সফটওয়্যার আপডেট সিস্টেম</p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          Auto-OTA
        </span>
      </div>

      {/* Toast feedback */}
      {toastMessage && (
        <div className="p-2.5 rounded-xl bg-cyan-950/90 border border-cyan-400/80 text-cyan-200 text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(56,189,248,0.3)] animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Automated Update Card */}
      <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-[#071a2e] via-[#0b2442] to-[#041221] border border-cyan-500/40 shadow-[0_8px_32px_rgba(56,189,248,0.2)]">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono font-bold text-cyan-400 tracking-wider">
              System Version Status
            </span>
            <h3 className="text-base font-bold text-white flex items-center gap-1.5">
              {updateConfig.installedVersion}
            </h3>
            <p className="text-[11px] text-slate-300">
              {updateConfig.autoCheckEnabled 
                ? 'স্বয়ংক্রিয় আপডেট সক্রিয়: নতুন ফিচার আসলে ব্যাকগ্রাউন্ডে একা একাই আপডেট হয়ে যাবে।'
                : 'স্বয়ংক্রিয় আপডেট বন্ধ রয়েছে।'}
            </p>
          </div>

          <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-5 h-5 animate-spin-slow" />
          </div>
        </div>

        {/* Progress bar if downloading */}
        {downloadInfo.isDownloading && (
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between text-[10px] text-cyan-300">
              <span>ব্যাকগ্রাউন্ডে সাইলেন্ট ডাউনলোড হচ্ছে...</span>
              <span>{downloadInfo.progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300"
                style={{ width: `${downloadInfo.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Available update banner */}
        {isAvailable && !downloadInfo.isDownloading && (
          <div className="mt-3 p-2.5 rounded-xl bg-cyan-900/40 border border-cyan-400/50 flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[10px] text-cyan-300 font-bold uppercase">Pending Update Ready</p>
              <p className="text-xs font-bold text-white truncate">{updateConfig.pendingVersion}</p>
            </div>
            <button
              onClick={handleApplyNow}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition shrink-0"
            >
              Apply Now
            </button>
          </div>
        )}

        {/* Action button */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleManualCheck}
            disabled={isChecking}
            className="flex-1 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-cyan-400 active:scale-95 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'চেক করা হচ্ছে...' : 'Check for Updates Now'}</span>
          </button>
        </div>
      </div>

      {/* Automatic Silent Update Settings */}
      <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-bold text-white">Automatic Silent Update Settings</h4>
        </div>

        {/* Toggle 1: Auto-check */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <p className="text-xs font-bold text-white">ব্যাকগ্রাউন্ডে অটোমেটিক আপডেট চেক</p>
            <p className="text-[10px] text-slate-400">নতুন আপডেট আসলে স্বয়ংক্রিয়ভাবে খুঁজে নিবে</p>
          </div>
          <button
            onClick={() => {
              audioService.playCyberChime('beep');
              autoUpdateService.updateConfig({ autoCheckEnabled: !updateConfig.autoCheckEnabled });
              triggerToast(updateConfig.autoCheckEnabled ? 'অটো-চেক বন্ধ করা হয়েছে' : 'অটো-চেক সক্রিয় করা হয়েছে');
            }}
            className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
              updateConfig.autoCheckEnabled ? 'bg-cyan-500 shadow-[0_0_10px_rgba(56,189,248,0.5)]' : 'bg-slate-800'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
              updateConfig.autoCheckEnabled ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Toggle 2: Silent Download */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <p className="text-xs font-bold text-white">সাইলেন্ট অটোমেটিক ডাউনলোড</p>
            <p className="text-[10px] text-slate-400">আপনাকে বিরক্ত না করে ব্যাকগ্রাউন্ডে ডাউনলোড হবে</p>
          </div>
          <button
            onClick={() => {
              audioService.playCyberChime('beep');
              autoUpdateService.updateConfig({ silentDownloadEnabled: !updateConfig.silentDownloadEnabled });
            }}
            className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
              updateConfig.silentDownloadEnabled ? 'bg-cyan-500 shadow-[0_0_10px_rgba(56,189,248,0.5)]' : 'bg-slate-800'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
              updateConfig.silentDownloadEnabled ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Toggle 3: Auto-Install on Wi-Fi */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <p className="text-xs font-bold text-white">ওয়াইফাই থাকলে অটো-ইনস্টল (Zero Touch)</p>
            <p className="text-[10px] text-slate-400">কিছু না করেই নতুন নতুন ফিচার অটোমেটিক পেয়ে যাবেন</p>
          </div>
          <button
            onClick={() => {
              audioService.playCyberChime('beep');
              autoUpdateService.updateConfig({ autoInstallOnWifi: !updateConfig.autoInstallOnWifi });
            }}
            className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
              updateConfig.autoInstallOnWifi ? 'bg-cyan-500 shadow-[0_0_10px_rgba(56,189,248,0.5)]' : 'bg-slate-800'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
              updateConfig.autoInstallOnWifi ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Release Channel Switcher */}
        <div className="pt-2">
          <label className="text-[10px] text-slate-400 uppercase font-mono">আপডেট চ্যানেল (Update Channel)</label>
          <div className="grid grid-cols-3 gap-1.5 mt-1.5">
            {(['stable', 'beta', 'canary'] as const).map((ch) => (
              <button
                key={ch}
                onClick={() => {
                  audioService.playCyberChime('beep');
                  autoUpdateService.updateConfig({ channel: ch });
                  triggerToast(`Channel set to ${ch.toUpperCase()}`);
                }}
                className={`py-1.5 rounded-lg text-[10px] font-bold uppercase transition ${
                  updateConfig.channel === ch
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(56,189,248,0.3)]'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Release Notes Changelog */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-300">নতুন ভার্সনের ফিচারসমূহ (What's New)</label>
        {RELEASE_CATALOG.map((rel) => (
          <div key={rel.version} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{rel.version}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  {rel.channel}
                </span>
              </div>
              <span className="text-[10px] text-slate-500">{rel.downloadSize}</span>
            </div>
            <ul className="space-y-1 text-[11px] text-slate-300 pl-4 list-disc marker:text-cyan-400">
              {rel.changes.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Physical APK Download Option */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-cyan-950/30 to-slate-900/60 border border-cyan-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Download Offline APK</h4>
            <p className="text-[10px] text-slate-400">Install standalone Android package</p>
          </div>
        </div>
        <button
          onClick={onOpenApkModal}
          className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 active:scale-95 transition"
        >
          Export APK
        </button>
      </div>
    </div>
  );
};
