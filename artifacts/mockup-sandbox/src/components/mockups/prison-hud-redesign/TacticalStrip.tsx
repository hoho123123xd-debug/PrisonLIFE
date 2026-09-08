import { useState } from 'react';
import { Bell, LogOut, Settings2 } from 'lucide-react';
import './_group.css';
import './TacticalStrip.css';

const base = '/__mockup/images/prison-hud';

type Notice = 'messages' | 'settings' | 'logout' | null;

function ResourceButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      className="ts-resource-button"
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      +
    </button>
  );
}

export function TacticalStrip() {
  const [notice, setNotice] = useState<Notice>(null);

  const announce = (next: Notice) => {
    setNotice((current) => (current === next ? null : next));
  };

  return (
    <main className="tactical-strip-shell">
      <div className="ts-stage">
        <div className="ts-eyebrow">
          <span><strong>PRISON LIFE</strong> // SECURE TELEMETRY</span>
          <span>SYS 07:42:19 <b aria-hidden="true">●</b></span>
        </div>

        <header className="ts-strip" aria-label="Prison Life tactical player HUD">
          <section className="ts-identity" aria-label="Prisoner profile and experience">
            <img className="ts-photo" src={`${base}/avatar-kosa.png`} alt="KOSA prisoner portrait" />
            <div className="ts-id-copy">
              <span className="ts-kicker">PRISONER // ACTIVE</span>
              <h1 className="ts-name ts-condensed">KOSA</h1>
              <div className="ts-rank">
                <span>LEVEL <b>12</b></span>
                <span>STATUS: HOLD</span>
              </div>
              <div className="ts-xp" aria-label="Experience 2450 out of 4200">
                <div className="ts-xp-line"><span>XP PROGRESS</span><b>2450 / 4200</b></div>
                <div className="ts-xp-track" role="progressbar" aria-valuenow={2450} aria-valuemin={0} aria-valuemax={4200}><i /></div>
              </div>
            </div>
          </section>

          <section className="ts-resource-cluster" aria-label="Prisoner resources">
            <div className="ts-resource">
              <span className="ts-resource-label">CASH</span>
              <strong className="ts-resource-value">100 250<span className="ts-resource-unit">$</span></strong>
              <span className="ts-resource-sub">LIQUID FUNDS</span>
              <ResourceButton label="Add cash" onClick={() => announce('settings')} />
            </div>
            <div className="ts-resource">
              <span className="ts-resource-label">POINTS</span>
              <strong className="ts-resource-value">1003</strong>
              <span className="ts-resource-sub">LEVERAGE UNITS</span>
              <ResourceButton label="Acquire points" onClick={() => announce('settings')} />
            </div>
            <div className="ts-resource">
              <span className="ts-resource-label">ENERGY</span>
              <strong className="ts-resource-value">100<span className="ts-resource-unit">/ 100</span></strong>
              <div className="ts-energy-line">
                <div className="ts-energy-track" role="progressbar" aria-label="Energy" aria-valuenow={100} aria-valuemin={0} aria-valuemax={100}><i /></div>
                <span className="ts-energy-value">FULL</span>
              </div>
            </div>
          </section>

          <nav className="ts-actions" aria-label="Secure controls">
            <div className="ts-location">
              <small>CURRENT LOCATION</small>
              <strong className="ts-condensed">BLOK C</strong>
            </div>
            <button className="ts-action" type="button" aria-label="Open messages, 3 unread" onClick={() => announce('messages')}>
              <Bell aria-hidden="true" />
              <span>Messages</span>
              <span className="ts-badge" aria-label="3 unread messages">3</span>
            </button>
            <button className="ts-action" type="button" aria-label="Open settings" onClick={() => announce('settings')}>
              <Settings2 aria-hidden="true" />
              <span>Settings</span>
            </button>
            <button className="ts-logout" type="button" aria-label="Log out" onClick={() => announce('logout')}>
              <LogOut aria-hidden="true" size={12} /> Log out
            </button>
          </nav>
        </header>

        <div className="ts-status" role="status" aria-live="polite" hidden={notice === null}>
          {notice === 'messages' && <><strong>INBOX OPEN</strong> — 3 unread messages queued.</>}
          {notice === 'settings' && <><strong>CONTROL READY</strong> — secure settings access requested.</>}
          {notice === 'logout' && <><strong>SESSION LOCKED</strong> — logout request staged.</>}
        </div>
        <div className="ts-corner-readout">
          <span>TACTICAL STRIP / C-12</span>
          <span>ALL SYSTEMS NOMINAL</span>
        </div>
      </div>
    </main>
  );
}