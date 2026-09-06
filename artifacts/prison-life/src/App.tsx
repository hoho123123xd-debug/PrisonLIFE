import { type CSSProperties, type Dispatch, type FormEvent, type ReactNode, type SetStateAction, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ArrowLeft,
  ArrowRight,
  Archive,
  Backpack,
  Bell,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  CircleDollarSign,
  ChevronLeft,
  ChevronRight,
  Coins,
  Crosshair,
  Crown,
  Dumbbell,
  BedDouble,
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
  ScrollText,
  Send,
  Shield,
  Settings,
  ShoppingCart,
  Swords,
  Table,
  Trophy,
  UserRound,
  UserRoundPen,
  Users,
  X,
  Youtube,
  Zap,
} from 'lucide-react';
import prisonArtwork from '@assets/ChatGPT_Image_6_wrz_2026,_17_17_42_1788707864145.png';
import registrationEnvironment from '@assets/generated_images/prison-intake-environment.png';
import prisonerAsset from '@assets/generated_images/prisoner-realistic-cutout.png';

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
type PrisonerType = 'bull' | 'rat' | 'fox' | 'wolf';
type Option = { name: string; short: string; swatch: string };

const appearanceOptions: Record<AppearanceKey, Option[]> = {
  face: [
    { name: 'Kanciasta', short: '01', swatch: 'face-one' },
    { name: 'Blizna', short: '02', swatch: 'face-two' },
    { name: 'Surowa', short: '03', swatch: 'face-three' },
    { name: 'Zmęczona', short: '04', swatch: 'face-four' },
  ],
  hair: [
    { name: 'Krótka', short: '01', swatch: 'hair-one' },
    { name: 'Wygolona', short: '02', swatch: 'hair-two' },
    { name: 'Gęsta', short: '03', swatch: 'hair-three' },
    { name: 'Irokez', short: '04', swatch: 'hair-four' },
  ],
  beard: [
    { name: 'Brak', short: '01', swatch: 'beard-none' },
    { name: 'Cień', short: '02', swatch: 'beard-shadow' },
    { name: 'Broda', short: '03', swatch: 'beard-full' },
    { name: 'Wąs', short: '04', swatch: 'beard-mustache' },
  ],
  tattoo: [
    { name: 'Brak', short: '01', swatch: 'tattoo-none' },
    { name: 'Pająk', short: '02', swatch: 'tattoo-spider' },
    { name: 'Czaszka', short: '03', swatch: 'tattoo-skull' },
    { name: 'Litery', short: '04', swatch: 'tattoo-letters' },
  ],
  outfit: [
    { name: 'Pomarańczowy', short: '01', swatch: 'outfit-orange' },
    { name: 'Biały', short: '02', swatch: 'outfit-white' },
    { name: 'Stalowy', short: '03', swatch: 'outfit-steel' },
    { name: 'Kombinezon', short: '04', swatch: 'outfit-slate' },
  ],
  skin: [
    { name: 'Jasna', short: '01', swatch: 'skin-light' },
    { name: 'Oliwkowa', short: '02', swatch: 'skin-olive' },
    { name: 'Brązowa', short: '03', swatch: 'skin-brown' },
    { name: 'Ciemna', short: '04', swatch: 'skin-dark' },
  ],
};

const prisonerTypes: Array<{
  id: PrisonerType;
  name: string;
  specialty: string;
  description: string;
  stats: string[];
}> = [
  { id: 'bull', name: 'BYK', specialty: 'SIŁA • ŻYCIE', description: 'Brutalny i nieustępliwy. Zadaje dużo obrażeń i ma wysoką wytrzymałość.', stats: ['SIŁA 85', 'ŻYCIE 90'] },
  { id: 'rat', name: 'SZCZUR', specialty: 'SZYBKOŚĆ • UNIKI', description: 'Szybki, sprytny, trudny do złapania. Zawsze znajdzie wyjście.', stats: ['ZWINNOŚĆ 88', 'UNIKI 82'] },
  { id: 'fox', name: 'LIS', specialty: 'TECHNIKA • TAKTYKA', description: 'Myśli kilka kroków naprzód. Wykorzystuje słabości przeciwnika.', stats: ['TECHNIKA 86', 'TAKTYKA 79'] },
  { id: 'wolf', name: 'WILK', specialty: 'BALANS', description: 'Uniwersalny styl gry. Dobry w każdej sytuacji.', stats: ['BALANS 80', 'INSTYNKT 78'] },
];

const stepLabels = ['WYGLĄD', 'TYP', 'DANE', 'GOTOWE'];

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

function AppearanceSelector({ appearance, onChange }: { appearance: Appearance; onChange: (key: AppearanceKey, value: number) => void }) {
  const categories: Array<[AppearanceKey, string]> = [['face', 'TWARZ'], ['hair', 'FRYZURA'], ['beard', 'ZAROST'], ['tattoo', 'TATUAŻE'], ['outfit', 'UBRANIE'], ['skin', 'KOLOR SKÓRY']];
  return (
    <div className="appearance-list">
      {categories.map(([key, label]) => {
        const selected = appearance[key];
        const options = appearanceOptions[key];
        return <div className="appearance-row" key={key}>
          <div className="appearance-row-heading"><span>{label}</span><small>{options[selected].name}</small></div>
          <div className="appearance-options">
            <button type="button" className="carousel-arrow" onClick={() => onChange(key, (selected - 1 + options.length) % options.length)} aria-label={`Poprzednia opcja: ${label}`} data-testid={`button-appearance-prev-${key}`}><ChevronLeft size={16} /></button>
            <div className="appearance-tiles">{options.map((option, index) => <button type="button" key={option.name} className={`appearance-tile ${option.swatch} ${selected === index ? 'selected' : ''}`} onClick={() => onChange(key, index)} aria-label={`${label}: ${option.name}`} aria-pressed={selected === index} data-testid={`button-appearance-${key}-${index + 1}`}><span>{option.short}</span></button>)}</div>
            <button type="button" className="carousel-arrow" onClick={() => onChange(key, (selected + 1) % options.length)} aria-label={`Następna opcja: ${label}`} data-testid={`button-appearance-next-${key}`}><ChevronRight size={16} /></button>
          </div>
        </div>;
      })}
    </div>
  );
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

function TypeCard({ type, selected, onSelect, compact = false }: { type: typeof prisonerTypes[number]; selected: boolean; onSelect: () => void; compact?: boolean }) {
  return <button type="button" className={`type-card ${selected ? 'selected' : ''} ${compact ? 'compact' : ''}`} onClick={onSelect} aria-pressed={selected} data-testid={`button-prisoner-type-${type.id}`}><span className={`type-avatar type-${type.id}`}><span>{type.name.slice(0, 1)}</span></span><span className="type-card-content"><strong>{type.name}</strong><em>{type.specialty}</em>{!compact && <><small>{type.description}</small><i>{type.stats.join('  /  ')}</i></>}</span>{selected && <Check className="type-check" size={17} />}</button>;
}

function TypeRail({ selectedType, onSelect, heading = 'WYBIERZ TYP WIĘŹNIA', compact = false }: { selectedType: PrisonerType; onSelect: (type: PrisonerType) => void; heading?: string; compact?: boolean }) {
  return <aside className={`type-rail ${compact ? 'type-rail-compact' : ''}`}><div className="section-kicker">{heading}</div><p className="rail-hint">KAŻDY TYP TO INNA DROGA. WYBIERZ MĄDRZE.</p><div className="type-cards">{prisonerTypes.map((type) => <TypeCard key={type.id} type={type} selected={selectedType === type.id} onSelect={() => onSelect(type.id)} compact={compact} />)}</div></aside>;
}

function RegistrationShell({ step, children, onNavigate, onStepChange, onNext, onCreate }: {
  step: number; children: ReactNode; onNavigate: (screen: Screen) => void; onStepChange: (step: number) => void; onNext: () => void; onCreate: () => void;
}) {
  return <main className="registration-page" style={{ '--artwork-url': `url("${prisonArtwork}")`, '--registration-artwork-url': `url("${registrationEnvironment}")` } as CSSProperties}>
    <header className="registration-header"><div className="prison-shell registration-header-inner"><Brand onNavigate={onNavigate} /><RegistrationProgress step={step} onStepChange={onStepChange} /><div className="registration-login"><span>MASZ JUŻ KONTO?</span><button onClick={() => onNavigate('login')} data-testid="button-registration-login">ZALOGUJ SIĘ</button></div></div></header>
    <div className="prison-shell registration-body">{step === 1 && <button className="back-home" onClick={() => onNavigate('home')}><ArrowLeft size={14} /> POWRÓT NA STRONĘ GŁÓWNĄ</button>}{children}</div>
    <div className="registration-action-bar"><div className="prison-shell registration-actions">{step > 1 ? <button className="btn btn-outline" onClick={() => onStepChange(step - 1)}><ArrowLeft size={16} /> WSTECZ</button> : <div className="registration-account-link">MASZ JUŻ KONTO? <button onClick={() => onNavigate('login')}>ZALOGUJ SIĘ</button></div>}{step === 4 ? <button className="btn btn-primary" onClick={onCreate} data-testid="button-create-prisoner">UTWÓRZ WIĘŹNIA <ArrowRight size={17} /></button> : <button className="btn btn-primary" onClick={onNext} data-testid="button-registration-next">DALEJ <ArrowRight size={17} /></button>}</div></div>
    <footer className="registration-footer"><div className="prison-shell registration-footer-inner"><Brand onNavigate={onNavigate} compact /><span>REGULAMIN</span><span>POLITYKA PRYWATNOŚCI</span><span>FAQ</span><span>KONTAKT</span><div className="registration-social"><Gamepad2 size={15} /><Facebook size={15} /><Youtube size={15} /><Instagram size={15} /></div><em>PRAWDZIWE HISTORIE<br />ZACZYNAJĄ SIĘ W WIĘZIENIU...</em></div></footer>
  </main>;
}

function Registration({ onNavigate, creator, setCreator }: { onNavigate: (screen: Screen) => void; creator: CreatorState; setCreator: Dispatch<SetStateAction<CreatorState>> }) {
  const updateAppearance = (key: AppearanceKey, value: number) => setCreator((current) => ({ ...current, appearance: { ...current.appearance, [key]: value } }));
  const setStep = (nextStep: number) => setCreator((current) => ({ ...current, step: Math.max(1, Math.min(4, nextStep)) }));
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
  return <RegistrationShell step={creator.step} onNavigate={onNavigate} onStepChange={changeStep} onNext={goNext} onCreate={() => onNavigate('game')}>
    {creator.step === 1 && <section className="creator-screen">
      <div className="creator-intro"><div className="eyebrow">Krok 01 / Tożsamość</div><h1>STWÓRZ<br /><span>SWOJEGO WIĘŹNIA</span></h1><p>Wybierz styl, nadaj mu tożsamość i rozpocznij swoją drogę za kratami. Pamiętaj — to nie jest tylko postać. To Twoja legenda.</p><label className="nickname-field"><span>KSYWA</span><div><UserRound size={17} /><input value={creator.nickname} onChange={(event) => setCreator((current) => ({ ...current, nickname: event.target.value, nicknameError: '' }))} placeholder="Wpisz swoją ksywę..." maxLength={18} data-testid="input-register-nickname" /></div>{creator.nicknameError && <small>{creator.nicknameError}</small>}</label></div>
      <div className="creator-customize"><div className="panel-heading"><span>WYGLĄD</span><small>Wybierz elementy wyglądu</small></div><AppearanceSelector appearance={creator.appearance} onChange={updateAppearance} /></div>
      <CharacterPreview appearance={creator.appearance} nickname={creator.nickname} type={creator.prisonerType} />
      <TypeRail selectedType={creator.prisonerType} onSelect={(type) => setCreator((current) => ({ ...current, prisonerType: type }))} compact />
    </section>}
    {creator.step === 2 && <section className="step-screen type-step"><div className="step-heading"><div className="eyebrow">Krok 02 / Specjalizacja</div><h1>WYBIERZ <span>SWOJĄ DROGĘ</span></h1><p>Każdy typ więźnia otwiera inną ścieżkę rozwoju. Wybierz specjalizację, która pasuje do Twojej strategii.</p></div><div className="type-selection-grid">{prisonerTypes.map((type) => <TypeCard key={type.id} type={type} selected={creator.prisonerType === type.id} onSelect={() => setCreator((current) => ({ ...current, prisonerType: type.id }))} />)}</div><div className="mini-summary"><CharacterPreview appearance={creator.appearance} nickname={creator.nickname} type={creator.prisonerType} /><div><span>WYBRANY TYP</span><strong>{selectedType.name}</strong><p>{selectedType.description}</p></div></div></section>}
    {creator.step === 3 && <section className="step-screen account-step"><div className="step-heading"><div className="eyebrow">Krok 03 / Kartoteka</div><h1>DANE <span>WIĘŹNIA</span></h1><p>Twoja kartoteka jest prawie gotowa. Podaj dane, których użyjesz, aby wrócić do swojej historii.</p></div><form className="account-form" onSubmit={(event) => { event.preventDefault(); goNext(); }}><label><span><Mail size={15} /> E-MAIL</span><input type="email" autoComplete="email" value={creator.account.email} onChange={(event) => setCreator((current) => ({ ...current, account: { ...current.account, email: event.target.value }, accountError: '' }))} placeholder="więzień@prisonlife.pl" data-testid="input-auth-email" required /></label><label><span><KeyRound size={15} /> HASŁO</span><input type="password" autoComplete="new-password" minLength={6} value={creator.account.password} onChange={(event) => setCreator((current) => ({ ...current, account: { ...current.account, password: event.target.value }, accountError: '' }))} placeholder="minimum 6 znaków" data-testid="input-auth-password" required /></label><label><span><KeyRound size={15} /> POWTÓRZ HASŁO</span><input type="password" autoComplete="new-password" value={creator.account.confirmPassword} onChange={(event) => setCreator((current) => ({ ...current, account: { ...current.account, confirmPassword: event.target.value }, accountError: '' }))} placeholder="powtórz hasło" data-testid="input-auth-confirm" required /></label>{creator.accountError && <div className="form-error">{creator.accountError}</div>}<button type="submit" className="account-form-submit">SPRAWDŹ DANE <ArrowRight size={16} /></button></form><div className="account-side-note"><span>IDENTYFIKATOR</span><strong>{creator.nickname.toUpperCase() || 'NOWY WIĘZIEŃ'}</strong><small>#A-47291 / INTAKE</small><p>Dane konta są używane wyłącznie do logowania do Prison Life.</p></div></section>}
    {creator.step === 4 && <section className="step-screen summary-step"><div className="step-heading"><div className="eyebrow">Krok 04 / Kontrola</div><h1>WSZYSTKO <span>GOTOWE</span></h1><p>Sprawdź swoją kartotekę. Możesz cofnąć się i zmienić dowolny wybór.</p></div><div className="summary-grid"><CharacterPreview appearance={creator.appearance} nickname={creator.nickname} type={creator.prisonerType} /><div className="summary-details"><div className="summary-block"><span className="summary-label">KSYWA</span><strong>{creator.nickname.toUpperCase()}</strong><button onClick={() => changeStep(1)}>EDYTUJ <ChevronRight size={14} /></button></div><div className="summary-block"><span className="summary-label">TYP WIĘŹNIA</span><strong>{selectedType.name}</strong><em>{selectedType.specialty}</em><button onClick={() => changeStep(2)}>EDYTUJ <ChevronRight size={14} /></button></div><div className="summary-stats">{selectedType.stats.map((stat) => <span key={stat}>{stat}</span>)}</div><div className="summary-block account-summary"><span className="summary-label">DANE KONTA</span><strong>{creator.account.email}</strong><small>Hasło zabezpieczone</small><button onClick={() => changeStep(3)}>EDYTUJ <ChevronRight size={14} /></button></div><div className="summary-appearance"><span className="summary-label">WYGLĄD</span>{Object.entries(creator.appearance).map(([key, value]) => <span key={key}>{appearanceOptions[key as AppearanceKey][value].name}</span>)}</div></div></div></section>}
  </RegistrationShell>;
}

type CreatorState = { step: number; nickname: string; nicknameError: string; prisonerType: PrisonerType; appearance: Appearance; account: AccountData; accountError: string };
const initialCreator: CreatorState = { step: 1, nickname: '', nicknameError: '', prisonerType: 'bull', appearance: { face: 0, hair: 0, beard: 1, tattoo: 1, outfit: 0, skin: 1 }, account: { email: '', password: '', confirmPassword: '' }, accountError: '' };

function AuthScreen({ mode, onNavigate }: { mode: 'login' | 'register'; onNavigate: (screen: Screen) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState('');
  const register = mode === 'register';
  const submit = (event: FormEvent) => { event.preventDefault(); setNotice('Tryb demonstracyjny: logowanie będzie dostępne przy otwarciu serwera.'); };
  return <main className="auth-page" style={{ '--artwork-url': `url("${prisonArtwork}")` } as CSSProperties}><div className="auth-backdrop" /><header className="auth-header"><Brand onNavigate={onNavigate} /><button onClick={() => onNavigate('home')} className="auth-return"><ArrowLeft size={15} /> WRÓĆ NA STRONĘ GŁÓWNĄ</button></header><section className="auth-card"><div className="eyebrow">{register ? 'Nowy więzień' : 'Powrót za kraty'}</div><h1>{register ? 'ZAREJESTRUJ SIĘ' : 'ZALOGUJ SIĘ'}</h1><p>{register ? 'Stwórz swoją kartotekę i wybierz, jaką reputację zbudujesz za kratami.' : 'Wróć do swojej celi. Twoja reputacja nie poczeka.'}</p><form onSubmit={submit}><label><span><Mail size={15} /> ADRES E-MAIL</span><input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="więzień@prisonlife.pl" required /></label><label><span><KeyRound size={15} /> HASŁO</span><input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="wpisz hasło" required minLength={6} /></label><button className="btn btn-primary" type="submit">{register ? 'OTWÓRZ KARTOTEKĘ' : 'WEJDŹ DO GRY'} <ArrowRight size={16} /></button></form>{notice && <div className="auth-notice">{notice}</div>}<button className="auth-switch" onClick={() => onNavigate(register ? 'login' : 'register')}>{register ? 'MASZ JUŻ KONTO? ' : 'NIE MASZ JESZCZE KONTA? '}<strong>{register ? 'ZALOGUJ SIĘ' : 'ZAREJESTRUJ SIĘ'}</strong></button></section><div className="auth-quote">„ZA KRATAMI NIE MA PRZYPADKÓW.<br /><span>SĄ TYLKO DECYZJE.</span>”</div></main>;
}

type GameSection = 'cell' | 'messages' | 'fight' | 'training' | 'work' | 'equipment' | 'market' | 'quests' | 'gang' | 'ranking';
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
    if (section !== 'cell') showNotice(`${gameNavigation.find((item) => item.id === section)?.label}: widok przygotowany do podłączenia.`);
  };
  const activateHotspot = (id: HotspotId) => {
    setVisited((current) => new Set(current).add(id));
    if (id === 'training') navigateSection('training');
    else showNotice(id === 'bed' ? 'Łóżko: odpoczynek przywróci energię.' : id === 'locker' ? 'Szafka: schowek jest gotowy na Twój ekwipunek.' : 'Stół: tutaj rozpoczniesz zadania.');
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
      <div className="game-player-summary"><GamePortrait creator={creator} small /><div className="game-player-name"><strong>{gameData.nickname.toUpperCase()}</strong><span>POZIOM {gameData.level}</span><div className="game-xp"><i style={{ width: `${(gameData.xp / gameData.xpMax) * 100}%` }} /><small>{gameData.xp} / {gameData.xpMax} XP</small></div></div></div>
      <div className="game-resources"><span className="resource-money"><CircleDollarSign size={18} /> {gameData.gold}</span><span className="resource-energy"><Zap size={18} /> {gameData.energy} / 100</span><span className="resource-health"><Heart size={18} /> {gameData.hp} / 100</span></div>
      <div className="game-header-actions"><button aria-label="Powiadomienia" className="header-icon-button notification-button" onClick={() => showNotice('Nie masz nowych powiadomień.')}><Bell size={18} /><b>3</b></button><button aria-label="Ustawienia" className="header-icon-button" onClick={() => showNotice('Ustawienia konta będą dostępne wkrótce.')}><Settings size={18} /></button><button className="game-logout" onClick={() => onNavigate('home')}><LogOut size={16} /> WYLOGUJ SIĘ <ArrowRight size={15} /></button></div>
    </header>
    <div className="game-layout">
      <aside className={`game-sidebar ${mobileMenuOpen ? 'mobile-sidebar-open' : ''}`}><div className="sidebar-heading">NAWIGACJA</div>{gameNavigation.map(({ id, label, icon: Icon }) => <button className={activeSection === id ? 'active' : ''} key={id} onClick={() => navigateSection(id)}><Icon size={18} /> <span>{label}</span>{id === 'messages' && <b className="sidebar-badge">3</b>}</button>)}</aside>
      <div className="game-content">
        {activeSection === 'cell' ? <div className="game-board">
          <section className="game-cell-column"><div className="game-section-heading"><div><span className="eyebrow">DZIEŃ 01 / BLOK A</span><h1>TWOJA <span>CELA</span></h1></div><span className="cell-status"><i /> ZAMKNIĘTA / 06:00</span></div><CellScene creator={creator} visited={visited} onHotspot={activateHotspot} /></section>
          <aside className="game-right-column">
            <section className="game-panel prisoner-panel"><div className="panel-title"><span>MÓJ WIĘZIEŃ</span><button onClick={() => showNotice('Edycja więźnia będzie dostępna wkrótce.')}><UserRoundPen size={12} /> EDYTUJ</button></div><div className="prisoner-profile"><div><h2>{gameData.nickname.toUpperCase()}</h2><span>#A-7421</span><strong>POZIOM {gameData.level}</strong><div className="profile-xp"><i style={{ width: `${(gameData.xp / gameData.xpMax) * 100}%` }} /><small>{gameData.xp} / {gameData.xpMax} XP</small></div></div><GamePortrait creator={creator} small /></div><div className="prisoner-stats">{gameStats.map(({ label, value, icon: Icon, color }) => <div className="prisoner-stat" key={label}><Icon size={16} className={`stat-${color}`} /><span>{label}</span><div><i style={{ width: `${value * 10}%` }} /></div><b>{value}</b></div>)}</div><div className="reputation-row"><div><span>REPUTACJA</span><strong>{gameData.reputation}</strong></div><div><span>RANGA</span><strong>{gameData.rank}</strong></div></div><blockquote>„ZA KRATAMI WSZYSCY<br />JESTEŚMY RÓWNI...<br /><em>ALE NIE NA DŁUGO.”</em></blockquote></section>
            <section className="game-panel quests-panel"><div className="panel-title"><span>AKTUALNE ZADANIA</span><button onClick={() => navigateSection('quests')}>ZOBACZ WSZYSTKIE <ChevronRight size={12} /></button></div><div className="quest-list"><div className="quest-item"><CheckCircle2 size={19} /><div><strong>PIERWSZE KROKI</strong><small>Zdobądź 100 $ z pracy lub walk.</small><div className="quest-progress"><i style={{ width: '65%' }} /></div></div><b>65 / 100</b></div><div className="quest-item"><Dumbbell size={19} /><div><strong>TRENING CZYNI MISTRZA</strong><small>Wykonaj 3 treningi siły.</small><div className="quest-progress"><i style={{ width: '34%' }} /></div></div><b>1 / 3</b></div><div className="quest-item"><PanelRight size={19} /><div><strong>POZNAJ CELE</strong><small>Kliknij wszystkie interaktywne elementy w celi.</small><div className="quest-progress"><i style={{ width: `${visited.size * 25}%` }} /></div></div><b>{visited.size} / 4</b></div></div></section>
              <div className="game-promo"><span>PRZETRWAJ<br /><b>ROZWIJAJ SIĘ<br />DOMINUJ</b></span><button onClick={() => showNotice('Wkrótce poznasz pełną mapę bloku.')}><ChevronRight size={20} /></button></div>
          </aside>
        </div> : <GamePlaceholder section={activeSection} onReturn={() => navigateSection('cell')} />}
        <section className="game-bottom-grid">
          <section className="game-panel messages-panel"><div className="panel-title"><span>WIADOMOŚCI <b>(3)</b></span><button onClick={() => setNewMessageOpen((open) => !open)}>+ NOWA WIADOMOŚĆ</button></div>{newMessageOpen && <div className="new-message-row"><input autoFocus placeholder="Napisz do..." /><button onClick={() => { setNewMessageOpen(false); showNotice('Nowa wiadomość została przygotowana.'); }}><Send size={14} /></button></div>}<div className="message-list">{gameMessages.map((message) => <button className="message-item" key={message.name} onClick={() => showNotice(`Otwierasz wiadomość od ${message.name}.`)}><span className="message-avatar">{message.name[0]}</span><span><strong>{message.name}</strong><small>{message.text}</small></span><time>{message.time}<b>1</b></time></button>)}</div></section>
          <section className="game-panel chat-panel"><div className="panel-title"><span>CZAT: {chatTab}</span></div><div className="chat-tabs">{(['ODDZIAŁ A', 'GLOBALNY', 'GANG'] as const).map((tab) => <button className={chatTab === tab ? 'active' : ''} onClick={() => setChatTab(tab)} key={tab}>{tab}</button>)}</div><div className="chat-lines">{chatLines.slice(-5).map((line, index) => <div className="chat-line" key={`${line.time}-${index}`}><time>{line.time}</time><strong>{line.name}:</strong><span>{line.text}</span></div>)}</div><form className="chat-compose" onSubmit={sendChat}><input value={chatMessage} onChange={(event) => setChatMessage(event.target.value)} placeholder="Napisz wiadomość..." /><button aria-label="Wyślij wiadomość"><Send size={14} /></button></form></section>
          <section className="game-panel events-panel"><div className="panel-title"><span>OSTATNIE WYDARZENIA</span><button onClick={() => showNotice('Wyświetlasz pełną historię wydarzeń.')}>ZOBACZ WSZYSTKIE</button></div><div className="event-list">{gameEvents.map((event) => <div className="event-item" key={`${event.time}-${event.text}`}><time>{event.time}</time><span>{event.text}</span><b className={event.tone}>{event.result}</b></div>)}</div></section>
        </section>
      </div>
    </div>
    <footer className="game-footer"><span>© 2026 Prison Life. Wszystkie prawa zastrzeżone.</span><div><button onClick={() => showNotice('Regulamin będzie dostępny przy otwarciu serwera.')}>Regulamin</button><button onClick={() => showNotice('Polityka prywatności będzie dostępna przy otwarciu serwera.')}>Polityka prywatności</button><button onClick={() => showNotice('Pomoc będzie dostępna przy otwarciu serwera.')}>Pomoc</button></div></footer>
    {notice && <div className="notice game-notice" role="status">{notice}</div>}
  </main>;
}

function App() {
  const [screen, setScreen] = useState<Screen>(() => {
    const route = window.location.hash.replace('#', '');
    return route === 'register' || route === 'login' || route === 'game' || route.startsWith('game/') ? 'game' : 'home';
  });
  const [creator, setCreator] = useState<CreatorState>(initialCreator);
  const navigate = (next: Screen) => { setScreen(next); window.history.pushState({}, '', next === 'home' ? `${window.location.pathname}` : `#${next}`); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  useEffect(() => { const handlePop = () => { const route = window.location.hash.replace('#', ''); setScreen(route === 'register' || route === 'login' || route === 'game' || route.startsWith('game/') ? 'game' : 'home'); }; window.addEventListener('popstate', handlePop); window.addEventListener('hashchange', handlePop); return () => { window.removeEventListener('popstate', handlePop); window.removeEventListener('hashchange', handlePop); }; }, []);
  useEffect(() => { document.title = screen === 'home' ? 'Prison Life — Więcej niż gra. To Twój wyrok.' : screen === 'register' ? 'Stwórz swojego więźnia — Prison Life' : screen === 'login' ? 'Zaloguj się — Prison Life' : 'Panel więźnia — Prison Life'; }, [screen]);
  return <QueryClientProvider client={queryClient}><TooltipProvider><ErrorBoundary resetKey="prison-life">{screen === 'home' && <Home onNavigate={navigate} />}{screen === 'register' && <Registration onNavigate={navigate} creator={creator} setCreator={setCreator} />}{screen === 'login' && <AuthScreen mode="login" onNavigate={navigate} />}{screen === 'game' && <GameShell creator={creator} onNavigate={navigate} />}</ErrorBoundary><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;

type HotspotId = 'bed' | 'locker' | 'table' | 'training';

function CellHotspot({ id, label, description, icon: Icon, onClick, active }: { id: HotspotId; label: string; description: string; icon: typeof BedDouble; onClick: () => void; active: boolean }) {
  return <button className={`cell-hotspot hotspot-${id} ${active ? 'visited' : ''}`} onClick={onClick} data-testid={`button-hotspot-${id}`}><span className="hotspot-icon"><Icon size={17} /></span><span><strong>{label}</strong><small>{description}</small></span><ChevronRight size={14} /></button>;
}

function GamePlaceholder({ section, onReturn }: { section: GameSection; onReturn: () => void }) {
  const item = gameNavigation.find((entry) => entry.id === section)!;
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
  };
  return <section className="game-placeholder" data-testid={`game-placeholder-${section}`}><div className="placeholder-stamp">BLOK A / SYSTEM</div><Icon size={48} /><span className="eyebrow">SEKCJA GRY</span><h1>{item.label}</h1><p>{copy[section]}</p><button className="btn btn-primary" onClick={onReturn}><Shield size={15} /> WRÓĆ DO CELI</button></section>;
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

function CellScene({ creator, visited, onHotspot }: { creator: CreatorState; visited: Set<HotspotId>; onHotspot: (id: HotspotId) => void }) {
  return <div className="cell-scene" data-testid="cell-scene">
    <div className="cell-window"><span className="window-light" /><i /><i /><i /><i /><b>BLOCK A</b></div>
    <div className="cell-graffiti graffiti-one">TU ZACZYNA SIĘ<br /><em>TWOJA HISTORIA</em></div>
    <div className="cell-graffiti graffiti-two">SZACUNEK<br />SIŁA<br />PRZETRWANIE</div>
    <div className="cell-lamp lamp-left" /><div className="cell-lamp lamp-right" />
    <div className="cell-bed"><span className="bed-mattress" /><span className="bed-pillow" /><span className="bed-frame" /></div>
    <div className="cell-locker"><span /><i /><b>17</b></div>
    <div className="cell-tv"><span>NO SIGNAL</span></div>
    <div className="cell-table"><i /><i /><span /></div>
    <div className="cell-stool"><i /><i /><span /></div>
    <div className="cell-dumbbells"><i /><i /><b /><b /></div>
    <div className="cell-floor" />
    <GamePortrait creator={creator} />
    <div className="scene-label">TWOJA CELA <span>/</span> BLOK A <b>A-47291</b></div>
    <CellHotspot id="bed" label="ŁÓŻKO" description="Odpocznij i odzyskaj siły" icon={BedDouble} onClick={() => onHotspot('bed')} active={visited.has('bed')} />
    <CellHotspot id="locker" label="SZAFKA" description="Przechowuj swoje rzeczy" icon={Archive} onClick={() => onHotspot('locker')} active={visited.has('locker')} />
    <CellHotspot id="table" label="STÓŁ" description="Wykonuj zadania" icon={Table} onClick={() => onHotspot('table')} active={visited.has('table')} />
    <CellHotspot id="training" label="TRENING" description="Popraw swoje statystyki" icon={Dumbbell} onClick={() => onHotspot('training')} active={visited.has('training')} />
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
