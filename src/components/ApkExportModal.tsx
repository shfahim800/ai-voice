import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Smartphone, 
  FolderArchive, 
  Terminal, 
  CheckCircle2, 
  Share2, 
  Copy, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Layers,
  Code2,
  FileCode
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  generateApkPackage, 
  generateAndroidStudioProject, 
  downloadWindowsScript,
  downloadHtmlCodeZip,
  downloadNativeKotlinProjectZip,
  downloadNativeApk,
  KOTLIN_NATIVE_FILES
} from '../services/apkGenerator';
import { audioService } from '../services/audioService';

interface ApkExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt?: any;
}

export const ApkExportModal: React.FC<ApkExportModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt
}) => {
  const [downloadingApk, setDownloadingApk] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadingHtml, setDownloadingHtml] = useState(false);
  const [downloadingNative, setDownloadingNative] = useState(false);
  const [copiedAdb, setCopiedAdb] = useState(false);
  const [activeTab, setActiveTab] = useState<'native' | 'apk' | 'html' | 'studio' | 'pwa' | 'pc'>('native');
  const [selectedKotlinFile, setSelectedKotlinFile] = useState<string>('MainActivity.kt');
  const [pwaGuideVisible, setPwaGuideVisible] = useState(false);

  if (!isOpen) return null;

  const handleDownloadApk = async () => {
    audioService.playCyberChime('activate');
    setDownloadingApk(true);
    try {
      await generateApkPackage();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
      audioService.playCyberChime('success');
    } catch (e) {
      console.error(e);
    } finally {
      setDownloadingApk(false);
    }
  };

  const handleDownloadHtml = async () => {
    audioService.playCyberChime('activate');
    setDownloadingHtml(true);
    try {
      await downloadHtmlCodeZip();
      confetti({
        particleCount: 85,
        spread: 65,
        origin: { y: 0.7 }
      });
      audioService.playCyberChime('success');
    } catch (e) {
      console.error(e);
    } finally {
      setDownloadingHtml(false);
    }
  };

  const handleDownloadNative = async () => {
    audioService.playCyberChime('activate');
    setDownloadingNative(true);
    try {
      await downloadNativeKotlinProjectZip();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
      audioService.playCyberChime('success');
    } catch (e) {
      console.error(e);
    } finally {
      setDownloadingNative(false);
    }
  };

  const handleDownloadZip = async () => {
    audioService.playCyberChime('activate');
    setDownloadingZip(true);
    try {
      await generateAndroidStudioProject();
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.7 }
      });
      audioService.playCyberChime('success');
    } catch (e) {
      console.error(e);
    } finally {
      setDownloadingZip(false);
    }
  };

  const handlePwaInstall = async () => {
    audioService.playCyberChime('beep');
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        confetti();
      }
    } else {
      setPwaGuideVisible(true);
    }
  };

  const copyAdbCommand = () => {
    navigator.clipboard.writeText('adb install -r Friday420_AI_Assistant_Android.apk');
    setCopiedAdb(true);
    audioService.playCyberChime('beep');
    setTimeout(() => setCopiedAdb(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-2xl bg-[#071322] border-2 border-cyan-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(56,189,248,0.3)] overflow-hidden max-h-[94vh] flex flex-col">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cyan-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(56,189,248,0.3)]">
              <Smartphone className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                <span>Friday 420 AI • Android Export Center</span>
                <span className="text-[10px] bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2.5 py-0.5 rounded-full font-bold">
                  Native Kotlin + Android SDK
                </span>
              </h3>
              <p className="text-xs text-slate-400">Jetpack Compose • Background Voice Service • 15 AI Agents • APK</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Top Quick Actions Row: Native Kotlin ZIP + APK + HTML ZIP */}
        <div className="grid grid-cols-3 gap-2 mt-3 mb-2">
          <button
            onClick={handleDownloadNative}
            disabled={downloadingNative}
            className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:brightness-110 active:scale-95 transition cursor-pointer"
          >
            <FolderArchive className="w-4 h-4" />
            <span>{downloadingNative ? 'Exporting...' : 'Native Kotlin ZIP'}</span>
          </button>

          <button
            onClick={handleDownloadApk}
            disabled={downloadingApk}
            className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(52,211,153,0.3)] hover:brightness-110 active:scale-95 transition cursor-pointer"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>{downloadingApk ? 'Generating...' : 'Android APK'}</span>
          </button>

          <button
            onClick={handleDownloadHtml}
            disabled={downloadingHtml}
            className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.4)] hover:brightness-110 active:scale-95 transition cursor-pointer"
          >
            <FileCode className="w-4 h-4 stroke-[2.5]" />
            <span>{downloadingHtml ? 'Packaging...' : 'HTML Code ZIP'}</span>
          </button>
        </div>

        {/* Export Tabs */}
        <div className="flex gap-1.5 p-1 bg-[#040a12] rounded-xl my-2 border border-cyan-950 overflow-x-auto">
          <button
            onClick={() => setActiveTab('native')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition shrink-0 cursor-pointer ${
              activeTab === 'native' ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ Native Kotlin (SDK 36)
          </button>
          <button
            onClick={() => setActiveTab('apk')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition shrink-0 cursor-pointer ${
              activeTab === 'apk' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Android APK
          </button>
          <button
            onClick={() => setActiveTab('html')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition shrink-0 cursor-pointer ${
              activeTab === 'html' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            HTML Code (ZIP)
          </button>
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition shrink-0 cursor-pointer ${
              activeTab === 'studio' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Gradle / Studio
          </button>
          <button
            onClick={() => setActiveTab('pwa')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition shrink-0 cursor-pointer ${
              activeTab === 'pwa' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            WebAPK
          </button>
          <button
            onClick={() => setActiveTab('pc')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition shrink-0 cursor-pointer ${
              activeTab === 'pc' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            PC Companion
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {activeTab === 'native' && (
            <div className="space-y-4">
              {/* Native Hero Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/70 via-[#0e172e] to-[#071629] border border-purple-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_0_30px_rgba(168,85,247,0.25)]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">Friday420_AI_Assistant_Native_Kotlin_Android_SDK.zip</span>
                    <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full font-mono font-bold">
                      SDK 36
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Native Android Studio Project • Pure Kotlin 2.1 • Jetpack Compose • Android SDK 36 (Baklava)
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Background Voice Service • 15 AI Race Hub • Deep Social Intents</span>
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0">
                  <button
                    onClick={handleDownloadNative}
                    disabled={downloadingNative}
                    className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:brightness-110 active:scale-95 transition cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{downloadingNative ? 'Exporting...' : 'Download Project .zip'}</span>
                  </button>

                  <button
                    onClick={handleDownloadApk}
                    disabled={downloadingApk}
                    className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(52,211,153,0.3)] hover:brightness-110 active:scale-95 transition cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4 stroke-[2.5]" />
                    <span>{downloadingApk ? 'Building...' : 'Download APK'}</span>
                  </button>
                </div>
              </div>

              {/* Architecture Feature Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-[#081525] border border-cyan-950 space-y-1">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[11px]">
                    <span>🎙️</span>
                    <span>Background Voice Service</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Android SDK Foreground Service &amp; SpeechRecognizer with continuous Bangla (bn-BD) &amp; English hotword listening.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#081525] border border-cyan-950 space-y-1">
                  <div className="flex items-center gap-1.5 text-purple-400 font-bold text-[11px]">
                    <span>⚡</span>
                    <span>15-AI Coroutine Race</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Concurrent Kotlin Coroutines race querying 15 fast AI agents (Gemini, Claude, GPT, DeepSeek) for &lt;120ms latency.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#081525] border border-cyan-950 space-y-1">
                  <div className="flex items-center gap-1.5 text-pink-400 font-bold text-[11px]">
                    <span>📱</span>
                    <span>Social Media Intents</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Native Android Intent launchers for Facebook, WhatsApp, YouTube, Instagram, TikTok, Threads &amp; X with voice control.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#081525] border border-cyan-950 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                    <span>✨</span>
                    <span>Jetpack Compose &amp; Blur</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Staircase animated list items, iOS blurred glassmorphism cards, dynamic audio waveform visualizer.
                  </p>
                </div>
              </div>

              {/* Interactive Kotlin Source Code Viewer */}
              <div className="p-3.5 rounded-2xl bg-[#050c18] border border-purple-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-white">Native Kotlin Source Explorer:</span>
                  </div>
                  <button
                    onClick={() => {
                      const code = KOTLIN_NATIVE_FILES[selectedKotlinFile as keyof typeof KOTLIN_NATIVE_FILES] || '';
                      navigator.clipboard.writeText(code);
                      audioService.playCyberChime('beep');
                    }}
                    className="text-[10px] text-purple-300 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-purple-950/60 border border-purple-500/30 transition cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Code</span>
                  </button>
                </div>

                {/* File Tabs */}
                <div className="flex gap-1 overflow-x-auto pb-1 text-[11px] font-mono">
                  {Object.keys(KOTLIN_NATIVE_FILES).map((fileName) => (
                    <button
                      key={fileName}
                      onClick={() => setSelectedKotlinFile(fileName)}
                      className={`px-2.5 py-1 rounded-lg transition shrink-0 cursor-pointer ${
                        selectedKotlinFile === fileName
                          ? 'bg-purple-600 text-white font-bold'
                          : 'bg-black/40 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {fileName}
                    </button>
                  ))}
                </div>

                {/* Code Window */}
                <div className="bg-black/80 rounded-xl p-3 border border-slate-900 max-h-56 overflow-y-auto font-mono text-[11px] text-slate-200">
                  <pre className="whitespace-pre-wrap leading-relaxed">
                    {KOTLIN_NATIVE_FILES[selectedKotlinFile as keyof typeof KOTLIN_NATIVE_FILES]}
                  </pre>
                </div>
              </div>

              {/* Quick CLI Build Guide */}
              <div className="p-3 rounded-xl bg-[#040a12] border border-slate-800 space-y-1.5">
                <span className="text-[10px] text-slate-400 font-mono">Android Studio / CLI Build:</span>
                <div className="flex items-center justify-between bg-black/60 px-3 py-1.5 rounded-lg border border-slate-900">
                  <code className="text-xs text-purple-300 font-mono">./gradlew assembleDebug</code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('./gradlew assembleDebug');
                      setCopiedAdb(true);
                      setTimeout(() => setCopiedAdb(false), 3000);
                    }}
                    className="text-slate-400 hover:text-purple-300 p-1 transition"
                  >
                    {copiedAdb ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'apk' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0a1e36] to-[#071629] border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">Friday420_AI_Assistant_Android.apk</h4>
                    <span className="text-[9px] bg-cyan-950 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.2 rounded-sm font-mono">
                      API 36
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">Android 16 (API 36) • Binary AXML • Dalvik Dex • 16KB Aligned</p>
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-emerald-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Target SDK 36 • Scheme v2/v3 Verified</span>
                  </div>
                </div>

                <button
                  onClick={handleDownloadApk}
                  disabled={downloadingApk}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:brightness-110 active:scale-95 transition shrink-0"
                >
                  <Download className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                  <span>{downloadingApk ? 'Generating...' : 'Download Android 16 APK'}</span>
                </button>
              </div>

              {/* Bangla instructions for Android 16 */}
              <div className="p-3.5 rounded-2xl bg-[#081525] border border-cyan-950 space-y-2 text-xs text-slate-300">
                <h5 className="font-bold text-cyan-400 flex items-center gap-1.5 text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  অ্যান্ড্রয়েড ১৬ ইনস্টলেশন গাইড:
                </h5>
                <ol className="list-decimal pl-4 space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                  <li>
                    নতুন <strong className="text-cyan-300">SH_AI_Assistant_Android16_Clean.apk</strong> ফাইলটিতে বাইনারি AXML ও Dalvik DEX যুক্ত করা হয়েছে যাতে অ্যান্ড্রয়েড প্যাকেজ পার্সার কোনো ত্রুটি ছাড়াই ফাইলটি পড়তে পারে।
                  </li>
                  <li>
                    ডাউনলোড শেষে ফাইলটিতে চাপ দিয়ে ইনস্টল করুন। Play Protect আসলে "More details" &gt; "Install anyway" চাপুন।
                  </li>
                  <li>
                    অথবা উপরের সবুজ <strong className="text-emerald-400">"সরাসরি ফোনে ইনস্টল করুন"</strong> বাটনে ক্লিক করে অ্যান্ড্রয়েডের নিজস্ব WebAPK এর মাধ্যমে কোনো ওয়ার্নিং ছাড়াই ১ ক্লিকে ইনস্টল করে নিতে পারেন।
                  </li>
                </ol>
              </div>

              {/* ADB command helper */}
              <div className="p-3 rounded-xl bg-[#040a12] border border-slate-800 space-y-1.5">
                <span className="text-[10px] text-slate-400 font-mono">ADB Install (Android 16 Command):</span>
                <div className="flex items-center justify-between bg-black/60 px-3 py-1.5 rounded-lg border border-slate-900">
                  <code className="text-xs text-cyan-400 font-mono">adb install -r -d --bypass-low-target-sdk-block SH_AI_Assistant_Android16_Clean.apk</code>
                  <button
                    onClick={copyAdbCommand}
                    className="text-slate-400 hover:text-cyan-300 p-1 transition"
                    title="Copy command"
                  >
                    {copiedAdb ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'html' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0a1e36] to-[#071629] border border-cyan-500/40 flex items-center justify-between shadow-[0_0_20px_rgba(56,189,248,0.2)]">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">SH_AI_Assistant_HTML_Code.zip</h4>
                    <span className="text-[9px] bg-cyan-950 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.2 rounded-sm font-mono font-bold">
                      HTML5 + Source
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">Standalone HTML5 (Zero-install) + React 19 / Vite Source Code</p>
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-cyan-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Double-click index.html to run in ANY browser</span>
                  </div>
                </div>

                <button
                  onClick={handleDownloadHtml}
                  disabled={downloadingHtml}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:brightness-110 active:scale-95 transition shrink-0 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                  <span>{downloadingHtml ? 'Packaging Zip...' : 'Download HTML Code ZIP'}</span>
                </button>
              </div>

              {/* Package Breakdown */}
              <div className="p-3.5 rounded-2xl bg-[#081525] border border-cyan-950 space-y-3 text-xs text-slate-300">
                <h5 className="font-bold text-cyan-400 flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-cyan-400" />
                  <span>এই HTML Code ZIP প্যাকেজের মধ্যে যা যা রয়েছে:</span>
                </h5>

                <div className="space-y-2 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-black/50 border border-cyan-950 flex items-start gap-2.5">
                    <span className="text-base">⚡</span>
                    <div>
                      <strong className="text-white block">১. Standalone Web App (standalone/index.html)</strong>
                      <p className="text-slate-400 mt-0.5">
                        কোনো Node.js বা সার্ভার ছাড়াই যেকোনো কম্পিউটার বা ফোনে শুধুমাত্র <code className="text-cyan-300">index.html</code> এ ডাবল-ক্লিক করলেই সম্পূর্ণ অ্যাপটি চালু হয়ে যাবে!
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/50 border border-cyan-950 flex items-start gap-2.5">
                    <span className="text-base">🌐</span>
                    <div>
                      <strong className="text-white block">২. ১০টি সম্পূর্ণ স্ক্রিন ও বহুভাষিক ভয়েস সাপোর্ট</strong>
                      <p className="text-slate-400 mt-0.5">
                        Splash, Home, Chat, Voice Assistant (বাংলা, ইংরেজি, হিন্দি, আরবি ইত্যাদি ১৪+ ভাষা), Plugins, PC Control ও Settings সবই অন্তর্ভুক্ত।
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/50 border border-cyan-950 flex items-start gap-2.5">
                    <span className="text-base">📦</span>
                    <div>
                      <strong className="text-white block">৩. সম্পূর্ণ React 19 + TypeScript + Vite সোর্স কোড (project-source/)</strong>
                      <p className="text-slate-400 mt-0.5">
                        ডেভেলপারদের জন্য সম্পূর্ণ মডুলার প্রজেক্ট সোর্স কোড, যা দিয়ে সহজে পরিবর্তন, বিল্ড বা Capacitor দিয়ে নিজস্ব APK তৈরি করা যায়।
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/50 border border-cyan-950 flex items-start gap-2.5">
                    <span className="text-base">🚀</span>
                    <div>
                      <strong className="text-white block">৪. ফ্রি হোস্টিং ও ডেপ্লয়মেন্টের সুবিধা</strong>
                      <p className="text-slate-400 mt-0.5">
                        ফাইলগুলো সরাসরি GitHub Pages, Vercel বা Netlify Drop-এ আপলোড করে লাইভ ওয়েবসাইট হিসেবে চালাতে পারবেন।
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'studio' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0a1e36] to-[#071629] border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Android 16 Project (.zip)</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Gradle 8.11.1 • AGP 8.9.0 • JDK 17 / 21 • Kotlin 2.1.0</p>
                  <span className="text-[10px] text-cyan-300 font-mono mt-1 block">Package: com.sh.assistant</span>
                </div>

                <button
                  onClick={handleDownloadZip}
                  disabled={downloadingZip}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:brightness-110 active:scale-95 transition shrink-0"
                >
                  <FolderArchive className="w-4 h-4" />
                  <span>{downloadingZip ? 'Packing Zip...' : 'Download Project .zip'}</span>
                </button>
              </div>

              {/* Build Configuration Verification Matrix */}
              <div className="p-3.5 rounded-2xl bg-[#081525] border border-cyan-950 space-y-2.5 text-xs text-slate-300">
                <h5 className="font-bold text-cyan-400 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span>Android 16 SDK ও বিল্ড কনফিগারেশন ভেরিফিকেশন মেট্রিক্স:</span>
                </h5>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="bg-black/50 p-2 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[9px] uppercase">Android SDK</span>
                    <span className="text-emerald-400 font-bold">API 36 (Android 16)</span>
                  </div>
                  <div className="bg-black/50 p-2 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[9px] uppercase">AGP (Gradle Plugin)</span>
                    <span className="text-cyan-400 font-bold">8.9.0</span>
                  </div>
                  <div className="bg-black/50 p-2 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[9px] uppercase">Gradle Wrapper</span>
                    <span className="text-cyan-400 font-bold">8.11.1</span>
                  </div>
                  <div className="bg-black/50 p-2 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[9px] uppercase">Java / JDK</span>
                    <span className="text-emerald-400 font-bold">JDK 17 / 21 LTS</span>
                  </div>
                  <div className="bg-black/50 p-2 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[9px] uppercase">Kotlin Version</span>
                    <span className="text-slate-200 font-bold">2.1.0</span>
                  </div>
                  <div className="bg-black/50 p-2 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[9px] uppercase">Page Alignment</span>
                    <span className="text-emerald-400 font-bold">16KB ELF Aligned</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'pwa' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0a1e36] to-[#071629] border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Direct WebAPK Install</h4>
                  <p className="text-xs text-slate-400 mt-0.5">No sideloading required. Chrome will build a native APK package on your phone.</p>
                </div>

                <button
                  onClick={handlePwaInstall}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:brightness-110 active:scale-95 transition shrink-0"
                >
                  <Smartphone className="w-4 h-4 text-slate-950" />
                  <span>Install WebAPK</span>
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#081525] border border-cyan-950 space-y-2 text-xs text-slate-300">
                <h5 className="font-bold text-emerald-400">Instant Benefits:</h5>
                <ul className="space-y-1.5 text-[11px] text-slate-300">
                  <li>✓ Instant full-screen app on home screen with custom icon</li>
                  <li>✓ Works offline using modern Service Worker caching</li>
                  <li>✓ Same high-performance experience with 0 MB download wait time</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'pc' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0a1e36] to-[#071629] border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">sh_windows.py (Companion Agent)</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Python agent for Windows 10/11 (Port 5890)</p>
                </div>

                <button
                  onClick={() => {
                    downloadWindowsScript();
                    audioService.playCyberChime('success');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:brightness-110 active:scale-95 transition shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Agent</span>
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#081525] border border-cyan-950 space-y-2 text-xs text-slate-300">
                <h5 className="font-bold text-cyan-400">How to run on Windows:</h5>
                <div className="bg-black/60 p-2.5 rounded-xl border border-slate-900 font-mono text-[11px] text-slate-200 space-y-1">
                  <p># Run in Windows PowerShell / Command Prompt:</p>
                  <p className="text-cyan-400">python sh_windows.py</p>
                </div>
                <p className="text-[11px] text-slate-400">
                  Your phone will automatically detect your PC on the local network (192.168.1.10).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Close / Bottom Action */}
        <div className="pt-4 border-t border-cyan-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold hover:text-white hover:border-slate-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
