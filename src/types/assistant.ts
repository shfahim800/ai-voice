export type ScreenType = 
  | 'splash'
  | 'home'
  | 'chat'
  | 'voice'
  | 'system-apps'
  | 'social-media'
  | 'voice-settings'
  | 'appearance'
  | 'security-permissions'
  | 'software-update'
  | 'plugins'
  | 'pc-control'
  | 'tools'
  | 'ai-settings'
  | 'api-hub'
  | 'settings'
  | 'connected-devices';

export type AppTheme = 
  | 'ios-26-liquid'
  | 'ios-blur' 
  | 'ios-glass-clear'
  | 'glassmorphism-dark'
  | 'glassmorphism-aurora'
  | 'cyberpunk-neon' 
  | 'cyberpunk-dark' 
  | 'cyberpunk-red'
  | 'cyberpunk-synthwave'
  | 'matrix-green'
  | 'oled-black';

export type AIProvider = 'gemini' | 'openai' | 'ollama' | 'huggingface' | 'openrouter' | 'custom-agent' | 'groq';

export type VoicePresetId = 
  | 'friday-420' 
  | 'friday-stark' 
  | 'jarvis' 
  | 'bangla-shaila' 
  | 'cyber-siri' 
  | 'kids-buddy';

export type AgeProfile = 'child' | 'teen' | 'adult' | 'senior';

export interface TimeGreeting {
  period: 'morning' | 'afternoon' | 'evening' | 'night';
  periodBn: string;
  greetingBn: string;
  greetingEn: string;
  suggestionBn: string;
  icon: string;
}

export interface VoicePreset {
  id: VoicePresetId;
  name: string;
  nameBn: string;
  badge: string;
  persona: string;
  wakeWord: string;
  wakeWordBn: string;
  defaultRate: number;
  defaultPitch: number;
  gender: 'female' | 'male' | 'neural';
  description: string;
  descriptionBn: string;
  previewSample: string;
  accentGlow: string;
  isPopular?: boolean;
}

export interface VoiceLanguageOption {
  code: string;
  shortCode: string;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
  sampleGreeting: string;
  accents?: { code: string; label: string }[];
}

export interface VoiceConfig {
  selectedLanguage: string; // e.g. 'bn-BD', 'en-US', etc.
  autoDetectLanguage: boolean;
  speechRate: number; // 0.75 - 1.5
  speechPitch: number; // 0.8 - 1.3
  voiceGender: 'female' | 'male' | 'neural';
  wakeWordEnabled: boolean;
  wakeWordPhrase: string;
  noiseSuppression: boolean;
  offlineVoiceModel: boolean;
  presetId?: VoicePresetId;
  ageProfile?: AgeProfile;
  backgroundListening?: boolean;
  timeGreetingEnabled?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  language?: 'bn' | 'en' | string;
  widgetType?: 'weather' | 'product' | 'pc-action' | 'notes';
  widgetData?: any;
}

export interface PluginItem {
  id: string;
  name: string;
  description: string;
  iconName: string;
  enabled: boolean;
  category: 'core' | 'tools' | 'system';
}

export interface PcCommand {
  id: string;
  name: string;
  description: string;
  iconName: string;
  command: string;
  requiresConfirm?: boolean;
}

export interface AssistantSettings {
  userName: string;
  language: 'bn' | 'en' | string;
  provider: AIProvider;
  model: string;
  temperature: number;
  apiKey: string;
  voiceGender: 'female' | 'male' | 'neural';
  wakeWordEnabled: boolean;
  hapticFeedback: boolean;
  pcIpAddress: string;
  pcPort: number;
  pcConnected: boolean;
  phoneConnected: boolean;
  theme: AppTheme;
  voiceConfig?: VoiceConfig;
}

export interface PcTrackpadEvent {
  dx: number;
  dy: number;
  type: 'move' | 'click' | 'right_click' | 'scroll' | 'drag';
}

export interface PcTransferredFile {
  id: string;
  name: string;
  size: number;
  direction: 'to-pc' | 'from-pc';
  status: 'pending' | 'transferring' | 'completed' | 'failed';
  progress: number;
  timestamp: string;
  dataUrl?: string;
}

export interface AgentEndpointConfig {
  id: string;
  name: string;
  type: 'ollama' | 'huggingface' | 'openrouter' | 'custom-agent' | 'groq' | 'gemini' | 'openai';
  endpointUrl: string;
  apiKey?: string;
  model: string;
  enabled: boolean;
  isOnline?: boolean;
  latencyMs?: number;
  systemPrompt?: string;
}

export interface AutoUpdateConfig {
  autoCheckEnabled: boolean;
  silentDownloadEnabled: boolean;
  autoInstallOnWifi: boolean;
  channel: 'stable' | 'beta' | 'canary';
  lastCheckedTime?: string;
  installedVersion: string;
  pendingVersion?: string;
}
