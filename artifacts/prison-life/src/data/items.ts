// Product catalog: wearable items (clothes/weapons/accessories), their
// rarity tiers, and the Sklep/Czarny Rynek storefront listings built on
// top of them. Kept separate from App.tsx so the catalog can grow (more
// items per tier, new categories) without touching component code.
import {
  Award,
  Crosshair,
  Droplet,
  Droplets,
  Dumbbell,
  Footprints as FootprintsIcon,
  HandFist,
  Leaf,
  Package,
  ScrollText,
  Shield,
  Shirt as ShirtIcon,
  Smartphone,
  Sparkles,
  Swords,
  Watch,
} from 'lucide-react';
import inventoryHeadCapAsset from '@assets/inventory/head-cap.png';
import inventoryHeadBeanieAsset from '@assets/inventory/head-beanie-clean.png';
import inventoryHeadBlackCapAsset from '@assets/inventory/head-black-cap.png';
import inventoryHeadBandanaAsset from '@assets/inventory/head-bandana.png';
import inventoryTopOrangeAsset from '@assets/inventory/top-orange.png';
import inventoryTopBlackHoodieAsset from '@assets/inventory/top-black-hoodie.png';
import inventoryTopGrayHoodieAsset from '@assets/inventory/top-gray-hoodie.png';
import inventoryTopRedShirtAsset from '@assets/inventory/top-red-shirt-clean.png';
import inventoryBagBlackAsset from '@assets/inventory/bag-black.png';
import inventoryBagGreenAsset from '@assets/inventory/bag-green-clean.png';
import inventoryBagCamoAsset from '@assets/inventory/bag-camo-clean.png';
import inventoryHandGlovesAsset from '@assets/inventory/hand-gloves.png';
import inventoryFaceBandanaAsset from '@assets/inventory/face-red-bandana.png';
import inventoryBottomOrangeAsset from '@assets/inventory/bottom-orange.png';
import inventoryBottomBlackAsset from '@assets/inventory/bottom-black.png';
import inventoryBottomTanAsset from '@assets/inventory/bottom-tan.png';
import inventoryFeetSlidesAsset from '@assets/inventory/feet-slides-clean.png';
import inventoryFeetBlackBootsAsset from '@assets/inventory/feet-black-boots.png';
import inventoryFeetTanBootsAsset from '@assets/inventory/feet-tan-boots-clean.png';
import inventoryFeetRedSneakersAsset from '@assets/inventory/feet-red-sneakers-clean.png';
import inventoryWeaponKnifeAsset from '@assets/inventory/weapon-knife.png';

// Rarity tier for anything wearable: higher tier = pricier, harder to loot
// (see dropWeight, used by pickRandomLootItem below) and a bigger stat
// bonus. This catalog is due for a bigger content pass (more items per
// tier) - the tier machinery itself doesn't care how many items end up in
// each bucket.
export type ItemTier = 'common' | 'rare' | 'elite' | 'limited' | 'unique';
export const itemTierConfig: Record<ItemTier, { label: string; color: string; dropWeight: number }> = {
  common: { label: 'ZWYKŁY', color: '#9aa39c', dropWeight: 100 },
  rare: { label: 'RZADKI', color: '#4f8fd6', dropWeight: 42 },
  elite: { label: 'ELITARNY', color: '#a366e0', dropWeight: 15 },
  limited: { label: 'EDYCJA LIMITOWANA', color: '#e0a83d', dropWeight: 5 },
  unique: { label: 'UNIKAT', color: '#e0473d', dropWeight: 1 },
};
// Sklep and Czarny Rynek both only ever stock the three "everyday" tiers -
// edycja limitowana and unikat stay out of ordinary storefronts the same
// way they stay out of ordinary loot (see pickRandomLootItem below).
export const storefrontTiers = new Set<ItemTier>(['common', 'rare', 'elite']);

export const characterInventoryItemsData: Array<{ id: string; name: string; asset: string; tier: ItemTier; slot: string; bonusStat: string; bonusAmount: number; value: number; price: number }> = [
  { id: 'cap', name: 'CZAPKA PRISON', asset: inventoryHeadCapAsset, tier: 'common', slot: 'head', bonusStat: 'reflex', bonusAmount: 2, value: 23, price: 50 },
  { id: 'black-cap', name: 'CZARNA CZAPKA', asset: inventoryHeadBlackCapAsset, tier: 'common', slot: 'head', bonusStat: 'reflex', bonusAmount: 2, value: 28, price: 60 },
  { id: 'beanie', name: 'CZARNA CZAPKA ZIMOWA', asset: inventoryHeadBeanieAsset, tier: 'common', slot: 'head', bonusStat: 'endurance', bonusAmount: 2, value: 32, price: 70 },
  { id: 'head-bandana', name: 'BANDANA NA GŁOWĘ', asset: inventoryHeadBandanaAsset, tier: 'rare', slot: 'head', bonusStat: 'luck', bonusAmount: 4, value: 48, price: 110 },
  { id: 'orange-shirt', name: 'KOSZULA A-7421', asset: inventoryTopOrangeAsset, tier: 'common', slot: 'torso', bonusStat: 'health', bonusAmount: 2, value: 18, price: 40 },
  { id: 'gray-hoodie', name: 'SZARA BLUZA', asset: inventoryTopGrayHoodieAsset, tier: 'common', slot: 'torso', bonusStat: 'endurance', bonusAmount: 3, value: 44, price: 100 },
  { id: 'red-shirt', name: 'CZERWONA KOSZULKA', asset: inventoryTopRedShirtAsset, tier: 'rare', slot: 'torso', bonusStat: 'strength', bonusAmount: 4, value: 58, price: 140 },
  { id: 'orange-pants', name: 'SPODNIE A-7421', asset: inventoryBottomOrangeAsset, tier: 'common', slot: 'legs', bonusStat: 'endurance', bonusAmount: 2, value: 18, price: 40 },
  { id: 'black-pants', name: 'CZARNE SPODNIE', asset: inventoryBottomBlackAsset, tier: 'common', slot: 'legs', bonusStat: 'endurance', bonusAmount: 3, value: 38, price: 90 },
  { id: 'tan-pants', name: 'SPODNIE TAKTYCZNE', asset: inventoryBottomTanAsset, tier: 'rare', slot: 'legs', bonusStat: 'strength', bonusAmount: 4, value: 62, price: 150 },
  { id: 'gloves', name: 'RĘKAWICE', asset: inventoryHandGlovesAsset, tier: 'rare', slot: 'hands', bonusStat: 'strength', bonusAmount: 4, value: 54, price: 120 },
  { id: 'slide-sandals', name: 'KLAPKI', asset: inventoryFeetSlidesAsset, tier: 'common', slot: 'feet', bonusStat: 'reflex', bonusAmount: 1, value: 20, price: 35 },
  { id: 'black-boots', name: 'CZARNE TRAPERY', asset: inventoryFeetBlackBootsAsset, tier: 'rare', slot: 'feet', bonusStat: 'reflex', bonusAmount: 4, value: 59, price: 130 },
  { id: 'tan-boots', name: 'BRĄZOWE BUTY', asset: inventoryFeetTanBootsAsset, tier: 'rare', slot: 'feet', bonusStat: 'reflex', bonusAmount: 5, value: 72, price: 180 },
  { id: 'red-sneakers', name: 'CZERWONE SNEAKERSY', asset: inventoryFeetRedSneakersAsset, tier: 'elite', slot: 'feet', bonusStat: 'reflex', bonusAmount: 7, value: 98, price: 240 },
  { id: 'black-hoodie', name: 'CZARNA BLUZA', asset: inventoryTopBlackHoodieAsset, tier: 'elite', slot: 'torso', bonusStat: 'endurance', bonusAmount: 7, value: 117, price: 260 },
  { id: 'black-backpack', name: 'PLECAK TAKTYCZNY', asset: inventoryBagBlackAsset, tier: 'elite', slot: 'back', bonusStat: 'strength', bonusAmount: 7, value: 126, price: 280 },
  { id: 'green-backpack', name: 'PLECAK ZIELONY', asset: inventoryBagGreenAsset, tier: 'rare', slot: 'back', bonusStat: 'strength', bonusAmount: 4, value: 80, price: 170 },
  { id: 'camo-backpack', name: 'PLECAK MORO', asset: inventoryBagCamoAsset, tier: 'elite', slot: 'back', bonusStat: 'strength', bonusAmount: 6, value: 110, price: 250 },
  { id: 'bandana', name: 'CZERWONA BANDANA', asset: inventoryFaceBandanaAsset, tier: 'limited', slot: 'neck', bonusStat: 'luck', bonusAmount: 11, value: 248, price: 550 },
  { id: 'knife', name: 'NÓŻ', asset: inventoryWeaponKnifeAsset, tier: 'unique', slot: 'weapon', bonusStat: 'strength', bonusAmount: 16, value: 405, price: 900 },
];

// Bonus loot on a win/success, shared by Walka and Misje: an item drop is
// reasonably common, a bonus point is extremely rare (1 in 10 000) - both
// draw from the catalog above, so retuning the catalog (it's due for a
// pass) doesn't require touching this logic.
export const POINT_DROP_CHANCE = 1 / 10000;
export const ITEM_DROP_CHANCE = 0.3;
// Elitarny is its own separate, lottery-rare roll on top of the regular
// item drop, not just a low weight in the same pool - that keeps it "lotka"
// rare (~1 in 16 700 per win, i.e. ITEM_DROP_CHANCE * ELITE_LOOT_CHANCE)
// regardless of how the common/rare pool shrinks as the player collects
// things. TODO once a level requirement is decided: gate elite items behind
// it here (and unlock it as a guaranteed-ish reward on specific missions
// that explicitly advertise an elite chance, once any exist).
export const ELITE_LOOT_CHANCE = 1 / 5000;
// unikat is event-only (events aren't built yet) and edycja limitowana
// needs its own separate source that isn't decided yet either - neither
// belongs behind an ordinary mission/fight roll at all. Owning one already
// no longer excludes it from future rolls (see ItemInstance below) - a
// second copy is just another instance with its own rolled bonus, to be
// worn or sold.
export function pickRandomLootItem() {
  const eliteCandidates = characterInventoryItemsData.filter((item) => item.tier === 'elite');
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

// Every purchase or loot drop is its own instance: same catalog item, same
// tier, but which stats it boosts and by how much can both differ. Higher
// tiers roll bonuses on more stats at once - common gets 1 or 2 (a coin
// flip), rare 3, elite 4, edycja limitowana and unikat all 6. The catalog's
// bonusStat is always one of the rolled stats (an item keeps its "identity"
// stat); the rest are random picks from the other five.
export const STAT_KEYS = ['health', 'luck', 'strength', 'endurance', 'intelligence', 'reflex'];
const tierStatCount: Record<ItemTier, () => number> = {
  common: () => (Math.random() < 0.5 ? 1 : 2),
  rare: () => 3,
  elite: () => 4,
  limited: () => 6,
  unique: () => 6,
};
// Additive spread (±30% of the base, floored at ±1) rather than a straight
// percentage multiply, since a percentage swing on a base as low as 2 always
// rounds back to the same integer - the additive floor keeps even the
// cheapest items visibly variable.
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
// GameShell owns the offer-picking/persistence; the view components only
// render whatever offer list they're handed and know how to buy one item.
export type LegalGood = { id: string; name: string; price: number; tier?: ItemTier; render: { kind: 'icon'; icon: typeof Shield } | { kind: 'image'; src: string } };
const legalGenericGoods: LegalGood[] = [
  { id: 'tshirt', name: 'Koszulka', price: 60, render: { kind: 'icon', icon: ShirtIcon } },
  { id: 'shorts', name: 'Spodenki', price: 80, render: { kind: 'icon', icon: Package } },
  { id: 'sneakers', name: 'Buty sportowe', price: 120, render: { kind: 'icon', icon: FootprintsIcon } },
  { id: 'gym-hoodie', name: 'Bluza', price: 150, render: { kind: 'icon', icon: ShirtIcon } },
  { id: 'towel', name: 'Ręcznik', price: 50, render: { kind: 'icon', icon: Droplet } },
  { id: 'toothpaste-set', name: 'Pasta i szczoteczka', price: 40, render: { kind: 'icon', icon: Sparkles } },
  { id: 'soap-bar', name: 'Mydło', price: 25, render: { kind: 'icon', icon: Droplets } },
  { id: 'generic-slides', name: 'Klapki', price: 70, render: { kind: 'icon', icon: FootprintsIcon } },
  { id: 'notebook-set', name: 'Notes i długopis', price: 35, render: { kind: 'icon', icon: ScrollText } },
];
// Equip-catalog goods, zwykły/rzadki/elitarny only (see storefrontTiers):
// buying one still lands straight in the character's equipment inventory.
export const legalEquipGoods: LegalGood[] = characterInventoryItemsData.filter((item) => storefrontTiers.has(item.tier)).map((item) => ({ id: item.id, name: item.name, price: item.price, tier: item.tier, render: { kind: 'image', src: item.asset } }));
export const legalGoodsPool: LegalGood[] = [...legalGenericGoods, ...legalEquipGoods];
export const legalEquipIds = new Set(legalEquipGoods.map((item) => item.id));

export type IllegalGood = { id: string; name: string; price: number; tier?: ItemTier; render: { kind: 'icon'; icon: typeof Shield } | { kind: 'image'; src: string } };
const illegalFlavorGoods: IllegalGood[] = [
  { id: 'prison-knife', name: 'Nóż więzienny', price: 450, render: { kind: 'icon', icon: Swords } },
  { id: 'knuckles', name: 'Kastet', price: 380, render: { kind: 'icon', icon: HandFist } },
  { id: 'amphetamine', name: 'Amfetamina (mała porcja)', price: 250, render: { kind: 'icon', icon: Package } },
  { id: 'shiv', name: 'Sztylet', price: 600, render: { kind: 'icon', icon: Crosshair } },
  { id: 'steroids', name: 'Sterydy', price: 350, render: { kind: 'icon', icon: Dumbbell } },
  { id: 'weed', name: 'Marihuana', price: 180, render: { kind: 'icon', icon: Leaf } },
  { id: 'burner-phone', name: 'Telefon', price: 1200, render: { kind: 'icon', icon: Smartphone } },
  { id: 'tattoo-kit', name: 'Zestaw do tatuażu', price: 520, render: { kind: 'icon', icon: Award } },
  { id: 'stolen-watch', name: 'Zegarek (skradziony)', price: 410, render: { kind: 'icon', icon: Watch } },
];
// Same equip catalog as the Sklep (zwykły/rzadki/elitarny only), so anything
// buyable legally is also buyable here — at the usual black-market markup.
export const illegalEquipGoods: IllegalGood[] = characterInventoryItemsData.filter((item) => storefrontTiers.has(item.tier)).map((item) => ({ id: item.id, name: item.name, price: item.price, tier: item.tier, render: { kind: 'image', src: item.asset } }));
export const illegalGoodsPool: IllegalGood[] = [...illegalFlavorGoods, ...illegalEquipGoods];
export const illegalEquipIds = new Set(illegalEquipGoods.map((item) => item.id));
