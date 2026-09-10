// GangView, ported from prison-life's App.tsx. It's mostly a dashboard of
// static/mocked data (members, events, treasury) - the original itself
// doesn't branch its rendered content on the selected tab either, only the
// active tab's own highlight changes, so most tab clicks there (and here)
// just show a "coming soon" notice rather than a config error to fix later.

export const gangTabs = ['PRZEGLĄD', 'CZŁONKOWIE', 'ROZWÓJ', 'WOJNY', 'SKARBIEC', 'MISJE GANGU', 'USTAWIENIA'];

export const gangName = 'WILCZA PACZKA';
export const gangFounder = 'F1QU';
export const gangLevel = 3;
export const gangXp = 450;
export const gangXpMax = 1000;
export const gangMemberCount = 12;

export const gangMembers: Array<[nick: string, rank: string, level: string, status: string]> = [
  ['F1QU', 'Założyciel', '8', 'Online'],
  ['Kamil', 'Oficer', '12', 'Online'],
  ['StaryDozor', 'Oficer', '10', 'Online'],
  ['Beton', 'Członek', '9', '2h temu'],
  ['Malina', 'Członek', '7', '5h temu'],
  ['Cichy', 'Rekrut', '5', '1 dzień temu'],
  ['Rzeźnik', 'Rekrut', '4', '3 dni temu'],
];

export const gangEvents: Array<[date: string, text: string]> = [
  ['12.05', 'F1QU awansował gracza Kamil do rangi Oficer.'],
  ['11.05', 'Gang wygrał wojnę z Czerwone Węże.'],
  ['10.05', 'Nowy członek: StaryDozor.'],
  ['08.05', 'Ukończono misję gangową: Przemyt.'],
  ['07.05', 'Wpłacono 5 000 $ do skarbca.'],
];

export const gangBenefits = [
  '+3% do zarobków za pracę',
  '+5% do skuteczności w walkach',
  'Dostęp do specjalnych misji gangowych',
  'Niższe ceny na czarnym rynku',
  'Wspólny skarbiec',
];

export const gangStats = [
  { label: 'CZŁONKÓW', value: '12' },
  { label: 'POZIOM', value: '3' },
  { label: 'PUNKTY PRESTIŻU', value: '145' },
  { label: 'WYGRANE WOJNY', value: '8' },
];

// Which gang currently controls the black market - a static snapshot (no
// live gang-war simulation yet), applied as a real surcharge on every
// Czarny Rynek purchase so the panel isn't purely decorative.
export type GangControlEntry = { id: string; name: string; cut: number; controlling?: boolean };
export const blackMarketGangControl: GangControlEntry[] = [
  { id: 'czerwone-wilki', name: 'CZERWONE WILKI', cut: 15, controlling: true },
  { id: 'zelazne-piesci', name: 'ŻELAZNE PIĘŚCI', cut: 10 },
  { id: 'cienie', name: 'CIENIE', cut: 8 },
  { id: 'polnoc', name: 'PÓŁNOC', cut: 5 },
  { id: 'bractwo', name: 'BRACTWO', cut: 5 },
];
export const blackMarketTaxCut = blackMarketGangControl.find((entry) => entry.controlling)?.cut ?? 0;
