import './_group.css';

const base = '/__mockup/images/prison-hud';

export function Current() {
  return (
    <div className="hud-mockup-root">
      <header className="hud-baseline hud-continuous" aria-label="Prison Life — pasek gracza">
        <div className="hud-brand">
          <img src={`${base}/prison-life-wordmark.png`} alt="Prison Life" />
        </div>

        <section className="hud-player" aria-label="Profil gracza">
          <div className="hud-avatar">
            <img src={`${base}/avatar-kosa.png`} alt="F1ay" />
          </div>
          <div className="hud-player-copy">
            <div className="hud-player-top">
              <strong className="hud-player-name">F1ay</strong>
              <span className="hud-player-rank">♛</span>
            </div>
            <div className="hud-player-meta">
              <span>RANGA <b>18</b></span>
              <span>BANG SZCZUR</span>
            </div>
            <div className="hud-xp-row">
              <span>XP</span>
              <div className="hud-xp-track"><i /></div>
              <small>2450 / 4200</small>
            </div>
          </div>
        </section>

        <section className="hud-resources" aria-label="Zasoby">
          <div className="hud-resource hud-resource-money">
            <span className="hud-resource-icon hud-resource-icon-money" aria-hidden="true" />
            <span className="hud-resource-label">GOTÓWKA</span>
            <strong className="hud-resource-value">100 250 $</strong>
            <button className="hud-resource-plus" aria-label="Dodaj gotówkę">+</button>
          </div>
          <div className="hud-resource hud-resource-points">
            <span className="hud-resource-icon hud-resource-icon-points" aria-hidden="true" />
            <span className="hud-resource-label">PUNKTY</span>
            <strong className="hud-resource-value">1003</strong>
            <button className="hud-resource-plus" aria-label="Kup punkty">+</button>
          </div>
          <div className="hud-resource hud-resource-energy">
            <span className="hud-resource-icon hud-resource-icon-energy" aria-hidden="true" />
            <span className="hud-resource-label">ENERGIA</span>
            <strong className="hud-resource-value">100 / 100</strong>
            <div className="hud-energy-meter"><i /></div>
            <button className="hud-resource-plus" aria-label="Odnów energię">+</button>
          </div>
        </section>

        <nav className="hud-actions" aria-label="Akcje konta">
          <span className="hud-location">BLOK<br />C</span>
          <button className="hud-icon" style={{ backgroundImage: `url(${base}/hud-mail.png)` }} aria-label="Wiadomości">
            <span className="hud-badge">3</span>
          </button>
          <button className="hud-icon" style={{ backgroundImage: `url(${base}/hud-settings.png)` }} aria-label="Ustawienia" />
          <button className="hud-logout" aria-label="Wyloguj">↗</button>
        </nav>
      </header>
    </div>
  );
}