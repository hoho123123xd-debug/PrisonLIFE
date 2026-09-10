// Character equipment slots, starter loadout, and the six upgradeable
// stats - ported from artifacts/prison-life/src/App.tsx (the constants
// above CharacterView: characterEquipmentSlots, characterDefault*,
// characterStatsList, statUpgradeCost). Icons were lucide-react components
// there; dropped here in favor of a plain tone color per stat/slot, drawn
// by whatever renders this data.
import { characterInventoryItemsData, type ItemInstance } from './items';

export const characterEquipmentSlots: Array<{ id: string; label: string }> = [
  { id: 'head', label: 'GŁOWA' },
  { id: 'neck', label: 'SZYJA' },
  { id: 'torso', label: 'TORS' },
  { id: 'back', label: 'PLECY' },
  { id: 'hands', label: 'DŁONIE' },
  { id: 'legs', label: 'SPODNIE' },
  { id: 'feet', label: 'BUTY' },
  { id: 'weapon', label: 'BROŃ' },
];

export const characterDefaultEquippedItemIds: Record<string, string | null> = {
  head: 'cap',
  neck: null,
  torso: 'orange-shirt',
  back: 'black-backpack',
  hands: 'gloves',
  legs: 'orange-pants',
  feet: 'black-boots',
  weapon: 'knife',
};

// A fresh prisoner starts owning only their issued/equipped loadout.
// Starter gear gets a fixed, deterministic instance (just its catalog
// identity stat, no roll) - only things bought or looted later vary.
export const characterDefaultOwnedItems: ItemInstance[] = Object.values(characterDefaultEquippedItemIds)
  .filter((itemId): itemId is string => Boolean(itemId))
  .map((itemId) => {
    const item = characterInventoryItemsData.find((entry) => entry.id === itemId)!;
    return { instanceId: `starter-${itemId}`, itemId, bonuses: { [item.bonusStat]: item.bonusAmount } };
  });

export const characterDefaultEquipped: Record<string, string | null> = Object.fromEntries(
  Object.entries(characterDefaultEquippedItemIds).map(([slot, itemId]) => [slot, itemId ? `starter-${itemId}` : null]),
);

export type CharacterStat = { key: string; label: string; description: string; value: number; max: number; tone: string };

export const characterStatsList: CharacterStat[] = [
  { key: 'health', label: 'ZDROWIE', description: 'Więcej wytrzymałości. Dłużej na nogach.', value: 100, max: 100, tone: 'red' },
  { key: 'luck', label: 'SZCZĘŚCIE', description: 'Lepsze wydarzenia. Większe szanse.', value: 12, max: 100, tone: 'green' },
  { key: 'strength', label: 'SIŁA', description: 'Silniejsze ciosy. Większa dominacja.', value: 11, max: 100, tone: 'orange' },
  { key: 'endurance', label: 'KONDYCJA', description: 'Więcej energii. Szybsza regeneracja.', value: 17, max: 100, tone: 'blue' },
  { key: 'intelligence', label: 'INTELIGENCJA', description: 'Lepsze decyzje. Więcej możliwości.', value: 11, max: 100, tone: 'violet' },
  { key: 'reflex', label: 'REFLEKS', description: 'Szybsze reakcje. Przewaga w walce.', value: 14, max: 100, tone: 'yellow' },
];

export function statUpgradeCost(currentValue: number): number {
  return 20 + currentValue * 4;
}

export const STAT_TONE_COLORS: Record<string, number> = {
  red: 0xe0473d,
  green: 0x4fae5f,
  orange: 0xe0873d,
  blue: 0x4f8fd6,
  violet: 0xa366e0,
  yellow: 0xe0d13d,
};
