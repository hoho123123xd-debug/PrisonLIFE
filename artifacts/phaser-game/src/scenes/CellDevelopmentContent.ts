import Phaser from 'phaser';
import type { GameState } from '../game/state';
import { CELL_UPGRADE_MAX_LEVEL, cellUpgradeCost, cellUpgradeItems, describeCellBonus, type CellUpgradeId } from '../data/cell';

type Ctx = {
  onNotice: (message: string) => void;
  onChange: () => void;
  addTimer: (timer: Phaser.Time.TimerEvent) => void;
};

// Ported from prison-life's CellDevelopmentView: a list of 8 upgradeable
// cell items, each leveling 0-20 with a geometrically growing cost and a
// bonus that (for bed/sink/table/training) feeds real systems elsewhere -
// energy regen, work payout, training stat gains.
export function buildCellDevelopmentScene(
  scene: Phaser.Scene,
  container: Phaser.GameObjects.Container,
  area: { x: number; y: number; width: number; height: number },
  player: GameState,
  ctx: Ctx,
) {
  const selectedId: CellUpgradeId = player.selectedCellUpgradeId;
  const selected = cellUpgradeItems.find((item) => item.id === selectedId)!;
  const selectedLevel = player.cellLevelOf(selectedId);
  const atMax = selectedLevel >= CELL_UPGRADE_MAX_LEVEL;
  const cost = atMax ? 0 : cellUpgradeCost(selected, selectedLevel);

  const listX = area.x + 40;
  const listY = area.y + 20;
  const listW = 260;

  container.add(
    scene.add.text(listX, listY - 4, 'ELEMENTY CELI', { fontFamily: 'Arial, sans-serif', fontSize: '11px', fontStyle: 'bold', color: '#8d928f' }),
  );

  cellUpgradeItems.forEach((item, i) => {
    const y = listY + 24 + i * 44;
    const active = item.id === selectedId;
    const level = player.cellLevelOf(item.id);
    const box = scene.add
      .rectangle(listX, y, listW, 36, 0x14181a, 0.92)
      .setOrigin(0)
      .setStrokeStyle(2, active ? 0xe0873d : 0x3a3f3c)
      .setInteractive({ useHandCursor: true });
    container.add(box);
    container.add(
      scene.add.text(listX + 12, y + 8, item.label, { fontFamily: 'Arial, sans-serif', fontSize: '11px', fontStyle: 'bold', color: active ? '#eee8de' : '#c9cec9' }),
    );
    container.add(
      scene.add.text(listX + 12, y + 22, `Poziom ${level}/${CELL_UPGRADE_MAX_LEVEL}`, { fontFamily: 'Arial, sans-serif', fontSize: '9px', color: '#6c716e' }),
    );
    box.on('pointerdown', () => {
      player.selectedCellUpgradeId = item.id;
      ctx.onChange();
    });
  });

  // Detail panel for the selected item.
  const detailX = listX + listW + 40;
  const detailW = Math.max(280, area.width - listW - 120);
  let dy = listY;

  container.add(
    scene.add.text(detailX, dy, selected.label, { fontFamily: 'Oswald, Arial, sans-serif', fontSize: '20px', fontStyle: 'bold', color: '#eee8de' }),
  );
  dy += 30;
  container.add(
    scene.add.text(detailX, dy, `Poziom ${selectedLevel}/${CELL_UPGRADE_MAX_LEVEL}`, { fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#8d928f' }),
  );
  dy += 24;

  const trackW = Math.min(360, detailW);
  container.add(scene.add.rectangle(detailX, dy, trackW, 8, 0x14181a).setOrigin(0).setStrokeStyle(1, 0x3a3f3c));
  container.add(scene.add.rectangle(detailX, dy, trackW * (selectedLevel / CELL_UPGRADE_MAX_LEVEL), 8, 0xe0873d).setOrigin(0));
  dy += 24;

  container.add(
    scene.add.text(detailX, dy, `AKTUALNY BONUS: ${describeCellBonus(selected, selectedLevel)}`, { fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#c9cec9' }),
  );
  dy += 30;

  if (atMax) {
    container.add(
      scene.add.text(detailX, dy, 'POZIOM MAKSYMALNY', { fontFamily: 'Arial, sans-serif', fontSize: '12px', fontStyle: 'bold', color: '#e0873d' }),
    );
    dy += 36;
  } else {
    container.add(
      scene.add.text(detailX, dy, `NASTĘPNY POZIOM: ${describeCellBonus(selected, selectedLevel + 1)}`, { fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#8d928f' }),
    );
    dy += 22;
    container.add(
      scene.add.text(detailX, dy, `KOSZT ULEPSZENIA: ${cost} $`, { fontFamily: 'Arial, sans-serif', fontSize: '13px', fontStyle: 'bold', color: '#eee8de' }),
    );
    dy += 34;
  }

  const canAfford = !atMax && player.canAffordMoney(cost);
  const btn = scene.add
    .rectangle(detailX, dy, 220, 42, atMax ? 0x1c2020 : canAfford ? 0xe0873d : 0x1c2020, 0.95)
    .setOrigin(0)
    .setInteractive({ useHandCursor: !atMax });
  container.add(btn);
  container.add(
    scene.add
      .text(detailX + 110, dy + 21, atMax ? 'MAKSYMALNY POZIOM' : 'ULEPSZ', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '13px',
        fontStyle: 'bold',
        color: atMax || !canAfford ? '#5c615e' : '#14181a',
      })
      .setOrigin(0.5),
  );
  if (!atMax) {
    btn.on('pointerdown', () => {
      const newLevel = player.upgradeCellItem(selectedId);
      if (newLevel !== null) {
        ctx.onNotice(`Ulepszono: ${selected.label.toLowerCase()} do poziomu ${newLevel}.`);
        ctx.onChange();
      } else {
        ctx.onNotice(`Potrzebujesz ${cost} $, aby ulepszyć: ${selected.label.toLowerCase()}.`);
      }
    });
  }

  // Cell-wide stat summary, mirroring the original's "STATYSTYKI CELI" panel.
  const statsX = detailX;
  let statsY = dy + 70;
  const summary: Array<[string, string]> = [
    ['Regeneracja energii', `+${player.cellLevelOf('bed') * 5 + player.cellLevelOf('sink') * 3}%`],
    ['Pojemność ekwipunku', `+${player.cellLevelOf('locker') * 5}`],
    ['Efektywność pracy', `+${player.cellLevelOf('table') * 3}%`],
    ['Efektywność treningu', `+${player.cellLevelOf('training') * 4}%`],
    ['Morale', `+${player.cellLevelOf('tv') * 4}%`],
    ['Bezpieczeństwo', `+${player.cellLevelOf('extras') * 3}%`],
  ];
  if (statsY < area.y + area.height - 40) {
    container.add(scene.add.text(statsX, statsY, 'STATYSTYKI CELI', { fontFamily: 'Arial, sans-serif', fontSize: '11px', fontStyle: 'bold', color: '#8d928f' }));
    statsY += 20;
    summary.forEach(([label, value]) => {
      container.add(scene.add.text(statsX, statsY, label, { fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#c9cec9' }));
      container.add(scene.add.text(statsX + 220, statsY, value, { fontFamily: 'Arial, sans-serif', fontSize: '10px', fontStyle: 'bold', color: '#e0873d' }));
      statsY += 18;
    });
  }
}
