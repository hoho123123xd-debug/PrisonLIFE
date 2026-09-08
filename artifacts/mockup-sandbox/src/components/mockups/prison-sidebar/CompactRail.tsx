import { useState } from "react";
import { UserRound, ChevronRight, Crosshair, Radio, ShieldAlert } from "lucide-react";
import "./CompactRail.css";

type NavItem = {
  label: string;
  iconSrc?: string;
};

const navigation: NavItem[] = [
  { label: "TWOJA POSTAĆ" },
  { label: "CELA", iconSrc: "/__mockup/images/prison-sidebar/icon-cela.png" },
  { label: "TRENING", iconSrc: "/__mockup/images/prison-sidebar/icon-trening.png" },
  { label: "WALKA", iconSrc: "/__mockup/images/prison-sidebar/icon-walka.png" },
  { label: "STOŁÓWKA", iconSrc: "/__mockup/images/prison-sidebar/icon-stolowka.png" },
  { label: "KANTYNA", iconSrc: "/__mockup/images/prison-sidebar/icon-sklep.png" },
  { label: "CZARNY RYNEK", iconSrc: "/__mockup/images/prison-sidebar/icon-czarny-rynek.png" },
  { label: "ZLECENIA", iconSrc: "/__mockup/images/prison-sidebar/icon-zlecenia.png" },
  { label: "GANG", iconSrc: "/__mockup/images/prison-sidebar/icon-gang.png" },
  { label: "SZPITAL", iconSrc: "/__mockup/images/prison-sidebar/icon-szpital.png" },
  { label: "RANKING", iconSrc: "/__mockup/images/prison-sidebar/icon-ranking.png" },
];

function NavGlyph({ item }: { item: NavItem }) {
  if (!item.iconSrc) {
    return <UserRound aria-hidden="true" strokeWidth={1.7} />;
  }

  return <img src={item.iconSrc} alt="" aria-hidden="true" />;
}

export function CompactRail() {
  const [activeSection, setActiveSection] = useState("TWOJA POSTAĆ");
  const [notice, setNotice] = useState("Profil gotowy do działania");

  const navigate = (label: string) => {
    setActiveSection(label);
    setNotice(label === "TWOJA POSTAĆ" ? "Profil gotowy do działania" : `${label} / kanał otwarty`);
  };

  return (
    <main className="compact-shell">
      <aside className="compact-rail" aria-label="Szybka nawigacja gry">
        <div className="compact-rail-top">
          <div className="compact-mark" aria-label="Prison Life">
            <span>PL</span>
            <i />
          </div>
          <span className="compact-rail-code">A-17</span>
        </div>

        <div className="compact-divider" />
        <nav className="compact-nav" aria-label="Nawigacja gry">
          {navigation.map((item, index) => {
            const isActive = activeSection === item.label;
            return (
              <button
                key={item.label}
                type="button"
                className={`compact-nav-item ${isActive ? "is-active" : ""}`}
                onClick={() => navigate(item.label)}
                aria-current={isActive ? "page" : undefined}
                aria-label={item.label}
                title={item.label}
              >
                <span className="compact-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="compact-icon"><NavGlyph item={item} /></span>
                <span className="compact-label">{item.label}</span>
                <span className="compact-tooltip">{item.label}</span>
                {isActive && <span className="compact-signal" aria-hidden="true" />}
              </button>
            );
          })}
        </nav>

        <div className="compact-active-panel" aria-live="polite">
          <span className="compact-active-kicker">AKTYWNA SEKCJA</span>
          <strong>{activeSection}</strong>
          <span className="compact-active-status"><i /> ONLINE</span>
        </div>
      </aside>

      <section className="compact-stage" aria-label="Widok gry">
        <header className="compact-topbar">
          <div className="compact-breadcrumb">
            <span className="compact-cctv"><i /> CCTV / A-02</span>
            <ChevronRight aria-hidden="true" size={14} />
            <strong>{activeSection}</strong>
          </div>
          <div className="compact-player">
            <span className="compact-player-avatar">K</span>
            <span><b>KOSA</b><small>LVL 12 / BYK</small></span>
          </div>
        </header>

        <div className="compact-stage-copy">
          <span className="compact-eyebrow">SEKTOR A / NOCNA ZMIANA / 23:48</span>
          <h1>Nie odwracaj się.</h1>
          <p>Każdy ruch zostawia ślad. Twoja cela jest zamknięta, ale dziedziniec jeszcze żyje.</p>
          <div className="compact-action-row">
            <button type="button" className="compact-signal-button" onClick={() => setNotice("Skaner terenu: 42% widoczności")}>
              <Crosshair size={16} aria-hidden="true" /> SKANUJ TEREN
            </button>
            <span className="compact-notice" role="status">{notice}</span>
          </div>
        </div>

        <div className="compact-stage-meta">
          <div><Radio size={15} aria-hidden="true" /><span>RUCH NA PLACU <b>WYSOKI</b></span></div>
          <div><ShieldAlert size={15} aria-hidden="true" /><span>WARTA <b>AKTYWNA</b></span></div>
        </div>
        <div className="compact-weather">DESZCZ <b>18°C</b><i /> WIDOCZNOŚĆ <b>42%</b></div>
      </section>
    </main>
  );
}
