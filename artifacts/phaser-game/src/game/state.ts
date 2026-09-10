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

import { characterInventoryItemsData, type ItemInstance } from '../data/items';
import { characterDefaultEquipped, characterDefaultOwnedItems, characterStatsList, statUpgradeCost, type CharacterStat } from '../data/character';
import { fightOpponents, type FightResult } from '../data/activities';

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
  stats?: Record<string, number>;
  equipped?: Record<string, string | null>;
  ownedItems?: ItemInstance[];
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

  stats: CharacterStat[];
  equipped: Record<string, string | null>;
  ownedItems: ItemInstance[];

  // Ephemeral session state for Work/Training/Fight - not persisted, same
  // as the original's per-mounted-view local React state (a reload or
  // leaving the section loses in-progress work/training there too).
  selectedWorkHours = 8;
  activeWork: { totalMs: number; endsAt: number } | null = null;
  activeTraining: Record<string, { endsAt: number }> = {};
  selectedFightOpponentId = fightOpponents[0].id;
  lastFightResult: FightResult | null = null;

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

    this.stats = characterStatsList.map((stat) => ({ ...stat, value: saved.stats?.[stat.key] ?? stat.value }));
    this.equipped = saved.equipped ?? { ...characterDefaultEquipped };
    this.ownedItems = saved.ownedItems ?? characterDefaultOwnedItems.map((entry) => ({ ...entry }));
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

  addReputation(amount: number) {
    if (amount <= 0) return;
    this.reputation += amount;
    this.save();
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

  // Sum of every equipped item's stat bonuses, keyed by stat - added on top
  // of the base stat value wherever it's displayed.
  get equipmentStatBonuses(): Record<string, number> {
    const bonuses: Record<string, number> = {};
    for (const instanceId of Object.values(this.equipped)) {
      if (!instanceId) continue;
      const instance = this.ownedItems.find((entry) => entry.instanceId === instanceId);
      if (!instance) continue;
      for (const [stat, amount] of Object.entries(instance.bonuses)) {
        bonuses[stat] = (bonuses[stat] ?? 0) + amount;
      }
    }
    return bonuses;
  }

  getEquippedItem(slot: string) {
    const instanceId = this.equipped[slot];
    if (!instanceId) return undefined;
    const instance = this.ownedItems.find((entry) => entry.instanceId === instanceId);
    if (!instance) return undefined;
    const item = characterInventoryItemsData.find((entry) => entry.id === instance.itemId);
    return item ? { instance, item } : undefined;
  }

  // Equips an owned instance into its item's slot. Returns the item name on
  // success, or null if the instance isn't owned.
  equipInstance(instanceId: string): string | null {
    const instance = this.ownedItems.find((entry) => entry.instanceId === instanceId);
    if (!instance) return null;
    const item = characterInventoryItemsData.find((entry) => entry.id === instance.itemId);
    if (!item) return null;
    this.equipped[item.slot] = instanceId;
    this.save();
    return item.name;
  }

  // Returns the unequipped item's label, or null if the slot was empty.
  unequipSlot(slot: string): string | null {
    const equipped = this.getEquippedItem(slot);
    if (!equipped) return null;
    this.equipped[slot] = null;
    this.save();
    return equipped.item.name;
  }

  // Sells an owned (and not equipped) instance for its catalog value.
  // Returns { name, value } on success, or null if it wasn't sellable.
  sellInstance(instanceId: string): { name: string; value: number } | null {
    const instance = this.ownedItems.find((entry) => entry.instanceId === instanceId);
    if (!instance) return null;
    const item = characterInventoryItemsData.find((entry) => entry.id === instance.itemId);
    if (!item) return null;
    this.ownedItems = this.ownedItems.filter((entry) => entry.instanceId !== instanceId);
    this.addMoney(item.value);
    return { name: item.name, value: item.value };
  }

  // Spends cash to raise a stat by one point. Returns the cost paid on
  // success, or null if maxed out / unaffordable.
  increaseStat(key: string): number | null {
    const stat = this.stats.find((entry) => entry.key === key);
    if (!stat || stat.value >= stat.max) return null;
    const cost = statUpgradeCost(stat.value);
    if (!this.removeMoney(cost)) return null;
    stat.value = Math.min(stat.max, stat.value + 1);
    this.save();
    return cost;
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
      stats: Object.fromEntries(this.stats.map((stat) => [stat.key, stat.value])),
      equipped: this.equipped,
      ownedItems: this.ownedItems,
    };
    try {
      window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(merged));
    } catch {
      // localStorage unavailable (private mode, quota) - progress just won't persist
    }
  }
}
