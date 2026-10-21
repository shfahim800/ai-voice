import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Battery, 
  BatteryCharging, 
  BatteryMedium, 
  BatteryLow, 
  BatteryWarning,
  Sparkles, 
  Flame, 
  Leaf, 
  Gauge, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Activity,
  Cpu,
  Plug
} from 'lucide-react';
import { batteryService, BatteryState, BatteryMode } from '../../services/batteryService';
import { audioService } from '../../services/audioService';
import confetti from 'canvas-confetti';

export const BatteryWidget: React.FC = () => {
  const [battery, setBattery] = useState<BatteryState>(batteryService.getState());
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [optimizing, setOptimizing] = useState<boolean>(false);
  const [optimizationMsg, setOptimizationMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = batteryService.subscribe((state) => {
      setBattery(state);
    });
    return () => unsubscribe();
  }, []);

  const handleToggleExpand = () => {
    audioService.playCyberChime('beep');
    setIsExpanded(!isExpanded);
  };

  const handleToggleCharging = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioService.playCyberChime('activate');
    batteryService.toggleCharging();
  };

  const handleSetMode = (mode: BatteryMode, e: React.MouseEvent) => {
    e.stopPropagation();
    audioService.playCyberChime('beep');
    batteryService.setMode(mode);
  };

  const handleOptimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (optimizing) return;
    setOptimizing(true);
    audioService.playCyberChime('activate');

    setTimeout(() => {
      const res = batteryService.optimize();
      setOptimizing(false);
      setOptimizationMsg(
        res.gainedPct > 0 
          ? `AI Core Optimized: +${res.gainedPct}% Virtual reserve restored, Core cooled by ${res.tempDrop}°C`
          : `AI Core Optimized: Background caches cleared, Thermal load reduced by ${res.tempDrop}°C`
      );

      try {
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.65 },
          colors: ['#06b6d4', '#10b981', '#38bdf8']
        });
      } catch {
        // ignore if not available
      }

      setTimeout(() => setOptimizationMsg(null), 4000);
    }, 700);
  };

  // Color mappings based on battery level
  const getLevelColor = () => {
    if (battery.level <= 20) {
      return {
        bar: 'bg-gradient-to-r from-rose-500 to-red-500',
        glow: 'shadow-[0_0_12px_rgba(244,63,94,0.6)]',
        text: 'text-rose-400',
        badge: 'bg-rose-950/80 text-rose-300 border-rose-500/40',
        border: 'border-rose-500/30'
      };
    }
    if (battery.level <= 50) {
      return {
        bar: 'bg-gradient-to-r from-amber-400 to-yellow-400',
        glow: 'shadow-[0_0_12px_rgba(245,158,11,0.5)]',
        text: 'text-amber-400',
        badge: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
        border: 'border-amber-500/30'
      };
    }
    return {
      bar: 'bg-gradient-to-r from-emerald-400 to-cyan-400',
      glow: 'shadow-[0_0_12px_rgba(52,211,153,0.5)]',
      text: 'text-cyan-400',
      badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40',
      border: 'border-cyan-500/30'
    };
  };

  const colors = getLevelColor();

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (battery.isCharging) {
      return `${minutes}m to 100%`;
    }
    return h > 0 ? `${h}h ${m}m left` : `${m}m left`;
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#071629] via-[#091b33] to-[#061427] border ${colors.border} transition-all duration-300 shadow-[0_4px_20px_rgba(3,15,30,0.6)]`}>
      {/* Background cyber ambient glow */}
      <div className="absolute -left-10 -top-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>
      {battery.isCharging && (
        <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-emerald-500/15 rounded-full blur-xl pointer-events-none animate-pulse"></div>
      )}

      {/* Main Bar (Always Visible) */}
      <div 
        onClick={handleToggleExpand}
        className="p-3.5 cursor-pointer select-none flex flex-col gap-2.5 transition active:scale-[0.995]"
      >
        {/* Top Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center ${colors.text}`}>
              {battery.isCharging ? (
                <Zap className="w-4 h-4 fill-current animate-pulse" />
              ) : battery.level <= 20 ? (
                <BatteryWarning className="w-4 h-4 text-rose-400 animate-bounce" />
              ) : battery.level <= 50 ? (
                <BatteryMedium className="w-4 h-4 text-amber-400" />
              ) : (
                <Battery className="w-4 h-4 text-emerald-400" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white tracking-wide">AI Power Matrix</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full border font-mono uppercase tracking-wider ${colors.badge}`}>
                  {battery.mode}
                </span>
                {battery.isRealApi && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-950 text-blue-300 border border-blue-500/40 font-mono">
                    HW API
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                {battery.isCharging ? (
                  <span className="text-emerald-400 flex items-center gap-0.5 font-medium">
                    <Zap className="w-3 h-3 inline fill-current" />
                    {battery.chargingType} • {formatTime(battery.estimatedMinutes)}
                  </span>
                ) : (
                  <span>Discharging • {formatTime(battery.estimatedMinutes)}</span>
                )}
              </p>
            </div>
          </div>

          {/* Level Percentage & Expand toggle */}
          <div className="flex items-center gap-2.5">
            <div className="text-right">
              <div className="flex items-baseline justify-end gap-0.5">
                <span className={`text-lg font-black tracking-tight ${colors.text} font-mono`}>
                  {battery.level}
                </span>
                <span className="text-xs font-semibold text-slate-400">%</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono block -mt-1">
                {battery.wattage.toFixed(1)}W
              </span>
            </div>

            <button 
              className="w-6 h-6 rounded-md bg-slate-900/90 border border-slate-700/80 flex items-center justify-center text-slate-400 hover:text-cyan-400 transition"
              title="Expand Battery Matrix"
            >
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Battery Progress Bar */}
        <div className="relative w-full">
          <div className="w-full h-2 rounded-full bg-slate-950/90 border border-slate-800 p-[1px] overflow-hidden flex items-center">
            <div 
              className={`h-full rounded-full ${colors.bar} ${colors.glow} transition-all duration-500 relative`}
              style={{ width: `${Math.max(4, battery.level)}%` }}
            >
              {/* Shimmer animation on charging */}
              {battery.isCharging && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]"></div>
              )}
            </div>
          </div>

          {/* Sub-bar micro metrics */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1 px-0.5">
            <span>Temp: <strong className="text-slate-300">{battery.temperature.toFixed(1)}°C</strong></span>
            <span>Volt: <strong className="text-slate-300">{battery.voltage.toFixed(2)}V</strong></span>
            <span>Health: <strong className="text-emerald-400">{battery.health}%</strong></span>
          </div>
        </div>
      </div>

      {/* Expanded Personal AI Power Inspector Tray */}
      {isExpanded && (
        <div className="px-3.5 pb-3.5 pt-1 border-t border-cyan-900/40 space-y-3 bg-[#050e1b]/90 animate-fadeIn">
          {/* Optimization notification toast */}
          {optimizationMsg && (
            <div className="p-2 rounded-xl bg-cyan-950/90 border border-cyan-400/80 text-cyan-200 text-xs flex items-center gap-2 shadow-[0_0_12px_rgba(56,189,248,0.3)]">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 animate-spin" />
              <span>{optimizationMsg}</span>
            </div>
          )}

          {/* Quick AI Power Mode Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Personal AI Power Profile
              </span>
              <span className="text-[10px] text-cyan-400 font-medium">Dynamic Neural Scaling</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={(e) => handleSetMode('eco', e)}
                className={`py-1.5 px-2 rounded-xl border flex flex-col items-center gap-0.5 transition active:scale-95 text-center ${
                  battery.mode === 'eco'
                    ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Leaf className="w-3 h-3 text-emerald-400" />
                  <span className="text-xs font-bold">Eco AI</span>
                </div>
                <span className="text-[9px] text-slate-400">Up to 14h life</span>
              </button>

              <button
                onClick={(e) => handleSetMode('balanced', e)}
                className={`py-1.5 px-2 rounded-xl border flex flex-col items-center gap-0.5 transition active:scale-95 text-center ${
                  battery.mode === 'balanced'
                    ? 'bg-sky-950/70 border-sky-500 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.3)]'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-sky-400" />
                  <span className="text-xs font-bold">Balanced</span>
                </div>
                <span className="text-[9px] text-slate-400">Intelligent auto</span>
              </button>

              <button
                onClick={(e) => handleSetMode('turbo', e)}
                className={`py-1.5 px-2 rounded-xl border flex flex-col items-center gap-0.5 transition active:scale-95 text-center ${
                  battery.mode === 'turbo'
                    ? 'bg-purple-950/70 border-purple-500 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Flame className="w-3 h-3 text-purple-400" />
                  <span className="text-xs font-bold">AI Turbo</span>
                </div>
                <span className="text-[9px] text-slate-400">Peak inference</span>
              </button>
            </div>
          </div>

          {/* Interactive Actions Grid: Fast Charge Simulator + AI Calibration */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {/* Plug In / Unplug simulation */}
            <button
              onClick={handleToggleCharging}
              className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition active:scale-95 ${
                battery.isCharging
                  ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-300 hover:bg-emerald-900/50'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300'
              }`}
            >
              <Plug className={`w-3.5 h-3.5 ${battery.isCharging ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{battery.isCharging ? 'Unplug Charger' : 'Connect 65W GaN'}</span>
            </button>

            {/* 1-Tap AI Power Optimizer */}
            <button
              onClick={handleOptimize}
              disabled={optimizing}
              className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-500/60 text-cyan-300 hover:border-cyan-400 text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-95 shadow-[0_0_12px_rgba(6,182,212,0.2)] disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 text-cyan-400 ${optimizing ? 'animate-spin' : ''}`} />
              <span>{optimizing ? 'Calibrating...' : 'Optimize AI Core'}</span>
            </button>
          </div>

          {/* Deep Hardware & Virtual Diagnostics */}
          <div className="rounded-xl bg-[#030914] border border-cyan-950 p-2.5 space-y-1.5 text-[10px]">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Cell Health & Integrity
              </span>
              <span className="text-emerald-400 font-bold">{battery.health}% ({battery.healthStatus})</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3 text-cyan-400" />
                Active Power Drain
              </span>
              <span className="text-slate-200 font-mono font-medium">{battery.wattage.toFixed(1)}W • {battery.voltage.toFixed(2)}V</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1">
                <Cpu className="w-3 h-3 text-indigo-400" />
                Thermal Management
              </span>
              <span className="text-slate-200 font-mono font-medium">{battery.temperature.toFixed(1)}°C (Adaptive Cooling)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
