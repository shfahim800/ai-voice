import { AutoUpdateConfig } from '../types/assistant';

const STORAGE_KEY_UPDATE = 'sh_ai_auto_update_config';

const DEFAULT_CONFIG: AutoUpdateConfig = {
  autoCheckEnabled: true,
  silentDownloadEnabled: true,
  autoInstallOnWifi: true,
  channel: 'stable',
  installedVersion: 'v2.5.0 (Build 56)',
  pendingVersion: 'v2.6.0-PRO (iOS 26 & Wi-Fi PC Deck)',
  lastCheckedTime: 'Just now'
};

export interface UpdateRelease {
  version: string;
  buildNumber: number;
  releaseDate: string;
  channel: 'stable' | 'beta' | 'canary';
  changes: string[];
  downloadSize: string;
  isSilentApplicable: boolean;
}

export const RELEASE_CATALOG: UpdateRelease[] = [
  {
    version: 'v2.6.0-PRO',
    buildNumber: 56,
    releaseDate: 'October 2026',
    channel: 'stable',
    downloadSize: '14.8 MB',
    isSilentApplicable: true,
    changes: [
      'Wi-Fi PC Control: Full virtual trackpad, keyboard, and bidirectional file transfer',
      'Open-Source Multi-Agent Hub: Ollama, Hugging Face, OpenRouter, and custom webhooks',
      'iOS 26 Liquid Blur: Apple squircle icons, liquid glass, and dynamic dock',
      'Silent Auto-Updater: Background automatic updates with zero user friction',
      'System Telemetry & Cloud Clipboard plugins'
    ]
  },
  {
    version: 'v2.5.0-PRO',
    buildNumber: 50,
    releaseDate: 'September 2026',
    channel: 'stable',
    downloadSize: '12.4 MB',
    isSilentApplicable: true,
    changes: [
      'VoiceWave 3-mode real-time audio visualizer (Wave, Spectrum, Neural Orb)',
      'System Apps voice control in Bangla & English',
      'Cyberpunk & Glassmorphism themes engine'
    ]
  }
];

class AutoUpdateService {
  private config: AutoUpdateConfig = DEFAULT_CONFIG;
  private isChecking: boolean = false;
  private isDownloading: boolean = false;
  private downloadProgress: number = 0;
  private listeners: (() => void)[] = [];
  private notificationBanner: string | null = null;
  private autoCheckTimer: any = null;

  constructor() {
    this.load();
    this.initBackgroundDaemon();
  }

  private load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_UPDATE);
      if (stored) {
        this.config = { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
      }
    } catch {
      this.config = DEFAULT_CONFIG;
    }
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEY_UPDATE, JSON.stringify(this.config));
    } catch {}
  }

  public getConfig(): AutoUpdateConfig {
    return { ...this.config };
  }

  public updateConfig(updates: Partial<AutoUpdateConfig>) {
    this.config = { ...this.config, ...updates };
    this.save();
    this.notify();
  }

  public getNotification(): string | null {
    return this.notificationBanner;
  }

  public clearNotification() {
    this.notificationBanner = null;
    this.notify();
  }

  public getDownloadProgress(): { isDownloading: boolean; progress: number } {
    return { isDownloading: this.isDownloading, progress: this.downloadProgress };
  }

  public isUpdateAvailable(): boolean {
    return this.config.installedVersion !== this.config.pendingVersion && !!this.config.pendingVersion;
  }

  public async checkForUpdates(silent: boolean = false): Promise<boolean> {
    this.isChecking = true;
    this.notify();

    await new Promise(r => setTimeout(r, silent ? 1200 : 800));

    this.isChecking = false;
    this.config.lastCheckedTime = 'Just now';
    this.save();

    const hasNew = this.isUpdateAvailable();

    if (hasNew && this.config.silentDownloadEnabled) {
      this.triggerSilentDownload();
    } else if (hasNew && !silent) {
      this.notificationBanner = `নতুন সংস্করণ উপলব্ধ: ${this.config.pendingVersion}`;
    }

    this.notify();
    return hasNew;
  }

  public triggerSilentDownload() {
    if (this.isDownloading) return;
    this.isDownloading = true;
    this.downloadProgress = 0;
    this.notify();

    const interval = setInterval(() => {
      this.downloadProgress += 20;
      if (this.downloadProgress >= 100) {
        clearInterval(interval);
        this.isDownloading = false;
        this.downloadProgress = 100;

        // Auto install if enabled
        if (this.config.autoInstallOnWifi) {
          this.applyUpdateSilently();
        } else {
          this.notificationBanner = `আপডেট ডাউনলোড সম্পন্ন (${this.config.pendingVersion})। ইনস্টল করতে ট্যাপ করুন।`;
          this.notify();
        }
      } else {
        this.notify();
      }
    }, 400);
  }

  public applyUpdateSilently() {
    if (this.config.pendingVersion) {
      this.config.installedVersion = this.config.pendingVersion;
      this.config.pendingVersion = undefined;
      this.save();
      this.notificationBanner = `সফটওয়্যার আপডেট সফলভাবে স্বয়ংক্রিয়ভাবে প্রয়োগ করা হয়েছে! (${this.config.installedVersion})`;
      this.notify();

      setTimeout(() => {
        this.clearNotification();
      }, 6000);
    }
  }

  private initBackgroundDaemon() {
    // Run initial silent check
    if (this.config.autoCheckEnabled) {
      setTimeout(() => {
        this.checkForUpdates(true);
      }, 3000);
    }

    // Periodic silent check every 5 minutes
    if (this.autoCheckTimer) clearInterval(this.autoCheckTimer);
    this.autoCheckTimer = setInterval(() => {
      if (this.config.autoCheckEnabled) {
        this.checkForUpdates(true);
      }
    }, 5 * 60 * 1000);
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

export const autoUpdateService = new AutoUpdateService();
