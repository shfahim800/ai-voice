import React from 'react';
import { Mic, Bot, Layers, Smartphone, ShieldCheck, Sparkles } from 'lucide-react';

export const BrandingFooter: React.FC = () => {
  return (
    <div className="w-full bg-[#020612]/95 border-t border-cyan-900/50 py-3.5 px-4 text-slate-300 select-none backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Left */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-400 to-blue-600 p-[1.5px] shadow-[0_0_15px_rgba(56,189,248,0.5)] shrink-0">
            <div className="w-full h-full bg-[#030712] rounded-[14px] flex items-center justify-center">
              <span className="text-base font-black bg-gradient-to-r from-cyan-300 to-sky-400 bg-clip-text text-transparent">
                SH
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white tracking-wide flex items-center gap-1.5">
              SH AI Assistant
            </h3>
            <p className="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase">
              Your Personal AI
            </p>
          </div>
        </div>

        {/* Feature Pills (matching screenshot ribbon) */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-sm">
              <Mic className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <span className="text-[11px] font-bold text-white block">Voice Control</span>
              <span className="text-[9px] text-slate-400">Bangla + English</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-sm">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <span className="text-[11px] font-bold text-white block">Multi AI</span>
              <span className="text-[9px] text-slate-400">Ollama + OpenAI + Gemini</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-sm">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <span className="text-[11px] font-bold text-white block">10+ Plugins</span>
              <span className="text-[9px] text-slate-400">Smart Tools</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-sm">
              <Smartphone className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <span className="text-[11px] font-bold text-white block">PC + Phone</span>
              <span className="text-[9px] text-slate-400">Same Wi-Fi</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-left">
              <span className="text-[11px] font-bold text-white block">Fast & Secure</span>
              <span className="text-[9px] text-slate-400">Your Data, Your Control</span>
            </div>
          </div>
        </div>

        {/* Right Motto */}
        <div className="text-right shrink-0 hidden lg:block">
          <span className="text-xs font-bold text-cyan-400 tracking-wide block italic font-serif">
            Smarter Today,
          </span>
          <span className="text-xs font-bold text-blue-400 tracking-wide block italic font-serif">
            Better Tomorrow
          </span>
        </div>
      </div>
    </div>
  );
};
