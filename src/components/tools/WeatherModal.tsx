import React, { useState } from 'react';
import { X, CloudSun, Wind, Droplets, Compass, Thermometer } from 'lucide-react';

interface WeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WeatherModal: React.FC<WeatherModalProps> = ({ isOpen, onClose }) => {
  const [city, setCity] = useState('Dhaka');

  if (!isOpen) return null;

  const weatherData: Record<string, any> = {
    Dhaka: { temp: '32°C', feel: '36°C', condition: 'Partly Cloudy', humidity: '74%', wind: '14 km/h', pressure: '1008 hPa', forecast: [
      { day: 'Today', temp: '32° / 24°', icon: '🌤️' },
      { day: 'Tomorrow', temp: '33° / 25°', icon: '☀️' },
      { day: 'Mon', temp: '31° / 23°', icon: '🌦️' },
      { day: 'Tue', temp: '30° / 22°', icon: '🌧️' },
    ]},
    Chittagong: { temp: '29°C', feel: '33°C', condition: 'Sea Breeze & Clear', humidity: '80%', wind: '22 km/h', pressure: '1010 hPa', forecast: [
      { day: 'Today', temp: '29° / 23°', icon: '🌤️' },
      { day: 'Tomorrow', temp: '30° / 24°', icon: '☀️' },
      { day: 'Mon', temp: '28° / 22°', icon: '🌧️' },
      { day: 'Tue', temp: '29° / 23°', icon: '🌦️' },
    ]},
    Sylhet: { temp: '27°C', feel: '29°C', condition: 'Light Rain', humidity: '88%', wind: '10 km/h', pressure: '1006 hPa', forecast: [
      { day: 'Today', temp: '27° / 20°', icon: '🌧️' },
      { day: 'Tomorrow', temp: '28° / 21°', icon: '🌦️' },
      { day: 'Mon', temp: '26° / 19°', icon: '🌧️' },
      { day: 'Tue', temp: '27° / 20°', icon: '🌤️' },
    ]}
  };

  const current = weatherData[city] || weatherData['Dhaka'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
      <div className="w-full max-w-sm bg-[#071322] border border-cyan-500/40 rounded-3xl p-5 shadow-[0_0_40px_rgba(56,189,248,0.25)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CloudSun className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Live Weather</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full bg-slate-900 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* City selection pills */}
        <div className="flex gap-2">
          {['Dhaka', 'Chittagong', 'Sylhet'].map((c) => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={`flex-1 py-1 text-xs font-semibold rounded-lg transition ${
                city === c ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Weather Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0c233f] to-[#061426] border border-cyan-500/30 text-center space-y-2">
          <span className="text-4xl">🌤️</span>
          <h2 className="text-3xl font-extrabold text-white">{current.temp}</h2>
          <p className="text-xs font-medium text-cyan-300">{current.condition}</p>
          <p className="text-[10px] text-slate-400">Feels like {current.feel}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
          <div className="p-2.5 rounded-xl bg-[#091524] border border-slate-800">
            <Droplets className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
            <span className="text-slate-400 block">Humidity</span>
            <span className="text-white font-bold">{current.humidity}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#091524] border border-slate-800">
            <Wind className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
            <span className="text-slate-400 block">Wind</span>
            <span className="text-white font-bold">{current.wind}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#091524] border border-slate-800">
            <Compass className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
            <span className="text-slate-400 block">Pressure</span>
            <span className="text-white font-bold">{current.pressure}</span>
          </div>
        </div>

        {/* 4-Day Forecast */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800">
          <span className="text-[11px] font-bold text-slate-400">4-Day Forecast</span>
          <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
            {current.forecast.map((f: any, idx: number) => (
              <div key={idx} className="p-2 rounded-xl bg-[#081525] border border-slate-800">
                <span className="text-slate-400 block text-[9px]">{f.day}</span>
                <span className="text-base my-0.5 block">{f.icon}</span>
                <span className="text-cyan-300 font-bold block">{f.temp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
