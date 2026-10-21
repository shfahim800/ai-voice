import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Wifi, 
  MousePointer, 
  Keyboard as KeyboardIcon, 
  FolderSync, 
  Sliders, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Lock, 
  Moon, 
  RefreshCw, 
  Power, 
  Terminal, 
  FileText, 
  Folder, 
  Globe, 
  Calculator, 
  Camera, 
  Upload, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Trash2,
  Send,
  Move,
  CornerDownLeft,
  Delete,
  Shield,
  Layers
} from 'lucide-react';
import { audioService } from '../../services/audioService';
import { pcControlService } from '../../services/pcControlService';
import { PcTransferredFile } from '../../types/assistant';
import { downloadWindowsScript } from '../../services/apkGenerator';

interface PcControlScreenProps {
  onBack: () => void;
  pcIp?: string;
}

export const PcControlScreen: React.FC<PcControlScreenProps> = ({ 
  onBack, 
  pcIp: defaultIp = '192.168.1.10' 
}) => {
  const [activeTab, setActiveTab] = useState<'trackpad' | 'keyboard' | 'files' | 'tools'>('trackpad');
  const [pcConfig, setPcConfig] = useState(pcControlService.getConfig());
  const [files, setFiles] = useState<PcTransferredFile[]>(pcControlService.getFiles());
  const [feedback, setFeedback] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [modifierState, setModifierState] = useState({ ctrl: false, alt: false, shift: false, win: false });
  const [isDragging, setIsDragging] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [tempIp, setTempIp] = useState(pcConfig.ip);
  const [tempPort, setTempPort] = useState(pcConfig.port.toString());
  
  // Trackpad touch state
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isMouseDownRef = useRef(false);
  const lastMousePosRef = useRef<{ x: number; y: number } | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 960, y: 540 });

  useEffect(() => {
    const unsub = pcControlService.subscribe(() => {
      setPcConfig(pcControlService.getConfig());
      setFiles(pcControlService.getFiles());
    });
    return () => unsub();
  }, []);

  const triggerFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  // --- Trackpad Handlers ---
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now()
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1 && touchStartRef.current) {
      const dx = (e.touches[0].clientX - touchStartRef.current.x) * pcConfig.sensitivity;
      const dy = (e.touches[0].clientY - touchStartRef.current.y) * pcConfig.sensitivity;

      pcControlService.sendTrackpadEvent({
        dx,
        dy,
        type: isDragging ? 'drag' : 'move'
      });

      setCursorPos(prev => ({
        x: Math.max(0, Math.min(1920, Math.round(prev.x + dx))),
        y: Math.max(0, Math.min(1080, Math.round(prev.y + dy)))
      }));

      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now()
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartRef.current) {
      const elapsed = Date.now() - touchStartRef.current.time;
      if (elapsed < 200 && pcConfig.tapToClick) {
        audioService.playCyberChime('beep');
        pcControlService.sendTrackpadEvent({ dx: 0, dy: 0, type: 'click' });
        triggerFeedback('Mouse: Left Click');
      }
    }
    touchStartRef.current = null;
  };

  // Mouse emulation for desktop testing
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isMouseDownRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMouseDownRef.current && lastMousePosRef.current) {
      const dx = (e.clientX - lastMousePosRef.current.x) * pcConfig.sensitivity;
      const dy = (e.clientY - lastMousePosRef.current.y) * pcConfig.sensitivity;

      pcControlService.sendTrackpadEvent({
        dx,
        dy,
        type: isDragging ? 'drag' : 'move'
      });

      setCursorPos(prev => ({
        x: Math.max(0, Math.min(1920, Math.round(prev.x + dx))),
        y: Math.max(0, Math.min(1080, Math.round(prev.y + dy)))
      }));

      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
    lastMousePosRef.current = null;
  };

  // --- Keyboard & Key Actions ---
  const handleSendKey = (key: string) => {
    audioService.playCyberChime('beep');
    pcControlService.sendKeyboardKey(key, {
      ctrl: modifierState.ctrl,
      alt: modifierState.alt,
      shift: modifierState.shift,
      meta: modifierState.win
    });
    triggerFeedback(`Sent Key: ${key}`);
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    audioService.playCyberChime('activate');
    pcControlService.sendTextToPc(textInput);
    triggerFeedback(`Typed to PC: "${textInput}"`);
    setTextInput('');
  };

  // --- Remote System Command ---
  const handleAction = async (action: string) => {
    audioService.playCyberChime('activate');
    const res = await pcControlService.executeSystemAction(action);
    triggerFeedback(res.message);
  };

  // --- File Upload ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    audioService.playCyberChime('beep');
    triggerFeedback(`Uploading "${file.name}" to PC...`);
    pcControlService.sendFileToPc(file);
    e.target.value = '';
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#030712] select-none p-4 pb-20 overflow-y-auto space-y-3.5">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
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
              <Globe className="w-4 h-4 text-cyan-400" />
              Wi-Fi PC Control
            </h2>
            <p className="text-[10px] text-cyan-400 font-medium">পিসি ওয়াইফাই কন্ট্রোলার ও ফাইল ট্রান্সফার</p>
          </div>
        </div>

        <button
          onClick={() => setShowConfigModal(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:border-cyan-500/40 transition active:scale-95"
        >
          <span className={`w-2 h-2 rounded-full ${pcConfig.connected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
          <span className="font-mono text-[10px] text-cyan-300">{pcConfig.ip}</span>
        </button>
      </div>

      {/* Toast Feedback */}
      {feedback && (
        <div className="p-2.5 rounded-xl bg-cyan-950/90 border border-cyan-400/80 text-cyan-200 text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(56,189,248,0.25)] animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
        <button
          onClick={() => { setActiveTab('trackpad'); audioService.playCyberChime('beep'); }}
          className={`py-1.5 flex flex-col items-center gap-0.5 rounded-lg text-[10px] font-semibold transition ${
            activeTab === 'trackpad' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          <MousePointer className="w-3.5 h-3.5" />
          <span>Trackpad</span>
        </button>
        <button
          onClick={() => { setActiveTab('keyboard'); audioService.playCyberChime('beep'); }}
          className={`py-1.5 flex flex-col items-center gap-0.5 rounded-lg text-[10px] font-semibold transition ${
            activeTab === 'keyboard' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          <KeyboardIcon className="w-3.5 h-3.5" />
          <span>Keyboard</span>
        </button>
        <button
          onClick={() => { setActiveTab('files'); audioService.playCyberChime('beep'); }}
          className={`py-1.5 flex flex-col items-center gap-0.5 rounded-lg text-[10px] font-semibold transition ${
            activeTab === 'files' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FolderSync className="w-3.5 h-3.5" />
          <span>Files</span>
        </button>
        <button
          onClick={() => { setActiveTab('tools'); audioService.playCyberChime('beep'); }}
          className={`py-1.5 flex flex-col items-center gap-0.5 rounded-lg text-[10px] font-semibold transition ${
            activeTab === 'tools' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Deck</span>
        </button>
      </div>

      {/* --- TAB 1: TRACKPAD & MOUSE --- */}
      {activeTab === 'trackpad' && (
        <div className="flex-1 flex flex-col space-y-3 min-h-[300px]">
          {/* Coordinates Bar */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-mono">
            <span>PC Cursor: ({cursorPos.x}, {cursorPos.y})</span>
            <span className="text-cyan-400">Sensitivity: {pcConfig.sensitivity.toFixed(1)}x</span>
          </div>

          {/* Virtual Trackpad Canvas Area */}
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="flex-1 min-h-[220px] rounded-2xl bg-gradient-to-br from-slate-900/90 via-[#071326] to-slate-900/90 border-2 border-cyan-500/30 flex flex-col items-center justify-center relative overflow-hidden cursor-crosshair touch-none shadow-inner"
          >
            {/* Grid texture */}
            <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

            <div className="text-center pointer-events-none select-none z-10 space-y-1">
              <Move className="w-8 h-8 text-cyan-400/60 mx-auto animate-pulse" />
              <p className="text-xs font-semibold text-slate-300">Virtual Touch Surface</p>
              <p className="text-[10px] text-slate-500">Slide to move cursor • Tap to click</p>
            </div>

            {/* Drag Mode Indicator */}
            {isDragging && (
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-400 text-amber-300 text-[10px] font-bold">
                DRAG MODE ACTIVE
              </div>
            )}
          </div>

          {/* Mouse Buttons Bar */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                audioService.playCyberChime('beep');
                pcControlService.sendTrackpadEvent({ dx: 0, dy: 0, type: 'click' });
                triggerFeedback('Left Click executed');
              }}
              className="py-3 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 text-xs font-bold hover:bg-cyan-900/80 active:scale-95 transition"
            >
              Left Click
            </button>
            <button
              onClick={() => {
                setIsDragging(!isDragging);
                audioService.playCyberChime('beep');
                triggerFeedback(isDragging ? 'Drag Mode off' : 'Drag Mode enabled');
              }}
              className={`py-3 rounded-xl border text-xs font-bold transition active:scale-95 ${
                isDragging
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              {isDragging ? 'Dragging...' : 'Hold Drag'}
            </button>
            <button
              onClick={() => {
                audioService.playCyberChime('beep');
                pcControlService.sendTrackpadEvent({ dx: 0, dy: 0, type: 'right_click' });
                triggerFeedback('Right Click executed');
              }}
              className="py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold hover:border-cyan-500/40 active:scale-95 transition"
            >
              Right Click
            </button>
          </div>

          {/* Sensitivity Slider */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 shrink-0">Speed:</span>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              value={pcConfig.sensitivity}
              onChange={(e) => pcControlService.updateConfig({ sensitivity: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* --- TAB 2: KEYBOARD & HOTKEYS --- */}
      {activeTab === 'keyboard' && (
        <div className="flex-1 flex flex-col space-y-3">
          {/* Quick Type Box */}
          <form onSubmit={handleSendText} className="flex gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type message to send to PC..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1 hover:bg-cyan-400 active:scale-95 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>

          {/* Modifiers Bar */}
          <div className="flex items-center gap-1.5">
            {(['ctrl', 'alt', 'shift', 'win'] as const).map((mod) => (
              <button
                key={mod}
                onClick={() => {
                  audioService.playCyberChime('beep');
                  setModifierState(prev => ({ ...prev, [mod]: !prev[mod] }));
                }}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase transition ${
                  modifierState[mod]
                    ? 'bg-cyan-400 text-slate-950 shadow-[0_0_10px_rgba(56,189,248,0.4)]'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {mod}
              </button>
            ))}
          </div>

          {/* Quick Shortcuts Grid */}
          <div className="space-y-1.5">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Fast Shortcuts</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  pcControlService.sendKeyboardKey('c', { ctrl: true });
                  triggerFeedback('Shortcut: Ctrl + C (Copy)');
                }}
                className="py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 hover:border-cyan-500/40 active:scale-95 transition"
              >
                Ctrl + C
              </button>
              <button
                onClick={() => {
                  pcControlService.sendKeyboardKey('v', { ctrl: true });
                  triggerFeedback('Shortcut: Ctrl + V (Paste)');
                }}
                className="py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 hover:border-cyan-500/40 active:scale-95 transition"
              >
                Ctrl + V
              </button>
              <button
                onClick={() => {
                  pcControlService.sendKeyboardKey('Tab', { alt: true });
                  triggerFeedback('Shortcut: Alt + Tab (Switch Window)');
                }}
                className="py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 hover:border-cyan-500/40 active:scale-95 transition"
              >
                Alt + Tab
              </button>
              <button
                onClick={() => handleAction('desktop')}
                className="py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 hover:border-cyan-500/40 active:scale-95 transition"
              >
                Win + D (Desktop)
              </button>
              <button
                onClick={() => handleAction('task_manager')}
                className="py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 hover:border-cyan-500/40 active:scale-95 transition"
              >
                Task Manager
              </button>
              <button
                onClick={() => handleAction('lock')}
                className="py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-rose-300 hover:border-rose-500/40 active:scale-95 transition"
              >
                Win + L (Lock)
              </button>
            </div>
          </div>

          {/* Function & Nav Keys */}
          <div className="space-y-1.5">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Navigation Keys</p>
            <div className="grid grid-cols-4 gap-1.5">
              {['Esc', 'Tab', 'Enter', 'Backspace', 'Space', 'Up', 'Down', 'Left', 'Right', 'F5', 'F11', 'Del'].map((k) => (
                <button
                  key={k}
                  onClick={() => handleSendKey(k)}
                  className="py-2 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300 hover:text-cyan-300 hover:border-cyan-500/30 active:scale-95 transition"
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: FILE TRANSFER --- */}
      {activeTab === 'files' && (
        <div className="flex-1 flex flex-col space-y-3">
          {/* File Upload Drop Bay */}
          <label className="relative border-2 border-dashed border-cyan-500/40 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 bg-[#081525]/80 hover:bg-[#0c1f36] cursor-pointer transition">
            <input type="file" onChange={handleFileUpload} className="hidden" />
            <Upload className="w-6 h-6 text-cyan-400 animate-bounce" />
            <div className="text-center">
              <p className="text-xs font-bold text-white">Tap to Send File to PC</p>
              <p className="text-[10px] text-slate-400">Photos, APKs, Documents over Wi-Fi</p>
            </div>
          </label>

          {/* Quick Pull from PC demo */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300">Transfer History ({files.length})</span>
            <button
              onClick={() => {
                audioService.playCyberChime('beep');
                pcControlService.requestFileFromPc('Project_Presentation_2026.pdf');
                triggerFeedback('Received file from PC: Project_Presentation_2026.pdf');
              }}
              className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              <span>Request PC File</span>
            </button>
          </div>

          {/* Transferred Files List */}
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/70 border border-slate-800"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    file.direction === 'to-pc' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {file.direction === 'to-pc' ? <Upload className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{file.name}</p>
                    <p className="text-[10px] text-slate-400">
                      {(file.size / 1024).toFixed(1)} KB • {file.timestamp} • {file.status}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => pcControlService.deleteFile(file.id)}
                  className="w-7 h-7 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 flex items-center justify-center transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 4: REMOTE DECK & SYSTEM TOOLS --- */}
      {activeTab === 'tools' && (
        <div className="flex-1 flex flex-col space-y-3">
          {/* Media Deck */}
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
            <p className="text-[11px] font-bold text-cyan-300">PC Media & Volume</p>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => handleAction('volume_down')}
                className="py-2.5 rounded-xl bg-slate-800/80 text-xs font-bold text-slate-200 hover:bg-slate-700 active:scale-95 transition flex items-center justify-center gap-1"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Vol -</span>
              </button>
              <button
                onClick={() => handleAction('volume_up')}
                className="py-2.5 rounded-xl bg-slate-800/80 text-xs font-bold text-slate-200 hover:bg-slate-700 active:scale-95 transition flex items-center justify-center gap-1"
              >
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Vol +</span>
              </button>
              <button
                onClick={() => handleAction('volume_mute')}
                className="py-2.5 rounded-xl bg-slate-800/80 text-xs font-bold text-slate-200 hover:bg-slate-700 active:scale-95 transition flex items-center justify-center gap-1"
              >
                <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                <span>Mute</span>
              </button>
              <button
                onClick={() => handleAction('media_play_pause')}
                className="py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-xs font-bold text-cyan-300 hover:bg-cyan-500/30 active:scale-95 transition flex items-center justify-center gap-1"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Play</span>
              </button>
            </div>
          </div>

          {/* Quick Launch Apps */}
          <div className="space-y-1.5">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Launch PC Apps</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleAction('open_notepad')}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 hover:border-cyan-500/30 active:scale-95 transition"
              >
                <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-xs text-white">Notepad</span>
              </button>
              <button
                onClick={() => handleAction('open_calc')}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 hover:border-cyan-500/30 active:scale-95 transition"
              >
                <Calculator className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-xs text-white">Calculator</span>
              </button>
              <button
                onClick={() => handleAction('open_explorer')}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 hover:border-cyan-500/30 active:scale-95 transition"
              >
                <Folder className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="text-xs text-white">Explorer</span>
              </button>
              <button
                onClick={() => handleAction('open_browser')}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 hover:border-cyan-500/30 active:scale-95 transition"
              >
                <Globe className="w-4 h-4 text-cyan-300 shrink-0" />
                <span className="text-xs text-white">Browser</span>
              </button>
              <button
                onClick={() => handleAction('screenshot')}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 hover:border-cyan-500/30 active:scale-95 transition"
              >
                <Camera className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-xs text-white">Screenshot</span>
              </button>
              <button
                onClick={() => handleAction('task_manager')}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 hover:border-cyan-500/30 active:scale-95 transition"
              >
                <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-white">Terminal</span>
              </button>
            </div>
          </div>

          {/* PC Companion Script Link */}
          <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">Windows LAN Companion</p>
              <p className="text-[10px] text-slate-400">Download .bat script to run on your PC</p>
            </div>
            <button
              onClick={() => {
                audioService.playCyberChime('activate');
                downloadWindowsScript(pcConfig.ip, pcConfig.port);
                triggerFeedback('Downloaded SH_AI_PC_Agent.bat');
              }}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition"
            >
              Get Script
            </button>
          </div>
        </div>
      )}

      {/* PC IP Config Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs rounded-2xl bg-slate-900 border border-cyan-500/40 p-4 space-y-3">
            <h3 className="text-sm font-bold text-white">Configure PC Wi-Fi Connection</h3>
            <div className="space-y-2">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-mono">PC IP Address</label>
                <input
                  type="text"
                  value={tempIp}
                  onChange={(e) => setTempIp(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-mono">Port</label>
                <input
                  type="text"
                  value={tempPort}
                  onChange={(e) => setTempPort(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowConfigModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  pcControlService.updateConfig({ ip: tempIp, port: parseInt(tempPort) || 5890 });
                  setShowConfigModal(false);
                  triggerFeedback(`Connected to ${tempIp}:${tempPort}`);
                }}
                className="flex-1 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
              >
                Save & Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
