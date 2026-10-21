import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { audioService } from '../../services/audioService';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState('Initializing AI Core...');

  useEffect(() => {
    audioService.playCyberChime('activate');

    const steps = [
      { p: 35, text: 'Loading Neural Models...' },
      { p: 60, text: 'Connecting PC & Android Bridge...' },
      { p: 85, text: 'Syncing Offline Plugins...' },
      { p: 100, text: 'SH AI Assistant Ready' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].p);
        setStatusText(steps[currentStep].text);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    }, 550);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div 
      onClick={onComplete}
      className="relative w-full h-full min-h-[680px] bg-[#030712] flex flex-col items-center justify-between p-8 select-none overflow-hidden cursor-pointer"
      title="Click anywhere to skip splash"
    >
      {/* Background radial ambient lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/15 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-blue-700/10 rounded-full blur-[90px] pointer-events-none"></div>

      <div className="w-full flex justify-end pt-2">
        <span className="text-[11px] text-slate-500 hover:text-cyan-400 border border-slate-800 rounded-full px-2.5 py-0.5 transition">
          Skip
        </span>
      </div>

      {/* Centerpiece holographic emblem */}
      <div className="relative flex flex-col items-center justify-center my-auto">
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Outer rotating dashed ring */}
          <div className="absolute inset-0 rounded-full border border-dashed border-cyan-500/40 animate-tech-spin"></div>
          
          {/* Second glowing tech ring */}
          <div className="absolute inset-4 rounded-full border border-blue-500/50 glow-cyan animate-tech-spin-reverse"></div>
          
          {/* Orbital nodes */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_10px_#38bdf8]"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa]"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-cyan-300 rounded-full shadow-[0_0_10px_#67e8f9]"></div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-indigo-400 rounded-full shadow-[0_0_10px_#818cf8]"></div>

          {/* Inner circle shield */}
          <div className="w-36 h-36 rounded-full bg-gradient-to-b from-[#082f49]/80 to-[#030712] border-2 border-cyan-400/80 shadow-[0_0_35px_rgba(56,189,248,0.4)] flex items-center justify-center">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.95, 1.05, 0.98], opacity: 1 }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="text-center"
            >
              <h1 className="text-5xl font-black tracking-wider bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(56,189,248,0.8)]">
                SH
              </h1>
            </motion.div>
          </div>
        </div>

        {/* Branding Typography */}
        <div className="text-center mt-6 space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]">
            SH AI Assistant
          </h2>
          <p className="text-sm font-medium text-cyan-400 tracking-wide">
            Your Personal AI
          </p>
          <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-slate-400">
            <span>Smarter</span>
            <span>•</span>
            <span>Faster</span>
            <span>•</span>
            <span>Together</span>
          </div>
        </div>
      </div>

      {/* Bottom Loading Progress */}
      <div className="w-full max-w-xs flex flex-col items-center gap-2 pb-6">
        <div className="w-full flex justify-between text-[11px] text-slate-400">
          <span>{statusText}</span>
          <span className="text-cyan-400 font-mono font-medium">{progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 rounded-full shadow-[0_0_10px_#38bdf8]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="text-[10px] text-slate-600">Tap anywhere to enter</span>
      </div>
    </div>
  );
};
