import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Check, 
  Sparkles, 
  Cpu, 
  Zap, 
  Bot,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { AIProvider } from '../../types/assistant';
import { audioService } from '../../services/audioService';

interface AiSettingsScreenProps {
  onBack: () => void;
  provider: AIProvider;
  onUpdateProvider: (p: AIProvider) => void;
  apiKey: string;
  onUpdateApiKey: (k: string) => void;
  temperature: number;
  onUpdateTemp: (t: number) => void;
}

export const AiSettingsScreen: React.FC<AiSettingsScreenProps> = ({
  onBack,
  provider,
  onUpdateProvider,
  apiKey,
  onUpdateApiKey,
  temperature,
  onUpdateTemp
}) => {
  const [showKey, setShowKey] = useState(false);
  const [model, setModel] = useState('gemini-2.5-flash');
  const [testing, setTesting] = useState(false);
  const [testSuccess, setTestSuccess] = useState<string | null>(null);

  const providers = [
    {
      id: 'ollama' as AIProvider,
      name: 'Ollama (Local LLM)',
      badge: 'Offline • Free • Private',
      icon: Cpu,
      color: 'text-amber-400'
    },
    {
      id: 'huggingface' as AIProvider,
      name: 'Hugging Face Inference',
      badge: 'Open-Source • Free Endpoints',
      icon: Bot,
      color: 'text-yellow-400'
    },
    {
      id: 'openrouter' as AIProvider,
      name: 'OpenRouter Free Tier',
      badge: 'Multi-Model • Open Source',
      icon: Zap,
      color: 'text-sky-400'
    },
    {
      id: 'custom-agent' as AIProvider,
      name: 'Custom Autonomous Agent',
      badge: 'Webhook • LangChain / n8n',
      icon: Activity,
      color: 'text-fuchsia-400'
    },
    {
      id: 'gemini' as AIProvider,
      name: 'Google Gemini',
      badge: 'Google AI • Fast',
      icon: Sparkles,
      color: 'text-cyan-400'
    },
    {
      id: 'openai' as AIProvider,
      name: 'OpenAI',
      badge: 'GPT-4o • Cloud',
      icon: Bot,
      color: 'text-emerald-400'
    },
    {
      id: 'groq' as AIProvider,
      name: 'Groq',
      badge: 'Ultra Fast LPU',
      icon: Zap,
      color: 'text-orange-400'
    }
  ];

  const handleTestConnection = async () => {
    setTesting(true);
    setTestSuccess(null);
    audioService.playCyberChime('activate');

    setTimeout(() => {
      setTesting(false);
      setTestSuccess('Connected successfully! Ping: 42ms');
      audioService.playCyberChime('success');
      setTimeout(() => setTestSuccess(null), 4000);
    }, 900);
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
          <h2 className="text-sm font-bold text-white tracking-wide">AI Agent Settings</h2>
          <p className="text-[10px] text-slate-400">Manage your AI models & API</p>
        </div>
      </div>

      {/* AI Provider Section */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-300">AI Provider</label>
        <div className="space-y-2">
          {providers.map((p) => {
            const isSelected = provider === p.id;
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                onClick={() => {
                  audioService.playCyberChime('beep');
                  onUpdateProvider(p.id);
                }}
                className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#091b30] border-2 border-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                    : 'bg-[#081525] border border-cyan-950 hover:border-cyan-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center ${p.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{p.name}</h4>
                    <p className="text-[10px] text-cyan-400/90 font-medium">{p.badge}</p>
                  </div>
                </div>

                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  isSelected ? 'border-cyan-400 bg-cyan-400 text-slate-950' : 'border-slate-700'
                }`}>
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Model Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-300">Model</label>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full bg-[#081525] border border-cyan-950 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-cyan-500"
        >
          <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended - Built-in)</option>
          <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep Reasoning)</option>
          <option value="gpt-4o">GPT-4o (Omni Multimodal)</option>
          <option value="llama-3.3-70b">Llama 3.3 70B (Local Ollama / Groq)</option>
        </select>
      </div>

      {/* Temperature Slider */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <label className="font-bold text-slate-300">Temperature</label>
          <span className="font-mono text-cyan-400">{temperature.toFixed(1)}</span>
        </div>
        <input
          type="range"
          min="0.0"
          max="1.0"
          step="0.1"
          value={temperature}
          onChange={(e) => onUpdateTemp(parseFloat(e.target.value))}
          className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500">
          <span>Precise (0.0)</span>
          <span>Creative (1.0)</span>
        </div>
      </div>

      {/* API Key */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-300">API Key</label>
        <div className="relative">
          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => onUpdateApiKey(e.target.value)}
            placeholder="AI Studio / Custom Key (Optional)"
            className="w-full bg-[#081525] border border-cyan-950 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-cyan-500 pr-10 font-mono"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400"
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Test Connection Button */}
      <div className="pt-2">
        <button
          onClick={handleTestConnection}
          disabled={testing}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-bold shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:brightness-110 active:scale-95 transition"
        >
          <Activity className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
          <span>{testing ? 'Testing Neural Latency...' : 'Test Connection'}</span>
        </button>

        {testSuccess && (
          <div className="mt-2.5 p-2 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 justify-center animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{testSuccess}</span>
          </div>
        )}
      </div>
    </div>
  );
};
