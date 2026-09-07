import { type CSSProperties, type Dispatch, type DragEvent, type FormEvent, type ReactNode, type SetStateAction, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Archive,
  Award,
  Backpack,
  BarChart3,
  Bell,
  Brain,
  BriefcaseBusiness,
  Building2,
  Check,
  CheckCircle2,
  CircleDollarSign,
  ChevronRight,
  Coins,
  Activity,
  ChevronLeft,
  Clover,
  Crosshair,
  Crown,
  Dices,
  Droplets,
  Dumbbell,
  BedDouble,
  Gem,
  Eye,
  Facebook,
  Footprints as FootprintsIcon,
  Flag,
  Gamepad2,
  Heart,
  Instagram,
  Lightbulb,
  KeyRound,
  LockKeyhole,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Grid2X2,
  Hand,
  Info,
  MoreHorizontal,
  Package,
  PanelRight,
  Plus,
  RefreshCw,
  Scale,
  ScanFace,
  Scissors,
  ScrollText,
  Search,
  Send,
  Shield,
  Settings,
  Shirt as ShirtIcon,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Swords,
  Timer,
  Table,
  Trophy,
  Tv,
  UserRound,
  UserRoundPen,
  Users,
  Watch,
  Wind,
  Wrench,
  X,
  Youtube,
  Zap,
} from 'lucide-react';
import characterScenePhoto from '@assets/ChatGPT Image 7 wrz 2026, 15_07_50.png';
import prisonArtwork from '@assets/ChatGPT_Image_6_wrz_2026,_17_17_42_1788707864145.png';
import registrationEnvironment from '@assets/generated_images/prison-intake-environment.png';
import prisonerAsset from '@assets/ChatGPT_Image_6_wrz_2026,_18_12_30_1788711187677.png';
import bullAsset from '@assets/ChatGPT_Image_6_wrz_2026,_18_57_13_1788713844519.png';
import bullDefaultAsset from '@assets/byk_domyslny.png';
import bullShortHairAsset from '@assets/byk_krotkie_composed.png';
import fullBeardAsset from '@assets/broda_pelna.png';
import wlosyIrokezAsset from '@assets/wlosy_irokez.png';
import femaleBullAsset from '@assets/Obraz_Codex_6_wrz_2026,_19_03_12_1788715039687.png';
import ratAsset from '@assets/Obraz_Codex_6_wrz_2026,_18_57_44_1788713877886.png';
import femaleRatAsset from '@assets/Obraz_Codex_6_wrz_2026,_19_04_23_1788715066292.png';
import foxAsset from '@assets/Obraz_Codex_6_wrz_2026,_18_58_23_1788713918595.png';
import femaleFoxAsset from '@assets/Obraz_Codex_6_wrz_2026,_19_05_09_1788715078788.png';
import wolfAsset from '@assets/Obraz_Codex_6_wrz_2026,_18_59_09_1788713957701.png';
import femaleWolfAsset from '@assets/Obraz_Codex_6_wrz_2026,_19_05_54_1788715089958.png';
import inventoryHeadCapAsset from '@assets/inventory/head-cap.png';
import inventoryTopOrangeAsset from '@assets/inventory/top-orange.png';
import inventoryTopBlackHoodieAsset from '@assets/inventory/top-black-hoodie.png';
import inventoryBagBlackAsset from '@assets/inventory/bag-black.png';
import inventoryHandGlovesAsset from '@assets/inventory/hand-gloves.png';
import inventoryFaceBandanaAsset from '@assets/inventory/face-red-bandana.png';
import inventoryBottomOrangeAsset from '@assets/inventory/bottom-orange.png';
import inventoryFeetBlackBootsAsset from '@assets/inventory/feet-black-boots.png';
import inventoryWeaponKnifeAsset from '@assets/inventory/weapon-knife.png';
import cellBackground from './assets/cell/cell-background.webp';
import cellReference from './assets/cell/cell-reference.png';
import cellLayout from './assets/cell/cell-layout.json';
import trainingMockup from '@assets/Obraz_Codex_6_wrz_2026,_20_10_24_1788718237783.png';

const queryClient = new QueryClient();

const featureItems = [
  { title: 'Rozwijaj postać', copy: 'Trenuj, zdobywaj umiejętności i zostań legendą.', icon: Dumbbell },
  { title: 'Walcz z innymi', copy: 'Sprawdź się w pojedynkach i zdobądź szacunek.', icon: Swords },
  { title: 'Zarabiaj', copy: 'Podejmuj pracę, handluj i buduj swój majątek.', icon: BriefcaseBusiness },
  { title: 'Dołącz do ekipy', copy: 'Twórz i rozwijaj frakcję. Razem możecie więcej.', icon: Users },
  { title: 'Zdobądź szczyt', copy: 'Wspinaj się w rankingach i zapisz się w historii Prison Life.', icon: Crown },
];
const panelItems = [
  { label: 'Twoja Postać', icon: Shield },
  { label: 'Trening', icon: Dumbbell },
  { label: 'Walka', icon: Crosshair },
  { label: 'Praca', icon: BriefcaseBusiness },
  { label: 'Ekwipunek', icon: Backpack },
  { label: 'Misje', icon: ScrollText },
  { label: 'Frakcja', icon: Flag },
  { label: 'Ranking', icon: Trophy },
];
const barItems = [
  ['Siła', '85', '88%'],
  ['Kondycja', '72', '74%'],
  ['Zręczność', '46', '48%'],
  ['Technika', '38', '40%'],
  ['Charakter', '55', '58%'],
];

type Screen = 'home' | 'register' | 'login' | 'game';
type AppearanceKey = 'face' | 'hair' | 'beard' | 'tattoo' | 'scar' | 'eyes' | 'outfit' | 'skin';
type AppearanceTabKey = 'face' | 'hair' | 'beard' | 'tattoo' | 'scar' | 'eyes';
type Appearance = Record<AppearanceKey, number> & { hairColor: number };
type AppearanceOption = { id: number; label: string; color?: string };
const skinToneColors = ['#c99a76', '#a9764f', '#8a6142', '#5c3d29'];
const eyeColorSwatches = ['#4a2f1c', '#3d6b8a', '#3f6b45', '#767f82'];
const hairColorOptions: AppearanceOption[] = [
  { id: 0, label: 'CZARNY', color: '#171514' },
  { id: 1, label: 'BRĄZ', color: '#4a2d20' },
  { id: 2, label: 'KASZTAN', color: '#71412b' },
  { id: 3, label: 'BLOND', color: '#a77a42' },
  { id: 4, label: 'SIWY', color: '#8f9290' },
  { id: 5, label: 'RUDY', color: '#8d3e24' },
];
const appearanceTabs: Array<{ key: AppearanceTabKey; label: string; icon: typeof Shield; options: AppearanceOption[] }> = [
  { key: 'face', label: 'TWARZ', icon: ScanFace, options: [
    { id: 0, label: 'OWALNA' },
    { id: 1, label: 'KANCIASTA' },
    { id: 2, label: 'OKRĄGŁA' },
    { id: 3, label: 'WYDATNA SZCZĘKA' },
  ] },
  { key: 'hair', label: 'WŁOSY', icon: Scissors, options: [
    { id: 0, label: 'OGOLONY' },
    { id: 1, label: 'BUZZ CUT' },
    { id: 2, label: 'KRÓTKIE' },
    { id: 3, label: 'FADE' },
    { id: 4, label: 'IROKEZ' },
    { id: 5, label: 'DREDY' },
  ] },
  { key: 'beard', label: 'ZAROST', icon: Sparkles, options: [
    { id: 0, label: 'GŁADKO OGOLONY' },
    { id: 1, label: 'LEKKI ZAROST' },
    { id: 2, label: 'PEŁNA BRODA' },
    { id: 3, label: 'WĄSY' },
  ] },
  { key: 'tattoo', label: 'TATUAŻE', icon: Droplets, options: [
    { id: 0, label: 'BRAK' },
    { id: 1, label: 'SZPONY' },
    { id: 2, label: 'OKO' },
    { id: 3, label: 'KRATY' },
  ] },
  { key: 'scar', label: 'BLIZNY', icon: Zap, options: [
    { id: 0, label: 'BRAK' },
    { id: 1, label: 'NAD OKIEM' },
    { id: 2, label: 'NA POLICZKU' },
    { id: 3, label: 'PRZEZ BREW' },
  ] },
  { key: 'eyes', label: 'OCZY', icon: Eye, options: [
    { id: 0, label: 'BRĄZOWE', color: eyeColorSwatches[0] },
    { id: 1, label: 'NIEBIESKIE', color: eyeColorSwatches[1] },
    { id: 2, label: 'ZIELONE', color: eyeColorSwatches[2] },
    { id: 3, label: 'SZARE', color: eyeColorSwatches[3] },
  ] },
];
const skinToneOptions: AppearanceOption[] = [
  { id: 0, label: 'JASNA', color: skinToneColors[0] },
  { id: 1, label: 'ŚNIADA', color: skinToneColors[1] },
  { id: 2, label: 'OLIWKOWA', color: skinToneColors[2] },
  { id: 3, label: 'CIEMNA', color: skinToneColors[3] },
];
const randomNicknames = ['KOSA', 'CIEŃ', 'ŻMIJA', 'BYK', 'RAZOR', 'WIDMO', 'GRUBY', 'HAK', 'ĆWIEK', 'SĘP'];
type AccountData = { email: string; password: string; confirmPassword: string };
type Gender = 'male' | 'female';
type World = 'central';
type PrisonerType = 'bull' | 'rat' | 'fox' | 'wolf';
const prisonerTypes: Array<{
  id: PrisonerType;
  name: string;
  specialty: string;
  description: string;
  abilityIcon: string;
  abilityTitle: string;
  abilityDescription: string;
}> = [
  { id: 'bull', name: 'BYK', specialty: 'SERIA ATAKÓW', description: 'W walce może wykonać serię kolejnych ataków. Każdy kolejny cios zadaje obrażenia, ale jest słabszy od poprzedniego.', abilityIcon: '🥊', abilityTitle: 'Seria ataków', abilityDescription: 'Może wykonać kilka ataków pod rząd.' },
  { id: 'rat', name: 'SZCZUR', specialty: 'UNIKI', description: 'Ma zwiększoną szansę na uniknięcie ataku przeciwnika. Udany unik pozwala mu uniknąć otrzymania obrażeń.', abilityIcon: '🐀', abilityTitle: 'Uniki', abilityDescription: 'Ma zwiększoną szansę na uniknięcie ataku.' },
  { id: 'fox', name: 'LIS', specialty: 'KONTRATAK', description: 'Specjalizuje się w kontratakach. Po otrzymaniu ciosu ma szansę natychmiast odpowiedzieć własnym atakiem.', abilityIcon: '🦊', abilityTitle: 'Kontratak', abilityDescription: 'Może natychmiast odpowiedzieć po otrzymaniu ciosu.' },
  { id: 'wolf', name: 'WILK', specialty: 'DOBIJANIE', description: 'Specjalizuje się w dobijaniu przeciwników. Jego ataki stają się skuteczniejsze, gdy przeciwnik ma mało zdrowia.', abilityIcon: '🐺', abilityTitle: 'Dobijanie', abilityDescription: 'Jest skuteczniejszy przeciwko osłabionym przeciwnikom.' },
];

function getPrisonerDisplayName(type: typeof prisonerTypes[number], gender: Gender) {
  if (gender === 'female' && type.id === 'bull') return 'BYCZYCA';
  if (gender === 'female' && type.id === 'rat') return 'SZCZURZYCA';
  if (gender === 'female' && type.id === 'fox') return 'LISICA';
  if (gender === 'female' && type.id === 'wolf') return 'WILCZYCA';
  return type.name;
}

function getPrisonerAsset(type: typeof prisonerTypes[number], gender: Gender) {
  if (gender === 'female' && type.id === 'bull') return femaleBullAsset;
  if (gender === 'female' && type.id === 'rat') return femaleRatAsset;
  if (gender === 'female' && type.id === 'fox') return femaleFoxAsset;
  if (gender === 'female' && type.id === 'wolf') return femaleWolfAsset;
  return type.id === 'bull' ? bullAsset : type.id === 'rat' ? ratAsset : type.id === 'fox' ? foxAsset : wolfAsset;
}

const stepLabels = ['POSTAĆ', 'WYGLĄD', 'DANE', 'GOTOWE'];

function Brand({ onNavigate, compact = false }: { onNavigate: (screen: Screen) => void; compact?: boolean }) {
  return (
    <button className={`brand brand-button ${compact ? 'brand-compact' : ''}`} onClick={() => onNavigate('home')} data-testid="link-brand">
      <span className="brand-name">PRISON<span className="crown">◆</span>LIFE</span>
      {!compact && <span className="brand-tagline">TU ZACZYNA SIĘ PRAWDZIWA GRA</span>}
    </button>
  );
}

function Home({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    document.title = 'Prison Life — Więcej niż gra. To Twój wyrok.';
    const description = 'Prison Life — przeglądarkowa gra strategiczna, w której budujesz swoją legendę za kratami.';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', description);
  }, []);

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3500);
  };
  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="prison-page" style={{ '--artwork-url': `url("${prisonArtwork}")` } as CSSProperties}>
      <header className="site-header" data-testid="header-main">
        <div className="prison-shell header-inner">
          <Brand onNavigate={onNavigate} />
          <nav className="nav-links" aria-label="Główna nawigacja">
            <button className="nav-link" onClick={() => scrollTo('about')}>O GRZE</button>
            <button className="nav-link" onClick={() => scrollTo('features')}>FUNKCJE</button>
            <button className="nav-link" onClick={() => scrollTo('world')}>ŚWIAT GRY</button>
            <button className="nav-link" onClick={() => scrollTo('community')}>SPOŁECZNOŚĆ</button>
            <button className="nav-link" onClick={() => scrollTo('rankings')}>RANKINGI</button>
            <button className="nav-link" onClick={() => scrollTo('media')}>MEDIA</button>
          </nav>
          <div className="header-actions">
            <button className="header-action" onClick={() => onNavigate('login')} data-testid="button-header-login">ZALOGUJ SIĘ</button>
            <button className="header-action register" onClick={() => onNavigate('register')} data-testid="button-header-register">ZAREJESTRUJ SIĘ</button>
          </div>
          <button className="mobile-toggle" aria-label={mobileOpen ? 'Zamknij menu' : 'Otwórz menu'} onClick={() => setMobileOpen((open) => !open)} data-testid="button-mobile-menu">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className={`mobile-menu ${mobileOpen ? 'mobile-menu-open' : ''}`}>
            {['about', 'features', 'world', 'community', 'rankings', 'media'].map((id, index) => (
              <button key={id} className="nav-link" onClick={() => scrollTo(id)}>{['O GRZE', 'FUNKCJE', 'ŚWIAT GRY', 'SPOŁECZNOŚĆ', 'RANKINGI', 'MEDIA'][index]}</button>
            ))}
            <div className="header-actions">
              <button className="header-action" onClick={() => onNavigate('login')}>ZALOGUJ SIĘ</button>
              <button className="header-action register" onClick={() => onNavigate('register')}>ZAREJESTRUJ SIĘ</button>
            </div>
          </div>
        </div>
      </header>

      <section className="hero" id="top" data-testid="section-hero">
        <div className="prison-shell">
          <div className="hero-content reveal" id="about">
            <div className="eyebrow">Więzienie. Zasady. Reputacja.</div>
            <h1 className="hero-title" data-testid="text-hero-title">Więcej niż gra.<span>To twój wyrok.</span></h1>
            <p className="hero-copy" data-testid="text-hero-description">Prison Life to przeglądarkowa gra strategiczna, w której trafiasz do więzienia i budujesz swoją legendę. Trenuj, walcz, pracuj, kombinuj i pokaż, na co Cię stać w świecie, gdzie liczy się tylko siła, spryt i lojalność.</p>
            <div className="hero-buttons">
              <button className="btn btn-primary" onClick={() => onNavigate('register')} data-testid="button-hero-register">ZAREJESTRUJ SIĘ <ArrowRight size={17} /></button>
              <button className="btn btn-outline" onClick={() => onNavigate('login')} data-testid="button-hero-login"><LockKeyhole size={16} /> ZALOGUJ SIĘ</button>
            </div>
          </div>
        </div>
        <div className="hero-scroll" aria-hidden="true">PRZEJDŹ DALEJ</div>
      </section>

      <section className="stats-strip" aria-label="Statystyki gry" id="community" data-testid="section-stats">
        <div className="prison-shell stats-grid">
          <div className="stat"><strong className="stat-value">12 842</strong><span className="stat-label">Aktywnych więźniów</span></div>
          <div className="stat"><strong className="stat-value">1 204 568</strong><span className="stat-label">Stoczonych walk</span></div>
          <div className="stat"><strong className="stat-value">587 321</strong><span className="stat-label">Dni za kratami</span></div>
          <div className="stat"><strong className="stat-value">5 lat</strong><span className="stat-label">Ciągłego rozwoju</span></div>
        </div>
      </section>

      <section className="features-section section-rule" id="features" data-testid="section-features">
        <div className="prison-shell features-grid">
          {featureItems.map(({ title, copy, icon: Icon }) => <article className="feature" key={title}><Icon className="feature-icon" strokeWidth={1.5} /><h2 className="feature-title">{title}</h2><p className="feature-copy">{copy}</p></article>)}
        </div>
      </section>

      <section className="world-section section-rule" id="world" data-testid="section-world">
        <div className="prison-shell world-grid">
          <div className="game-panel" id="media" aria-label="Podgląd panelu gry">
            <div className="panel-top"><span><Coins /> 12 450</span><span><Zap /> 78</span><span><Heart /> 340</span></div>
            <div className="panel-menu">{panelItems.map(({ label, icon: Icon }, index) => <div id={label === 'Ranking' ? 'rankings' : undefined} className={`panel-menu-item ${index === 0 ? 'active' : ''}`} key={label}><Icon />{label}</div>)}</div>
            <div className="player-card"><div className="player-avatar" role="img" aria-label="Kosa w swojej celi" /><div><div className="player-name">Kosa</div><div className="player-level">Poziom 28</div><div className="stat-bars">{barItems.map(([label, value, width]) => <div className="bar-line" key={label}><span>{label}</span><div className="bar"><i style={{ width }} /></div><b>{value}</b></div>)}</div></div></div>
          </div>
          <div className="world-copy-block"><div className="world-kicker">Świat Prison Life</div><h2 className="world-title">Za kratami zaczyna się <span>prawdziwa gra</span></h2><p className="world-copy">Poznaj brutalny, ale pełen możliwości świat więzienia. Każda decyzja ma znaczenie, a każdy dzień to nowa szansa, by stać się kimś więcej.</p><button className="btn btn-outline world-cta" onClick={() => showNotice('Pełny widok świata pojawi się już wkrótce.')}>ZOBACZ WIĘCEJ <ArrowRight size={16} /></button></div>
        </div>
      </section>

      <PublicFooter onNavigate={onNavigate} onNotice={showNotice} />
      {notice && <div className="notice" role="status">{notice}</div>}
    </main>
  );
}

function PublicFooter({ onNavigate, onNotice }: { onNavigate: (screen: Screen) => void; onNotice: (message: string) => void }) {
  return (
    <footer className="footer" id="footer-main">
      <div className="prison-shell footer-main">
        <Brand onNavigate={onNavigate} compact />
        <nav className="footer-links" aria-label="Linki informacyjne">
          <button className="footer-link" onClick={() => onNotice('Regulamin będzie dostępny przy otwarciu serwera.')}>Regulamin</button>
          <button className="footer-link" onClick={() => onNotice('Polityka prywatności będzie dostępna przy otwarciu serwera.')}>Polityka prywatności</button>
          <button className="footer-link" onClick={() => onNotice('Sekcja FAQ jest w przygotowaniu.')}>FAQ</button>
          <a href="mailto:kontakt@prisonlife.pl" className="footer-link">Kontakt</a>
        </nav>
        <div className="social-links" aria-label="Media społecznościowe"><button className="social-link" aria-label="Discord"><Gamepad2 size={17} /></button><button className="social-link" aria-label="Facebook"><Facebook size={17} /></button><button className="social-link" aria-label="YouTube"><Youtube size={17} /></button><button className="social-link" aria-label="Instagram"><Instagram size={17} /></button></div>
        <div className="footer-motto">PRAWDZIWE HISTORIE<br />ZACZYNAJĄ SIĘ W WIĘZIENIU...</div>
      </div>
      <div className="prison-shell footer-bottom"><span>© 2026 Prison Life. Wszystkie prawa zastrzeżone.</span><span>Więcej niż gra.</span></div>
    </footer>
  );
}

function RegistrationProgress({ step, onStepChange }: { step: number; onStepChange?: (step: number) => void }) {
  return <div className="registration-progress" aria-label="Postęp rejestracji">{stepLabels.map((label, index) => <button type="button" className={`progress-step ${step === index + 1 ? 'current' : ''} ${step > index + 1 ? 'complete' : ''}`} key={label} onClick={() => onStepChange?.(index + 1)} aria-current={step === index + 1 ? 'step' : undefined} data-testid={`button-progress-${index + 1}`}><span className="progress-number">{step > index + 1 ? <Check size={14} /> : `0${index + 1}`}</span><span>{label}</span></button>)}</div>;
}

function CharacterPreview({ appearance, nickname, type }: { appearance: Appearance; nickname: string; type: PrisonerType }) {
  const skinColors = ['#bd8060', '#9e6047', '#754532', '#4c2c26'];
  const skin = skinColors[appearance.skin];
  const outfitColors = ['#c96022', '#b9b3a4', '#53646a', '#283d43'];
  const outfit = outfitColors[appearance.outfit];
  const displayName = nickname.trim() || 'NOWY WIĘZIEŃ';
  return (
    <div className="character-preview-wrap">
      <div className="preview-ruler" aria-hidden="true"><span>180</span><span>170</span><span>160</span><span>150</span><span>140</span></div>
      <div className="character-preview" data-testid="character-preview">
        <div className="preview-stamp">PRISON LIFE<br /><b>INTAKE / 2026</b></div>
        <div className={`character-figure figure-skin-${appearance.skin} figure-outfit-${appearance.outfit} figure-face-${appearance.face}`} style={{ '--hair-color': hairColorOptions[appearance.hairColor].color } as CSSProperties} data-testid="character-figure">
          <img className="character-photo" src={prisonerAsset} alt={`Podgląd więźnia ${displayName}`} />
          {appearance.hair > 0 && <span className={`figure-hair figure-hair-${appearance.hair}`} aria-hidden="true" />}
          {appearance.beard > 0 && <span className={`figure-beard figure-beard-${appearance.beard}`} aria-hidden="true" />}
          {appearance.scar > 0 && <span className={`figure-scar figure-scar-${appearance.scar}`} aria-hidden="true" />}
          {appearance.tattoo > 0 && <span className={`figure-tattoo figure-tattoo-${appearance.tattoo}`} aria-hidden="true" />}
          {appearance.outfit > 0 && <span className="figure-outfit-wash" aria-hidden="true" />}
          <svg className="character-svg" viewBox="0 0 360 620" role="img" aria-label={`Podgląd więźnia ${displayName}`}>
          <defs><linearGradient id="skinGradient" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor={skin} /><stop offset=".6" stopColor={skin} stopOpacity=".96" /><stop offset="1" stopColor="#3d2420" /></linearGradient><linearGradient id="clothGradient" x1="0" x2="1"><stop stopColor={outfit} /><stop offset=".52" stopColor={outfit} stopOpacity=".92" /><stop offset="1" stopColor="#1d2425" /></linearGradient><filter id="shadow"><feDropShadow dx="0" dy="7" stdDeviation="6" floodColor="#000" floodOpacity=".5" /></filter></defs>
          <ellipse cx="180" cy="595" rx="115" ry="16" fill="#000" opacity=".5" />
          <g filter="url(#shadow)">
            <path d="M126 334 Q93 365 76 492 L92 527 124 505 137 406 223 406 237 505 269 527 284 492 Q268 366 235 334Z" fill="url(#clothGradient)" />
            <path d="M126 353 Q96 376 78 473 L95 486 130 414Z" fill={skin} opacity=".96" /><path d="M234 353 Q264 376 282 473 L265 486 230 414Z" fill={skin} opacity=".96" />
            <path d="M91 482 Q82 494 92 525 L109 526 119 494Z" fill={skin} /><path d="M269 482 Q278 494 268 525 L251 526 241 494Z" fill={skin} />
            <path d="M134 307 L136 357 Q180 382 224 357 L226 307Z" fill="url(#skinGradient)" />
            <path d="M121 351 Q180 377 239 351 L256 397 220 424 140 424 104 397Z" fill="url(#clothGradient)" />
            {appearance.outfit === 0 && <><path d="M180 371 L168 419 180 431 192 419Z" fill="#182023" /><path d="M126 365 L151 382 160 428 142 426Z" fill="#11191c" opacity=".65" /><path d="M234 365 L209 382 200 428 218 426Z" fill="#11191c" opacity=".65" /></>}
            {appearance.outfit === 1 && <path d="M180 372 L168 424 180 430 192 424Z" fill="#4b5657" />}
            {appearance.outfit === 2 && <path d="M134 351 L148 425 168 424 180 376 192 424 212 425 226 351 239 363 221 437 139 437 121 363Z" fill="#273a3e" opacity=".8" />}
            {appearance.outfit === 3 && <path d="M124 353 L146 429 214 429 236 353 253 377 225 460 135 460 107 377Z" fill="#1c2a2e" opacity=".86" />}
            <path d="M155 383 L180 400 205 383" fill="none" stroke="#d6aa7b" strokeWidth="2" opacity=".55" />
            <rect x="192" y="387" width="36" height="21" rx="1" fill="#d6c5a5" /><text x="198" y="402" fontSize="10" fontFamily="Barlow Condensed" fill="#252729" fontWeight="700">A-7421</text>
            <ellipse cx="180" cy="235" rx={[56, 52, 58, 54][appearance.face]} ry="75" fill="url(#skinGradient)" />
            {appearance.face === 0 && <path d="M136 218 Q148 185 180 183 Q213 185 224 218 L213 198 Q180 210 147 198Z" fill="#30221f" opacity=".4" />}
            {appearance.face === 1 && <path d="M150 188 Q180 177 211 190 L223 221 211 239 Q180 252 149 239 L137 220Z" fill="#49302a" opacity=".38" />}
            {appearance.face === 2 && <path d="M132 226 L146 185 180 177 214 185 228 226 214 270 180 288 146 270Z" fill="#4a2b25" opacity=".32" />}
            {appearance.face === 3 && <path d="M142 200 Q180 180 218 200 L225 252 Q180 276 135 252Z" fill="#211c1b" opacity=".2" />}
            <path d="M149 226 Q160 219 169 225" stroke="#231b19" strokeWidth="5" fill="none" /><path d="M191 225 Q200 219 211 226" stroke="#231b19" strokeWidth="5" fill="none" />
            <ellipse cx="160" cy="234" rx="4" ry="5" fill={eyeColorSwatches[appearance.eyes]} /><ellipse cx="200" cy="234" rx="4" ry="5" fill={eyeColorSwatches[appearance.eyes]} />
            <path d="M180 234 L174 258 184 260" fill="none" stroke="#633b30" strokeWidth="3" /><path d="M157 274 Q180 284 203 274" fill="none" stroke="#321d1b" strokeWidth="4" />
            {appearance.scar === 1 && <path d="M207 197 L215 236" stroke="#c48f72" strokeWidth="3" opacity=".8" />}
            {appearance.scar === 2 && <path d="M195 245 L213 268" stroke="#c48f72" strokeWidth="3" opacity=".8" />}
            {appearance.scar === 3 && <path d="M144 219 L168 214" stroke="#c48f72" strokeWidth="3" opacity=".8" />}
            {appearance.hair === 0 && <path d="M126 224 Q124 168 180 157 Q236 168 234 224 L219 214 211 184 Q180 174 149 184 L141 214Z" fill="#171718" />}
            {appearance.hair === 1 && <path d="M129 210 Q126 169 180 156 Q234 169 231 210 L215 198 207 175 Q180 166 153 175 L145 198Z" fill="#242326" />}
            {appearance.hair === 2 && <><path d="M123 226 Q114 169 180 144 Q247 169 237 226 L220 204 212 174 Q180 157 148 174 L140 207Z" fill="#121314" /><path d="M148 169 Q180 131 212 169" fill="none" stroke="#303032" strokeWidth="13" /></>}
            {appearance.hair === 3 && <path d="M147 211 L143 165 164 180 180 139 196 180 218 165 213 211 201 193 180 175 159 193Z" fill="#141516" />}
            {appearance.beard === 1 && <path d="M145 267 Q180 285 215 267 L206 297 Q180 311 154 297Z" fill="#272122" opacity=".55" />}
            {appearance.beard === 2 && <path d="M143 265 Q180 285 217 265 L210 315 Q180 335 150 315Z" fill="#211b1c" />}
            {appearance.beard === 3 && <path d="M151 273 Q180 284 209 273 L204 289 Q180 299 156 289Z" fill="#211b1c" />}
            {appearance.tattoo === 1 && <path d="M99 399 q20-28 42 0 l-21 35Z M261 399 q-20-28-42 0 l21 35Z" fill="none" stroke="#191a19" strokeWidth="5" opacity=".8" />}
            {appearance.tattoo === 2 && <><circle cx="116" cy="418" r="15" fill="none" stroke="#17191a" strokeWidth="5" /><path d="M105 431 l11-12 11 12 M105 407 l11 12 11-12" fill="none" stroke="#17191a" strokeWidth="3" /></>}
            {appearance.tattoo === 3 && <path d="M103 409 H136 M101 421 H132 M224 409 H257 M228 421 H260" stroke="#16191a" strokeWidth="4" />}
            {appearance.tattoo === 0 && <path d="M97 403 Q113 386 130 403 M230 403 Q247 386 263 403" fill="none" stroke="#5c3830" strokeWidth="2" opacity=".35" />}
            <path d="M136 353 Q180 367 224 353" fill="none" stroke="#11191b" strokeWidth="5" opacity=".55" />
            {type === 'bull' && <path d="M142 356 L180 370 218 356" fill="none" stroke="#ec8234" strokeWidth="2" opacity=".65" />}
            {type === 'rat' && <path d="M146 356 L180 367 214 356" fill="none" stroke="#b5b5a3" strokeWidth="2" opacity=".5" />}
            {appearance.outfit === 2 && <path d="M153 385 Q180 400 207 385" stroke="#d6a454" fill="none" strokeWidth="2" />}
          </g>
          {appearance.outfit === 0 && <path d="M165 430 L159 570 180 589 201 570 195 430Z" fill="#c65b22" opacity=".95" />}
          {appearance.outfit !== 0 && <path d="M159 425 L151 570 177 590 180 438 183 590 209 570 201 425Z" fill={outfit} opacity=".95" />}
          </svg>
        </div>
        <div className="preview-id"><span className="id-name">{displayName.toUpperCase()}</span><span className="id-number">#A-47291</span></div>
      </div>
    </div>
  );
}

function RegistrationShell({ step, children, onNavigate, onStepChange, onNext, onCreate }: {
  step: number; children: ReactNode; onNavigate: (screen: Screen) => void; onStepChange: (step: number) => void; onNext: () => void; onCreate: () => void;
}) {
  return <main className="registration-page" style={{ '--artwork-url': `url("${prisonArtwork}")`, '--registration-artwork-url': `url("${registrationEnvironment}")` } as CSSProperties}>
    <header className={`registration-header registration-header-step-${step}`}><div className="prison-shell registration-header-inner"><Brand onNavigate={onNavigate} /><RegistrationProgress step={step} onStepChange={onStepChange} /><div className="registration-login"><span>MASZ JUŻ KONTO?</span><button onClick={() => onNavigate('login')} data-testid="button-registration-login">ZALOGUJ SIĘ</button></div></div></header>
    <div className="prison-shell registration-body">{step === 1 && <button className="back-home" onClick={() => onNavigate('home')}><ArrowLeft size={14} /> POWRÓT NA STRONĘ GŁÓWNĄ</button>}{children}</div>
    <div className="registration-action-bar"><div className="prison-shell registration-actions">{step > 1 ? <button className="btn btn-outline" onClick={() => onStepChange(step - 1)}><ArrowLeft size={16} /> WSTECZ</button> : <div className="registration-account-link">MASZ JUŻ KONTO? <button onClick={() => onNavigate('login')}>ZALOGUJ SIĘ</button></div>}{step === 4 ? <button className="btn btn-primary" onClick={onCreate} data-testid="button-create-prisoner">UTWÓRZ WIĘŹNIA <ArrowRight size={17} /></button> : <button className="btn btn-primary" onClick={onNext} data-testid="button-registration-next">DALEJ <ArrowRight size={17} /></button>}</div></div>
    <footer className="registration-footer"><div className="prison-shell registration-footer-inner"><Brand onNavigate={onNavigate} compact /><span>REGULAMIN</span><span>POLITYKA PRYWATNOŚCI</span><span>FAQ</span><span>KONTAKT</span><div className="registration-social"><Gamepad2 size={15} /><Facebook size={15} /><Youtube size={15} /><Instagram size={15} /></div><em>PRAWDZIWE HISTORIE<br />ZACZYNAJĄ SIĘ W WIĘZIENIU...</em></div></footer>
  </main>;
}

function Registration({ onNavigate, creator, setCreator }: { onNavigate: (screen: Screen) => void; creator: CreatorState; setCreator: Dispatch<SetStateAction<CreatorState>> }) {
  const selectedType = prisonerTypes.find((type) => type.id === creator.prisonerType)!;
  const goNext = () => {
    if (creator.step === 1 && !creator.nickname.trim()) { setCreator((current) => ({ ...current, nicknameError: 'Wpisz ksywę, zanim przejdziesz dalej.' })); return; }
    if (creator.step === 3) {
      if (!creator.account.email || !creator.account.password || !creator.account.confirmPassword) { setCreator((current) => ({ ...current, accountError: 'Uzupełnij wszystkie pola, aby przejść dalej.' })); return; }
      if (creator.account.password.length < 6) { setCreator((current) => ({ ...current, accountError: 'Hasło musi mieć co najmniej 6 znaków.' })); return; }
      if (creator.account.password !== creator.account.confirmPassword) { setCreator((current) => ({ ...current, accountError: 'Hasła muszą być identyczne.' })); return; }
    }
    setCreator((current) => ({ ...current, step: Math.min(4, current.step + 1), nicknameError: '', accountError: '' }));
  };
  const changeStep = (next: number) => setCreator((current) => ({ ...current, step: Math.max(1, Math.min(4, next)), nicknameError: '', accountError: '' }));
  if (creator.step === 2) {
    return <AppearanceCreatorStep creator={creator} setCreator={setCreator} onNext={goNext} onBack={() => changeStep(1)} />;
  }
  return <RegistrationShell step={creator.step} onNavigate={onNavigate} onStepChange={changeStep} onNext={goNext} onCreate={() => onNavigate('game')}>
    {creator.step === 1 && <section className={`type-selection-stage gender-${creator.gender}`}>
      <div className="type-selection-controls">
        <div className="type-selection-gender-toggle" role="group" aria-label="Wybierz płeć postaci"><span>PŁEĆ POSTACI</span><div><button type="button" className={creator.gender === 'male' ? 'active' : ''} onClick={() => setCreator((current) => ({ ...current, gender: 'male' }))} aria-pressed={creator.gender === 'male'} data-testid="button-gender-male">MĘŻCZYZNA</button><button type="button" className={creator.gender === 'female' ? 'active' : ''} onClick={() => setCreator((current) => ({ ...current, gender: 'female' }))} aria-pressed={creator.gender === 'female'} data-testid="button-gender-female">KOBIETA</button></div></div>
        <label className="type-selection-control-field"><span>KSYWA</span><div><UserRound size={15} /><input value={creator.nickname} onChange={(event) => setCreator((current) => ({ ...current, nickname: event.target.value, nicknameError: '' }))} placeholder="Wpisz swoją ksywę..." maxLength={18} data-testid="input-register-nickname" /></div>{creator.nicknameError && <small>{creator.nicknameError}</small>}</label>
        <label className="type-selection-control-field"><span>ŚWIAT</span><div><Flag size={15} /><select value={creator.world} onChange={(event) => setCreator((current) => ({ ...current, world: event.target.value as World }))} data-testid="select-world"><option value="central">ŚWIAT GŁÓWNY</option></select></div></label>
      </div>
      <div className="type-selection-footer-copy"><span>WYBIERZ TYP WIĘŹNIA</span><small>KAŻDY TYP TO INNA DROGA. WYBIERZ MĄDRZE.</small></div>
      <div className="type-selection-cards">
        {prisonerTypes.map((type) => <button type="button" key={type.id} className={`type-selection-card ${creator.prisonerType === type.id ? 'selected' : ''}`} onClick={() => setCreator((current) => ({ ...current, prisonerType: type.id }))} aria-pressed={creator.prisonerType === type.id} data-testid={`button-prisoner-type-${type.id}`}>
          <div className={`type-selection-card-art type-art-${type.id}`}><img src={getPrisonerAsset(type, creator.gender)} alt="" /></div>
           <div className="type-selection-card-body"><h2>{getPrisonerDisplayName(type, creator.gender)}</h2><strong><span className="type-selection-ability-icon" aria-hidden="true">{type.abilityIcon}</span>{type.abilityTitle}</strong><p>{type.abilityDescription}</p></div>
        </button>)}
      </div>
    </section>}
    {creator.step === 3 && <section className="step-screen account-step"><div className="step-heading"><div className="eyebrow">Krok 03 / Kartoteka</div><h1>DANE <span>WIĘŹNIA</span></h1><p>Twoja kartoteka jest prawie gotowa. Podaj dane, których użyjesz, aby wrócić do swojej historii.</p></div><form className="account-form" onSubmit={(event) => { event.preventDefault(); goNext(); }}><label><span><Mail size={15} /> E-MAIL</span><input type="email" autoComplete="email" value={creator.account.email} onChange={(event) => setCreator((current) => ({ ...current, account: { ...current.account, email: event.target.value }, accountError: '' }))} placeholder="więzień@prisonlife.pl" data-testid="input-auth-email" required /></label><label><span><KeyRound size={15} /> HASŁO</span><input type="password" autoComplete="new-password" minLength={6} value={creator.account.password} onChange={(event) => setCreator((current) => ({ ...current, account: { ...current.account, password: event.target.value }, accountError: '' }))} placeholder="minimum 6 znaków" data-testid="input-auth-password" required /></label><label><span><KeyRound size={15} /> POWTÓRZ HASŁO</span><input type="password" autoComplete="new-password" value={creator.account.confirmPassword} onChange={(event) => setCreator((current) => ({ ...current, account: { ...current.account, confirmPassword: event.target.value }, accountError: '' }))} placeholder="powtórz hasło" data-testid="input-auth-confirm" required /></label>{creator.accountError && <div className="form-error">{creator.accountError}</div>}<button type="submit" className="account-form-submit">SPRAWDŹ DANE <ArrowRight size={16} /></button></form><div className="account-side-note"><span>IDENTYFIKATOR</span><strong>{creator.nickname.toUpperCase() || 'NOWY WIĘZIEŃ'}</strong><small>#A-47291 / INTAKE</small><p>Dane konta są używane wyłącznie do logowania do Prison Life.</p></div></section>}
    {creator.step === 4 && <section className="step-screen summary-step"><div className="step-heading"><div className="eyebrow">Krok 04 / Kontrola</div><h1>WSZYSTKO <span>GOTOWE</span></h1><p>Sprawdź swoją kartotekę. Możesz cofnąć się i zmienić dowolny wybór.</p></div><div className="summary-grid"><CharacterPreview appearance={creator.appearance} nickname={creator.nickname} type={creator.prisonerType} /><div className="summary-details"><div className="summary-block"><span className="summary-label">KSYWA</span><strong>{creator.nickname.toUpperCase()}</strong><button onClick={() => changeStep(1)}>EDYTUJ <ChevronRight size={14} /></button></div><div className="summary-block"><span className="summary-label">TYP WIĘŹNIA</span><strong>{getPrisonerDisplayName(selectedType, creator.gender)}</strong><em>{selectedType.specialty}</em><button onClick={() => changeStep(1)}>EDYTUJ <ChevronRight size={14} /></button></div><div className="summary-stats"><span>{selectedType.abilityIcon} {selectedType.abilityTitle}</span><span>{selectedType.abilityDescription}</span></div><div className="summary-block account-summary"><span className="summary-label">DANE KONTA</span><strong>{creator.account.email}</strong><small>Hasło zabezpieczone</small><button onClick={() => changeStep(3)}>EDYTUJ <ChevronRight size={14} /></button></div></div></div></section>}
  </RegistrationShell>;
}

function AppearanceCreatorStep({ creator, setCreator, onNext, onBack }: {
  creator: CreatorState; setCreator: Dispatch<SetStateAction<CreatorState>>; onNext: () => void; onBack: () => void;
}) {
  const [tab, setTab] = useState<AppearanceTabKey>('hair');
  const activeTab = appearanceTabs.find((item) => item.key === tab)!;
  const setAppearance = (key: AppearanceKey | 'hairColor', value: number) => setCreator((current) => ({ ...current, appearance: { ...current.appearance, [key]: value } }));
  const randomizeNickname = () => setCreator((current) => ({ ...current, nickname: randomNicknames[Math.floor(Math.random() * randomNicknames.length)], nicknameError: '' }));
  return (
    <main className="appearance-creator" data-testid="appearance-creator">
      <header className="appearance-creator-topbar">
        <div className="appearance-creator-brand"><span className="brand-name">PRISON<span className="crown">◆</span>LIFE</span><span className="brand-tagline">TU ZACZYNA SIĘ PRAWDZIWA GRA</span></div>
        <span className="appearance-creator-motto">DISCIPLINE BUILDS FREEDOM</span>
        <button type="button" className="appearance-creator-close" onClick={onBack} aria-label="Wróć do wyboru typu więźnia" data-testid="button-appearance-back"><X size={18} /></button>
      </header>
      <div className="appearance-creator-body">
        <aside className="appearance-creator-nav">
          <div className="appearance-creator-nav-heading"><h1>WYBIERZ WYGLĄD</h1><p>DOSTOSUJ SWOJĄ POSTAĆ. WYGLĄD NIE DAJE PRZEWAGI W GRZE.</p></div>
          <div className="appearance-creator-tabs">
            {appearanceTabs.map((item) => <button type="button" key={item.key} className={`appearance-creator-tab ${tab === item.key ? 'active' : ''}`} onClick={() => setTab(item.key)} aria-pressed={tab === item.key} data-testid={`button-appearance-tab-${item.key}`}><item.icon size={18} /><span>{item.label}</span></button>)}
          </div>
          <em className="appearance-creator-nav-footer">TAKA<br />JEST GRA</em>
        </aside>
        <div className="appearance-creator-stage">
          <div className="appearance-creator-photo">
            <div className={`appearance-creator-character-layer figure-skin-${creator.appearance.skin}`} style={{ '--hair-color': hairColorOptions[creator.appearance.hairColor].color } as CSSProperties}>
              <img className="appearance-creator-photo-img" src={creator.appearance.hair === 2 ? bullShortHairAsset : bullDefaultAsset} alt="Podgląd Twojej postaci" />
              {creator.appearance.hair === 4 && <img className="appearance-creator-hair-photo appearance-creator-hair-photo-irokez" src={wlosyIrokezAsset} alt="" aria-hidden="true" />}
              {creator.appearance.hair > 0 && creator.appearance.hair !== 2 && creator.appearance.hair !== 4 && <span className={`appearance-creator-hair appearance-creator-hair-${creator.appearance.hair}`} aria-hidden="true" />}
              {creator.appearance.beard === 2 ? <img className="appearance-creator-beard-asset" src={fullBeardAsset} alt="" aria-hidden="true" /> : creator.appearance.beard > 0 && <span className={`appearance-creator-beard appearance-creator-beard-${creator.appearance.beard}`} aria-hidden="true" />}
              <span className="appearance-creator-eye-tint appearance-creator-eye-left" style={{ background: eyeColorSwatches[creator.appearance.eyes] }} aria-hidden="true" />
              <span className="appearance-creator-eye-tint appearance-creator-eye-right" style={{ background: eyeColorSwatches[creator.appearance.eyes] }} aria-hidden="true" />
            </div>
          </div>
          <div className="appearance-creator-name-bar">
            <label><UserRound size={15} /><input value={creator.nickname} onChange={(event) => setCreator((current) => ({ ...current, nickname: event.target.value, nicknameError: '' }))} placeholder="WPISZ SWOJĄ NAZWĘ" maxLength={18} data-testid="input-appearance-nickname" /></label>
            <button type="button" className="appearance-creator-dice" onClick={randomizeNickname} aria-label="Wylosuj ksywę" data-testid="button-appearance-randomize"><Dices size={18} /></button>
          </div>
        </div>
        <aside className="appearance-creator-panel">
          <h2>{activeTab.label}</h2>
          <div className="appearance-option-grid">
            {activeTab.options.map((option) => <button type="button" key={option.id} className={`appearance-option-tile ${creator.appearance[activeTab.key] === option.id ? 'selected' : ''}`} onClick={() => setAppearance(activeTab.key, option.id)} aria-pressed={creator.appearance[activeTab.key] === option.id} data-testid={`button-appearance-option-${activeTab.key}-${option.id}`}>
              {option.color ? <span className="appearance-option-swatch" style={{ background: option.color }} /> : <span className="appearance-option-icon"><activeTab.icon size={20} /></span>}
              <span className="appearance-option-label">{option.label}</span>
            </button>)}
          </div>
          {tab === 'hair' && <>
            <h2>KOLOR WŁOSÓW</h2>
            <div className="appearance-option-grid appearance-color-grid">
              {hairColorOptions.map((option) => <button type="button" key={option.id} className={`appearance-option-tile appearance-color-tile ${creator.appearance.hairColor === option.id ? 'selected' : ''}`} onClick={() => setAppearance('hairColor', option.id)} aria-pressed={creator.appearance.hairColor === option.id} data-testid={`button-hair-color-${option.id}`}>
                <span className="appearance-option-swatch" style={{ background: option.color }} />
                <span className="appearance-option-label">{option.label}</span>
              </button>)}
            </div>
          </>}
          {tab === 'face' && <>
            <h2>KOLOR SKÓRY</h2>
            <div className="appearance-option-grid appearance-option-grid-swatches">
              {skinToneOptions.map((option) => <button type="button" key={option.id} className={`appearance-option-tile appearance-option-tile-swatch ${creator.appearance.skin === option.id ? 'selected' : ''}`} onClick={() => setAppearance('skin', option.id)} aria-pressed={creator.appearance.skin === option.id} data-testid={`button-appearance-option-skin-${option.id}`}>
                <span className="appearance-option-swatch" style={{ background: option.color }} />
                <span className="appearance-option-label">{option.label}</span>
              </button>)}
            </div>
          </>}
        </aside>
      </div>
      <div className="appearance-creator-actions">
        <button type="button" className="btn btn-outline" onClick={onBack} data-testid="button-appearance-back-bottom"><ArrowLeft size={16} /> WSTECZ</button>
        <button type="button" className="btn btn-primary" onClick={onNext} data-testid="button-appearance-next">DALEJ <ArrowRight size={17} /></button>
      </div>
    </main>
  );
}

type CreatorState = { step: number; nickname: string; nicknameError: string; gender: Gender; world: World; prisonerType: PrisonerType; appearance: Appearance; account: AccountData; accountError: string };
const initialCreator: CreatorState = { step: 1, nickname: '', nicknameError: '', gender: 'male', world: 'central', prisonerType: 'bull', appearance: { face: 0, hair: 2, beard: 1, tattoo: 1, scar: 0, eyes: 0, outfit: 0, skin: 1, hairColor: 0 }, account: { email: '', password: '', confirmPassword: '' }, accountError: '' };

function AuthScreen({ mode, onNavigate }: { mode: 'login' | 'register'; onNavigate: (screen: Screen) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState('');
  const register = mode === 'register';
  const submit = (event: FormEvent) => { event.preventDefault(); setNotice('Tryb demonstracyjny: logowanie będzie dostępne przy otwarciu serwera.'); };
  return <main className="auth-page" style={{ '--artwork-url': `url("${prisonArtwork}")` } as CSSProperties}><div className="auth-backdrop" /><header className="auth-header"><Brand onNavigate={onNavigate} /><button onClick={() => onNavigate('home')} className="auth-return"><ArrowLeft size={15} /> WRÓĆ NA STRONĘ GŁÓWNĄ</button></header><section className="auth-card"><div className="eyebrow">{register ? 'Nowy więzień' : 'Powrót za kraty'}</div><h1>{register ? 'ZAREJESTRUJ SIĘ' : 'ZALOGUJ SIĘ'}</h1><p>{register ? 'Stwórz swoją kartotekę i wybierz, jaką reputację zbudujesz za kratami.' : 'Wróć do swojej celi. Twoja reputacja nie poczeka.'}</p><form onSubmit={submit}><label><span><Mail size={15} /> ADRES E-MAIL</span><input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="więzień@prisonlife.pl" required /></label><label><span><KeyRound size={15} /> HASŁO</span><input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="wpisz hasło" required minLength={6} /></label><button className="btn btn-primary" type="submit">{register ? 'OTWÓRZ KARTOTEKĘ' : 'WEJDŹ DO GRY'} <ArrowRight size={16} /></button></form>{notice && <div className="auth-notice">{notice}</div>}<button className="auth-switch" onClick={() => onNavigate(register ? 'login' : 'register')}>{register ? 'MASZ JUŻ KONTO? ' : 'NIE MASZ JESZCZE KONTA? '}<strong>{register ? 'ZALOGUJ SIĘ' : 'ZAREJESTRUJ SIĘ'}</strong></button></section><div className="auth-quote">„ZA KRATAMI NIE MA PRZYPADKÓW.<br /><span>SĄ TYLKO DECYZJE.</span>”</div></main>;
}

type GameSection = 'cell' | 'messages' | 'fight' | 'training' | 'work' | 'market' | 'quests' | 'trash-block' | 'gang' | 'ranking' | 'cell-development' | 'achievements' | 'statistics' | 'settings';
function GameShell({ creator, onNavigate }: { creator: CreatorState; onNavigate: (screen: Screen) => void }) {
  const [activeSection, setActiveSection] = useState<GameSection>(() => {
    const route = window.location.hash.replace('#', '');
    return (route.startsWith('game/') ? route.split('/')[1] : 'cell') as GameSection;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [chatTab, setChatTab] = useState<'ODDZIAŁ A' | 'GLOBALNY' | 'GANG'>('ODDZIAŁ A');
  const [chatMessage, setChatMessage] = useState('');
  const [chatLines, setChatLines] = useState([{ time: '18:24', name: 'Kosa', text: 'Ktoś idzie na stołówkę?' }, { time: '18:25', name: 'Rychu', text: 'Ja o 19' }, { time: '18:25', name: 'Beton', text: 'Dawaj, łatwiej w ekipie.' }, { time: '18:26', name: 'Młody', text: 'Gdzie dokładnie?' }, { time: '18:27', name: 'Rychu', text: 'Plac, sektor B' }]);
  const [visited, setVisited] = useState<Set<HotspotId>>(new Set());
  const [newMessageOpen, setNewMessageOpen] = useState(false);
  const type = prisonerTypes.find((item) => item.id === creator.prisonerType)!;
  const gameData = {
    nickname: creator.nickname.trim() || 'KOSA',
    level: 1,
    xp: 120,
    xpMax: 500,
    gold: 250,
    points: 3,
    energy: 100,
    hp: 100,
    reputation: 0,
    rank: 'NOWY',
  };

  useEffect(() => {
    const handleGameRoute = () => {
      const route = window.location.hash.replace('#', '');
      if (route.startsWith('game/')) setActiveSection(route.split('/')[1] as GameSection);
    };
    window.addEventListener('hashchange', handleGameRoute);
    return () => window.removeEventListener('hashchange', handleGameRoute);
  }, []);

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3200);
  };
  const navigateSection = (section: GameSection) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
    window.history.pushState({}, '', `#game/${section}`);
     if (section !== 'cell' && section !== 'cell-development' && section !== 'fight' && section !== 'work' && section !== 'market' && section !== 'quests' && section !== 'gang') showNotice(`${allGameNavigation.find((item) => item.id === section)?.label}: widok przygotowany do podłączenia.`);
  };
  const activateHotspot = (id: HotspotId) => {
    setVisited((current) => new Set(current).add(id));
    const messages: Record<HotspotId, string> = {
      bed: 'Łóżko: odpoczynek przywróci energię.',
      shelf: 'Półka: tutaj przechowujesz drobiazgi i notatki.',
      locker: 'Szafka: schowek jest gotowy na Twój ekwipunek.',
      sink: 'Umywalka: zimna woda pomaga zachować czujność.',
      table: 'Stół: tutaj rozpoczniesz zadania.',
      stool: 'Stołek: mały, ale przydatny element celi.',
      tv: 'Telewizor: sprawdzasz najnowsze wiadomości z bloku.',
      vent: 'Wentylacja: przez kratkę słychać życie całego bloku.',
    };
    showNotice(messages[id]);
  };
  const sendChat = (event: FormEvent) => {
    event.preventDefault();
    const value = chatMessage.trim();
    if (!value) return;
    setChatLines((lines) => [...lines, { time: 'teraz', name: gameData.nickname, text: value }]);
    setChatMessage('');
  };

  return <main className="game-shell-page">
    <header className="game-header">
      <div className="game-header-brand"><Brand onNavigate={onNavigate} /><span className="game-season">SEZON 01 / BLOK A</span></div>
      <button className="game-mobile-menu-toggle" onClick={() => setMobileMenuOpen((open) => !open)} aria-label="Otwórz menu gry"><Menu size={21} /></button>
       <div className="game-player-summary"><img className="game-header-avatar" src={prisonerAsset} alt="" /><div className="game-player-name"><strong>{gameData.nickname.toUpperCase()}</strong><span>POZIOM {gameData.level}</span><div className="game-xp"><i style={{ width: `${(gameData.xp / gameData.xpMax) * 100}%` }} /><small>{gameData.xp} / {gameData.xpMax} XP</small></div></div></div>
       <div className="game-resources"><span className="resource-money"><CircleDollarSign size={18} /> {gameData.gold}</span><span className="resource-points"><Gem size={18} /><span className="resource-points-copy"><b>{gameData.points}</b><small>PUNKTY</small></span></span><span className="resource-energy"><Zap size={18} /> {gameData.energy} / 100</span><span className="resource-health"><Heart size={18} /> {gameData.hp} / 100</span></div>
      <div className="game-header-actions"><button aria-label="Powiadomienia" className="header-icon-button notification-button" onClick={() => showNotice('Nie masz nowych powiadomień.')}><Bell size={18} /><b>3</b></button><button aria-label="Ustawienia" className="header-icon-button" onClick={() => showNotice('Ustawienia konta będą dostępne wkrótce.')}><Settings size={18} /></button><button className="game-logout" onClick={() => onNavigate('home')}><LogOut size={16} /> WYLOGUJ SIĘ <ArrowRight size={15} /></button></div>
    </header>
    <div className="game-layout">
      <aside className={`game-sidebar game-sidebar-with-development ${mobileMenuOpen ? 'mobile-sidebar-open' : ''}`}><div className="sidebar-heading">NAWIGACJA</div>{gameNavigation.map(({ id, label, icon: Icon }) => <button className={activeSection === id ? 'active' : ''} key={id} onClick={() => navigateSection(id)}><Icon size={18} /> <span>{label}</span>{id === 'messages' && <b className="sidebar-badge">3</b>}</button>)}<div className="sidebar-section-label">ROZWÓJ <i /></div>{gameSecondaryNavigation.map(({ id, label, icon: Icon }) => <button className={activeSection === id ? 'active' : ''} key={id} onClick={() => navigateSection(id)}><Icon size={18} /> <span>{label}</span></button>)}</aside>
       <div className={`game-content ${activeSection === 'cell' ? 'game-content-character' : activeSection === 'cell-development' ? 'game-content-development' : activeSection === 'training' ? 'game-content-training' : activeSection === 'fight' ? 'game-content-fight' : activeSection === 'work' ? 'game-content-work' : activeSection === 'quests' ? 'game-content-missions' : activeSection === 'market' ? 'game-content-market' : activeSection === 'gang' ? 'game-content-gang' : ''}`}>
        {activeSection === 'cell' ? <CharacterView creator={creator} gameData={gameData} onNotice={showNotice} /> : activeSection === 'cell-development' ? <CellDevelopmentView onNotice={showNotice} /> : activeSection === 'training' ? <TrainingView onNotice={showNotice} /> : activeSection === 'fight' ? <FightView creator={creator} gameData={gameData} onNotice={showNotice} onReturn={() => navigateSection('cell')} /> : activeSection === 'work' ? <WorkView creator={creator} onNotice={showNotice} /> : activeSection === 'quests' ? <MissionsCardsView onNotice={showNotice} /> : activeSection === 'market' ? <MarketView onNotice={showNotice} /> : activeSection === 'gang' ? <GangView onNotice={showNotice} /> : <GamePlaceholder section={activeSection} onReturn={() => navigateSection('cell')} />}
      </div>
    </div>
    <footer className="game-footer"><span>© 2026 Prison Life. Wszystkie prawa zastrzeżone.</span><div><button onClick={() => showNotice('Regulamin będzie dostępny przy otwarciu serwera.')}>Regulamin</button><button onClick={() => showNotice('Polityka prywatności będzie dostępna przy otwarciu serwera.')}>Polityka prywatności</button><button onClick={() => showNotice('Pomoc będzie dostępna przy otwarciu serwera.')}>Pomoc</button></div></footer>
    {notice && <div className="notice game-notice" role="status">{notice}</div>}
  </main>;
}

function App() {
  const [screen, setScreen] = useState<Screen>(() => {
    const route = window.location.hash.replace('#', '');
    return route === 'register' ? 'register' : route === 'login' ? 'login' : route === 'game' || route.startsWith('game/') ? 'game' : 'home';
  });
  const [creator, setCreator] = useState<CreatorState>(() => {
    try {
      const saved = window.localStorage.getItem('prison-life-creator');
      if (!saved) return initialCreator;
      const parsed = JSON.parse(saved) as Partial<CreatorState>;
      return {
        ...initialCreator,
        ...parsed,
        appearance: { ...initialCreator.appearance, ...(parsed.appearance ?? {}) },
        account: { ...initialCreator.account, ...(parsed.account ?? {}) },
      };
    } catch {
      return initialCreator;
    }
  });
  const navigate = (next: Screen) => { setScreen(next); window.history.pushState({}, '', next === 'home' ? `${window.location.pathname}` : `#${next}`); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  useEffect(() => { const handlePop = () => { const route = window.location.hash.replace('#', ''); setScreen(route === 'register' ? 'register' : route === 'login' ? 'login' : route === 'game' || route.startsWith('game/') ? 'game' : 'home'); }; window.addEventListener('popstate', handlePop); window.addEventListener('hashchange', handlePop); return () => { window.removeEventListener('popstate', handlePop); window.removeEventListener('hashchange', handlePop); }; }, []);
  useEffect(() => { window.localStorage.setItem('prison-life-creator', JSON.stringify(creator)); }, [creator]);
  useEffect(() => { document.title = screen === 'home' ? 'Prison Life — Więcej niż gra. To Twój wyrok.' : screen === 'register' ? 'Stwórz swojego więźnia — Prison Life' : screen === 'login' ? 'Zaloguj się — Prison Life' : 'Panel więźnia — Prison Life'; }, [screen]);
  return <QueryClientProvider client={queryClient}><TooltipProvider><ErrorBoundary resetKey="prison-life">{screen === 'home' && <Home onNavigate={navigate} />}{screen === 'register' && <Registration onNavigate={navigate} creator={creator} setCreator={setCreator} />}{screen === 'login' && <AuthScreen mode="login" onNavigate={navigate} />}{screen === 'game' && <GameShell creator={creator} onNavigate={navigate} />}</ErrorBoundary><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;

type HotspotId = keyof typeof cellLayout.interactive_slots;

type CellSlot = {
  id: HotspotId;
  label: string;
  description: string;
  icon: typeof BedDouble;
  x: number;
  y: number;
  width: number;
  height: number;
};

function CellHotspot({ id, label, description, icon: Icon, x, y, width, height, onClick, active }: CellSlot & { onClick: () => void; active: boolean }) {
  return <button className={`cell-hotspot hotspot-${id} ${active ? 'visited' : ''}`} style={{ left: `${x}%`, top: `${y}%`, width: `${width}%`, height: `${height}%` }} onClick={onClick} data-testid={`button-hotspot-${id}`}><span className="hotspot-icon"><Icon size={17} /></span><span><strong>{label}</strong><small>{description}</small></span><ChevronRight size={14} /></button>;
}

function GamePlaceholder({ section, onReturn }: { section: GameSection; onReturn: () => void }) {
  const item = allGameNavigation.find((entry) => entry.id === section)!;
  const Icon = item.icon;
  const copy: Record<GameSection, string> = {
    cell: 'Wróć do swojej celi i sprawdź, co dzieje się na bloku.',
    messages: 'Twoja skrzynka wiadomości jest gotowa na pierwsze rozmowy.',
    fight: 'Przygotuj się do walki. System pojedynków zostanie podłączony w następnym etapie.',
    training: 'Wybierz trening, aby rozwijać siłę, kondycję i pozostałe statystyki.',
    work: 'Znajdź pracę i zacznij zarabiać. Lista stanowisk jest w przygotowaniu.',
    market: 'Czarny rynek jest zamknięty. Wróć później po świeżą dostawę.',
    quests: 'Twoje misje czekają na podjęcie. Wybierz zlecenie i zbuduj swoją pozycję na bloku.',
    'trash-block': 'Blok śmieci otworzy dostęp do zadań i informacji z najniższego poziomu więzienia.',
    gang: 'Dołącz do gangu i zbuduj swoją pozycję w oddziale.',
    ranking: 'Ranking bloku zostanie otwarty, gdy rozpoczniesz pierwszy dzień.',
    'cell-development': 'Rozbuduj swoją celę, odblokuj nowe wyposażenie i stwórz własną przewagę za kratami.',
    achievements: 'Zdobywaj osiągnięcia za rozwój postaci i kolejne dni za kratami.',
    statistics: 'Sprawdzaj swoje wyniki, postępy i najważniejsze liczby z pobytu.',
    settings: 'Dostosuj ustawienia konta i preferencje gry.',
  };
  return <section className="game-placeholder" data-testid={`game-placeholder-${section}`}><div className="placeholder-stamp">BLOK A / SYSTEM</div><Icon size={48} /><span className="eyebrow">SEKCJA GRY</span><h1>{item.label}</h1><p>{copy[section]}</p><button className="btn btn-primary" onClick={onReturn}><Shield size={15} /> WRÓĆ DO CELI</button></section>;
}

const characterSceneAsset = characterScenePhoto;

const characterEquipmentSlots: Array<{ id: string; label: string; icon: typeof Shield; asset?: string }> = [
  { id: 'head', label: 'GŁOWA', icon: Shield, asset: inventoryHeadCapAsset },
  { id: 'neck', label: 'SZYJA', icon: Gem },
  { id: 'torso', label: 'TORS', icon: ShirtIcon, asset: inventoryTopOrangeAsset },
  { id: 'back', label: 'PLECY', icon: Backpack, asset: inventoryBagBlackAsset },
  { id: 'hands', label: 'DŁONIE', icon: Hand, asset: inventoryHandGlovesAsset },
  { id: 'legs', label: 'SPODNIE', icon: Archive, asset: inventoryBottomOrangeAsset },
  { id: 'feet', label: 'BUTY', icon: FootprintsIcon, asset: inventoryFeetBlackBootsAsset },
  { id: 'weapon', label: 'BROŃ', icon: Swords, asset: inventoryWeaponKnifeAsset },
];
const characterInventoryTabs = ['WSZYSTKIE', 'UBRANIA', 'DODATKI', 'BROŃ', 'INNE'] as const;
const characterInventoryItemsData: Array<{ id: string; name: string; asset: string; rarity: string; slot: string }> = [
  { id: 'cap', name: 'CZAPKA PRISON', asset: inventoryHeadCapAsset, rarity: 'orange', slot: 'head' },
  { id: 'bandana', name: 'CZERWONA BANDANA', asset: inventoryFaceBandanaAsset, rarity: 'violet', slot: 'neck' },
  { id: 'orange-shirt', name: 'KOSZULA A-7421', asset: inventoryTopOrangeAsset, rarity: 'orange', slot: 'torso' },
  { id: 'black-hoodie', name: 'CZARNA BLUZA', asset: inventoryTopBlackHoodieAsset, rarity: 'blue', slot: 'torso' },
  { id: 'black-backpack', name: 'PLECAK TAKTYCZNY', asset: inventoryBagBlackAsset, rarity: 'blue', slot: 'back' },
  { id: 'gloves', name: 'RĘKAWICE', asset: inventoryHandGlovesAsset, rarity: 'gray', slot: 'hands' },
  { id: 'orange-pants', name: 'SPODNIE A-7421', asset: inventoryBottomOrangeAsset, rarity: 'orange', slot: 'legs' },
  { id: 'black-boots', name: 'CZARNE TRAPERY', asset: inventoryFeetBlackBootsAsset, rarity: 'blue', slot: 'feet' },
  { id: 'knife', name: 'NÓŻ', asset: inventoryWeaponKnifeAsset, rarity: 'violet', slot: 'weapon' },
];
const characterDefaultEquipped: Record<string, string | null> = {
  head: 'cap',
  neck: null,
  torso: 'orange-shirt',
  back: 'black-backpack',
  hands: 'gloves',
  legs: 'orange-pants',
  feet: 'black-boots',
  weapon: 'knife',
};
const characterStatsList: Array<{ key: string; label: string; value: number; max: number; icon: typeof Shield; tone: string }> = [
  { key: 'health', label: 'ZDROWIE', value: 100, max: 100, icon: Heart, tone: 'red' },
  { key: 'luck', label: 'SZCZĘŚCIE', value: 12, max: 100, icon: Clover, tone: 'green' },
  { key: 'strength', label: 'SIŁA', value: 11, max: 100, icon: Dumbbell, tone: 'orange' },
  { key: 'endurance', label: 'KONDYCJA', value: 17, max: 100, icon: Activity, tone: 'blue' },
  { key: 'intelligence', label: 'INTELIGENCJA', value: 11, max: 100, icon: Brain, tone: 'violet' },
  { key: 'reflex', label: 'REFLEKS', value: 14, max: 100, icon: Zap, tone: 'yellow' },
];

function CharacterView({ creator, gameData, onNotice }: { creator: CreatorState; gameData: { nickname: string; level: number; xp: number; xpMax: number; gold: number; points: number; energy: number; hp: number; reputation: number; rank: string }; onNotice: (message: string) => void }) {
  const [stats, setStats] = useState(characterStatsList);
  const [availablePoints, setAvailablePoints] = useState(3);
  const [inventoryTab, setInventoryTab] = useState<typeof characterInventoryTabs[number]>('WSZYSTKIE');
  const [inventoryPage, setInventoryPage] = useState(1);
  const [equipped, setEquipped] = useState<Record<string, string | null>>(characterDefaultEquipped);
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);
  const [dragOverInventory, setDragOverInventory] = useState(false);
  const inventoryPageCount = 3;
  const increaseStat = (key: string) => {
    if (!availablePoints) {
      onNotice('Brak dostępnych punktów rozwoju.');
      return;
    }
    setStats((current) => current.map((stat) => stat.key === key ? { ...stat, value: Math.min(stat.max, stat.value + 1) } : stat));
    setAvailablePoints((current) => current - 1);
    onNotice(`Rozwinięto statystykę: ${stats.find((s) => s.key === key)?.label.toLowerCase()}.`);
  };
  const equippedItemIds = new Set(Object.values(equipped).filter((value): value is string => Boolean(value)));
  const handleItemDragStart = (event: DragEvent<HTMLButtonElement>, itemId: string) => {
    event.dataTransfer.setData('application/json', JSON.stringify({ source: 'inventory', itemId }));
    event.dataTransfer.effectAllowed = 'move';
  };
  const handleSlotDragStart = (event: DragEvent<HTMLButtonElement>, slotId: string) => {
    if (!equipped[slotId]) return;
    event.dataTransfer.setData('application/json', JSON.stringify({ source: 'slot', slotId }));
    event.dataTransfer.effectAllowed = 'move';
  };
  const handleSlotDrop = (event: DragEvent<HTMLButtonElement>, slotId: string) => {
    event.preventDefault();
    setDragOverSlot(null);
    const payload = event.dataTransfer.getData('application/json');
    if (!payload) return;
    const data = JSON.parse(payload) as { source: 'inventory' | 'slot'; itemId?: string; slotId?: string };
    if (data.source !== 'inventory' || !data.itemId) return;
    const item = characterInventoryItemsData.find((entry) => entry.id === data.itemId);
    if (!item) return;
    if (item.slot !== slotId) {
      onNotice(`${item.name} nie pasuje do tego miejsca.`);
      return;
    }
    setEquipped((current) => ({ ...current, [slotId]: item.id }));
    onNotice(`Założono: ${item.name.toLowerCase()}.`);
  };
  const handleInventoryDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOverInventory(false);
    const payload = event.dataTransfer.getData('application/json');
    if (!payload) return;
    const data = JSON.parse(payload) as { source: 'inventory' | 'slot'; itemId?: string; slotId?: string };
    if (data.source !== 'slot' || !data.slotId) return;
    const slotMeta = characterEquipmentSlots.find((entry) => entry.id === data.slotId);
    setEquipped((current) => ({ ...current, [data.slotId as string]: null }));
    onNotice(`${slotMeta?.label ?? 'Przedmiot'}: zdjęto.`);
  };
  return <section className="character-view" data-testid="character-view">
    <header className="character-heading">
      <div><span className="eyebrow">TWOJA POSTAĆ</span><h1>TWOJA POSTAĆ</h1><p>WYGLĄD TO NIE WSZYSTKO, ALE MÓWI O TOBIE WIĘCEJ NIŻ MYŚLISZ.</p></div>
      <strong>LEPSZY<br />WIĘZIEŃ<br />SILNIEJSZA<br />WERSJA<br /><em>CIEBIE</em></strong>
    </header>
    <div className="character-outfit-layout">
      <aside className="character-slots-rail">
        {characterEquipmentSlots.map(({ id, label, icon: Icon }) => {
          const equippedItem = equipped[id] ? characterInventoryItemsData.find((entry) => entry.id === equipped[id]) : undefined;
          return <button
            className={`character-slot-card ${equippedItem ? 'filled' : ''} ${dragOverSlot === id ? 'drag-over' : ''}`}
            key={id}
            draggable={Boolean(equippedItem)}
            onDragStart={(event) => handleSlotDragStart(event, id)}
            onDragOver={(event) => { event.preventDefault(); setDragOverSlot(id); }}
            onDragLeave={() => setDragOverSlot((current) => current === id ? null : current)}
            onDrop={(event) => handleSlotDrop(event, id)}
            onClick={() => equippedItem ? onNotice(`${equippedItem.name}: przeciągnij do ekwipunku, żeby zdjąć.`) : onNotice(`${label}: przeciągnij tu pasujący przedmiot z ekwipunku.`)}
          >
            <span className="character-slot-thumb">{equippedItem ? <img src={equippedItem.asset} alt="" /> : <Icon size={28} />}</span>
            <span className="character-slot-label">{label}</span>
          </button>;
        })}
      </aside>

      <div className="character-scene" data-testid="character-scene">
        {characterSceneAsset && <span className="character-scene-photo" style={{ backgroundImage: `url("${characterSceneAsset}")` }} />}
      </div>

      <aside className="character-inventory-panel">
        <div className="character-panel-heading"><h2>EKWIPUNEK</h2></div>
        <div className="character-inventory-tabs">{characterInventoryTabs.map((tab) => <button className={inventoryTab === tab ? 'active' : ''} onClick={() => setInventoryTab(tab)} key={tab}>{tab}</button>)}</div>
        <div className="character-inventory-toolbar">
          <label className="character-inventory-search"><Search size={14} /><input placeholder="Szukaj przedmiotu..." onChange={() => undefined} /></label>
          <button className="character-inventory-sort" onClick={() => onNotice('Sortowanie ekwipunku będzie dostępne wkrótce.')}>Sortuj: Rzadkość <ChevronRight size={12} /></button>
        </div>
        <div
          className={`character-inventory-grid ${dragOverInventory ? 'drag-over' : ''}`}
          onDragOver={(event) => { event.preventDefault(); setDragOverInventory(true); }}
          onDragLeave={() => setDragOverInventory(false)}
          onDrop={handleInventoryDrop}
        >{characterInventoryItemsData.map(({ id, name, asset, rarity }) => <button
          className={`character-inventory-item ${equippedItemIds.has(id) ? 'equipped' : ''}`}
          key={id}
          title={name}
          draggable
          onDragStart={(event) => handleItemDragStart(event, id)}
          onClick={() => onNotice(`Podgląd przedmiotu: ${name.toLowerCase()}.`)}
        >
          <span className={`character-inventory-rarity tone-${rarity}`} />
          <img src={asset} alt={name} />
          {equippedItemIds.has(id) && <span className="character-inventory-equipped-badge"><Check size={11} /></span>}
        </button>)}</div>
        <div className="character-inventory-pagination">
          <button onClick={() => setInventoryPage((page) => Math.max(1, page - 1))} aria-label="Poprzednia strona"><ChevronLeft size={15} /></button>
          <span>{inventoryPage}/{inventoryPageCount}</span>
          <button onClick={() => setInventoryPage((page) => Math.min(inventoryPageCount, page + 1))} aria-label="Następna strona"><ChevronRight size={15} /></button>
        </div>

        <section className="character-panel character-stats">
          <div className="character-panel-heading"><h2>STATYSTYKI</h2></div>
          {stats.map(({ key, label, value, max, icon: Icon, tone }) => <div className="character-stat-row" key={key}>
            <span className={`character-icon-badge tone-${tone}`}><Icon size={15} /></span>
            <strong>{label}</strong>
            <div className="character-stat-bar"><i className={`tone-${tone}`} style={{ width: `${Math.min(100, (value / max) * 100)}%` }} /></div>
            <b>{value}</b>
            <button className="character-stat-plus" onClick={() => increaseStat(key)} aria-label={`Zwiększ ${label}`}><Plus size={15} /></button>
          </div>)}
        </section>
      </aside>
      <div className="character-flavor-badge"><Crown size={14} /><span>CHARAKTER<br />ROBI RÓŻNICĘ</span><em>HH</em></div>
    </div>
  </section>;
}

function GangView({ onNotice }: { onNotice: (message: string) => void }) {
  const [tab, setTab] = useState('PRZEGLĄD');
  const [treasury, setTreasury] = useState(12450);
  const tabs = [
    { label: 'PRZEGLĄD', icon: Shield },
    { label: 'CZŁONKOWIE', icon: Users },
    { label: 'ROZWÓJ', icon: BarChart3 },
    { label: 'WOJNY', icon: Swords },
    { label: 'SKARBIEC', icon: Archive },
    { label: 'MISJE GANGU', icon: Trophy },
    { label: 'USTAWIENIA', icon: Settings },
  ];
  const members = [
    ['F1QU', 'Założyciel', '8', 'Online', '—'],
    ['Kamil', 'Oficer', '12', 'Online', '•••'],
    ['StaryDozor', 'Oficer', '10', 'Online', '•••'],
    ['Beton', 'Członek', '9', '2h temu', '•••'],
    ['Malina', 'Członek', '7', '5h temu', '•••'],
    ['Cichy', 'Rekrut', '5', '1 dzień temu', '•••'],
    ['Rzeźnik', 'Rekrut', '4', '3 dni temu', '•••'],
  ];
  const events = [
    ['12.05', 'F1QU awansował gracza Kamil do rangi Oficer.'],
    ['11.05', 'Gang wygrał wojnę z Czerwone Węże.'],
    ['10.05', 'Nowy członek: StaryDozor.'],
    ['08.05', 'Ukończono misję gangową: Przemyt.'],
    ['07.05', 'Wpłacono 5 000 $ do skarbca.'],
  ];
  const notify = (message: string) => onNotice(message);
  return <section className="gang-view" data-testid="gang-view">
    <header className="gang-heading">
      <div><span className="eyebrow">GANG</span><h1>GANG</h1><p>TWÓJ GANG. TWOJE ZASADY. RAZEM TWORZYMY SIŁĘ.</p></div>
      <aside className="gang-founder"><Crown size={18} /><div><b>ZAŁOŻYCIEL</b><strong>F1QU</strong><small>OD 12.04.2025</small></div><button onClick={() => notify('Edycja emblematu będzie dostępna wkrótce.')}>EDYTUJ EMBLEMAT</button></aside>
      <div className="gang-quote">LOJALNOŚĆ<br />SIŁA<br />SZACUNEK<br />WOLNOŚĆ<br /><em>NAWET TUTAJ</em></div>
    </header>
    <section className="gang-identity">
      <div className="gang-emblem"><Crown size={75} /><Swords size={50} /></div>
      <div className="gang-identity-copy"><h2>WILCZA PACZKA <button onClick={() => notify('Nazwa gangu będzie można zmienić później.')}><UserRoundPen size={14} /></button></h2><p>„Zawsze razem. Zawsze do końca.”</p><div className="gang-badges"><span>★ POZIOM 3</span><span><Users size={13} /> 12 CZŁONKÓW</span><span>♟ REPUTACJA: <b>POZYTYWNA</b></span></div><div className="gang-xp"><i style={{ width: '45%' }} /><small>450 / 1 000 XP</small></div></div>
      <button className="gang-develop-button" onClick={() => setTab('ROZWÓJ')}>ROZWÓJ GANGU <ChevronRight size={13} /></button>
    </section>
    <nav className="gang-tabs" role="tablist">{tabs.map(({ label, icon: TabIcon }) => <button key={label} className={tab === label ? 'active' : ''} onClick={() => { setTab(label); notify(`${label}: panel zostanie otwarty wkrótce.`); }} role="tab" aria-selected={tab === label}><TabIcon size={14} />{label}</button>)}</nav>
    <div className="gang-dashboard">
      <div className="gang-main-column">
        <section className="gang-panel gang-stats"><h3>STATYSTYKI GANGU</h3><div className="gang-stat-grid"><div><Users size={19} /><b>12</b><span>CZŁONKÓW</span></div><div><Award size={19} /><b>3</b><span>POZIOM</span></div><div><Trophy size={19} /><b>145</b><span>PUNKTY PRESTIŻU</span></div><div><Swords size={19} /><b>8</b><span>WYGRANE WOJNY</span></div></div></section>
        <section className="gang-panel gang-members"><div className="gang-panel-title"><h3>CZŁONKOWIE GANGU</h3><button onClick={() => notify('Zarządzanie członkami będzie dostępne wkrótce.')}>ZARZĄDZAJ CZŁONKAMI <ChevronRight size={12} /></button></div><div className="gang-member-head"><span>#</span><span>NICK</span><span>RANGA</span><span>POZIOM</span><span>AKTYWNOŚĆ</span><span> </span></div>{members.map(([nick, rank, level, status, more], index) => <div className="gang-member-row" key={nick}><span>{index + 1}</span><b>{nick}</b><span className={rank === 'Założyciel' ? 'founder-text' : ''}>{rank}</span><span>{level}</span><span className={status === 'Online' ? 'online' : 'away'}><i />{status}</span><span>{more}</span></div>)}<small className="gang-member-count">Pokazano 7 z 12 członków <button onClick={() => notify('Wyświetlasz wszystkich członków gangu.')}>ZOBACZ WSZYSTKICH <ChevronRight size={11} /></button></small></section>
      </div>
      <div className="gang-middle-column">
        <section className="gang-panel gang-benefits"><h3>KORZYŚCI GANGU</h3>{[['+3% do zarobków za pracę', BriefcaseBusiness], ['+5% do skuteczności w walkach', Swords], ['Dostęp do specjalnych misji gangowych', Crown], ['Niższe ceny na czarnym rynku', Coins], ['Wspólny skarbiec', Archive]].map(([text, Icon]) => <div key={String(text)}><Icon size={15} /><span>{String(text)}</span></div>)}</section>
        <section className="gang-panel gang-treasury"><div className="gang-panel-title"><h3>SKARBIEC GANGU</h3><button onClick={() => notify('Historia skarbca będzie dostępna wkrótce.')}>ZOBACZ WSZYSTKIE <ChevronRight size={12} /></button></div><div className="gang-treasury-balance"><Coins size={26} /><span><small>SALDO</small><strong>{treasury.toLocaleString('pl-PL')} $</strong></span><button onClick={() => { setTreasury((value) => value + 500); notify('Wpłacono 500 $ do skarbca.'); }}>WPŁAĆ</button><button onClick={() => notify('Wypłata wymaga rangi oficera.')}>WYPŁAĆ</button></div><h4>OSTATNIE TRANSAKCJE</h4><div className="gang-transactions"><span>12.05 <b>F1QU wpłacił 5 000 $</b></span><span>10.05 <b>Kamil wypłacił 2 500 $</b></span><span>08.05 <b>Wpłata na wojnę: -1 000 $</b></span><span>06.05 <b>Malina wpłaciła 3 000 $</b></span></div></section>
      </div>
      <div className="gang-side-column">
        <section className="gang-panel gang-events"><div className="gang-panel-title"><h3>AKTUALNE WYDARZENIA</h3><button onClick={() => notify('Wyświetlasz wszystkie wydarzenia.')}>ZOBACZ WSZYSTKIE <ChevronRight size={12} /></button></div>{events.map(([date, text]) => <div key={date + text}><time>{date}</time><span>{text}</span></div>)}</section>
        <section className="gang-panel gang-mission"><div className="gang-panel-title"><h3>MISJA GANGOWA</h3><button onClick={() => notify('Wyświetlasz wszystkie misje gangowe.')}>ZOBACZ WSZYSTKIE <ChevronRight size={12} /></button></div><h4>KONTROLA KORYTARZA <em>AKTYWNA</em></h4><p>Przejmijcie kontrolę nad sektorem C. Wymaga minimum 3 członków.</p><div><Timer size={14} /> 05:12:37 <button onClick={() => notify('Drużyna została zebrana.')}>ZBIERZ DRUŻYNĘ</button></div><small>NAGRODA: <b>★ +500 EXP</b> &nbsp; + wpływy na dzielnicę</small></section>
        <section className="gang-panel gang-promo"><BarChart3 size={23} /><div><h4>ROZBUDUJ SWÓJ GANG</h4><p>Zwiększ poziom gangu, aby odblokować nowe możliwości, wyższy limit członków i lepsze bonusy.</p><button onClick={() => setTab('ROZWÓJ')}>ZOBACZ ROZWÓJ <ChevronRight size={11} /></button></div></section>
      </div>
    </div>
  </section>;
}

type MarketCategory = 'ALL' | 'USABLE' | 'GEAR' | 'OTHER';
type MarketItem = {
  id: string;
  name: string;
  category: Exclude<MarketCategory, 'ALL'>;
  price: number;
  owned: number;
  description: string;
  stat: string;
  rarity: 'POSPOLITY' | 'NIEPOSPOLITY' | 'RZADKI';
  statIcon: typeof Shield;
  icon: typeof Shield;
  iconClass: string;
};

const marketItems: MarketItem[] = [
  { id: 'rose', name: 'RÓŻA', category: 'OTHER', price: 250, owned: 0, description: 'Daje siłę, kiedy jest naprawdę ciężko.', stat: '+3 Siła', rarity: 'POSPOLITY', statIcon: Dumbbell, icon: Heart, iconClass: 'market-art-rose' },
  { id: 'cigarettes', name: 'PAPIEROSY', category: 'USABLE', price: 80, owned: 3, description: 'Zmniejszają stres i poprawiają nastrój.', stat: '-10 Stres', rarity: 'POSPOLITY', statIcon: Heart, icon: Wind, iconClass: 'market-art-cigarettes' },
  { id: 'knife', name: 'NÓŻ', category: 'GEAR', price: 400, owned: 0, description: 'Niebezpieczne narzędzie. Przydaje się w trudnych sytuacjach.', stat: '+5 Zręczność', rarity: 'NIEPOSPOLITY', statIcon: Crosshair, icon: Swords, iconClass: 'market-art-knife' },
  { id: 'supplement', name: 'ODŻYWKA', category: 'USABLE', price: 300, owned: 0, description: 'Wspomaga regenerację i rozwój mięśni.', stat: '+10 Kondycja', rarity: 'NIEPOSPOLITY', statIcon: Heart, icon: Dumbbell, iconClass: 'market-art-supplement' },
  { id: 'phone', name: 'TELEFON', category: 'OTHER', price: 500, owned: 0, description: 'Pozwala na kontakt z innymi więźniami.', stat: '+4 Technika', rarity: 'RZADKI', statIcon: Wrench, icon: Smartphone, iconClass: 'market-art-phone' },
  { id: 'tattoo', name: 'ZESTAW DO TATUAŻU', category: 'GEAR', price: 350, owned: 0, description: 'Trwała pamiątka. Zwiększa respekt.', stat: '+5 Charakter', rarity: 'NIEPOSPOLITY', statIcon: Crown, icon: Award, iconClass: 'market-art-tattoo' },
  { id: 'tablets', name: 'TABLETKI', category: 'USABLE', price: 200, owned: 0, description: 'Pomagają się skupić i działają pobudzająco.', stat: '+10 Energia', rarity: 'POSPOLITY', statIcon: Zap, icon: Plus, iconClass: 'market-art-tablets' },
  { id: 'beer', name: 'BIMBER', category: 'USABLE', price: 180, owned: 0, description: 'Mocny alkohol z więziennej produkcji. Poprawia nastrój, ale ma skutki uboczne.', stat: '-15 Stres   -10 Kondycja', rarity: 'POSPOLITY', statIcon: Heart, icon: Droplets, iconClass: 'market-art-beer' },
  { id: 'lockpick', name: 'WYTRYCHY', category: 'GEAR', price: 450, owned: 0, description: 'Ułatwiają otwieranie zamkniętych drzwi.', stat: '+10 Technika', rarity: 'RZADKI', statIcon: LockKeyhole, icon: Wrench, iconClass: 'market-art-lockpick' },
];

function MarketView({ onNotice }: { onNotice: (message: string) => void }) {
  const [cash, setCash] = useState(1250);
  const [items, setItems] = useState(marketItems);
  const filteredItems = items;

  const buyItem = (item: MarketItem) => {
    if (cash < item.price) {
      onNotice(`Brak środków. Potrzebujesz jeszcze ${item.price - cash} $.`);
      return;
    }
    setCash((current) => current - item.price);
    setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, owned: entry.owned + 1 } : entry));
    onNotice(`Kupiono: ${item.name.toLowerCase()}.`);
  };

  return <section className="market-view market-reference-view" data-testid="market-view">
    <header className="market-hero">
      <div className="market-hero-copy">
        <h1>CZARNY RYNEK</h1>
        <p>TUTAJ ZNAJDZIESZ RZECZY, KTÓRYCH NIE KUPISZ W SKLEPIE.</p>
      </div>
      <div className="market-hero-mark">DOBRE<br />RZECZY<br />MAJĄ<br /><em>SWOJĄ CENĘ</em></div>
    </header>
    <div className="market-refresh-strip">
      <button className="market-refresh-offer" onClick={() => onNotice('Asortyment został odświeżony.')}><RefreshCw size={26} /><span><strong>ODŚWIEŻ ASORTYMENT</strong><small>Nowe przedmioty za: <b>3 pkt</b></small></span><em><Crown size={16} /> 3</em></button>
      <div className="market-offer-time"><Timer size={19} /><span>DO KOŃCA OFERTY:</span><b>00:42:17</b></div>
      <div className="market-offer-note">Asortyment zmienia się automatycznie.<br />Niektóre przedmioty są unikalne.</div>
    </div>
    <div className="market-item-grid">
      {filteredItems.map((item) => { const ItemIcon = item.icon; const StatIcon = item.statIcon; return <article key={item.id} className={`market-item-card ${item.iconClass}`} data-testid={`market-item-${item.id}`}>
        <div className="market-item-art"><ItemIcon size={68} strokeWidth={1.05} /></div>
        <div className="market-item-copy"><div className="market-item-title"><h2>{item.name}</h2><em className={`market-rarity market-rarity-${item.rarity.toLowerCase()}`}>{item.rarity}</em></div><p>{item.description}</p><span className="market-item-stat"><StatIcon size={15} /> {item.stat}</span></div>
        <div className="market-item-footer"><strong>$ {item.price}</strong><button onClick={() => buyItem(item)} data-testid={`market-buy-${item.id}`}>KUP</button></div>
      </article>; })}
    </div>
    <footer className="market-footnote"><span><Info size={16} /> Ceny na czarnym rynku mogą się zmieniać. Nie wszystko jest legalne. Korzystasz na własne ryzyko.</span>
      <em>„Nie wszystko da się kupić...”</em>
    </footer>
  </section>;
}

type MissionTab = 'available' | 'active' | 'completed';
type MissionRiskTone = 'low' | 'medium' | 'high';

type Mission = {
  id: string;
  title: string;
  summary: string;
  detail: string;
  risk: string;
  riskTone: MissionRiskTone;
  reward: string;
  duration: string;
  chance: number;
  icon: typeof Archive;
  image: string;
  status: MissionTab;
};

const missions: Mission[] = [
  { id: 'smuggling', title: 'PRZEMYT', summary: 'Dostarcz paczkę do wskazanej celi na bloku C.', detail: 'Jeden z chłopaków z bloku C potrzebuje paczki. Twoim zadaniem jest dostarczyć ją do celi 214. Unikaj strażników i nie daj się złapać.', risk: 'ŚREDNIE RYZYKO', riskTone: 'medium', reward: '+180 EXP', duration: '30 minut', chance: 72, icon: Archive, image: cellBackground, status: 'available' },
  { id: 'favor', title: 'PRZYSŁUGA', summary: 'Porozmawiaj z Rysiem na bloku B. Ma dla ciebie robotę.', detail: 'Ryś ma dla ciebie prostą przysługę. Spotkaj się z nim na bloku B i wysłuchaj, co trzeba załatwić.', risk: 'NISKIE RYZYKO', riskTone: 'low', reward: '+120 EXP', duration: '15 minut', chance: 88, icon: Users, image: cellReference, status: 'available' },
  { id: 'debt', title: 'DŁUG', summary: 'Odzyskaj dług od wskazanego więźnia.', detail: 'Ktoś zaciągnął dług i liczy, że sprawa sama ucichnie. Odzyskaj należność, zanim stracisz szacunek na całym bloku.', risk: 'WYSOKIE RYZYKO', riskTone: 'high', reward: '+250 EXP', duration: '45 minut', chance: 48, icon: CircleDollarSign, image: registrationEnvironment, status: 'available' },
  { id: 'wrong-man', title: 'NIE SWÓJ CZŁOWIEK', summary: 'Zajmij się wskazanym więźniem. Nie zadawaj pytań.', detail: 'To zlecenie nie zostawia miejsca na błędy. Zrób swoje i nie pozwól, by ktokolwiek połączył cię ze sprawą.', risk: 'WYSOKIE RYZYKO', riskTone: 'high', reward: '+200 EXP', duration: '40 minut', chance: 41, icon: Crosshair, image: cellReference, status: 'available' },
  { id: 'observation', title: 'OBSERWACJA', summary: 'Zbierz informacje o ruchach strażników.', detail: 'Obserwuj korytarz, zapamiętaj zmiany i wróć z informacjami, które mogą przydać się całemu blokowi.', risk: 'NISKIE RYZYKO', riskTone: 'low', reward: '+150 EXP', duration: '30 minut', chance: 92, icon: Eye, image: registrationEnvironment, status: 'available' },
  { id: 'first-steps', title: 'PIERWSZE KROKI', summary: 'Zdobądź 100 $ z pracy lub walk.', detail: 'Zdobądź pieniądze i pokaż, że potrafisz zadbać o siebie za kratami.', risk: 'NISKIE RYZYKO', riskTone: 'low', reward: '+100 EXP', duration: '20 minut', chance: 96, icon: CheckCircle2, image: cellReference, status: 'active' },
  { id: 'completed-delivery', title: 'DOSTAWA ZAKOŃCZONA', summary: 'Paczka dotarła na właściwe miejsce.', detail: 'Zlecenie zostało wykonane. Blok pamięta, kto potrafi dotrzymać słowa.', risk: 'NISKIE RYZYKO', riskTone: 'low', reward: '+140 EXP', duration: '20 minut', chance: 100, icon: CheckCircle2, image: cellBackground, status: 'completed' },
];

function MissionsView({ onNotice }: { onNotice: (message: string) => void }) {
  const [tab, setTab] = useState<MissionTab>('available');
  const [selectedId, setSelectedId] = useState('smuggling');
  const [startedMission, setStartedMission] = useState<string | null>(null);
  const visibleMissions = missions.filter((mission) => mission.status === tab);
  const selectedMission = visibleMissions.find((mission) => mission.id === selectedId) ?? visibleMissions[0];
  const tabs: Array<{ id: MissionTab; label: string }> = [
    { id: 'available', label: 'DOSTĘPNE MISJE' },
    { id: 'active', label: 'AKTYWNE MISJE' },
    { id: 'completed', label: 'UKOŃCZONE MISJE' },
  ];

  const selectTab = (nextTab: MissionTab) => {
    setTab(nextTab);
    const firstMission = missions.find((mission) => mission.status === nextTab);
    if (firstMission) setSelectedId(firstMission.id);
  };

  return <section className="missions-view" style={{ '--missions-art-url': `url("${prisonArtwork}")` } as CSSProperties} data-testid="missions-view">
    <header className="missions-heading">
      <span className="eyebrow">MISJE</span>
      <h1>SPRAWY, KTÓRE MAJĄ ZNACZENIE</h1>
      <p>Podejmuj się zadań, zdobywaj doświadczenie i buduj swoją pozycję. Nie każda robota jest legalna, ale każda coś daje.</p>
    </header>
    <div className="missions-layout">
      <section className="missions-list-panel game-panel">
        <div className="missions-tabs" role="tablist" aria-label="Zakładki misji">
          {tabs.map((item) => <button key={item.id} className={tab === item.id ? 'active' : ''} onClick={() => selectTab(item.id)} role="tab" aria-selected={tab === item.id}>{item.label}</button>)}
        </div>
        <div className="missions-card-list">
          {visibleMissions.map((mission) => {
            const Icon = mission.icon;
            return <button key={mission.id} className={`mission-card ${selectedMission?.id === mission.id ? 'selected' : ''}`} onClick={() => setSelectedId(mission.id)} style={{ '--mission-card-image': `url("${mission.image}")` } as CSSProperties} data-testid={`mission-card-${mission.id}`}>
              <span className="mission-card-image" />
              <span className="mission-card-copy">
                <span className="mission-card-title"><strong>{mission.title}</strong><em className={`mission-risk mission-risk-${mission.riskTone}`}>{mission.risk}</em></span>
                <small>{mission.summary}</small>
                <span className="mission-card-meta"><span><Zap size={13} /> {mission.reward}</span><span><Users size={13} /> {mission.riskTone === 'low' ? 'ŁATWA' : mission.riskTone === 'high' ? 'TRUDNA' : 'ŚREDNIA'}</span><span><Timer size={13} /> {mission.duration}</span></span>
              </span>
              <Icon className="mission-card-icon" size={18} />
              <ChevronRight className="mission-card-chevron" size={19} />
            </button>;
          })}
        </div>
      </section>
      {selectedMission && <aside className="mission-detail-panel game-panel">
        <div className="mission-detail-topline"><h2>{selectedMission.title}</h2><em className={`mission-risk mission-risk-${selectedMission.riskTone}`}>{selectedMission.risk}</em></div>
        <div className="mission-detail-art" style={{ backgroundImage: `url("${selectedMission.image}")` }} role="img" aria-label={`Ilustracja misji ${selectedMission.title.toLowerCase()}`} />
        <p className="mission-detail-description">{selectedMission.detail}</p>
        <div className="mission-stats">
          <div><Crosshair size={16} /><span>SZANSA POWODZENIA</span><strong>{selectedMission.chance}%</strong><i><b style={{ width: `${selectedMission.chance}%` }} /></i></div>
          <div><Timer size={16} /><span>CZAS TRWANIA</span><strong>{selectedMission.duration}</strong></div>
          <div><Zap size={16} /><span>NAGRODA ZA SUKCES</span><strong>{selectedMission.reward}</strong></div>
          <div><CircleDollarSign size={16} /><span>MOŻLIWY DODATKOWY ŁUP</span><small>$ &nbsp; PUNKTY &nbsp; PRZEDMIOT</small></div>
        </div>
        <div className="mission-consequence"><Flag size={18} /><span><strong>KONSEKWENCJE PORAŻKI</strong>W przypadku niepowodzenia trafisz do izolatki.</span></div>
        <button className="mission-start-button" onClick={() => { setStartedMission(selectedMission.id); onNotice(`Rozpoczynasz misję: ${selectedMission.title.toLowerCase()}.`); }}><span>{startedMission === selectedMission.id ? 'MISJA W TOKU' : 'ROZPOCZNIJ MISJĘ'}</span><ChevronRight size={20} /></button>
      </aside>}
    </div>
  </section>;
}

type MissionCategory = 'ALL' | 'STORY' | 'URGENT' | 'GANG' | 'SPECIAL';

type ReferenceMission = {
  id: string;
  title: string;
  description: string;
  detail: string;
  category: Exclude<MissionCategory, 'ALL'>;
  risk: string;
  riskTone: 'easy' | 'medium' | 'hard' | 'special';
  energy: number;
  chance: number;
  reward: string;
  consequence: string;
  requirement: string;
  icon: typeof Archive;
};

const referenceMissions: ReferenceMission[] = [
  { id: 'message', title: 'PRZEKAŻ WIADOMOŚĆ', description: 'Zanieś wiadomość do wskazanej celi. Szybka robota.', detail: 'Jeden z chłopaków z bloku B potrzebuje, żebyś przekazał wiadomość do celi 107. Prosta sprawa, nikt nie powinien zwrócić na to uwagi.', category: 'STORY', risk: 'ŁATWA', riskTone: 'easy', energy: 10, chance: 88, reward: '+100 EXP', consequence: 'Izolatka (1 - 3h)', requirement: 'Brak', icon: Mail },
  { id: 'package', title: 'DORĘCZ PACZKĘ', description: 'Przenieś małą paczkę przez korytarz.', detail: 'Paczka musi trafić do właściwej celi, zanim zmieni się straż na korytarzu.', category: 'STORY', risk: 'ŁATWA', riskTone: 'easy', energy: 15, chance: 75, reward: '+150 EXP', consequence: 'Izolatka (1 - 3h)', requirement: 'Brak', icon: Archive },
  { id: 'info', title: 'ZDOBĄDŹ DANE', description: 'Zdobądź informacje z biura strażników.', detail: 'Potrzebujemy informacji o zmianach strażników. Zajrzyj do biura i wróć z tym, co uda ci się usłyszeć.', category: 'URGENT', risk: 'ŚREDNIA', riskTone: 'medium', energy: 20, chance: 60, reward: '+250 EXP', consequence: 'Izolatka (2 - 4h)', requirement: 'Poziom 2', icon: ScrollText },
  { id: 'recover-debt', title: 'ODZYSKAJ DŁUG', description: 'Odwiedź dłużnika z bloku C i odzyskaj kasę.', detail: 'Dług sam się nie spłaci. Znajdź wskazanego więźnia i odzyskaj należność dla swojego oddziału.', category: 'URGENT', risk: 'ŚREDNIA', riskTone: 'medium', energy: 20, chance: 58, reward: '+250 EXP', consequence: 'Izolatka (2 - 5h)', requirement: 'Siła 3', icon: CircleDollarSign },
  { id: 'smuggle', title: 'PRZEMYĆ PRZEDMIOT', description: 'Przenieś zakazany przedmiot.', detail: 'Towar jest mały, ale kontrola na bloku jest dziś wyjątkowo dokładna. Nie daj się złapać.', category: 'GANG', risk: 'ŚREDNIA', riskTone: 'medium', energy: 25, chance: 55, reward: '+300 EXP', consequence: 'Izolatka (3 - 6h)', requirement: 'Gang', icon: LockKeyhole },
  { id: 'blackmail', title: 'SZANTAŻUJ', description: 'Zdobądź kompromat na wskazaną osobę.', detail: 'Każdy ma coś do ukrycia. Znajdź słaby punkt wskazanej osoby i wykorzystaj go dla dobra oddziału.', category: 'GANG', risk: 'TRUDNA', riskTone: 'hard', energy: 30, chance: 45, reward: '+400 EXP', consequence: 'Izolatka (4 - 8h)', requirement: 'Reputacja 5', icon: Users },
  { id: 'guard', title: 'ROZPROSZ STRAŻNIKA', description: 'Odciągnij uwagę strażnika w określonym miejscu.', detail: 'Zrób zamieszanie dokładnie wtedy, gdy reszta ekipy będzie tego potrzebować.', category: 'GANG', risk: 'TRUDNA', riskTone: 'hard', energy: 30, chance: 42, reward: '+400 EXP', consequence: 'Izolatka (4 - 8h)', requirement: 'Gang', icon: Crosshair },
  { id: 'outside', title: 'DOSTAWA NA ZEWNĄTRZ', description: 'Przekaż paczkę podczas przepustki na dziedziniec.', detail: 'Paczka poczeka na zewnątrz. Twoim zadaniem jest przekazać ją bez wzbudzania podejrzeń.', category: 'SPECIAL', risk: 'TRUDNA', riskTone: 'hard', energy: 35, chance: 38, reward: '+500 EXP', consequence: 'Izolatka (6 - 12h)', requirement: 'Poziom 5', icon: Archive },
  { id: 'escape', title: 'WYKONAJ WYROK', description: 'Pozbądź się wskazanego więźnia.', detail: 'To zlecenie zmieni układ sił na bloku. Zastanów się, czy jesteś gotowy ponieść konsekwencje.', category: 'SPECIAL', risk: 'BARDZO TRUDNA', riskTone: 'hard', energy: 40, chance: 25, reward: '+750 EXP', consequence: 'Izolatka (12 - 24h)', requirement: 'Reputacja 10', icon: Swords },
  { id: 'big-job', title: 'WIELKA ROBOTA', description: 'Zrealizuj złożone zadanie dla wpływowej grupy.', detail: 'Największe zlecenia wymagają pełnego zaufania. Nagroda jest wysoka, ale cena porażki również.', category: 'SPECIAL', risk: 'SPECJALNA', riskTone: 'special', energy: 50, chance: 20, reward: '+1 000 EXP', consequence: 'Izolatka (24h)', requirement: 'Gang + poziom 8', icon: Crown },
];

function MissionsReferenceView({ onNotice }: { onNotice: (message: string) => void }) {
  const [category, setCategory] = useState<MissionCategory>('ALL');
  const [selectedId, setSelectedId] = useState('message');
  const selected = referenceMissions.find((mission) => mission.id === selectedId) ?? referenceMissions[0];
  const visible = category === 'ALL' ? referenceMissions : referenceMissions.filter((mission) => mission.category === category);
  const filters: Array<{ id: MissionCategory; label: string; icon: typeof Archive }> = [
    { id: 'ALL', label: 'WSZYSTKIE', icon: Archive },
    { id: 'STORY', label: 'FABUŁA', icon: Crown },
    { id: 'URGENT', label: 'DORAŹNE', icon: Swords },
    { id: 'GANG', label: 'GANGOWE', icon: Users },
    { id: 'SPECIAL', label: 'SPECJALNE', icon: Award },
  ];
  return <section className="missions-reference-view" style={{ '--missions-reference-art': `url("${cellReference}")` } as CSSProperties} data-testid="missions-reference-view">
    <header className="missions-reference-heading">
      <div><span className="eyebrow">MISJE</span><h1>MISJE</h1><p>WIĘZIENIE DAJE MOŻLIWOŚCI. NIE WSZYSTKIE SĄ BEZPIECZNE.</p></div>
      <div className="missions-reference-slogan">TU KAŻDA DECYZJA<br />MA KONSEKWENCJE</div>
    </header>
    <div className="missions-reference-toolbar">
      <div className="missions-reference-filters" role="tablist">
        {filters.map(({ id, label, icon: FilterIcon }) => <button key={id} className={category === id ? 'active' : ''} onClick={() => { setCategory(id); const first = id === 'ALL' ? referenceMissions[0] : referenceMissions.find((mission) => mission.category === id); if (first) setSelectedId(first.id); }} role="tab" aria-selected={category === id}><FilterIcon size={14} />{label}</button>)}
      </div>
      <div className="missions-reference-refresh"><span>NOWE MISJE ZA: <b>03:17:26</b></span><button onClick={() => onNotice('Lista misji została odświeżona.')}><ArrowRight size={14} /> ODŚWIEŻ</button><strong>50 $</strong></div>
    </div>
    <div className="missions-reference-content">
      <section className="missions-reference-table game-panel">
        <div className="missions-reference-table-head"><span>NAZWA MISJI</span><span>ENERGIA</span><span>SZANSA</span><span>NAGRODA (EXP)</span></div>
        <div className="missions-reference-rows">
          {visible.map((mission) => {
            const MissionIcon = mission.icon;
            return <button key={mission.id} className={`missions-reference-row ${selected.id === mission.id ? 'selected' : ''} mission-row-${mission.riskTone}`} onClick={() => setSelectedId(mission.id)} data-testid={`reference-mission-${mission.id}`}>
              <span className="missions-row-name"><MissionIcon size={19} /><span><strong>{mission.title}</strong><small>{mission.description}</small></span><em className={`mission-reference-risk risk-${mission.riskTone}`}>{mission.risk}</em></span>
              <b><Zap size={14} /> {mission.energy}</b><b className={`mission-chance chance-${mission.riskTone}`}>{mission.chance}%</b><b className="mission-reward">{mission.reward}</b>
            </button>;
          })}
        </div>
      </section>
      <aside className="missions-reference-detail game-panel">
        <div className="missions-detail-heading"><h2>{selected.title}</h2><em className={`mission-reference-risk risk-${selected.riskTone}`}>{selected.risk}</em></div>
        <p>{selected.detail}</p>
        <div className="missions-detail-facts">
          <div><Zap size={17} /><span>KOSZT ENERGII</span><b>{selected.energy}</b></div>
          <div><Crosshair size={17} /><span>SZANSA POWODZENIA</span><b className={`mission-chance chance-${selected.riskTone}`}>{selected.chance}%</b></div>
          <div><Award size={17} /><span>NAGRODA (EXP)</span><b className="mission-reward">{selected.reward}</b></div>
          <div><Archive size={17} /><span>MOŻLIWE DODATKOWO</span><b>$ / punkty (losowo)</b></div>
          <div><Flag size={17} /><span>KONSEKWENCJA PORAŻKI</span><b>{selected.consequence}</b></div>
          <div><Users size={17} /><span>WYMAGANIA</span><b>{selected.requirement}</b></div>
        </div>
        <button className="missions-reference-start" onClick={() => onNotice(`Rozpoczynasz misję: ${selected.title.toLowerCase()}.`)}><ArrowRight size={17} /> ROZPOCZNIJ MISJĘ</button>
        <div className="missions-reference-help"><Eye size={15} /> Wynik misji zależy od Twoich statystyk, wyposażenia i aktualnej sytuacji w więzieniu.</div>
      </aside>
    </div>
  </section>;
}

type MissionCard = {
  id: string;
  title: string;
  description: string;
  risk: string;
  riskTone: 'easy' | 'medium' | 'hard' | 'special';
  energy: number;
  chance: number;
  reward: string;
  extra: string;
  icon: typeof Archive;
};

const missionCards: MissionCard[] = [
  { id: 'handoff', title: 'PRZEKAŻ', description: 'Dostarcz wiadomość do wskazanej osoby z bloku B. Nikt nie może się dowiedzieć.', risk: 'ŁATWA', riskTone: 'easy', energy: 10, chance: 82, reward: '+120 EXP', extra: '$ / punkty / losowo', icon: Mail },
  { id: 'smuggle-card', title: 'PRZEMYT', description: 'Przenieś małą paczkę z magazynu do celi 214. Uważaj na kontrolę.', risk: 'ŚREDNIA', riskTone: 'medium', energy: 20, chance: 64, reward: '+250 EXP', extra: '$ / punkty / losowo', icon: Archive },
  { id: 'settlement', title: 'ROZLICZENIE', description: 'Daj nauczkę wskazanemu więźniowi z bloku C. Ma to wyglądać na przypadek.', risk: 'TRUDNA', riskTone: 'hard', energy: 30, chance: 48, reward: '+400 EXP', extra: '$ / punkty / losowo', icon: Users },
  { id: 'evidence', title: 'ZDOBĄDŹ DOWODY', description: 'Zdobądź dokumenty ze strzeżonego biura. Wysokie ryzyko, duża nagroda.', risk: 'SPECJALNA', riskTone: 'special', energy: 40, chance: 32, reward: '+750 EXP', extra: '$ / punkty / losowo', icon: ScrollText },
];

function MissionsCardsView({ onNotice }: { onNotice: (message: string) => void }) {
  const [startedId, setStartedId] = useState<string | null>(null);
  return <section className="missions-cards-view" style={{ '--missions-cards-art': `url("${cellReference}")` } as CSSProperties} data-testid="missions-cards-view">
    <header className="missions-cards-heading">
      <div><span className="eyebrow">MISJE</span><h1>MISJE</h1><p>WYBIERZ MISJĘ I PODEJMIJ RYZYKO. KAŻDA DECYZJA MA KONSEKWENCJE.</p></div>
      <div className="missions-cards-slogan">TU NIE MA<br />PRZYPADKÓW</div>
    </header>
    <div className="missions-cards-grid">
      {missionCards.map((mission) => {
        const MissionIcon = mission.icon;
        return <article className={`mission-card-large mission-card-large-${mission.riskTone}`} key={mission.id}>
          <div className="mission-card-large-top"><MissionIcon size={36} /><em className={`mission-reference-risk risk-${mission.riskTone}`}>{mission.risk}</em></div>
          <h2>{mission.title}</h2>
          <p>{mission.description}</p>
          <div className="mission-card-large-facts">
            <div><Zap size={16} /><span>KOSZT ENERGII</span><b>{mission.energy}</b></div>
            <div><Crosshair size={16} /><span>SZANSA POWODZENIA</span><b className={`mission-chance chance-${mission.riskTone}`}>{mission.chance}%</b></div>
          </div>
          <div className="mission-card-large-reward"><small>NAGRODA (EXP)</small><strong><Award size={18} /> {mission.reward}</strong></div>
          <div className="mission-card-large-extra"><small>MOŻLIWE DODATKOWO</small><span><CircleDollarSign size={17} /> <Archive size={17} /> ?</span></div>
          <button onClick={() => { setStartedId(mission.id); onNotice(`Rozpoczynasz misję: ${mission.title.toLowerCase()}.`); }}><ArrowRight size={17} /> {startedId === mission.id ? 'MISJA W TOKU' : 'ROZPOCZNIJ MISJĘ'}</button>
        </article>;
      })}
    </div>
    <footer className="missions-cards-footer">
      <div className="missions-card-timer"><Archive size={26} /><span><small>NOWE MISJE ZA:</small><strong>01:58:27</strong></span></div>
      <button onClick={() => onNotice('Wylosowano nową pulę misji.')}><ArrowRight size={17} /> LOSOWE MISJE <b>50 $</b></button>
      <p><Eye size={16} /> Po ukończeniu misji otrzymasz nowe do wyboru. Dostępne misje zmieniają się automatycznie z czasem lub po użyciu opcji losowania.</p>
    </footer>
  </section>;
}

type TrainingExercise = {
  id: string;
  label: string;
  description: string;
  energy: number;
  duration: number;
  reward: string;
  icon: typeof Dumbbell;
};

const trainingExercises: TrainingExercise[] = [
  { id: 'pushups', label: 'POMPKI', description: 'Rozwijaj siłę. Proste, ale skuteczne.', energy: 10, duration: 15, reward: 'Siła (XP)', icon: Dumbbell },
  { id: 'squats', label: 'PRZYSIADY', description: 'Lepsza kondycja to większa wytrzymałość.', energy: 10, duration: 15, reward: 'Kondycja (XP)', icon: Heart },
  { id: 'weights', label: 'CIĘŻARY', description: 'Prawdziwa siła rodzi się z wysiłku.', energy: 20, duration: 30, reward: 'Siła (więcej XP)', icon: Dumbbell },
  { id: 'combat', label: 'TRENING WALKI', description: 'Technika, refleks, kontrola.', energy: 25, duration: 30, reward: 'Siła (max XP)', icon: Crosshair },
];

const trainingStats = [
  { label: 'SIŁA', level: 'POZIOM 5', value: '320 / 500', progress: '64%', icon: Dumbbell },
  { label: 'KONDYCJA', level: 'POZIOM 4', value: '180 / 400', progress: '45%', icon: Heart },
  { label: 'ZRĘCZNOŚĆ', level: 'POZIOM 3', value: '120 / 300', progress: '40%', icon: Crosshair },
];

function TrainingView({ onNotice }: { onNotice: (message: string) => void }) {
  const [startedExercise, setStartedExercise] = useState<string | null>(null);

  return <section className="training-view" data-testid="training-view">
    <header className="training-page-header">
      <div className="training-page-title">
        <span className="eyebrow">DZIEŃ 12 / BLOK A</span>
        <h1>TRENING</h1>
        <p>SILNIEJSZY DZIŚ. BLIŻEJ WOLNOŚCI JUTRO.</p>
      </div>
      <blockquote>„CIAŁO MOŻNA ZAMKNĄĆ,<br />ALE CHARAKTER TAK ŁATWO NIE ZNIKA.”</blockquote>
    </header>

    <div className="training-layout">
      <div className="training-main-column">
        <div className="training-hero" style={{ backgroundImage: `url("${trainingMockup}")` }} role="img" aria-label="Siłownia w bloku więziennym">
        </div>

        <section className="training-available">
          <div className="training-section-heading"><div><h2>DOSTĘPNE TRENINGI</h2><span>WYBIERZ ĆWICZENIE I ROZWIJAJ SWOJE UMIEJĘTNOŚCI.</span></div></div>
          <div className="training-exercise-grid">{trainingExercises.map((exercise) => {
            const Icon = exercise.icon;
            const started = startedExercise === exercise.id;
            return <article className={`training-exercise-card ${started ? 'started' : ''}`} key={exercise.id}>
              <div className={`training-exercise-art training-art-${exercise.id}`} style={{ backgroundImage: `url("${trainingMockup}")` }} />
              <div className="training-exercise-copy"><h3>{exercise.label}</h3><p>{exercise.description}</p><div className="training-exercise-meta"><span><Zap size={13} /> {exercise.energy} energii</span><span><Timer size={13} /> {exercise.duration} minut</span><span><Icon size={13} /> {exercise.reward}</span></div><button onClick={() => { setStartedExercise(exercise.id); onNotice(`Rozpoczynasz trening: ${exercise.label.toLowerCase()}.`); }}>{started ? 'W TRAKCIE' : 'ROZPOCZNIJ'}</button></div>
            </article>;
          })}</div>
        </section>

        <div className="training-bottom-grid">
          <section className="training-progress-panel">
            <div className="training-section-heading"><div><h2>POSTĘP DZIŚ</h2><span>WYKONAJ WSZYSTKIE DZIŚ TRENINGI, ABY OTRZYMAĆ BONUS.</span></div></div>
            <div className="training-progress-track"><div className="training-progress-line" /><i className="complete"><CheckCircle2 size={13} /></i><i className="complete"><CheckCircle2 size={13} /></i><i><span>3</span></i><i><span>4</span></i><div className="training-reward"><Trophy size={18} /><span><strong>NAGRODA</strong><small>+10% wszystkich treningów<br />(przez 24h)</small></span></div></div>
          </section>
          <section className="training-history-panel">
            <div className="training-section-heading"><div><h2>HISTORIA TRENINGÓW</h2><span>OSTATNIE AKTYWNOŚCI</span></div><button onClick={() => onNotice('Wyświetlasz pełną historię treningów.')}>ZOBACZ WIĘCEJ <ChevronRight size={12} /></button></div>
            <div className="training-history-list"><div><CheckCircle2 size={15} /><strong>Pompki</strong><small>Dziś, 06:30</small><b>+12 XP (Siła)</b></div><div><CheckCircle2 size={15} /><strong>Przysiady</strong><small>Wczoraj, 18:45</small><b>+10 XP (Kondycja)</b></div></div>
          </section>
        </div>
      </div>

      <aside className="training-side-column">
        <section className="training-side-panel training-stat-panel">
          <div className="training-side-heading"><h2>TWOJE STATYSTYKI</h2><button onClick={() => onNotice('Pełne statystyki postaci będą dostępne w zakładce STATYSTYKI.')}>ZOBACZ WSZYSTKIE <ChevronRight size={11} /></button></div>
          {trainingStats.map(({ label, level, value, progress, icon: Icon }) => <div className="training-stat-row" key={label}><Icon size={18} /><div><strong>{label}</strong><small>{level}</small><div className="training-stat-bar"><i style={{ width: progress }} /></div></div><span>{value}</span></div>)}
          <div className="training-energy-row"><Zap size={23} /><div><strong>ENERGIA</strong><div className="training-stat-bar"><i style={{ width: '75%' }} /></div></div><span>75 / 100<small>+1 za 24 min</small></span></div>
        </section>
        <section className="training-side-panel training-efficiency-panel"><div className="training-side-heading"><h2>EFEKTYWNOŚĆ TRENINGU</h2></div><div><span>Podstawowa efektywność</span><b>100%</b></div><div><span>Bonus z celi (Kącik treningowy)</span><b>+15%</b></div><div><span>Bonus gangu (BRak)</span><b>0%</b></div><div className="training-efficiency-total"><span>Suma efektywności</span><b>115%</b></div></section>
        <section className="training-side-panel training-tip-panel"><Lightbulb size={25} /><div><h2>WSKAZÓWKA</h2><p>Regularny trening nie tylko zwiększa statystyki, ale też poprawia Twoje samopoczucie i morale.</p></div></section>
        <div className="training-side-art" style={{ backgroundImage: `url("${trainingMockup}")` }}><span>LEPSZY<br /><strong>NIŻ WCZORAJ.</strong></span></div>
      </aside>
    </div>
  </section>;
}

type CellUpgradeId = 'bed' | 'locker' | 'table' | 'shelf' | 'tv' | 'sink' | 'training' | 'extras';
type CellUpgrade = {
  id: CellUpgradeId;
  label: string;
  level: number;
  cost: number;
  icon: typeof BedDouble;
  currentBonus: string;
  nextBonus: string;
  thumbClass: string;
};

const cellUpgradeItems: CellUpgrade[] = [
  { id: 'bed', label: 'ŁÓŻKO', level: 3, cost: 450, icon: BedDouble, currentBonus: '+15% regeneracji energii', nextBonus: '+20% regeneracji energii', thumbClass: 'thumb-bed' },
  { id: 'locker', label: 'SZAFKA', level: 2, cost: 350, icon: Archive, currentBonus: '+10 miejsca w ekwipunku', nextBonus: '+15 miejsca w ekwipunku', thumbClass: 'thumb-locker' },
  { id: 'table', label: 'STÓŁ', level: 1, cost: 300, icon: Table, currentBonus: '+5% zarobków z pracy', nextBonus: '+10% zarobków z pracy', thumbClass: 'thumb-table' },
  { id: 'shelf', label: 'PÓŁKA', level: 2, cost: 320, icon: Archive, currentBonus: '+5% nauki techniki', nextBonus: '+10% nauki techniki', thumbClass: 'thumb-shelf' },
  { id: 'tv', label: 'TELEWIZOR', level: 1, cost: 280, icon: Tv, currentBonus: '+10% morale', nextBonus: '+15% morale', thumbClass: 'thumb-tv' },
  { id: 'sink', label: 'UMYWALKA', level: 1, cost: 300, icon: Droplets, currentBonus: '+5% szybsza regeneracja', nextBonus: '+10% szybsza regeneracja', thumbClass: 'thumb-sink' },
  { id: 'training', label: 'KĄCIK TRENINGOWY', level: 1, cost: 400, icon: Dumbbell, currentBonus: '+5% efektywności treningu', nextBonus: '+10% efektywności treningu', thumbClass: 'thumb-training' },
  { id: 'extras', label: 'DODATKI', level: 0, cost: 250, icon: Archive, currentBonus: 'Odblokuj dekoracje celi', nextBonus: '+5% komfortu i bezpieczeństwa', thumbClass: 'thumb-extras' },
];

const cellUpgradeMarkers: Array<{ id: CellUpgradeId; label: string; level: string; left: string; top: string }> = [
  { id: 'shelf', label: 'PÓŁKA', level: 'Poziom 2', left: '8%', top: '33%' },
  { id: 'tv', label: 'TELEWIZOR', level: 'Poziom 1', left: '91%', top: '17%' },
  { id: 'locker', label: 'SZAFKA', level: 'Poziom 2', left: '64%', top: '35%' },
  { id: 'sink', label: 'UMYWALKA', level: 'Poziom 1', left: '83%', top: '61%' },
  { id: 'bed', label: 'ŁÓŻKO', level: 'Poziom 3', left: '11%', top: '76%' },
  { id: 'training', label: 'KĄCIK TRENINGOWY', level: 'Poziom 1', left: '41%', top: '87%' },
  { id: 'table', label: 'STÓŁ', level: 'Poziom 1', left: '82%', top: '82%' },
];

function CellDevelopmentView({ onNotice }: { onNotice: (message: string) => void }) {
  const [selectedId, setSelectedId] = useState<CellUpgradeId>('bed');
  const selected = cellUpgradeItems.find((item) => item.id === selectedId)!;
  const SelectedIcon = selected.icon;

  return <section className="cell-development-view" data-testid="cell-development-view">
    <header className="cell-development-header">
      <div>
        <span className="eyebrow">ROZWÓJ / CELA</span>
        <h1>ROZWÓJ <span>CELI</span></h1>
        <p>ULEPSZAJ WYPOSAŻENIE I BUDUJ SWOJĄ PRZEWAGĘ</p>
      </div>
      <blockquote>„CELA TO NIE TYLKO MIEJSCE.<br />TO TWÓJ FUNDAMENT.”</blockquote>
      <div className="cell-development-resources"><span>TWOJE ŚRODKI</span><strong><CircleDollarSign size={20} /> 250</strong></div>
    </header>

    <div className="cell-development-grid">
      <aside className="cell-development-items">
        <div className="cell-development-panel-title">ELEMENTY CELI</div>
        <div className="cell-development-item-list">{cellUpgradeItems.map((item) => {
          const Icon = item.icon;
          return <button className={`cell-development-item ${selectedId === item.id ? 'active' : ''}`} key={item.id} onClick={() => setSelectedId(item.id)}><Icon size={20} /><span><strong>{item.label}</strong><small>Poziom {item.level}/20</small></span><ChevronRight size={15} /></button>;
        })}</div>
      </aside>

      <div className="cell-development-center">
        <div className="cell-development-scene">
          <div className="scene-artwork" style={{ backgroundImage: `url("${cellBackground}")` }} aria-label="Widok celi do rozwoju" role="img" />
          {cellUpgradeMarkers.map((marker) => <button className={`cell-development-marker ${selectedId === marker.id ? 'active' : ''}`} key={marker.id} style={{ left: marker.left, top: marker.top }} onClick={() => setSelectedId(marker.id)}><span className="cell-development-marker-dot"><Plus size={16} /></span><span className="cell-development-marker-label"><strong>{marker.label}</strong><small>{marker.level}</small></span></button>)}
          <span className="cell-development-scene-hint">ⓘ KLIKNIJ NA ELEMENT, ABY ZOBACZYĆ SZCZEGÓŁY</span>
          <button className="cell-development-preview-button" onClick={() => onNotice('Podgląd zmian jest dostępny dla wybranego elementu.')}><Eye size={14} /> PODGLĄD ZMIAN</button>
        </div>
        <section className="cell-level-preview">
          <div className="cell-development-panel-title">PODGLĄD POZIOMÓW</div>
          <div className="cell-level-cards">{Array.from({ length: 20 }, (_, index) => index + 1).map((level) => <button className={`cell-level-card ${selected.level === level ? 'active' : ''}`} key={level} onClick={() => onNotice(`Podglądasz ${selected.label.toLowerCase()} na poziomie ${level}.`)}><span className={`cell-level-thumb ${selected.thumbClass}`} style={{ backgroundImage: `url("${cellBackground}")` }} /><small>Poziom {level}</small></button>)}</div>
        </section>
      </div>

      <aside className="cell-development-details">
        <section className="cell-development-detail-panel">
          <div className="cell-development-selected-heading"><SelectedIcon size={28} /><div><h2>{selected.label}</h2><span>Poziom {selected.level}/20</span></div></div>
          <p>Lepsze wyposażenie poprawia warunki życia na każdy kolejny dzień.</p>
          <div className="cell-development-detail-label">AKTUALNY POZIOM</div>
          <strong className="cell-development-level">Poziom {selected.level}</strong>
          <div className="cell-development-progress"><i style={{ width: `${(selected.level / 20) * 100}%` }} /></div>
          <div className="cell-development-bonus current">{selected.currentBonus}</div>
          <div className="cell-development-detail-label">NASTĘPNY POZIOM</div>
          <strong className="cell-development-level">Poziom {selected.level + 1}</strong>
          <div className="cell-development-bonus">{selected.nextBonus}</div>
          <div className="cell-development-bonus">+ nowy wygląd {selected.label.toLowerCase()}</div>
          <div className="cell-development-detail-label">KOSZT ULEPSZENIA</div>
          <strong className="cell-development-cost"><CircleDollarSign size={20} /> {selected.cost}</strong>
          <button className="cell-development-upgrade" onClick={() => onNotice(`Ulepszenie ${selected.label.toLowerCase()} zostanie odblokowane po zebraniu ${selected.cost} $.`)}>ULEPSZ <ArrowUp size={16} /></button>
        </section>
        <section className="cell-development-stats">
          <div className="cell-development-panel-title">STATYSTYKI CELI</div>
          {[
            ['Regeneracja energii', '+15%', Zap],
            ['Pojemność ekwipunku', '+10', Backpack],
            ['Efektywność pracy', '+5%', BriefcaseBusiness],
            ['Efektywność treningu', '+5%', Dumbbell],
            ['Morale', '+10%', Heart],
            ['Bezpieczeństwo', '+0%', Shield],
          ].map(([label, value, Icon]) => <div className="cell-development-stat" key={label as string}><Icon size={15} /><span>{label as string}</span><strong>{value as string}</strong></div>)}
        </section>
      </aside>
    </div>
  </section>;
}

type FightStatKey = 'health' | 'luck' | 'strength' | 'endurance' | 'intelligence' | 'reflex';
type FightOpponentId = 'rat' | 'bull' | 'fox' | 'wolf' | 'kosa';
type FightOpponent = {
  id: FightOpponentId;
  name: string;
  level: number;
  asset: string;
  description: string;
  quote: string;
  stats: Record<FightStatKey, number>;
  rewardMoney: [number, number];
  rewardItemA: [number, number];
  rewardItemB: number;
};

const fightStatMeta: Array<{ key: FightStatKey; label: string; icon: typeof Shield }> = [
  { key: 'health', label: 'Zdrowie', icon: Heart },
  { key: 'luck', label: 'Szczęście', icon: Clover },
  { key: 'strength', label: 'Siła', icon: Dumbbell },
  { key: 'endurance', label: 'Kondycja', icon: Activity },
  { key: 'intelligence', label: 'Inteligencja', icon: Brain },
  { key: 'reflex', label: 'Refleks', icon: Zap },
];

const fightOpponents: FightOpponent[] = [
  { id: 'rat', name: 'SZCZUR', level: 2, asset: ratAsset, description: 'Szybki i nieprzewidywalny. Unika ciosów i wykorzystuje każdy błąd. Nie lekceważ go.', quote: 'Mało gada, dużo robi.', stats: { health: 90, luck: 6, strength: 7, endurance: 8, intelligence: 9, reflex: 14 }, rewardMoney: [40, 70], rewardItemA: [1, 2], rewardItemB: 1 },
  { id: 'bull', name: 'BYK', level: 5, asset: bullAsset, description: 'Czysta siła i determinacja. Uderza mocno i rzadko się cofa. Walka z nim to walka na wytrzymałość.', quote: 'Kto silniejszy, ten ma rację.', stats: { health: 130, luck: 8, strength: 19, endurance: 17, intelligence: 8, reflex: 6 }, rewardMoney: [90, 160], rewardItemA: [2, 4], rewardItemB: 1 },
  { id: 'fox', name: 'LIS', level: 4, asset: foxAsset, description: 'Sprytny gracz, który zawsze ma plan B. Kontratakuje, gdy najmniej się tego spodziewasz.', quote: 'Chytry jak lis, silny jak trzeba.', stats: { health: 105, luck: 10, strength: 10, endurance: 11, intelligence: 16, reflex: 12 }, rewardMoney: [70, 120], rewardItemA: [1, 3], rewardItemB: 1 },
  { id: 'wolf', name: 'WILK', level: 6, asset: wolfAsset, description: 'Bezwzględny w ataku, zwłaszcza gdy przeciwnik jest osłabiony. Nie daje drugiej szansy.', quote: 'Stado albo samotność — wybieram zwycięstwo.', stats: { health: 120, luck: 9, strength: 15, endurance: 14, intelligence: 12, reflex: 13 }, rewardMoney: [100, 170], rewardItemA: [2, 3], rewardItemB: 2 },
  { id: 'kosa', name: 'KOSA', level: 3, asset: prisonerAsset, description: 'Doświadczony i opanowany. Nie popełnia niepotrzebnych błędów, gra na swoich zasadach.', quote: 'Za kratami liczy się tylko wynik.', stats: { health: 110, luck: 11, strength: 12, endurance: 11, intelligence: 10, reflex: 9 }, rewardMoney: [60, 100], rewardItemA: [1, 2], rewardItemB: 1 },
];

function FightView({ creator, gameData, onNotice, onReturn }: { creator: CreatorState; gameData: { nickname: string; level: number }; onNotice: (message: string) => void; onReturn: () => void }) {
  const [selectedId, setSelectedId] = useState<FightOpponentId>(fightOpponents[0].id);
  const opponent = fightOpponents.find((item) => item.id === selectedId)!;
  const type = prisonerTypes.find((item) => item.id === creator.prisonerType)!;
  const playerAsset = getPrisonerAsset(type, creator.gender);
  const playerStats: Record<FightStatKey, number> = { health: characterStatsList[0].value, luck: characterStatsList[1].value, strength: characterStatsList[2].value, endurance: characterStatsList[3].value, intelligence: characterStatsList[4].value, reflex: characterStatsList[5].value };

  const handleAttack = () => onNotice(`Rozpoczynasz walkę z: ${opponent.name}.`);

  return <section className="fight-select-view" data-testid="fight-view">
    <header className="fight-select-header">
      <div><h1>WYBIERZ PRZECIWNIKA</h1><p>SPRAWDŹ I KTO TU NAPRAWDĘ JEST SILNIEJSZY.</p></div>
      <button className="fight-back" onClick={onReturn} aria-label="Powrót"><ArrowLeft size={16} /></button>
    </header>

    <div className="fight-select-body">
      <div className="fight-main-column" style={{ '--fight-bg-url': `url("${registrationEnvironment}")` } as CSSProperties}>
        <em className="fight-stamp fight-stamp-top">TU KOŃCZY SIĘ<br />GADANIE</em>
        <em className="fight-stamp fight-stamp-bottom">SIŁA TO NIE WSZYSTKO.<br />LICZY SIĘ GŁOWA.</em>
        <div className="fight-main-top">
          <aside className="fight-opponent-list">{fightOpponents.map((item) => <button className={`fight-opponent-row-card ${item.id === selectedId ? 'active' : ''}`} key={item.id} onClick={() => setSelectedId(item.id)} data-testid={`fight-opponent-${item.id}`}>
            <span className="fight-opponent-thumb" style={{ backgroundImage: `url("${item.asset}")` }} />
            <span className="fight-opponent-row-info"><strong>{item.name}</strong><small>POZIOM {item.level}</small></span>
          </button>)}</aside>

          <div className="fight-vs-column">
            <div className="fight-vs-row">
              <div className="fight-vs-side">
                <span className="fight-vs-portrait" style={{ backgroundImage: `url("${playerAsset}")` }} />
                <strong>{gameData.nickname.toUpperCase()}</strong>
                <small>POZIOM {gameData.level}</small>
              </div>
              <span className="fight-vs-mark">VS</span>
              <div className="fight-vs-side">
                <span className="fight-vs-portrait" style={{ backgroundImage: `url("${opponent.asset}")` }} />
                <strong>{opponent.name}</strong>
                <small>POZIOM {opponent.level}</small>
              </div>
            </div>
            <div className="fight-compare-panel">
              <h2>PORÓWNANIE STATYSTYK</h2>
              {fightStatMeta.map(({ key, label, icon: Icon }) => {
                const playerValue = playerStats[key];
                const opponentValue = opponent.stats[key];
                const max = Math.max(playerValue, opponentValue, 1);
                return <div className="fight-compare-row" key={key}>
                  <b className="fight-compare-value left">{playerValue}</b>
                  <div className="fight-compare-bar left"><i style={{ width: `${(playerValue / max) * 100}%` }} /></div>
                  <span className="fight-compare-label"><Icon size={13} /> {label}</span>
                  <div className="fight-compare-bar right"><i style={{ width: `${(opponentValue / max) * 100}%` }} /></div>
                  <b className="fight-compare-value right">{opponentValue}</b>
                </div>;
              })}
            </div>
          </div>
        </div>

        <div className="fight-tip-box"><Info size={18} /><div><strong>WSKAZÓWKA</strong><p>Porównaj swoje statystyki z przeciwnikiem, aby ocenić swoje szanse. Każda walka to ryzyko, ale też możliwość zdobycia cennych przedmiotów.</p></div></div>
      </div>

      <aside className="fight-detail-panel">
        <div className="fight-detail-header"><strong>{opponent.name}</strong><span>POZIOM {opponent.level}</span></div>
        <p className="fight-detail-desc">{opponent.description}</p>
        <p className="fight-detail-quote">„{opponent.quote}”</p>
        <div className="fight-detail-rewards">
          <span className="fight-detail-rewards-title">MOŻLIWE NAGRODY</span>
          <div className="fight-reward-grid">
            <div className="fight-reward-tile"><CircleDollarSign size={20} /><small>{opponent.rewardMoney[0]} - {opponent.rewardMoney[1]}</small></div>
            <div className="fight-reward-tile"><Package size={20} /><small>{opponent.rewardItemA[0]} - {opponent.rewardItemA[1]}</small></div>
            <div className="fight-reward-tile"><Gem size={20} /><small>{opponent.rewardItemB}</small></div>
            <div className="fight-reward-tile fight-reward-chance"><span>?</span><small>SZANSA</small></div>
          </div>
        </div>
        <button className="fight-attack-button" onClick={handleAttack} data-testid="fight-attack-button"><Swords size={18} /> ATAKUJ</button>
      </aside>
    </div>
  </section>;
}

const workHourlyRate = 20;
const workMinHours = 1;
const workMaxHours = 24;

function formatWorkRemaining(ms: number) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((value) => String(value).padStart(2, '0')).join(':');
}

type WorkStatus = 'idle' | 'in-progress' | 'done';

function WorkView({ creator, onNotice }: { creator: CreatorState; onNotice: (message: string) => void }) {
  const [hours, setHours] = useState(8);
  const [status, setStatus] = useState<WorkStatus>('idle');
  const [totalMs, setTotalMs] = useState(0);
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [remainingMs, setRemainingMs] = useState(0);

  const reward = hours * workHourlyRate;

  useEffect(() => {
    if (status !== 'in-progress' || endsAt === null) return;
    const tick = () => {
      const remaining = endsAt - Date.now();
      if (remaining <= 0) {
        setRemainingMs(0);
        setStatus('done');
        onNotice(`Praca zakończona. Otrzymano: ${reward} $.`);
      } else {
        setRemainingMs(remaining);
      }
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [status, endsAt, reward, onNotice]);

  const type = prisonerTypes.find((item) => item.id === creator.prisonerType)!;
  const playerAsset = getPrisonerAsset(type, creator.gender);
  const fillPct = ((hours - workMinHours) / (workMaxHours - workMinHours)) * 100;
  const progressPct = totalMs > 0 ? Math.min(100, ((totalMs - remainingMs) / totalMs) * 100) : 0;

  const handleStart = () => {
    const total = hours * 60 * 60 * 1000;
    setTotalMs(total);
    setRemainingMs(total);
    setEndsAt(Date.now() + total);
    setStatus('in-progress');
  };
  const handleReset = () => {
    setStatus('idle');
    setEndsAt(null);
    setTotalMs(0);
  };

  return <section className="work-view" data-testid="work-view">
    <header className="work-header">
      <div><span className="eyebrow">ZAROBKI</span><h1>PRACA</h1></div>
      <p>ZARABIAJ PIENIĄDZE, PRACUJĄC NA ODDZIALE.</p>
    </header>

    <div className="work-scene">
      <span className="work-scene-light" />
      <span className="work-scene-player" style={{ backgroundImage: `url("${playerAsset}")` }} />
      <div className="work-scene-caption"><strong>SPRZĄTANIE ODDZIAŁU</strong><span>Podstawowa praca więźnia</span></div>
    </div>

    <div className="work-panel">
      {status === 'idle' && <>
        <div className="work-panel-top">
          <div className="work-panel-info">
            <h2>SPRZĄTANIE ODDZIAŁU</h2>
            <p>Zwykła praca więźnia. Im dłużej pracujesz, tym większe wynagrodzenie.</p>
            <div className="work-info-row"><Droplets size={14} /><span>Rodzaj pracy</span><b>Sprzątanie oddziału</b></div>
            <div className="work-info-row"><CircleDollarSign size={14} /><span>Stawka</span><b>${workHourlyRate} za godzinę</b></div>
            <div className="work-info-row"><Timer size={14} /><span>Dostępny czas</span><b>od {workMinHours} do {workMaxHours} godzin</b></div>
          </div>
          <div className="work-panel-slider">
            <span className="work-slider-title">WYBIERZ CZAS PRACY</span>
            <div className="work-slider-row">
              <b>{workMinHours}h</b>
              <input type="range" min={workMinHours} max={workMaxHours} step={1} value={hours} onChange={(event) => setHours(Number(event.target.value))} className="work-slider" style={{ background: `linear-gradient(90deg, var(--game-orange) 0%, var(--game-orange) ${fillPct}%, #273432 ${fillPct}%, #273432 100%)` }} aria-label="Wybierz czas pracy w godzinach" data-testid="work-hours-slider" />
              <b>{workMaxHours}h</b>
            </div>
            <span className="work-slider-value">{hours} GODZIN</span>
          </div>
          <div className="work-panel-reward">
            <span>PRZEWIDYWANE WYNAGRODZENIE</span>
            <strong data-testid="work-reward-preview">${reward}</strong>
          </div>
        </div>
        <div className="work-panel-bottom">
          <button className="work-start" onClick={handleStart} data-testid="work-start-button"><BriefcaseBusiness size={18} /><span>ROZPOCZNIJ PRACĘ</span></button>
          <p className="work-hint">Po rozpoczęciu pracy Twoja postać będzie zajęta przez wybrany czas.</p>
        </div>
      </>}

      {status === 'in-progress' && <div className="work-progress-view" data-testid="work-in-progress">
        <div className="work-progress-info">
          <span className="work-status-tag">PRACA W TOKU</span>
          <h2>SPRZĄTANIE ODDZIAŁU</h2>
        </div>
        <div className="work-timer-block">
          <strong className="work-timer" data-testid="work-timer">{formatWorkRemaining(remainingMs)}</strong>
          <span>POZOSTAŁO</span>
        </div>
        <div className="work-progress-track"><i style={{ width: `${progressPct}%` }} /></div>
        <div className="work-panel-reward">
          <span>PRZEWIDYWANE WYNAGRODZENIE</span>
          <strong>${reward}</strong>
        </div>
      </div>}

      {status === 'done' && <div className="work-done-view" data-testid="work-done">
        <span className="work-status-tag done">PRACA ZAKOŃCZONA</span>
        <strong className="work-earned">OTRZYMANO: ${reward}</strong>
        <button className="work-start" onClick={handleReset} data-testid="work-again-button"><BriefcaseBusiness size={18} /><span>WRÓĆ DO PRACY</span></button>
      </div>}
    </div>
  </section>;
}

const gameNavigation: Array<{ id: GameSection; label: string; icon: typeof Shield }> = [
  { id: 'cell', label: 'TWOJA POSTAĆ', icon: Shield },
  { id: 'messages', label: 'WIADOMOŚCI', icon: MessageSquare },
  { id: 'fight', label: 'WALKA', icon: Swords },
  { id: 'training', label: 'TRENING', icon: Dumbbell },
  { id: 'work', label: 'PRACA', icon: BriefcaseBusiness },
  { id: 'market', label: 'CZARNY RYNEK', icon: ShoppingCart },
  { id: 'quests', label: 'MISJE', icon: ScrollText },
  { id: 'trash-block', label: 'BLOK ŚMIECI', icon: Archive },
  { id: 'gang', label: 'GANG', icon: Users },
  { id: 'ranking', label: 'RANKING', icon: Trophy },
];

const gameSecondaryNavigation: Array<{ id: GameSection; label: string; icon: typeof Shield }> = [
  { id: 'cell-development', label: 'ROZWÓJ CELI', icon: Building2 },
  { id: 'achievements', label: 'OSIĄGNIĘCIA', icon: Award },
  { id: 'statistics', label: 'STATYSTYKI', icon: BarChart3 },
  { id: 'settings', label: 'USTAWIENIA', icon: Settings },
];

const allGameNavigation = [...gameNavigation, ...gameSecondaryNavigation];

const cellSlots: CellSlot[] = [
  { id: 'bed', ...cellLayout.interactive_slots.bed, label: 'ŁÓŻKO', description: 'Odpocznij i odzyskaj siły', icon: BedDouble },
  { id: 'shelf', ...cellLayout.interactive_slots.shelf, label: 'PÓŁKA', description: 'Przechowuj drobiazgi i notatki', icon: Archive },
  { id: 'locker', ...cellLayout.interactive_slots.locker, label: 'SZAFKA', description: 'Przechowuj swoje rzeczy', icon: Archive },
  { id: 'sink', ...cellLayout.interactive_slots.sink, label: 'UMYWALKA', description: 'Zachowaj czujność', icon: Droplets },
  { id: 'table', ...cellLayout.interactive_slots.table, label: 'STÓŁ', description: 'Wykonuj zadania', icon: Table },
  { id: 'stool', ...cellLayout.interactive_slots.stool, label: 'STOŁEK', description: 'Sprawdź ten element celi', icon: Table },
  { id: 'tv', ...cellLayout.interactive_slots.tv, label: 'TELEWIZOR', description: 'Sprawdź najnowsze wiadomości', icon: Tv },
  { id: 'vent', ...cellLayout.interactive_slots.vent, label: 'WENTYLACJA', description: 'Nasłuchuj życia bloku', icon: Wind },
];

function CellScene({ visited, onHotspot }: { visited: Set<HotspotId>; onHotspot: (id: HotspotId) => void }) {
  return <div className="cell-scene" data-testid="cell-scene">
    <div className="scene-artwork" style={{ backgroundImage: `url("${cellReference}")` }} aria-label="Widok celi więźnia" role="img" />
    {cellSlots.map((slot) => <CellHotspot key={slot.id} {...slot} onClick={() => onHotspot(slot.id)} active={visited.has(slot.id)} />)}
  </div>;
}

const gameMessages = [
  { name: 'Rychu', text: 'Siema, będziesz dziś na dziedzińcu?', time: '18:24' },
  { name: 'Beton', text: 'Załatwiłem temat. Odezwij się.', time: '17:11' },
  { name: 'Szczur', text: 'Masz towar, o którym gadaliśmy?', time: '15:37' },
];

const gameEvents = [
  { time: '18:20', text: 'Wygrałeś walkę z Grubym.', result: '+ 50 $', tone: 'positive' },
  { time: '17:45', text: 'Zakończyłeś trening siły.', result: '+ 8 XP', tone: 'positive' },
  { time: '16:30', text: 'Ktoś dołączył do oddziału A.', result: '', tone: '' },
  { time: '15:12', text: 'Przegrałeś walkę z Szakalem.', result: '- 20 $', tone: 'negative' },
  { time: '14:05', text: 'Otrzymałeś nową wiadomość.', result: '', tone: '' },
];

const gameStats = [
  { label: 'SIŁA', value: 10, icon: Dumbbell, color: 'orange' },
  { label: 'KONDYCJA', value: 10, icon: Heart, color: 'green' },
  { label: 'ZRĘCZNOŚĆ', value: 10, icon: Crosshair, color: 'blue' },
  { label: 'TECHNIKA', value: 10, icon: Settings, color: 'violet' },
  { label: 'CHARAKTER', value: 10, icon: Crown, color: 'gold' },
];
