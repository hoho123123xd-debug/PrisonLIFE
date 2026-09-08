import { useState } from "react";
import { UserRound, ChevronRight, LockKeyhole, Radio, Shield, Siren } from "lucide-react";
import "./CommandDeck.css";

type NavItem = {
  label: string;
  iconSrc?: string;
  detail: string;
};

const navigation: NavItem[] = [
  { label: "TWOJA POSTAĆ", detail: "STATUS / PROFIL" },
  { label: "CELA", iconSrc: "/__mockup/images/prison-sidebar/icon-cela.png", detail: "SEKTOR A / 04" },
  { label: "TRENING", iconSrc: "/__mockup/images/prison-sidebar/icon-trening.png", detail: "FORMA / 72%" },
  { label: "WALKA", iconSrc: "/__mockup/images/prison-sidebar/icon-walka.png", detail: "RYZYKO / WYSOKIE" },
  { label: "STOŁÓWKA", iconSrc: "/__mockup/images/prison-sidebar/icon-stolowka.png", detail: "POSIŁEK / 19:00" },
  { label: "KANTYNA", iconSrc: "/__mockup/images/prison-sidebar/icon-sklep.png", detail: "ZAPASY / 04" },
  { label: "CZARNY RYNEK", iconSrc: "/__mockup/images/prison-sidebar/icon-czarny-rynek.png", detail: "TAJNE / 02" },
  { label: "ZLECENIA", iconSrc: "/__mockup/images/prison-sidebar/icon-zlecenia.png", detail: "OTWARTE / 03" },
  { label: "GANG", iconSrc: "/__mockup/images/prison-sidebar/icon-gang.png", detail: "BYK / 08 OSÓB" },
  { label: "SZPITAL", iconSrc: "/__mockup/images/prison-sidebar/icon-szpital.png", detail: "ZDROWIE / 86%" },
  { label: "RANKING", iconSrc: "/__mockup/images/prison-sidebar/icon-ranking.png", detail: "POZYCJA / 47" },
];

function NavGlyph({ item }: { item: NavItem }) {
  if (!item.iconSrc) return <UserRound aria-hidden="true" strokeWidth={1.7} />;
  return <img src={item.iconSrc} alt="" aria-hidden="true" />;
}

export function CommandDeck() {
  const [activeSection, setActiveSection] = useState("TWOJA POSTAĆ");
  const activeItem = navigation.find((item) => item.label === activeSection) ?? navigation[0];

  return (
    <main className="command-shell">
      <aside className="command-deck" aria-label="Panel dowodzenia Prison Life">
        <div className="command-header">
          <div className="command-wordmark"><span>PRISON</span><b>LIFE</b></div>
          <div className="command-header-meta">
            <span>CONTROL / 07</span>
            <i><span /></i>
          </div>
        </div>

        <div className="command-profile">
          <div className="command-avatar">K</div>
          <div>
            <span className="command-profile-label">OSADZONY</span>
            <strong>KOSA</strong>
            <small>LVL 12 <b>•</b> GANG BYK</small>
          </div>
          <div className="command-profile-status"><i /> AKTYWNY</div>
        </div>

        <div className="command-location">
          <LockKeyhole size={15} aria-hidden="true" />
          <div><span>BIEŻĄCA LOKACJA</span><strong>{activeSection}</strong></div>
          <ChevronRight size={15} aria-hidden="true" />
        </div>

        <nav className="command-nav" aria-label="Nawigacja gry">
          <div className="command-section-label"><span>01</span> RUCHY OSADZONEGO <i /></div>
          {navigation.map((item, index) => {
            const isActive = item.label === activeSection;
            return (
              <button
                key={item.label}
                type="button"
                className={`command-nav-item ${isActive ? "is-active" : ""}`}
                onClick={() => setActiveSection(item.label)}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="command-nav-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="command-nav-icon"><NavGlyph item={item} /></span>
                <span className="command-nav-copy"><b>{item.label}</b><small>{item.detail}</small></span>
                <ChevronRight className="command-nav-arrow" size={14} aria-hidden="true" />
              </button>
            );
          })}
        </nav>

        <div className="command-footer">
          <span><i /> SYSTEMY OCHRONY</span>
          <b>ONLINE</b>
        </div>
      </aside>

      <section className="command-view" aria-label="Panel bieżącej sekcji">
        <header className="command-view-top">
          <div><span className="command-view-kicker">PRISON LIFE / PANEL OPERACYJNY</span><strong>ODDZIAŁ A</strong></div>
          <div className="command-time">23:48:17 <span>DESZCZ / 18°C</span></div>
        </header>

        <div className="command-view-content">
          <div className="command-view-stamp">A-47291 / NIGHT SHIFT <b>●</b></div>
          <div className="command-hero-copy">
            <span className="command-eyebrow">POTWIERDZONA SEKCJA</span>
            <h1>{activeSection}</h1>
            <p>{activeSection === "TWOJA POSTAĆ" ? "Wybierz następny ruch, zanim zrobi to ktoś za ciebie." : `Kanał ${activeSection.toLowerCase()} jest gotowy. Dane operacyjne są aktualne.`}</p>
            <button type="button" className="command-primary-action" onClick={() => setActiveSection("TWOJA POSTAĆ")}>
              WRÓĆ DO PROFILU <ChevronRight size={15} aria-hidden="true" />
            </button>
          </div>

          <div className="command-telemetry">
            <div className="command-telemetry-head"><span>TELEMETRIA ODDZIAŁU</span><b>LIVE</b></div>
            <div className="command-telemetry-rule" />
            <div><Radio size={16} aria-hidden="true" /><span>RUCH NA PLACU</span><b>WYSOKI</b></div>
            <div><Siren size={16} aria-hidden="true" /><span>ALARMY</span><b>00</b></div>
            <div><Shield size={16} aria-hidden="true" /><span>WARTA</span><b>AKTYWNA</b></div>
          </div>
        </div>

        <footer className="command-view-bottom">
          <span>OSTATNI RAPORT <b>00:12 TEMU</b></span>
          <span>CELA 04 <i /> ZAMKNIĘTA</span>
          <span>ENERGIA <b>75 / 100</b></span>
        </footer>
      </section>
    </main>
  );
}
