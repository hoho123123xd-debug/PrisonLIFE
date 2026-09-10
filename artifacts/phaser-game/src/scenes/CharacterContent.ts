import Phaser from 'phaser';
import type { GameState } from '../game/state';
import { characterEquipmentSlots, STAT_TONE_COLORS, statUpgradeCost } from '../data/character';
import { characterInventoryItemsData, itemTierConfig, type ItemInstance } from '../data/items';

// Ported from prison-life's CharacterView (artifacts/prison-life/src/App.tsx).
// The original used native HTML5 drag-and-drop to equip/unequip/sell;
// Phaser has no equivalent for free, so this uses a simpler click model
// instead - click an empty/filled slot to see a hint or unequip, click an
// inventory item to equip it (into its own catalog slot, no mismatch case
// possible), right-click an inventory item to sell it. Same underlying
// logic (GameState.equipInstance/unequipSlot/sellInstance/increaseStat),
// just a different input scheme.

const SLOT_SIZE = 60;
const SLOT_GAP = 14;
const INVENTORY_WIDTH = 300;
const INVENTORY_ITEM_SIZE = 56;
const INVENTORY_GAP = 10;
const INVENTORY_COLS = 4;
const STATS_PANEL_HEIGHT = 230;

type Ctx = { onNotice: (message: string) => void; onChange: () => void };

export function buildCharacterScene(
  scene: Phaser.Scene,
  container: Phaser.GameObjects.Container,
  area: { x: number; y: number; width: number; height: number },
  player: GameState,
  ctx: Ctx,
) {
  const topH = Math.max(1, area.height - STATS_PANEL_HEIGHT - 24);

  buildEquipmentRail(scene, container, area, player, ctx);
  buildCharacterPlaceholder(scene, container, area, topH);
  buildInventory(scene, container, area, topH, player, ctx);
  buildStatsPanel(scene, container, area, topH, player, ctx);
}

function buildEquipmentRail(
  scene: Phaser.Scene,
  container: Phaser.GameObjects.Container,
  area: { x: number; y: number; width: number; height: number },
  player: GameState,
  ctx: Ctx,
) {
  const railX = area.x + 20;
  const railY = area.y + 20;

  characterEquipmentSlots.forEach((slot, i) => {
    const y = railY + i * (SLOT_SIZE + SLOT_GAP);
    const equipped = player.getEquippedItem(slot.id);

    const box = scene.add
      .rectangle(railX, y, SLOT_SIZE, SLOT_SIZE, 0x14181a, 0.92)
      .setOrigin(0)
      .setStrokeStyle(2, equipped ? 0xe0873d : 0x3a3f3c)
      .setInteractive({ useHandCursor: true });
    container.add(box);

    if (equipped) {
      const icon = scene.add.image(railX + SLOT_SIZE / 2, y + SLOT_SIZE / 2, `item-${equipped.item.id}`);
      icon.setDisplaySize(SLOT_SIZE - 18, SLOT_SIZE - 18);
      container.add(icon);
    } else {
      const label = scene.add
        .text(railX + SLOT_SIZE / 2, y + SLOT_SIZE / 2, slot.label, {
          fontFamily: 'Arial, sans-serif',
          fontSize: '9px',
          color: '#6c716e',
          align: 'center',
          wordWrap: { width: SLOT_SIZE - 8 },
        })
        .setOrigin(0.5);
      container.add(label);
    }

    box.on('pointerdown', () => {
      if (!equipped) {
        ctx.onNotice(`${slot.label}: kliknij pasujący przedmiot w ekwipunku, aby założyć.`);
        return;
      }
      const name = player.unequipSlot(slot.id);
      if (name) {
        ctx.onNotice(`${name}: zdjęto.`);
        ctx.onChange();
      }
    });
  });
}

function buildCharacterPlaceholder(
  scene: Phaser.Scene,
  container: Phaser.GameObjects.Container,
  area: { x: number; y: number; width: number; height: number },
  topH: number,
) {
  const x = area.x + 20 + SLOT_SIZE + 20;
  const width = Math.max(1, area.width - (SLOT_SIZE + 40) - INVENTORY_WIDTH - 40);
  const panel = scene.add.rectangle(x, area.y + 20, width, topH - 20, 0x0a0d0e, 0.6).setOrigin(0).setStrokeStyle(1, 0x3a3f3c);
  container.add(panel);
  const label = scene.add
    .text(x + width / 2, area.y + 20 + (topH - 20) / 2, 'MODEL POSTACI\n(do zrobienia)', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '13px',
      color: '#4a4f4c',
      align: 'center',
    })
    .setOrigin(0.5);
  container.add(label);
}

function buildInventory(
  scene: Phaser.Scene,
  container: Phaser.GameObjects.Container,
  area: { x: number; y: number; width: number; height: number },
  topH: number,
  player: GameState,
  ctx: Ctx,
) {
  const invX = area.x + area.width - INVENTORY_WIDTH - 20;
  const invY = area.y + 20;

  const heading = scene.add.text(invX, invY, 'EKWIPUNEK', {
    fontFamily: 'Arial, sans-serif',
    fontSize: '13px',
    fontStyle: 'bold',
    color: '#eee8de',
  });
  container.add(heading);

  const equippedIds = new Set(Object.values(player.equipped).filter((value): value is string => Boolean(value)));
  const gridY = invY + 28;

  const entries = player.ownedItems
    .filter((instance) => !equippedIds.has(instance.instanceId))
    .map((instance) => ({ instance, item: itemById(instance.itemId) }))
    .filter((entry): entry is { instance: ItemInstance; item: NonNullable<ReturnType<typeof itemById>> } => Boolean(entry.item));

  entries.forEach(({ instance, item }, i) => {
    const col = i % INVENTORY_COLS;
    const row = Math.floor(i / INVENTORY_COLS);
    const x = invX + col * (INVENTORY_ITEM_SIZE + INVENTORY_GAP);
    const y = gridY + row * (INVENTORY_ITEM_SIZE + INVENTORY_GAP);

    const box = scene.add
      .rectangle(x, y, INVENTORY_ITEM_SIZE, INVENTORY_ITEM_SIZE, 0x14181a, 0.92)
      .setOrigin(0)
      .setStrokeStyle(1, 0x3a3f3c)
      .setInteractive({ useHandCursor: true });
    container.add(box);

    const tierColor = Phaser.Display.Color.HexStringToColor(itemTierConfig[item.tier].color).color;
    const tierStrip = scene.add.rectangle(x, y, INVENTORY_ITEM_SIZE, 4, tierColor).setOrigin(0);
    container.add(tierStrip);

    const icon = scene.add.image(x + INVENTORY_ITEM_SIZE / 2, y + INVENTORY_ITEM_SIZE / 2 + 2, `item-${item.id}`);
    icon.setDisplaySize(INVENTORY_ITEM_SIZE - 16, INVENTORY_ITEM_SIZE - 16);
    container.add(icon);

    box.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.rightButtonDown()) {
        const sold = player.sellInstance(instance.instanceId);
        if (sold) {
          ctx.onNotice(`Sprzedano: ${sold.name.toLowerCase()} za ${sold.value} $.`);
          ctx.onChange();
        }
        return;
      }
      const name = player.equipInstance(instance.instanceId);
      if (name) {
        ctx.onNotice(`Założono: ${name.toLowerCase()}.`);
        ctx.onChange();
      }
    });
  });

  if (entries.length === 0) {
    const empty = scene.add.text(invX, gridY, 'Puste - kup coś w Sklepie.', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '11px',
      color: '#6c716e',
    });
    container.add(empty);
  }
}

// GameState only exposes items by slot/instance; the inventory grid needs a
// plain itemId -> catalog lookup for unequipped items.
function itemById(itemId: string) {
  return characterInventoryItemsData.find((entry) => entry.id === itemId);
}

function buildStatsPanel(
  scene: Phaser.Scene,
  container: Phaser.GameObjects.Container,
  area: { x: number; y: number; width: number; height: number },
  topH: number,
  player: GameState,
  ctx: Ctx,
) {
  const panelY = area.y + topH + 8;
  const panelH = area.height - topH - 8;
  const bg = scene.add.rectangle(area.x + 20, panelY, area.width - 40, panelH - 8, 0x0a0d0e, 0.75).setOrigin(0).setStrokeStyle(1, 0x3a3f3c);
  container.add(bg);

  const rowH = (panelH - 24) / player.stats.length;
  const equipmentBonuses = player.equipmentStatBonuses;
  const foodBonuses = player.foodStatBonuses;
  const bonuses: Record<string, number> = {};
  for (const key of new Set([...Object.keys(equipmentBonuses), ...Object.keys(foodBonuses)])) {
    bonuses[key] = (equipmentBonuses[key] ?? 0) + (foodBonuses[key] ?? 0);
  }

  player.stats.forEach((stat, i) => {
    const y = panelY + 12 + i * rowH;
    const toneColor = STAT_TONE_COLORS[stat.tone] ?? 0xe0873d;
    const bonus = bonuses[stat.key] ?? 0;
    const displayValue = stat.value + bonus;
    const atMax = stat.value >= stat.max;
    const cost = statUpgradeCost(stat.value);

    const swatch = scene.add.rectangle(area.x + 32, y + rowH / 2 - 8, 16, 16, toneColor).setOrigin(0);
    container.add(swatch);

    const label = scene.add.text(area.x + 60, y, `${stat.label}`, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#eee8de',
    });
    container.add(label);

    const desc = scene.add.text(area.x + 60, y + 15, stat.description, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '10px',
      color: '#8d928f',
    });
    container.add(desc);

    const valueText = scene.add
      .text(area.x + area.width - 220, y + 4, `${displayValue}${bonus > 0 ? ` (+${bonus})` : ''}`, {
        fontFamily: 'Oswald, Arial, sans-serif',
        fontSize: '14px',
        fontStyle: 'bold',
        color: '#eee8de',
      })
      .setOrigin(0, 0);
    container.add(valueText);

    const btnW = 150;
    const btnH = 30;
    const btnX = area.x + area.width - 40 - btnW;
    const btn = scene.add
      .rectangle(btnX, y, btnW, btnH, atMax ? 0x1c2020 : 0x14181a, 0.95)
      .setOrigin(0)
      .setStrokeStyle(1, atMax ? 0x3a3f3c : 0xe0873d)
      .setInteractive({ useHandCursor: !atMax });
    container.add(btn);
    const btnLabel = scene.add
      .text(btnX + btnW / 2, y + btnH / 2, atMax ? 'MAKSYMALNY POZIOM' : `NASTĘPNY PUNKT: ${cost} $`, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '10px',
        fontStyle: 'bold',
        color: atMax ? '#5c615e' : '#e0873d',
        align: 'center',
        wordWrap: { width: btnW - 12 },
      })
      .setOrigin(0.5);
    container.add(btnLabel);

    if (!atMax) {
      btn.on('pointerdown', () => {
        const paid = player.increaseStat(stat.key);
        if (paid !== null) {
          ctx.onNotice(`Rozwinięto statystykę: ${stat.label.toLowerCase()} (-${paid} $).`);
          ctx.onChange();
        } else if (!player.canAffordMoney(cost)) {
          ctx.onNotice(`Brak środków na rozwój (${stat.label.toLowerCase()}). Potrzebujesz ${cost} $.`);
        }
      });
    }
  });
}
