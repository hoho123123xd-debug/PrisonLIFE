// Rozwoj celi, ported from prison-life's CellDevelopmentView. Cost grows
// geometrically with level; the bonus text is derived from bonusPerLevel so
// all 20 levels stay consistent without hand-writing 20 flavor strings per
// item.

export type CellUpgradeId = 'bed' | 'locker' | 'table' | 'shelf' | 'tv' | 'sink' | 'training' | 'extras';

export type CellUpgrade = {
  id: CellUpgradeId;
  label: string;
  defaultLevel: number;
  baseCost: number;
  bonusPerLevel: number;
  bonusUnit: string;
};

export const CELL_UPGRADE_MAX_LEVEL = 20;

export const cellUpgradeItems: CellUpgrade[] = [
  { id: 'bed', label: 'ŁÓŻKO', defaultLevel: 3, baseCost: 450, bonusPerLevel: 5, bonusUnit: '% regeneracji energii' },
  { id: 'locker', label: 'SZAFKA', defaultLevel: 2, baseCost: 350, bonusPerLevel: 5, bonusUnit: ' miejsca w ekwipunku' },
  { id: 'table', label: 'STÓŁ', defaultLevel: 1, baseCost: 300, bonusPerLevel: 3, bonusUnit: '% zarobków z pracy' },
  { id: 'shelf', label: 'PÓŁKA', defaultLevel: 2, baseCost: 320, bonusPerLevel: 3, bonusUnit: '% nauki techniki' },
  { id: 'tv', label: 'TELEWIZOR', defaultLevel: 1, baseCost: 280, bonusPerLevel: 4, bonusUnit: '% morale' },
  { id: 'sink', label: 'UMYWALKA', defaultLevel: 1, baseCost: 300, bonusPerLevel: 3, bonusUnit: '% szybszej regeneracji' },
  { id: 'training', label: 'KĄCIK TRENINGOWY', defaultLevel: 1, baseCost: 400, bonusPerLevel: 4, bonusUnit: '% efektywności treningu' },
  { id: 'extras', label: 'DODATKI', defaultLevel: 0, baseCost: 250, bonusPerLevel: 3, bonusUnit: '% komfortu i bezpieczeństwa' },
];

export function cellUpgradeCost(item: CellUpgrade, level: number): number {
  return Math.round(item.baseCost * Math.pow(1.15, level));
}

export function describeCellBonus(item: CellUpgrade, level: number): string {
  if (level <= 0) return item.id === 'extras' ? 'Odblokuj dekoracje celi' : 'Brak bonusu';
  return `+${level * item.bonusPerLevel}${item.bonusUnit}`;
}

export function cellLevelOf(levels: Record<string, number>, id: CellUpgradeId): number {
  return levels[id] ?? cellUpgradeItems.find((item) => item.id === id)!.defaultLevel;
}

// The only three upgrades wired into another real system: bed/sink speed up
// energy regen, table boosts work pay, and the training corner boosts stat
// gains. The rest (locker, shelf, tv, extras) still level up and show a
// real bonus number, but nothing reads it yet - same as the original.
export function cellEnergyRegenBonusPercent(levels: Record<string, number>): number {
  return cellLevelOf(levels, 'bed') * 5 + cellLevelOf(levels, 'sink') * 3;
}
export function cellWorkBonusPercent(levels: Record<string, number>): number {
  return cellLevelOf(levels, 'table') * 3;
}
export function cellTrainingBonusPercent(levels: Record<string, number>): number {
  return cellLevelOf(levels, 'training') * 4;
}
