import Phaser from 'phaser';
import type { GameState } from '../game/state';
import { missionCards } from '../data/missions';
import { formatDuration } from '../data/activities';

type Ctx = {
  onNotice: (message: string) => void;
  onChange: () => void;
  addTimer: (timer: Phaser.Time.TimerEvent) => void;
};

const CARD_W = 300;
const CARD_H = 220;
const CARD_GAP = 20;

const RISK_COLOR: Record<string, number> = {
  easy: 0x4fae5f,
  medium: 0xe0873d,
  hard: 0xe0473d,
  special: 0xa366e0,
};

// Ported from prison-life's MissionCardTile/MissionsCardsView - the only one
// of the three "missions" view variants the original actually wired up in
// GameShell's router.
export function buildMissionsScene(
  scene: Phaser.Scene,
  container: Phaser.GameObjects.Container,
  area: { x: number; y: number; width: number; height: number },
  player: GameState,
  ctx: Ctx,
) {
  const cx = area.x + 40;
  let y = area.y + 30;

  container.add(
    scene.add.text(cx, y, 'MISJE', { fontFamily: 'Oswald, Arial, sans-serif', fontSize: '24px', fontStyle: 'bold', color: '#eee8de' }),
  );
  y += 34;
  container.add(
    scene.add.text(cx, y, 'WYBIERZ MISJĘ I PODEJMIJ RYZYKO. KAŻDA DECYZJA MA KONSEKWENCJE.', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '12px',
      color: '#8d928f',
      wordWrap: { width: area.width - 80 },
    }),
  );
  y += 40;

  // Resolve any mission whose timer already elapsed before drawing.
  let didResolve = false;
  for (const mission of missionCards) {
    const active = player.activeMissions[mission.id];
    if (active && Date.now() >= active.endsAt) {
      const outcome = player.resolveMission(mission);
      if (outcome) {
        ctx.onNotice(
          outcome.success
            ? `Misja "${mission.title.toLowerCase()}" zakończona sukcesem: +${mission.rewardXp} EXP${outcome.extras.length ? ' oraz ' + outcome.extras.join(', ') : ''}.`
            : `Misja "${mission.title.toLowerCase()}" zakończona niepowodzeniem. Spróbuj ponownie.`,
        );
        didResolve = true;
      }
    }
  }
  if (didResolve) {
    ctx.onChange();
    return;
  }

  const cols = Math.max(1, Math.min(3, Math.floor((area.width - 80 + CARD_GAP) / (CARD_W + CARD_GAP))));
  let hasActiveTimer = false;

  missionCards.forEach((mission, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = cx + col * (CARD_W + CARD_GAP);
    const cardY = y + row * (CARD_H + CARD_GAP);
    const riskColor = RISK_COLOR[mission.riskTone] ?? 0x8d928f;

    const card = scene.add.rectangle(x, cardY, CARD_W, CARD_H, 0x0a0d0e, 0.75).setOrigin(0).setStrokeStyle(1, riskColor, 0.6);
    container.add(card);

    container.add(scene.add.text(x + 16, cardY + 14, mission.title, { fontFamily: 'Arial, sans-serif', fontSize: '15px', fontStyle: 'bold', color: '#eee8de' }));
    container.add(
      scene.add.text(x + CARD_W - 16, cardY + 16, mission.risk, { fontFamily: 'Arial, sans-serif', fontSize: '10px', fontStyle: 'bold', color: Phaser.Display.Color.IntegerToColor(riskColor).rgba }).setOrigin(1, 0),
    );
    container.add(
      scene.add.text(x + 16, cardY + 38, mission.description, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '10px',
        color: '#8d928f',
        wordWrap: { width: CARD_W - 32 },
      }),
    );
    container.add(
      scene.add.text(x + 16, cardY + 96, `Energia: ${mission.energy}  •  Szansa: ${mission.chance}%  •  ${mission.durationMinutes} min`, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '10px',
        color: '#c9cec9',
      }),
    );
    container.add(
      scene.add.text(x + 16, cardY + 116, `Nagroda: ${mission.reward}`, { fontFamily: 'Arial, sans-serif', fontSize: '11px', fontStyle: 'bold', color: '#e0873d' }),
    );

    const active = player.activeMissions[mission.id];
    const btnY = cardY + CARD_H - 40;

    if (active) {
      hasActiveTimer = true;
      const remaining = Math.max(0, active.endsAt - Date.now());
      const skipCost = player.missionSkipCost(mission);
      container.add(
        scene.add.text(x + 16, btnY - 22, formatDuration(remaining), { fontFamily: 'Oswald, Arial, sans-serif', fontSize: '16px', fontStyle: 'bold', color: '#eee8de' }),
      );
      const skipBtn = scene.add
        .rectangle(x + 16, btnY, CARD_W - 32, 28, 0x14181a, 0.95)
        .setOrigin(0)
        .setStrokeStyle(1, 0xe0873d)
        .setInteractive({ useHandCursor: true });
      container.add(skipBtn);
      container.add(
        scene.add
          .text(x + CARD_W / 2, btnY + 14, `PRZYSPIESZ ZA ${skipCost} PKT`, { fontFamily: 'Arial, sans-serif', fontSize: '10px', fontStyle: 'bold', color: '#e0873d' })
          .setOrigin(0.5),
      );
      skipBtn.on('pointerdown', () => {
        if (player.skipMission(mission)) {
          ctx.onChange();
        } else {
          ctx.onNotice(`Potrzebujesz ${skipCost} pkt, aby przyspieszyć tę misję.`);
        }
      });
      return;
    }

    const cantAfford = player.energy < mission.energy;
    const btn = scene.add
      .rectangle(x + 16, btnY, CARD_W - 32, 28, cantAfford ? 0x1c2020 : 0xe0873d, 0.95)
      .setOrigin(0)
      .setInteractive({ useHandCursor: !cantAfford });
    container.add(btn);
    container.add(
      scene.add
        .text(x + CARD_W / 2, btnY + 14, cantAfford ? 'BRAK ENERGII' : 'ROZPOCZNIJ MISJĘ', {
          fontFamily: 'Arial, sans-serif',
          fontSize: '11px',
          fontStyle: 'bold',
          color: cantAfford ? '#5c615e' : '#14181a',
        })
        .setOrigin(0.5),
    );
    if (!cantAfford) {
      btn.on('pointerdown', () => {
        if (player.startMission(mission)) {
          ctx.onNotice(`Rozpoczynasz misję: ${mission.title.toLowerCase()}.`);
          ctx.onChange();
        } else {
          ctx.onNotice(`Potrzebujesz ${mission.energy} energii, aby rozpocząć tę misję.`);
        }
      });
    }
  });

  if (hasActiveTimer) {
    const timer = scene.time.addEvent({ delay: 1000, loop: true, callback: () => ctx.onChange() });
    ctx.addTimer(timer);
  }
}
