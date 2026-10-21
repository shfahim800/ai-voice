import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Smartphone, 
  Send, 
  Sliders, 
  Bell, 
  MessageSquare, 
  Camera, 
  ChevronRight, 
  Wifi, 
  Laptop, 
  CheckCircle2, 
  RefreshCw 
} from 'lucide-react';
import { audioService } from '../../services/audioService';
import { batteryService, BatteryState } from '../../services/batteryService';

interface ConnectedDevicesScreenProps {
  onBack: () => void;
}

export const ConnectedDevicesScreen: React.FC<ConnectedDevicesScreenProps> = ({ onBack }) => {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [battery, setBattery] = useState<BatteryState>(batteryService.getState());

  useEffect(() => {
    const unsubscribe = batteryService.subscribe((state) => {
      setBattery(state);
    });
    return () => unsubscribe();
  }, []);

  const deviceActions = [
    {
      id: 'file-transfer',
      name: 'File Transfer',
      desc: 'Send / Receive Files',
      icon: Send,
      action: 'File Transfer initialized. Ready to drop or pick files between PC & Phone.'
    },
    {
      id: 'remote-control',
      name: 'Remote Control',
      desc: 'Control your phone',
      icon: Sliders,
      action: 'Remote Control enabled. Phone mirror ready over Wi-Fi.'
    },
    {
      id: 'notifications',
      name: 'Notifications',
      desc: 'Phone Notifications',
      icon: Bell,
      action: 'Notification Bridge active. 3 new notifications synchronized.'
    },
    {
      id: 'message-sync',
      name: 'Message Sync',
      desc: 'SMS & Chat Access',
      icon: MessageSquare,
      action: 'SMS & Chat sync connected. Secure encrypted channel established.'
    },
    {
      id: 'camera-share',
      name: 'Camera Share',
      desc: 'Live Camera / Photos',
      icon: Camera,
      action: 'Camera stream ready. Low-latency 1080p preview link active.'
    }
  ];

  const handleAction = (act: typeof deviceActions[0]) => {
    audioService.playCyberChime('beep');
    setActiveAction(act.action);
    setTimeout(() => setActiveAction(null), 4000);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#030712] select-none p-4 pb-20 overflow-y-auto space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 pt-1">
        <button 
          onClick={onBack}
          className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-cyan-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-sm font-bold text-white tracking-wide">Connected Devices</h2>
          <p className="text-[10px] text-cyan-400 font-mono">Same Wi-Fi Network</p>
        </div>
      </div>

      {/* Main Connected Phone Device Card */}
      <div className="rounded-2xl bg-gradient-to-r from-[#091f38] to-[#0a182d] border border-cyan-500/40 p-4 shadow-[0_0_20px_rgba(56,189,248,0.2)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-inner">
              <Smartphone className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-medium">Android Phone</span>
              <h3 className="text-xs font-bold text-white">Samsung Galaxy A55 5G</h3>
              <p className="text-[10px] text-cyan-300/80 font-mono">IP: 192.168.1.15</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-300 bg-emerald-950/80 border border-emerald-500/50 px-2.5 py-1 rounded-full font-semibold shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Connected
          </span>
        </div>

        {/* Quick device status indicators */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-cyan-950 text-center text-[10px]">
          <div className="bg-[#050e1c] p-2 rounded-xl border border-cyan-950">
            <span className="text-slate-400 block">Battery</span>
            <span className="text-emerald-400 font-bold font-mono">
              {battery.level}% {battery.isCharging ? '(Charging)' : '(Battery)'}
            </span>
          </div>
          <div className="bg-[#050e1c] p-2 rounded-xl border border-cyan-950">
            <span className="text-slate-400 block">Wi-Fi</span>
            <span className="text-cyan-400 font-bold">5 GHz Link</span>
          </div>
          <div className="bg-[#050e1c] p-2 rounded-xl border border-cyan-950">
            <span className="text-slate-400 block">Storage</span>
            <span className="text-slate-200 font-bold">186 GB Free</span>
          </div>
        </div>
      </div>

      {/* Action Toast Feedback */}
      {activeAction && (
        <div className="p-3 rounded-xl bg-cyan-950/90 border border-cyan-400 text-cyan-200 text-xs flex items-center gap-2.5 shadow-[0_0_15px_rgba(56,189,248,0.3)] animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{activeAction}</span>
        </div>
      )}

      {/* Integration Options List */}
      <div className="space-y-2">
        {deviceActions.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => handleAction(item)}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-[#081525] border border-cyan-950 hover:border-cyan-500/40 transition duration-150 cursor-pointer shadow-sm group active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition">
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {item.desc}
                  </p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition" />
            </div>
          );
        })}
      </div>

      {/* Paired PC Card */}
      <div className="rounded-2xl bg-[#081525] border border-cyan-950 p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Laptop className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Windows 11 Workstation</h4>
            <p className="text-[10px] text-slate-400 font-mono">192.168.1.10 (Companion Agent)</p>
          </div>
        </div>
        <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
          Ready
        </span>
      </div>
    </div>
  );
};
