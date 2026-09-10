import Phaser from 'phaser';
import type { GameState } from '../game/state';
import { formatDuration, trainingExercises } from '../data/activities';
import { cellTrainingBonusPercent } from '../data/cell';

type Ctx = {
  onNotice: (message: string) => void;
  onChange: () => void;
  addTimer: (timer: Phaser.Time.TimerEvent) => void;
};

const CARD_W = 280;
const CARD_H = 150;
const CARD_GAP = 20;

// Ported from prison-life's TrainingExerciseTile/TrainingView.
export function buildTrainingScene(
  scene: Phaser.Scene,
  container: Phaser.GameObjects.Container,
  area: { x: number; y: number; width: number; height: number },
  player: GameState,
  ctx: Ctx,
  bonusPercent = cellTrainingBonusPercent(player.cellUpgradeLevels),
) {
  const cx = area.x + 40;
  let y = area.y + 30;

  container.add(
    scene.add.text(cx, y, 'TRENING', {
      fontFamily: 'Oswald, Arial, sans-serif',
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#eee8de',
    }),
  );
  y += 34;
  container.add(
    scene.add.text(cx, y, 'SILNIEJSZY DZIŚ. BLIŻEJ WOLNOŚCI JUTRO.', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '12px',
      color: '#8d928f',
    }),
  );
  y += 40;

  // Resolve any exercise whose timer already elapsed before drawing, same
  // as WorkContent's resolve-then-redraw pattern.
  let didResolve = false;
  for (const exercise of trainingExercises) {
    const active = player.activeTraining[exercise.id];
    if (active && Date.now() >= active.endsAt) {
      delete player.activeTraining[exercise.id];
      const effectiveGain = Math.max(exercise.statGain, Math.round(exercise.statGain * (1 + bonusPercent / 100)));
      const stat = player.stats.find((entry) => entry.key === exercise.statKey)!;
      stat.value = Math.min(stat.max, stat.value + effectiveGain);
      player.save();
      ctx.onNotice(`Trening ukończony: ${exercise.label.toLowerCase()}. +${effectiveGain} ${stat.label.toLowerCase()}.`);
      didResolve = true;
    }
  }
  if (didResolve) {
    ctx.onChange();
    return;
  }

  const cols = Math.max(1, Math.min(2, Math.floor((area.width - 80) / (CARD_W + CARD_GAP))));
  let hasActiveTimer = false;

  trainingExercises.forEach((exercise, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = cx + col * (CARD_W + CARD_GAP);
    const cardY = y + row * (CARD_H + CARD_GAP);

    const stat = player.stats.find((entry) => entry.key === exercise.statKey)!;
    const effectiveGain = Math.max(exercise.statGain, Math.round(exercise.statGain * (1 + bonusPercent / 100)));
    const active = player.activeTraining[exercise.id];

    const card = scene.add.rectangle(x, cardY, CARD_W, CARD_H, 0x0a0d0e, 0.75).setOrigin(0).setStrokeStyle(1, 0x3a3f3c);
    container.add(card);

    container.add(
      scene.add.text(x + 16, cardY + 14, exercise.label, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        fontStyle: 'bold',
        color: '#eee8de',
      }),
    );
    container.add(
      scene.add.text(x + 16, cardY + 36, exercise.description, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '10px',
        color: '#8d928f',
        wordWrap: { width: CARD_W - 32 },
      }),
    );
    container.add(
      scene.add.text(x + 16, cardY + 68, `${exercise.energy} energii  •  ${exercise.duration} min  •  ${stat.label} (+${effectiveGain})`, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '10px',
        color: '#c9cec9',
      }),
    );

    const btnY = cardY + CARD_H - 36;
    if (active) {
      hasActiveTimer = true;
      const remaining = Math.max(0, active.endsAt - Date.now());
      const btn = scene.add.rectangle(x + 16, btnY, CARD_W - 32, 26, 0x1c2020, 0.95).setOrigin(0).setStrokeStyle(1, 0x3a3f3c);
      container.add(btn);
      container.add(
        scene.add
          .text(x + 16 + (CARD_W - 32) / 2, btnY + 13, formatDuration(remaining), {
            fontFamily: 'Arial, sans-serif',
            fontSize: '11px',
            fontStyle: 'bold',
            color: '#c9cec9',
          })
          .setOrigin(0.5),
      );
      return;
    }

    const atMax = stat.value >= stat.max;
    const cantAfford = player.energy < exercise.energy;
    const btnDisabled = atMax || cantAfford;

    const btn = scene.add
      .rectangle(x + 16, btnY, CARD_W - 32, 26, btnDisabled ? 0x1c2020 : 0xe0873d, 0.95)
      .setOrigin(0)
      .setInteractive({ useHandCursor: !btnDisabled });
    container.add(btn);
    container.add(
      scene.add
        .text(x + 16 + (CARD_W - 32) / 2, btnY + 13, atMax ? 'MAKSYMALNY POZIOM' : cantAfford ? 'BRAK ENERGII' : 'ROZPOCZNIJ', {
          fontFamily: 'Arial, sans-serif',
          fontSize: '11px',
          fontStyle: 'bold',
          color: btnDisabled ? '#5c615e' : '#14181a',
        })
        .setOrigin(0.5),
    );

    if (!btnDisabled) {
      btn.on('pointerdown', () => {
        if (!player.removeEnergy(exercise.energy)) {
          ctx.onNotice(`Potrzebujesz ${exercise.energy} energii, aby rozpocząć ten trening.`);
          return;
        }
        player.activeTraining[exercise.id] = { endsAt: Date.now() + exercise.duration * 60 * 1000 };
        ctx.onNotice(`Rozpoczynasz trening: ${exercise.label.toLowerCase()}.`);
        ctx.onChange();
      });
    }
  });

  if (hasActiveTimer) {
    const timer = scene.time.addEvent({ delay: 1000, loop: true, callback: () => ctx.onChange() });
    ctx.addTimer(timer);
  }
}
