import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Zap } from 'lucide-react';
import { batteryService, BatteryState } from '../services/batteryService';

export const StatusBar: React.FC<{ light?: boolean }> = ({ light = false }) => {
  const [time, setTime] = useState('9:41');
  const [battery, setBattery] = useState<BatteryState>(batteryService.getState());

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours % 12 || 12}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);

    const unsubscribe = batteryService.subscribe((state) => {
      setBattery(state);
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const getBatteryFillColor = () => {
    if (battery.level <= 20) return 'bg-rose-500';
    if (battery.level <= 50) return 'bg-amber-400';
    return 'bg-emerald-400';
  };

  return (
    <div className={`w-full flex items-center justify-between px-6 pt-3 pb-1 select-none text-xs font-semibold tracking-tight ${light ? 'text-slate-800' : 'text-slate-300'}`}>
      <span className="font-medium tracking-normal text-[13px]">{time}</span>
      
      {/* Center dynamic camera punch hole */}
      <div className="w-3.5 h-3.5 bg-black rounded-full ring-2 ring-slate-800/80 shadow-inner flex items-center justify-center">
        <div className="w-1.5 h-1.5 bg-cyan-950/80 rounded-full"></div>
      </div>

      <div className="flex items-center gap-1.5 opacity-90">
        <Signal className="w-3.5 h-3.5 stroke-[2.5]" />
        <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
        
        {/* Dynamic Battery & Percentage */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono tracking-tighter">
            {battery.level}%
          </span>
          <div className="flex items-center gap-0.5 relative">
            <div className="w-5 h-2.5 border border-current rounded-[3px] p-[1px] flex items-center relative overflow-hidden">
              <div 
                className={`h-full ${getBatteryFillColor()} rounded-[1.5px] transition-all duration-300`}
                style={{ width: `${Math.max(10, battery.level)}%` }}
              ></div>
              {battery.isCharging && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="w-2.5 h-2.5 text-white fill-white drop-shadow-sm animate-pulse" />
                </div>
              )}
            </div>
            <div className="w-0.5 h-1 bg-current rounded-r-xs"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
