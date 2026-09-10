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

import {
  characterInventoryItemsData,
  filterPoolByLevel,
  illegalEquipIds,
  illegalGoodsPool,
  ITEM_DROP_CHANCE,
  legalEquipIds,
  legalGoodsPool,
  OFFER_REFRESH_COST,
  OFFER_SIZE,
  pickRandomLootItem,
  pickRandomOfferIds,
  POINT_DROP_CHANCE,
  restockOfferSlot,
  rollItemInstance,
  rollOfferIfStale,
  type ItemInstance,
  type OfferState,
} from '../data/items';
import { characterDefaultEquipped, characterDefaultOwnedItems, characterStatsList, statUpgradeCost, type CharacterStat } from '../data/character';
import { fightOpponents, type FightResult } from '../data/activities';
import { MEAL_BUFF_DURATION_MS, mealEffectStatKey, type Meal } from '../data/canteen';
import { MISSION_BONUS_MONEY_CHANCE, missionSkipCost, type MissionCard } from '../data/missions';
import { cellEnergyRegenBonusPercent, cellLevelOf, cellUpgradeCost, cellUpgradeItems, CELL_UPGRADE_MAX_LEVEL, type CellUpgradeId } from '../data/cell';

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
  shopOffer?: OfferState;
  marketOffer?: OfferState;
  foodBuffs?: FoodBuff[];
  cellUpgradeLevels?: Record<string, number>;
};

type FoodBuff = { id: string; statKey: string; amount: number; expiresAt: number };

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

  shopOffer: OfferState;
  marketOffer: OfferState;
  foodBuffs: FoodBuff[];
  cellUpgradeLevels: Record<string, number>;

  // Ephemeral session state for Work/Training/Fight - not persisted, same
  // as the original's per-mounted-view local React state (a reload or
  // leaving the section loses in-progress work/training there too).
  selectedWorkHours = 8;
  activeWork: { totalMs: number; endsAt: number } | null = null;
  activeTraining: Record<string, { endsAt: number }> = {};
  selectedFightOpponentId = fightOpponents[0].id;
  selectedShopTab: 'shop' | 'market' | 'canteen' = 'shop';
  selectedCellUpgradeId: CellUpgradeId = 'bed';
  selectedCellTab: 'fight' | 'development' = 'fight';
  gangTreasury = 12450; // local-only in the original too (useState, not persisted)
  lastFightResult: FightResult | null = null;
  activeMissions: Record<string, { endsAt: number }> = {};

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

    this.cellUpgradeLevels = saved.cellUpgradeLevels ?? {};

    this.energy = saved.energy ?? ENERGY_MAX;
    this.energyUpdatedAt = saved.energyUpdatedAt ?? Date.now();
    this.applyEnergyRegen();

    this.stats = characterStatsList.map((stat) => ({ ...stat, value: saved.stats?.[stat.key] ?? stat.value }));
    this.equipped = saved.equipped ?? { ...characterDefaultEquipped };
    this.ownedItems = saved.ownedItems ?? characterDefaultOwnedItems.map((entry) => ({ ...entry }));

    // Elite listings are hidden from both storefronts below ELITE_MIN_LEVEL.
    this.shopOffer = rollOfferIfStale(saved.shopOffer, filterPoolByLevel(legalGoodsPool, this.level));
    this.marketOffer = rollOfferIfStale(saved.marketOffer, filterPoolByLevel(illegalGoodsPool, this.level));
    this.foodBuffs = (saved.foodBuffs ?? []).filter((buff) => buff.expiresAt > Date.now());
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
    const regenMs = Math.round(ENERGY_REGEN_MS / (1 + cellEnergyRegenBonusPercent(this.cellUpgradeLevels) / 100));
    const gained = Math.floor((now - this.energyUpdatedAt) / regenMs);
    if (gained <= 0) return;
    this.energy = Math.min(ENERGY_MAX, this.energy + gained);
    this.energyUpdatedAt = this.energy >= ENERGY_MAX ? now : this.energyUpdatedAt + gained * regenMs;
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

  // No "already own it" gate: every purchase rolls its own instance, so
  // buying the same item twice just means two copies with (probably)
  // different bonuses. Returns true on success.
  buyLegalGood(itemId: string, price: number): boolean {
    if (!this.removeMoney(price)) return false;
    if (legalEquipIds.has(itemId)) this.ownedItems.push(rollItemInstance(itemId));
    this.shopOffer = restockOfferSlot(this.shopOffer, filterPoolByLevel(legalGoodsPool, this.level), itemId);
    this.save();
    return true;
  }

  // `price` should already include whatever gang-control markup applies
  // (blackMarketTaxCut in the original - always 0 here until gangs are
  // ported, so callers pass the plain listed price for now).
  buyIllegalGood(itemId: string, price: number): boolean {
    if (!this.removeMoney(price)) return false;
    if (illegalEquipIds.has(itemId)) this.ownedItems.push(rollItemInstance(itemId));
    this.marketOffer = restockOfferSlot(this.marketOffer, filterPoolByLevel(illegalGoodsPool, this.level), itemId);
    this.save();
    return true;
  }

  refreshShopOffer(): boolean {
    if (!this.removePoints(OFFER_REFRESH_COST)) return false;
    this.shopOffer = { ids: pickRandomOfferIds(filterPoolByLevel(legalGoodsPool, this.level), OFFER_SIZE), refreshedAt: Date.now() };
    this.save();
    return true;
  }

  refreshMarketOffer(): boolean {
    if (!this.removePoints(OFFER_REFRESH_COST)) return false;
    this.marketOffer = { ids: pickRandomOfferIds(filterPoolByLevel(illegalGoodsPool, this.level), OFFER_SIZE), refreshedAt: Date.now() };
    this.save();
    return true;
  }

  // Sum of every active meal buff's bonus, keyed by stat - same shape as
  // equipmentStatBonuses, stacked on top of it wherever stats are shown.
  get foodStatBonuses(): Record<string, number> {
    this.pruneFoodBuffs();
    const bonuses: Record<string, number> = {};
    for (const buff of this.foodBuffs) bonuses[buff.statKey] = (bonuses[buff.statKey] ?? 0) + buff.amount;
    return bonuses;
  }

  private pruneFoodBuffs() {
    const before = this.foodBuffs.length;
    this.foodBuffs = this.foodBuffs.filter((buff) => buff.expiresAt > Date.now());
    if (this.foodBuffs.length !== before) this.save();
  }

  buyMeal(meal: Meal): boolean {
    if (!this.removeMoney(meal.price)) return false;
    this.foodBuffs.push({
      id: `${meal.id}-${Date.now()}`,
      statKey: mealEffectStatKey[meal.effect],
      amount: meal.amount,
      expiresAt: Date.now() + MEAL_BUFF_DURATION_MS,
    });
    this.save();
    return true;
  }

  cellLevelOf(id: CellUpgradeId): number {
    return cellLevelOf(this.cellUpgradeLevels, id);
  }

  // Returns the new level on success, or null if maxed out / unaffordable.
  upgradeCellItem(id: CellUpgradeId): number | null {
    const item = cellUpgradeItems.find((entry) => entry.id === id)!;
    const level = this.cellLevelOf(id);
    if (level >= CELL_UPGRADE_MAX_LEVEL) return null;
    const cost = cellUpgradeCost(item, level);
    if (!this.removeMoney(cost)) return null;
    this.cellUpgradeLevels[id] = level + 1;
    this.save();
    return level + 1;
  }

  startMission(mission: MissionCard): boolean {
    if (!this.removeEnergy(mission.energy)) return false;
    this.activeMissions[mission.id] = { endsAt: Date.now() + mission.durationMinutes * 60 * 1000 };
    return true;
  }

  missionSkipCost(mission: MissionCard): number {
    const active = this.activeMissions[mission.id];
    const remainingMs = active ? Math.max(0, active.endsAt - Date.now()) : 0;
    return missionSkipCost(remainingMs);
  }

  skipMission(mission: MissionCard): boolean {
    const cost = this.missionSkipCost(mission);
    if (!this.removePoints(cost)) return false;
    return this.resolveMission(mission) !== null;
  }

  // Resolves a mission whose timer has elapsed (or been skipped). Returns
  // the outcome for the caller to render a notice, or null if it wasn't
  // actually active.
  resolveMission(mission: MissionCard): { success: boolean; extras: string[] } | null {
    if (!this.activeMissions[mission.id]) return null;
    delete this.activeMissions[mission.id];
    const success = Math.random() * 100 < mission.chance;
    const extras: string[] = [];
    if (success) {
      this.gainXp(mission.rewardXp);
      if (Math.random() < MISSION_BONUS_MONEY_CHANCE) {
        const bonusMoney = Math.max(10, Math.round(mission.rewardXp * 0.15));
        this.addMoney(bonusMoney);
        extras.push(`${bonusMoney} $`);
      }
      if (Math.random() < ITEM_DROP_CHANCE) {
        const loot = pickRandomLootItem(this.level);
        if (loot) {
          this.ownedItems.push(rollItemInstance(loot.id));
          extras.push(loot.name);
        }
      }
      if (Math.random() < POINT_DROP_CHANCE) {
        this.addPoints(1);
        extras.push('1 pkt');
      }
    }
    this.save();
    return { success, extras };
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
      shopOffer: this.shopOffer,
      marketOffer: this.marketOffer,
      foodBuffs: this.foodBuffs,
      cellUpgradeLevels: this.cellUpgradeLevels,
    };
    try {
      window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(merged));
    } catch {
      // localStorage unavailable (private mode, quota) - progress just won't persist
    }
  }
}
