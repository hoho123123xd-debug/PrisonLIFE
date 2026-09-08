import { useState } from 'react';
import { Plus } from 'lucide-react';
import './_group.css';
import './TacticalStrip.css';

type Notice = 'cash' | 'points' | null;

export function TacticalStrip() {
  const [notice, setNotice] = useState<Notice>(null);

  return (
    <main className="tactical-strip-shell">
      <section className="ts-strip" aria-label="Prison Life HUD">
        <img
          className="ts-frame"
          src="/__mockup/images/tactical-strip-frame.png"
          alt=""
          aria-hidden="true"
        />

        <div className="ts-content">
          <section className="ts-identity" aria-label="Profil więźnia">
            <img className="ts-photo" src="/__mockup/images/tactical-strip-avatar.png" alt="Avatar Kosa" />
            <div className="ts-id-copy">
              <span className="ts-kicker">OSADZONY</span>
              <h1 className="ts-name">KOSA</h1>
            </div>
          </section>

          <section className="ts-resource-cluster" aria-label="Zasoby więźnia">
            <div className="ts-resource">
              <span className="ts-resource-label">GOTÓWKA</span>
              <strong className="ts-resource-value">100 250 <span>$</span></strong>
              <button
                className="ts-resource-button"
                type="button"
                aria-label="Dodaj gotówkę"
                onClick={() => setNotice('cash')}
              >
                <Plus aria-hidden="true" size={14} />
              </button>
            </div>
            <div className="ts-resource">
              <span className="ts-resource-label">PUNKTY</span>
              <strong className="ts-resource-value">1003</strong>
              <button
                className="ts-resource-button"
                type="button"
                aria-label="Kup punkty"
                onClick={() => setNotice('points')}
              >
                <Plus aria-hidden="true" size={14} />
              </button>
            </div>
          </section>
        </div>
      </section>

      <div className="ts-status" role="status" aria-live="polite" hidden={notice === null}>
        {notice === 'cash' && <>DOŁADOWANIE GOTÓWKI — akcja gotowa do podłączenia.</>}
        {notice === 'points' && <>ZAKUP PUNKTÓW — akcja gotowa do podłączenia.</>}
      </div>
    </main>
  );
}