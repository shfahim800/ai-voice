import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Palette, 
  Check, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Smartphone, 
  CheckCircle2,
  Zap,
  Activity,
  Flame,
  FlameKindling,
  Disc,
  Radio,
  Sliders,
  Sun
} from 'lucide-react';
import { AppTheme } from '../../types/assistant';
import { themeService, THEMES, ThemeConfig, ThemeCategory } from '../../services/themeService';
import { audioService } from '../../services/audioService';
import confetti from 'canvas-confetti';

interface AppearanceScreenProps {
  onBack: () => void;
  currentTheme: AppTheme;
  onSelectTheme: (theme: AppTheme) => void;
}

export const AppearanceScreen: React.FC<AppearanceScreenProps> = ({
  onBack,
  currentTheme,
  onSelectTheme,
}) => {
  const [activeTheme, setActiveTheme] = useState<AppTheme>(currentTheme);
  const [selectedCategory, setSelectedCategory] = useState<'all' | ThemeCategory>('all');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const themeList: ThemeConfig[] = Object.values(THEMES);

  const filteredThemes = selectedCategory === 'all' 
    ? themeList 
    : themeList.filter(t => t.category === selectedCategory);

  const handleApplyTheme = (themeId: AppTheme) => {
    setActiveTheme(themeId);
    themeService.setTheme(themeId);
    onSelectTheme(themeId);
    audioService.playCyberChime('activate');

    const cfg = THEMES[themeId];
    setSuccessToast(`Theme activated: ${cfg.name}`);
    setTimeout(() => setSuccessToast(null), 3000);

    try {
      const getConfettiColors = () => {
        switch (themeId) {
          case 'cyberpunk-neon': return ['#00f0ff', '#ff0055', '#fcee0a'];
          case 'cyberpunk-red': return ['#ff1744', '#f59e0b', '#ffffff'];
          case 'cyberpunk-synthwave': return ['#d946ef', '#fb923c', '#38bdf8'];
          case 'matrix-green': return ['#10b981', '#34d399', '#059669'];
          case 'ios-26-liquid':
          case 'ios-blur':
          case 'ios-glass-clear': return ['#38bdf8', '#818cf8', '#ffffff'];
          case 'glassmorphism-aurora': return ['#2dd4bf', '#818cf8', '#a78bfa'];
          default: return ['#38bdf8', '#06b6d4', '#10b981'];
        }
      };

      confetti({
        particleCount: 28,
        spread: 50,
        origin: { y: 0.7 },
        colors: getConfettiColors()
      });
    } catch {}
  };

  const activeConfig = THEMES[activeTheme] || THEMES['cyberpunk-dark'];

  const getThemeIcon = (id: AppTheme) => {
    switch (id) {
      case 'ios-blur':
      case 'ios-glass-clear':
        return Layers;
      case 'glassmorphism-aurora':
      case 'glassmorphism-dark':
        return Sparkles;
      case 'cyberpunk-neon':
        return Zap;
      case 'cyberpunk-red':
        return Flame;
      case 'cyberpunk-synthwave':
        return Disc;
      case 'matrix-green':
        return Activity;
      default:
        return Palette;
    }
  };

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
              <Palette className="w-4 h-4 text-cyan-400" />
              Appearance & Themes
            </h2>
            <p className="text-[10px] text-cyan-400 font-medium">Cyberpunk • iOS Liquid Glass • Glassmorphism</p>
          </div>
        </div>

        <span 
          className="text-[10px] font-mono px-2 py-0.5 rounded-full border shadow-xs"
          style={{ 
            borderColor: activeConfig.accentColor,
            color: activeConfig.accentColor,
            backgroundColor: `${activeConfig.accentColor}1a`
          }}
        >
          {activeConfig.badge}
        </span>
      </div>

      {/* Toast feedback */}
      {successToast && (
        <div className="p-2.5 rounded-xl bg-cyan-950/90 border border-cyan-400/80 text-cyan-200 text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(56,189,248,0.3)] animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Hero Showcase of Active Theme */}
      <div className={`relative overflow-hidden rounded-2xl p-4 border transition-all duration-300 ${
        activeTheme === 'ios-blur' || activeTheme === 'ios-glass-clear'
          ? 'bg-gradient-to-br from-[#121b36] via-[#1a284e] to-[#0d162d] border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
          : activeTheme === 'cyberpunk-neon'
          ? 'bg-[#060b1c] border-2 border-[#00f0ff] shadow-[0_0_25px_rgba(0,240,255,0.35)]'
          : activeTheme === 'cyberpunk-red'
          ? 'bg-[#150407] border-2 border-[#ff1744] shadow-[0_0_25px_rgba(255,23,68,0.35)]'
          : activeTheme === 'cyberpunk-synthwave'
          ? 'bg-[#150626] border-2 border-[#d946ef] shadow-[0_0_25px_rgba(217,70,239,0.35)]'
          : activeTheme === 'glassmorphism-aurora'
          ? 'bg-gradient-to-br from-[#061e24] via-[#100e2e] to-[#041a18] border-teal-400/50 shadow-[0_0_25px_rgba(45,212,191,0.25)]'
          : 'bg-[#081525] border border-cyan-500/30'
      }`}>
        {/* Dynamic ambient background orbs */}
        <div 
          className="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-40 animate-pulse"
          style={{ backgroundColor: activeConfig.accentColor }}
        ></div>
        <div 
          className="absolute -left-6 -bottom-6 w-28 h-28 rounded-full blur-2xl pointer-events-none opacity-30"
          style={{ backgroundColor: activeConfig.secondaryAccent || activeConfig.accentColor }}
        ></div>

        <div className="relative z-10 flex items-start justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-mono text-cyan-400 font-bold block flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeConfig.accentColor }}></span>
              Active Visual Skin
            </span>
            <h3 className="text-base font-extrabold text-white mt-0.5">
              {activeConfig.name}
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {activeConfig.description}
            </p>
          </div>
          
          <div 
            className="w-11 h-11 rounded-2xl bg-black/50 border flex items-center justify-center shrink-0 shadow-lg"
            style={{ borderColor: `${activeConfig.accentColor}60` }}
          >
            {React.createElement(getThemeIcon(activeTheme), {
              className: "w-5 h-5",
              style: { color: activeConfig.accentColor }
            })}
          </div>
        </div>

        {/* Live Mini Preview Pills */}
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <span 
              className="w-2.5 h-2.5 rounded-full shadow-xs" 
              style={{ backgroundColor: activeConfig.accentColor }}
            ></span>
            <span className="text-slate-300 font-medium truncate max-w-[190px]">
              {activeConfig.tagline}
            </span>
          </div>
          <span className="text-emerald-400 flex items-center gap-1 font-semibold text-[10px] shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[3]" /> সক্রিয় (Active)
          </span>
        </div>
      </div>

      {/* Theme Category Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => { audioService.playCyberChime('beep'); setSelectedCategory('all'); }}
          className={`px-3 py-1.5 rounded-xl font-medium transition shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-cyan-500 text-black font-bold shadow-[0_0_12px_rgba(56,189,248,0.5)]'
              : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          সবগুলো ({themeList.length})
        </button>
        <button
          onClick={() => { audioService.playCyberChime('beep'); setSelectedCategory('cyberpunk'); }}
          className={`px-3 py-1.5 rounded-xl font-medium transition shrink-0 flex items-center gap-1 ${
            selectedCategory === 'cyberpunk'
              ? 'bg-pink-600 text-white font-bold shadow-[0_0_12px_rgba(219,39,119,0.5)]'
              : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-pink-400" />
          সাইবারপাঙ্ক (Cyberpunk)
        </button>
        <button
          onClick={() => { audioService.playCyberChime('beep'); setSelectedCategory('glass'); }}
          className={`px-3 py-1.5 rounded-xl font-medium transition shrink-0 flex items-center gap-1 ${
            selectedCategory === 'glass'
              ? 'bg-sky-500 text-black font-bold shadow-[0_0_12px_rgba(56,189,248,0.5)]'
              : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-sky-400" />
          আইওএস ও গ্লাস (iOS Glass)
        </button>
        <button
          onClick={() => { audioService.playCyberChime('beep'); setSelectedCategory('minimal'); }}
          className={`px-3 py-1.5 rounded-xl font-medium transition shrink-0 ${
            selectedCategory === 'minimal'
              ? 'bg-neutral-200 text-black font-bold shadow-sm'
              : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          OLED Black
        </button>
      </div>

      {/* Theme Cards List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 tracking-wide uppercase">
            Available Themes ({filteredThemes.length})
          </span>
          <span className="text-[10px] text-slate-400">ট্যাপ করে প্রয়োগ করুন (Tap to apply)</span>
        </div>

        {filteredThemes.map((theme) => {
          const isSelected = activeTheme === theme.id;
          const ThemeIcon = getThemeIcon(theme.id);

          return (
            <div
              key={theme.id}
              onClick={() => handleApplyTheme(theme.id)}
              className={`relative p-3.5 rounded-2xl cursor-pointer transition-all duration-200 active:scale-[0.99] border ${
                isSelected
                  ? 'ring-2 shadow-lg'
                  : 'bg-[#081525]/80 hover:bg-[#0c1e33] border-slate-800/80 hover:border-slate-700'
              }`}
              style={{
                borderColor: isSelected ? theme.accentColor : undefined,
                boxShadow: isSelected ? `0 0 24px ${theme.glowColor}` : undefined,
                background: isSelected 
                  ? theme.category === 'cyberpunk'
                    ? theme.id === 'cyberpunk-red' 
                      ? '#140306' 
                      : theme.id === 'cyberpunk-synthwave' 
                      ? '#130420' 
                      : theme.id === 'matrix-green'
                      ? '#031409'
                      : '#060b1c'
                    : theme.category === 'glass'
                    ? 'rgba(15, 23, 42, 0.75)'
                    : '#090a0f'
                  : undefined
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 shadow-inner"
                    style={{
                      borderColor: `${theme.accentColor}50`,
                      backgroundColor: `${theme.accentColor}18`,
                      color: theme.accentColor
                    }}
                  >
                    <ThemeIcon className="w-5 h-5 stroke-[2]" />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-sm font-bold text-white">{theme.name}</h4>
                      <span 
                        className="text-[9px] px-1.5 py-0.2 rounded-full border font-mono font-medium"
                        style={{
                          borderColor: `${theme.accentColor}60`,
                          color: theme.accentColor,
                          backgroundColor: `${theme.accentColor}15`
                        }}
                      >
                        {theme.badge}
                      </span>
                      {theme.category === 'glass' && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white/10 text-white/90 border border-white/20">
                          Glass
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {theme.tagline}
                    </p>
                  </div>
                </div>

                <div 
                  className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                    isSelected ? 'text-black' : 'border-slate-700 text-transparent'
                  }`}
                  style={{
                    backgroundColor: isSelected ? theme.accentColor : 'transparent',
                    borderColor: isSelected ? theme.accentColor : undefined,
                    boxShadow: isSelected ? `0 0 12px ${theme.accentColor}` : undefined
                  }}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>

              {/* Live Preview Elements / Badges */}
              <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center gap-2 flex-wrap">
                <div 
                  className="px-2.5 py-1 rounded-xl text-[10px] font-semibold flex items-center gap-1.5 border"
                  style={{
                    borderColor: `${theme.accentColor}40`,
                    color: theme.accentColor,
                    backgroundColor: `${theme.accentColor}10`
                  }}
                >
                  <span 
                    className="w-1.5 h-1.5 rounded-full animate-ping"
                    style={{ backgroundColor: theme.accentColor }}
                  ></span>
                  {theme.category === 'cyberpunk' ? 'HUD Neon' : theme.category === 'glass' ? 'Liquid Glass' : 'AMOLED 0-Nit'}
                </div>

                <div className="px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-[10px] text-slate-300 font-mono">
                  Accent: {theme.accentColor}
                </div>

                {theme.secondaryAccent && (
                  <div className="px-2 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-[10px] text-slate-400 font-mono">
                    Sub: {theme.secondaryAccent}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Card */}
      <div className="p-3.5 rounded-2xl bg-[#091524] border border-cyan-900/40 text-xs text-slate-300 space-y-1.5">
        <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>রিয়েল-টাইম থিম ইঞ্জিন (Real-Time Theme Engine)</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          যেকোনো থিম সিলেক্ট করার সাথে সাথেই ফোনের বাইরের ফ্রেম, স্ট্যাটাস বার, নেভিগেশন বার এবং ভেতরের কার্ডগুলোতে ইনস্ট্যান্টলি কালার প্যালেট, ফ্রস্টেড গ্লাস ব্লার এবং সাইবার স্ক্যানলাইন পরিবর্তিত হবে।
        </p>
      </div>
    </div>
  );
};
