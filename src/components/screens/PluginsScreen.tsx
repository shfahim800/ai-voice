import React, { useState } from 'react';
import { 
  Bot, 
  Mic, 
  Volume2, 
  Search, 
  Folder, 
  Grid, 
  Languages, 
  Calculator, 
  Activity, 
  Workflow,
  Sparkles,
  Check,
  Cpu,
  ClipboardCopy,
  Terminal,
  Wifi,
  Shield,
  Layers,
  Sliders,
  ExternalLink,
  ChevronRight,
  HardDrive
} from 'lucide-react';
import { PluginItem } from '../../types/assistant';
import { audioService } from '../../services/audioService';

interface PluginsScreenProps {
  plugins: PluginItem[];
  onTogglePlugin: (id: string) => void;
  onOpenPluginModal?: (pluginId: string) => void;
}

export const PluginsScreen: React.FC<PluginsScreenProps> = ({
  plugins,
  onTogglePlugin,
  onOpenPluginModal
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'available'>('all');
  const [selectedPlugin, setSelectedPlugin] = useState<PluginItem | null>(null);

  const filteredPlugins = plugins.filter((p) => {
    if (filter === 'active') return p.enabled;
    if (filter === 'available') return !p.enabled;
    return true;
  });

  const getPluginIcon = (name: string) => {
    switch (name) {
      case 'AI Chat': return Bot;
      case 'Voice Recognition': return Mic;
      case 'Text to Speech': return Volume2;
      case 'Web Search': return Search;
      case 'File Manager': return Folder;
      case 'App Launcher': return Grid;
      case 'Translation': return Languages;
      case 'Calculator': return Calculator;
      case 'System Monitor':
      case 'Hardware Telemetry': return Cpu;
      case 'Cloud Clipboard Sync': return ClipboardCopy;
      case 'Code & Prompt Sandbox': return Terminal;
      case 'Network Traffic Analyzer': return Wifi;
      case 'Automation': return Workflow;
      default: return Sparkles;
    }
  };

  const handleToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    audioService.playCyberChime('beep');
    onTogglePlugin(id);
  };

  const handleCardClick = (plugin: PluginItem) => {
    audioService.playCyberChime('activate');
    setSelectedPlugin(plugin);
    if (onOpenPluginModal) {
      onOpenPluginModal(plugin.id);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#030712] select-none p-4 pb-20 overflow-y-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-white tracking-wide">Future Software & Plugins</h2>
          <span className="text-xs font-bold text-white bg-cyan-600 px-2.5 py-0.5 rounded-full border border-cyan-400/50 shadow-sm">
            {plugins.filter(p => p.enabled).length} Active
          </span>
        </div>
        <span className="text-[11px] text-cyan-400 font-medium">14+ Advanced Tools</span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-[#091524] p-1 rounded-xl border border-cyan-950">
        <button
          onClick={() => { setFilter('all'); audioService.playCyberChime('beep'); }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
            filter === 'all' 
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All ({plugins.length})
        </button>
        <button
          onClick={() => { setFilter('active'); audioService.playCyberChime('beep'); }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
            filter === 'active' 
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => { setFilter('available'); audioService.playCyberChime('beep'); }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
            filter === 'available' 
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Available
        </button>
      </div>

      {/* Plugins List */}
      <div className="space-y-2.5">
        {filteredPlugins.map((plugin) => {
          const Icon = getPluginIcon(plugin.name);
          return (
            <div
              key={plugin.id}
              onClick={() => handleCardClick(plugin)}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-[#081525] border border-cyan-950 hover:border-cyan-500/40 transition duration-150 cursor-pointer shadow-sm group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition ${
                  plugin.enabled 
                    ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.2)]'
                    : 'bg-slate-900 border border-slate-800 text-slate-500'
                }`}>
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition truncate">
                      {plugin.name}
                    </h4>
                    {plugin.category === 'system' && (
                      <span className="text-[9px] uppercase font-mono px-1 rounded bg-slate-800 text-slate-400">
                        Pro
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">
                    {plugin.description}
                  </p>
                </div>
              </div>

              {/* iOS style toggle switch */}
              <button
                type="button"
                onClick={(e) => handleToggle(plugin.id, e)}
                className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer shrink-0 ml-2 ${
                  plugin.enabled ? 'bg-cyan-500 shadow-[0_0_10px_rgba(56,189,248,0.5)]' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                    plugin.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* Selected Plugin Details Drawer */}
      {selectedPlugin && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-cyan-500/40 p-4 space-y-3.5 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-400/40">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedPlugin.name}</h3>
                  <p className="text-[10px] text-cyan-300 font-mono">Category: {selectedPlugin.category.toUpperCase()}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPlugin(null)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedPlugin.description}. Future software plugin ready for automation, cross-platform synchronization, and real-time execution.
            </p>

            {/* Simulated Live Telemetry Preview for hardware plugins */}
            {selectedPlugin.name.includes('Telemetry') && (
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center font-mono">
                <div>
                  <p className="text-[10px] text-slate-400">CPU</p>
                  <p className="text-xs font-bold text-cyan-300">24% • 3.8GHz</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">RAM</p>
                  <p className="text-xs font-bold text-emerald-300">4.2 / 16 GB</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">GPU Temp</p>
                  <p className="text-xs font-bold text-amber-300">46°C</p>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  onTogglePlugin(selectedPlugin.id);
                  setSelectedPlugin(null);
                }}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition ${
                  selectedPlugin.enabled ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-cyan-500 text-slate-950'
                }`}
              >
                {selectedPlugin.enabled ? 'Disable Plugin' : 'Enable Plugin'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
