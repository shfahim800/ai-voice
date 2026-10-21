import React from 'react';
import { StatusBar } from './StatusBar';
import { BottomNav } from './BottomNav';
import { ScreenType, AppTheme } from '../types/assistant';
import { THEMES } from '../services/themeService';

interface PhoneFrameProps {
  children: React.ReactNode;
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  activePluginCount?: number;
  fullscreen?: boolean;
  theme?: AppTheme;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  currentScreen,
  onNavigate,
  activePluginCount = 10,
  fullscreen = false,
  theme = 'cyberpunk-dark',
}) => {
  const themeConfig = THEMES[theme] || THEMES['cyberpunk-dark'];

  // If in fullscreen mode, render edge-to-edge
  if (fullscreen) {
    return (
      <div className={`w-full h-screen max-h-screen ${themeConfig.screenBgClass} flex flex-col justify-between overflow-hidden relative transition-colors duration-300`}>
        {/* Ambient Aurora Orbs for iOS Blur & Glass themes */}
        {themeConfig.hasAuroraBlur && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/3 -right-24 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl"></div>
          </div>
        )}

        {/* Scanlines for Cyberpunk themes */}
        {themeConfig.hasScanlines && (
          <div className="absolute inset-0 pointer-events-none z-40 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px] opacity-70"></div>
        )}

        <StatusBar light={themeConfig.category === 'glass'} />
        
        <div className="flex-1 overflow-hidden relative z-10 flex flex-col">
          {children}
        </div>

        {currentScreen !== 'splash' && currentScreen !== 'voice' && (
          <BottomNav 
            currentScreen={currentScreen} 
            onNavigate={onNavigate}
            activePluginCount={activePluginCount}
            theme={theme}
          />
        )}
      </div>
    );
  }

  // Outer Phone Shell Frame styling based on theme
  const getShellFrameStyle = () => {
    switch (theme) {
      case 'ios-blur':
        return 'border-4 border-slate-400/60 ring-2 ring-white/30 shadow-[0_25px_80px_rgba(0,0,0,0.85),0_0_40px_rgba(56,189,248,0.25)] bg-[#0b1325]';
      case 'ios-glass-clear':
        return 'border-4 border-cyan-200/50 ring-2 ring-white/40 shadow-[0_25px_85px_rgba(0,0,0,0.85),0_0_50px_rgba(0,242,254,0.35)] bg-[#0a192f]';
      case 'glassmorphism-dark':
        return 'border-4 border-slate-600/70 ring-1 ring-slate-400/40 shadow-[0_30px_80px_rgba(0,0,0,0.95),0_0_35px_rgba(148,163,184,0.25)] bg-[#090b10]';
      case 'glassmorphism-aurora':
        return 'border-4 border-teal-400/60 ring-2 ring-indigo-400/40 shadow-[0_25px_80px_rgba(0,0,0,0.85),0_0_50px_rgba(45,212,191,0.35)] bg-[#041217]';
      case 'cyberpunk-neon':
        return 'border-4 border-[#00f0ff] ring-2 ring-[#ff0055]/80 shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_55px_rgba(0,240,255,0.45)] bg-[#050814]';
      case 'cyberpunk-red':
        return 'border-4 border-red-600 ring-2 ring-amber-500/80 shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_55px_rgba(255,23,68,0.45)] bg-[#0d0204]';
      case 'cyberpunk-synthwave':
        return 'border-4 border-fuchsia-500 ring-2 ring-purple-600/80 shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_55px_rgba(217,70,239,0.45)] bg-[#0b0314]';
      case 'matrix-green':
        return 'border-4 border-emerald-500/80 ring-2 ring-emerald-400/50 shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_45px_rgba(16,185,129,0.35)] bg-[#020b05]';
      case 'oled-black':
        return 'border-4 border-neutral-800 ring-1 ring-neutral-700 shadow-[0_25px_70px_rgba(0,0,0,0.95)] bg-black';
      case 'cyberpunk-dark':
      default:
        return 'border-4 border-slate-700/80 ring-1 ring-cyan-500/30 shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_50px_rgba(56,189,248,0.15)] bg-[#0c1322]';
    }
  };

  const getInnerScreenStyle = () => {
    switch (theme) {
      case 'ios-blur':
        return 'bg-gradient-to-br from-[#0c142b] via-[#121f42] to-[#091329] border border-white/20';
      case 'ios-glass-clear':
        return 'bg-gradient-to-b from-[#0a192f] via-[#0d223f] to-[#050f1d] border border-cyan-200/30';
      case 'glassmorphism-dark':
        return 'bg-[#090b10] border border-slate-700/50';
      case 'glassmorphism-aurora':
        return 'bg-gradient-to-br from-[#041217] via-[#090c24] to-[#031512] border border-teal-400/30';
      case 'cyberpunk-neon':
        return 'bg-[#030612] border-2 border-[#00f0ff]/50';
      case 'cyberpunk-red':
        return 'bg-[#0d0204] border-2 border-red-600/50';
      case 'cyberpunk-synthwave':
        return 'bg-[#0b0314] border-2 border-fuchsia-500/50';
      case 'matrix-green':
        return 'bg-[#020b05] border border-emerald-600/50';
      case 'oled-black':
        return 'bg-black border border-neutral-900';
      case 'cyberpunk-dark':
      default:
        return 'bg-[#030712] border border-slate-900';
    }
  };

  const getGestureLineStyle = () => {
    switch (theme) {
      case 'ios-blur':
      case 'ios-glass-clear':
      case 'glassmorphism-dark':
      case 'glassmorphism-aurora':
        return 'bg-white/50 shadow-[0_0_6px_rgba(255,255,255,0.4)]';
      case 'cyberpunk-neon':
        return 'bg-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.9)]';
      case 'cyberpunk-red':
        return 'bg-[#ff1744] shadow-[0_0_10px_rgba(255,23,68,0.9)]';
      case 'cyberpunk-synthwave':
        return 'bg-[#d946ef] shadow-[0_0_10px_rgba(217,70,239,0.9)]';
      case 'matrix-green':
        return 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]';
      default:
        return 'bg-slate-600/70';
    }
  };


  return (
    <div className="relative mx-auto my-4 transition-all duration-300">
      {/* Outer Phone Shell Frame */}
      <div className={`relative w-[380px] h-[780px] rounded-[48px] p-3 flex flex-col justify-between overflow-hidden transition-all duration-300 ${getShellFrameStyle()}`}>
        
        {/* Subtle glass reflection gradient */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-transparent via-white/[0.03] to-cyan-500/[0.04] pointer-events-none z-40 rounded-[44px]"></div>

        {/* Physical Button Silhouettes */}
        <div className="absolute -left-[7px] top-28 w-[3px] h-12 bg-slate-600 rounded-l-md"></div>
        <div className="absolute -left-[7px] top-44 w-[3px] h-12 bg-slate-600 rounded-l-md"></div>
        <div className="absolute -right-[7px] top-32 w-[3px] h-16 bg-slate-600 rounded-r-md"></div>

        {/* Inner AMOLED Screen Display Container */}
        <div className={`relative w-full h-full rounded-[38px] flex flex-col justify-between overflow-hidden shadow-inner transition-colors duration-300 ${getInnerScreenStyle()}`}>
          
          {/* Ambient Aurora Orbs for iOS Blur & Glass themes */}
          {themeConfig.hasAuroraBlur && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              <div className="absolute -top-16 -left-16 w-64 h-64 bg-sky-500/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute top-1/2 -right-16 w-56 h-56 bg-purple-500/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-16 left-1/4 w-60 h-60 bg-indigo-500/20 rounded-full blur-2xl"></div>
            </div>
          )}

          {/* Retro scanlines overlay for Cyberpunk themes */}
          {themeConfig.hasScanlines && (
            <div 
              className="absolute inset-0 pointer-events-none z-30 opacity-75"
              style={{
                backgroundImage: `linear-gradient(${themeConfig.accentColor}0a 1px, transparent 1px)`,
                backgroundSize: '100% 4px'
              }}
            ></div>
          )}

          {/* Top Status Bar with dynamic camera punch hole */}
          <div className="relative z-20">
            <StatusBar light={themeConfig.category === 'glass'} />
          </div>

          {/* Active Screen View */}
          <div className="flex-1 overflow-hidden relative z-10 flex flex-col">
            {children}
          </div>

          {/* Bottom Navigation (except on Splash or Voice screens) */}
          {currentScreen !== 'splash' && currentScreen !== 'voice' && (
            <BottomNav 
              currentScreen={currentScreen} 
              onNavigate={onNavigate}
              activePluginCount={activePluginCount}
              theme={theme}
            />
          )}

          {/* Android gesture navigation bar line */}
          <div className="w-full pb-1 pt-0.5 bg-black/40 backdrop-blur-xs flex justify-center items-center z-30">
            <div className={`w-32 h-1 rounded-full transition-colors duration-300 ${getGestureLineStyle()}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
