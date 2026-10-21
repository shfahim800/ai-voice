// Battery Status Service for SH AI Assistant
// Provides both real device Web Battery API monitoring and virtual AI power simulation

export type BatteryMode = 'eco' | 'balanced' | 'turbo';

export interface BatteryState {
  level: number; // 0 - 100
  isCharging: boolean;
  chargingType: 'Fast GaN 65W' | 'Standard USB-C' | 'Wireless Qi' | 'Discharging';
  mode: BatteryMode;
  temperature: number; // in Celsius e.g. 31.4
  voltage: number; // in Volts e.g. 4.12
  health: number; // percentage e.g. 98
  healthStatus: 'Optimal' | 'Good' | 'Needs Calibration';
  estimatedMinutes: number;
  wattage: number; // e.g. 2.1W to 6.8W
  isRealApi: boolean;
  lastOptimized?: Date;
}

type Listener = (state: BatteryState) => void;

class BatteryService {
  private state: BatteryState = {
    level: 88,
    isCharging: true,
    chargingType: 'Fast GaN 65W',
    mode: 'balanced',
    temperature: 31.5,
    voltage: 4.15,
    health: 98,
    healthStatus: 'Optimal',
    estimatedMinutes: 520, // 8h 40m
    wattage: 3.4,
    isRealApi: false,
  };

  private listeners: Set<Listener> = new Set();
  private batteryManager: any = null;
  private simulationTimer: any = null;

  constructor() {
    this.initHardwareBattery();
    this.startVirtualSimulation();
  }

  private async initHardwareBattery() {
    if (typeof window !== 'undefined' && 'getBattery' in navigator) {
      try {
        const bm = await (navigator as any).getBattery();
        this.batteryManager = bm;
        this.updateFromHardware();

        bm.addEventListener('levelchange', () => this.updateFromHardware());
        bm.addEventListener('chargingchange', () => this.updateFromHardware());
      } catch {
        // Fallback to virtual simulation
      }
    }
  }

  private updateFromHardware() {
    if (!this.batteryManager) return;
    const realLevel = Math.round((this.batteryManager.level || 0.88) * 100);
    const realCharging = !!this.batteryManager.charging;

    this.state = {
      ...this.state,
      level: realLevel,
      isCharging: realCharging,
      chargingType: realCharging ? 'Fast GaN 65W' : 'Discharging',
      isRealApi: true,
      estimatedMinutes: this.calculateEstimatedMinutes(realLevel, realCharging, this.state.mode),
    };
    this.notify();
  }

  private calculateEstimatedMinutes(level: number, isCharging: boolean, mode: BatteryMode): number {
    if (isCharging) {
      const remainingPct = 100 - level;
      return Math.max(5, Math.round(remainingPct * 0.9)); // ~0.9 min per 1% on fast charge
    } else {
      const multiplier = mode === 'eco' ? 8.5 : mode === 'turbo' ? 4.2 : 6.0;
      return Math.round(level * multiplier);
    }
  }

  private startVirtualSimulation() {
    if (this.simulationTimer) clearInterval(this.simulationTimer);

    // Periodically update virtual metrics (temperature fluctuation, wattage drift, minute updates)
    this.simulationTimer = setInterval(() => {
      // Subtle realistic drift
      const tempDrift = (Math.random() - 0.48) * 0.15;
      let newTemp = Math.round((this.state.temperature + tempDrift) * 10) / 10;
      if (newTemp < 28) newTemp = 28.4;
      if (newTemp > 38) newTemp = 37.8;

      let newLevel = this.state.level;
      if (!this.state.isRealApi) {
        // slow virtual simulation step
        if (this.state.isCharging && newLevel < 100) {
          if (Math.random() > 0.7) newLevel = Math.min(100, newLevel + 1);
        } else if (!this.state.isCharging && newLevel > 1) {
          if (Math.random() > 0.85) newLevel = Math.max(1, newLevel - 1);
        }
      }

      const wattage = this.calculateWattage(this.state.mode, this.state.isCharging);
      const estMinutes = this.calculateEstimatedMinutes(newLevel, this.state.isCharging, this.state.mode);

      this.state = {
        ...this.state,
        level: newLevel,
        temperature: newTemp,
        wattage,
        estimatedMinutes: estMinutes,
      };

      this.notify();
    }, 15000);
  }

  private calculateWattage(mode: BatteryMode, isCharging: boolean): number {
    if (isCharging) return 45.0 + Math.round(Math.random() * 15 * 10) / 10;
    if (mode === 'eco') return 1.8 + Math.round(Math.random() * 0.5 * 10) / 10;
    if (mode === 'turbo') return 5.8 + Math.round(Math.random() * 1.4 * 10) / 10;
    return 3.2 + Math.round(Math.random() * 0.8 * 10) / 10;
  }

  public getState(): BatteryState {
    return { ...this.state };
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener({ ...this.state });
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener({ ...this.state });
      } catch (e) {
        console.error('Error notifying battery listener:', e);
      }
    });
  }

  public toggleCharging(): boolean {
    const newCharging = !this.state.isCharging;
    const newType = newCharging ? 'Fast GaN 65W' : 'Discharging';
    const newWattage = this.calculateWattage(this.state.mode, newCharging);
    const estMinutes = this.calculateEstimatedMinutes(this.state.level, newCharging, this.state.mode);

    this.state = {
      ...this.state,
      isCharging: newCharging,
      chargingType: newType,
      wattage: newWattage,
      estimatedMinutes: estMinutes,
      temperature: newCharging ? 33.2 : 30.8,
    };
    this.notify();
    return newCharging;
  }

  public setMode(mode: BatteryMode) {
    const wattage = this.calculateWattage(mode, this.state.isCharging);
    const estMinutes = this.calculateEstimatedMinutes(this.state.level, this.state.isCharging, mode);
    let temp = this.state.temperature;
    if (mode === 'turbo') temp = Math.max(temp, 34.2);
    if (mode === 'eco') temp = Math.min(temp, 29.8);

    this.state = {
      ...this.state,
      mode,
      wattage,
      estimatedMinutes: estMinutes,
      temperature: temp,
    };
    this.notify();
  }

  public setLevel(level: number) {
    const validLevel = Math.max(1, Math.min(100, Math.round(level)));
    const estMinutes = this.calculateEstimatedMinutes(validLevel, this.state.isCharging, this.state.mode);
    this.state = {
      ...this.state,
      level: validLevel,
      estimatedMinutes: estMinutes,
    };
    this.notify();
  }

  public optimize(): { gainedPct: number; tempDrop: number } {
    const gainedPct = this.state.level < 97 ? 2 : 0;
    const newLevel = Math.min(100, this.state.level + gainedPct);
    const tempDrop = 1.6;
    const newTemp = Math.max(28.0, Math.round((this.state.temperature - tempDrop) * 10) / 10);

    this.state = {
      ...this.state,
      level: newLevel,
      temperature: newTemp,
      health: Math.min(100, this.state.health + 1),
      lastOptimized: new Date(),
      estimatedMinutes: this.calculateEstimatedMinutes(newLevel, this.state.isCharging, this.state.mode),
    };
    this.notify();
    return { gainedPct, tempDrop };
  }
}

export const batteryService = new BatteryService();
