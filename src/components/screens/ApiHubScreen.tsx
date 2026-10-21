import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Cpu, 
  Bot, 
  Sparkles, 
  Zap, 
  Check, 
  Plus, 
  Activity, 
  Radio, 
  Send, 
  RefreshCw,
  Terminal,
  Layers,
  Crown,
  Gauge,
  Rocket,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { audioService } from '../../services/audioService';
import { apiHubService, MultiAgentRaceResult } from '../../services/apiHubService';
import { AgentEndpointConfig } from '../../types/assistant';

interface ApiHubScreenProps {
  onBack: () => void;
}

export const ApiHubScreen: React.FC<ApiHubScreenProps> = ({ onBack }) => {
  const [endpoints, setEndpoints] = useState<AgentEndpointConfig[]>(apiHubService.getEndpoints());
  const [activeAgent, setActiveAgent] = useState<AgentEndpointConfig | undefined>(apiHubService.getActiveAgent());
  const [isParallelRace, setIsParallelRace] = useState<boolean>(apiHubService.isParallelRaceMode());
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; msg: string; latency?: number } | null>(null);
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [benchmarkSummary, setBenchmarkSummary] = useState<string | null>(null);

  // Test Console
  const [testPrompt, setTestPrompt] = useState('পিসি স্ট্যাটাস চেক করো এবং আমাকে জানাও');
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [raceResult, setRaceResult] = useState<MultiAgentRaceResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Add modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newType, setNewType] = useState<'ollama' | 'huggingface' | 'openrouter' | 'custom-agent'>('ollama');
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('http://localhost:11434');
  const [newModel, setNewModel] = useState('llama3');
  const [newKey, setNewKey] = useState('');

  useEffect(() => {
    const unsub = apiHubService.subscribe((eps) => {
      setEndpoints(eps);
      setActiveAgent(apiHubService.getActiveAgent());
      setIsParallelRace(apiHubService.isParallelRaceMode());
    });
    return () => unsub();
  }, []);

  const handleToggleParallelRace = () => {
    audioService.playCyberChime('activate');
    const nextVal = !isParallelRace;
    setIsParallelRace(nextVal);
    apiHubService.setParallelRaceMode(nextVal);
  };

  const handleSelectActive = (id: string) => {
    audioService.playCyberChime('activate');
    apiHubService.setActiveAgent(id);
    setActiveAgent(apiHubService.getActiveAgent());
  };

  const handleTestConnection = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTestingId(id);
    setTestResult(null);
    audioService.playCyberChime('beep');

    const res = await apiHubService.testEndpoint(id);
    setTestingId(null);
    setTestResult({ id, msg: res.message, latency: res.latencyMs });
    audioService.playCyberChime(res.success ? 'success' : 'alert');

    setTimeout(() => {
      setTestResult(null);
    }, 4500);
  };

  const handleBenchmarkAll = async () => {
    audioService.playCyberChime('activate');
    setIsBenchmarking(true);
    setBenchmarkSummary('১৫টি এআই এজেন্টের সমান্তরাল স্পিড টেস্ট চলছে...');

    const res = await apiHubService.benchmarkAllAgents();
    setEndpoints(apiHubService.getEndpoints());
    setIsBenchmarking(false);
    audioService.playCyberChime('success');

    setBenchmarkSummary(
      `✅ টেস্ট সম্পন্ন! সবচেয়ে দ্রুততম: ${res.fastest.name} (${res.fastest.latencyMs}ms)। গড় রেসপন্স: ${res.averageMs}ms`
    );

    setTimeout(() => {
      setBenchmarkSummary(null);
    }, 6000);
  };

  const handleRunAgentSandbox = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPrompt.trim() || isExecuting) return;

    audioService.playCyberChime('activate');
    setIsExecuting(true);
    setTestOutput(null);
    setRaceResult(null);

    if (isParallelRace) {
      const race = await apiHubService.raceAllAgents(testPrompt);
      setRaceResult(race);
      setTestOutput(race.reply);
      audioService.playCyberChime('success');
    } else {
      const reply = await apiHubService.queryAgent(testPrompt);
      setTestOutput(reply);
      audioService.playCyberChime('success');
    }

    setIsExecuting(false);
  };

  const handleAddAgent = () => {
    if (!newName.trim() || !newUrl.trim()) return;
    audioService.playCyberChime('activate');

    apiHubService.addEndpoint({
      name: newName,
      type: newType,
      endpointUrl: newUrl,
      model: newModel || 'default',
      apiKey: newKey || undefined,
      enabled: true,
      isOnline: true,
      latencyMs: 35,
      systemPrompt: 'You are an autonomous AI assistant module.'
    });

    setShowAddModal(false);
    setNewName('');
    setNewKey('');
  };

  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'groq': return Zap;
      case 'ollama': return Cpu;
      case 'huggingface': return Bot;
      case 'openrouter': return Sparkles;
      default: return Terminal;
    }
  };

  const sortedEndpoints = [...endpoints].sort((a, b) => (a.latencyMs || 999) - (b.latencyMs || 999));
  const fastestAgentId = sortedEndpoints[0]?.id;

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#030712] select-none p-4 pb-20 overflow-y-auto space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1 staircase-1">
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
              <Layers className="w-4 h-4 text-cyan-400" />
              15 Multi-Agent High-Speed Hub
            </h2>
            <p className="text-[10px] text-cyan-400 font-medium">১০-১৫টি এআই এজেন্টের সমান্তরাল রেসার</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 hover:bg-cyan-500/30 transition active:scale-95"
          title="Add Custom Agent"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Parallel 15-Agent Race Mode Switcher Banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/70 via-slate-900/90 to-blue-950/70 border border-cyan-500/40 shadow-[0_4px_25px_rgba(56,189,248,0.2)] staircase-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
              isParallelRace ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/30' : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}>
              <Rocket className={`w-5 h-5 ${isParallelRace ? 'animate-bounce text-cyan-300' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-white">Parallel Multi-Agent Racer</h3>
                <span className={`px-2 py-0.2 rounded-full text-[9px] font-mono font-bold border ${
                  isParallelRace 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50' 
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {isParallelRace ? 'ACTIVE (<120ms)' : 'STANDBY'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                একসাথে ১৫টি এজেন্টে কুয়েরি পাঠিয়ে সবচেয়ে দ্রুততম এনসার প্রদান
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={handleToggleParallelRace}
            className={`w-12 h-6 rounded-full transition p-1 flex items-center ${
              isParallelRace ? 'bg-cyan-500 justify-end' : 'bg-slate-800 justify-start'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-slate-950 shadow-md" />
          </button>
        </div>

        {/* Global Benchmark Action Button */}
        <div className="mt-3 pt-2.5 border-t border-cyan-500/20 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-mono">
            {endpoints.length} Agents Configured (Groq, Cerebras, Gemini, DeepSeek...)
          </span>
          <button
            onClick={handleBenchmarkAll}
            disabled={isBenchmarking}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-200 text-xs font-bold hover:bg-cyan-500/30 flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50"
          >
            <Gauge className={`w-3.5 h-3.5 ${isBenchmarking ? 'animate-spin' : ''}`} />
            <span>{isBenchmarking ? 'টেস্ট চলছে...' : 'স্পিড ও পিং টেস্ট'}</span>
          </button>
        </div>

        {benchmarkSummary && (
          <div className="mt-2 p-2 rounded-xl bg-black/50 border border-cyan-500/30 text-[11px] text-cyan-200 leading-relaxed font-sans animate-fade-in">
            {benchmarkSummary}
          </div>
        )}
      </div>

      {/* Live Agent Test Sandbox */}
      <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 staircase-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            Live Rapid AI Sandbox (দ্রুত পরীক্ষা)
          </span>
          <span className="text-[10px] text-cyan-400 font-mono">
            {isParallelRace ? '⚡ 15-Agent Race Mode' : `Single: ${activeAgent?.name}`}
          </span>
        </div>

        <form onSubmit={handleRunAgentSandbox} className="flex gap-2">
          <input
            type="text"
            value={testPrompt}
            onChange={(e) => setTestPrompt(e.target.value)}
            placeholder="প্রম্পট লিখুন (যেমন: পিসি স্ট্যাটাস বা কোনো প্রশ্ন)..."
            className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-400"
          />
          <button
            type="submit"
            disabled={isExecuting}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-cyan-400 active:scale-95 transition disabled:opacity-50 shadow-md shadow-cyan-500/20"
          >
            {isExecuting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>{isExecuting ? 'রেসিং...' : 'রান'}</span>
          </button>
        </form>

        {/* Speed Racer Result Leaderboard */}
        {raceResult && (
          <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-2.5 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Winner: {raceResult.winner.name}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                {raceResult.totalTimeMs}ms Total Time
              </span>
            </div>

            {/* Quick Leaderboard Bars */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1 text-[10px] font-mono">
              {raceResult.allResults.slice(0, 6).map((r, idx) => (
                <div key={r.agentId} className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300 truncate max-w-[100px]">{idx + 1}. {r.agentName}</span>
                  <span className={idx === 0 ? 'text-amber-400 font-bold' : 'text-cyan-400'}>{r.latencyMs}ms</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {testOutput && (
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-cyan-200 font-sans leading-relaxed animate-fade-in whitespace-pre-wrap">
            {testOutput}
          </div>
        )}
      </div>

      {/* 15 Configured Agents & APIs List */}
      <div className="space-y-2 staircase-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300">
            Available AI Agent Endpoints ({endpoints.length})
          </label>
          <span className="text-[10px] text-slate-500">Sorted by latency</span>
        </div>

        {sortedEndpoints.map((ep, idx) => {
          const isSelected = activeAgent?.id === ep.id;
          const Icon = getAgentIcon(ep.type);
          const isTestingThis = testingId === ep.id;
          const isFastest = ep.id === fastestAgentId;

          return (
            <div
              key={ep.id}
              onClick={() => handleSelectActive(ep.id)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-900/90 border-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-white truncate">{ep.name}</h4>
                      {isFastest && (
                        <span className="px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/30 flex items-center gap-0.5">
                          <Crown className="w-2.5 h-2.5" /> FASTEST
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 truncate font-mono">
                      {ep.model} • {ep.endpointUrl}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Ping Test Button */}
                  <button
                    onClick={(e) => handleTestConnection(ep.id, e)}
                    disabled={isTestingThis}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1 transition"
                  >
                    <Activity className={`w-3 h-3 ${isTestingThis ? 'animate-spin text-cyan-400' : 'text-slate-400'}`} />
                    <span className="font-mono">{isTestingThis ? '...' : `${ep.latencyMs || 25}ms`}</span>
                  </button>

                  {/* Active Radio Badge */}
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    isSelected ? 'bg-cyan-400 border-cyan-400 text-slate-950' : 'border-slate-700'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              </div>

              {/* Ping feedback */}
              {testResult?.id === ep.id && (
                <div className="mt-2 text-[10px] text-cyan-300 font-mono bg-cyan-950/70 p-1.5 rounded-lg border border-cyan-500/30">
                  {testResult.msg}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Custom Agent Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs rounded-2xl bg-slate-900 border border-cyan-500/40 p-4 space-y-3 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Add Open-Source AI / Custom Agent</h3>

            <div className="space-y-2">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-mono">Provider Type</label>
                <div className="grid grid-cols-2 gap-1.5 mt-1">
                  {(['ollama', 'huggingface', 'openrouter', 'custom-agent'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setNewType(t);
                        if (t === 'ollama') setNewUrl('http://localhost:11434');
                        if (t === 'huggingface') setNewUrl('https://api-inference.huggingface.co/models/');
                        if (t === 'openrouter') setNewUrl('https://openrouter.ai/api/v1');
                      }}
                      className={`py-1.5 rounded-lg text-[10px] font-bold uppercase transition ${
                        newType === t ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-mono">Agent Name</label>
                <input
                  type="text"
                  placeholder="e.g. My Fast Agent"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-mono">Endpoint URL</label>
                <input
                  type="text"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-mono">Model Identifier</label>
                <input
                  type="text"
                  placeholder="e.g. llama3.3, deepseek-r1"
                  value={newModel}
                  onChange={(e) => setNewModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-cyan-400 font-mono"
                />
              </div>

              {newType !== 'ollama' && (
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-mono">API Key / Token (Optional)</label>
                  <input
                    type="password"
                    placeholder="Bearer token or API key"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-cyan-400"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAgent}
                className="flex-1 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
              >
                Save Agent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
