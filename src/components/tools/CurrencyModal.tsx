import React, { useState } from 'react';
import { X, ArrowRightLeft, CircleDollarSign } from 'lucide-react';

interface CurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CurrencyModal: React.FC<CurrencyModalProps> = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState('1000');
  const [fromCurrency, setFromCurrency] = useState('BDT');
  const [toCurrency, setToCurrency] = useState('USD');

  if (!isOpen) return null;

  // Conversion rates baseline (1 USD = ~122.50 BDT)
  const rates: Record<string, number> = {
    BDT: 1,
    USD: 0.0082,
    EUR: 0.0075,
    GBP: 0.0064,
    INR: 0.71,
    SAR: 0.031,
    AED: 0.030,
    MYR: 0.036
  };

  const parsedAmount = parseFloat(amount) || 0;
  // Convert from currency -> BDT -> target currency
  const inBDT = parsedAmount / (rates[fromCurrency] || 1);
  const result = inBDT * (rates[toCurrency] || 1);

  const swap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
      <div className="w-full max-w-sm bg-[#071322] border border-cyan-500/40 rounded-3xl p-5 shadow-[0_0_40px_rgba(56,189,248,0.25)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CircleDollarSign className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Currency Converter</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full bg-slate-900 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input amount */}
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-[#081525] border border-cyan-950 rounded-xl px-4 py-2.5 text-lg font-bold text-white focus:outline-hidden focus:border-cyan-500"
          />
        </div>

        {/* Currencies row */}
        <div className="flex items-center gap-2">
          <div className="flex-1 space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">From</label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full bg-[#081525] border border-cyan-950 rounded-xl px-3 py-2 text-xs text-white"
            >
              {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <button
            onClick={swap}
            className="mt-4 p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-900/50 transition"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          <div className="flex-1 space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">To</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full bg-[#081525] border border-cyan-950 rounded-xl px-3 py-2 text-xs text-white"
            >
              {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Result Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#06182a] to-[#0a233d] border border-cyan-500/30 text-center space-y-1">
          <span className="text-[10px] text-slate-400 block">Converted Total</span>
          <h2 className="text-2xl font-black text-cyan-300">
            {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurrency}
          </h2>
          <p className="text-[10px] text-slate-400">
            1 {fromCurrency} = {( (1 / (rates[fromCurrency] || 1)) * (rates[toCurrency] || 1) ).toFixed(4)} {toCurrency}
          </p>
        </div>
      </div>
    </div>
  );
};
