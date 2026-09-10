import Phaser from 'phaser';
import type { GameState } from '../game/state';
import {
  computeFightPower,
  FIGHT_ENERGY_COST,
  fightOpponents,
  fightStatMeta,
  randomInRange,
  type FightStatKey,
} from '../data/activities';
import { ITEM_DROP_CHANCE, pickRandomLootItem, POINT_DROP_CHANCE, rollItemInstance } from '../data/items';

type Ctx = {
  onNotice: (message: string) => void;
  onChange: () => void;
  addTimer: (timer: Phaser.Time.TimerEvent) => void;
};

const LIST_W = 220;
const DETAIL_W = 300;

// Ported from prison-life's FightView - opponent roster, stat compare bars,
// and computeFightPower's instant-resolve combat math are all unchanged.
// Opponent portraits and the registration-environment background were
// AI-generated placeholder art there; dropped here like elsewhere.
export function buildFightScene(
  scene: Phaser.Scene,
  container: Phaser.GameObjects.Container,
  area: { x: number; y: number; width: number; height: number },
  player: GameState,
  ctx: Ctx,
) {
  const opponent = fightOpponents.find((entry) => entry.id === player.selectedFightOpponentId) ?? fightOpponents[0];
  const playerStats: Record<FightStatKey, number> = Object.fromEntries(
    player.stats.map((stat) => [stat.key, stat.value]),
  ) as Record<FightStatKey, number>;

  const listX = area.x + 20;
  const listY = area.y + 20;

  container.add(
    scene.add.text(listX, listY - 6, 'PRZECIWNICY', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '11px',
      fontStyle: 'bold',
      color: '#8d928f',
    }),
  );

  fightOpponents.forEach((entry, i) => {
    const y = listY + 24 + i * 56;
    const active = entry.id === opponent.id;
    const box = scene.add
      .rectangle(listX, y, LIST_W, 46, 0x14181a, 0.92)
      .setOrigin(0)
      .setStrokeStyle(2, active ? 0xe0873d : 0x3a3f3c)
      .setInteractive({ useHandCursor: true });
    container.add(box);
    container.add(
      scene.add.text(listX + 12, y + 10, entry.name, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '13px',
        fontStyle: 'bold',
        color: active ? '#eee8de' : '#c9cec9',
      }),
    );
    container.add(
      scene.add.text(listX + 12, y + 28, `POZIOM ${entry.level}`, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '10px',
        color: '#6c716e',
      }),
    );
    box.on('pointerdown', () => {
      player.selectedFightOpponentId = entry.id;
      player.lastFightResult = null;
      ctx.onChange();
    });
  });

  // Stat compare panel.
  const cmpX = listX + LIST_W + 30;
  const cmpW = Math.max(260, area.width - LIST_W - DETAIL_W - 100);
  let cy = listY;
  container.add(
    scene.add.text(cmpX, cy, `${player.nickname.toUpperCase()}  vs  ${opponent.name}`, {
      fontFamily: 'Oswald, Arial, sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#eee8de',
    }),
  );
  cy += 34;

  fightStatMeta.forEach(({ key, label }) => {
    const playerValue = playerStats[key];
    const opponentValue = opponent.stats[key];
    const max = Math.max(playerValue, opponentValue, 1);

    container.add(
      scene.add.text(cmpX, cy, `${label}`, { fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#8d928f' }),
    );
    cy += 16;

    const barW = cmpW;
    container.add(scene.add.rectangle(cmpX, cy, barW, 8, 0x14181a).setOrigin(0).setStrokeStyle(1, 0x3a3f3c));
    container.add(scene.add.rectangle(cmpX, cy, (barW / 2) * (playerValue / max), 8, 0x4f8fd6).setOrigin(0));
    container.add(
      scene.add
        .rectangle(cmpX + barW, cy, (barW / 2) * (opponentValue / max), 8, 0xe0473d)
        .setOrigin(1, 0),
    );
    container.add(
      scene.add.text(cmpX, cy + 12, `${playerValue}`, { fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#4f8fd6' }),
    );
    container.add(
      scene.add
        .text(cmpX + barW, cy + 12, `${opponentValue}`, { fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#e0473d' })
        .setOrigin(1, 0),
    );
    cy += 32;
  });

  // Opponent detail + attack panel.
  const detailX = area.x + area.width - DETAIL_W - 20;
  let dy = listY;
  container.add(
    scene.add.text(detailX, dy, opponent.name, {
      fontFamily: 'Oswald, Arial, sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#eee8de',
    }),
  );
  dy += 24;
  container.add(
    scene.add.text(detailX, dy, `POZIOM ${opponent.level}`, { fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#8d928f' }),
  );
  dy += 26;
  container.add(
    scene.add.text(detailX, dy, opponent.description, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '11px',
      color: '#c9cec9',
      wordWrap: { width: DETAIL_W - 10 },
    }),
  );
  dy += 66;
  container.add(
    scene.add.text(detailX, dy, `„${opponent.quote}”`, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '11px',
      fontStyle: 'italic',
      color: '#6c716e',
      wordWrap: { width: DETAIL_W - 10 },
    }),
  );
  dy += 50;

  container.add(
    scene.add.text(detailX, dy, `NAGRODY: ${opponent.rewardMoney[0]}-${opponent.rewardMoney[1]} $  •  łup: ${Math.round(ITEM_DROP_CHANCE * 100)}% szans`, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '10px',
      color: '#8d928f',
      wordWrap: { width: DETAIL_W - 10 },
    }),
  );
  dy += 30;
  container.add(
    scene.add.text(detailX, dy, `KOSZT ENERGII: ${FIGHT_ENERGY_COST}`, { fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#e0873d' }),
  );
  dy += 30;

  const canAfford = player.energy >= FIGHT_ENERGY_COST;
  const attackBtn = scene.add
    .rectangle(detailX, dy, DETAIL_W - 10, 44, canAfford ? 0xe0873d : 0x1c2020, 0.95)
    .setOrigin(0)
    .setInteractive({ useHandCursor: canAfford });
  container.add(attackBtn);
  container.add(
    scene.add
      .text(detailX + (DETAIL_W - 10) / 2, dy + 22, canAfford ? 'ATAKUJ' : 'BRAK ENERGII', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        fontStyle: 'bold',
        color: canAfford ? '#14181a' : '#5c615e',
      })
      .setOrigin(0.5),
  );

  if (canAfford) {
    attackBtn.on('pointerdown', () => {
      if (!player.removeEnergy(FIGHT_ENERGY_COST)) {
        ctx.onNotice(`Potrzebujesz ${FIGHT_ENERGY_COST} energii, aby zaatakować.`);
        return;
      }
      const playerPower = computeFightPower(playerStats);
      const opponentPower = computeFightPower(opponent.stats);
      const won = Math.random() < playerPower / (playerPower + opponentPower);
      const respectChange = won ? Math.max(1, Math.round(5 + (opponent.level - player.level) * 2)) : 0;
      let moneyChange: number;
      let itemWon: string | null = null;
      let pointsWon = 0;
      if (won) {
        moneyChange = randomInRange(opponent.rewardMoney);
        player.addMoney(moneyChange);
        player.addReputation(respectChange);
        if (Math.random() < ITEM_DROP_CHANCE) {
          const loot = pickRandomLootItem(player.level);
          if (loot) {
            player.ownedItems.push(rollItemInstance(loot.id));
            itemWon = loot.name;
          }
        }
        if (Math.random() < POINT_DROP_CHANCE) {
          player.addPoints(1);
          pointsWon = 1;
        }
      } else {
        moneyChange = -Math.round(player.balance * 0.1);
        player.removeMoney(-moneyChange);
      }
      player.save();
      player.lastFightResult = { won, opponentId: opponent.id, respectChange, moneyChange, itemWon, pointsWon };
      ctx.onChange();
    });
  }

  if (player.lastFightResult) {
    buildResultOverlay(scene, container, area, player, player.lastFightResult, ctx);
  }
}

function buildResultOverlay(
  scene: Phaser.Scene,
  container: Phaser.GameObjects.Container,
  area: { x: number; y: number; width: number; height: number },
  player: GameState,
  result: NonNullable<GameState['lastFightResult']>,
  ctx: Ctx,
) {
  const opponent = fightOpponents.find((entry) => entry.id === result.opponentId);
  const scrim = scene.add.rectangle(area.x, area.y, area.width, area.height, 0x000000, 0.7).setOrigin(0).setDepth(2000);
  container.add(scrim);

  const modalW = 360;
  const modalH = 260;
  const modalX = area.x + (area.width - modalW) / 2;
  const modalY = area.y + (area.height - modalH) / 2;
  const modal = scene.add
    .rectangle(modalX, modalY, modalW, modalH, 0x14181a, 0.98)
    .setOrigin(0)
    .setStrokeStyle(2, result.won ? 0xe0873d : 0xe0473d)
    .setDepth(2001);
  container.add(modal);

  let ry = modalY + 24;
  container.add(
    scene.add
      .text(modalX + modalW / 2, ry, result.won ? 'ZWYCIĘSTWO!' : 'PORAŻKA', {
        fontFamily: 'Oswald, Arial, sans-serif',
        fontSize: '22px',
        fontStyle: 'bold',
        color: result.won ? '#e0873d' : '#e0473d',
      })
      .setOrigin(0.5)
      .setDepth(2002),
  );
  ry += 36;
  container.add(
    scene.add
      .text(modalX + modalW / 2, ry, result.won ? `Pokonałeś: ${opponent?.name ?? '???'}.` : `${opponent?.name ?? '???'} okazał się silniejszy.`, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        color: '#c9cec9',
      })
      .setOrigin(0.5)
      .setDepth(2002),
  );
  ry += 40;

  const lines: string[] = [];
  if (result.won) lines.push(`+${result.respectChange} SZACUNKU`);
  lines.push(`${result.moneyChange >= 0 ? '+' : ''}${result.moneyChange} $`);
  if (result.itemWon) lines.push(`Łup: ${result.itemWon}`);
  if (result.pointsWon > 0) lines.push(`+${result.pointsWon} PKT`);

  for (const line of lines) {
    container.add(
      scene.add
        .text(modalX + modalW / 2, ry, line, { fontFamily: 'Arial, sans-serif', fontSize: '13px', fontStyle: 'bold', color: '#eee8de' })
        .setOrigin(0.5)
        .setDepth(2002),
    );
    ry += 22;
  }

  ry += 14;
  const closeBtn = scene.add
    .rectangle(modalX + modalW / 2 - 60, ry, 120, 36, 0xe0873d, 0.95)
    .setOrigin(0)
    .setInteractive({ useHandCursor: true })
    .setDepth(2002);
  container.add(closeBtn);
  container.add(
    scene.add
      .text(modalX + modalW / 2, ry + 18, 'OK', { fontFamily: 'Arial, sans-serif', fontSize: '13px', fontStyle: 'bold', color: '#14181a' })
      .setOrigin(0.5)
      .setDepth(2002),
  );
  closeBtn.on('pointerdown', () => {
    player.lastFightResult = null;
    ctx.onChange();
  });
}
