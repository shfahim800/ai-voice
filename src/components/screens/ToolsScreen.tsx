import { 
  Share2,
  CloudSun, 
  Newspaper, 
  Youtube, 
  FileText, 
  Calendar as CalendarIcon, 
  CircleDollarSign, 
  QrCode, 
  Image as ImageIcon,
  ChevronRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { audioService } from '../../services/audioService';

interface ToolsScreenProps {
  onOpenTool: (toolId: string) => void;
}

export const ToolsScreen: React.FC<ToolsScreenProps> = ({ onOpenTool }) => {
  const toolsList = [
    {
      id: 'social-media',
      name: 'সোশ্যাল মিডিয়া (Social Media Hub)',
      desc: 'FB, Insta, WhatsApp, YouTube, TikTok ভয়েস কন্ট্রোল',
      icon: Share2,
      color: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/40',
      badge: 'VOICE AI'
    },
    {
      id: 'weather',
      name: 'Weather',
      desc: 'Live weather information',
      icon: CloudSun,
      color: 'text-amber-400 bg-amber-500/15 border-amber-500/30'
    },
    {
      id: 'news',
      name: 'News',
      desc: 'Latest news & updates',
      icon: Newspaper,
      color: 'text-blue-400 bg-blue-500/15 border-blue-500/30'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      desc: 'Search & play videos',
      icon: Youtube,
      color: 'text-red-400 bg-red-500/15 border-red-500/30'
    },
    {
      id: 'notes',
      name: 'Notes',
      desc: 'Create & manage notes',
      icon: FileText,
      color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30'
    },
    {
      id: 'calendar',
      name: 'Calendar',
      desc: 'Schedule & reminders',
      icon: CalendarIcon,
      color: 'text-sky-400 bg-sky-500/15 border-sky-500/30'
    },
    {
      id: 'currency',
      name: 'Currency Converter',
      desc: 'BDT ↔ Other currencies',
      icon: CircleDollarSign,
      color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30'
    },
    {
      id: 'qr',
      name: 'QR Scanner',
      desc: 'Scan QR codes',
      icon: QrCode,
      color: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30'
    },
    {
      id: 'image-gen',
      name: 'Image Generator',
      desc: 'Create AI images',
      icon: ImageIcon,
      color: 'text-purple-400 bg-purple-500/15 border-purple-500/30'
    }
  ];

  const handleClick = (id: string) => {
    audioService.playCyberChime('beep');
    onOpenTool(id);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#030712] select-none p-4 pb-20 overflow-y-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-base font-bold text-white tracking-wide">Tools</h2>
          <p className="text-[10px] text-slate-400">Useful tools for your daily life</p>
        </div>
        <button 
          onClick={() => audioService.playCyberChime()}
          className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* Tools List */}
      <div className="space-y-2">
        {toolsList.map((tool, idx) => {
          const Icon = tool.icon;
          const staircaseClass = `staircase-${(idx % 8) + 1}`;
          return (
            <div
              key={tool.id}
              onClick={() => handleClick(tool.id)}
              className={`flex items-center justify-between p-3.5 rounded-2xl bg-[#081525]/90 backdrop-blur-md border border-cyan-950 hover:border-cyan-500/40 transition duration-150 cursor-pointer shadow-sm group active:scale-[0.99] ${staircaseClass}`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${tool.color} group-hover:scale-105 transition shadow-sm`}>
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition">
                      {tool.name}
                    </h4>
                    {tool.badge && (
                      <span className="px-1.5 py-0.2 rounded-md bg-cyan-500/20 text-cyan-300 text-[9px] font-mono font-bold border border-cyan-500/40">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {tool.desc}
                  </p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
