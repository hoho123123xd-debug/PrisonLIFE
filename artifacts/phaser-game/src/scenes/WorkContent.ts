import Phaser from 'phaser';
import type { GameState } from '../game/state';
import { formatDuration, workHourlyRate, workMaxHours, workMinHours } from '../data/activities';
import { cellWorkBonusPercent } from '../data/cell';

type Ctx = {
  onNotice: (message: string) => void;
  onChange: () => void;
  addTimer: (timer: Phaser.Time.TimerEvent) => void;
};

// Ported from prison-life's WorkView. The hours slider becomes a row of
// clickable +/- buttons (Phaser has no native slider widget) - same
// hourMin/hourMax/hourlyRate math either way.
export function buildWorkScene(
  scene: Phaser.Scene,
  container: Phaser.GameObjects.Container,
  area: { x: number; y: number; width: number; height: number },
  player: GameState,
  ctx: Ctx,
) {
  const cx = area.x + 40;
  let y = area.y + 30;
  const hourlyRate = Math.round(workHourlyRate * (1 + cellWorkBonusPercent(player.cellUpgradeLevels) / 100));

  container.add(
    scene.add.text(cx, y, 'PRACA', {
      fontFamily: 'Oswald, Arial, sans-serif',
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#eee8de',
    }),
  );
  y += 40;
  container.add(
    scene.add.text(cx, y, 'ZARABIAJ PIENIĄDZE, PRACUJĄC NA ODDZIALE.', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '12px',
      color: '#8d928f',
    }),
  );
  y += 50;

  // Tick the countdown once a second while work is in progress - resolves
  // the timer's effects (which the shared tick logic below also runs
  // immediately once so a rebuild picks up a just-finished session).
  const resolveIfDone = () => {
    const work = player.activeWork;
    if (!work) return false;
    if (Date.now() >= work.endsAt) {
      const reward = Math.round((work.totalMs / (60 * 60 * 1000)) * hourlyRate);
      player.activeWork = null;
      player.addMoney(reward);
      ctx.onNotice(`Praca zakończona. Otrzymano: ${reward} $.`);
      return true;
    }
    return false;
  };

  if (resolveIfDone()) {
    ctx.onChange();
    return;
  }

  if (player.activeWork) {
    const work = player.activeWork;
    const remainingMs = Math.max(0, work.endsAt - Date.now());
    const progressPct = work.totalMs > 0 ? Math.min(100, ((work.totalMs - remainingMs) / work.totalMs) * 100) : 0;
    const reward = Math.round((work.totalMs / (60 * 60 * 1000)) * hourlyRate);

    container.add(
      scene.add.text(cx, y, 'PRACA W TOKU: SPRZĄTANIE ODDZIAŁU', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '13px',
        fontStyle: 'bold',
        color: '#e0873d',
      }),
    );
    y += 36;
    container.add(
      scene.add.text(cx, y, formatDuration(remainingMs), {
        fontFamily: 'Oswald, Arial, sans-serif',
        fontSize: '40px',
        fontStyle: 'bold',
        color: '#eee8de',
      }),
    );
    y += 60;

    const trackW = Math.min(500, area.width - 80);
    container.add(scene.add.rectangle(cx, y, trackW, 10, 0x14181a).setOrigin(0).setStrokeStyle(1, 0x3a3f3c));
    container.add(scene.add.rectangle(cx, y, (trackW * progressPct) / 100, 10, 0xe0873d).setOrigin(0));
    y += 30;

    container.add(
      scene.add.text(cx, y, `PRZEWIDYWANE WYNAGRODZENIE: ${reward} $`, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '13px',
        color: '#c9cec9',
      }),
    );

    const timer = scene.time.addEvent({ delay: 1000, loop: true, callback: () => ctx.onChange() });
    ctx.addTimer(timer);
    return;
  }

  // Idle: hours picker + start button.
  const hours = player.selectedWorkHours;
  const reward = hours * hourlyRate;

  container.add(
    scene.add.text(cx, y, `Stawka: ${hourlyRate} $ za godzinę  •  Dostępny czas: ${workMinHours}-${workMaxHours}h`, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '12px',
      color: '#c9cec9',
    }),
  );
  y += 46;

  container.add(
    scene.add.text(cx, y, 'WYBIERZ CZAS PRACY', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '11px',
      fontStyle: 'bold',
      color: '#8d928f',
    }),
  );
  y += 26;

  const stepBtn = (dx: number, label: string, delta: number) => {
    const box = scene.add
      .rectangle(cx + dx, y, 36, 36, 0x14181a, 0.95)
      .setOrigin(0)
      .setStrokeStyle(1, 0xe0873d)
      .setInteractive({ useHandCursor: true });
    container.add(box);
    container.add(
      scene.add
        .text(cx + dx + 18, y + 18, label, { fontFamily: 'Arial, sans-serif', fontSize: '18px', fontStyle: 'bold', color: '#e0873d' })
        .setOrigin(0.5),
    );
    box.on('pointerdown', () => {
      player.selectedWorkHours = Phaser.Math.Clamp(player.selectedWorkHours + delta, workMinHours, workMaxHours);
      ctx.onChange();
    });
  };
  stepBtn(0, '-', -1);
  container.add(
    scene.add
      .text(cx + 60, y + 18, `${hours} GODZIN`, { fontFamily: 'Oswald, Arial, sans-serif', fontSize: '16px', fontStyle: 'bold', color: '#eee8de' })
      .setOrigin(0, 0.5),
  );
  stepBtn(220, '+', 1);
  y += 56;

  container.add(
    scene.add.text(cx, y, `PRZEWIDYWANE WYNAGRODZENIE: ${reward} $`, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#eee8de',
    }),
  );
  y += 40;

  const startBtn = scene.add
    .rectangle(cx, y, 260, 46, 0xe0873d, 0.9)
    .setOrigin(0)
    .setInteractive({ useHandCursor: true });
  container.add(startBtn);
  container.add(
    scene.add
      .text(cx + 130, y + 23, 'ROZPOCZNIJ PRACĘ', { fontFamily: 'Arial, sans-serif', fontSize: '14px', fontStyle: 'bold', color: '#14181a' })
      .setOrigin(0.5),
  );
  startBtn.on('pointerdown', () => {
    const totalMs = player.selectedWorkHours * 60 * 60 * 1000;
    player.activeWork = { totalMs, endsAt: Date.now() + totalMs };
    ctx.onChange();
  });
}
