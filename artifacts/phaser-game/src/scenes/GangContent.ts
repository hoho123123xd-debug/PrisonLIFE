import Phaser from 'phaser';
import type { GameState } from '../game/state';
import {
  blackMarketTaxCut,
  gangBenefits,
  gangEvents,
  gangFounder,
  gangMembers,
  gangName,
  gangStats,
  gangTabs,
  gangXp,
  gangXpMax,
} from '../data/gang';

type Ctx = {
  onNotice: (message: string) => void;
  onChange: () => void;
  addTimer: (timer: Phaser.Time.TimerEvent) => void;
};

// Ported from prison-life's GangView - a dashboard of mostly static/mocked
// data. The original doesn't actually branch its content on the selected
// tab either (only the tab button's own highlight changes), so most tab
// clicks here just show the same "coming soon" notice as there.
export function buildGangScene(
  scene: Phaser.Scene,
  container: Phaser.GameObjects.Container,
  area: { x: number; y: number; width: number; height: number },
  player: GameState,
  ctx: Ctx,
) {
  const x = area.x + 40;
  let y = area.y + 20;

  container.add(
    scene.add.text(x, y, gangName, {
      fontFamily: 'Oswald, Arial, sans-serif',
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#eee8de',
    }),
  );
  container.add(
    scene.add.text(x, y + 32, `Założyciel: ${gangFounder}  •  Poziom 3`, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '11px',
      color: '#8d928f',
    }),
  );

  const xpTrackW = 240;
  const xpTrackX = area.x + area.width - xpTrackW - 40;
  container.add(scene.add.rectangle(xpTrackX, y + 6, xpTrackW, 10, 0x14181a).setOrigin(0).setStrokeStyle(1, 0x3a3f3c));
  container.add(scene.add.rectangle(xpTrackX, y + 6, xpTrackW * (gangXp / gangXpMax), 10, 0xe0873d).setOrigin(0));
  container.add(
    scene.add.text(xpTrackX, y + 20, `${gangXp} / ${gangXpMax} XP`, { fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#8d928f' }),
  );

  y += 60;

  let tx = x;
  gangTabs.forEach((tab, i) => {
    const active = i === 0;
    const w = 96;
    const btn = scene.add
      .rectangle(tx, y, w, 26, active ? 0xe0873d : 0x14181a, 0.95)
      .setOrigin(0)
      .setStrokeStyle(1, active ? 0xe0873d : 0x3a3f3c)
      .setInteractive({ useHandCursor: true });
    container.add(btn);
    container.add(
      scene.add
        .text(tx + w / 2, y + 13, tab, { fontFamily: 'Arial, sans-serif', fontSize: '9px', fontStyle: 'bold', color: active ? '#14181a' : '#c9cec9' })
        .setOrigin(0.5),
    );
    btn.on('pointerdown', () => ctx.onNotice(`${tab}: panel zostanie otwarty wkrótce.`));
    tx += w + 8;
  });
  y += 46;

  const colW = (area.width - 100) / 2;
  const leftX = x;
  const rightX = x + colW + 20;
  let leftY = y;
  let rightY = y;

  // Stats grid.
  container.add(scene.add.text(leftX, leftY, 'STATYSTYKI GANGU', { fontFamily: 'Arial, sans-serif', fontSize: '11px', fontStyle: 'bold', color: '#8d928f' }));
  leftY += 20;
  gangStats.forEach((stat, i) => {
    const sx = leftX + (i % 4) * (colW / 4);
    container.add(scene.add.text(sx, leftY, stat.value, { fontFamily: 'Oswald, Arial, sans-serif', fontSize: '18px', fontStyle: 'bold', color: '#e0873d' }));
    container.add(scene.add.text(sx, leftY + 24, stat.label, { fontFamily: 'Arial, sans-serif', fontSize: '8px', color: '#6c716e', wordWrap: { width: colW / 4 - 8 } }));
  });
  leftY += 56;

  // Benefits.
  container.add(scene.add.text(leftX, leftY, 'KORZYŚCI GANGU', { fontFamily: 'Arial, sans-serif', fontSize: '11px', fontStyle: 'bold', color: '#8d928f' }));
  leftY += 20;
  gangBenefits.forEach((benefit) => {
    container.add(scene.add.text(leftX, leftY, `• ${benefit}`, { fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#c9cec9' }));
    leftY += 18;
  });
  leftY += 10;

  // Treasury.
  container.add(scene.add.text(leftX, leftY, 'SKARBIEC GANGU', { fontFamily: 'Arial, sans-serif', fontSize: '11px', fontStyle: 'bold', color: '#8d928f' }));
  leftY += 22;
  container.add(
    scene.add.text(leftX, leftY, `${player.gangTreasury.toLocaleString('pl-PL')} $`, {
      fontFamily: 'Oswald, Arial, sans-serif',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#eee8de',
    }),
  );
  const depositBtn = scene.add
    .rectangle(leftX + 180, leftY, 90, 30, 0xe0873d, 0.95)
    .setOrigin(0)
    .setInteractive({ useHandCursor: true });
  container.add(depositBtn);
  container.add(scene.add.text(leftX + 225, leftY + 15, 'WPŁAĆ', { fontFamily: 'Arial, sans-serif', fontSize: '11px', fontStyle: 'bold', color: '#14181a' }).setOrigin(0.5));
  depositBtn.on('pointerdown', () => {
    player.gangTreasury += 500;
    ctx.onNotice('Wpłacono 500 $ do skarbca.');
    ctx.onChange();
  });
  const withdrawBtn = scene.add
    .rectangle(leftX + 280, leftY, 90, 30, 0x14181a, 0.95)
    .setOrigin(0)
    .setStrokeStyle(1, 0x3a3f3c)
    .setInteractive({ useHandCursor: true });
  container.add(withdrawBtn);
  container.add(scene.add.text(leftX + 325, leftY + 15, 'WYPŁAĆ', { fontFamily: 'Arial, sans-serif', fontSize: '11px', fontStyle: 'bold', color: '#c9cec9' }).setOrigin(0.5));
  withdrawBtn.on('pointerdown', () => ctx.onNotice('Wypłata wymaga rangi oficera.'));

  // Members table.
  container.add(scene.add.text(rightX, rightY, 'CZŁONKOWIE GANGU', { fontFamily: 'Arial, sans-serif', fontSize: '11px', fontStyle: 'bold', color: '#8d928f' }));
  rightY += 22;
  gangMembers.forEach(([nick, rank, level, status], i) => {
    const rowY = rightY + i * 22;
    const online = status === 'Online';
    container.add(scene.add.text(rightX, rowY, `${i + 1}.`, { fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#6c716e' }));
    container.add(scene.add.text(rightX + 24, rowY, nick, { fontFamily: 'Arial, sans-serif', fontSize: '10px', fontStyle: 'bold', color: '#eee8de' }));
    container.add(scene.add.text(rightX + 110, rowY, rank, { fontFamily: 'Arial, sans-serif', fontSize: '10px', color: rank === 'Założyciel' ? '#e0873d' : '#c9cec9' }));
    container.add(scene.add.text(rightX + 200, rowY, `lvl ${level}`, { fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#8d928f' }));
    container.add(scene.add.text(rightX + 260, rowY, status, { fontFamily: 'Arial, sans-serif', fontSize: '10px', color: online ? '#4fae5f' : '#6c716e' }));
  });
  rightY += gangMembers.length * 22 + 20;

  // Events.
  container.add(scene.add.text(rightX, rightY, 'AKTUALNE WYDARZENIA', { fontFamily: 'Arial, sans-serif', fontSize: '11px', fontStyle: 'bold', color: '#8d928f' }));
  rightY += 20;
  gangEvents.forEach(([date, text]) => {
    container.add(scene.add.text(rightX, rightY, date, { fontFamily: 'Arial, sans-serif', fontSize: '9px', color: '#6c716e' }));
    container.add(scene.add.text(rightX + 44, rightY, text, { fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#c9cec9', wordWrap: { width: colW - 44 } }));
    rightY += 30;
  });

  const footerY = Math.max(leftY, rightY) + 20;
  if (footerY < area.y + area.height - 20) {
    container.add(
      scene.add.text(x, footerY, `Kontrola Czarnego Rynku: gang z ${blackMarketTaxCut}% haraczem od każdego zakupu.`, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '10px',
        color: '#6c716e',
      }),
    );
  }
}
