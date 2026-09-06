import { type CSSProperties, type FormEvent, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ArrowRight,
  BriefcaseBusiness,
  Crown,
  Coins,
  Dumbbell,
  Facebook,
  Gamepad2,
  Instagram,
  LockKeyhole,
  Menu,
  Swords,
  Trophy,
  Users,
  X,
  Youtube,
  Shield,
  Backpack,
  Crosshair,
  Flag,
  ScrollText,
  Zap,
  Heart,
} from 'lucide-react';
import prisonArtwork from '@assets/ChatGPT_Image_6_wrz_2026,_17_17_42_1788707864145.png';

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

type DialogMode = 'login' | 'register' | null;

function Home() {
  const [dialog, setDialog] = useState<DialogMode>(null);
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

  const openDialog = (mode: DialogMode) => {
    setDialog(mode);
    setMobileOpen(false);
  };
  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3500);
  };
  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDialog(null);
    showNotice(dialog === 'register' ? 'Kreator więźnia będzie gotowy przy otwarciu serwera.' : 'Logowanie będzie dostępne przy otwarciu serwera.');
  };

  return (
    <main className="prison-page" style={{ '--artwork-url': `url("${prisonArtwork}")` } as CSSProperties}>
      <header className="site-header" data-testid="header-main">
        <div className="prison-shell header-inner">
          <a href="#top" className="brand" data-testid="link-brand" onClick={() => setMobileOpen(false)}>
            <span className="brand-name">PRISON<span className="crown">◆</span>LIFE</span>
            <span className="brand-tagline">TU ZACZYNA SIĘ PRAWDZIWA GRA</span>
          </a>
          <nav className="nav-links" aria-label="Główna nawigacja">
            <a href="#about" className="nav-link" data-testid="link-nav-about">O GRZE</a>
            <a href="#features" className="nav-link" data-testid="link-nav-features">FUNKCJE</a>
            <a href="#world" className="nav-link" data-testid="link-nav-world">ŚWIAT GRY</a>
            <a href="#community" className="nav-link" data-testid="link-nav-community">SPOŁECZNOŚĆ</a>
            <a href="#rankings" className="nav-link" data-testid="link-nav-rankings">RANKINGI</a>
            <a href="#media" className="nav-link" data-testid="link-nav-media">MEDIA</a>
          </nav>
          <div className="header-actions">
            <button className="header-action" onClick={() => openDialog('login')} data-testid="button-header-login">ZALOGUJ SIĘ</button>
            <button className="header-action register" onClick={() => openDialog('register')} data-testid="button-header-register">ZAREJESTRUJ SIĘ</button>
          </div>
          <button className="mobile-toggle" aria-label={mobileOpen ? 'Zamknij menu' : 'Otwórz menu'} onClick={() => setMobileOpen((open) => !open)} data-testid="button-mobile-menu">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className={`mobile-menu ${mobileOpen ? 'mobile-menu-open' : ''}`}>
            <a href="#about" className="nav-link" onClick={() => setMobileOpen(false)} data-testid="link-mobile-about">O GRZE</a>
            <a href="#features" className="nav-link" onClick={() => setMobileOpen(false)} data-testid="link-mobile-features">FUNKCJE</a>
            <a href="#world" className="nav-link" onClick={() => setMobileOpen(false)} data-testid="link-mobile-world">ŚWIAT GRY</a>
            <a href="#community" className="nav-link" onClick={() => setMobileOpen(false)} data-testid="link-mobile-community">SPOŁECZNOŚĆ</a>
            <a href="#rankings" className="nav-link" onClick={() => setMobileOpen(false)} data-testid="link-mobile-rankings">RANKINGI</a>
            <div className="header-actions">
              <button className="header-action" onClick={() => openDialog('login')} data-testid="button-mobile-login">ZALOGUJ SIĘ</button>
              <button className="header-action register" onClick={() => openDialog('register')} data-testid="button-mobile-register">ZAREJESTRUJ SIĘ</button>
            </div>
          </div>
        </div>
      </header>

      <section className="hero" id="top" data-testid="section-hero">
        <div className="prison-shell">
          <div className="hero-content reveal" id="about">
            <div className="eyebrow">Więzienie. Zasady. Reputacja.</div>
            <h1 className="hero-title" data-testid="text-hero-title">Więcej niż gra.<span>To twój wyrok.</span></h1>
            <p className="hero-copy" data-testid="text-hero-description">
              Prison Life to przeglądarkowa gra strategiczna, w której trafiasz do więzienia i budujesz swoją legendę. Trenuj, walcz, pracuj, kombinuj i pokaż, na co Cię stać w świecie, gdzie liczy się tylko siła, spryt i lojalność.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary" onClick={() => openDialog('register')} data-testid="button-hero-register">ZAREJESTRUJ SIĘ <ArrowRight size={17} /></button>
              <button className="btn btn-outline" onClick={() => openDialog('login')} data-testid="button-hero-login"><LockKeyhole size={16} /> ZALOGUJ SIĘ</button>
            </div>
          </div>
        </div>
        <div className="hero-scroll" aria-hidden="true">PRZEJDŹ DALEJ</div>
      </section>

      <section className="stats-strip" aria-label="Statystyki gry" id="community" data-testid="section-stats">
        <div className="prison-shell stats-grid">
          <div className="stat" data-testid="stat-active-prisoners"><strong className="stat-value">12 842</strong><span className="stat-label">Aktywnych więźniów</span></div>
          <div className="stat" data-testid="stat-fights"><strong className="stat-value">1 204 568</strong><span className="stat-label">Stoczonych walk</span></div>
          <div className="stat" data-testid="stat-days"><strong className="stat-value">587 321</strong><span className="stat-label">Dni za kratami</span></div>
          <div className="stat" data-testid="stat-years"><strong className="stat-value">5 lat</strong><span className="stat-label">Ciągłego rozwoju</span></div>
        </div>
      </section>

      <section className="features-section section-rule" id="features" data-testid="section-features">
        <div className="prison-shell features-grid">
          {featureItems.map(({ title, copy, icon: Icon }, index) => (
            <article className="feature" key={title} data-testid={`feature-card-${index}`}>
              <Icon className="feature-icon" strokeWidth={1.5} aria-hidden="true" />
              <h2 className="feature-title">{title}</h2>
              <p className="feature-copy">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="world-section section-rule" id="world" data-testid="section-world">
        <div className="prison-shell world-grid">
          <div className="game-panel" id="media" aria-label="Podgląd panelu gry" data-testid="gameplay-panel">
            <div className="panel-top"><span><Coins /> 12 450</span><span><Zap /> 78</span><span><Heart /> 340</span></div>
            <div className="panel-menu">
              {panelItems.map(({ label, icon: Icon }, index) => (
                <div id={label === 'Ranking' ? 'rankings' : undefined} className={`panel-menu-item ${index === 0 ? 'active' : ''}`} key={label} data-testid={`game-menu-${label.toLowerCase()}`}><Icon />{label}</div>
              ))}
            </div>
            <div className="player-card">
              <div className="player-avatar" data-testid="img-player-kosa" role="img" aria-label="Kosa w swojej celi" />
              <div>
                <div className="player-name" data-testid="text-player-name">Kosa</div>
                <div className="player-level" data-testid="text-player-level">Poziom 28</div>
                <div className="stat-bars">
                  {barItems.map(([label, value, width]) => (
                    <div className="bar-line" key={label} data-testid={`player-stat-${label.toLowerCase()}`}><span>{label}</span><div className="bar"><i style={{ width }} /></div><b>{value}</b></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="world-copy-block">
            <div className="world-kicker">Świat Prison Life</div>
            <h2 className="world-title" data-testid="text-world-title">Za kratami zaczyna się <span>prawdziwa gra</span></h2>
            <p className="world-copy">Poznaj brutalny, ale pełen możliwości świat więzienia. Każda decyzja ma znaczenie, a każdy dzień to nowa szansa, by stać się kimś więcej.</p>
            <button className="btn btn-outline world-cta" onClick={() => showNotice('Pełny widok świata pojawi się już wkrótce.')} data-testid="button-world-more">ZOBACZ WIĘCEJ <ArrowRight size={16} /></button>
          </div>
        </div>
      </section>

      <footer className="footer" id="footer-main" data-testid="footer-main">
        <div className="prison-shell footer-main">
          <a href="#top" className="brand" data-testid="link-footer-brand"><span className="brand-name">PRISON<span className="crown">◆</span>LIFE</span></a>
          <nav className="footer-links" aria-label="Linki informacyjne">
            <a href="#rules" className="footer-link" onClick={() => showNotice('Regulamin będzie dostępny przy otwarciu serwera.')} data-testid="link-footer-rules">Regulamin</a>
            <a href="#privacy" className="footer-link" onClick={() => showNotice('Polityka prywatności będzie dostępna przy otwarciu serwera.')} data-testid="link-footer-privacy">Polityka prywatności</a>
            <a href="#faq" className="footer-link" onClick={() => showNotice('Sekcja FAQ jest w przygotowaniu.')} data-testid="link-footer-faq">FAQ</a>
            <a href="mailto:kontakt@prisonlife.pl" className="footer-link" data-testid="link-footer-contact">Kontakt</a>
          </nav>
          <div className="social-links" aria-label="Media społecznościowe">
            <a href="#discord" className="social-link" aria-label="Discord" onClick={() => showNotice('Społeczność Prison Life wkrótce otworzy serwer Discord.')} data-testid="link-social-discord"><Gamepad2 size={17} /></a>
            <a href="#facebook" className="social-link" aria-label="Facebook" data-testid="link-social-facebook"><Facebook size={17} /></a>
            <a href="#youtube" className="social-link" aria-label="YouTube" data-testid="link-social-youtube"><Youtube size={17} /></a>
            <a href="#instagram" className="social-link" aria-label="Instagram" data-testid="link-social-instagram"><Instagram size={17} /></a>
          </div>
          <div className="footer-motto">PRAWDZIWE HISTORIE<br />ZACZYNAJĄ SIĘ W WIĘZIENIU...</div>
        </div>
        <div className="prison-shell footer-bottom"><span data-testid="text-copyright">© 2026 Prison Life. Wszystkie prawa zastrzeżone.</span><span>Więcej niż gra.</span></div>
      </footer>

      {dialog && (
        <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(null); }} data-testid="dialog-backdrop">
          <section className="dialog-panel" role="dialog" aria-modal="true" aria-labelledby="dialog-title" data-testid={`dialog-${dialog}`}>
            <button className="dialog-close" onClick={() => setDialog(null)} aria-label="Zamknij" data-testid="button-dialog-close"><X size={20} /></button>
            <div className="eyebrow">{dialog === 'register' ? 'Nowy więzień' : 'Powrót za kraty'}</div>
            <h2 className="dialog-title" id="dialog-title">{dialog === 'register' ? 'Zarejestruj się' : 'Zaloguj się'}</h2>
            <p className="dialog-copy">{dialog === 'register' ? 'Stwórz swoją kartotekę i wybierz, jaką reputację zbudujesz za kratami.' : 'Wróć do swojej celi. Twoja reputacja nie poczeka.'}</p>
            <form className="dialog-form" onSubmit={handleSubmit}>
              {dialog === 'register' && <label className="dialog-label">Pseudonim<input className="dialog-input" required placeholder="np. Kosa" data-testid="input-register-nickname" /></label>}
              <label className="dialog-label">Adres e-mail<input type="email" className="dialog-input" required placeholder="więzień@prisonlife.pl" data-testid="input-auth-email" /></label>
              <label className="dialog-label">Hasło<input type="password" className="dialog-input" required minLength={6} placeholder="wpisz hasło" data-testid="input-auth-password" /></label>
              <button className="btn btn-primary dialog-submit" type="submit" data-testid="button-dialog-submit">{dialog === 'register' ? 'OTWÓRZ KARTOTEKĘ' : 'WEJDŹ DO GRY'} <ArrowRight size={16} /></button>
            </form>
          </section>
        </div>
      )}
      {notice && <div className="notice" role="status" data-testid="status-notice">{notice}</div>}
    </main>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary resetKey="prison-life"><Home /></ErrorBoundary>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;