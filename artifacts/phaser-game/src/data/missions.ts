// ZADANIA / Misje, ported from prison-life's MissionCardTile/MissionsCardsView
// (the only one of the three "missions" view variants App.tsx actually wired
// up in GameShell's router - MissionsView and MissionsReferenceView were
// built there but never rendered anywhere, so they're skipped here).

export type MissionCard = {
  id: string;
  title: string;
  description: string;
  risk: string;
  riskTone: 'easy' | 'medium' | 'hard' | 'special';
  energy: number;
  chance: number;
  reward: string;
  rewardXp: number;
  durationMinutes: number;
};

export const missionCards: MissionCard[] = [
  { id: 'handoff', title: 'PRZEKAŻ', description: 'Dostarcz wiadomość do wskazanej osoby z bloku B. Nikt nie może się dowiedzieć.', risk: 'ŁATWA', riskTone: 'easy', energy: 10, chance: 82, reward: '+120 EXP', rewardXp: 120, durationMinutes: 8 },
  { id: 'smuggle-card', title: 'PRZEMYT', description: 'Przenieś małą paczkę z magazynu do celi 214. Uważaj na kontrolę.', risk: 'ŚREDNIA', riskTone: 'medium', energy: 20, chance: 64, reward: '+250 EXP', rewardXp: 250, durationMinutes: 18 },
  { id: 'settlement', title: 'ROZLICZENIE', description: 'Daj nauczkę wskazanemu więźniowi z bloku C. Ma to wyglądać na przypadek.', risk: 'TRUDNA', riskTone: 'hard', energy: 30, chance: 48, reward: '+400 EXP', rewardXp: 400, durationMinutes: 30 },
  { id: 'evidence', title: 'ZDOBĄDŹ DOWODY', description: 'Zdobądź dokumenty ze strzeżonego biura. Wysokie ryzyko, duża nagroda.', risk: 'SPECJALNA', riskTone: 'special', energy: 40, chance: 32, reward: '+750 EXP', rewardXp: 750, durationMinutes: 50 },
];

// Skipping a mission's wait costs points based on how much time is left:
// one point per started 5-minute block, so anything under 5 minutes left
// costs just 1 point, and skipping a long mission right away costs more.
const MISSION_SKIP_BLOCK_MS = 5 * 60 * 1000;
export function missionSkipCost(remainingMs: number): number {
  return Math.max(1, Math.ceil(remainingMs / MISSION_SKIP_BLOCK_MS));
}

export const MISSION_BONUS_MONEY_CHANCE = 0.35;
