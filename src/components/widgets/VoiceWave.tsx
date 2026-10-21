import React, { useEffect, useRef, useState } from 'react';
import { Volume2, Activity, Radio, Sparkles } from 'lucide-react';

export type VoiceWaveMode = 'wave' | 'spectrum' | 'orb';

interface VoiceWaveProps {
  isListening: boolean;
  isSpeaking: boolean;
  color?: string;
  theme?: string;
  className?: string;
  height?: number;
  sensitivity?: number;
  onDecibelChange?: (db: number) => void;
}

export const VoiceWave: React.FC<VoiceWaveProps> = ({
  isListening,
  isSpeaking,
  color = '#00f0ff',
  theme = 'cyberpunk',
  className = '',
  height = 90,
  sensitivity = 1.3,
  onDecibelChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mode, setMode] = useState<VoiceWaveMode>('wave');
  const [decibels, setDecibels] = useState<number>(-45);
  const [isMicLive, setIsMicLive] = useState<boolean>(false);
  const [frequencyPeak, setFrequencyPeak] = useState<number>(0);

  // Audio Context and Stream references
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const phaseRef = useRef<number>(0);

  // Setup Web Audio API Mic input
  useEffect(() => {
    let active = true;

    const setupMic = async () => {
      if (!isListening) {
        cleanupMic();
        return;
      }

      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setIsMicLive(false);
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });

        if (!active) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        streamRef.current = stream;
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioContextClass();
        audioCtxRef.current = audioCtx;

        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        analyser.smoothingTimeConstant = 0.8;
        analyserRef.current = analyser;

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        setIsMicLive(true);
      } catch (err) {
        // Fallback to procedural synthesis if mic is blocked in iframe/browser
        setIsMicLive(false);
      }
    };

    const cleanupMic = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        try {
          audioCtxRef.current.close();
        } catch {}
        audioCtxRef.current = null;
      }
      setIsMicLive(false);
    };

    if (isListening) {
      setupMic();
    } else {
      cleanupMic();
    }

    return () => {
      active = false;
      cleanupMic();
    };
  }, [isListening]);

  // Main Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = 32;
    const frequencyData = new Uint8Array(bufferLength);
    const timeDomainData = new Uint8Array(bufferLength);

    const render = () => {
      const width = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, width, h);

      let currentVolume = 0;
      let peakFreq = 0;

      if (isMicLive && analyserRef.current) {
        analyserRef.current.getByteFrequencyData(frequencyData);
        analyserRef.current.getByteTimeDomainData(timeDomainData);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += frequencyData[i];
          if (frequencyData[i] > peakFreq) peakFreq = frequencyData[i];
        }
        currentVolume = (sum / bufferLength) * sensitivity;
      } else if (isListening || isSpeaking) {
        // Procedural organic synth wave when mic is not accessible or AI is speaking
        phaseRef.current += isSpeaking ? 0.08 : 0.04;
        const baseMag = isSpeaking ? 160 : 90;
        for (let i = 0; i < bufferLength; i++) {
          const osc1 = Math.sin(phaseRef.current * 1.5 + i * 0.3);
          const osc2 = Math.cos(phaseRef.current * 2.1 + i * 0.5);
          const osc3 = Math.sin(phaseRef.current * 0.7 - i * 0.2);
          const val = Math.max(10, Math.min(255, (baseMag + osc1 * 40 + osc2 * 30 + osc3 * 25)));
          frequencyData[i] = val;
          timeDomainData[i] = 128 + Math.round((osc1 + osc2) * 20);
        }
        currentVolume = (baseMag * sensitivity);
        peakFreq = 180;
      } else {
        // Idle heartbeat
        phaseRef.current += 0.02;
        for (let i = 0; i < bufferLength; i++) {
          frequencyData[i] = 8 + Math.sin(phaseRef.current + i * 0.2) * 6;
          timeDomainData[i] = 128;
        }
        currentVolume = 10;
        peakFreq = 12;
      }

      // Calculate approximate dB and peak
      const dbVal = Math.round(Math.max(-60, Math.min(0, (currentVolume / 255) * 60 - 60)));
      setDecibels(dbVal);
      setFrequencyPeak(peakFreq);
      if (onDecibelChange) onDecibelChange(dbVal);

      phaseRef.current += 0.04;

      // MODE 1: FLUID SINE WAVES (Holographic Waves)
      if (mode === 'wave') {
        const centerY = h / 2;
        const waveCount = 3;
        const colors = [
          'rgba(0, 240, 255, 0.85)',
          'rgba(59, 130, 246, 0.75)',
          'rgba(168, 85, 247, 0.65)'
        ];

        for (let w = 0; w < waveCount; w++) {
          ctx.beginPath();
          ctx.lineWidth = w === 0 ? 2.5 : 1.5;
          ctx.strokeStyle = colors[w];
          ctx.shadowBlur = w === 0 ? 12 : 6;
          ctx.shadowColor = colors[w];

          const wavePhase = phaseRef.current * (1 + w * 0.4);
          const ampScale = (currentVolume / 255) * (h * 0.42) * (1 - w * 0.2);

          for (let x = 0; x <= width; x += 3) {
            const normX = x / width;
            // Envelope so wave tapers smoothly at left and right edges
            const envelope = Math.sin(normX * Math.PI);
            const freq = 3.5 + w;
            const y = centerY + Math.sin(normX * freq * Math.PI + wavePhase) * ampScale * envelope;

            if (x === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.stroke();
        }

        // Add soft gradient fill under main wave
        ctx.shadowBlur = 0;
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, 'rgba(0, 240, 255, 0.15)');
        grad.addColorStop(1, 'rgba(0, 240, 255, 0.0)');
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // MODE 2: CYBERPUNK EQUALIZER SPECTRUM
      else if (mode === 'spectrum') {
        const numBars = 24;
        const barWidth = Math.max(3, (width - (numBars * 3)) / numBars);
        const gap = 3;

        for (let i = 0; i < numBars; i++) {
          const dataIndex = Math.floor((i / numBars) * bufferLength);
          const rawVal = frequencyData[dataIndex] || 0;
          const barHeight = Math.max(4, (rawVal / 255) * (h - 16) * sensitivity);
          const x = i * (barWidth + gap) + 6;
          const y = h - barHeight - 4;

          // Gradient for bar
          const barGrad = ctx.createLinearGradient(0, y, 0, h);
          if (rawVal > 180) {
            barGrad.addColorStop(0, '#ff007f'); // Neon pink peak
            barGrad.addColorStop(0.5, '#00f0ff');
            barGrad.addColorStop(1, '#0284c7');
          } else {
            barGrad.addColorStop(0, '#00f0ff');
            barGrad.addColorStop(1, '#0c4a6e');
          }

          ctx.fillStyle = barGrad;
          ctx.shadowBlur = rawVal > 150 ? 10 : 4;
          ctx.shadowColor = '#00f0ff';
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, 3);
          ctx.fill();

          // Peak cap dot
          ctx.fillStyle = rawVal > 180 ? '#ff007f' : '#ffffff';
          ctx.beginPath();
          ctx.roundRect(x, Math.max(2, y - 4), barWidth, 2, 1);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }

      // MODE 3: RADIAL HOLOGRAPHIC ORB
      else if (mode === 'orb') {
        const centerX = width / 2;
        const centerY = h / 2;
        const baseRadius = Math.min(centerX, centerY) * 0.55;
        const numSpikes = 28;

        ctx.beginPath();
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 14;
        ctx.shadowColor = '#00f0ff';

        for (let i = 0; i < numSpikes; i++) {
          const angle = (i / numSpikes) * Math.PI * 2;
          const val = frequencyData[i % bufferLength] || 10;
          const spikeLen = (val / 255) * (baseRadius * 0.9) * sensitivity;
          const r = baseRadius + spikeLen;

          const x = centerX + Math.cos(angle) * r;
          const y = centerY + Math.sin(angle) * r;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.stroke();

        // Inner glowing core
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.2)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mode, isListening, isSpeaking, isMicLive, sensitivity]);

  return (
    <div className={`relative w-full rounded-2xl bg-gradient-to-b from-[#051122]/90 to-[#020712]/95 border border-cyan-500/30 p-2.5 shadow-[0_0_25px_rgba(0,240,255,0.15)] flex flex-col items-center ${className}`}>
      {/* Top Status & Mode Header */}
      <div className="w-full flex items-center justify-between px-1 mb-1.5 text-[10px]">
        {/* Live Audio Source Tag */}
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${
            isListening 
              ? isMicLive 
                ? 'bg-emerald-400 animate-pulse' 
                : 'bg-cyan-400 animate-pulse'
              : isSpeaking 
              ? 'bg-blue-400 animate-ping' 
              : 'bg-slate-600'
          }`} />
          <span className="font-mono font-semibold tracking-wider text-slate-300 uppercase">
            {isListening ? (isMicLive ? 'LIVE MIC' : 'AI AUDIO') : isSpeaking ? 'AI SPEAKING' : 'AUDIO STANDBY'}
          </span>
          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-mono">
            {decibels} dB
          </span>
        </div>

        {/* Mode Switcher Buttons */}
        <div className="flex items-center gap-1 bg-[#091829] p-0.5 rounded-lg border border-cyan-950">
          <button
            type="button"
            onClick={() => setMode('wave')}
            className={`px-2 py-0.5 rounded-md font-mono text-[9px] font-semibold transition cursor-pointer ${
              mode === 'wave' 
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_8px_rgba(0,240,255,0.5)]' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Wave
          </button>
          <button
            type="button"
            onClick={() => setMode('spectrum')}
            className={`px-2 py-0.5 rounded-md font-mono text-[9px] font-semibold transition cursor-pointer ${
              mode === 'spectrum' 
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_8px_rgba(0,240,255,0.5)]' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Spectrum
          </button>
          <button
            type="button"
            onClick={() => setMode('orb')}
            className={`px-2 py-0.5 rounded-md font-mono text-[9px] font-semibold transition cursor-pointer ${
              mode === 'orb' 
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_8px_rgba(0,240,255,0.5)]' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Orb
          </button>
        </div>
      </div>

      {/* Main Canvas Wave Display */}
      <div className="w-full relative flex items-center justify-center overflow-hidden rounded-xl bg-[#020814]/80 border border-cyan-950/80">
        <canvas
          ref={canvasRef}
          width={280}
          height={height}
          className="w-full block"
          style={{ height: `${height}px` }}
        />

        {/* Ambient Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
      </div>

      {/* Sub Audio Bar Indicators */}
      <div className="w-full flex items-center justify-between px-1.5 mt-1.5 text-[9px] text-slate-400 font-mono">
        <span className="flex items-center gap-1">
          <Activity className="w-3 h-3 text-cyan-400" />
          Frequency: <strong className="text-cyan-300">{(frequencyPeak * 18.5).toFixed(0)} Hz</strong>
        </span>
        <span className="text-slate-400">
          Response: <strong className="text-emerald-400">Real-time Ultra</strong>
        </span>
      </div>
    </div>
  );
};
