// System Apps Voice Control Service for SH AI Assistant
// Enables voice-controlled interaction with all phone system applications (Bangla & English)

export interface SystemApp {
  id: string;
  name: string;
  nativeName: string;
  category: 'media' | 'communication' | 'tools' | 'settings' | 'utilities';
  icon: string; // Lucide icon identifier
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  sampleCommandsBn: string[];
  sampleCommandsEn: string[];
  status: string;
}

export interface VoiceCommandResult {
  matched: boolean;
  appId?: string;
  appName?: string;
  action?: string;
  speechReply: string;
  actionPayload?: any;
}

export const SYSTEM_APPS: SystemApp[] = [
  {
    id: 'camera',
    name: 'Camera',
    nativeName: 'ক্যামেরা',
    category: 'media',
    icon: 'Camera',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/15',
    borderColor: 'border-rose-500/40',
    description: 'এইচডি ফটো, ভিডিও রেকর্ডিং ও সেলফি মোড',
    sampleCommandsBn: ['ক্যামেরা খোলো', 'ছবি তোলো', 'সেলফি ক্যামেরা', 'ভিডিও রেকর্ড করো'],
    sampleCommandsEn: ['Open Camera', 'Take a photo', 'Take selfie', 'Record video'],
    status: 'Ready (HD 4K)'
  },
  {
    id: 'flashlight',
    name: 'Flashlight',
    nativeName: 'টর্চলাইট',
    category: 'utilities',
    icon: 'Flashlight',
    color: 'text-amber-300',
    bgColor: 'bg-amber-500/15',
    borderColor: 'border-amber-500/40',
    description: 'হাই-লুমেন টর্চ ও ইমার্জেন্সি এসওএস ব্লিঙ্ক',
    sampleCommandsBn: ['টর্চলাইট অন করো', 'টর্চ জ্বালাও', 'টর্চ বন্ধ করো', 'এসওএস মোড'],
    sampleCommandsEn: ['Turn on flashlight', 'Torch on', 'Torch off', 'SOS mode'],
    status: 'Standby'
  },
  {
    id: 'gallery',
    name: 'Gallery & Photos',
    nativeName: 'গ্যালারি ও ফটো',
    category: 'media',
    icon: 'Image',
    color: 'text-sky-400',
    bgColor: 'bg-sky-500/15',
    borderColor: 'border-sky-500/40',
    description: 'অ্যালবাম, সাম্প্রতিক ফটো ও স্ক্রিনশট ভিউয়ার',
    sampleCommandsBn: ['গ্যালারি খোলো', 'ফটো দেখাও', 'স্ক্রিনশট ফোল্ডার', 'ছবি ব্রাউজ করো'],
    sampleCommandsEn: ['Open Gallery', 'Show photos', 'View screenshots', 'Open albums'],
    status: '1,420 Photos'
  },
  {
    id: 'phone',
    name: 'Phone & Dialer',
    nativeName: 'ফোন ও ডায়ালার',
    category: 'communication',
    icon: 'Phone',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/15',
    borderColor: 'border-emerald-500/40',
    description: 'ভয়েস ডায়াল, দ্রুত কল ও জরুরি হটলাইন',
    sampleCommandsBn: ['আম্মুকে কল দাও', 'ফোন ডায়ালার খোলো', '৯৯৯ এ কল করো', 'কল হিস্টোরি'],
    sampleCommandsEn: ['Call Mom', 'Open Dialer', 'Call emergency', 'Recent calls'],
    status: 'VoLTE Ready'
  },
  {
    id: 'messages',
    name: 'Messages (SMS)',
    nativeName: 'মেসেজ ও এসএমএস',
    category: 'communication',
    icon: 'MessageSquare',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/15',
    borderColor: 'border-cyan-500/40',
    description: 'ভয়েস ডিকটেশন এসএমএস ও নতুন বার্তা পাঠানো',
    sampleCommandsBn: ['মেসেজ পাঠাও', 'নতুন এসএমএস লেখো', 'মেসেজ দেখাও', 'ইনবক্স খোলো'],
    sampleCommandsEn: ['Send SMS', 'Write message', 'Read messages', 'Open inbox'],
    status: '3 Unread'
  },
  {
    id: 'contacts',
    name: 'Contacts',
    nativeName: 'কন্টাক্টস ও ফোনবুক',
    category: 'communication',
    icon: 'Users',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/15',
    borderColor: 'border-blue-500/40',
    description: 'যোগাযোগ তালিকা ও নতুন নম্বর সংরক্ষণ',
    sampleCommandsBn: ['কন্টাক্টস খোলো', 'ফোনবুক দেখাও', 'নম্বর খুঁজুন', 'নতুন কন্টাক্ট'],
    sampleCommandsEn: ['Open Contacts', 'Find contact', 'Phonebook', 'New contact'],
    status: '348 Contacts'
  },
  {
    id: 'settings',
    name: 'System Settings',
    nativeName: 'সিস্টেম সেটিংস',
    category: 'settings',
    icon: 'Settings',
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/15',
    borderColor: 'border-indigo-500/40',
    description: 'ওয়াইফাই, ব্লুটুথ, সাউন্ড, ডিসপ্লে ও হটস্পট',
    sampleCommandsBn: ['সেটিংস খোলো', 'ওয়াইফাই অন করো', 'ব্লুটুথ অন করো', 'ব্রাইটনেস বাড়াও'],
    sampleCommandsEn: ['Open Settings', 'Turn on WiFi', 'Enable Bluetooth', 'Increase brightness'],
    status: 'Android 16'
  },
  {
    id: 'clock',
    name: 'Clock & Alarm',
    nativeName: 'ঘড়ি ও অ্যালার্ম',
    category: 'tools',
    icon: 'Clock',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/15',
    borderColor: 'border-purple-500/40',
    description: 'অ্যালার্ম সেট, টাইমার, স্টপওয়াচ ও বিশ্ব ঘড়ি',
    sampleCommandsBn: ['সকাল ৭টায় অ্যালার্ম দাও', 'টাইমার ৫ মিনিট', 'স্টপওয়াচ চালু করো', 'ঘড়ি দেখাও'],
    sampleCommandsEn: ['Set alarm for 7 AM', 'Set timer 5 min', 'Start stopwatch', 'Open clock'],
    status: '2 Alarms Active'
  },
  {
    id: 'music',
    name: 'Music Player',
    nativeName: 'মিউজিক প্লেয়ার',
    category: 'media',
    icon: 'Music',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/15',
    borderColor: 'border-pink-500/40',
    description: 'অডিও প্লেয়ার, সাইবার সাউন্ডট্র্যাক ও ভলিউম কন্ট্রোল',
    sampleCommandsBn: ['গান বাজাও', 'গান থামাও', 'পরের গান', 'ভলিউম বাড়াও'],
    sampleCommandsEn: ['Play music', 'Stop music', 'Next song', 'Volume up'],
    status: 'Cyberpunk Beats'
  },
  {
    id: 'files',
    name: 'Files & Storage',
    nativeName: 'ফাইল ম্যানেজার',
    category: 'tools',
    icon: 'Folder',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/15',
    borderColor: 'border-yellow-500/40',
    description: 'ইন্টারনাল স্টোরেজ, ডাউনলোডস ও ক্যাশে ক্লিনার',
    sampleCommandsBn: ['ফাইল ম্যানেজার খোলো', 'ডাউনলোডস দেখাও', 'স্টোরেজ চেক করো', 'ক্লিন ক্যাশে'],
    sampleCommandsEn: ['Open Files', 'Show downloads', 'Check storage', 'Clean junk'],
    status: '68% Free (86 GB)'
  },
  {
    id: 'calculator',
    name: 'Calculator',
    nativeName: 'ক্যালকুলেটর',
    category: 'tools',
    icon: 'Calculator',
    color: 'text-teal-400',
    bgColor: 'bg-teal-500/15',
    borderColor: 'border-teal-500/40',
    description: 'ভয়েস ম্যাথ গণনাকারী ও সাইন্টিফিক ক্যালকুলেটর',
    sampleCommandsBn: ['ক্যালকুলেটর খোলো', 'হিসাব করো ২৫০ গুণ ১২', '৫০০০ এর ১৫% কত'],
    sampleCommandsEn: ['Open Calculator', 'Calculate 500 * 24', 'What is 15% of 5000'],
    status: 'Scientific Ready'
  },
  {
    id: 'browser',
    name: 'Web Browser',
    nativeName: 'ওয়েব ব্রাউজার',
    category: 'tools',
    icon: 'Globe',
    color: 'text-blue-300',
    bgColor: 'bg-blue-400/15',
    borderColor: 'border-blue-400/40',
    description: 'দ্রুত ইন্টারনেট সার্চ ও প্রাইভেট ব্রাউজিং',
    sampleCommandsBn: ['ব্রাউজার খোলো', 'গুগল সার্চ করো', 'ইউটিউব ওপেন করো', 'নতুন ট্যাব'],
    sampleCommandsEn: ['Open Browser', 'Search Google', 'Open YouTube', 'New tab'],
    status: 'Chrome Engine'
  },
  {
    id: 'maps',
    name: 'Maps & GPS',
    nativeName: 'ম্যাপস ও জিপিএস',
    category: 'utilities',
    icon: 'MapPin',
    color: 'text-emerald-300',
    bgColor: 'bg-emerald-400/15',
    borderColor: 'border-emerald-400/40',
    description: 'টার্ন বাই টার্ন নেভিগেশন ও নিকটবর্তী স্থানসমূহ',
    sampleCommandsBn: ['ম্যাপ খোলো', 'আমার বর্তমান লোকেশন', 'নিকটস্থ এটিএম', 'হাসপাতাল খুঁজে দাও'],
    sampleCommandsEn: ['Open Maps', 'My location', 'Find nearby hospital', 'Directions'],
    status: 'GPS Locked'
  },
  {
    id: 'notes',
    name: 'Notes & Voice Memo',
    nativeName: 'নোটস ও মেমো',
    category: 'utilities',
    icon: 'FileText',
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/15',
    borderColor: 'border-violet-500/40',
    description: 'ভয়েস ডিকটেশন নোটপ্যাড ও আইডিয়া লকার',
    sampleCommandsBn: ['নোট লেখো', 'ভয়েস মেমো রেকর্ড করো', 'নোটস দেখাও', 'আজকের কাজের তালিকা'],
    sampleCommandsEn: ['Take a note', 'Record voice memo', 'Open notes', 'Todo list'],
    status: '12 Notes Saved'
  },
  {
    id: 'monitor',
    name: 'System RAM Booster',
    nativeName: 'র‍্যাম ও সিস্টেম অপ্টিমাইজার',
    category: 'settings',
    icon: 'Cpu',
    color: 'text-cyan-300',
    bgColor: 'bg-cyan-500/15',
    borderColor: 'border-cyan-500/40',
    description: 'সিপিইউ স্পিড, ব্যাকগ্রাউন্ড কিল ও মেমোরি কুলিং',
    sampleCommandsBn: ['র‍্যাম ক্লিন করো', 'ফোন বুস্ট করো', 'সিস্টেম স্ট্যাটাস', 'মেমোরি ফ্রি করো'],
    sampleCommandsEn: ['Boost RAM', 'Clean background memory', 'System status', 'Cool down CPU'],
    status: 'RAM: 3.8/8 GB'
  }
];

class SystemAppsService {
  private torchOn: boolean = false;
  private videoTrack: MediaStreamTrack | null = null;
  private wifiOn: boolean = true;
  private bluetoothOn: boolean = true;
  private volumeLevel: number = 85;
  private brightnessLevel: number = 90;
  private alarms: string[] = ['07:00 AM', '09:30 PM'];

  // Match voice query against system apps and actions
  processVoiceCommand(transcript: string, lang: string = 'bn-BD'): VoiceCommandResult {
    const raw = transcript.trim().toLowerCase();
    const isBn = lang.startsWith('bn') || /[\u0980-\u09FF]/.test(raw);

    // 1. Flashlight / Torch
    if (
      raw.includes('torch') || 
      raw.includes('flashlight') || 
      raw.includes('টর্চ') || 
      raw.includes('ফ্ল্যাশ') || 
      raw.includes('বাতি') || 
      raw.includes('আলো')
    ) {
      const turnOff = raw.includes('off') || raw.includes('বন্ধ') || raw.includes('নিভাও');
      const isSos = raw.includes('sos') || raw.includes('এসওএস');
      
      if (turnOff) {
        this.torchOn = false;
        return {
          matched: true,
          appId: 'flashlight',
          appName: 'Flashlight',
          action: 'torch_off',
          speechReply: isBn ? 'টর্চলাইট বন্ধ করা হয়েছে।' : 'Flashlight turned off.'
        };
      } else if (isSos) {
        this.torchOn = true;
        return {
          matched: true,
          appId: 'flashlight',
          appName: 'Flashlight',
          action: 'torch_sos',
          speechReply: isBn ? 'জরুরি এসওএস টর্চ ব্লিঙ্কিং চালু করা হয়েছে।' : 'Emergency SOS strobe activated.'
        };
      } else {
        this.torchOn = true;
        return {
          matched: true,
          appId: 'flashlight',
          appName: 'Flashlight',
          action: 'torch_on',
          speechReply: isBn ? 'টর্চলাইট জ্বালানো হয়েছে।' : 'Flashlight turned on.'
        };
      }
    }

    // 2. Camera
    if (
      raw.includes('camera') || 
      raw.includes('ক্যামেরা') || 
      raw.includes('ছবি তোল') || 
      raw.includes('photo') || 
      raw.includes('selfie') || 
      raw.includes('সেলফি') || 
      raw.includes('video') || 
      raw.includes('ভিডিও')
    ) {
      const isSelfie = raw.includes('selfie') || raw.includes('সেলফি');
      return {
        matched: true,
        appId: 'camera',
        appName: 'Camera',
        action: isSelfie ? 'open_selfie' : 'open_camera',
        speechReply: isBn 
          ? (isSelfie ? 'সেলফি ক্যামেরা চালু করা হচ্ছে...' : 'ক্যামেরা চালু করা হচ্ছে...') 
          : (isSelfie ? 'Opening front selfie camera...' : 'Opening system camera...')
      };
    }

    // 3. Calculator / Math calculation
    if (
      raw.includes('calculator') || 
      raw.includes('ক্যালকুলেটর') || 
      raw.includes('হিসাব') || 
      raw.includes('calculate') ||
      raw.includes('যোগ') || 
      raw.includes('গুণ') || 
      raw.includes('ভাগ')
    ) {
      // Check for quick math expression
      const mathMatch = raw.match(/(\d+)\s*([\+\-\*\/xXগুণযোগভাগবিয়োগ])\s*(\d+)/);
      if (mathMatch) {
        const n1 = parseInt(mathMatch[1], 10);
        const op = mathMatch[2];
        const n2 = parseInt(mathMatch[3], 10);
        let res = 0;
        if (op === '+' || op === 'যোগ') res = n1 + n2;
        else if (op === '-' || op === 'বিয়োগ') res = n1 - n2;
        else if (op === '*' || op === 'x' || op === 'X' || op === 'গুণ') res = n1 * n2;
        else if (op === '/' || op === 'ভাগ') res = n2 !== 0 ? Math.round((n1 / n2) * 100) / 100 : 0;

        return {
          matched: true,
          appId: 'calculator',
          appName: 'Calculator',
          action: 'math_result',
          actionPayload: { expression: `${n1} ${op} ${n2}`, result: res },
          speechReply: isBn ? `গণনার ফলাফল হলো ${res}।` : `The answer is ${res}.`
        };
      }

      return {
        matched: true,
        appId: 'calculator',
        appName: 'Calculator',
        action: 'open_calculator',
        speechReply: isBn ? 'ক্যালকুলেটর ওপেন করা হচ্ছে...' : 'Opening calculator...'
      };
    }

    // 4. Phone & Dialer / Call
    if (
      raw.includes('call') || 
      raw.includes('কল') || 
      raw.includes('dial') || 
      raw.includes('ডায়াল') || 
      raw.includes('phone') || 
      raw.includes('ফোন')
    ) {
      let target = 'Dialer';
      if (raw.includes('mom') || raw.includes('আম্মু') || raw.includes('মা')) target = 'Mom (আম্মু)';
      else if (raw.includes('dad') || raw.includes('আব্বু') || raw.includes('বাবা')) target = 'Dad (আব্বু)';
      else if (raw.includes('999') || raw.includes('জরুরি') || raw.includes('police')) target = 'Emergency 999';

      return {
        matched: true,
        appId: 'phone',
        appName: 'Phone & Dialer',
        action: 'open_dialer',
        actionPayload: { contact: target },
        speechReply: isBn ? `${target}-এ কল করার ডায়ালার খোলা হচ্ছে...` : `Opening phone dialer for ${target}...`
      };
    }

    // 5. Messages / SMS
    if (
      raw.includes('message') || 
      raw.includes('মেসেজ') || 
      raw.includes('sms') || 
      raw.includes('বার্তা')
    ) {
      return {
        matched: true,
        appId: 'messages',
        appName: 'Messages',
        action: 'open_messages',
        speechReply: isBn ? 'মেসেজ অ্যাপ চালু করা হচ্ছে।' : 'Opening Messages app.'
      };
    }

    // 6. Gallery / Photos
    if (
      raw.includes('gallery') || 
      raw.includes('গ্যালারি') || 
      raw.includes('photos') || 
      raw.includes('ছবি দেখাও') || 
      raw.includes('স্ক্রিনশট')
    ) {
      return {
        matched: true,
        appId: 'gallery',
        appName: 'Gallery & Photos',
        action: 'open_gallery',
        speechReply: isBn ? 'ফটো গ্যালারি ওপেন করা হচ্ছে...' : 'Opening photos gallery...'
      };
    }

    // 7. Music Player
    if (
      raw.includes('music') || 
      raw.includes('গান') || 
      raw.includes('audio') || 
      raw.includes('প্লেয়ার') || 
      raw.includes('play song')
    ) {
      const stop = raw.includes('stop') || raw.includes('থামাও') || raw.includes('pause');
      return {
        matched: true,
        appId: 'music',
        appName: 'Music Player',
        action: stop ? 'pause_music' : 'play_music',
        speechReply: isBn 
          ? (stop ? 'মিউজিক থামানো হয়েছে।' : 'সাইবার সাউন্ডট্র্যাক বাজানো হচ্ছে...') 
          : (stop ? 'Music stopped.' : 'Playing music player...')
      };
    }

    // 8. Alarm & Clock
    if (
      raw.includes('alarm') || 
      raw.includes('অ্যালার্ম') || 
      raw.includes('clock') || 
      raw.includes('ঘড়ি') || 
      raw.includes('timer') || 
      raw.includes('টাইমার') || 
      raw.includes('stopwatch') || 
      raw.includes('স্টপওয়াচ')
    ) {
      return {
        matched: true,
        appId: 'clock',
        appName: 'Clock & Alarm',
        action: 'open_clock',
        speechReply: isBn ? 'ঘড়ি ও অ্যালার্ম খোলা হচ্ছে।' : 'Opening clock and alarm...'
      };
    }

    // 9. RAM Booster / Clean Cache
    if (
      raw.includes('ram') || 
      raw.includes('র‍্যাম') || 
      raw.includes('clean') || 
      raw.includes('ক্লিন') || 
      raw.includes('boost') || 
      raw.includes('বুস্ট') || 
      raw.includes('মেমোরি')
    ) {
      return {
        matched: true,
        appId: 'monitor',
        appName: 'RAM Booster',
        action: 'boost_ram',
        speechReply: isBn ? 'সিস্টেম র‍্যাম ও ব্যাকগ্রাউন্ড ক্যাশে ক্লিন করা হচ্ছে...' : 'Optimizing system RAM and clearing background cache...'
      };
    }

    // 10. Settings & WiFi / Bluetooth
    if (
      raw.includes('setting') || 
      raw.includes('সেটিংস') || 
      raw.includes('wifi') || 
      raw.includes('ওয়াইফাই') || 
      raw.includes('bluetooth') || 
      raw.includes('ব্লুটুথ') || 
      raw.includes('brightness') || 
      raw.includes('ব্রাইটনেস')
    ) {
      return {
        matched: true,
        appId: 'settings',
        appName: 'System Settings',
        action: 'open_settings',
        speechReply: isBn ? 'সিস্টেম সেটিংস প্যানেল খোলা হচ্ছে...' : 'Opening system settings panel...'
      };
    }

    // 11. Maps & Navigation
    if (
      raw.includes('map') || 
      raw.includes('ম্যাপ') || 
      raw.includes('gps') || 
      raw.includes('location') || 
      raw.includes('লোকেশন') || 
      raw.includes('রাস্তা')
    ) {
      return {
        matched: true,
        appId: 'maps',
        appName: 'Maps & GPS',
        action: 'open_maps',
        speechReply: isBn ? 'জিপিএস ম্যাপ ও নেভিগেশন ওপেন করা হচ্ছে...' : 'Opening maps and GPS navigation...'
      };
    }

    // 12. Notes & Voice Memo
    if (
      raw.includes('note') || 
      raw.includes('নোট') || 
      raw.includes('memo') || 
      raw.includes('মেমো') || 
      raw.includes('রেকর্ড')
    ) {
      return {
        matched: true,
        appId: 'notes',
        appName: 'Notes & Memo',
        action: 'open_notes',
        speechReply: isBn ? 'নোটপ্যাড ওপেন করা হচ্ছে...' : 'Opening notepad...'
      };
    }

    // 13. Files
    if (
      raw.includes('file') || 
      raw.includes('ফাইল') || 
      raw.includes('storage') || 
      raw.includes('স্টোরেজ') || 
      raw.includes('download')
    ) {
      return {
        matched: true,
        appId: 'files',
        appName: 'Files & Storage',
        action: 'open_files',
        speechReply: isBn ? 'ফাইল ম্যানেজার খোলা হচ্ছে...' : 'Opening system file manager...'
      };
    }

    // 14. Browser
    if (
      raw.includes('browser') || 
      raw.includes('ব্রাউজার') || 
      raw.includes('google') || 
      raw.includes('গুগল') || 
      raw.includes('youtube') || 
      raw.includes('ইউটিউব') || 
      raw.includes('search') || 
      raw.includes('সার্চ')
    ) {
      return {
        matched: true,
        appId: 'browser',
        appName: 'Web Browser',
        action: 'open_browser',
        speechReply: isBn ? 'ওয়েব ব্রাউজার ওপেন করা হচ্ছে...' : 'Opening web browser...'
      };
    }

    // 15. Contacts
    if (
      raw.includes('contact') || 
      raw.includes('কন্টাক্ট') || 
      raw.includes('ফোনবুক') || 
      raw.includes('নম্বর')
    ) {
      return {
        matched: true,
        appId: 'contacts',
        appName: 'Contacts',
        action: 'open_contacts',
        speechReply: isBn ? 'কন্টাক্টস ফোনবুক ওপেন করা হচ্ছে...' : 'Opening contacts list...'
      };
    }

    return {
      matched: false,
      speechReply: ''
    };
  }

  // Flashlight Hardware Web Toggle (MediaStreamTrack Torch where supported)
  async toggleTorch(forceState?: boolean): Promise<boolean> {
    const newState = forceState !== undefined ? forceState : !this.torchOn;
    this.torchOn = newState;

    try {
      if (newState && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        const track = stream.getVideoTracks()[0];
        const capabilities: any = track.getCapabilities ? track.getCapabilities() : {};
        if (capabilities.torch) {
          await (track as any).applyConstraints({
            advanced: [{ torch: true }]
          });
          this.videoTrack = track;
        }
      } else if (!newState && this.videoTrack) {
        this.videoTrack.stop();
        this.videoTrack = null;
      }
    } catch (e) {
      // In web/desktop environment, visual flashlight fallback is active
    }

    return this.torchOn;
  }

  isTorchOn(): boolean {
    return this.torchOn;
  }

  getSystemStatus() {
    return {
      torch: this.torchOn,
      wifi: this.wifiOn,
      bluetooth: this.bluetoothOn,
      volume: this.volumeLevel,
      brightness: this.brightnessLevel,
      alarms: this.alarms
    };
  }

  setWifi(on: boolean) { this.wifiOn = on; }
  setBluetooth(on: boolean) { this.bluetoothOn = on; }
  setVolume(vol: number) { this.volumeLevel = vol; }
  setBrightness(b: number) { this.brightnessLevel = b; }
}

export const systemAppsService = new SystemAppsService();
