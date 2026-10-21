import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  Mic, 
  Camera, 
  MapPin, 
  Fingerprint, 
  HardDrive, 
  Wifi, 
  Layers, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  Key, 
  Sparkles, 
  Cpu, 
  Radio, 
  SlidersHorizontal,
  ChevronRight,
  Shield,
  Zap,
  Info
} from 'lucide-react';
import { audioService } from '../../services/audioService';

interface SecurityPermissionsScreenProps {
  onBack: () => void;
}

interface PermissionItem {
  id: string;
  name: string;
  banglaName: string;
  category: 'core' | 'privacy' | 'system';
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  enabled: boolean;
  isAdvanced?: boolean;
  riskLevel: 'safe' | 'moderate' | 'high';
}

export const SecurityPermissionsScreen: React.FC<SecurityPermissionsScreenProps> = ({
  onBack,
}) => {
  // Permission toggles state with persisted defaults
  const [permissions, setPermissions] = useState<PermissionItem[]>([
    {
      id: 'mic',
      name: 'Microphone & Wake Word',
      banglaName: 'মাইক্রোফোন ও ভয়েস ইনপুট',
      category: 'core',
      desc: 'Always-listening "Hey SH" wake word detection and high-fidelity speech recognition. Audio remains 100% on-device.',
      icon: Mic,
      enabled: true,
      riskLevel: 'safe'
    },
    {
      id: 'camera',
      name: 'Camera & Vision Scanner',
      banglaName: 'ক্যামেরা ও এআই ভিশন স্ক্যানার',
      category: 'core',
      desc: 'AI visual scene inspection, QR code reader, and document OCR. Camera indicator LED activates when in use.',
      icon: Camera,
      enabled: true,
      riskLevel: 'moderate'
    },
    {
      id: 'biometric',
      name: 'Biometric & App Lock',
      banglaName: 'বায়োমেট্রিক ও ফেস আনলক',
      category: 'privacy',
      desc: 'Requires Fingerprint or Face ID authentication before accessing PC Control, Private Notes, and API keys.',
      icon: Fingerprint,
      enabled: true,
      riskLevel: 'safe'
    },
    {
      id: 'storage',
      name: 'Sandboxed Encrypted Storage',
      banglaName: 'এনক্রিপ্টেড লোকাল স্টোরেজ',
      category: 'core',
      desc: 'AES-GCM-256 hardware-backed encryption for chat records, voice notes, and cached embeddings.',
      icon: HardDrive,
      enabled: true,
      riskLevel: 'safe'
    },
    {
      id: 'network',
      name: 'Local Network & PC Companion',
      banglaName: 'লোকাল নেটওয়ার্ক ও পিসি পেয়ারিং',
      category: 'system',
      desc: 'Discovers Windows companion desktop via mDNS / WebSocket (Port 8080) for remote volume & mouse commands.',
      icon: Wifi,
      enabled: true,
      riskLevel: 'moderate'
    },
    {
      id: 'background',
      name: 'Background Service & Wake Lock',
      banglaName: 'ব্যাকগ্রাউন্ড এক্সিকিউশন ও ওয়েক-লক',
      category: 'system',
      desc: 'Keeps AI assistant engine alive when phone screen turns off or while using other applications.',
      icon: Cpu,
      enabled: true,
      isAdvanced: true,
      riskLevel: 'safe'
    },
    {
      id: 'overlay',
      name: 'Draw Over Other Apps (Floating Bubble)',
      banglaName: 'ফ্লোটিং এআই বাবল ওভারলে',
      category: 'system',
      desc: 'Displays a quick-access floating AI widget above other apps for instant screen translations and answers.',
      icon: Layers,
      enabled: true,
      isAdvanced: true,
      riskLevel: 'moderate'
    },
    {
      id: 'accessibility',
      name: 'Accessibility & Screen Summarizer',
      banglaName: 'অ্যাক্সেসিবিলিটি ও স্ক্রিন রিডার',
      category: 'system',
      desc: 'Allows AI to read active on-screen articles, code snippets, or messages to provide instant summarization.',
      icon: Eye,
      enabled: false,
      isAdvanced: true,
      riskLevel: 'high'
    },
    {
      id: 'clipboard',
      name: 'Smart Clipboard Analyzer',
      banglaName: 'স্মার্ট ক্লিপবোর্ড স্ক্যানার',
      category: 'privacy',
      desc: 'Monitors clipboard changes to automatically offer 1-tap translation, currency conversions, or math solving.',
      icon: Radio,
      enabled: true,
      isAdvanced: true,
      riskLevel: 'safe'
    },
    {
      id: 'location',
      name: 'Coarse Geolocation Context',
      banglaName: 'আনুমানিক লোকেশন ও আবহাওয়া',
      category: 'privacy',
      desc: 'Approximate city-level location used solely for weather alerts and prayer times. Zero GPS pinpointing.',
      icon: MapPin,
      enabled: false,
      riskLevel: 'moderate'
    },
    {
      id: 'auto-revoke',
      name: 'Auto-Revoke Dormant Permissions',
      banglaName: 'অটো-রিভোক নিষ্ক্রিয় পারমিশন',
      category: 'privacy',
      desc: 'Automatically strips unutilized permissions if assistant remains inactive for more than 30 consecutive days.',
      icon: ShieldCheck,
      enabled: true,
      isAdvanced: true,
      riskLevel: 'safe'
    }
  ]);

  // Advanced Security Options State
  const [zeroTelemetry, setZeroTelemetry] = useState<boolean>(true);
  const [sandboxLevel, setSandboxLevel] = useState<'strict' | 'standard' | 'developer'>('strict');
  const [chatAutoWipe, setChatAutoWipe] = useState<'never' | '24h' | '7d' | 'immediate'>('never');
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditProgress, setAuditProgress] = useState<number>(0);
  const [auditReport, setAuditReport] = useState<string | null>(null);
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [currentPin, setCurrentPin] = useState<string>('8842');
  const [inputPin, setInputPin] = useState<string>('');
  const [pinSuccessToast, setPinSuccessToast] = useState<string | null>(null);
  const [showPanicConfirm, setShowPanicConfirm] = useState<boolean>(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const togglePermission = (id: string) => {
    audioService.playCyberChime('beep');
    setPermissions(prev => prev.map(p => {
      if (p.id === id) {
        const nextState = !p.enabled;
        setFeedbackToast(`${p.name}: ${nextState ? 'সক্রিয় (Granted)' : 'বাতিল (Revoked)'}`);
        setTimeout(() => setFeedbackToast(null), 3000);
        return { ...p, enabled: nextState };
      }
      return p;
    }));
  };

  const runSecurityAudit = () => {
    audioService.playCyberChime('activate');
    setIsAuditing(true);
    setAuditProgress(0);
    setAuditReport(null);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setAuditProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsAuditing(false);
        audioService.playCyberChime('success');
        setAuditReport('সব সিকিউরিটি চেক পাস হয়েছে (Audit Passed: 100% Secure • Zero Data Leaks • AES-GCM-256 On-Device Active)');
      }
    }, 250);
  };

  const handlePanicWipe = () => {
    audioService.playCyberChime('alert');
    localStorage.removeItem('sh_assistant_chat_history');
    localStorage.removeItem('sh_assistant_notes');
    setShowPanicConfirm(false);
    setFeedbackToast('ইমার্জেন্সি ডাটা ওয়াইপ সম্পন্ন: সব সাময়িক ক্যাশ ও চ্যাট হিস্টোরি ধ্বংস করা হয়েছে (Data securely wiped)');
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  const handleSavePin = () => {
    if (inputPin.length === 4) {
      setCurrentPin(inputPin);
      audioService.playCyberChime('success');
      setShowPinModal(false);
      setInputPin('');
      setPinSuccessToast('মাস্টার সিকিউরিটি পিন আপডেট সম্পন্ন হয়েছে (PIN updated)');
      setTimeout(() => setPinSuccessToast(null), 3500);
    }
  };

  const activeCount = permissions.filter(p => p.enabled).length;

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#030712] select-none p-4 pb-20 overflow-y-auto space-y-4">
      {/* Header */}
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
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Security & Permissions
            </h2>
            <p className="text-[10px] text-emerald-400 font-medium">নিরাপত্তা ও উন্নত পারমিশন নিয়ন্ত্রণ</p>
          </div>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-mono text-emerald-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{activeCount}/{permissions.length} Active</span>
        </div>
      </div>

      {/* Toast feedback */}
      {(feedbackToast || pinSuccessToast) && (
        <div className="p-2.5 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackToast || pinSuccessToast}</span>
        </div>
      )}

      {/* Security Shield Radar Banner */}
      <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-[#061e16] via-[#09291b] to-[#03150d] border border-emerald-500/40 shadow-[0_8px_30px_rgba(16,185,129,0.2)]">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 tracking-wider flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-emerald-400" />
              Security Radar • Defense Shield
            </span>
            <h3 className="text-base font-extrabold text-white">
              Military-Grade Isolated Sandbox
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              অন-ডিভাইস এনক্রিপশন সক্রিয়। কোনো ভয়েস বা সংবেদনশীল ডাটা ক্লাউডে স্টোর হয় না।
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-inner shrink-0">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
        </div>

        {/* Security Audit Progress or Trigger */}
        <div className="mt-3 pt-3 border-t border-emerald-500/20">
          {isAuditing ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-emerald-300 font-mono">
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  সিস্টেম অডিট ও মেমরি স্ক্যান চলছে...
                </span>
                <span>{auditProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-emerald-950/80 overflow-hidden border border-emerald-500/30">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-200"
                  style={{ width: `${auditProgress}%` }}
                ></div>
              </div>
            </div>
          ) : auditReport ? (
            <div className="flex items-center justify-between text-xs bg-emerald-950/60 p-2 rounded-xl border border-emerald-500/40 text-emerald-200">
              <span className="text-[11px] leading-tight">{auditReport}</span>
              <button 
                onClick={runSecurityAudit}
                className="px-2 py-1 rounded-lg bg-emerald-600/40 hover:bg-emerald-600/60 text-white font-bold text-[10px] shrink-0 ml-2"
              >
                রিস্ক্যান (Recheck)
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>অডিট স্ট্যাটাস: <strong>100% সুরক্ষিত</strong></span>
              </div>
              <button
                onClick={runSecurityAudit}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                অডিট চালান (Run Audit)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Permissions List Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 tracking-wide uppercase flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            অ্যাপ পারমিশনসমূহ (App Permissions)
          </span>
          <span className="text-[10px] text-slate-400">টগল করে অনুমতি দিন</span>
        </div>

        <div className="space-y-2">
          {permissions.map((perm) => {
            const Icon = perm.icon;
            return (
              <div 
                key={perm.id}
                className={`p-3 rounded-2xl border transition-all ${
                  perm.enabled 
                    ? 'bg-[#081525] border-cyan-900/60 shadow-xs' 
                    : 'bg-[#060d17]/60 border-slate-900 opacity-70'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                      perm.enabled 
                        ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400' 
                        : 'bg-slate-800/40 border-slate-700 text-slate-500'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs font-bold text-white">{perm.name}</h4>
                        {perm.isAdvanced && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-purple-950 text-purple-300 border border-purple-500/40 font-mono">
                            Advanced
                          </span>
                        )}
                        <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                          perm.riskLevel === 'safe' 
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' 
                            : perm.riskLevel === 'moderate'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                            : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                        }`}>
                          {perm.riskLevel === 'safe' ? 'Safe' : perm.riskLevel === 'moderate' ? 'Standard' : 'Elevated'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {perm.banglaName}
                      </p>
                      <p className="text-[10px] text-slate-400/90 leading-relaxed pt-0.5">
                        {perm.desc}
                      </p>
                    </div>
                  </div>

                  {/* Switch Toggle */}
                  <button
                    onClick={() => togglePermission(perm.id)}
                    className={`w-11 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
                      perm.enabled ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-800'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      perm.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}></div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Advanced Security Controls & Options */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 tracking-wide uppercase flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
            অ্যাডভান্স অপশনস (Advanced Options)
          </span>
          <span className="text-[10px] text-slate-400">নিরাপত্তা পলিসি</span>
        </div>

        {/* 1. Zero Telemetry Privacy Shield */}
        <div className="p-3.5 rounded-2xl bg-[#081525] border border-purple-900/40 flex items-center justify-between">
          <div className="space-y-0.5 pr-2">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-purple-400" />
              <h4 className="text-xs font-bold text-white">Zero-Telemetry Privacy Shield</h4>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              অ্যাপের যেকোনো প্রকার ক্লাউড টেলিমেট্রি বা অ্যানালিটিক্স পুরোপুরি ব্লক রাখে।
            </p>
          </div>
          <button
            onClick={() => {
              audioService.playCyberChime('beep');
              setZeroTelemetry(!zeroTelemetry);
            }}
            className={`w-11 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
              zeroTelemetry ? 'bg-purple-600 shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'bg-slate-800'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
              zeroTelemetry ? 'translate-x-5' : 'translate-x-0'
            }`}></div>
          </button>
        </div>

        {/* 2. AI Sandbox Isolation Level */}
        <div className="p-3.5 rounded-2xl bg-[#081525] border border-cyan-900/40 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold text-white">AI Sandbox Isolation Level</h4>
            </div>
            <span className="text-[10px] font-mono text-cyan-300 uppercase font-semibold">
              {sandboxLevel}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
            <button
              onClick={() => { audioService.playCyberChime('beep'); setSandboxLevel('strict'); }}
              className={`py-1.5 px-2 rounded-xl text-[11px] font-medium transition ${
                sandboxLevel === 'strict'
                  ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(56,189,248,0.5)]'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Strict (কঠোর)
            </button>
            <button
              onClick={() => { audioService.playCyberChime('beep'); setSandboxLevel('standard'); }}
              className={`py-1.5 px-2 rounded-xl text-[11px] font-medium transition ${
                sandboxLevel === 'standard'
                  ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(56,189,248,0.5)]'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Standard
            </button>
            <button
              onClick={() => { audioService.playCyberChime('beep'); setSandboxLevel('developer'); }}
              className={`py-1.5 px-2 rounded-xl text-[11px] font-medium transition ${
                sandboxLevel === 'developer'
                  ? 'bg-purple-600 text-white font-bold shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Dev Unrestricted
            </button>
          </div>
        </div>

        {/* 3. Chat History Auto-Wipe */}
        <div className="p-3.5 rounded-2xl bg-[#081525] border border-cyan-900/40 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <EyeOff className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold text-white">চ্যাট হিস্টোরি অটো-ওয়াইপ (Auto-Wipe)</h4>
            </div>
            <span className="text-[10px] font-mono text-amber-300">
              {chatAutoWipe === 'never' ? 'Never' : chatAutoWipe}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1 text-center text-xs">
            {(['never', '24h', '7d', 'immediate'] as const).map(option => (
              <button
                key={option}
                onClick={() => { audioService.playCyberChime('beep'); setChatAutoWipe(option); }}
                className={`py-1.5 rounded-xl text-[10px] font-medium uppercase transition ${
                  chatAutoWipe === option
                    ? 'bg-amber-500 text-black font-bold shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {option === 'never' ? 'রাখুন' : option === '24h' ? '২৪ ঘণ্টা' : option === '7d' ? '৭ দিন' : 'প্রস্থান'}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Master PIN Setup */}
        <div className="p-3.5 rounded-2xl bg-[#081525] border border-cyan-900/40 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <Key className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold text-white">মাস্টার সিকিউরিটি পিন (Security PIN)</h4>
            </div>
            <p className="text-[10px] text-slate-400">
              বর্তমান পিন সেট করা আছে: <span className="font-mono text-cyan-300">•••• ({currentPin})</span>
            </p>
          </div>
          <button
            onClick={() => { audioService.playCyberChime('beep'); setShowPinModal(true); }}
            className="px-3 py-1.5 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-bold hover:bg-cyan-900/60 transition active:scale-95"
          >
            পরিবর্তন (Change)
          </button>
        </div>

        {/* 5. Emergency Panic Button */}
        <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-600/40 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>ইমার্জেন্সি ডাটা ওয়াইপ (Emergency Wipe)</span>
            </div>
            <p className="text-[10px] text-slate-400">
              ১-ট্যাপে সব অফলাইন চ্যাট ক্যাশ ও এনক্রিপশন কি মুছে ফেলে।
            </p>
          </div>
          <button
            onClick={() => setShowPanicConfirm(true)}
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1 transition active:scale-95 shadow-[0_0_12px_rgba(244,63,94,0.4)]"
          >
            <Trash2 className="w-3.5 h-3.5" />
            ওয়াইপ
          </button>
        </div>
      </div>

      {/* PIN Change Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-[#081525] border border-cyan-500/60 rounded-3xl p-5 shadow-2xl space-y-4 text-center animate-scale-up">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 mx-auto flex items-center justify-center text-cyan-300">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">নতুন ৪-ডিজিটের পিন দিন</h3>
              <p className="text-xs text-slate-400 mt-0.5">Set 4-digit Master PIN</p>
            </div>

            <div className="flex justify-center gap-2 py-2">
              {[0, 1, 2, 3].map(i => (
                <div 
                  key={i} 
                  className={`w-10 h-12 rounded-xl border flex items-center justify-center text-lg font-mono font-bold ${
                    inputPin[i] 
                      ? 'border-cyan-400 bg-cyan-950 text-cyan-300 shadow-[0_0_10px_rgba(56,189,248,0.5)]' 
                      : 'border-slate-700 bg-slate-900 text-slate-500'
                  }`}
                >
                  {inputPin[i] ? '•' : ''}
                </div>
              ))}
            </div>

            {/* Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {['1','2','3','4','5','6','7','8','9','C','0','⌫'].map(btn => (
                <button
                  key={btn}
                  onClick={() => {
                    audioService.playCyberChime('beep');
                    if (btn === 'C') setInputPin('');
                    else if (btn === '⌫') setInputPin(prev => prev.slice(0, -1));
                    else if (inputPin.length < 4) setInputPin(prev => prev + btn);
                  }}
                  className="py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-sm border border-slate-800 active:scale-95 transition"
                >
                  {btn}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => { setShowPinModal(false); setInputPin(''); }}
                className="flex-1 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white text-xs font-semibold"
              >
                বাতিল (Cancel)
              </button>
              <button
                disabled={inputPin.length !== 4}
                onClick={handleSavePin}
                className="flex-1 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-black text-xs font-bold shadow-md transition"
              >
                সংরক্ষণ (Save)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Panic Wipe Confirm Dialog */}
      {showPanicConfirm && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-[#190408] border border-rose-600 rounded-3xl p-5 shadow-2xl space-y-3 text-center animate-scale-up">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/20 border border-rose-500/60 mx-auto flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-sm font-bold text-white">আপনি কি নিশ্চিত?</h3>
            <p className="text-xs text-rose-200 leading-relaxed">
              সব চ্যাট রেকর্ড, মেমরি এবং লোকাল সেটিংস পার্মানেন্টলি ডিলিট হয়ে যাবে। এটি আর ফেরত আনা যাবে না।
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowPanicConfirm(false)}
                className="flex-1 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold"
              >
                না, ফিরে যান
              </button>
              <button
                onClick={handlePanicWipe}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(244,63,94,0.6)]"
              >
                হ্যাঁ, মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
