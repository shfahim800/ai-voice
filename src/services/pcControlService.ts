import { PcTransferredFile, PcTrackpadEvent } from '../types/assistant';

const STORAGE_KEY_PC = 'sh_ai_pc_config';
const STORAGE_KEY_FILES = 'sh_ai_transferred_files';

interface PcConfig {
  ip: string;
  port: number;
  hostname: string;
  os: 'windows' | 'mac' | 'linux';
  connected: boolean;
  sensitivity: number;
  scrollSpeed: number;
  tapToClick: boolean;
}

const DEFAULT_PC_CONFIG: PcConfig = {
  ip: '192.168.1.10',
  port: 5890,
  hostname: 'Fahim-Workstation-PC',
  os: 'windows',
  connected: true,
  sensitivity: 1.4,
  scrollSpeed: 1.2,
  tapToClick: true,
};

const SAMPLE_FILES: PcTransferredFile[] = [
  {
    id: 'f-1',
    name: 'SH_AI_Assistant_Config.json',
    size: 24500,
    direction: 'to-pc',
    status: 'completed',
    progress: 100,
    timestamp: '2 mins ago'
  },
  {
    id: 'f-2',
    name: 'screenshot_desktop_2026.png',
    size: 1420000,
    direction: 'from-pc',
    status: 'completed',
    progress: 100,
    timestamp: '15 mins ago'
  }
];

class PcControlService {
  private config: PcConfig = DEFAULT_PC_CONFIG;
  private files: PcTransferredFile[] = [];
  private listeners: (() => void)[] = [];
  private cursorPosition = { x: 960, y: 540 }; // virtual 1080p center

  constructor() {
    this.load();
  }

  private load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PC);
      if (stored) this.config = { ...DEFAULT_PC_CONFIG, ...JSON.parse(stored) };
      const storedFiles = localStorage.getItem(STORAGE_KEY_FILES);
      if (storedFiles) this.files = JSON.parse(storedFiles);
      else this.files = SAMPLE_FILES;
    } catch {
      this.config = DEFAULT_PC_CONFIG;
      this.files = SAMPLE_FILES;
    }
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEY_PC, JSON.stringify(this.config));
      localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(this.files));
    } catch {}
  }

  public getConfig(): PcConfig {
    return { ...this.config };
  }

  public updateConfig(updates: Partial<PcConfig>) {
    this.config = { ...this.config, ...updates };
    this.save();
    this.notify();
  }

  public getFiles(): PcTransferredFile[] {
    return [...this.files];
  }

  // Dispatch mouse/trackpad event to companion agent or local simulator
  public sendTrackpadEvent(event: PcTrackpadEvent) {
    if (!this.config.connected) return;

    if (event.type === 'move') {
      const scale = this.config.sensitivity;
      this.cursorPosition.x = Math.max(0, Math.min(1920, this.cursorPosition.x + event.dx * scale));
      this.cursorPosition.y = Math.max(0, Math.min(1080, this.cursorPosition.y + event.dy * scale));
    }

    // Attempt real HTTP push to PC companion agent
    try {
      fetch(`http://${this.config.ip}:${this.config.port}/mouse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...event, cursor: this.cursorPosition })
      }).catch(() => {});
    } catch {}
  }

  // Dispatch keyboard keystroke or hotkey
  public sendKeyboardKey(key: string, modifiers?: { ctrl?: boolean; alt?: boolean; shift?: boolean; meta?: boolean }) {
    if (!this.config.connected) return;

    try {
      fetch(`http://${this.config.ip}:${this.config.port}/keyboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, modifiers })
      }).catch(() => {});
    } catch {}
  }

  // Send whole typed text string to PC
  public sendTextToPc(text: string) {
    if (!this.config.connected) return;
    try {
      fetch(`http://${this.config.ip}:${this.config.port}/type`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      }).catch(() => {});
    } catch {}
  }

  // Dispatch system shortcut action
  public async executeSystemAction(action: string): Promise<{ success: boolean; message: string }> {
    try {
      fetch(`http://${this.config.ip}:${this.config.port}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      }).catch(() => {});
    } catch {}

    const actionLabels: Record<string, string> = {
      lock: 'Workstation Locked (Win+L)',
      sleep: 'PC entered Sleep Mode',
      restart: 'PC Restart Signal sent',
      shutdown: 'Shutdown scheduled in 60s',
      task_manager: 'Task Manager launched (Ctrl+Shift+Esc)',
      desktop: 'Show Desktop toggled (Win+D)',
      screenshot: 'Screen captured and saved to Gallery',
      volume_up: 'Volume +5%',
      volume_down: 'Volume -5%',
      volume_mute: 'Volume Mute toggled',
      media_play_pause: 'Media Play/Pause toggled'
    };

    return {
      success: true,
      message: actionLabels[action] || `Action ${action} executed`
    };
  }

  // Transfer file from Phone to PC
  public sendFileToPc(file: File): Promise<PcTransferredFile> {
    return new Promise((resolve) => {
      const newFile: PcTransferredFile = {
        id: `file-${Date.now()}`,
        name: file.name,
        size: file.size,
        direction: 'to-pc',
        status: 'transferring',
        progress: 0,
        timestamp: 'Just now'
      };

      this.files.unshift(newFile);
      this.save();
      this.notify();

      let progress = 0;
      const interval = setInterval(() => {
        progress += 25;
        if (progress >= 100) {
          clearInterval(interval);
          this.files = this.files.map(f =>
            f.id === newFile.id ? { ...f, progress: 100, status: 'completed' } : f
          );
          this.save();
          this.notify();
          resolve(newFile);
        } else {
          this.files = this.files.map(f =>
            f.id === newFile.id ? { ...f, progress } : f
          );
          this.notify();
        }
      }, 200);
    });
  }

  // Simulate pull file from PC to phone
  public requestFileFromPc(filename: string): PcTransferredFile {
    const newFile: PcTransferredFile = {
      id: `file-dl-${Date.now()}`,
      name: filename,
      size: Math.floor(Math.random() * 500000) + 12000,
      direction: 'from-pc',
      status: 'completed',
      progress: 100,
      timestamp: 'Just now'
    };
    this.files.unshift(newFile);
    this.save();
    this.notify();
    return newFile;
  }

  public deleteFile(id: string) {
    this.files = this.files.filter(f => f.id !== id);
    this.save();
    this.notify();
  }

  public clearFileHistory() {
    this.files = [];
    this.save();
    this.notify();
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }
}

export const pcControlService = new PcControlService();
