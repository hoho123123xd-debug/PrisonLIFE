import Phaser from 'phaser';
import type { GameState } from '../game/state';
import {
  itemTierConfig,
  legalEquipIds,
  illegalEquipIds,
  legalGoodsPool,
  illegalGoodsPool,
  OFFER_REFRESH_COST,
  type LegalGood,
  type IllegalGood,
} from '../data/items';
import { canteenMeals, type Meal } from '../data/canteen';

type Ctx = {
  onNotice: (message: string) => void;
  onChange: () => void;
  addTimer: (timer: Phaser.Time.TimerEvent) => void;
};

const CARD_W = 140;
const CARD_H = 150;
const CARD_GAP = 14;

// Shared grid renderer for Sklep/Czarny Rynek/Stolówka - ported from
// prison-life's storefront-grid markup (ShopView/MarketView/CanteenView).
// Generic (non-equipment) goods used lucide-react icons there with no
// bitmap art of their own; this draws a plain tier-colored/lettered tile
// instead of inventing new icon assets.
function buildOfferCard(
  scene: Phaser.Scene,
  container: Phaser.GameObjects.Container,
  x: number,
  y: number,
  name: string,
  price: number,
  tier: string | undefined,
  imageKey: string | undefined,
  onBuy: () => void,
) {
  const card = scene.add.rectangle(x, y, CARD_W, CARD_H, 0x0a0d0e, 0.8).setOrigin(0).setStrokeStyle(1, 0x3a3f3c);
  container.add(card);

  if (tier) {
    const color = Phaser.Display.Color.HexStringToColor(itemTierConfig[tier as keyof typeof itemTierConfig].color).color;
    container.add(scene.add.rectangle(x, y, CARD_W, 4, color).setOrigin(0));
  }

  if (imageKey && scene.textures.exists(imageKey)) {
    const icon = scene.add.image(x + CARD_W / 2, y + 52, imageKey);
    icon.setDisplaySize(64, 64);
    container.add(icon);
  } else {
    container.add(
      scene.add
        .text(x + CARD_W / 2, y + 52, name.slice(0, 2).toUpperCase(), {
          fontFamily: 'Oswald, Arial, sans-serif',
          fontSize: '26px',
          fontStyle: 'bold',
          color: '#3a3f3c',
        })
        .setOrigin(0.5),
    );
  }

  container.add(
    scene.add
      .text(x + CARD_W / 2, y + 92, name, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '10px',
        fontStyle: 'bold',
        color: '#c9cec9',
        align: 'center',
        wordWrap: { width: CARD_W - 12 },
      })
      .setOrigin(0.5),
  );

  container.add(
    scene.add.text(x + 10, y + CARD_H - 26, `${price} $`, {
      fontFamily: 'Oswald, Arial, sans-serif',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#eee8de',
    }),
  );

  const buyBtn = scene.add
    .rectangle(x + CARD_W - 36, y + CARD_H - 30, 26, 22, 0xe0873d, 0.95)
    .setOrigin(0)
    .setInteractive({ useHandCursor: true });
  container.add(buyBtn);
  container.add(
    scene.add
      .text(x + CARD_W - 23, y + CARD_H - 19, '🛒', { fontSize: '12px' })
      .setOrigin(0.5),
  );
  buyBtn.on('pointerdown', onBuy);
}

function buildOfferHeader(
  scene: Phaser.Scene,
  container: Phaser.GameObjects.Container,
  x: number,
  y: number,
  title: string,
  subtitle: string,
) {
  container.add(
    scene.add.text(x, y, title, {
      fontFamily: 'Oswald, Arial, sans-serif',
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#eee8de',
    }),
  );
  container.add(
    scene.add.text(x, y + 34, subtitle, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '12px',
      color: '#8d928f',
    }),
  );
}

function buildRefreshButton(
  scene: Phaser.Scene,
  container: Phaser.GameObjects.Container,
  x: number,
  y: number,
  player: GameState,
  ctx: Ctx,
  onRefresh: () => boolean,
  label: string,
) {
  const canAfford = player.points >= OFFER_REFRESH_COST;
  const btn = scene.add
    .rectangle(x, y, 220, 32, canAfford ? 0x14181a : 0x1c2020, 0.95)
    .setOrigin(0)
    .setStrokeStyle(1, canAfford ? 0xe0873d : 0x3a3f3c)
    .setInteractive({ useHandCursor: canAfford });
  container.add(btn);
  container.add(
    scene.add
      .text(x + 110, y + 16, `${label} (${OFFER_REFRESH_COST} pkt)`, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '11px',
        fontStyle: 'bold',
        color: canAfford ? '#e0873d' : '#5c615e',
      })
      .setOrigin(0.5),
  );
  if (canAfford) {
    btn.on('pointerdown', () => {
      if (onRefresh()) {
        ctx.onNotice('Asortyment został odświeżony.');
        ctx.onChange();
      }
    });
  }
}

function buildGrid<T extends { id: string; name: string; price: number; tier?: string }>(
  scene: Phaser.Scene,
  container: Phaser.GameObjects.Container,
  x: number,
  y: number,
  width: number,
  offers: T[],
  imageKeyFor: (item: T) => string | undefined,
  onBuy: (item: T) => void,
) {
  const cols = Math.max(1, Math.floor((width + CARD_GAP) / (CARD_W + CARD_GAP)));
  offers.forEach((item, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const cx = x + col * (CARD_W + CARD_GAP);
    const cy = y + row * (CARD_H + CARD_GAP);
    buildOfferCard(scene, container, cx, cy, item.name, item.price, item.tier, imageKeyFor(item), () => onBuy(item));
  });
}

export function buildShopScene(
  scene: Phaser.Scene,
  container: Phaser.GameObjects.Container,
  area: { x: number; y: number; width: number; height: number },
  player: GameState,
  ctx: Ctx,
  withHeader = true,
) {
  const x = area.x + 40;
  let y = area.y + 20;
  if (withHeader) {
    buildOfferHeader(scene, container, x, y, 'SKLEP', 'LEGALNE RZECZY. NA CO DZIEŃ.');
  }
  buildRefreshButton(scene, container, area.x + area.width - 260, y, player, ctx, () => player.refreshShopOffer(), 'ODŚWIEŻ');
  y += 60;

  const offers = player.shopOffer.ids.map((id) => legalGoodsPool.find((item) => item.id === id)).filter((item): item is LegalGood => Boolean(item));
  buildGrid(scene, container, x, y, area.width - 80, offers, (item) => (legalEquipIds.has(item.id) ? `item-${item.id}` : undefined), (item) => {
    if (!player.canAffordMoney(item.price)) {
      ctx.onNotice(`Brak środków. Potrzebujesz jeszcze ${item.price - player.balance} $.`);
      return;
    }
    if (player.buyLegalGood(item.id, item.price)) {
      const isEquip = legalEquipIds.has(item.id);
      ctx.onNotice(`Kupiono: ${item.name.toLowerCase()}.${isEquip ? ' Znajdziesz go w ekwipunku.' : ''}`);
      ctx.onChange();
    }
  });
}

export function buildMarketScene(
  scene: Phaser.Scene,
  container: Phaser.GameObjects.Container,
  area: { x: number; y: number; width: number; height: number },
  player: GameState,
  ctx: Ctx,
  withHeader = true,
) {
  const x = area.x + 40;
  let y = area.y + 20;
  if (withHeader) {
    buildOfferHeader(scene, container, x, y, 'CZARNY RYNEK', 'NIE WSZYSTKO JEST DLA WSZYSTKICH.');
  }
  buildRefreshButton(scene, container, area.x + area.width - 260, y, player, ctx, () => player.refreshMarketOffer(), 'ODŚWIEŻ');
  y += 60;

  // Gang control markup (blackMarketTaxCut in the original) is always 0
  // here until Task #8 ports GangView - the price math already accounts
  // for it so it'll apply automatically once that lands.
  const offers = player.marketOffer.ids.map((id) => illegalGoodsPool.find((item) => item.id === id)).filter((item): item is IllegalGood => Boolean(item));
  buildGrid(scene, container, x, y, area.width - 80, offers, (item) => (illegalEquipIds.has(item.id) ? `item-${item.id}` : undefined), (item) => {
    if (!player.canAffordMoney(item.price)) {
      ctx.onNotice(`Brak środków. Potrzebujesz jeszcze ${item.price - player.balance} $.`);
      return;
    }
    if (player.buyIllegalGood(item.id, item.price)) {
      const isEquip = illegalEquipIds.has(item.id);
      ctx.onNotice(`Kupiono: ${item.name.toLowerCase()}.${isEquip ? ' Znajdziesz go w ekwipunku.' : ''}`);
      ctx.onChange();
    }
  });
}

const SHOP_TABS: Array<{ key: GameState['selectedShopTab']; label: string }> = [
  { key: 'shop', label: 'SKLEP' },
  { key: 'market', label: 'CZARNY RYNEK' },
  { key: 'canteen', label: 'STOŁÓWKA' },
];

// The reference sidebar (matched to the mockup the whole HUD is built from)
// only has one SKLEP slot - Czarny Rynek and Stolówka get their own tab
// here instead of extra sidebar rows.
export function buildStorefrontHub(
  scene: Phaser.Scene,
  container: Phaser.GameObjects.Container,
  area: { x: number; y: number; width: number; height: number },
  player: GameState,
  ctx: Ctx,
) {
  const tabX = area.x + 40;
  const tabY = area.y + 20;
  let tx = tabX;
  SHOP_TABS.forEach((tab) => {
    const active = player.selectedShopTab === tab.key;
    const w = 150;
    const btn = scene.add
      .rectangle(tx, tabY, w, 32, active ? 0xe0873d : 0x14181a, 0.95)
      .setOrigin(0)
      .setStrokeStyle(1, active ? 0xe0873d : 0x3a3f3c)
      .setInteractive({ useHandCursor: true });
    container.add(btn);
    container.add(
      scene.add
        .text(tx + w / 2, tabY + 16, tab.label, {
          fontFamily: 'Arial, sans-serif',
          fontSize: '11px',
          fontStyle: 'bold',
          color: active ? '#14181a' : '#c9cec9',
        })
        .setOrigin(0.5),
    );
    btn.on('pointerdown', () => {
      player.selectedShopTab = tab.key;
      ctx.onChange();
    });
    tx += w + 10;
  });

  const subArea = { x: area.x, y: area.y + 60, width: area.width, height: area.height - 60 };
  if (player.selectedShopTab === 'market') {
    buildMarketScene(scene, container, subArea, player, ctx, false);
  } else if (player.selectedShopTab === 'canteen') {
    buildCanteenScene(scene, container, subArea, player, ctx, false);
  } else {
    buildShopScene(scene, container, subArea, player, ctx, false);
  }
}

export function buildCanteenScene(
  scene: Phaser.Scene,
  container: Phaser.GameObjects.Container,
  area: { x: number; y: number; width: number; height: number },
  player: GameState,
  ctx: Ctx,
  withHeader = true,
) {
  const x = area.x + 40;
  let y = area.y + 20;
  if (withHeader) {
    buildOfferHeader(scene, container, x, y, 'STOŁÓWKA', 'DOBRE JEDZENIE. WIĘKSZA SIŁA.');
  }
  y += 60;

  buildGrid(scene, container, x, y, area.width - 80, canteenMeals, () => undefined, (meal: Meal) => {
    if (!player.canAffordMoney(meal.price)) {
      ctx.onNotice(`Brak środków. Potrzebujesz jeszcze ${meal.price - player.balance} $.`);
      return;
    }
    if (player.buyMeal(meal)) {
      ctx.onNotice(`Zjedzono: ${meal.name.toLowerCase()}. Tymczasowy efekt aktywny przez 10 minut.`);
      ctx.onChange();
    }
  });
}
