import React, { useState } from 'react';
import { X, QrCode, Scan, Camera, Copy, CheckCircle2 } from 'lucide-react';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({ isOpen, onClose }) => {
  const [scanning, setScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleStartScan = () => {
    setScanning(true);
    setScannedResult(null);

    // Simulate laser scanning animation and decode
    setTimeout(() => {
      setScanning(false);
      setScannedResult('https://github.com/shfahim/sh-ai-assistant');
    }, 2000);
  };

  const handleCopy = () => {
    if (scannedResult) {
      navigator.clipboard.writeText(scannedResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
      <div className="w-full max-w-sm bg-[#071322] border border-cyan-500/40 rounded-3xl p-5 shadow-[0_0_40px_rgba(56,189,248,0.25)] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">QR Code Scanner</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full bg-slate-900 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewfinder area */}
        <div className="relative w-full h-56 rounded-2xl bg-black border border-cyan-500/40 overflow-hidden flex items-center justify-center">
          {/* Laser scan line */}
          {scanning && (
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#38bdf8] animate-bounce"></div>
          )}

          {/* Corner brackets */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-400"></div>
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-400"></div>
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-cyan-400"></div>
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-400"></div>

          {/* Center Graphic */}
          <div className="flex flex-col items-center gap-2 text-slate-500">
            <Scan className="w-16 h-16 stroke-1 text-cyan-500/40 animate-pulse" />
            <span className="text-[11px] text-slate-400">
              {scanning ? 'Aligning and decoding...' : 'Ready to scan QR code'}
            </span>
          </div>
        </div>

        {scannedResult ? (
          <div className="p-3 bg-[#081525] border border-emerald-500/40 rounded-xl space-y-2">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Decoded URL:</span>
            <div className="flex items-center justify-between text-xs font-mono text-cyan-300 break-all bg-black/40 p-2 rounded-lg">
              <span>{scannedResult}</span>
              <button onClick={handleCopy} className="ml-2 text-slate-400 hover:text-white shrink-0">
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <button
              onClick={handleStartScan}
              className="w-full py-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Scan Another
            </button>
          </div>
        ) : (
          <button
            onClick={handleStartScan}
            disabled={scanning}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:brightness-110 active:scale-95 transition"
          >
            <Camera className="w-4 h-4" />
            <span>{scanning ? 'Scanning...' : 'Simulate Camera Scan'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
