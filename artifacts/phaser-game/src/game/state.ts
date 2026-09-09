// Player progress state, ported from the useWallet/useEnergy hooks and the
// PersistedProgress persistence block in artifacts/prison-life/src/App.tsx
// (GameShell). Phaser has no React render cycle, so the reactive
// setState-based hooks become a plain mutable class instead - callers just
// read the fields directly after calling a mutator, and redraw whatever UI
// they own.
//
// Shares localStorage with the prison-life app (same PROGRESS_STORAGE_KEY),
// since both apps track the same player. save() merges into whatever is
// already stored rather than overwriting it outright, so fields this class
// doesn't know about yet (equipped items, cell upgrades, etc. - not ported
// here yet) survive being written from this app.

const PROGRESS_STORAGE_KEY = 'prison-life-progress';
const CREATOR_STORAGE_KEY = 'prison-life-creator';

const ENERGY_MAX = 100;
const ENERGY_REGEN_MS = 5 * 60 * 1000;

function startOfLocalDay(ts: number): number {
  const date = new Date(ts);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

type StoredProgress = {
  balance?: number;
  points?: number;
  reputation?: number;
  level?: number;
  xp?: number;
  xpMax?: number;
  energy?: number;
  energyUpdatedAt?: number;
};

function readJson<T>(key: string): Partial<T> {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Partial<T>) : {};
  } catch {
    return {};
  }
}

export class GameState {
  nickname: string;
  gang = 'BANG SZCZUR'; // no gang system exists yet in prison-life - static until Task #8 ports GangView

  balance: number;
  points: number;
  reputation: number;

  level: number;
  xp: number;
  xpMax: number;

  energy: number;
  energyUpdatedAt: number;

  constructor() {
    const saved = readJson<StoredProgress>(PROGRESS_STORAGE_KEY);
    const creator = readJson<{ nickname: string }>(CREATOR_STORAGE_KEY);

    this.nickname = creator.nickname?.trim() || 'KOSA';

    // GameShell floors balance/points to a generous demo minimum regardless
    // of what's saved - kept identical here so both apps agree on a fresh
    // player's starting resources.
    this.balance = Math.max(saved.balance ?? 250, 100250);
    this.points = Math.max(saved.points ?? 3, 1003);
    this.reputation = saved.reputation ?? 0;

    this.level = saved.level ?? 1;
    this.xp = saved.xp ?? 120;
    this.xpMax = saved.xpMax ?? 500;

    this.energy = saved.energy ?? ENERGY_MAX;
    this.energyUpdatedAt = saved.energyUpdatedAt ?? Date.now();
    this.applyEnergyRegen();
  }

  get energyMax(): number {
    return ENERGY_MAX;
  }

  private applyEnergyRegen() {
    const now = Date.now();
    if (this.energyUpdatedAt < startOfLocalDay(now)) {
      this.energy = ENERGY_MAX;
      this.energyUpdatedAt = now;
      return;
    }
    if (this.energy >= ENERGY_MAX) return;
    const gained = Math.floor((now - this.energyUpdatedAt) / ENERGY_REGEN_MS);
    if (gained <= 0) return;
    this.energy = Math.min(ENERGY_MAX, this.energy + gained);
    this.energyUpdatedAt = this.energy >= ENERGY_MAX ? now : this.energyUpdatedAt + gained * ENERGY_REGEN_MS;
  }

  addMoney(amount: number) {
    if (amount <= 0) return;
    this.balance += amount;
    this.save();
  }
  removeMoney(amount: number): boolean {
    if (amount <= 0) return true;
    if (this.balance < amount) return false;
    this.balance -= amount;
    this.save();
    return true;
  }
  canAffordMoney(amount: number): boolean {
    return this.balance >= amount;
  }

  addPoints(amount: number) {
    if (amount <= 0) return;
    this.points += amount;
    this.save();
  }
  removePoints(amount: number): boolean {
    if (amount <= 0) return true;
    if (this.points < amount) return false;
    this.points -= amount;
    this.save();
    return true;
  }

  addEnergy(amount: number) {
    if (amount <= 0) return;
    this.energy = Math.min(ENERGY_MAX, this.energy + amount);
    this.energyUpdatedAt = Date.now();
    this.save();
  }
  removeEnergy(amount: number): boolean {
    this.applyEnergyRegen();
    if (amount <= 0) return true;
    if (this.energy < amount) return false;
    this.energy -= amount;
    this.energyUpdatedAt = Date.now();
    this.save();
    return true;
  }

  // Grants XP and cascades through as many level-ups as the amount covers.
  gainXp(amount: number) {
    if (amount <= 0) return;
    let nextXp = this.xp + amount;
    let nextLevel = this.level;
    let nextXpMax = this.xpMax;
    while (nextXp >= nextXpMax) {
      nextXp -= nextXpMax;
      nextLevel += 1;
      nextXpMax = Math.round(nextXpMax * 1.25);
    }
    this.xp = nextXp;
    this.level = nextLevel;
    this.xpMax = nextXpMax;
    this.save();
  }

  save() {
    this.applyEnergyRegen();
    const existing = readJson<Record<string, unknown>>(PROGRESS_STORAGE_KEY);
    const merged = {
      ...existing,
      balance: this.balance,
      points: this.points,
      reputation: this.reputation,
      level: this.level,
      xp: this.xp,
      xpMax: this.xpMax,
      energy: this.energy,
      energyUpdatedAt: this.energyUpdatedAt,
    };
    try {
      window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(merged));
    } catch {
      // localStorage unavailable (private mode, quota) - progress just won't persist
    }
  }
}
