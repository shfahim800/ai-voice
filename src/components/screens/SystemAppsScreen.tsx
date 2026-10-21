import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Mic, 
  Square, 
  Volume2, 
  Camera, 
  Flashlight, 
  Image as ImageIcon, 
  Phone, 
  MessageSquare, 
  Users, 
  Settings, 
  Clock, 
  Music, 
  Folder, 
  Calculator, 
  Globe, 
  MapPin, 
  FileText, 
  Cpu, 
  Send, 
  Play, 
  Pause, 
  Check, 
  X, 
  Sparkles, 
  Wifi, 
  Bluetooth, 
  Bell, 
  Sun, 
  Zap, 
  ShieldCheck, 
  Layers, 
  RefreshCw,
  Search,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { SYSTEM_APPS, SystemApp, systemAppsService, VoiceCommandResult } from '../../services/systemAppsService';
import { audioService } from '../../services/audioService';
import { VoiceWave } from '../widgets/VoiceWave';
import confetti from 'canvas-confetti';

interface SystemAppsScreenProps {
  onBack: () => void;
  onNavigate?: (screen: any) => void;
}

export const SystemAppsScreen: React.FC<SystemAppsScreenProps> = ({ onBack, onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [commandInput, setCommandInput] = useState<string>('');
  const [lastTranscript, setLastTranscript] = useState<string>('');
  const [executionFeedback, setExecutionFeedback] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Live states for system controls
  const [torchState, setTorchState] = useState<boolean>(systemAppsService.isTorchOn());
  const [wifiState, setWifiState] = useState<boolean>(true);
  const [bluetoothState, setBluetoothState] = useState<boolean>(true);
  const [volumeLevel, setVolumeLevel] = useState<number>(80);
  const [brightnessLevel, setBrightnessLevel] = useState<number>(90);
  const [calculatorInput, setCalculatorInput] = useState<string>('120 * 5');
  const [calculatorResult, setCalculatorResult] = useState<string>('600');
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const [ramCleaned, setRamCleaned] = useState<boolean>(false);
  const [activeAlarmList, setActiveAlarmList] = useState<string[]>(['07:00 AM', '09:30 PM']);
  const [dialerNumber, setDialerNumber] = useState<string>('');

  // Camera video stream ref
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  const voiceConfig = audioService.getConfig();
  const isBangla = voiceConfig.selectedLanguage.startsWith('bn');

  // Start Voice Command Session
  const toggleVoiceSession = () => {
    if (isListening) {
      audioService.stopListening();
      setIsListening(false);
      audioService.playCyberChime('alert');
    } else {
      setIsListening(true);
      setLastTranscript('');
      setExecutionFeedback(isBangla ? 'ভয়েস কমান্ড শুনছি... বলুন...' : 'Listening for system command...');

      audioService.startListening(
        (text) => {
          setLastTranscript(text);
          if (text.trim().length > 2) {
            audioService.stopListening();
            setIsListening(false);
            executeVoiceCommand(text);
          }
        },
        (error) => {
          console.warn('System Voice error:', error);
          setIsListening(false);
          setExecutionFeedback(isBangla ? 'মাইক্রোফোন সক্রিয় করুন বা নিচের কমান্ড চাপুন।' : 'Microphone ready. Tap any command chip.');
        },
        voiceConfig.selectedLanguage
      );
    }
  };

  // Process and Execute Voice Command
  const executeVoiceCommand = (cmdText: string) => {
    audioService.playCyberChime('beep');
    setLastTranscript(cmdText);

    const result: VoiceCommandResult = systemAppsService.processVoiceCommand(cmdText, voiceConfig.selectedLanguage);

    if (result.matched) {
      setExecutionFeedback(result.speechReply);
      audioService.speak(result.speechReply);
      audioService.playCyberChime('success');

      // Trigger app-specific modal / action
      if (result.action === 'torch_on' || result.action === 'torch_sos') {
        setTorchState(true);
        setActiveModal('flashlight');
      } else if (result.action === 'torch_off') {
        setTorchState(false);
        systemAppsService.toggleTorch(false);
      } else if (result.appId === 'camera') {
        setActiveModal('camera');
      } else if (result.appId === 'phone') {
        if (result.actionPayload?.contact) {
          setDialerNumber(result.actionPayload.contact.includes('999') ? '999' : '01711002233');
        }
        setActiveModal('phone');
      } else if (result.appId === 'calculator') {
        if (result.actionPayload) {
          setCalculatorInput(result.actionPayload.expression);
          setCalculatorResult(String(result.actionPayload.result));
        }
        setActiveModal('calculator');
      } else if (result.appId === 'music') {
        setIsMusicPlaying(result.action === 'play_music');
        setActiveModal('music');
      } else if (result.appId === 'clock') {
        setActiveModal('clock');
      } else if (result.appId === 'monitor') {
        handleBoostRam();
      } else if (result.appId === 'settings') {
        setActiveModal('settings');
      } else if (result.appId === 'gallery') {
        setActiveModal('gallery');
      } else if (result.appId === 'messages') {
        setActiveModal('messages');
      } else if (result.appId === 'files') {
        setActiveModal('files');
      } else if (result.appId === 'browser') {
        setActiveModal('browser');
      } else if (result.appId === 'maps') {
        setActiveModal('maps');
      } else if (result.appId === 'notes') {
        setActiveModal('notes');
      } else if (result.appId === 'contacts') {
        setActiveModal('contacts');
      }
    } else {
      const fallback = isBangla 
        ? `কমান্ড: "${cmdText}" — সিস্টেম অ্যাপসের সাথে ম্যাচ করেনি।` 
        : `Command: "${cmdText}" not matched to a system app.`;
      setExecutionFeedback(fallback);
      audioService.speak(fallback);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    executeVoiceCommand(commandInput.trim());
    setCommandInput('');
  };

  // Launch Camera Stream
  const openCamera = async (facing: 'user' | 'environment' = 'environment') => {
    setFacingMode(facing);
    setActiveModal('camera');
    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach(t => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing },
        audio: false
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera access error:', err);
    }
  };

  const closeCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      setCameraStream(null);
    }
    setActiveModal(null);
    setCapturedPhoto(null);
  };

  const takePhoto = () => {
    audioService.playCyberChime('activate');
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        setCapturedPhoto(canvas.toDataURL('image/jpeg'));
        try {
          confetti({ particleCount: 30, spread: 50 });
        } catch {}
      }
    }
  };

  // Clean RAM Action
  const handleBoostRam = () => {
    setRamCleaned(true);
    audioService.playCyberChime('success');
    const msg = isBangla 
      ? 'সিস্টেম বুস্ট সম্পন্ন! ২.৪ জিবি ক্যাশে ও ব্যাকগ্রাউন্ড মেমোরি মুক্ত করা হয়েছে।' 
      : 'System Boost Complete! 2.4 GB background cache freed.';
    setExecutionFeedback(msg);
    audioService.speak(msg);
    try {
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.7 } });
    } catch {}
    setTimeout(() => setRamCleaned(false), 4000);
  };

  // Render Icon component dynamically
  const renderAppIcon = (iconName: string, className: string = 'w-5 h-5') => {
    switch (iconName) {
      case 'Camera': return <Camera className={className} />;
      case 'Flashlight': return <Flashlight className={className} />;
      case 'Image': return <ImageIcon className={className} />;
      case 'Phone': return <Phone className={className} />;
      case 'MessageSquare': return <MessageSquare className={className} />;
      case 'Users': return <Users className={className} />;
      case 'Settings': return <Settings className={className} />;
      case 'Clock': return <Clock className={className} />;
      case 'Music': return <Music className={className} />;
      case 'Folder': return <Folder className={className} />;
      case 'Calculator': return <Calculator className={className} />;
      case 'Globe': return <Globe className={className} />;
      case 'MapPin': return <MapPin className={className} />;
      case 'FileText': return <FileText className={className} />;
      case 'Cpu': return <Cpu className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  // Filter apps
  const filteredApps = SYSTEM_APPS.filter(app => {
    const matchesCat = activeCategory === 'all' || app.category === activeCategory;
    const matchesSearch = 
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.nativeName.includes(searchQuery) ||
      app.sampleCommandsBn.some(c => c.includes(searchQuery)) ||
      app.sampleCommandsEn.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#030712] select-none p-4 pb-20 overflow-y-auto space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <button 
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-cyan-400 transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h2 className="text-sm font-bold text-white tracking-wide flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            সিস্টেম অ্যাপস কন্ট্রোলার
          </h2>
          <p className="text-[10px] text-cyan-400 font-medium">System Apps Voice Controller</p>
        </div>

        <button
          onClick={() => openCamera('environment')}
          className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-300 hover:bg-cyan-900 transition cursor-pointer"
          title="Quick Camera"
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>

      {/* VoiceWave Visualizer & Voice Controller HUD */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#07192f] via-[#051426] to-[#081a33] border border-cyan-500/40 p-3.5 shadow-[0_0_25px_rgba(0,240,255,0.18)] space-y-3">
        {/* Real-time VoiceWave Visualizer Component */}
        <VoiceWave 
          isListening={isListening} 
          isSpeaking={false} 
          height={75}
        />

        {/* Live Assistant Feedback Banner */}
        {executionFeedback && (
          <div className="p-2.5 rounded-xl bg-cyan-950/90 border border-cyan-400/70 text-cyan-200 text-xs flex items-center justify-between shadow-sm animate-fadeIn">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 animate-spin" />
              <span className="font-medium text-white">{executionFeedback}</span>
            </div>
            <button 
              onClick={() => setExecutionFeedback(null)} 
              className="text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Interactive Voice Mic + Text Command Box */}
        <div className="flex items-center gap-2">
          {/* Big Voice Controller Mic Button */}
          <button
            type="button"
            onClick={toggleVoiceSession}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition active:scale-95 cursor-pointer shadow-md ${
              isListening
                ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white animate-pulse border border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.5)]'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 border border-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
            }`}
          >
            {isListening ? (
              <>
                <Square className="w-4 h-4 fill-white" />
                <span>শুনছি...</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 stroke-[2.5]" />
                <span>ভয়েস বলুন</span>
              </>
            )}
          </button>

          {/* Text Command Input Form */}
          <form onSubmit={handleManualSubmit} className="flex-1 flex items-center gap-1.5 bg-[#030914] border border-cyan-900/80 rounded-xl px-2.5 py-1.5 focus-within:border-cyan-400">
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder={isBangla ? "কমান্ড লিখুন (যেমন: ক্যামেরা খোলো, টর্চ জ্বালাও)..." : "Type command e.g. Open Camera, Torch on..."}
              className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-hidden w-full font-sans"
            />
            <button
              type="submit"
              className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition flex items-center justify-center shrink-0 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Spoken Quick Command Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px] pt-1">
          <span className="text-[10px] text-slate-400 shrink-0 font-medium">কমান্ড টেস্ট:</span>
          {[
            { label: '📷 ক্যামেরা খোলো', cmd: 'ক্যামেরা খোলো' },
            { label: '🔦 টর্চলাইট অন', cmd: 'টর্চলাইট অন করো' },
            { label: '📞 আম্মুকে কল', cmd: 'আম্মুকে কল দাও' },
            { label: '🎵 গান বাজাও', cmd: 'গান বাজাও' },
            { label: '🧮 হিসাব ২৫০*১২', cmd: 'হিসাব করো ২৫০ গুণ ১২' },
            { label: '🚀 র‍্যাম বুস্ট', cmd: 'র‍্যাম ক্লিন করো' },
            { label: '⏰ সকাল ৭টায় অ্যালার্ম', cmd: 'সকাল ৭টায় অ্যালার্ম দাও' },
            { label: '⚙️ সেটিংস দেখাও', cmd: 'সেটিংস খোলো' }
          ].map((c, i) => (
            <button
              key={i}
              type="button"
              onClick={() => executeVoiceCommand(c.cmd)}
              className="bg-[#0b1f36] border border-cyan-900/60 hover:border-cyan-400 text-cyan-200 px-2.5 py-1 rounded-full whitespace-nowrap transition cursor-pointer active:scale-95 text-[10px]"
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'সবগুলো (১৫)' },
              { id: 'media', label: 'মিডিয়া' },
              { id: 'communication', label: 'যোগাযোগ' },
              { id: 'tools', label: 'টুলস' },
              { id: 'settings', label: 'সিস্টেম' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap transition cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                    : 'bg-[#081525] text-slate-400 hover:text-white border border-cyan-950'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="w-28 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="খুঁজুন..."
              className="w-full bg-[#081525] border border-cyan-950 rounded-xl px-2 py-1 text-[10px] text-white focus:outline-hidden focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* 15 Phone System Apps Grid */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span className="font-bold text-white uppercase tracking-wider">
            ফোনের সিস্টেম অ্যাপসমূহ ({filteredApps.length})
          </span>
          <span className="text-cyan-400 font-mono text-[10px]">ভয়েস অ্যাসিস্ট্যান্ট লিংকড</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className={`rounded-2xl bg-gradient-to-br from-[#081729] to-[#040e1b] border ${app.borderColor} p-3.5 flex flex-col justify-between space-y-2.5 transition-all duration-200 hover:border-cyan-400 shadow-sm`}
            >
              {/* App Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${app.bgColor} border ${app.borderColor} flex items-center justify-center ${app.color} shadow-sm shrink-0`}>
                    {renderAppIcon(app.icon, 'w-5 h-5')}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      {app.nativeName}
                      <span className="text-[10px] text-slate-400 font-normal">({app.name})</span>
                    </h4>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{app.description}</p>
                  </div>
                </div>

                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-900 border border-slate-700 text-emerald-400 font-mono shrink-0">
                  {app.status}
                </span>
              </div>

              {/* Sample Spoken Voice Commands */}
              <div className="flex flex-wrap gap-1">
                {app.sampleCommandsBn.slice(0, 2).map((cmd, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => executeVoiceCommand(cmd)}
                    className="text-[9px] bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 hover:border-cyan-400 px-2 py-0.5 rounded-lg transition active:scale-95 cursor-pointer font-sans"
                    title="Tap to speak this voice command"
                  >
                    "{cmd}"
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1 border-t border-cyan-950/80">
                <button
                  type="button"
                  onClick={() => executeVoiceCommand(app.sampleCommandsBn[0])}
                  className="flex items-center gap-1 text-[10px] font-semibold text-cyan-400 hover:text-cyan-300 transition cursor-pointer"
                >
                  <Mic className="w-3 h-3" />
                  <span>ভয়েস কমান্ড এক্সিকিউট</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    audioService.playCyberChime('beep');
                    setActiveModal(app.id);
                    if (app.id === 'camera') openCamera('environment');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <span>ওপেন</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Android 16 System Integration & Permissions Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#07172b] to-[#0a1f3a] border border-cyan-500/30 p-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-white">Android System Permissions</h4>
          </div>
          <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono">
            Full Access Granted
          </span>
        </div>
        <p className="text-[10px] text-slate-300">
          ভয়েস অ্যাসিস্ট্যান্ট ব্যাকগ্রাউন্ড অ্যাক্সেসিবিলিটি সার্ভিস, স্ক্রিন ওভারলে এবং সিস্টেম অ্যাপস ইন্টিগ্রেশনের সাথে সরাসরি সংযুক্ত।
        </p>
        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-300 pt-1">
          <div className="flex items-center gap-1.5">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>Accessibility Service: Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>Screen Overlay: Allowed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>Device Settings: Granted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>Background Wake: Enabled</span>
          </div>
        </div>
      </div>

      {/* MODAL 1: LIVE CAMERA VIEW */}
      {activeModal === 'camera' && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 animate-fadeIn">
          <div className="flex items-center justify-between z-10">
            <button 
              onClick={closeCamera}
              className="w-9 h-9 rounded-full bg-slate-900/80 border border-slate-700 flex items-center justify-center text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold text-white bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700">
              Live System Camera ({facingMode === 'user' ? 'Front Selfie' : 'Back 4K'})
            </span>
            <button
              onClick={() => openCamera(facingMode === 'user' ? 'environment' : 'user')}
              className="w-9 h-9 rounded-full bg-slate-900/80 border border-slate-700 flex items-center justify-center text-cyan-300"
              title="Switch Camera"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Viewfinder */}
          <div className="relative flex-1 my-4 rounded-2xl overflow-hidden bg-slate-950 border border-cyan-500/30 flex items-center justify-center">
            {capturedPhoto ? (
              <img src={capturedPhoto} alt="Captured" className="w-full h-full object-cover" />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}

            {/* Viewfinder crosshairs */}
            <div className="absolute inset-8 border border-cyan-400/30 rounded-xl pointer-events-none flex items-center justify-center">
              <div className="w-10 h-10 border border-dashed border-cyan-300 rounded-full animate-spin"></div>
            </div>
          </div>

          {/* Camera Controls */}
          <div className="flex items-center justify-around py-3">
            <button
              onClick={() => executeVoiceCommand('ছবি তোলো')}
              className="text-xs text-cyan-300 font-semibold flex items-center gap-1.5"
            >
              <Mic className="w-4 h-4" />
              <span>ভয়েস: "ছবি তোলো"</span>
            </button>

            <button
              onClick={takePhoto}
              className="w-16 h-16 rounded-full bg-white border-4 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.8)] active:scale-90 transition flex items-center justify-center cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-cyan-500"></div>
            </button>

            {capturedPhoto ? (
              <button
                onClick={() => setCapturedPhoto(null)}
                className="text-xs text-rose-400 font-semibold"
              >
                Retake
              </button>
            ) : (
              <button
                onClick={() => openCamera(facingMode === 'user' ? 'environment' : 'user')}
                className="text-xs text-slate-300 font-semibold"
              >
                Flip
              </button>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: FLASHLIGHT SCREEN & TORCH */}
      {activeModal === 'flashlight' && (
        <div className={`fixed inset-0 z-50 flex flex-col justify-between p-6 transition-all duration-300 ${
          torchState ? 'bg-amber-100 text-slate-950' : 'bg-slate-950 text-white'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">
              System Torchlight Controller
            </span>
            <button
              onClick={() => setActiveModal(null)}
              className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center space-y-6">
            <div 
              onClick={() => {
                const s = !torchState;
                setTorchState(s);
                systemAppsService.toggleTorch(s);
                audioService.playCyberChime('activate');
              }}
              className={`w-36 h-36 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
                torchState 
                  ? 'bg-amber-400 shadow-[0_0_80px_rgba(251,191,36,0.9)] scale-110' 
                  : 'bg-slate-800 border-2 border-slate-700'
              }`}
            >
              <Flashlight className={`w-16 h-16 ${torchState ? 'text-slate-950 animate-pulse' : 'text-slate-500'}`} />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold">
                {torchState ? 'টর্চলাইট চালু আছে (ON)' : 'টর্চলাইট বন্ধ (OFF)'}
              </h3>
              <p className="text-xs opacity-80 mt-1">
                ভয়েস কমান্ড বলুন: "টর্চ বন্ধ করো" বা "এসওএস মোড"
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setTorchState(true);
                systemAppsService.toggleTorch(true);
              }}
              className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              ON
            </button>
            <button
              onClick={() => {
                setTorchState(false);
                systemAppsService.toggleTorch(false);
              }}
              className="px-6 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs"
            >
              OFF
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: PHONE DIALER */}
      {activeModal === 'phone' && (
        <div className="fixed inset-0 z-50 bg-[#030914]/95 backdrop-blur-md flex flex-col justify-between p-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400" />
              ফোন ও ভয়েস ডায়ালার
            </h3>
            <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Number Display */}
          <div className="my-auto text-center space-y-4">
            <div className="text-2xl font-mono font-bold text-emerald-400 tracking-wider min-h-[36px]">
              {dialerNumber || 'নম্বর লিখুন...'}
            </div>

            {/* Quick Speed Dials */}
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setDialerNumber('Mom (আম্মু)')}
                className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs"
              >
                📞 আম্মু
              </button>
              <button
                onClick={() => setDialerNumber('Dad (আব্বু)')}
                className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs"
              >
                📞 আব্বু
              </button>
              <button
                onClick={() => setDialerNumber('999')}
                className="px-3 py-1 rounded-full bg-rose-950 border border-rose-500/40 text-rose-300 text-xs font-bold"
              >
                🚨 জরুরি ৯৯৯
              </button>
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
                <button
                  key={k}
                  onClick={() => {
                    audioService.playCyberChime('beep');
                    setDialerNumber(prev => prev + k);
                  }}
                  className="w-14 h-14 rounded-full bg-[#0a1b2e] border border-cyan-900/60 hover:border-cyan-400 text-lg font-bold text-white flex items-center justify-center active:scale-95 transition mx-auto"
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          {/* Call Trigger Buttons */}
          <div className="flex items-center justify-center gap-4 pb-4">
            <button
              onClick={() => {
                if (dialerNumber) {
                  window.location.href = `tel:${dialerNumber}`;
                }
              }}
              className="flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(52,211,153,0.5)] active:scale-95 transition"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>কল করুন (Call)</span>
            </button>
            <button
              onClick={() => setDialerNumber('')}
              className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400"
            >
              C
            </button>
          </div>
        </div>
      )}

      {/* MODAL 4: QUICK SYSTEM SETTINGS TOGGLE PANEL */}
      {activeModal === 'settings' && (
        <div className="fixed inset-0 z-50 bg-[#030914]/95 backdrop-blur-md flex flex-col justify-between p-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-indigo-400" />
              সিস্টেম কন্ট্রোল সেন্টার (System Quick Panel)
            </h3>
            <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 my-auto">
            {/* Quick Tile Toggles */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setWifiState(!wifiState); audioService.playCyberChime('beep'); }}
                className={`p-3 rounded-2xl border flex items-center justify-between transition ${
                  wifiState ? 'bg-cyan-950/70 border-cyan-400 text-cyan-300' : 'bg-slate-900/60 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4" />
                  <span className="text-xs font-bold">Wi-Fi</span>
                </div>
                <span className="text-[10px] font-mono">{wifiState ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => { setBluetoothState(!bluetoothState); audioService.playCyberChime('beep'); }}
                className={`p-3 rounded-2xl border flex items-center justify-between transition ${
                  bluetoothState ? 'bg-blue-950/70 border-blue-400 text-blue-300' : 'bg-slate-900/60 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Bluetooth className="w-4 h-4" />
                  <span className="text-xs font-bold">Bluetooth</span>
                </div>
                <span className="text-[10px] font-mono">{bluetoothState ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => { 
                  const s = !torchState; 
                  setTorchState(s); 
                  systemAppsService.toggleTorch(s); 
                  audioService.playCyberChime('beep'); 
                }}
                className={`p-3 rounded-2xl border flex items-center justify-between transition ${
                  torchState ? 'bg-amber-950/70 border-amber-400 text-amber-300' : 'bg-slate-900/60 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Flashlight className="w-4 h-4" />
                  <span className="text-xs font-bold">Flashlight</span>
                </div>
                <span className="text-[10px] font-mono">{torchState ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={handleBoostRam}
                className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-cyan-950/80 border border-emerald-500/50 text-emerald-300 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  <span className="text-xs font-bold">RAM Boost</span>
                </div>
                <span className="text-[10px] font-mono">Clean</span>
              </button>
            </div>

            {/* Brightness Slider */}
            <div className="bg-[#081525] p-3 rounded-2xl border border-cyan-950 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-400" />
                  স্ক্রিন ব্রাইটনেস (Brightness)
                </span>
                <span className="font-mono text-cyan-400 font-bold">{brightnessLevel}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={brightnessLevel}
                onChange={(e) => setBrightnessLevel(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            {/* Volume Slider */}
            <div className="bg-[#081525] p-3 rounded-2xl border border-cyan-950 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                  মিডিয়া ও সিস্টেম ভলিউম
                </span>
                <span className="font-mono text-cyan-400 font-bold">{volumeLevel}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volumeLevel}
                onChange={(e) => setVolumeLevel(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
          >
            সম্পন্ন (Done)
          </button>
        </div>
      )}

      {/* MODAL 5: VOICE CALCULATOR */}
      {activeModal === 'calculator' && (
        <div className="fixed inset-0 z-50 bg-[#030914]/95 backdrop-blur-md flex flex-col justify-between p-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-teal-400" />
              ভয়েস ক্যালকুলেটর (Voice Calculator)
            </h3>
            <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Calculator Output */}
          <div className="bg-[#07172b] border border-teal-500/40 rounded-2xl p-4 my-auto text-right space-y-2">
            <span className="text-xs text-slate-400 block font-mono">{calculatorInput} =</span>
            <span className="text-3xl font-black font-mono text-teal-300 block">{calculatorResult}</span>
            <div className="flex items-center justify-between pt-2 border-t border-teal-900/40 text-[10px] text-teal-400">
              <span>ভয়েস বলুন: "হিসাব করো ২৫০ গুণ ১২"</span>
              <button
                onClick={() => audioService.speak(`ফলাফল হলো ${calculatorResult}`)}
                className="flex items-center gap-1 text-white hover:text-teal-300"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>শুনুন</span>
              </button>
            </div>
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-4 gap-2 pb-4">
            {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', 'C', '0', '=', '+'].map((btn) => (
              <button
                key={btn}
                onClick={() => {
                  audioService.playCyberChime('beep');
                  if (btn === 'C') {
                    setCalculatorInput('');
                    setCalculatorResult('0');
                  } else if (btn === '=') {
                    try {
                      const evaluated = Function(`'use strict'; return (${calculatorInput.replace(/x/g, '*')})`)();
                      setCalculatorResult(String(evaluated));
                      audioService.speak(`উত্তর হলো ${evaluated}`);
                    } catch {
                      setCalculatorResult('Error');
                    }
                  } else {
                    setCalculatorInput(prev => prev + btn);
                  }
                }}
                className={`py-3 rounded-xl font-mono font-bold text-sm transition active:scale-95 ${
                  btn === '=' 
                    ? 'bg-teal-500 text-slate-950 col-span-1' 
                    : btn === 'C' 
                    ? 'bg-rose-950 text-rose-300 border border-rose-500/40' 
                    : 'bg-[#091b30] text-white border border-cyan-950'
                }`}
              >
                {btn}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 6: MUSIC PLAYER */}
      {activeModal === 'music' && (
        <div className="fixed inset-0 z-50 bg-[#030914]/95 backdrop-blur-md flex flex-col justify-between p-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Music className="w-4 h-4 text-pink-400" />
              সিস্টেম মিউজিক প্লেয়ার (Cyber Audio)
            </h3>
            <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="my-auto flex flex-col items-center justify-center space-y-4">
            <div className="w-36 h-36 rounded-3xl bg-gradient-to-tr from-pink-600 to-purple-600 p-[2px] shadow-[0_0_30px_rgba(236,72,153,0.5)]">
              <div className="w-full h-full rounded-[22px] bg-[#030914] flex items-center justify-center">
                <Music className={`w-16 h-16 text-pink-400 ${isMusicPlaying ? 'animate-bounce' : ''}`} />
              </div>
            </div>

            <div className="text-center">
              <h4 className="text-sm font-bold text-white">Neon Cyber Waves 2026</h4>
              <p className="text-xs text-pink-400">SH AI Ambient Synth Engine</p>
            </div>

            {/* VoiceWave */}
            <div className="w-full max-w-xs">
              <VoiceWave isListening={false} isSpeaking={isMusicPlaying} height={60} />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => {
                  const p = !isMusicPlaying;
                  setIsMusicPlaying(p);
                  audioService.playCyberChime(p ? 'activate' : 'alert');
                }}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white flex items-center justify-center shadow-lg active:scale-95 transition"
              >
                {isMusicPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
              </button>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400">
            ভয়েস কমান্ড বলুন: "গান বাজাও" অথবা "গান থামাও"
          </div>
        </div>
      )}

      {/* MODAL 7: CLOCK & ALARM */}
      {activeModal === 'clock' && (
        <div className="fixed inset-0 z-50 bg-[#030914]/95 backdrop-blur-md flex flex-col justify-between p-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              ঘড়ি ও অ্যালার্ম (Clock & Alarm)
            </h3>
            <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="my-auto space-y-4 max-w-xs mx-auto w-full">
            <div className="text-center">
              <span className="text-4xl font-black font-mono text-purple-300">07:00 AM</span>
              <p className="text-xs text-slate-400 mt-1">Next Alarm in 8 hours</p>
            </div>

            <div className="space-y-2">
              {activeAlarmList.map((al, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#081525] border border-purple-900/60">
                  <span className="text-sm font-bold text-white font-mono">{al}</span>
                  <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/40">Active</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setActiveAlarmList(prev => [...prev, '06:00 AM']);
                audioService.speak('নতুন অ্যালার্ম ভোর ৬টায় সেট করা হয়েছে।');
              }}
              className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs"
            >
              + নতুন অ্যালার্ম যোগ করুন
            </button>
          </div>

          <div className="text-center text-[10px] text-slate-400">
            ভয়েস কমান্ড: "সকাল ৭টায় অ্যালার্ম দাও"
          </div>
        </div>
      )}

      {/* MODAL 8: MESSAGES SMS */}
      {activeModal === 'messages' && (
        <div className="fixed inset-0 z-50 bg-[#030914]/95 backdrop-blur-md flex flex-col justify-between p-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              এসএমএস ও বার্তা কম্পোজার
            </h3>
            <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="my-auto space-y-3 max-w-sm mx-auto w-full">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400">প্রাপক (Recipient):</label>
              <input
                type="text"
                defaultValue="01711002233"
                className="w-full bg-[#081525] border border-cyan-900 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400">বার্তা (Message Body):</label>
              <textarea
                rows={4}
                defaultValue="হ্যালো, আমি মিটিংয়ে আছি। একটু পরে কল করছি।"
                className="w-full bg-[#081525] border border-cyan-900 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <button
              onClick={() => {
                window.location.href = `sms:01711002233?body=Hello`;
              }}
              className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>এসএমএস পাঠান (Send SMS)</span>
            </button>
          </div>

          <div className="text-center text-[10px] text-slate-400">
            ভয়েস কমান্ড: "মেসেজ পাঠাও"
          </div>
        </div>
      )}
    </div>
  );
};
