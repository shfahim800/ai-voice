import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Smartphone, 
  Monitor, 
  Grid, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Layers, 
  Maximize2, 
  Minimize2,
  Terminal,
  Laptop,
  FileCode,
  Palette
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ScreenType, PluginItem, AssistantSettings, AIProvider } from './types/assistant';
import { PhoneFrame } from './components/PhoneFrame';
import { SplashScreen } from './components/screens/SplashScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { ChatScreen } from './components/screens/ChatScreen';
import { VoiceScreen } from './components/screens/VoiceScreen';
import { PluginsScreen } from './components/screens/PluginsScreen';
import { PcControlScreen } from './components/screens/PcControlScreen';
import { ToolsScreen } from './components/screens/ToolsScreen';
import { AiSettingsScreen } from './components/screens/AiSettingsScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { VoiceSettingsScreen } from './components/screens/VoiceSettingsScreen';
import { AppearanceScreen } from './components/screens/AppearanceScreen';
import { SecurityPermissionsScreen } from './components/screens/SecurityPermissionsScreen';
import { SoftwareUpdateScreen } from './components/screens/SoftwareUpdateScreen';
import { SystemAppsScreen } from './components/screens/SystemAppsScreen';
import { SocialMediaScreen } from './components/screens/SocialMediaScreen';
import { ApiHubScreen } from './components/screens/ApiHubScreen';
import { ConnectedDevicesScreen } from './components/screens/ConnectedDevicesScreen';
import { OverviewGallery } from './components/screens/OverviewGallery';
import { themeService, THEMES } from './services/themeService';
import { ApkExportModal } from './components/ApkExportModal';
import { WeatherModal } from './components/tools/WeatherModal';
import { CurrencyModal } from './components/tools/CurrencyModal';
import { NotesModal } from './components/tools/NotesModal';
import { QrScannerModal } from './components/tools/QrScannerModal';
import { ImageGenModal } from './components/tools/ImageGenModal';
import { BrandingFooter } from './components/BrandingFooter';
import { audioService } from './services/audioService';
import { downloadHtmlCodeZip } from './services/apkGenerator';

const INITIAL_PLUGINS: PluginItem[] = [
  { id: '1', name: 'AI Chat', description: 'Multi AI & Chat Model', iconName: 'bot', enabled: true, category: 'core' },
  { id: '2', name: 'Voice Recognition', description: 'Speech to Text', iconName: 'mic', enabled: true, category: 'core' },
  { id: '3', name: 'Text to Speech', description: 'AI Voice Generator', iconName: 'volume', enabled: true, category: 'core' },
  { id: '4', name: 'Web Search', description: 'Real-time Internet Search', iconName: 'search', enabled: true, category: 'tools' },
  { id: '5', name: 'File Manager', description: 'Files & Documents', iconName: 'folder', enabled: true, category: 'system' },
  { id: '6', name: 'App Launcher', description: 'Open Installed Apps', iconName: 'grid', enabled: true, category: 'system' },
  { id: '7', name: 'Translation', description: 'Bangla ↔ English', iconName: 'languages', enabled: true, category: 'tools' },
  { id: '8', name: 'Calculator', description: 'Quick Calculation', iconName: 'calc', enabled: true, category: 'tools' },
  { id: '9', name: 'System Monitor', description: 'CPU | RAM | Network', iconName: 'activity', enabled: true, category: 'system' },
  { id: '10', name: 'Automation', description: 'Task & Workflow', iconName: 'workflow', enabled: true, category: 'system' },
  { id: '11', name: 'Hardware Telemetry', description: 'Real-time CPU | GPU | RAM', iconName: 'cpu', enabled: true, category: 'system' },
  { id: '12', name: 'Cloud Clipboard Sync', description: 'Cross-Device Phone ↔ PC', iconName: 'clipboard', enabled: true, category: 'system' },
  { id: '13', name: 'Code & Prompt Sandbox', description: 'Run Scripts & JSON Payloads', iconName: 'terminal', enabled: true, category: 'tools' },
  { id: '14', name: 'Network Traffic Analyzer', description: 'Ping | Latency | Wi-Fi Bridge', iconName: 'wifi', enabled: true, category: 'tools' },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [viewMode, setViewMode] = useState<'phone' | 'fullscreen' | 'gallery'>('gallery');
  const [plugins, setPlugins] = useState<PluginItem[]>(INITIAL_PLUGINS);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [settings, setSettings] = useState<AssistantSettings>({
    userName: 'SH Fahim',
    language: 'bn-BD',
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    temperature: 0.7,
    apiKey: '',
    voiceGender: 'female',
    wakeWordEnabled: true,
    hapticFeedback: true,
    pcIpAddress: '192.168.1.10',
    pcPort: 5890,
    pcConnected: true,
    phoneConnected: true,
    theme: 'ios-26-liquid',
    voiceConfig: {
      selectedLanguage: 'bn-BD',
      autoDetectLanguage: true,
      speechRate: 1.15,
      speechPitch: 1.1,
      voiceGender: 'neural',
      wakeWordEnabled: true,
      wakeWordPhrase: 'হেই ৪২০ ফ্রাইডে',
      noiseSuppression: true,
      offlineVoiceModel: false,
      presetId: 'friday-420',
      ageProfile: 'adult',
      backgroundListening: true,
      timeGreetingEnabled: true
    }
  });

  // Capture PWA install prompt for WebAPK install
  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    const unsubTheme = themeService.subscribe((t) => {
      setSettings(prev => ({ ...prev, theme: t }));
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      unsubTheme();
    };
  }, []);

  const handleTogglePlugin = (id: string) => {
    setPlugins(prev => prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
  };

  const handleOpenPlugin = (pluginId: string) => {
    const plugin = plugins.find(p => p.id === pluginId);
    if (!plugin) return;
    if (plugin.name === 'Translation' || plugin.name === 'AI Chat') {
      setCurrentScreen('chat');
    } else if (plugin.name === 'Voice Recognition' || plugin.name === 'Text to Speech') {
      setCurrentScreen('voice');
    } else if (plugin.name === 'Calculator') {
      setActiveModal('currency');
    } else if (plugin.name === 'File Manager') {
      setCurrentScreen('pc-control');
    } else {
      setCurrentScreen('voice-settings');
    }
  };

  const handleOpenTool = (toolId: string) => {
    if (toolId === 'social-media') {
      setCurrentScreen('social-media');
    } else if (toolId === 'weather') setActiveModal('weather');
    else if (toolId === 'currency') setActiveModal('currency');
    else if (toolId === 'notes') setActiveModal('notes');
    else if (toolId === 'qr') setActiveModal('qr');
    else if (toolId === 'image-gen') setActiveModal('image-gen');
    else if (toolId === 'news') {
      setActiveModal('notes');
    } else if (toolId === 'youtube') {
      setCurrentScreen('social-media');
    } else if (toolId === 'calendar') {
      setActiveModal('notes');
    }
  };

  // Render current screen inside phone
  const renderScreenContent = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onComplete={() => setCurrentScreen('home')} />;
      case 'home':
        return (
          <HomeScreen
            userName={settings.userName}
            onNavigate={setCurrentScreen}
            onOpenApkModal={() => setIsApkModalOpen(true)}
            activePluginCount={plugins.filter(p => p.enabled).length}
          />
        );
      case 'chat':
        return (
          <ChatScreen
            onBack={() => setCurrentScreen('home')}
            onNavigate={setCurrentScreen}
            apiKey={settings.apiKey}
          />
        );
      case 'voice':
        return (
          <VoiceScreen
            onBack={() => setCurrentScreen('home')}
            onNavigate={setCurrentScreen}
            apiKey={settings.apiKey}
          />
        );
      case 'system-apps':
        return (
          <SystemAppsScreen
            onBack={() => setCurrentScreen('home')}
            onNavigate={setCurrentScreen}
          />
        );
      case 'social-media':
        return (
          <SocialMediaScreen
            onBack={() => setCurrentScreen('tools')}
            onNavigate={setCurrentScreen}
          />
        );
      case 'voice-settings':
        return (
          <VoiceSettingsScreen
            onBack={() => setCurrentScreen('settings')}
            voiceConfig={settings.voiceConfig}
            onUpdateConfig={(vc) => {
              setSettings(s => ({ ...s, voiceConfig: vc, language: vc.selectedLanguage }));
            }}
          />
        );
      case 'plugins':
        return (
          <PluginsScreen
            plugins={plugins}
            onTogglePlugin={handleTogglePlugin}
            onOpenPluginModal={handleOpenPlugin}
          />
        );
      case 'pc-control':
        return (
          <PcControlScreen
            onBack={() => setCurrentScreen('home')}
            pcIp={settings.pcIpAddress}
          />
        );
      case 'tools':
        return (
          <ToolsScreen
            onOpenTool={handleOpenTool}
          />
        );
      case 'ai-settings':
        return (
          <AiSettingsScreen
            onBack={() => setCurrentScreen('settings')}
            provider={settings.provider}
            onUpdateProvider={(p: AIProvider) => setSettings(s => ({ ...s, provider: p }))}
            apiKey={settings.apiKey}
            onUpdateApiKey={(k: string) => setSettings(s => ({ ...s, apiKey: k }))}
            temperature={settings.temperature}
            onUpdateTemp={(t: number) => setSettings(s => ({ ...s, temperature: t }))}
          />
        );
      case 'api-hub':
        return (
          <ApiHubScreen
            onBack={() => setCurrentScreen('home')}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            onNavigate={setCurrentScreen}
            onOpenApkModal={() => setIsApkModalOpen(true)}
          />
        );
      case 'appearance':
        return (
          <AppearanceScreen
            onBack={() => setCurrentScreen('settings')}
            currentTheme={settings.theme}
            onSelectTheme={(t) => {
              setSettings(s => ({ ...s, theme: t }));
            }}
          />
        );
      case 'security-permissions':
        return (
          <SecurityPermissionsScreen
            onBack={() => setCurrentScreen('settings')}
          />
        );
      case 'software-update':
        return (
          <SoftwareUpdateScreen
            onBack={() => setCurrentScreen('settings')}
            onOpenApkModal={() => setIsApkModalOpen(true)}
          />
        );
      case 'connected-devices':
        return (
          <ConnectedDevicesScreen
            onBack={() => setCurrentScreen('home')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Global Control Toolbar */}
      <header className="sticky top-0 z-40 bg-[#06101d]/90 backdrop-blur-md border-b border-cyan-950/80 px-4 py-2.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1.5px] shadow-[0_0_12px_rgba(56,189,248,0.4)]">
            <div className="w-full h-full bg-[#030712] rounded-[10px] flex items-center justify-center">
              <span className="text-xs font-black text-cyan-300">SH</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white tracking-tight">SH AI Assistant</h1>
              <span className="hidden sm:inline-block text-[10px] bg-cyan-950/90 text-cyan-400 border border-cyan-500/30 px-2 py-0.2 rounded-full font-mono">
                Android APK Suite v1.0
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Smarter • Faster • Together</p>
          </div>
        </div>

        {/* View Switchers & Controls */}
        <div className="flex items-center gap-2">
          {/* Screen quick jumper */}
          <div className="hidden md:flex items-center gap-1.5 bg-[#091524] p-1 rounded-xl border border-cyan-950 text-xs">
            <span className="text-[10px] text-slate-400 px-1 font-medium">Screen:</span>
            <select
              value={currentScreen}
              onChange={(e) => {
                audioService.playCyberChime('beep');
                setCurrentScreen(e.target.value as ScreenType);
                if (viewMode === 'gallery') setViewMode('phone');
              }}
              className="bg-transparent text-cyan-300 text-xs font-semibold focus:outline-hidden cursor-pointer"
            >
              <option value="splash" className="bg-[#091524] text-white">01. Splash Screen</option>
              <option value="home" className="bg-[#091524] text-white">02. Home Screen</option>
              <option value="chat" className="bg-[#091524] text-white">03. Chat Interface</option>
              <option value="voice" className="bg-[#091524] text-white">04. Voice Assistant</option>
              <option value="system-apps" className="bg-[#091524] text-white">📱 সিস্টেম অ্যাপস (System Voice Controller)</option>
              <option value="social-media" className="bg-[#091524] text-white">🌐 সোশ্যাল মিডিয়া (Social Media Hub)</option>
              <option value="plugins" className="bg-[#091524] text-white">05. Plugins (10 Tools)</option>
              <option value="pc-control" className="bg-[#091524] text-white">06. PC Control</option>
              <option value="tools" className="bg-[#091524] text-white">07. Tools Section</option>
              <option value="ai-settings" className="bg-[#091524] text-white">08. AI Agent Settings</option>
              <option value="settings" className="bg-[#091524] text-white">09. Settings</option>
              <option value="appearance" className="bg-[#091524] text-white">🎨 Appearance & Themes (Cyberpunk & iOS Glass)</option>
              <option value="security-permissions" className="bg-[#091524] text-white">🛡️ Security & Advanced Permissions</option>
              <option value="software-update" className="bg-[#091524] text-white">🚀 Software & App Updates (OTA)</option>
              <option value="connected-devices" className="bg-[#091524] text-white">10. Android Integration</option>
              <option value="voice-settings" className="bg-[#091524] text-white">11. Voice & Multi-Language</option>
            </select>
          </div>

          {/* Quick Theme Switcher Button */}
          <button
            onClick={() => {
              audioService.playCyberChime('beep');
              setCurrentScreen('appearance');
              if (viewMode === 'gallery') setViewMode('phone');
            }}
            className="hidden sm:flex px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-cyan-400 text-xs items-center gap-1.5 transition active:scale-95 text-slate-300"
            title="Appearance Themes: iOS Blur, Cyberpunk Neon, OLED"
          >
            <Palette className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden xl:inline text-[11px] font-semibold text-slate-400">Theme:</span>
            <span className="text-[11px] font-bold text-cyan-300">
              {THEMES[settings.theme]?.badge || 'Theme'}
            </span>
          </button>

          {/* View Modes */}
          <div className="flex items-center gap-1 bg-[#091524] p-1 rounded-xl border border-cyan-950">
            <button
              onClick={() => { audioService.playCyberChime(); setViewMode('phone'); }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition ${
                viewMode === 'phone' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
              title="Phone Simulator"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Phone</span>
            </button>
            <button
              onClick={() => { audioService.playCyberChime(); setViewMode('fullscreen'); }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition ${
                viewMode === 'fullscreen' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
              title="Fullscreen Mode"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Fullscreen</span>
            </button>
            <button
              onClick={() => { audioService.playCyberChime(); setViewMode('gallery'); }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition ${
                viewMode === 'gallery' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
              title="All Screens Mockup Overview"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">10+ Screens</span>
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 transition cursor-pointer"
            title={soundEnabled ? 'Sound Effects Enabled' : 'Muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* HTML Code ZIP Download Button */}
          <button
            onClick={async () => {
              audioService.playCyberChime('activate');
              try {
                await downloadHtmlCodeZip();
                confetti({
                  particleCount: 75,
                  spread: 60,
                  origin: { y: 0.6 }
                });
                audioService.playCyberChime('success');
              } catch (e) {
                console.error(e);
              }
            }}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.4)] hover:brightness-110 active:scale-95 transition cursor-pointer"
            title="Download complete HTML Code ZIP package"
          >
            <FileCode className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            <span className="hidden sm:inline">HTML Code</span>
            <span>ZIP</span>
          </button>

          {/* Primary Action: Android 16 APK File Download Button */}
          <button
            onClick={() => {
              audioService.playCyberChime('activate');
              setIsApkModalOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(52,211,153,0.4)] hover:brightness-110 active:scale-95 transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            <span>Android 16 APK</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 overflow-x-hidden">
        {viewMode === 'gallery' ? (
          <OverviewGallery 
            onSelectScreen={(screen) => {
              setCurrentScreen(screen);
              setViewMode('phone');
            }}
          />
        ) : (
          <div className="w-full flex flex-col items-center justify-center">
            {/* Quick Screen Selector Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-sm py-1 mb-2 no-scrollbar">
              {[
                { id: 'splash', label: '1. Splash' },
                { id: 'home', label: '2. Home' },
                { id: 'chat', label: '3. Chat' },
                { id: 'voice', label: '4. Voice' },
                { id: 'system-apps', label: '📱 সিস্টেম (System)' },
                { id: 'appearance', label: '🎨 Appearance (iOS / Cyberpunk)' },
                { id: 'voice-settings', label: '🌐 Voice (Multi-Lang)' },
                { id: 'plugins', label: '5. Plugins' },
                { id: 'pc-control', label: '6. PC' },
                { id: 'tools', label: '7. Tools' },
                { id: 'ai-settings', label: '8. AI' },
                { id: 'settings', label: '9. Settings' },
                { id: 'connected-devices', label: '10. Devices' },
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => { audioService.playCyberChime(); setCurrentScreen(s.id as ScreenType); }}
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap transition cursor-pointer ${
                    currentScreen === s.id ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(56,189,248,0.4)]' : 'bg-[#091524] text-slate-400 hover:text-white border border-cyan-950'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <PhoneFrame
              currentScreen={currentScreen}
              onNavigate={setCurrentScreen}
              activePluginCount={plugins.filter(p => p.enabled).length}
              fullscreen={viewMode === 'fullscreen'}
              theme={settings.theme}
            >
              {renderScreenContent()}
            </PhoneFrame>
          </div>
        )}
      </main>

      {/* Branding Ribbon matching the footer of the uploaded mockup */}
      <BrandingFooter />

      {/* APK & Project Export Center Modal */}
      <ApkExportModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
        deferredPrompt={deferredPrompt}
      />

      {/* Tool Utility Modals */}
      <WeatherModal
        isOpen={activeModal === 'weather'}
        onClose={() => setActiveModal(null)}
      />
      <CurrencyModal
        isOpen={activeModal === 'currency'}
        onClose={() => setActiveModal(null)}
      />
      <NotesModal
        isOpen={activeModal === 'notes'}
        onClose={() => setActiveModal(null)}
      />
      <QrScannerModal
        isOpen={activeModal === 'qr'}
        onClose={() => setActiveModal(null)}
      />
      <ImageGenModal
        isOpen={activeModal === 'image-gen'}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
}
