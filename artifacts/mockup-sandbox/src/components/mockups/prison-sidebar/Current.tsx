import "./Current.css";

const base = "/__mockup/images/prison-sidebar";

const navigation = [
  ["TWOJA POSTAĆ", "icon-cela.png"],
  ["CELA", "icon-cela.png"],
  ["TRENING", "icon-trening.png"],
  ["WALKA", "icon-walka.png"],
  ["STOŁÓWKA", "icon-stolowka.png"],
  ["KANTYNA", "icon-sklep.png"],
  ["CZARNY RYNEK", "icon-czarny-rynek.png"],
  ["ZLECENIA", "icon-zlecenia.png"],
  ["GANG", "icon-gang.png"],
  ["SZPITAL", "icon-szpital.png"],
  ["RANKING", "icon-ranking.png"],
] as const;

export function Current() {
  return (
    <main className="current-sidebar-canvas">
      <aside className="current-sidebar" aria-label="Nawigacja gry">
        <div className="current-sidebar-heading">NAWIGACJA</div>
        <nav>
          {navigation.map(([label, icon], index) => (
            <button
              key={label}
              type="button"
              className={`current-sidebar-item ${index === 0 ? "is-active" : ""}`}
              aria-current={index === 0 ? "page" : undefined}
            >
              <img src={`${base}/${icon}`} alt="" aria-hidden="true" />
              <i aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </main>
  );
}