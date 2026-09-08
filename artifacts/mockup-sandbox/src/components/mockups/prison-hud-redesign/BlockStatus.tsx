import { useState, type CSSProperties } from "react";
import {
  ChevronDown,
  CircleUserRound,
  Crosshair,
  Gauge,
  LogOut,
  MapPin,
  MessageSquareText,
  Settings,
  ShieldCheck,
  Zap,
} from "lucide-react";
import "./_group.css";

type Resource = {
  label: string;
  value: string;
  detail: string;
  color: string;
  percent: number;
  icon: typeof Zap;
};

const resources: Resource[] = [
  { label: "ENERGY", value: "100 / 100", detail: "READY", color: "#efb454", percent: 100, icon: Zap },
  { label: "CASH", value: "100 250 $", detail: "ON HAND", color: "#94c0b5", percent: 72, icon: Gauge },
  { label: "POINTS", value: "1 003", detail: "REPUTATION", color: "#c7a08a", percent: 46, icon: Crosshair },
];

function ResourceCell({ resource }: { resource: Resource }) {
  const Icon = resource.icon;
  return (
    <article
      className="block-resource min-w-0 rounded-[3px] px-4 py-3"
      style={{ "--resource-color": resource.color } as CSSProperties}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <Icon aria-hidden="true" size={15} strokeWidth={1.8} style={{ color: resource.color }} />
          <span className="block-mono truncate text-[10px] font-bold tracking-[0.16em] text-[#8c9698]">{resource.label}</span>
        </div>
        <span className="block-mono text-[9px] tracking-[0.12em]" style={{ color: resource.color }}>{resource.detail}</span>
      </div>
      <div className="mt-2 flex items-end justify-between gap-3">
        <strong className="block-mono text-[17px] font-bold tracking-[-0.04em] text-[#e3ded0]">{resource.value}</strong>
        <span className="block-mono pb-0.5 text-[10px] text-[#778184]">{resource.percent}%</span>
      </div>
      <div className="block-meter mt-2" aria-label={`${resource.label} ${resource.percent}% full`}>
        <span style={{ width: `${resource.percent}%`, "--meter-color": resource.color } as CSSProperties} />
      </div>
    </article>
  );
}

function StatusLamp({ label, value, tone = "green" }: { label: string; value: string; tone?: "green" | "amber" }) {
  const color = tone === "amber" ? "#efb454" : "#94c0b5";
  return (
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }} />
      <span className="block-mono text-[9px] tracking-[0.14em] text-[#778184]">{label}</span>
      <span className="block-mono text-[9px] font-bold tracking-[0.12em]" style={{ color }}>{value}</span>
    </div>
  );
}

export function BlockStatus() {
  const [isMessageTrayOpen, setMessageTrayOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isLogoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  return (
    <main className="block-status-root relative overflow-hidden p-3 sm:p-5 md:p-8">
      <section className="relative mx-auto w-full max-w-[1220px] overflow-hidden border border-[#4c575b] bg-[#1b2226]/95 shadow-[0_18px_48px_rgba(3,5,6,.55)]">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-[#4c575b] bg-[#222a2e] px-4 py-2 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="block-mono text-[10px] font-bold tracking-[0.2em] text-[#efb454]">BLOCK CONTROL</span>
            <span className="h-3 w-px bg-[#657076]" />
            <span className="block-mono text-[10px] tracking-[0.14em] text-[#899396]">LIVE TELEMETRY / 04:17:32</span>
          </div>
          <div className="flex items-center gap-4">
            <StatusLamp label="CAMERAS" value="ONLINE" />
            <StatusLamp label="LOCKDOWN" value="CLEAR" tone="amber" />
          </div>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1.15fr_1fr]">
          <div className="relative border-b border-[#4c575b] p-5 sm:p-6 lg:border-b-0 lg:border-r lg:p-7">
            <div className="absolute right-5 top-5 block-mono text-[9px] tracking-[0.18em] text-[#687478] sm:right-6 sm:top-6">SECTOR 03 / NORTH WING</div>
            <div className="flex items-start gap-4 pt-4 sm:gap-6 sm:pt-2">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center border border-[#c95d2c]/55 bg-[#c95d2c]/10 text-[#efb454] shadow-[inset_0_0_0_5px_rgba(201,93,44,.05)] sm:h-20 sm:w-20">
                <MapPin aria-hidden="true" size={31} strokeWidth={1.4} />
              </div>
              <div className="min-w-0">
                <p className="block-mono mb-1 text-[10px] font-bold tracking-[0.22em] text-[#c95d2c]">CURRENT LOCATION</p>
                <h1 className="text-[clamp(2.5rem,6vw,4.6rem)] font-bold leading-[.85] tracking-[-0.08em] text-[#e2ddcf]">BLOK C</h1>
                <p className="mt-3 max-w-[330px] text-[12px] leading-relaxed text-[#9da5a3]">North yard access is open. Movement is being logged against your block record.</p>
              </div>
            </div>
            <div className="mt-6 grid max-w-[470px] grid-cols-2 gap-x-6 gap-y-2 border-t border-[#4c575b] pt-4 sm:grid-cols-3">
              <StatusLamp label="LIGHTING" value="DIM" tone="amber" />
              <StatusLamp label="YARD" value="OPEN" />
              <StatusLamp label="WATCH" value="ACTIVE" />
            </div>
          </div>

          <div className="p-5 sm:p-6 lg:p-7">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#efb454]/60 bg-[#efb454]/10 text-[#efb454]">
                  <CircleUserRound aria-hidden="true" size={25} strokeWidth={1.4} />
                </div>
                <div className="min-w-0">
                  <p className="block-mono text-[10px] tracking-[0.2em] text-[#778184]">PRISONER RECORD</p>
                  <p className="truncate text-[22px] font-bold tracking-[-0.04em] text-[#e3ded0]">KOSA</p>
                </div>
              </div>
              <div className="text-right">
                <p className="block-mono text-[9px] tracking-[0.16em] text-[#778184]">RANK</p>
                <p className="block-mono mt-1 text-[13px] font-bold text-[#efb454]">LEVEL 12</p>
              </div>
            </div>
            <div className="mt-5">
              <div className="flex items-center justify-between gap-3">
                <span className="block-mono text-[10px] tracking-[0.14em] text-[#8c9698]">EXPERIENCE LOAD</span>
                <span className="block-mono text-[10px] font-bold text-[#d6d0c2]">2 450 <span className="text-[#707a7d]">/ 4 200 XP</span></span>
              </div>
              <div className="block-meter mt-2" aria-label="2450 of 4200 experience points">
                <span style={{ width: "58.3%", "--meter-color": "#efb454" } as CSSProperties} />
              </div>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {resources.map((resource) => <ResourceCell key={resource.label} resource={resource} />)}
            </div>
          </div>
        </div>

        <footer className="flex flex-col gap-3 border-t border-[#4c575b] bg-[#151b1e] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-2 text-[#778184]">
            <ShieldCheck aria-hidden="true" size={15} strokeWidth={1.7} className="text-[#94c0b5]" />
            <span className="block-mono text-[9px] tracking-[0.13em]">IDENTITY VERIFIED / SHIFT A</span>
          </div>
          <div className="relative flex flex-wrap gap-2">
            <button type="button" className="block-action inline-flex min-h-9 items-center gap-2 border border-[#4c575b] bg-[#222a2e] px-3 text-[#c9c4b6]" aria-label="Open messages, 3 unread" aria-expanded={isMessageTrayOpen} onClick={() => setMessageTrayOpen((open) => !open)}>
              <MessageSquareText aria-hidden="true" size={15} />
              <span className="block-mono text-[10px] font-bold tracking-[0.1em]">MESSAGES</span>
              <span className="block-mono flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e45e42] px-1 text-[10px] font-bold text-[#171c1f]">3</span>
            </button>
            <button type="button" className="block-action inline-flex min-h-9 items-center gap-2 border border-[#4c575b] bg-[#222a2e] px-3 text-[#c9c4b6]" aria-label="Open settings" aria-expanded={isSettingsOpen} onClick={() => setSettingsOpen((open) => !open)}>
              <Settings aria-hidden="true" size={15} />
              <span className="block-mono text-[10px] font-bold tracking-[0.1em]">SETTINGS</span>
            </button>
            <button type="button" className="block-action inline-flex min-h-9 items-center gap-2 border border-[#704438] bg-[#2c211f] px-3 text-[#e0aa97]" aria-label="Log out of Prison Life" onClick={() => setLogoutConfirmOpen(true)}>
              <LogOut aria-hidden="true" size={15} />
              <span className="block-mono text-[10px] font-bold tracking-[0.1em]">LOG OUT</span>
            </button>

            {isMessageTrayOpen && (
              <div className="absolute bottom-12 right-0 z-10 w-[min(300px,calc(100vw-2rem))] border border-[#697478] bg-[#222a2e] p-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#4c575b] pb-2">
                  <span className="block-mono text-[10px] font-bold tracking-[0.16em] text-[#efb454]">INCOMING MESSAGES</span>
                  <button type="button" className="block-action p-1 text-[#8c9698]" aria-label="Close messages" onClick={() => setMessageTrayOpen(false)}><ChevronDown aria-hidden="true" size={15} /></button>
                </div>
                <p className="mt-3 text-[12px] leading-relaxed text-[#c9c4b6]">3 unread dispatches waiting in your cell inbox.</p>
              </div>
            )}
            {isSettingsOpen && (
              <div className="absolute bottom-12 right-0 z-10 w-[min(280px,calc(100vw-2rem))] border border-[#697478] bg-[#222a2e] p-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#4c575b] pb-2">
                  <span className="block-mono text-[10px] font-bold tracking-[0.16em] text-[#efb454]">HUD SETTINGS</span>
                  <button type="button" className="block-action p-1 text-[#8c9698]" aria-label="Close settings" onClick={() => setSettingsOpen(false)}><ChevronDown aria-hidden="true" size={15} /></button>
                </div>
                <p className="mt-3 text-[12px] leading-relaxed text-[#c9c4b6]">Telemetry is pinned to compact view for this shift.</p>
              </div>
            )}
            {isLogoutConfirmOpen && (
              <div className="absolute bottom-12 right-0 z-20 w-[min(320px,calc(100vw-2rem))] border border-[#c95d2c] bg-[#2b211f] p-4 shadow-xl">
                <p className="block-mono text-[10px] font-bold tracking-[0.14em] text-[#efb454]">END CURRENT SHIFT?</p>
                <p className="mt-2 text-[12px] leading-relaxed text-[#d1c5b8]">Your block record will be saved before leaving.</p>
                <div className="mt-4 flex justify-end gap-2">
                  <button type="button" className="block-action border border-[#697478] px-3 py-2 block-mono text-[10px] tracking-[0.1em] text-[#c9c4b6]" onClick={() => setLogoutConfirmOpen(false)}>CANCEL</button>
                  <button type="button" className="block-action border border-[#c95d2c] bg-[#c95d2c] px-3 py-2 block-mono text-[10px] font-bold tracking-[0.1em] text-[#171c1f]" onClick={() => setLogoutConfirmOpen(false)}>CONFIRM</button>
                </div>
              </div>
            )}
          </div>
        </footer>
      </section>
    </main>
  );
}