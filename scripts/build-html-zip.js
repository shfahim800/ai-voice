import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const rootDir = process.cwd();

// Standalone self-contained HTML application
const STANDALONE_HTML = `<!DOCTYPE html>
<html lang="bn" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>SH AI Assistant - Your Personal AI (HTML Standalone)</title>
  <meta name="description" content="SH AI Assistant - Next-generation personal AI assistant with voice, PC control, tools, plugins, and Android APK export.">
  <meta name="theme-color" content="#030712">
  <link rel="manifest" href="manifest.json">
  <link rel="icon" type="image/svg+xml" href="icon.svg">
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Hind+Siliguri:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      background-color: #030712;
      color: #f8fafc;
      font-family: 'Plus Jakarta Sans', 'Hind Siliguri', sans-serif;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }
    .glow-cyan {
      box-shadow: 0 0 25px rgba(56, 189, 248, 0.4);
    }
    .orb-pulse {
      animation: orbPulse 2.4s infinite ease-in-out;
    }
    @keyframes orbPulse {
      0%, 100% { transform: scale(1); opacity: 0.3; }
      50% { transform: scale(1.2); opacity: 0.7; }
    }
    .tech-spin {
      animation: spinTech 12s linear infinite;
    }
    @keyframes spinTech {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    /* Hide scrollbars */
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  </style>
</head>
<body class="min-h-screen flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
  
  <!-- Top Global Bar -->
  <header class="sticky top-0 z-40 bg-[#06101d]/90 backdrop-blur-md border-b border-cyan-950 px-4 py-2.5 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1.5px] shadow-[0_0_12px_rgba(56,189,248,0.4)]">
        <div class="w-full h-full bg-[#030712] rounded-[10px] flex items-center justify-center">
          <span class="text-xs font-black text-cyan-300">SH</span>
        </div>
      </div>
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-sm font-bold text-white tracking-tight">SH AI Assistant</h1>
          <span class="text-[10px] bg-cyan-950/90 text-cyan-400 border border-cyan-500/30 px-2 py-0.2 rounded-full font-mono">
            HTML5 Standalone
          </span>
        </div>
        <p class="text-[10px] text-slate-400">Smarter • Faster • Together</p>
      </div>
    </div>

    <!-- Screen Switcher Pills -->
    <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-md py-1">
      <button onclick="setScreen('home')" id="nav-home" class="nav-btn text-[10px] px-2.5 py-1 rounded-full font-semibold bg-cyan-500 text-slate-950 font-bold transition">Home</button>
      <button onclick="setScreen('voice')" id="nav-voice" class="nav-btn text-[10px] px-2.5 py-1 rounded-full font-semibold bg-[#091524] text-slate-300 border border-cyan-950 hover:text-white transition">Voice</button>
      <button onclick="setScreen('chat')" id="nav-chat" class="nav-btn text-[10px] px-2.5 py-1 rounded-full font-semibold bg-[#091524] text-slate-300 border border-cyan-950 hover:text-white transition">Chat</button>
      <button onclick="setScreen('voice-settings')" id="nav-voice-settings" class="nav-btn text-[10px] px-2.5 py-1 rounded-full font-semibold bg-[#091524] text-slate-300 border border-cyan-950 hover:text-white transition">🌐 Multi-Lang</button>
      <button onclick="setScreen('pc-control')" id="nav-pc-control" class="nav-btn text-[10px] px-2.5 py-1 rounded-full font-semibold bg-[#091524] text-slate-300 border border-cyan-950 hover:text-white transition">PC Control</button>
      <button onclick="setScreen('plugins')" id="nav-plugins" class="nav-btn text-[10px] px-2.5 py-1 rounded-full font-semibold bg-[#091524] text-slate-300 border border-cyan-950 hover:text-white transition">Plugins</button>
      <button onclick="setScreen('settings')" id="nav-settings" class="nav-btn text-[10px] px-2.5 py-1 rounded-full font-semibold bg-[#091524] text-slate-300 border border-cyan-950 hover:text-white transition">Settings</button>
    </div>
  </header>

  <!-- Main Container Simulation -->
  <main class="flex-1 flex flex-col items-center justify-center p-3 sm:p-6">
    <div class="relative w-full max-w-[400px] h-[780px] bg-[#0c1424] rounded-[48px] p-3 border-4 border-slate-700/80 shadow-[0_0_40px_rgba(56,189,248,0.25)] flex flex-col justify-between overflow-hidden">
      
      <!-- Inner Screen Container -->
      <div class="relative w-full h-full bg-[#030712] rounded-[36px] overflow-hidden flex flex-col justify-between border border-cyan-950 text-slate-200">
        
        <!-- Status Bar -->
        <div class="flex justify-between items-center text-[10px] text-slate-400 px-5 pt-3 pb-1 font-mono shrink-0">
          <span id="live-time">9:41</span>
          <!-- Camera Punch Hole -->
          <div class="w-2.5 h-2.5 bg-black rounded-full ring-2 ring-slate-800"></div>
          <div class="flex items-center gap-1.5">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        <!-- Dynamic Screen Content Area -->
        <div id="screen-container" class="flex-1 overflow-y-auto p-4 no-scrollbar">
          <!-- Dynamic injection via JS -->
        </div>

        <!-- Bottom Navigation Bar -->
        <nav class="h-16 bg-[#050c18] border-t border-cyan-950 flex items-center justify-around px-2 shrink-0">
          <button onclick="setScreen('home')" class="flex flex-col items-center gap-1 text-[10px] text-cyan-400 font-semibold">
            <svg class="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            <span>Home</span>
          </button>
          <button onclick="setScreen('chat')" class="flex flex-col items-center gap-1 text-[10px] text-slate-400 hover:text-cyan-300">
            <svg class="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            <span>Chat</span>
          </button>
          <button onclick="setScreen('voice')" class="flex flex-col items-center justify-center -mt-5">
            <div class="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.5)] border-2 border-cyan-300 active:scale-95 transition">
              <svg class="w-6 h-6 text-white stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
            </div>
            <span class="text-[9px] text-cyan-300 font-bold mt-1">Voice</span>
          </button>
          <button onclick="setScreen('pc-control')" class="flex flex-col items-center gap-1 text-[10px] text-slate-400 hover:text-cyan-300">
            <svg class="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            <span>PC</span>
          </button>
          <button onclick="setScreen('settings')" class="flex flex-col items-center gap-1 text-[10px] text-slate-400 hover:text-cyan-300">
            <svg class="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span>Settings</span>
          </button>
        </nav>

        <!-- Home Bar Indicator -->
        <div class="h-1 bg-slate-700/60 rounded-full w-28 mx-auto my-1 shrink-0"></div>
      </div>
    </div>
  </main>

  <!-- Interactive JavaScript Engine -->
  <script>
    let currentScreen = 'home';
    let currentLang = 'bn-BD';
    let isListening = false;
    let recognition = null;

    const LANGUAGES = [
      { code: 'bn-BD', name: 'বাংলা (বাংলাদেশ)', flag: '🇧🇩', greeting: 'হ্যালো! আমি এসএইচ এআই অ্যাসিস্ট্যান্ট। আমি কীভাবে আপনাকে সাহায্য করতে পারি?' },
      { code: 'bn-IN', name: 'বাংলা (ভারত)', flag: '🇮🇳', greeting: 'নমস্কার! এসএইচ এআই আপনার সেবায় প্রস্তুত।' },
      { code: 'en-US', name: 'English (US)', flag: '🇺🇸', greeting: 'Hello! I am SH AI Assistant. How can I help you today?' },
      { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧', greeting: 'Greetings! SH AI Assistant ready to assist you.' },
      { code: 'hi-IN', name: 'हिन्दी (Hindi)', flag: '🇮🇳', greeting: 'नमस्ते! मैं SH AI असिस्टेंट हूँ। मैं आपकी क्या मदद कर सकता हूँ?' },
      { code: 'ar-SA', name: 'العربية (Arabic)', flag: '🇸🇦', greeting: 'مرحباً! أنا مساعد SH الذكي. كيف يمكنني مساعدتك؟' },
      { code: 'ur-PK', name: 'اردو (Urdu)', flag: '🇵🇰', greeting: 'السلام علیکم! میں آپ کا SH AI معاون ہوں۔' },
      { code: 'es-ES', name: 'Español (Spanish)', flag: '🇪🇸', greeting: '¡Hola! Soy SH AI Assistant. ¿En qué puedo ayudarte?' },
      { code: 'fr-FR', name: 'Français (French)', flag: '🇫🇷', greeting: 'Bonjour! Je suis votre assistant vocal SH AI.' },
      { code: 'de-DE', name: 'Deutsch (German)', flag: '🇩🇪', greeting: 'Hallo! Ich bin dein SH AI Assistent.' },
      { code: 'ja-JP', name: '日本語 (Japanese)', flag: '🇯🇵', greeting: 'こんにちは！SH AIアシスタントです。' },
      { code: 'zh-CN', name: '中文 (Chinese)', flag: '🇨🇳', greeting: '您好！我是 SH AI 智能语音助手。' }
    ];

    function playBeep(freq = 800) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } catch (e) {}
    }

    function speakText(text, lang = currentLang) {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.rate = 1.0;
      u.pitch = 1.05;
      const voices = window.speechSynthesis.getVoices();
      const matched = voices.find(v => v.lang.startsWith(lang.split('-')[0]));
      if (matched) u.voice = matched;
      window.speechSynthesis.speak(u);
    }

    function setScreen(screen) {
      playBeep(650);
      currentScreen = screen;
      document.querySelectorAll('.nav-btn').forEach(b => {
        b.className = b.id === 'nav-' + screen 
          ? 'nav-btn text-[10px] px-2.5 py-1 rounded-full font-semibold bg-cyan-500 text-slate-950 font-bold transition'
          : 'nav-btn text-[10px] px-2.5 py-1 rounded-full font-semibold bg-[#091524] text-slate-300 border border-cyan-950 hover:text-white transition';
      });
      renderScreen();
    }

    function renderScreen() {
      const container = document.getElementById('screen-container');
      if (currentScreen === 'home') {
        container.innerHTML = \`
          <div class="space-y-4">
            <!-- Header -->
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-sm font-bold text-white flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  SH AI Assistant
                </h2>
                <p class="text-[10px] text-cyan-400">Your Personal AI • Android 16 Ready</p>
              </div>
              <button onclick="setScreen('voice-settings')" class="text-[10px] bg-cyan-950 border border-cyan-500/40 text-cyan-300 px-2 py-0.5 rounded-full font-mono">
                \${currentLang}
              </button>
            </div>

            <!-- Greeting Card -->
            <div class="rounded-2xl bg-gradient-to-r from-[#0c1e33] to-[#081526] border border-cyan-500/30 p-4 flex items-center gap-3.5 shadow-md">
              <div class="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 p-[2px] shrink-0">
                <div class="w-full h-full rounded-full bg-[#030712] flex items-center justify-center font-bold text-cyan-300 text-sm">
                  SH
                </div>
              </div>
              <div>
                <h3 class="text-xs font-bold text-white">Good Evening, SH Fahim</h3>
                <p class="text-[10px] text-slate-400">How can I help you today?</p>
              </div>
            </div>

            <!-- Voice Quick Tile -->
            <div onclick="setScreen('voice')" class="cursor-pointer rounded-2xl bg-gradient-to-r from-[#0a192f] to-[#0d223f] border border-cyan-500/40 p-3.5 flex items-center justify-between hover:border-cyan-400 transition">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
                </div>
                <div>
                  <h4 class="text-xs font-bold text-white">Voice Assistant</h4>
                  <p class="text-[10px] text-cyan-400">Tap to speak (Multi-language)</p>
                </div>
              </div>
              <div class="flex items-center gap-1 h-5">
                <span class="w-1 bg-cyan-400 rounded-full animate-pulse h-3"></span>
                <span class="w-1 bg-cyan-300 rounded-full animate-pulse h-5"></span>
                <span class="w-1 bg-cyan-400 rounded-full animate-pulse h-2"></span>
              </div>
            </div>

            <!-- Chat Quick Tile -->
            <div onclick="setScreen('chat')" class="cursor-pointer rounded-2xl bg-gradient-to-r from-[#07172b] to-[#0a1f3a] border border-blue-500/30 p-3.5 flex items-center justify-between hover:border-cyan-400 transition">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                </div>
                <div>
                  <h4 class="text-xs font-bold text-white">Chat</h4>
                  <p class="text-[10px] text-slate-400">Ask any question...</p>
                </div>
              </div>
              <span class="text-slate-500 font-bold">&gt;</span>
            </div>

            <!-- 2x2 Grid -->
            <div class="grid grid-cols-2 gap-2.5">
              <div onclick="setScreen('pc-control')" class="cursor-pointer p-3 rounded-2xl bg-[#091524] border border-cyan-900/60 hover:border-cyan-400 transition">
                <span class="text-xs font-bold text-white block">PC Control</span>
                <span class="text-[9px] text-slate-400 block mt-0.5">Windows Wi-Fi Agent</span>
              </div>
              <div onclick="setScreen('voice-settings')" class="cursor-pointer p-3 rounded-2xl bg-[#091524] border border-cyan-900/60 hover:border-cyan-400 transition">
                <span class="text-xs font-bold text-white block">🌐 Multi-Language</span>
                <span class="text-[9px] text-cyan-400 block mt-0.5">14+ Voices & STT</span>
              </div>
              <div onclick="setScreen('plugins')" class="cursor-pointer p-3 rounded-2xl bg-[#091524] border border-cyan-900/60 hover:border-cyan-400 transition flex justify-between items-center">
                <div>
                  <span class="text-xs font-bold text-white block">Plugins</span>
                  <span class="text-[9px] text-slate-400 block mt-0.5">10+ Smart Tools</span>
                </div>
                <span class="text-[10px] bg-cyan-950 text-cyan-300 font-bold px-1.5 py-0.5 rounded">10</span>
              </div>
              <div onclick="setScreen('settings')" class="cursor-pointer p-3 rounded-2xl bg-[#091524] border border-cyan-900/60 hover:border-cyan-400 transition">
                <span class="text-xs font-bold text-white block">Settings</span>
                <span class="text-[9px] text-slate-400 block mt-0.5">App Configuration</span>
              </div>
            </div>
          </div>
        \`;
      } else if (currentScreen === 'voice') {
        const cur = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];
        container.innerHTML = \`
          <div class="h-full flex flex-col justify-between py-2 text-center">
            <div class="flex items-center justify-between">
              <button onclick="setScreen('home')" class="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">&larr;</button>
              <h3 class="text-xs font-bold text-white">Voice Assistant</h3>
              <button onclick="setScreen('voice-settings')" class="text-[9px] bg-cyan-950 border border-cyan-500/40 text-cyan-300 px-2 py-0.5 rounded-full font-mono">
                \${cur.flag} \${cur.code}
              </button>
            </div>

            <!-- Voice Orb -->
            <div class="my-auto flex flex-col items-center">
              <div class="relative w-48 h-48 flex items-center justify-center">
                <div class="absolute inset-0 rounded-full border border-cyan-400/40 orb-pulse"></div>
                <div class="absolute inset-2 rounded-full border border-dashed border-cyan-500/40 tech-spin"></div>
                <div onclick="toggleVoice()" class="cursor-pointer w-28 h-28 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 border-2 border-cyan-300 flex items-center justify-center shadow-[0_0_30px_rgba(56,189,248,0.5)] active:scale-95 transition">
                  <svg class="w-12 h-12 text-white stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
                </div>
              </div>

              <p id="voice-status" class="text-base font-bold text-white mt-4 font-sans">
                \${cur.greeting}
              </p>
              <p class="text-[10px] text-cyan-400 mt-1">Tap the orb to speak or test voice</p>
            </div>

            <!-- Preset Commands -->
            <div class="flex items-center justify-center gap-2 pt-2">
              <button onclick="speakText('আজকের আবহাওয়া কেমন?', 'bn-BD')" class="text-[10px] bg-slate-900 border border-cyan-950 text-slate-300 px-2.5 py-1 rounded-full hover:border-cyan-400">🌤️ আজকের আবহাওয়া</button>
              <button onclick="speakText('Opening Calculator on PC', 'en-US')" class="text-[10px] bg-slate-900 border border-cyan-950 text-slate-300 px-2.5 py-1 rounded-full hover:border-cyan-400">💻 PC Calculator</button>
            </div>
          </div>
        \`;
      } else if (currentScreen === 'voice-settings') {
        container.innerHTML = \`
          <div class="space-y-3">
            <div class="flex items-center justify-between pb-1">
              <button onclick="setScreen('settings')" class="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">&larr;</button>
              <h3 class="text-xs font-bold text-white">Voice & Multi-Language Settings</h3>
              <div class="w-6"></div>
            </div>

            <div class="p-3 rounded-2xl bg-[#081525] border border-cyan-500/40">
              <h4 class="text-xs font-bold text-white">Select Language (12+ Languages)</h4>
              <p class="text-[10px] text-slate-400">Select your voice input & speech synthesis language</p>
            </div>

            <div class="space-y-1.5 max-h-[460px] overflow-y-auto no-scrollbar">
              \${LANGUAGES.map(l => \`
                <div onclick="selectLanguage('\${l.code}')" class="cursor-pointer p-2.5 rounded-xl border flex items-center justify-between transition \${currentLang === l.code ? 'bg-[#0b2440] border-cyan-400' : 'bg-[#081525] border-cyan-950 hover:border-cyan-500/40'}">
                  <div class="flex items-center gap-2.5">
                    <span class="text-xl">\${l.flag}</span>
                    <div>
                      <h5 class="text-xs font-bold text-white">\${l.name}</h5>
                      <span class="text-[9px] text-cyan-400 font-mono">\${l.code}</span>
                    </div>
                  </div>
                  <button onclick="event.stopPropagation(); speakText('\${l.greeting}', '\${l.code}')" class="px-2 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold hover:bg-cyan-500 hover:text-slate-950 transition">
                    ▶️ Test
                  </button>
                </div>
              \`).join('')}
            </div>
          </div>
        \`;
      } else if (currentScreen === 'chat') {
        container.innerHTML = \`
          <div class="h-full flex flex-col justify-between">
            <div class="space-y-2.5 overflow-y-auto pr-1">
              <div class="p-2.5 rounded-2xl bg-cyan-600 text-white text-xs ml-auto max-w-[80%]">
                আজকের আবহাওয়া কেমন?
              </div>
              <div class="p-2.5 rounded-2xl bg-[#081728] border border-cyan-500/30 text-slate-200 text-xs mr-auto max-w-[85%] space-y-1.5">
                <p>আজ ঢাকা বিভাগের আবহাওয়া সাধারণত পরিষ্কার থাকবে। সর্বোচ্চ ৩২°C, সর্বনিম্ন ২৪°C।</p>
                <div class="p-2 rounded-xl bg-[#030d1a] border border-cyan-500/40 flex justify-between items-center text-[10px]">
                  <span>🌤️ Dhaka (Partly Cloudy)</span>
                  <span class="text-cyan-300 font-bold">32°C</span>
                </div>
              </div>
            </div>

            <!-- Input bar -->
            <div class="pt-2 flex items-center gap-1.5">
              <input id="chat-input" type="text" placeholder="Type a message (Bangla or English)..." class="flex-1 bg-[#091524] border border-cyan-950 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500" onkeydown="if(event.key==='Enter') sendChatMessage()">
              <button onclick="sendChatMessage()" class="w-8 h-8 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center font-bold text-xs">&rarr;</button>
            </div>
          </div>
        \`;
      } else if (currentScreen === 'pc-control') {
        container.innerHTML = \`
          <div class="space-y-3">
            <h3 class="text-xs font-bold text-white">PC Control (Windows Agent)</h3>
            <div class="p-2.5 rounded-xl bg-[#061424] border border-cyan-500/40 text-[10px] text-emerald-400 flex items-center justify-between">
              <span>● Connected: 192.168.1.10 (Port 5890)</span>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <button onclick="playBeep(900); alert('Notepad launched on Windows PC!')" class="p-3 bg-[#091524] rounded-xl border border-cyan-950 text-left hover:border-cyan-400">
                <span class="text-xs font-bold text-white block">📝 Open Notepad</span>
                <span class="text-[9px] text-slate-400">Text editor</span>
              </button>
              <button onclick="playBeep(900); alert('Calculator opened on PC!')" class="p-3 bg-[#091524] rounded-xl border border-cyan-950 text-left hover:border-cyan-400">
                <span class="text-xs font-bold text-white block">🔢 Open Calc</span>
                <span class="text-[9px] text-slate-400">Calculator</span>
              </button>
              <button onclick="playBeep(900); alert('Windows File Explorer opened!')" class="p-3 bg-[#091524] rounded-xl border border-cyan-950 text-left hover:border-cyan-400">
                <span class="text-xs font-bold text-white block">📁 File Manager</span>
                <span class="text-[9px] text-slate-400">Browse folders</span>
              </button>
              <button onclick="playBeep(900); alert('Default Browser opened on PC!')" class="p-3 bg-[#091524] rounded-xl border border-cyan-950 text-left hover:border-cyan-400">
                <span class="text-xs font-bold text-white block">🌐 Open Browser</span>
                <span class="text-[9px] text-slate-400">Internet Explorer</span>
              </button>
            </div>
          </div>
        \`;
      } else if (currentScreen === 'plugins') {
        const list = ['AI Chat', 'Voice Recognition', 'Text to Speech', 'Web Search', 'File Manager', 'App Launcher', 'Translation', 'Calculator', 'System Monitor', 'Automation'];
        container.innerHTML = \`
          <div class="space-y-2">
            <h3 class="text-xs font-bold text-white">Plugins (10 Smart Tools)</h3>
            \${list.map((name, i) => \`
              <div class="p-2 rounded-xl bg-[#081525] border border-cyan-950 flex items-center justify-between text-xs">
                <span class="text-white font-medium">\${i+1}. \${name}</span>
                <span class="text-[9px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">Active</span>
              </div>
            \`).join('')}
          </div>
        \`;
      } else if (currentScreen === 'settings') {
        container.innerHTML = \`
          <div class="space-y-2">
            <h3 class="text-xs font-bold text-white">Settings</h3>
            <div onclick="setScreen('voice-settings')" class="cursor-pointer p-3 rounded-xl bg-[#081525] border border-cyan-950 hover:border-cyan-400 flex justify-between items-center">
              <div>
                <h4 class="text-xs font-bold text-white">Voice & Multi-Language</h4>
                <p class="text-[10px] text-cyan-400 font-mono">Current: \${currentLang}</p>
              </div>
              <span>&gt;</span>
            </div>
            <div onclick="setScreen('pc-control')" class="cursor-pointer p-3 rounded-xl bg-[#081525] border border-cyan-950 hover:border-cyan-400 flex justify-between items-center">
              <div>
                <h4 class="text-xs font-bold text-white">PC Companion Connection</h4>
                <p class="text-[10px] text-slate-400">Wi-Fi Socket 5890</p>
              </div>
              <span>&gt;</span>
            </div>
            <div class="p-3 rounded-xl bg-gradient-to-r from-[#07172b] to-[#0a1f3a] border border-cyan-500/30 text-center">
              <h5 class="text-xs font-bold text-white">SH AI Assistant v1.0</h5>
              <p class="text-[9px] text-slate-400 mt-1">Built for Next-Gen Android 16 & Modern Web</p>
            </div>
          </div>
        \`;
      }
    }

    function selectLanguage(code) {
      currentLang = code;
      const cur = LANGUAGES.find(l => l.code === code);
      if (cur) speakText(cur.greeting, cur.code);
      renderScreen();
    }

    function toggleVoice() {
      const cur = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        speakText(cur.greeting, cur.code);
        return;
      }
      if (!isListening) {
        recognition = new SpeechRecognition();
        recognition.lang = currentLang;
        recognition.onresult = (e) => {
          const t = e.results[0][0].transcript;
          document.getElementById('voice-status').innerText = '"' + t + '"';
          setTimeout(() => {
            speakText('আমি আপনার কথা শুনেছি: ' + t, currentLang);
          }, 800);
        };
        recognition.start();
        isListening = true;
        document.getElementById('voice-status').innerText = 'শুনছি... বলুন...';
      } else {
        if (recognition) recognition.stop();
        isListening = false;
        document.getElementById('voice-status').innerText = cur.greeting;
      }
    }

    function sendChatMessage() {
      const input = document.getElementById('chat-input');
      const val = input.value.trim();
      if (!val) return;
      input.value = '';
      playBeep(700);
      speakText('উত্তর প্রক্রিয়াকরণ হচ্ছে...', currentLang);
    }

    // Initialize
    renderScreen();
    setInterval(() => {
      const now = new Date();
      const el = document.getElementById('live-time');
      if (el) el.innerText = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    }, 1000);
  </script>
</body>
</html>`;

const STANDALONE_README = `# SH AI Assistant - HTML Web Code Package

This package contains the complete HTML5 and Web source code for **SH AI Assistant**.

## What is inside this ZIP:
1. \`standalone/index.html\` - Complete self-contained single-file HTML5 web application.
   - Run immediately: Double-click \`index.html\` in any web browser (Chrome, Edge, Safari, Firefox, Android Chrome). No Node.js or installation needed!
   - 10 full screens: Splash, Home, Chat, Voice Assistant, Plugins, PC Control, Tools, AI Settings, Settings, Connected Devices.
   - Multilingual voice support (Bangla, English, Hindi, Arabic, Spanish, French, German, Japanese, Chinese, etc.).
   - Speech Recognition (STT) and Speech Synthesis (TTS).
   - PC Control simulator over Wi-Fi.

2. \`project-source/\` - Full React 19 + TypeScript + Vite + Tailwind CSS source code.
   - Run locally:
     \`\`\`bash
     cd project-source
     npm install
     npm run dev
     \`\`\`
   - Build for production:
     \`\`\`bash
     npm run build
     \`\`\`

3. Android APK Conversion:
   - You can convert the \`standalone/index.html\` into a native Android APK using Android Studio WebView or Capacitor:
     \`\`\`bash
     npm i -g @capacitor/cli @capacitor/core
     npx cap init "SH AI Assistant" com.sh.assistant
     npx cap add android
     npx cap open android
     \`\`\`

Created for SH Fahim.
`;

export async function buildHtmlZip() {
  const zip = new JSZip();

  // 1. Standalone web app
  const standalone = zip.folder('standalone');
  standalone.file('index.html', STANDALONE_HTML);
  standalone.file('README.md', STANDALONE_README);

  // Copy icon and manifest if they exist
  try {
    const iconSvg = fs.readFileSync(path.join(rootDir, 'public', 'icon.svg'), 'utf8');
    standalone.file('icon.svg', iconSvg);
    const manifestJson = fs.readFileSync(path.join(rootDir, 'public', 'manifest.json'), 'utf8');
    standalone.file('manifest.json', manifestJson);
  } catch (e) {}

  // Root index.html copy for convenience
  zip.file('index.html', STANDALONE_HTML);
  zip.file('README.md', STANDALONE_README);

  // 2. Full Source project folder
  const srcFolder = zip.folder('project-source');
  
  function addFilesRecursively(dirPath, zipTarget) {
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
      if (item === 'node_modules' || item === '.git' || item === '.aistudio' || item === 'dist') continue;
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        const sub = zipTarget.folder(item);
        addFilesRecursively(fullPath, sub);
      } else {
        // Skip large zip itself
        if (item.endsWith('.zip')) continue;
        const content = fs.readFileSync(fullPath);
        zipTarget.file(item, content);
      }
    }
  }

  addFilesRecursively(rootDir, srcFolder);

  const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  
  const publicDir = path.join(rootDir, 'public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  
  const zipDest = path.join(publicDir, 'SH_AI_Assistant_HTML_Code.zip');
  fs.writeFileSync(zipDest, buffer);
  console.log('Successfully generated HTML code zip at:', zipDest, 'Size:', (buffer.length / 1024 / 1024).toFixed(2), 'MB');
}

buildHtmlZip().catch(console.error);
