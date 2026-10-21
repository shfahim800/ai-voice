// Theme Service for SH AI Assistant
// Supports iOS Blur (Frosted Glass), Cyberpunk Neon, Cyberpunk Dark OLED, OLED Stealth, and Matrix Green

import { AppTheme } from '../types/assistant';

export type ThemeCategory = 'cyberpunk' | 'glass' | 'minimal';

export interface ThemeConfig {
  id: AppTheme;
  name: string;
  category: ThemeCategory;
  tagline: string;
  description: string;
  badge: string;
  previewBg: string;
  previewBorder: string;
  accentColor: string;
  secondaryAccent?: string;
  glowColor: string;
  phoneFrameClass: string;
  screenBgClass: string;
  cardClass: string;
  headerClass: string;
  bottomNavClass: string;
  accentPillClass: string;
  hasScanlines?: boolean;
  hasAuroraBlur?: boolean;
  hasGlassHighlights?: boolean;
}

export const THEMES: Record<AppTheme, ThemeConfig> = {
  'ios-26-liquid': {
    id: 'ios-26-liquid',
    name: 'Apple iOS 26 Liquid Blur',
    category: 'glass',
    tagline: 'Next-Gen Cupertino Liquid Glassmorphism',
    description: 'Bespoke iOS 26 frosted glass, precision Apple squircle models, ambient prismatic refractions, and ultra-smooth fluid backdrops.',
    badge: 'iOS 26 Liquid',
    previewBg: 'from-[#0b1329] via-[#1d274f] to-[#0a1628]',
    previewBorder: 'border-white/50',
    accentColor: '#38bdf8',
    secondaryAccent: '#818cf8',
    glowColor: 'rgba(56, 189, 248, 0.55)',
    phoneFrameClass: 'border-white/30 ring-4 ring-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.85),0_0_50px_rgba(56,189,248,0.3)]',
    screenBgClass: 'bg-gradient-to-br from-[#070e22] via-[#0d1838] to-[#061129]',
    cardClass: 'backdrop-blur-3xl bg-white/[0.12] border border-white/25 shadow-[0_12px_40px_0_rgba(0,0,0,0.45),inset_0_1px_1px_0_rgba(255,255,255,0.35)]',
    headerClass: 'backdrop-blur-2xl bg-slate-900/40 border-b border-white/15',
    bottomNavClass: 'backdrop-blur-3xl bg-slate-950/60 border-t border-white/20',
    accentPillClass: 'bg-white/20 text-white border border-white/40 shadow-[0_2px_12px_rgba(255,255,255,0.15)]',
    hasAuroraBlur: true,
    hasGlassHighlights: true,
  },
  'ios-blur': {
    id: 'ios-blur',
    name: 'iOS 18 Liquid Blur',
    category: 'glass',
    tagline: 'Apple iOS 18 Frosted Glassmorphism',
    description: 'Ultra-translucent multi-layer blur, soft specular light reflections, ambient twilight aurora orbs, and Cupertino typography.',
    badge: 'iOS 18 Blur',
    previewBg: 'from-[#1e1b4b] via-[#0f172a] to-[#022c22]',
    previewBorder: 'border-white/40',
    accentColor: '#38bdf8',
    secondaryAccent: '#a855f7',
    glowColor: 'rgba(56, 189, 248, 0.45)',
    phoneFrameClass: 'border-slate-400/50 ring-2 ring-white/25 shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_40px_rgba(147,197,253,0.25)]',
    screenBgClass: 'bg-gradient-to-br from-[#0c142b] via-[#121f42] to-[#09152b]',
    cardClass: 'backdrop-blur-2xl bg-white/[0.08] border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]',
    headerClass: 'backdrop-blur-xl bg-slate-900/40 border-b border-white/10',
    bottomNavClass: 'backdrop-blur-2xl bg-slate-900/50 border-t border-white/15',
    accentPillClass: 'bg-white/15 text-sky-200 border border-white/30 shadow-xs',
    hasAuroraBlur: true,
    hasGlassHighlights: true,
  },
  'ios-glass-clear': {
    id: 'ios-glass-clear',
    name: 'iOS Crystal Glass',
    category: 'glass',
    tagline: 'Ultra-Clear Cupertino Liquid Glass',
    description: 'High-clarity frosted crystal glass with sharp light refractions, pristine border luminescence, and floating glass depth.',
    badge: 'Crystal Glass',
    previewBg: 'from-[#0f2027] via-[#203a43] to-[#2c5364]',
    previewBorder: 'border-cyan-200/50',
    accentColor: '#00f2fe',
    secondaryAccent: '#4facfe',
    glowColor: 'rgba(0, 242, 254, 0.4)',
    phoneFrameClass: 'border-cyan-300/40 ring-2 ring-cyan-200/20 shadow-[0_25px_75px_rgba(0,0,0,0.85),0_0_45px_rgba(0,242,254,0.3)]',
    screenBgClass: 'bg-gradient-to-b from-[#0a192f] via-[#0d223f] to-[#050f1d]',
    cardClass: 'backdrop-blur-3xl bg-cyan-950/20 border border-cyan-200/30 shadow-[0_8px_30px_rgba(0,242,254,0.12)]',
    headerClass: 'backdrop-blur-2xl bg-slate-900/45 border-b border-cyan-200/20',
    bottomNavClass: 'backdrop-blur-3xl bg-slate-900/55 border-t border-cyan-200/25',
    accentPillClass: 'bg-cyan-500/15 text-cyan-200 border border-cyan-300/40 shadow-[0_0_12px_rgba(0,242,254,0.2)]',
    hasAuroraBlur: true,
    hasGlassHighlights: true,
  },
  'glassmorphism-dark': {
    id: 'glassmorphism-dark',
    name: 'Obsidian Smoked Glass',
    category: 'glass',
    tagline: 'Deep Smoked Glass & Iridescent Rim',
    description: 'Smoked black translucent glass with prismatic specular highlights, micro-etched borders, and luxury dark room refraction.',
    badge: 'Smoked Glass',
    previewBg: 'from-[#050505] via-[#14151b] to-[#0d0e12]',
    previewBorder: 'border-slate-500/40',
    accentColor: '#94a3b8',
    secondaryAccent: '#cbd5e1',
    glowColor: 'rgba(148, 163, 184, 0.3)',
    phoneFrameClass: 'border-slate-600/70 ring-1 ring-slate-400/30 shadow-[0_30px_80px_rgba(0,0,0,0.95),0_0_35px_rgba(148,163,184,0.2)]',
    screenBgClass: 'bg-[#090b10]',
    cardClass: 'backdrop-blur-2xl bg-slate-900/60 border border-slate-700/60 shadow-[0_10px_35px_rgba(0,0,0,0.6)]',
    headerClass: 'backdrop-blur-xl bg-[#090b10]/90 border-b border-slate-800/80',
    bottomNavClass: 'backdrop-blur-2xl bg-[#090b10]/90 border-t border-slate-800/80',
    accentPillClass: 'bg-slate-800/80 text-slate-200 border border-slate-600/60 shadow-inner',
    hasGlassHighlights: true,
  },
  'glassmorphism-aurora': {
    id: 'glassmorphism-aurora',
    name: 'Aurora Borealis Glass',
    category: 'glass',
    tagline: 'Polar Northern Lights Glass Illusion',
    description: 'Luminous shifting ribbons of emerald and violet aurora diffused through frosted arctic glass sheets.',
    badge: 'Aurora Glass',
    previewBg: 'from-[#061e24] via-[#100e2e] to-[#041a18]',
    previewBorder: 'border-teal-400/50',
    accentColor: '#2dd4bf',
    secondaryAccent: '#818cf8',
    glowColor: 'rgba(45, 212, 191, 0.5)',
    phoneFrameClass: 'border-teal-500/50 ring-2 ring-indigo-500/30 shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_50px_rgba(45,212,191,0.3)]',
    screenBgClass: 'bg-gradient-to-br from-[#041217] via-[#090c24] to-[#031512]',
    cardClass: 'backdrop-blur-2xl bg-teal-950/20 border border-teal-400/30 shadow-[0_8px_32px_rgba(45,212,191,0.15)]',
    headerClass: 'backdrop-blur-xl bg-slate-950/60 border-b border-teal-500/30',
    bottomNavClass: 'backdrop-blur-2xl bg-slate-950/70 border-t border-teal-500/30',
    accentPillClass: 'bg-teal-950/70 text-teal-300 border border-teal-400/50 shadow-[0_0_12px_rgba(45,212,191,0.3)]',
    hasAuroraBlur: true,
    hasGlassHighlights: true,
  },
  'cyberpunk-neon': {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon 2077',
    category: 'cyberpunk',
    tagline: 'Night City High-Voltage Cyan & Magenta',
    description: 'Electric cyan (#00f0ff) and hot pink magenta (#ff0055) neon borders, glowing holographic HUD grids, and cyber scanlines.',
    badge: 'Night City 2077',
    previewBg: 'from-[#050814] via-[#1a052b] to-[#031526]',
    previewBorder: 'border-[#00f0ff]',
    accentColor: '#00f0ff',
    secondaryAccent: '#ff0055',
    glowColor: 'rgba(0, 240, 255, 0.6)',
    phoneFrameClass: 'border-[#00f0ff]/80 ring-2 ring-[#ff0055]/60 shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(0,240,255,0.4)]',
    screenBgClass: 'bg-[#030612]',
    cardClass: 'bg-[#060b1c]/90 border border-[#00f0ff]/70 shadow-[0_0_20px_rgba(0,240,255,0.25),inset_0_0_12px_rgba(255,0,85,0.1)]',
    headerClass: 'bg-[#040816]/95 border-b border-[#00f0ff]/40 shadow-[0_2px_20px_rgba(0,240,255,0.2)]',
    bottomNavClass: 'bg-[#040816]/95 border-t border-[#00f0ff]/40 shadow-[0_-4px_20px_rgba(0,240,255,0.25)]',
    accentPillClass: 'bg-cyan-950 text-[#00f0ff] border border-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.5)]',
    hasScanlines: true,
  },
  'cyberpunk-red': {
    id: 'cyberpunk-red',
    name: 'Cyberpunk Arasaka Red',
    category: 'cyberpunk',
    tagline: 'Corporate Syndicate Blood Crimson & Amber',
    description: 'Menacing Arasaka Crimson (#ff1744) tactical borders, carbon fiber textures, amber warning telemetry, and high-threat HUD grid.',
    badge: 'Arasaka Red',
    previewBg: 'from-[#190306] via-[#2a0409] to-[#0c0103]',
    previewBorder: 'border-red-500',
    accentColor: '#ff1744',
    secondaryAccent: '#f59e0b',
    glowColor: 'rgba(255, 23, 68, 0.6)',
    phoneFrameClass: 'border-red-600/80 ring-2 ring-amber-500/60 shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(255,23,68,0.4)]',
    screenBgClass: 'bg-[#0d0204]',
    cardClass: 'bg-[#150407]/90 border border-red-600/60 shadow-[0_0_20px_rgba(255,23,68,0.25),inset_0_0_12px_rgba(245,158,11,0.1)]',
    headerClass: 'bg-[#0d0204]/95 border-b border-red-600/50 shadow-[0_2px_20px_rgba(255,23,68,0.2)]',
    bottomNavClass: 'bg-[#0d0204]/95 border-t border-red-600/50 shadow-[0_-4px_20px_rgba(255,23,68,0.25)]',
    accentPillClass: 'bg-red-950 text-red-300 border border-red-500 shadow-[0_0_10px_rgba(255,23,68,0.5)]',
    hasScanlines: true,
  },
  'cyberpunk-synthwave': {
    id: 'cyberpunk-synthwave',
    name: 'Cyberpunk Synthwave 84',
    category: 'cyberpunk',
    tagline: 'Neo-Tokyo Retro Violet & Sunset Pink',
    description: 'Outrun 80s aesthetics with glowing neon violet, sunset magenta, horizon grids, and analog synthesizer retro-futurism.',
    badge: 'Synthwave 84',
    previewBg: 'from-[#14052b] via-[#280b3d] to-[#090214]',
    previewBorder: 'border-fuchsia-500',
    accentColor: '#d946ef',
    secondaryAccent: '#fb923c',
    glowColor: 'rgba(217, 70, 239, 0.6)',
    phoneFrameClass: 'border-fuchsia-500/80 ring-2 ring-purple-600/60 shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(217,70,239,0.4)]',
    screenBgClass: 'bg-[#0b0314]',
    cardClass: 'bg-[#150626]/90 border border-fuchsia-500/60 shadow-[0_0_20px_rgba(217,70,239,0.25),inset_0_0_12px_rgba(251,146,60,0.1)]',
    headerClass: 'bg-[#0e031a]/95 border-b border-fuchsia-500/40 shadow-[0_2px_20px_rgba(217,70,239,0.2)]',
    bottomNavClass: 'bg-[#0e031a]/95 border-t border-fuchsia-500/40 shadow-[0_-4px_20px_rgba(217,70,239,0.25)]',
    accentPillClass: 'bg-purple-950 text-fuchsia-300 border border-fuchsia-400 shadow-[0_0_10px_rgba(217,70,239,0.5)]',
    hasScanlines: true,
  },
  'cyberpunk-dark': {
    id: 'cyberpunk-dark',
    name: 'Cyberpunk Dark OLED',
    category: 'cyberpunk',
    tagline: 'SH AI Core Deep Tech & Navy',
    description: 'The signature obsidian deep blue with electric cyan and sky blue futuristic holographic accents.',
    badge: 'Core Default',
    previewBg: 'from-[#030712] via-[#09172e] to-[#040d1a]',
    previewBorder: 'border-cyan-500/40',
    accentColor: '#38bdf8',
    secondaryAccent: '#06b6d4',
    glowColor: 'rgba(56, 189, 248, 0.3)',
    phoneFrameClass: 'border-slate-700/80 ring-1 ring-cyan-500/30 shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_50px_rgba(56,189,248,0.15)]',
    screenBgClass: 'bg-[#030712]',
    cardClass: 'bg-[#081525] border border-cyan-950 shadow-sm',
    headerClass: 'bg-[#06101d]/90 backdrop-blur-md border-b border-cyan-950/80',
    bottomNavClass: 'bg-[#050b14]/90 backdrop-blur-md border-t border-cyan-950/60',
    accentPillClass: 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40',
  },
  'matrix-green': {
    id: 'matrix-green',
    name: 'Matrix Terminal',
    category: 'cyberpunk',
    tagline: 'Phosphor Green Cyber Code',
    description: 'Emerald phosphor terminal glow, cyber rain vibe, and retro hacker command aesthetics.',
    badge: 'Matrix Cyber',
    previewBg: 'from-[#020e06] via-[#051c0d] to-[#010904]',
    previewBorder: 'border-emerald-500/50',
    accentColor: '#10b981',
    secondaryAccent: '#34d399',
    glowColor: 'rgba(16, 185, 129, 0.5)',
    phoneFrameClass: 'border-emerald-600/70 ring-1 ring-emerald-500/40 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(16,185,129,0.3)]',
    screenBgClass: 'bg-[#020b05]',
    cardClass: 'bg-[#03170a] border border-emerald-600/40 shadow-[0_0_15px_rgba(16,185,129,0.2)] text-emerald-200',
    headerClass: 'bg-[#020d06]/95 border-b border-emerald-600/40',
    bottomNavClass: 'bg-[#020d06]/95 border-t border-emerald-600/40',
    accentPillClass: 'bg-emerald-950 text-emerald-300 border border-emerald-500/50',
  },
  'oled-black': {
    id: 'oled-black',
    name: 'OLED Stealth Black',
    category: 'minimal',
    tagline: '0-Nit Pure Black Battery Saver',
    description: 'True pitch black pixels designed for maximum power efficiency on AMOLED displays with crisp monochrome minimalism.',
    badge: 'True Black',
    previewBg: 'from-black via-[#0a0a0a] to-[#121212]',
    previewBorder: 'border-neutral-700',
    accentColor: '#10b981',
    secondaryAccent: '#e2e8f0',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    phoneFrameClass: 'border-neutral-800 ring-1 ring-neutral-700 shadow-[0_25px_70px_rgba(0,0,0,0.95)]',
    screenBgClass: 'bg-black',
    cardClass: 'bg-[#0a0a0a] border border-neutral-800 shadow-none',
    headerClass: 'bg-black/95 border-b border-neutral-900',
    bottomNavClass: 'bg-black/95 border-t border-neutral-900',
    accentPillClass: 'bg-neutral-900 text-neutral-200 border border-neutral-700',
  }
};


class ThemeService {
  private currentTheme: AppTheme = 'ios-26-liquid';
  private listeners: Set<(theme: AppTheme) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sh_assistant_theme') as AppTheme;
      if (saved && THEMES[saved]) {
        this.currentTheme = saved;
      }
    }
  }

  public getTheme(): AppTheme {
    return this.currentTheme;
  }

  public getConfig(theme?: AppTheme): ThemeConfig {
    return THEMES[theme || this.currentTheme];
  }

  public setTheme(theme: AppTheme) {
    if (!THEMES[theme]) return;
    this.currentTheme = theme;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sh_assistant_theme', theme);
    }
    this.notify();
  }

  public subscribe(listener: (theme: AppTheme) => void): () => void {
    this.listeners.add(listener);
    listener(this.currentTheme);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.currentTheme);
      } catch (e) {
        console.error('Error notifying theme listener:', e);
      }
    });
  }
}

export const themeService = new ThemeService();
