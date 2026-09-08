import { useState } from "react";
import { Bell, LogOut, Settings2, ShieldCheck, X } from "lucide-react";
import "./_group.css";

const calibrationMarks = Array.from({ length: 18 }, (_, index) => index);
const energyMarks = Array.from({ length: 10 }, (_, index) => index);

function Calibration() {
  return (
    <span className="calibration" aria-hidden="true">
      {calibrationMarks.map((mark) => <i key={mark} />)}
    </span>
  );
}

function ResourceCell({ name, value, unit, accent, energy }: { name: string; value: string; unit: string; accent?: string; energy?: boolean }) {
  return (
    <div className={`resource-cell ${energy ? "energy-cell" : ""}`}>
      <span className="resource-name">{name}</span>
      <span className="resource-value" style={accent ? { color: accent } : undefined}>{value}</span>
      <span className="resource-unit">{unit}</span>
      {energy ? <span className="energy-meter" aria-label="Energy level 100 out of 100">{energyMarks.map((mark) => <i key={mark} />)}</span> : null}
    </div>
  );
}

export function InstrumentPanel() {
  const [messageOpen, setMessageOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [logoutPending, setLogoutPending] = useState(false);

  return (
    <main className="instrument-shell">
      <section className="instrument-frame" aria-label="Prison Life instrument panel">
        <div className="instrument-topline">
          <span className="topline-status"><span className="status-lamp" aria-hidden="true" /> PRISON LIFE / LIVE TELEMETRY</span>
          <span>UNIT 04 · SECURE CHANNEL</span>
        </div>

        <div className="readout-grid">
          <section className="readout" aria-labelledby="identity-label">
            <div className="readout-label" id="identity-label"><span>Command identity</span><Calibration /></div>
            <div className="profile-readout">
              <div className="avatar-plate" aria-label="KOSA profile mark">K</div>
              <div>
                <h1 className="profile-name">KOSA</h1>
                <div className="profile-meta"><span>LVL 12</span><span>ACTIVE</span></div>
              </div>
            </div>
            <div className="xp-track" role="progressbar" aria-label="Experience progress" aria-valuemin={0} aria-valuemax={4200} aria-valuenow={2450}><div className="xp-fill" /></div>
            <div className="xp-caption"><span>XP / NEXT RANK</span><span>2,450 / 4,200</span></div>
          </section>

          <section className="readout" aria-labelledby="resources-label">
            <div className="readout-label" id="resources-label"><span>Measured resources</span><Calibration /></div>
            <div className="resource-readout">
              <ResourceCell name="Cash reserve" value="100 250" unit="$ / AVAILABLE" accent="#dfe5dc" />
              <ResourceCell name="Leverage points" value="1003" unit="PTS / HOLD" accent="#f5b947" />
              <ResourceCell name="Energy" value="100 / 100" unit="CHARGE / FULL" energy />
            </div>
          </section>

          <section className="readout" aria-labelledby="utility-label">
            <div className="readout-label" id="utility-label"><span>Current sector</span><Calibration /></div>
            <div className="utility-readout">
              <div className="location-stamp">
                <span className="location-name">BLOK C</span>
                <span className="location-note"><ShieldCheck size={11} aria-hidden="true" /> controlled access</span>
              </div>
              <button className="hud-button" type="button" aria-label="Open messages, 3 unread" aria-pressed={messageOpen} onClick={() => setMessageOpen((open) => !open)}>
                <Bell aria-hidden="true" />
                <span>Messages</span>
                <span className="unread-badge">3</span>
              </button>
              <button className="hud-button" type="button" aria-label="Open settings" aria-pressed={settingsOpen} onClick={() => setSettingsOpen((open) => !open)}>
                <Settings2 aria-hidden="true" />
                <span>Settings</span>
              </button>
            </div>
          </section>
        </div>

        <div className={`action-banner ${messageOpen || settingsOpen || logoutPending ? "is-visible" : ""}`} role="status" aria-live="polite">
          {messageOpen ? <span><strong>INBOX OPEN</strong> · 3 unread messages are waiting at your terminal.</span> : null}
          {settingsOpen ? <span><strong>SETTINGS READY</strong> · Interface controls are available.</span> : null}
          {logoutPending ? <span><strong>SESSION CHECK</strong> · Confirm logout from this terminal?</span> : null}
          {messageOpen || settingsOpen ? <button className="action-dismiss" type="button" onClick={() => { setMessageOpen(false); setSettingsOpen(false); }}>DISMISS</button> : null}
        </div>

        <div className="instrument-topline" style={{ justifyContent: "flex-end", borderTop: "1px solid rgba(132, 153, 159, .22)", borderBottom: 0 }}>
          <button className="hud-button" style={{ minHeight: 28, flexDirection: "row", padding: "0 .65rem", gap: ".45rem" }} type="button" aria-label="Log out of Prison Life" onClick={() => setLogoutPending((pending) => !pending)}>
            <LogOut aria-hidden="true" style={{ width: 14, height: 14 }} />
            <span>{logoutPending ? "Cancel logout" : "Log out"}</span>
          </button>
          {logoutPending ? <button className="action-dismiss" type="button" onClick={() => setLogoutPending(false)}><X size={13} aria-hidden="true" /> ABORT</button> : null}
        </div>
      </section>
    </main>
  );
}