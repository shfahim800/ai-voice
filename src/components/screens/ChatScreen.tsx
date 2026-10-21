import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Settings, 
  Info, 
  Send, 
  Mic, 
  Volume2, 
  CloudSun, 
  Smartphone, 
  CheckCheck,
  Sparkles,
  Loader2
} from 'lucide-react';
import { ChatMessage, ScreenType } from '../../types/assistant';
import { askAssistantAI } from '../../services/geminiService';
import { audioService } from '../../services/audioService';

interface ChatScreenProps {
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
  apiKey?: string;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ onBack, onNavigate, apiKey }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'user',
      text: 'আজকের আবহাওয়া কেমন?',
      timestamp: '09:41',
      language: 'bn'
    },
    {
      id: 'm2',
      sender: 'assistant',
      text: 'আজ ঢাকা বিভাগের আবহাওয়া সাধারণত পরিষ্কার থাকবে। তাপমাত্রা ৩২°C, আর্দ্রতা ৭৪% এবং আকাশ আংশিক মেঘলা থাকবে।',
      timestamp: '09:41',
      language: 'bn',
      widgetType: 'weather',
      widgetData: {
        location: 'Dhaka',
        condition: 'Partly Cloudy',
        temp: '32°C / 24°C',
        humidity: '74%'
      }
    },
    {
      id: 'm3',
      sender: 'user',
      text: 'আমাকে একটি ভালো মোবাইল সাজেস্ট করো বাজেট ২০-২৫ হাজার টাকা।',
      timestamp: '09:42',
      language: 'bn'
    },
    {
      id: 'm4',
      sender: 'assistant',
      text: 'আপনার বাজেটের মধ্যে সেরা অপশন হতে পারে:',
      timestamp: '09:42',
      language: 'bn',
      widgetType: 'product',
      widgetData: {
        name: 'Samsung Galaxy A55 5G',
        specs: [
          '8GB RAM | 256GB Storage',
          '50MP OIS Camera',
          '5G Support',
          'One UI (Long Update Support)'
        ]
      }
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    audioService.playCyberChime('beep');
    setInput('');

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: timeStr,
      language: /[\u0980-\u09FF]/.test(text) ? 'bn' : 'en'
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await askAssistantAI(text, apiKey);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        timestamp: timeStr,
        language: /[\u0980-\u09FF]/.test(response.text) ? 'bn' : 'en',
        widgetType: response.widgetType,
        widgetData: response.widgetData
      };
      setMessages((prev) => [...prev, aiMsg]);
      audioService.playCyberChime('success');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      audioService.stopListening();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    const activeLang = audioService.getConfig().selectedLanguage;
    audioService.startListening(
      (transcript) => {
        setInput(transcript);
      },
      (error) => {
        console.warn('Voice error:', error);
        setIsListening(false);
      },
      activeLang
    );
  };

  const handleSpeak = (text: string, lang?: string) => {
    audioService.speak(text, lang);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#030712] select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#050b14]/90 backdrop-blur-md border-b border-cyan-950/60 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-cyan-400 active:scale-95 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">Chat</h2>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.2 rounded-full font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                AI Agent
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={() => onNavigate('voice-settings')}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-cyan-400 transition"
            title="Voice & Multi-Language Settings"
          >
            <Info className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onNavigate('ai-settings')}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-cyan-400 transition"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div 
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}
            >
              {/* Message Bubble */}
              <div 
                className={`relative px-4 py-3 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                  isUser 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-br-xs shadow-[0_2px_12px_rgba(37,99,235,0.3)]'
                    : 'bg-[#081728] border border-cyan-500/30 text-slate-200 rounded-bl-xs shadow-[0_2px_12px_rgba(8,47,73,0.3)]'
                }`}
              >
                {/* Assistant avatar indicator */}
                {!isUser && (
                  <div className="flex items-center gap-1.5 mb-1.5 text-cyan-400 font-bold text-[10px]">
                    <Sparkles className="w-3 h-3" />
                    <span>SH AI</span>
                  </div>
                )}

                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Weather Widget Card */}
                {msg.widgetType === 'weather' && msg.widgetData && (
                  <div className="mt-3 p-3 rounded-xl bg-[#030d1a] border border-cyan-500/40 flex items-center justify-between gap-3 shadow-inner">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                        <CloudSun className="w-6 h-6 stroke-[2]" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{msg.widgetData.location}</h4>
                        <p className="text-[10px] text-slate-400">{msg.widgetData.condition}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-cyan-300 block">{msg.widgetData.temp}</span>
                      <span className="text-[10px] text-slate-400">Humidity: {msg.widgetData.humidity}</span>
                    </div>
                  </div>
                )}

                {/* Mobile Product Card */}
                {msg.widgetType === 'product' && msg.widgetData && (
                  <div className="mt-3 p-3 rounded-xl bg-[#030d1a] border border-cyan-500/40 space-y-2 shadow-inner">
                    <div className="flex items-center gap-2 text-white font-bold text-xs">
                      <Smartphone className="w-4 h-4 text-cyan-400" />
                      <span>{msg.widgetData.name}</span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-slate-300 pl-1">
                      {msg.widgetData.specs.map((spec: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Bottom row: timestamp & speak button */}
                <div className="flex items-center justify-end gap-2 mt-1.5 pt-1 text-[10px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button 
                      onClick={() => handleSpeak(msg.text, msg.language)}
                      className="hover:text-cyan-300 p-0.5 rounded transition"
                      title="Speak message"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {isUser && <CheckCheck className="w-3 h-3 text-cyan-200" />}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-cyan-400 text-xs py-2 px-3 bg-[#081728] border border-cyan-500/20 rounded-xl w-fit">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>SH AI লিখছে / thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="px-3 py-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-t border-slate-900 bg-[#040913]">
        <button 
          onClick={() => handleSend('আজকের আবহাওয়া কেমন?')}
          className="shrink-0 text-[11px] bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 px-2.5 py-1 rounded-full transition"
        >
          🌤️ ঢাকার আবহাওয়া
        </button>
        <button 
          onClick={() => handleSend('আমাকে একটি ভালো মোবাইল সাজেস্ট করো বাজেট ২০-২৫ হাজার টাকা।')}
          className="shrink-0 text-[11px] bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 px-2.5 py-1 rounded-full transition"
        >
          📱 বাজেট মোবাইল
        </button>
        <button 
          onClick={() => handleSend('Open Notepad on my Windows PC')}
          className="shrink-0 text-[11px] bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 px-2.5 py-1 rounded-full transition"
        >
          💻 Open Notepad
        </button>
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-[#050b14] border-t border-cyan-950/80 flex items-center gap-2">
        <button
          onClick={handleVoiceInput}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition shrink-0 ${
            isListening 
              ? 'bg-rose-600 text-white animate-pulse shadow-[0_0_12px_#e11d48]' 
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40'
          }`}
          title={isListening ? 'Listening...' : 'Voice Input'}
        >
          <Mic className="w-4 h-4" />
        </button>

        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isListening ? 'শুনছি... কথা বলুন...' : 'Type a message... (Bangla or English)'}
            className="w-full bg-[#091524] border border-cyan-950 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30"
          />
        </div>

        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(56,189,248,0.4)] active:scale-95 transition shrink-0"
          title="Send message"
        >
          <Send className="w-4 h-4 -ml-0.5" />
        </button>
      </div>
    </div>
  );
};
