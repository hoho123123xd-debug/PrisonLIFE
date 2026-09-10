// Work/Training/Fight constants and pure logic, ported from
// artifacts/prison-life/src/App.tsx (WorkView, TrainingExerciseTile/
// TrainingView, FightView). Decorative art (trainingMockup, opponent
// portraits, the registration-environment background) was all AI-generated
// placeholder imagery there (filenames literally "ChatGPT_Image_..." /
// "Obraz_Codex_..." / "generated_images/...") - dropped here rather than
// carried into the real game, same call as the character model panel.

export const workHourlyRate = 20;
export const workMinHours = 1;
export const workMaxHours = 24;

export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((value) => String(value).padStart(2, '0')).join(':');
}

export type TrainingExercise = {
  id: string;
  label: string;
  description: string;
  energy: number;
  duration: number; // minutes
  statKey: string;
  statGain: number;
};

export const trainingExercises: TrainingExercise[] = [
  { id: 'pushups', label: 'POMPKI', description: 'Rozwijaj siłę. Proste, ale skuteczne.', energy: 10, duration: 15, statKey: 'strength', statGain: 2 },
  { id: 'squats', label: 'PRZYSIADY', description: 'Lepsza kondycja to większa wytrzymałość.', energy: 10, duration: 15, statKey: 'endurance', statGain: 2 },
  { id: 'weights', label: 'CIĘŻARY', description: 'Prawdziwa siła rodzi się z wysiłku.', energy: 20, duration: 30, statKey: 'strength', statGain: 3 },
  { id: 'combat', label: 'TRENING WALKI', description: 'Technika, refleks, kontrola.', energy: 25, duration: 30, statKey: 'reflex', statGain: 3 },
];

export type FightStatKey = 'health' | 'luck' | 'strength' | 'endurance' | 'intelligence' | 'reflex';

export const fightStatMeta: Array<{ key: FightStatKey; label: string }> = [
  { key: 'health', label: 'Zdrowie' },
  { key: 'luck', label: 'Szczęście' },
  { key: 'strength', label: 'Siła' },
  { key: 'endurance', label: 'Kondycja' },
  { key: 'intelligence', label: 'Inteligencja' },
  { key: 'reflex', label: 'Refleks' },
];

export type FightOpponent = {
  id: string;
  name: string;
  level: number;
  description: string;
  quote: string;
  stats: Record<FightStatKey, number>;
  rewardMoney: [number, number];
  rewardItemA: [number, number];
  rewardItemB: number;
};

export const fightOpponents: FightOpponent[] = [
  { id: 'rat', name: 'SZCZUR', level: 2, description: 'Szybki i nieprzewidywalny. Unika ciosów i wykorzystuje każdy błąd. Nie lekceważ go.', quote: 'Mało gada, dużo robi.', stats: { health: 90, luck: 6, strength: 7, endurance: 8, intelligence: 9, reflex: 14 }, rewardMoney: [40, 70], rewardItemA: [1, 2], rewardItemB: 1 },
  { id: 'bull', name: 'BYK', level: 5, description: 'Czysta siła i determinacja. Uderza mocno i rzadko się cofa. Walka z nim to walka na wytrzymałość.', quote: 'Kto silniejszy, ten ma rację.', stats: { health: 130, luck: 8, strength: 19, endurance: 17, intelligence: 8, reflex: 6 }, rewardMoney: [90, 160], rewardItemA: [2, 4], rewardItemB: 1 },
  { id: 'fox', name: 'LIS', level: 4, description: 'Sprytny gracz, który zawsze ma plan B. Kontratakuje, gdy najmniej się tego spodziewasz.', quote: 'Chytry jak lis, silny jak trzeba.', stats: { health: 105, luck: 10, strength: 10, endurance: 11, intelligence: 16, reflex: 12 }, rewardMoney: [70, 120], rewardItemA: [1, 3], rewardItemB: 1 },
  { id: 'wolf', name: 'WILK', level: 6, description: 'Bezwzględny w ataku, zwłaszcza gdy przeciwnik jest osłabiony. Nie daje drugiej szansy.', quote: 'Stado albo samotność — wybieram zwycięstwo.', stats: { health: 120, luck: 9, strength: 15, endurance: 14, intelligence: 12, reflex: 13 }, rewardMoney: [100, 170], rewardItemA: [2, 3], rewardItemB: 2 },
  { id: 'kosa', name: 'KOSA', level: 3, description: 'Doświadczony i opanowany. Nie popełnia niepotrzebnych błędów, gra na swoich zasadach.', quote: 'Za kratami liczy się tylko wynik.', stats: { health: 110, luck: 11, strength: 12, endurance: 11, intelligence: 10, reflex: 9 }, rewardMoney: [60, 100], rewardItemA: [1, 2], rewardItemB: 1 },
];

export const FIGHT_ENERGY_COST = 15;

// Combat is resolved instantly: each side's relevant stats collapse into a
// single "power" score, and the win chance is that score's share of the
// combined total - a stronger opponent is more likely, but never
// guaranteed, to win.
export function computeFightPower(stats: Record<FightStatKey, number>): number {
  return stats.strength * 1.2 + stats.endurance + stats.reflex + stats.luck * 0.6 + stats.intelligence * 0.4;
}

export function randomInRange([min, max]: [number, number]): number {
  return Math.round(min + Math.random() * (max - min));
}

export type FightResult = {
  won: boolean;
  opponentId: string;
  respectChange: number;
  moneyChange: number;
  itemWon: string | null;
  pointsWon: number;
};
