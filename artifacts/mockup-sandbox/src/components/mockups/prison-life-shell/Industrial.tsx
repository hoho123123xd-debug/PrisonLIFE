import { useState } from "react";
import {
  Activity,
  Bell,
  ChevronRight,
  ClipboardList,
  Cross,
  Dumbbell,
  Heart,
  Home,
  Mail,
  Menu,
  Plus,
  Settings,
  ShoppingCart,
  Swords,
  Tag,
  Trophy,
  UserRound,
  Users,
  Utensils,
  WalletCards,
  X,
  Zap,
} from "lucide-react";
import "./_group.css";
import "./Industrial.css";

type NavItem = {
  label: string;
  icon: typeof Home;
};

const navigation: NavItem[] = [
  { label: "CEL", icon: Home },
  { label: "TRENING", icon: Dumbbell },
  { label: "WALKA", icon: Swords },
  { label: "STOŁÓWKA", icon: Utensils },
  { label: "SKLEP", icon: ShoppingCart },
  { label: "CZARNY RYNEK", icon: Tag },
  { label: "ZLECENIA", icon: ClipboardList },
  { label: "GANG", icon: Users },
  { label: "SZPITAL", icon: Cross },
  { label: "RANKING", icon: Trophy },
];

type FlashMessage = string | null;

function Resource({
  label,
  value,
  icon: Icon,
  progress,
  className = "",
}: {
  label: string;
  value: string;
  icon: typeof Zap;
  progress?: number;
  className?: string;
}) {
  return (
    <div className={`pls-resource ${className}`}>
      <Icon aria-hidden="true" />
      <div className="pls-resource-body">
        <span className="pls-resource-label">{label}</span>
        <strong className="pls-resource-value">{value}</strong>
      </div>
      {progress !== undefined && (
        <div className="pls-resource-track" aria-label={`${label}: ${value}`}>
          <i style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

export function Industrial() {
  const [activeSection, setActiveSection] = useState("CEL");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [flash, setFlash] = useState<FlashMessage>(null);

  const announce = (message: string) => {
    setFlash(message);
    window.setTimeout(() => setFlash(null), 2400);
  };

  const navigate = (label: string) => {
    setActiveSection(label);
    setMobileMenuOpen(false);
    if (label === "CEL") {
      announce("CEL / SEKTOR A — monitoring aktywny");
    } else {
      announce(`${label} — widok przygotowany do wejścia`);
    }
  };

  return (
    <main className="prison-life-shell">
      <header className="pls-topbar">
        <div className="pls-brand">
          <div className="pls-brand-mark" aria-hidden="true">
            <ShieldMark />
          </div>
          <div className="pls-brand-copy">
            <h1 className="pls-brand-name">
              PRISON <b>LIFE</b>
            </h1>
            <span className="pls-brand-line">SEZON 01 / BLOK A / NOCNA WARTA</span>
          </div>
        </div>

        <div className="pls-player" aria-label="Profil gracza">
          <div className="pls-avatar">
            <UserRound aria-hidden="true" />
          </div>
          <div className="pls-player-meta">
            <div className="pls-player-meta-top">
              <strong>KOSA</strong>
              <small>BYK</small>
            </div>
            <div className="pls-level">
              POZIOM <b>12</b>
            </div>
            <div className="pls-xp-track">
              <i style={{ width: "68.4%" }} />
              <span className="pls-xp-label">3420 / 5000 EXP</span>
            </div>
          </div>
        </div>

        <div className="pls-resources" aria-label="Zasoby">
          <Resource label="ENERGIA" value="75 / 100" icon={Zap} progress={75} />
          <Resource label="SIŁA" value="60 / 100" icon={Dumbbell} progress={60} className="pls-resource--strength" />
          <Resource label="ZDROWIE" value="100 / 100" icon={Heart} progress={100} className="pls-resource--health" />
          <div className="pls-wallet">
            <WalletCards aria-hidden="true" />
            <div>
              <small>GOTÓWKA</small>
              <strong>1 250</strong>
            </div>
            <button className="pls-button pls-plus" aria-label="Dodaj gotówkę" onClick={() => announce("KASA — panel zasilenia niedostępny")}>
              <Plus size={13} />
            </button>
          </div>
        </div>

        <div className="pls-top-actions">
          <button className="pls-button pls-icon-button" aria-label="Poczta" onClick={() => announce("POCZTA — 3 nowe wiadomości")} data-badge="3">
            <Mail size={19} />
          </button>
          <button className="pls-button pls-icon-button" aria-label="Powiadomienia" onClick={() => announce("BRAK NOWYCH ALARMÓW")}>
            <Bell size={19} />
          </button>
          <button className="pls-button pls-icon-button" aria-label="Ustawienia" onClick={() => announce("USTAWIENIA — dostęp za chwilę")}>
            <Settings size={19} />
          </button>
          <button className="pls-button pls-mobile-toggle" aria-label={mobileMenuOpen ? "Zamknij menu" : "Otwórz menu"} onClick={() => setMobileMenuOpen((open) => !open)}>
            {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </header>

      <div className="pls-layout">
        <aside className={`pls-rail ${mobileMenuOpen ? "is-open" : ""}`}>
          <div className="pls-rail-head">
            <strong>NAWIGACJA</strong>
            <span>10 / 10</span>
          </div>
          <nav className="pls-nav" aria-label="Nawigacja gry">
            {navigation.map(({ label, icon: Icon }) => (
              <button
                key={label}
                className={`pls-button pls-nav-button pls-nav-button--plate ${activeSection === label ? "active" : ""}`}
                onClick={() => navigate(label)}
                aria-current={activeSection === label ? "page" : undefined}
              >
                <Icon aria-hidden="true" />
                <span>{label}</span>
                <b aria-hidden="true">
                  <ChevronRight size={16} />
                </b>
              </button>
            ))}
          </nav>
          <div className="pls-rail-note">
            Dyscyplina
            <br />
            buduje wolność
            <b>PL / A-47291</b>
          </div>
        </aside>

        <section className="pls-scene" aria-label="Nocny dziedziniec więzienia">
          <div className="pls-scene-stamp">
            CCTV / A-02 <b>●</b> 23:48:17 / DESZCZ
          </div>

          <div className="pls-status-stack">
            <div className="pls-status-panel">
              <div className="pls-status-heading">
                <span>STATUS ODDZIAŁU</span>
                <b>LIVE</b>
              </div>
              <div className="pls-status-rule" />
              <div className="pls-status-row">
                <Activity aria-hidden="true" />
                <span>RUCH NA PLACU</span>
                <span>WYSOKI</span>
              </div>
              <div className="pls-status-row">
                <Zap aria-hidden="true" />
                <span>WARTA</span>
                <span>AKTYWNA</span>
              </div>
            </div>
            <div className="pls-status-panel">
              <div className="pls-status-heading">
                <span>OSTATNI RAPORT</span>
                <b>00:12</b>
              </div>
              <div className="pls-status-row">
                <ShieldMark />
                <span>SEKTOR A ZAMKNIĘTY</span>
              </div>
            </div>
          </div>

          <div className="pls-location-card">
            <small>LOKACJA GRACZA / CEL</small>
            <h1>{activeSection === "CEL" ? "Plac więzienny" : activeSection}</h1>
            <p>
              SEKTOR <b>A</b> / WIDOCZNOŚĆ <b>42%</b> / DESZCZ <b>18°C</b>
            </p>
          </div>

          <div className="pls-scene-corner">
            <i />
            SYSTEMY OCHRONY: ONLINE
          </div>
        </section>
      </div>

      {flash && <div className="pls-flash" role="status">{flash}</div>}
    </main>
  );
}

function ShieldMark() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 3 27 7v8c0 7-4.5 11.4-11 14C9.5 26.4 5 22 5 15V7l11-4Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M11 12h10M11 16h10M12 20h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  );
}