import { type CSSProperties, type Dispatch, type FormEvent, type ReactNode, type SetStateAction, useEffect, useState } from 'react';
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
  BriefcaseBusiness,
  Building2,
  Check,
  CheckCircle2,
  CircleDollarSign,
  ChevronRight,
  Coins,
  Crosshair,
  Crown,
  Droplets,
  Dumbbell,
  BedDouble,
  Eye,
  Facebook,
  Flag,
  Gamepad2,
  Heart,
  Instagram,
  KeyRound,
  LockKeyhole,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  PanelRight,
  Plus,
  ScrollText,
  Send,
  Shield,
  Settings,
  ShoppingCart,
  Swords,
  Table,
  Trophy,
  Tv,
  UserRound,
  UserRoundPen,
  Users,
  Wind,
  X,
  Youtube,
  Zap,
} from 'lucide-react';
import prisonArtwork from '@assets/ChatGPT_Image_6_wrz_2026,_17_17_42_1788707864145.png';
import registrationEnvironment from '@assets/generated_images/prison-intake-environment.png';
import prisonerAsset from '@assets/ChatGPT_Image_6_wrz_2026,_18_12_30_1788711187677.png';
import bullAsset from '@assets/ChatGPT_Image_6_wrz_2026,_18_57_13_1788713844519.png';
import femaleBullAsset from '@assets/Obraz_Codex_6_wrz_2026,_19_03_12_1788715039687.png';
import ratAsset from '@assets/Obraz_Codex_6_wrz_2026,_18_57_44_1788713877886.png';
import femaleRatAsset from '@assets/Obraz_Codex_6_wrz_2026,_19_04_23_1788715066292.png';
import foxAsset from '@assets/Obraz_Codex_6_wrz_2026,_18_58_23_1788713918595.png';
import femaleFoxAsset from '@assets/Obraz_Codex_6_wrz_2026,_19_05_09_1788715078788.png';
import wolfAsset from '@assets/Obraz_Codex_6_wrz_2026,_18_59_09_1788713957701.png';
import femaleWolfAsset from '@assets/Obraz_Codex_6_wrz_2026,_19_05_54_1788715089958.png';
import cellBackground from './assets/cell/cell-background.webp';
import cellReference from './assets/cell/cell-reference.png';
import cellLayout from './assets/cell/cell-layout.json';

const queryClient = new QueryClient();

const featureItems = [
  { title: 'Rozwijaj postać', copy: 'Trenuj, zdobywaj umiejętności i zostań legendą.', icon: Dumbbell },
  { title: 'Walcz z innymi', copy: 'Sprawdź się w pojedynkach i zdobądź szacunek.', icon: Swords },
  { title: 'Zarabiaj', copy: 'Podejmuj pracę, handluj i buduj swój majątek.', icon: BriefcaseBusiness },
  { title: 'Dołącz do ekipy', copy: 'Twórz i rozwijaj frakcję. Razem możecie więcej.', icon: Users },
  { title: 'Zdobądź szczyt', copy: 'Wspinaj się w rankingach i zapisz się w historii Prison Life.', icon: Crown },
];
const panelItems = [
  { label: 'Cela', icon: Shield },
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
type AppearanceKey = 'face' | 'hair' | 'beard' | 'tattoo' | 'outfit' | 'skin';
type Appearance = Record<AppearanceKey, number>;
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

const stepLabels = ['POSTAĆ', 'DANE', 'GOTOWE'];

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
        <div className={`character-figure figure-skin-${appearance.skin} figure-outfit-${appearance.outfit} figure-face-${appearance.face}`} data-testid="character-figure">
          <img className="character-photo" src={prisonerAsset} alt={`Podgląd więźnia ${displayName}`} />
          {appearance.hair > 0 && <span className={`figure-hair figure-hair-${appearance.hair}`} aria-hidden="true" />}
          {appearance.beard > 0 && <span className={`figure-beard figure-beard-${appearance.beard}`} aria-hidden="true" />}
          {appearance.face === 1 && <span className="figure-scar" aria-hidden="true" />}
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
            <ellipse cx="180" cy="235" rx={appearance.face === 1 ? 52 : 56} ry="75" fill="url(#skinGradient)" />
            {appearance.face === 0 && <path d="M136 218 Q148 185 180 183 Q213 185 224 218 L213 198 Q180 210 147 198Z" fill="#30221f" opacity=".4" />}
            {appearance.face === 1 && <path d="M150 188 Q180 177 211 190 L223 221 211 239 Q180 252 149 239 L137 220Z" fill="#49302a" opacity=".38" />}
            {appearance.face === 2 && <path d="M132 226 L146 185 180 177 214 185 228 226 214 270 180 288 146 270Z" fill="#4a2b25" opacity=".32" />}
            {appearance.face === 3 && <path d="M142 200 Q180 180 218 200 L225 252 Q180 276 135 252Z" fill="#211c1b" opacity=".2" />}
            <path d="M149 226 Q160 219 169 225" stroke="#231b19" strokeWidth="5" fill="none" /><path d="M191 225 Q200 219 211 226" stroke="#231b19" strokeWidth="5" fill="none" />
            <ellipse cx="160" cy="234" rx="4" ry="5" fill="#111" /><ellipse cx="200" cy="234" rx="4" ry="5" fill="#111" />
            <path d="M180 234 L174 258 184 260" fill="none" stroke="#633b30" strokeWidth="3" /><path d="M157 274 Q180 284 203 274" fill="none" stroke="#321d1b" strokeWidth="4" />
            {appearance.face === 1 && <path d="M207 197 L215 236" stroke="#c48f72" strokeWidth="3" opacity=".8" />}
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
    <div className="registration-action-bar"><div className="prison-shell registration-actions">{step > 1 ? <button className="btn btn-outline" onClick={() => onStepChange(step - 1)}><ArrowLeft size={16} /> WSTECZ</button> : <div className="registration-account-link">MASZ JUŻ KONTO? <button onClick={() => onNavigate('login')}>ZALOGUJ SIĘ</button></div>}{step === 3 ? <button className="btn btn-primary" onClick={onCreate} data-testid="button-create-prisoner">UTWÓRZ WIĘŹNIA <ArrowRight size={17} /></button> : <button className="btn btn-primary" onClick={onNext} data-testid="button-registration-next">DALEJ <ArrowRight size={17} /></button>}</div></div>
    <footer className="registration-footer"><div className="prison-shell registration-footer-inner"><Brand onNavigate={onNavigate} compact /><span>REGULAMIN</span><span>POLITYKA PRYWATNOŚCI</span><span>FAQ</span><span>KONTAKT</span><div className="registration-social"><Gamepad2 size={15} /><Facebook size={15} /><Youtube size={15} /><Instagram size={15} /></div><em>PRAWDZIWE HISTORIE<br />ZACZYNAJĄ SIĘ W WIĘZIENIU...</em></div></footer>
  </main>;
}

function Registration({ onNavigate, creator, setCreator }: { onNavigate: (screen: Screen) => void; creator: CreatorState; setCreator: Dispatch<SetStateAction<CreatorState>> }) {
  const selectedType = prisonerTypes.find((type) => type.id === creator.prisonerType)!;
  const goNext = () => {
    if (creator.step === 1 && !creator.nickname.trim()) { setCreator((current) => ({ ...current, nicknameError: 'Wpisz ksywę, zanim przejdziesz dalej.' })); return; }
    if (creator.step === 2) {
      if (!creator.account.email || !creator.account.password || !creator.account.confirmPassword) { setCreator((current) => ({ ...current, accountError: 'Uzupełnij wszystkie pola, aby przejść dalej.' })); return; }
      if (creator.account.password.length < 6) { setCreator((current) => ({ ...current, accountError: 'Hasło musi mieć co najmniej 6 znaków.' })); return; }
      if (creator.account.password !== creator.account.confirmPassword) { setCreator((current) => ({ ...current, accountError: 'Hasła muszą być identyczne.' })); return; }
    }
    setCreator((current) => ({ ...current, step: Math.min(3, current.step + 1), nicknameError: '', accountError: '' }));
  };
  const changeStep = (next: number) => setCreator((current) => ({ ...current, step: Math.max(1, Math.min(3, next)), nicknameError: '', accountError: '' }));
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
    {creator.step === 2 && <section className="step-screen account-step"><div className="step-heading"><div className="eyebrow">Krok 02 / Kartoteka</div><h1>DANE <span>WIĘŹNIA</span></h1><p>Twoja kartoteka jest prawie gotowa. Podaj dane, których użyjesz, aby wrócić do swojej historii.</p></div><form className="account-form" onSubmit={(event) => { event.preventDefault(); goNext(); }}><label><span><Mail size={15} /> E-MAIL</span><input type="email" autoComplete="email" value={creator.account.email} onChange={(event) => setCreator((current) => ({ ...current, account: { ...current.account, email: event.target.value }, accountError: '' }))} placeholder="więzień@prisonlife.pl" data-testid="input-auth-email" required /></label><label><span><KeyRound size={15} /> HASŁO</span><input type="password" autoComplete="new-password" minLength={6} value={creator.account.password} onChange={(event) => setCreator((current) => ({ ...current, account: { ...current.account, password: event.target.value }, accountError: '' }))} placeholder="minimum 6 znaków" data-testid="input-auth-password" required /></label><label><span><KeyRound size={15} /> POWTÓRZ HASŁO</span><input type="password" autoComplete="new-password" value={creator.account.confirmPassword} onChange={(event) => setCreator((current) => ({ ...current, account: { ...current.account, confirmPassword: event.target.value }, accountError: '' }))} placeholder="powtórz hasło" data-testid="input-auth-confirm" required /></label>{creator.accountError && <div className="form-error">{creator.accountError}</div>}<button type="submit" className="account-form-submit">SPRAWDŹ DANE <ArrowRight size={16} /></button></form><div className="account-side-note"><span>IDENTYFIKATOR</span><strong>{creator.nickname.toUpperCase() || 'NOWY WIĘZIEŃ'}</strong><small>#A-47291 / INTAKE</small><p>Dane konta są używane wyłącznie do logowania do Prison Life.</p></div></section>}
    {creator.step === 3 && <section className="step-screen summary-step"><div className="step-heading"><div className="eyebrow">Krok 03 / Kontrola</div><h1>WSZYSTKO <span>GOTOWE</span></h1><p>Sprawdź swoją kartotekę. Możesz cofnąć się i zmienić dowolny wybór.</p></div><div className="summary-grid"><CharacterPreview appearance={creator.appearance} nickname={creator.nickname} type={creator.prisonerType} /><div className="summary-details"><div className="summary-block"><span className="summary-label">KSYWA</span><strong>{creator.nickname.toUpperCase()}</strong><button onClick={() => changeStep(1)}>EDYTUJ <ChevronRight size={14} /></button></div><div className="summary-block"><span className="summary-label">TYP WIĘŹNIA</span><strong>{getPrisonerDisplayName(selectedType, creator.gender)}</strong><em>{selectedType.specialty}</em><button onClick={() => changeStep(1)}>EDYTUJ <ChevronRight size={14} /></button></div><div className="summary-stats"><span>{selectedType.abilityIcon} {selectedType.abilityTitle}</span><span>{selectedType.abilityDescription}</span></div><div className="summary-block account-summary"><span className="summary-label">DANE KONTA</span><strong>{creator.account.email}</strong><small>Hasło zabezpieczone</small><button onClick={() => changeStep(2)}>EDYTUJ <ChevronRight size={14} /></button></div></div></div></section>}
  </RegistrationShell>;
}

type CreatorState = { step: number; nickname: string; nicknameError: string; gender: Gender; world: World; prisonerType: PrisonerType; appearance: Appearance; account: AccountData; accountError: string };
const initialCreator: CreatorState = { step: 1, nickname: '', nicknameError: '', gender: 'male', world: 'central', prisonerType: 'bull', appearance: { face: 0, hair: 0, beard: 1, tattoo: 1, outfit: 0, skin: 1 }, account: { email: '', password: '', confirmPassword: '' }, accountError: '' };

function AuthScreen({ mode, onNavigate }: { mode: 'login' | 'register'; onNavigate: (screen: Screen) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState('');
  const register = mode === 'register';
  const submit = (event: FormEvent) => { event.preventDefault(); setNotice('Tryb demonstracyjny: logowanie będzie dostępne przy otwarciu serwera.'); };
  return <main className="auth-page" style={{ '--artwork-url': `url("${prisonArtwork}")` } as CSSProperties}><div className="auth-backdrop" /><header className="auth-header"><Brand onNavigate={onNavigate} /><button onClick={() => onNavigate('home')} className="auth-return"><ArrowLeft size={15} /> WRÓĆ NA STRONĘ GŁÓWNĄ</button></header><section className="auth-card"><div className="eyebrow">{register ? 'Nowy więzień' : 'Powrót za kraty'}</div><h1>{register ? 'ZAREJESTRUJ SIĘ' : 'ZALOGUJ SIĘ'}</h1><p>{register ? 'Stwórz swoją kartotekę i wybierz, jaką reputację zbudujesz za kratami.' : 'Wróć do swojej celi. Twoja reputacja nie poczeka.'}</p><form onSubmit={submit}><label><span><Mail size={15} /> ADRES E-MAIL</span><input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="więzień@prisonlife.pl" required /></label><label><span><KeyRound size={15} /> HASŁO</span><input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="wpisz hasło" required minLength={6} /></label><button className="btn btn-primary" type="submit">{register ? 'OTWÓRZ KARTOTEKĘ' : 'WEJDŹ DO GRY'} <ArrowRight size={16} /></button></form>{notice && <div className="auth-notice">{notice}</div>}<button className="auth-switch" onClick={() => onNavigate(register ? 'login' : 'register')}>{register ? 'MASZ JUŻ KONTO? ' : 'NIE MASZ JESZCZE KONTA? '}<strong>{register ? 'ZALOGUJ SIĘ' : 'ZAREJESTRUJ SIĘ'}</strong></button></section><div className="auth-quote">„ZA KRATAMI NIE MA PRZYPADKÓW.<br /><span>SĄ TYLKO DECYZJE.</span>”</div></main>;
}

type GameSection = 'cell' | 'messages' | 'fight' | 'training' | 'work' | 'equipment' | 'market' | 'quests' | 'gang' | 'ranking' | 'cell-development' | 'achievements' | 'statistics' | 'settings';
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
     if (section !== 'cell' && section !== 'cell-development') showNotice(`${allGameNavigation.find((item) => item.id === section)?.label}: widok przygotowany do podłączenia.`);
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
      <div className="game-resources"><span className="resource-money"><CircleDollarSign size={18} /> {gameData.gold}</span><span className="resource-energy"><Zap size={18} /> {gameData.energy} / 100</span><span className="resource-health"><Heart size={18} /> {gameData.hp} / 100</span></div>
      <div className="game-header-actions"><button aria-label="Powiadomienia" className="header-icon-button notification-button" onClick={() => showNotice('Nie masz nowych powiadomień.')}><Bell size={18} /><b>3</b></button><button aria-label="Ustawienia" className="header-icon-button" onClick={() => showNotice('Ustawienia konta będą dostępne wkrótce.')}><Settings size={18} /></button><button className="game-logout" onClick={() => onNavigate('home')}><LogOut size={16} /> WYLOGUJ SIĘ <ArrowRight size={15} /></button></div>
    </header>
    <div className="game-layout">
      <aside className={`game-sidebar game-sidebar-with-development ${mobileMenuOpen ? 'mobile-sidebar-open' : ''}`}><div className="sidebar-heading">NAWIGACJA</div>{gameNavigation.map(({ id, label, icon: Icon }) => <button className={activeSection === id ? 'active' : ''} key={id} onClick={() => navigateSection(id)}><Icon size={18} /> <span>{label}</span>{id === 'messages' && <b className="sidebar-badge">3</b>}</button>)}<div className="sidebar-section-label">ROZWÓJ <i /></div>{gameSecondaryNavigation.map(({ id, label, icon: Icon }) => <button className={activeSection === id ? 'active' : ''} key={id} onClick={() => navigateSection(id)}><Icon size={18} /> <span>{label}</span></button>)}</aside>
       <div className={`game-content ${activeSection === 'cell-development' ? 'game-content-development' : ''}`}>
        {activeSection === 'cell' ? <div className="game-board">
           <section className="game-cell-column"><div className="game-section-heading"><div><span className="eyebrow">DZIEŃ 01 / BLOK A</span><h1>TWOJA <span>CELA</span></h1></div><span className="cell-status"><i /> ZAMKNIĘTA / 06:00</span></div><CellScene visited={visited} onHotspot={activateHotspot} /></section>
          <aside className="game-right-column">
            <section className="game-panel prisoner-panel"><div className="panel-title"><span>MÓJ WIĘZIEŃ</span><button onClick={() => showNotice('Edycja więźnia będzie dostępna wkrótce.')}><UserRoundPen size={12} /> EDYTUJ</button></div><div className="prisoner-profile"><div><h2>{gameData.nickname.toUpperCase()}</h2><span>#A-7421</span><strong>POZIOM {gameData.level}</strong><div className="profile-xp"><i style={{ width: `${(gameData.xp / gameData.xpMax) * 100}%` }} /><small>{gameData.xp} / {gameData.xpMax} XP</small></div></div><GamePortrait creator={creator} small /></div><div className="prisoner-stats">{gameStats.map(({ label, value, icon: Icon, color }) => <div className="prisoner-stat" key={label}><Icon size={16} className={`stat-${color}`} /><span>{label}</span><div><i style={{ width: `${value * 10}%` }} /></div><b>{value}</b></div>)}</div><div className="reputation-row"><div><span>REPUTACJA</span><strong>{gameData.reputation}</strong></div><div><span>RANGA</span><strong>{gameData.rank}</strong></div></div><blockquote>„ZA KRATAMI WSZYSCY<br />JESTEŚMY RÓWNI...<br /><em>ALE NIE NA DŁUGO.”</em></blockquote></section>
            <section className="game-panel quests-panel"><div className="panel-title"><span>AKTUALNE ZADANIA</span><button onClick={() => navigateSection('quests')}>ZOBACZ WSZYSTKIE <ChevronRight size={12} /></button></div><div className="quest-list"><div className="quest-item"><CheckCircle2 size={19} /><div><strong>PIERWSZE KROKI</strong><small>Zdobądź 100 $ z pracy lub walk.</small><div className="quest-progress"><i style={{ width: '65%' }} /></div></div><b>65 / 100</b></div><div className="quest-item"><Dumbbell size={19} /><div><strong>TRENING CZYNI MISTRZA</strong><small>Wykonaj 3 treningi siły.</small><div className="quest-progress"><i style={{ width: '34%' }} /></div></div><b>1 / 3</b></div><div className="quest-item"><PanelRight size={19} /><div><strong>POZNAJ CELE</strong><small>Kliknij wszystkie interaktywne elementy w celi.</small><div className="quest-progress"><i style={{ width: `${(visited.size / 8) * 100}%` }} /></div></div><b>{visited.size} / 8</b></div></div></section>
              <div className="game-promo"><span>PRZETRWAJ<br /><b>ROZWIJAJ SIĘ<br />DOMINUJ</b></span><button onClick={() => showNotice('Wkrótce poznasz pełną mapę bloku.')}><ChevronRight size={20} /></button></div>
          </aside>
         </div> : activeSection === 'cell-development' ? <CellDevelopmentView onNotice={showNotice} /> : <GamePlaceholder section={activeSection} onReturn={() => navigateSection('cell')} />}
         {activeSection === 'cell' && <section className="game-bottom-grid">
          <section className="game-panel messages-panel"><div className="panel-title"><span>WIADOMOŚCI <b>(3)</b></span><button onClick={() => setNewMessageOpen((open) => !open)}>+ NOWA WIADOMOŚĆ</button></div>{newMessageOpen && <div className="new-message-row"><input autoFocus placeholder="Napisz do..." /><button onClick={() => { setNewMessageOpen(false); showNotice('Nowa wiadomość została przygotowana.'); }}><Send size={14} /></button></div>}<div className="message-list">{gameMessages.map((message) => <button className="message-item" key={message.name} onClick={() => showNotice(`Otwierasz wiadomość od ${message.name}.`)}><span className="message-avatar">{message.name[0]}</span><span><strong>{message.name}</strong><small>{message.text}</small></span><time>{message.time}<b>1</b></time></button>)}</div></section>
          <section className="game-panel chat-panel"><div className="panel-title"><span>CZAT: {chatTab}</span></div><div className="chat-tabs">{(['ODDZIAŁ A', 'GLOBALNY', 'GANG'] as const).map((tab) => <button className={chatTab === tab ? 'active' : ''} onClick={() => setChatTab(tab)} key={tab}>{tab}</button>)}</div><div className="chat-lines">{chatLines.slice(-5).map((line, index) => <div className="chat-line" key={`${line.time}-${index}`}><time>{line.time}</time><strong>{line.name}:</strong><span>{line.text}</span></div>)}</div><form className="chat-compose" onSubmit={sendChat}><input value={chatMessage} onChange={(event) => setChatMessage(event.target.value)} placeholder="Napisz wiadomość..." /><button aria-label="Wyślij wiadomość"><Send size={14} /></button></form></section>
          <section className="game-panel events-panel"><div className="panel-title"><span>OSTATNIE WYDARZENIA</span><button onClick={() => showNotice('Wyświetlasz pełną historię wydarzeń.')}>ZOBACZ WSZYSTKIE</button></div><div className="event-list">{gameEvents.map((event) => <div className="event-item" key={`${event.time}-${event.text}`}><time>{event.time}</time><span>{event.text}</span><b className={event.tone}>{event.result}</b></div>)}</div></section>
         </section>}
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
      return saved ? { ...initialCreator, ...JSON.parse(saved) } : initialCreator;
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
    equipment: 'Tutaj znajdzie się Twój ekwipunek i przedmioty zebrane za kratami.',
    market: 'Czarny rynek jest zamknięty. Wróć później po świeżą dostawę.',
    quests: 'Twoje zadania są widoczne w panelu po prawej stronie.',
    gang: 'Dołącz do gangu i zbuduj swoją pozycję w oddziale.',
    ranking: 'Ranking bloku zostanie otwarty, gdy rozpoczniesz pierwszy dzień.',
    'cell-development': 'Rozbuduj swoją celę, odblokuj nowe wyposażenie i stwórz własną przewagę za kratami.',
    achievements: 'Zdobywaj osiągnięcia za rozwój postaci i kolejne dni za kratami.',
    statistics: 'Sprawdzaj swoje wyniki, postępy i najważniejsze liczby z pobytu.',
    settings: 'Dostosuj ustawienia konta i preferencje gry.',
  };
  return <section className="game-placeholder" data-testid={`game-placeholder-${section}`}><div className="placeholder-stamp">BLOK A / SYSTEM</div><Icon size={48} /><span className="eyebrow">SEKCJA GRY</span><h1>{item.label}</h1><p>{copy[section]}</p><button className="btn btn-primary" onClick={onReturn}><Shield size={15} /> WRÓĆ DO CELI</button></section>;
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

const gameNavigation: Array<{ id: GameSection; label: string; icon: typeof Shield }> = [
  { id: 'cell', label: 'CELA', icon: Shield },
  { id: 'messages', label: 'WIADOMOŚCI', icon: MessageSquare },
  { id: 'fight', label: 'WALKA', icon: Swords },
  { id: 'training', label: 'TRENING', icon: Dumbbell },
  { id: 'work', label: 'PRACA', icon: BriefcaseBusiness },
  { id: 'equipment', label: 'EKWIPUNEK', icon: Backpack },
  { id: 'market', label: 'CZARNY RYNEK', icon: ShoppingCart },
  { id: 'quests', label: 'ZADANIA', icon: ScrollText },
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

function GamePortrait({ creator, small = false }: { creator: CreatorState; small?: boolean }) {
  return <div className={`game-portrait ${small ? 'game-portrait-small' : ''}`}><CharacterPreview appearance={creator.appearance} nickname={creator.nickname} type={creator.prisonerType} /></div>;
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
