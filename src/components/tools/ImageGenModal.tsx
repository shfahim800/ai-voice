import React, { useState } from 'react';
import { X, Sparkles, Image as ImageIcon, Loader2, Download } from 'lucide-react';

interface ImageGenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImageGenModal: React.FC<ImageGenModalProps> = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState('Cyberpunk personal AI assistant avatar in neon blue aesthetic');
  const [loading, setLoading] = useState(false);
  const [generatedImg, setGeneratedImg] = useState<string | null>('/icon.svg');

  if (!isOpen) return null;

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setGeneratedImg('/icon.svg');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
      <div className="w-full max-w-sm bg-[#071322] border border-cyan-500/40 rounded-3xl p-5 shadow-[0_0_40px_rgba(56,189,248,0.25)] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-white">AI Image Generator</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full bg-slate-900 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Prompt Input */}
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={2}
            className="w-full bg-[#081525] border border-cyan-950 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-cyan-500"
          />
        </div>

        {/* Preset tags */}
        <div className="flex gap-1.5 flex-wrap">
          {['Cyberpunk AI', 'Futuristic Robot', 'Sci-fi UI', 'Bangla Art'].map((tag) => (
            <button
              key={tag}
              onClick={() => setPrompt(`${tag} style 8k render glowing cyan`)}
              className="text-[10px] bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-300 px-2.5 py-1 rounded-full"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Preview image */}
        <div className="w-full h-48 rounded-2xl bg-black border border-cyan-500/30 flex items-center justify-center overflow-hidden relative">
          {loading ? (
            <div className="flex flex-col items-center gap-2 text-cyan-400">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs">Generating neural visuals...</span>
            </div>
          ) : generatedImg ? (
            <img src={generatedImg} alt="AI Generated" className="w-36 h-36 object-contain" />
          ) : (
            <ImageIcon className="w-12 h-12 text-slate-700" />
          )}
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:brightness-110 active:scale-95 transition"
        >
          <Sparkles className="w-4 h-4" />
          <span>{loading ? 'Synthesizing...' : 'Generate AI Image'}</span>
        </button>
      </div>
    </div>
  );
};
