// Product catalog: wearable items (clothes/weapons/accessories), their
// rarity tiers, and the Sklep/Czarny Rynek storefront listings built on
// top of them. Ported from artifacts/prison-life/src/data/items.ts, with
// lucide-react icon components replaced by plain string keys (this module
// has no React/UI framework dependency - Phaser scenes map the keys to
// whatever they draw).

const inv = (name: string) => `images/inventory/${name}`;

export type ItemTier = 'common' | 'rare' | 'elite' | 'limited' | 'unique';
export const itemTierConfig: Record<ItemTier, { label: string; color: string; dropWeight: number }> = {
  common: { label: 'ZWYKŁY', color: '#9aa39c', dropWeight: 100 },
  rare: { label: 'RZADKI', color: '#4f8fd6', dropWeight: 42 },
  elite: { label: 'ELITARNY', color: '#a366e0', dropWeight: 15 },
  limited: { label: 'EDYCJA LIMITOWANA', color: '#e0a83d', dropWeight: 5 },
  unique: { label: 'UNIKAT', color: '#e0473d', dropWeight: 1 },
};
export const storefrontTiers = new Set<ItemTier>(['common', 'rare', 'elite']);

export const characterInventoryItemsData: Array<{ id: string; name: string; asset: string; tier: ItemTier; slot: string; bonusStat: string; bonusAmount: number; value: number; price: number }> = [
  { id: 'cap', name: 'CZAPKA PRISON', asset: inv('head-cap.png'), tier: 'common', slot: 'head', bonusStat: 'reflex', bonusAmount: 2, value: 23, price: 50 },
  { id: 'black-cap', name: 'CZARNA CZAPKA', asset: inv('head-black-cap.png'), tier: 'common', slot: 'head', bonusStat: 'reflex', bonusAmount: 2, value: 28, price: 60 },
  { id: 'beanie', name: 'CZARNA CZAPKA ZIMOWA', asset: inv('head-beanie-clean.png'), tier: 'common', slot: 'head', bonusStat: 'endurance', bonusAmount: 2, value: 32, price: 70 },
  { id: 'head-bandana', name: 'BANDANA NA GŁOWĘ', asset: inv('head-bandana.png'), tier: 'rare', slot: 'head', bonusStat: 'luck', bonusAmount: 4, value: 48, price: 110 },
  { id: 'orange-shirt', name: 'KOSZULA A-7421', asset: inv('top-orange.png'), tier: 'common', slot: 'torso', bonusStat: 'health', bonusAmount: 2, value: 18, price: 40 },
  { id: 'gray-hoodie', name: 'SZARA BLUZA', asset: inv('top-gray-hoodie.png'), tier: 'common', slot: 'torso', bonusStat: 'endurance', bonusAmount: 3, value: 44, price: 100 },
  { id: 'red-shirt', name: 'CZERWONA KOSZULKA', asset: inv('top-red-shirt-clean.png'), tier: 'rare', slot: 'torso', bonusStat: 'strength', bonusAmount: 4, value: 58, price: 140 },
  { id: 'orange-pants', name: 'SPODNIE A-7421', asset: inv('bottom-orange.png'), tier: 'common', slot: 'legs', bonusStat: 'endurance', bonusAmount: 2, value: 18, price: 40 },
  { id: 'black-pants', name: 'CZARNE SPODNIE', asset: inv('bottom-black.png'), tier: 'common', slot: 'legs', bonusStat: 'endurance', bonusAmount: 3, value: 38, price: 90 },
  { id: 'tan-pants', name: 'SPODNIE TAKTYCZNE', asset: inv('bottom-tan.png'), tier: 'rare', slot: 'legs', bonusStat: 'strength', bonusAmount: 4, value: 62, price: 150 },
  { id: 'gloves', name: 'RĘKAWICE', asset: inv('hand-gloves.png'), tier: 'rare', slot: 'hands', bonusStat: 'strength', bonusAmount: 4, value: 54, price: 120 },
  { id: 'slide-sandals', name: 'KLAPKI', asset: inv('feet-slides-clean.png'), tier: 'common', slot: 'feet', bonusStat: 'reflex', bonusAmount: 1, value: 20, price: 35 },
  { id: 'black-boots', name: 'CZARNE TRAPERY', asset: inv('feet-black-boots.png'), tier: 'rare', slot: 'feet', bonusStat: 'reflex', bonusAmount: 4, value: 59, price: 130 },
  { id: 'tan-boots', name: 'BRĄZOWE BUTY', asset: inv('feet-tan-boots-clean.png'), tier: 'rare', slot: 'feet', bonusStat: 'reflex', bonusAmount: 5, value: 72, price: 180 },
  { id: 'red-sneakers', name: 'CZERWONE SNEAKERSY', asset: inv('feet-red-sneakers-clean.png'), tier: 'elite', slot: 'feet', bonusStat: 'reflex', bonusAmount: 7, value: 98, price: 240 },
  { id: 'black-hoodie', name: 'CZARNA BLUZA', asset: inv('top-black-hoodie.png'), tier: 'elite', slot: 'torso', bonusStat: 'endurance', bonusAmount: 7, value: 117, price: 260 },
  { id: 'black-backpack', name: 'PLECAK TAKTYCZNY', asset: inv('bag-black.png'), tier: 'elite', slot: 'back', bonusStat: 'strength', bonusAmount: 7, value: 126, price: 280 },
  { id: 'green-backpack', name: 'PLECAK ZIELONY', asset: inv('bag-green-clean.png'), tier: 'rare', slot: 'back', bonusStat: 'strength', bonusAmount: 4, value: 80, price: 170 },
  { id: 'camo-backpack', name: 'PLECAK MORO', asset: inv('bag-camo-clean.png'), tier: 'elite', slot: 'back', bonusStat: 'strength', bonusAmount: 6, value: 110, price: 250 },
  { id: 'bandana', name: 'CZERWONA BANDANA', asset: inv('face-red-bandana.png'), tier: 'limited', slot: 'neck', bonusStat: 'luck', bonusAmount: 11, value: 248, price: 550 },
  { id: 'knife', name: 'NÓŻ', asset: inv('weapon-knife.png'), tier: 'unique', slot: 'weapon', bonusStat: 'strength', bonusAmount: 16, value: 405, price: 900 },
];

export const POINT_DROP_CHANCE = 1 / 10000;
export const ITEM_DROP_CHANCE = 0.3;
export const ELITE_LOOT_CHANCE = 1 / 5000;
export const ELITE_MIN_LEVEL = 10;

export function pickRandomLootItem(level: number) {
  const eliteCandidates = level >= ELITE_MIN_LEVEL ? characterInventoryItemsData.filter((item) => item.tier === 'elite') : [];
  if (eliteCandidates.length > 0 && Math.random() < ELITE_LOOT_CHANCE) {
    return eliteCandidates[Math.floor(Math.random() * eliteCandidates.length)];
  }
  const candidates = characterInventoryItemsData.filter((item) => item.tier === 'common' || item.tier === 'rare');
  if (candidates.length === 0) return null;
  const totalWeight = candidates.reduce((sum, item) => sum + itemTierConfig[item.tier].dropWeight, 0);
  let roll = Math.random() * totalWeight;
  for (const item of candidates) {
    roll -= itemTierConfig[item.tier].dropWeight;
    if (roll <= 0) return item;
  }
  return candidates[candidates.length - 1];
}

export function filterPoolByLevel<T extends { tier?: ItemTier }>(pool: T[], level: number): T[] {
  return level >= ELITE_MIN_LEVEL ? pool : pool.filter((item) => item.tier !== 'elite');
}

export const STAT_KEYS = ['health', 'luck', 'strength', 'endurance', 'intelligence', 'reflex'];
const tierStatCount: Record<ItemTier, () => number> = {
  common: () => (Math.random() < 0.5 ? 1 : 2),
  rare: () => 3,
  elite: () => 4,
  limited: () => 6,
  unique: () => 6,
};
function rollBonusAmount(base: number): number {
  const spread = Math.max(1, Math.round(base * 0.3));
  return Math.max(1, base + Math.floor(Math.random() * (spread * 2 + 1)) - spread);
}
export type ItemInstance = { instanceId: string; itemId: string; bonuses: Record<string, number> };
let itemInstanceCounter = 0;
export function rollItemInstance(itemId: string): ItemInstance {
  const item = characterInventoryItemsData.find((entry) => entry.id === itemId)!;
  itemInstanceCounter += 1;
  const count = tierStatCount[item.tier]();
  const otherStats = STAT_KEYS.filter((stat) => stat !== item.bonusStat).sort(() => Math.random() - 0.5);
  const chosenStats = [item.bonusStat, ...otherStats.slice(0, count - 1)];
  const bonuses: Record<string, number> = {};
  for (const stat of chosenStats) bonuses[stat] = rollBonusAmount(item.bonusAmount);
  return { instanceId: `${itemId}-${Date.now()}-${itemInstanceCounter}`, itemId, bonuses };
}

// Sklep (legal) and Czarny Rynek (illegal) share one mechanic: a rotating
// selection of offers drawn from a pool, refreshable early for points.
// `icon` is a string key (a Phaser texture key, wired up per-scene) instead
// of a lucide-react component.
export type LegalGood = { id: string; name: string; price: number; tier?: ItemTier; render: { kind: 'icon'; icon: string } | { kind: 'image'; src: string } };
const legalGenericGoods: LegalGood[] = [
  { id: 'tshirt', name: 'Koszulka', price: 60, render: { kind: 'icon', icon: 'shirt' } },
  { id: 'shorts', name: 'Spodenki', price: 80, render: { kind: 'icon', icon: 'package' } },
  { id: 'sneakers', name: 'Buty sportowe', price: 120, render: { kind: 'icon', icon: 'footprints' } },
  { id: 'gym-hoodie', name: 'Bluza', price: 150, render: { kind: 'icon', icon: 'shirt' } },
  { id: 'towel', name: 'Ręcznik', price: 50, render: { kind: 'icon', icon: 'droplet' } },
  { id: 'toothpaste-set', name: 'Pasta i szczoteczka', price: 40, render: { kind: 'icon', icon: 'sparkles' } },
  { id: 'soap-bar', name: 'Mydło', price: 25, render: { kind: 'icon', icon: 'droplets' } },
  { id: 'generic-slides', name: 'Klapki', price: 70, render: { kind: 'icon', icon: 'footprints' } },
  { id: 'notebook-set', name: 'Notes i długopis', price: 35, render: { kind: 'icon', icon: 'scroll-text' } },
];
export const legalEquipGoods: LegalGood[] = characterInventoryItemsData.filter((item) => storefrontTiers.has(item.tier)).map((item) => ({ id: item.id, name: item.name, price: item.price, tier: item.tier, render: { kind: 'image', src: item.asset } }));
export const legalGoodsPool: LegalGood[] = [...legalGenericGoods, ...legalEquipGoods];
export const legalEquipIds = new Set(legalEquipGoods.map((item) => item.id));

export type IllegalGood = { id: string; name: string; price: number; tier?: ItemTier; render: { kind: 'icon'; icon: string } | { kind: 'image'; src: string } };
const illegalFlavorGoods: IllegalGood[] = [
  { id: 'prison-knife', name: 'Nóż więzienny', price: 450, render: { kind: 'icon', icon: 'swords' } },
  { id: 'knuckles', name: 'Kastet', price: 380, render: { kind: 'icon', icon: 'hand-fist' } },
  { id: 'amphetamine', name: 'Amfetamina (mała porcja)', price: 250, render: { kind: 'icon', icon: 'package' } },
  { id: 'shiv', name: 'Sztylet', price: 600, render: { kind: 'icon', icon: 'crosshair' } },
  { id: 'steroids', name: 'Sterydy', price: 350, render: { kind: 'icon', icon: 'dumbbell' } },
  { id: 'weed', name: 'Marihuana', price: 180, render: { kind: 'icon', icon: 'leaf' } },
  { id: 'burner-phone', name: 'Telefon', price: 1200, render: { kind: 'icon', icon: 'smartphone' } },
  { id: 'tattoo-kit', name: 'Zestaw do tatuażu', price: 520, render: { kind: 'icon', icon: 'award' } },
  { id: 'stolen-watch', name: 'Zegarek (skradziony)', price: 410, render: { kind: 'icon', icon: 'watch' } },
];
export const illegalEquipGoods: IllegalGood[] = characterInventoryItemsData.filter((item) => storefrontTiers.has(item.tier)).map((item) => ({ id: item.id, name: item.name, price: item.price, tier: item.tier, render: { kind: 'image', src: item.asset } }));
export const illegalGoodsPool: IllegalGood[] = [...illegalFlavorGoods, ...illegalEquipGoods];
export const illegalEquipIds = new Set(illegalEquipGoods.map((item) => item.id));

// Sklep (legal) and Czarny Rynek (illegal) offer rotation: a rotating
// selection of offers drawn from a pool, refreshable early for points or
// automatically once OFFER_REFRESH_MS has elapsed since the last roll.
export const OFFER_SIZE = 9;
export const OFFER_REFRESH_MS = 24 * 60 * 60 * 1000;
export const OFFER_REFRESH_COST = 1;
export type OfferState = { ids: string[]; refreshedAt: number };

export function pickRandomOfferIds(pool: { id: string }[], count: number): string[] {
  const ids = pool.map((entry) => entry.id);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids.slice(0, Math.min(count, ids.length));
}

export function rollOfferIfStale(saved: OfferState | undefined, pool: { id: string }[]): OfferState {
  if (saved && saved.ids.length && Date.now() - saved.refreshedAt < OFFER_REFRESH_MS) return saved;
  return { ids: pickRandomOfferIds(pool, OFFER_SIZE), refreshedAt: Date.now() };
}

// Buying a product restocks just that slot with a different item from the
// pool (not already showing elsewhere in the offer), instead of leaving the
// same product sitting there to be bought again.
export function restockOfferSlot(current: OfferState, pool: { id: string }[], purchasedId: string): OfferState {
  const candidates = pool.filter((entry) => entry.id !== purchasedId && !current.ids.includes(entry.id));
  const replacementId = candidates.length > 0 ? candidates[Math.floor(Math.random() * candidates.length)].id : purchasedId;
  return { ids: current.ids.map((id) => (id === purchasedId ? replacementId : id)), refreshedAt: current.refreshedAt };
}
