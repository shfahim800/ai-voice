import React from 'react';
import { ScreenType } from '../../types/assistant';
import { audioService } from '../../services/audioService';
import { ExternalLink, Mic, Monitor, Wrench, Layers, Cpu, CloudSun, Smartphone } from 'lucide-react';

interface OverviewGalleryProps {
  onSelectScreen: (screen: ScreenType) => void;
}

export const OverviewGallery: React.FC<OverviewGalleryProps> = ({ onSelectScreen }) => {
  const screens: { id: ScreenType; title: string; subtitle: string }[] = [
    { id: 'splash', title: 'Splash Screen', subtitle: '(Animated Logo)' },
    { id: 'home', title: 'Home Screen', subtitle: '(Quick Access)' },
    { id: 'chat', title: 'Chat Interface', subtitle: '(AI Conversation)' },
    { id: 'voice', title: 'Voice Screen', subtitle: '(VoiceWave Visualizer)' },
    { id: 'system-apps', title: 'System Apps', subtitle: '(Voice Control 15 Apps)' },
    { id: 'social-media', title: 'Social Media AI', subtitle: '(FB, WA, YT, TikTok Voice)' },
    { id: 'plugins', title: 'Plugins Screen', subtitle: '(14+ Future Tools)' },
    { id: 'pc-control', title: 'Wi-Fi PC Control', subtitle: '(Trackpad & Keyboard)' },
    { id: 'api-hub', title: 'Agent & API Hub', subtitle: '(Ollama & Open Source)' },
    { id: 'tools', title: 'Tools Section', subtitle: '(Daily Utilities)' },
    { id: 'ai-settings', title: 'AI Agent Settings', subtitle: '(API + Local Models)' },
    { id: 'settings', title: 'Settings', subtitle: '(Full Customization)' },
    { id: 'appearance', title: 'Appearance & Themes', subtitle: '(Cyberpunk & iOS Glass)' },
    { id: 'security-permissions', title: 'Security & Permissions', subtitle: '(Radar & PIN Shield)' },
    { id: 'software-update', title: 'Software & App Update', subtitle: '(OTA v2.5.0 Package)' },
    { id: 'connected-devices', title: 'Android Integration', subtitle: '(PC + Phone)' }
  ];

  const handleSelect = (id: ScreenType) => {
    audioService.playCyberChime('beep');
    onSelectScreen(id);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 py-4 select-none">
      {/* 2 Rows of 5 Phones matching the uploaded layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 lg:gap-5">
        {screens.map((item) => (
          <div
            key={item.id}
            onClick={() => handleSelect(item.id)}
            className="group cursor-pointer flex flex-col items-center transition-all duration-200 hover:-translate-y-1"
          >
            {/* Phone Silhouette Frame with curved corners and camera punch hole */}
            <div className="relative w-full aspect-[9/18.5] bg-[#0c1424] rounded-[32px] p-2 border-2 border-slate-700/80 group-hover:border-cyan-400 group-hover:shadow-[0_0_25px_rgba(56,189,248,0.4)] transition-all shadow-xl flex flex-col justify-between overflow-hidden">
              
              {/* Inner screen display */}
              <div className="relative w-full h-full bg-[#030712] rounded-[24px] overflow-hidden flex flex-col justify-between border border-slate-900 p-2 text-slate-200">
                
                {/* Status Bar */}
                <div className="flex justify-between items-center text-[7px] text-slate-400 px-1 font-mono">
                  <span>9:41</span>
                  {/* Punch hole */}
                  <div className="w-1.5 h-1.5 bg-black rounded-full ring-1 ring-slate-800"></div>
                  <span>LTE 100%</span>
                </div>

                {/* Screen Specific Visuals */}
                <div className="flex-1 my-auto flex flex-col justify-center">
                  
                  {/* 1. Splash */}
                  {item.id === 'splash' && (
                    <div className="flex flex-col items-center justify-center space-y-1.5 text-center">
                      <div className="w-12 h-12 rounded-full border border-cyan-400/80 glow-cyan flex items-center justify-center bg-cyan-950/40">
                        <span className="text-xs font-black text-cyan-300">SH</span>
                      </div>
                      <div>
                        <span className="text-[8px] font-bold text-white block">SH AI Assistant</span>
                        <span className="text-[6px] text-cyan-400 block">Your Personal AI</span>
                        <span className="text-[5px] text-slate-500 block">Smarter • Faster • Together</span>
                      </div>
                      <div className="w-16 h-1 bg-cyan-950 rounded-full overflow-hidden mt-1">
                        <div className="w-2/3 h-full bg-cyan-400"></div>
                      </div>
                      <span className="text-[5px] text-slate-400">Initializing AI Core...</span>
                    </div>
                  )}

                  {/* 2. Home */}
                  {item.id === 'home' && (
                    <div className="space-y-1.5 text-left w-full">
                      <div className="p-1 rounded-lg bg-[#0c1f36] border border-cyan-500/30 flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-cyan-600/40 border border-cyan-400 flex items-center justify-center text-[7px] font-bold text-cyan-300">SH</div>
                        <div>
                          <div className="text-[7px] font-bold text-white leading-tight">Good Evening, SH Fahim</div>
                          <div className="text-[5px] text-slate-400">How can I help you today?</div>
                        </div>
                      </div>

                      <div className="p-1 rounded-lg bg-[#0a1a30] border border-cyan-400/40 flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <Mic className="w-3 h-3 text-cyan-400" />
                          <div>
                            <span className="text-[7px] font-bold text-white block leading-tight">Voice</span>
                            <span className="text-[5px] text-cyan-300">Tap to speak</span>
                          </div>
                        </div>
                        <div className="flex gap-0.5 items-center h-3">
                          <span className="w-0.5 h-1.5 bg-cyan-400 rounded-full"></span>
                          <span className="w-0.5 h-3 bg-cyan-300 rounded-full"></span>
                          <span className="w-0.5 h-2 bg-cyan-400 rounded-full"></span>
                        </div>
                      </div>

                      <div className="p-1 rounded-lg bg-[#091525] border border-blue-500/30 flex justify-between items-center">
                        <span className="text-[7px] text-slate-300">Chat / Type a message...</span>
                        <span className="text-[7px] text-slate-500">&gt;</span>
                      </div>

                      <div className="grid grid-cols-2 gap-1 text-[6px]">
                        <div className="p-1 bg-[#091525] rounded border border-cyan-950 text-white font-bold">PC Control</div>
                        <div className="p-1 bg-[#091525] rounded border border-cyan-950 text-white font-bold">Tools</div>
                        <div className="p-1 bg-[#091525] rounded border border-cyan-950 text-white font-bold flex justify-between">
                          <span>Plugins</span>
                          <span className="text-cyan-400">10</span>
                        </div>
                        <div className="p-1 bg-[#091525] rounded border border-cyan-950 text-white font-bold">Automation</div>
                      </div>
                    </div>
                  )}

                  {/* 3. Chat */}
                  {item.id === 'chat' && (
                    <div className="space-y-1.5 text-left w-full text-[6px]">
                      <div className="bg-cyan-600 text-white p-1 rounded-lg ml-auto w-4/5">
                        আজকের আবহাওয়া কেমন?
                      </div>
                      <div className="bg-[#09182b] border border-cyan-500/30 p-1 rounded-lg mr-auto w-full text-slate-300 space-y-1">
                        <div>আজ ঢাকা বিভাগের আবহাওয়া সাধারণত পরিষ্কার থাকবে।</div>
                        <div className="p-1 bg-[#040e1c] rounded border border-cyan-500/40 flex justify-between">
                          <div>
                            <span className="font-bold text-white block">Dhaka</span>
                            <span className="text-slate-400">Partly Cloudy</span>
                          </div>
                          <span className="text-cyan-300 font-bold">32°C / 24°C</span>
                        </div>
                      </div>
                      <div className="bg-cyan-600 text-white p-1 rounded-lg ml-auto w-4/5">
                        আমাকে একটি ভালো মোবাইল সাজেস্ট করো বাজেট ২০-২৫ হাজার টাকা।
                      </div>
                      <div className="bg-[#09182b] border border-cyan-500/30 p-1 rounded-lg mr-auto w-full text-slate-300">
                        <span className="font-bold text-white block">Samsung Galaxy A55 5G</span>
                        <span className="text-[5px] text-slate-400 block">• 8GB RAM | 256GB Storage</span>
                      </div>
                    </div>
                  )}

                  {/* 4. Voice */}
                  {item.id === 'voice' && (
                    <div className="flex flex-col items-center justify-center space-y-2 text-center">
                      <span className="text-[7px] text-cyan-400 font-bold">Listening...</span>
                      <div className="w-14 h-14 rounded-full border border-cyan-400/80 glow-cyan flex items-center justify-center bg-cyan-950/60 shadow-[0_0_20px_rgba(56,189,248,0.5)]">
                        <Mic className="w-6 h-6 text-cyan-300 stroke-[2.2]" />
                      </div>
                      <span className="text-[8px] font-bold text-white">শুনছি... বলুন...</span>
                      <div className="flex gap-0.5 items-center justify-center h-4 w-full px-2">
                        {[2, 4, 8, 14, 10, 6, 12, 16, 9, 4, 2].map((h, i) => (
                          <span key={i} className="w-1 bg-cyan-400 rounded-full" style={{ height: `${h}px` }}></span>
                        ))}
                      </div>
                      <div className="px-3 py-1 rounded-full bg-rose-950 border border-rose-500 text-[6px] text-rose-300 font-bold">
                        Tap to stop
                      </div>
                    </div>
                  )}

                  {/* System Apps Voice Control */}
                  {item.id === 'system-apps' && (
                    <div className="space-y-1 w-full text-[6px]">
                      <div className="p-1 rounded-lg bg-emerald-950/70 border border-emerald-500/50 flex justify-between items-center">
                        <span className="font-bold text-emerald-300">System Controller</span>
                        <span className="text-[5px] text-emerald-400 font-mono">15 Apps</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 pt-0.5">
                        <div className="p-1 bg-[#081525] rounded border border-rose-900/60 text-rose-300 flex items-center justify-between">
                          <span>📷 ক্যামেরা</span>
                          <span className="text-emerald-400">●</span>
                        </div>
                        <div className="p-1 bg-[#081525] rounded border border-amber-900/60 text-amber-300 flex items-center justify-between">
                          <span>🔦 টর্চলাইট</span>
                          <span className="text-emerald-400">●</span>
                        </div>
                        <div className="p-1 bg-[#081525] rounded border border-emerald-900/60 text-emerald-300 flex items-center justify-between">
                          <span>📞 ডায়ালার</span>
                          <span className="text-emerald-400">●</span>
                        </div>
                        <div className="p-1 bg-[#081525] rounded border border-purple-900/60 text-purple-300 flex items-center justify-between">
                          <span>⏰ অ্যালার্ম</span>
                          <span className="text-emerald-400">●</span>
                        </div>
                      </div>
                      <div className="p-1 bg-[#051122] rounded border border-cyan-500/40 text-center text-[5px] text-cyan-300 font-mono mt-0.5">
                        Voice: "ক্যামেরা খোলো", "টর্চ অন"
                      </div>
                    </div>
                  )}

                  {/* Social Media AI Hub */}
                  {item.id === 'social-media' && (
                    <div className="space-y-1 w-full text-[6px]">
                      <div className="p-1 rounded-lg bg-blue-950/70 border border-cyan-500/50 flex justify-between items-center">
                        <span className="font-bold text-cyan-300">Social AI Hub</span>
                        <span className="text-[5px] text-pink-400 font-mono">Voice A-Z</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 pt-0.5">
                        <div className="p-1 bg-[#081525] rounded border border-blue-900/60 text-blue-300">
                          <span>📘 Facebook</span>
                        </div>
                        <div className="p-1 bg-[#081525] rounded border border-emerald-900/60 text-emerald-300">
                          <span>💬 WhatsApp</span>
                        </div>
                        <div className="p-1 bg-[#081525] rounded border border-red-900/60 text-red-300">
                          <span>▶️ YouTube</span>
                        </div>
                        <div className="p-1 bg-[#081525] rounded border border-purple-900/60 text-purple-300">
                          <span>🎵 TikTok</span>
                        </div>
                      </div>
                      <div className="p-1 bg-[#051122] rounded border border-cyan-500/40 text-center text-[5px] text-cyan-300 font-mono mt-0.5">
                        Voice: "ফেসবুকে পোস্ট", "ইউটিউবে গান"
                      </div>
                    </div>
                  )}

                  {/* 5. Plugins */}
                  {item.id === 'plugins' && (
                    <div className="space-y-1 w-full text-[6px]">
                      <div className="flex justify-between items-center text-slate-400 pb-0.5 border-b border-slate-900">
                        <span className="font-bold text-white">Plugins (10)</span>
                        <span className="text-cyan-400">All • Active</span>
                      </div>
                      {[
                        'AI Chat',
                        'Voice Recognition',
                        'Text to Speech',
                        'Web Search',
                        'File Manager',
                        'App Launcher'
                      ].map((name, idx) => (
                        <div key={idx} className="flex justify-between items-center p-0.5 bg-[#081525] rounded border border-cyan-950">
                          <span className="text-white font-medium">{name}</span>
                          <span className="w-3 h-1.5 bg-cyan-500 rounded-full"></span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 6. PC Control */}
                  {item.id === 'pc-control' && (
                    <div className="space-y-1 w-full text-[6px]">
                      <span className="font-bold text-white block">PC Control</span>
                      <div className="grid grid-cols-2 gap-1">
                        {[
                          { n: 'Open Notepad', d: 'Text editor' },
                          { n: 'Open Calc', d: 'Calculator' },
                          { n: 'File Manager', d: 'Browse' },
                          { n: 'Open Browser', d: 'Web' }
                        ].map((c, i) => (
                          <div key={i} className="p-1 bg-[#091524] rounded border border-cyan-950">
                            <span className="font-bold text-white block">{c.n}</span>
                            <span className="text-[5px] text-slate-400 block">{c.d}</span>
                          </div>
                        ))}
                      </div>
                      <div className="p-1 rounded bg-[#061424] border border-cyan-500/40 text-[5px] text-emerald-400 flex items-center justify-between mt-1">
                        <span>PC Connected 192.168.1.10</span>
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                      </div>
                    </div>
                  )}

                  {/* Agent Hub */}
                  {item.id === 'api-hub' && (
                    <div className="space-y-1 w-full text-[6px]">
                      <span className="font-bold text-white block">Open Source AI Hub</span>
                      <div className="space-y-1">
                        <div className="p-1 bg-[#091524] rounded border border-cyan-400/50 flex justify-between items-center">
                          <span className="text-cyan-300 font-bold">Ollama (Local LLM)</span>
                          <span className="text-[5px] text-emerald-400 font-mono">14ms</span>
                        </div>
                        <div className="p-1 bg-[#091524] rounded border border-slate-800 flex justify-between items-center">
                          <span className="text-white">DeepSeek R1</span>
                          <span className="text-[5px] text-cyan-400 font-mono">22ms</span>
                        </div>
                        <div className="p-1 bg-[#091524] rounded border border-slate-800 flex justify-between items-center">
                          <span className="text-white">Hugging Face</span>
                          <span className="text-[5px] text-amber-400 font-mono">85ms</span>
                        </div>
                      </div>
                      <div className="p-1 rounded bg-cyan-950/40 border border-cyan-500/30 text-[5px] text-cyan-300">
                        Autonomous Webhook Active
                      </div>
                    </div>
                  )}

                  {/* 7. Tools */}
                  {item.id === 'tools' && (
                    <div className="space-y-1 w-full text-[6px]">
                      <span className="font-bold text-white block">Tools Section</span>
                      {[
                        'Weather (Live info)',
                        'News (Latest updates)',
                        'YouTube (Videos)',
                        'Notes (Manage)',
                        'Calendar (Reminders)',
                        'Currency Converter (BDT)'
                      ].map((t, i) => (
                        <div key={i} className="flex justify-between items-center p-0.5 bg-[#081525] rounded border border-cyan-950">
                          <span className="text-slate-200">{t}</span>
                          <span className="text-slate-500">&gt;</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 8. AI Agent Settings */}
                  {item.id === 'ai-settings' && (
                    <div className="space-y-1 w-full text-[6px]">
                      <span className="font-bold text-white block">AI Agent Settings</span>
                      <div className="p-1 bg-[#091b30] border border-cyan-400 rounded text-cyan-300 font-bold flex justify-between">
                        <span>OpenAI (GPT-4o)</span>
                        <span>✓</span>
                      </div>
                      <div className="p-1 bg-[#081525] border border-cyan-950 rounded text-slate-400">
                        Gemini (Google AI)
                      </div>
                      <div className="p-1 bg-[#081525] border border-cyan-950 rounded text-slate-400">
                        Ollama (Local Offline)
                      </div>
                      <div className="flex justify-between text-slate-400 pt-0.5">
                        <span>Temp: 0.7</span>
                        <span className="text-cyan-400">API Key: •••••••</span>
                      </div>
                    </div>
                  )}

                  {/* 9. Settings */}
                  {item.id === 'settings' && (
                    <div className="space-y-1 w-full text-[6px]">
                      <span className="font-bold text-white block">Settings</span>
                      {[
                        'Voice Settings',
                        'Appearance (Theme)',
                        'Security (PIN)',
                        'Notifications',
                        'Network (Wi-Fi)'
                      ].map((s, i) => (
                        <div key={i} className="flex justify-between items-center p-0.5 bg-[#081525] rounded border border-cyan-950">
                          <span className="text-slate-200">{s}</span>
                          <span className="text-slate-500">&gt;</span>
                        </div>
                      ))}
                      <div className="p-1 bg-[#07172b] rounded border border-cyan-500/30 text-center text-[5px] text-slate-400 mt-1">
                        SH AI Assistant v1.0
                      </div>
                    </div>
                  )}

                  {/* Appearance & Themes Preview */}
                  {item.id === 'appearance' && (
                    <div className="space-y-1 w-full text-[6px]">
                      <div className="p-1 rounded-lg bg-gradient-to-r from-sky-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-md border border-white/30 text-center">
                        <span className="text-[6px] font-bold text-white block">iOS Blur Glass</span>
                        <span className="text-[5px] text-sky-300">Frosted Glassmorphism</span>
                      </div>
                      <div className="p-1 rounded-lg bg-[#060b1c] border border-[#00f0ff] shadow-[0_0_8px_rgba(0,240,255,0.4)] text-center">
                        <span className="text-[6px] font-bold text-[#00f0ff] font-mono block">Cyberpunk Neon</span>
                        <span className="text-[5px] text-[#ff0055] font-mono">Night City 2077</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 pt-0.5">
                        <div className="p-0.5 rounded bg-black border border-neutral-700 text-center text-[5px] text-neutral-300">
                          OLED Black
                        </div>
                        <div className="p-0.5 rounded bg-[#021408] border border-emerald-500/50 text-center text-[5px] text-emerald-300">
                          Matrix Green
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Security & Permissions Preview */}
                  {item.id === 'security-permissions' && (
                    <div className="space-y-1 w-full text-[6px]">
                      <div className="p-1 rounded-lg bg-emerald-950/60 border border-emerald-500/50 flex justify-between items-center">
                        <span className="font-bold text-emerald-300">Defense Radar</span>
                        <span className="text-[5px] text-emerald-400 font-mono">100% Safe</span>
                      </div>
                      {['Microphone', 'Vision Scanner', 'Biometric Lock', 'Encrypted Storage'].map((p, idx) => (
                        <div key={idx} className="flex justify-between items-center p-0.5 bg-[#081525] rounded border border-emerald-950">
                          <span className="text-slate-200">{p}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Software Update Preview */}
                  {item.id === 'software-update' && (
                    <div className="space-y-1 w-full text-[6px]">
                      <div className="p-1 rounded-lg bg-cyan-950/60 border border-cyan-500/50 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-white block">OTA Client</span>
                          <span className="text-[5px] text-cyan-300 font-mono">v2.5.0 Available</span>
                        </div>
                        <span className="text-[5px] px-1 py-0.2 rounded bg-cyan-500 text-black font-bold">NEW</span>
                      </div>
                      <div className="p-1 bg-[#061220] rounded border border-cyan-950 text-slate-300">
                        <span className="block text-[5px] text-slate-400">Features:</span>
                        <span>• Cyberpunk & Glass</span>
                        <span className="block">• Security Shield</span>
                      </div>
                    </div>
                  )}

                  {/* 10. Connected Devices */}
                  {item.id === 'connected-devices' && (
                    <div className="space-y-1 w-full text-[6px]">
                      <div className="p-1 rounded bg-[#091f38] border border-cyan-400/50 flex justify-between items-center">
                        <div>
                          <span className="text-white font-bold block">Samsung Galaxy A55 5G</span>
                          <span className="text-slate-400 text-[5px]">Connected</span>
                        </div>
                        <span className="text-[5px] bg-emerald-950 text-emerald-400 px-1 rounded border border-emerald-500/40">Online</span>
                      </div>
                      {[
                        'File Transfer',
                        'Remote Control',
                        'Notifications',
                        'Message Sync',
                        'Camera Share'
                      ].map((d, i) => (
                        <div key={i} className="flex justify-between items-center p-0.5 bg-[#081525] rounded border border-cyan-950">
                          <span className="text-slate-200">{d}</span>
                          <span className="text-slate-500">&gt;</span>
                        </div>
                      ))}
                    </div>
                  )}

                </div>

                {/* Bottom Nav Simulation Bar */}
                <div className="h-1 bg-cyan-900/60 rounded-full w-1/3 mx-auto mt-1"></div>
              </div>
            </div>

            {/* Label below phone (matching the uploaded image caption) */}
            <div className="text-center mt-2.5">
              <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition leading-tight">
                {item.title}
              </h4>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
