import React from 'react';
import { Home, MessageSquare, Wrench, LayoutGrid, MoreHorizontal } from 'lucide-react';
import { ScreenType, AppTheme } from '../types/assistant';
import { audioService } from '../services/audioService';

import { THEMES } from '../services/themeService';

interface BottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  activePluginCount?: number;
  theme?: AppTheme;
}

interface NavItem {
  id: ScreenType | 'settings';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  activePluginCount = 10,
  theme = 'cyberpunk-dark',
}) => {
  const themeConfig = THEMES[theme] || THEMES['cyberpunk-dark'];

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'tools', label: 'Tools', icon: Wrench },
    { id: 'plugins', label: 'Plugins', icon: LayoutGrid, badge: activePluginCount },
    { id: 'settings', label: 'More', icon: MoreHorizontal },
  ];

  const handleNav = (screen: ScreenType) => {
    audioService.playCyberChime('beep');
    onNavigate(screen);
  };

  const getNavContainerClass = () => {
    return themeConfig.bottomNavClass;
  };

  const getActiveIndicatorColor = () => {
    switch (theme) {
      case 'ios-blur':
        return 'bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]';
      case 'ios-glass-clear':
        return 'bg-cyan-300 shadow-[0_0_12px_rgba(0,242,254,0.9)]';
      case 'glassmorphism-dark':
        return 'bg-slate-300 shadow-[0_0_10px_rgba(203,213,225,0.7)]';
      case 'glassmorphism-aurora':
        return 'bg-teal-400 shadow-[0_0_12px_rgba(45,212,191,0.9)]';
      case 'cyberpunk-neon':
        return 'bg-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,1)]';
      case 'cyberpunk-red':
        return 'bg-[#ff1744] shadow-[0_0_12px_rgba(255,23,68,1)]';
      case 'cyberpunk-synthwave':
        return 'bg-[#d946ef] shadow-[0_0_12px_rgba(217,70,239,1)]';
      case 'matrix-green':
        return 'bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.9)]';
      case 'oled-black':
        return 'bg-neutral-300';
      default:
        return 'bg-cyan-400 glow-cyan';
    }
  };


  return (
    <div className={`w-full px-4 py-2 flex items-center justify-between select-none z-30 transition-all duration-300 ${getNavContainerClass()}`}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentScreen === item.id || 
          (item.id === 'settings' && (currentScreen === 'ai-settings' || currentScreen === 'connected-devices' || currentScreen === 'appearance'));

        return (
          <button
            key={item.id}
            onClick={() => handleNav(item.id as ScreenType)}
            className={`relative flex flex-col items-center justify-center py-1 px-2.5 transition-all duration-200 group ${
              isActive 
                ? theme === 'cyberpunk-neon' 
                  ? 'text-[#00f0ff] font-bold scale-105' 
                  : theme === 'ios-blur'
                  ? 'text-sky-300 font-semibold scale-105'
                  : 'text-cyan-400 font-semibold scale-105' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {/* Active glow pill */}
            {isActive && (
              <span className={`absolute -top-2 w-8 h-1 rounded-full ${getActiveIndicatorColor()}`}></span>
            )}
            
            <div className="relative">
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-cyan-400/50 shadow-xs">
                  {item.badge}
                </span>
              )}
            </div>
            <span className={`text-[10px] mt-1 ${isActive ? 'text-cyan-300 font-medium' : 'text-slate-400'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
