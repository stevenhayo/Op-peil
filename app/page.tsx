import Link from "next/link";
import { recenteBesluiten, wetVanDeWeek } from "@/lib/tk";

export const revalidate = 3600;

export default async function Home() {
  const { besluiten, ok } = await recenteBesluiten(14);
  const aangenomen = besluiten.filter((b) => b.uitslag === "aangenomen").length;
  const unaniem = besluiten.filter((b) => b.algemeneStemmen && b.uitslag === "aangenomen").length;
  const wet = wetVanDeWeek(besluiten);

  return (
    <main className="inhoud">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="display" style={{ fontWeight: 700, fontSize: 20 }}>Op Peil</span>
        <Link href="/profiel" aria-label="Jouw profiel" style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--inkt)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFD23F" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>
        </Link>
      </header>

      <div>
        <p className="subkop">Afgelopen twee weken</p>
        {ok ? (
          <h1 className="kop">
            {aangenomen} voorstellen aangenomen.
            <br />
            {unaniem} daarvan door iedereen.
          </h1>
        ) : (
          <h1 className="kop">De Kamer is even niet bereikbaar.</h1>
        )}
      </div>

      <Link href="/week" className="grote-kaart">
        <span className="bol" style={{ width: 150, height: 150, background: "var(--koraal)", right: -40, top: -50 }} />
        <span className="label" style={{ position: "relative" }}>JOUW WEEK</span>
        <span style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <span className="display" style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.1 }}>Wat raakt jou?</span>
          <span style={{ width: 48, height: 48, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2346D1" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </span>
        </span>
      </Link>

      <div className="tegels">
        <Link href={wet ? `/besluit/${wet.id}` : "/kamer"} className="tegel" style={{ background: "var(--koraal)" }}>
          <span className="label">WET VAN DE WEEK</span>
          <span className="display">{wet ? wet.titel.slice(0, 60) + (wet.titel.length > 60 ? "…" : "") : "Nog geen wet deze week"}</span>
        </Link>
        <Link href="/kamer" className="tegel" style={{ background: "var(--geel)" }}>
          <span className="label">DE KAMER</span>
          <span className="display">Alle {besluiten.length} besluiten</span>
        </Link>
      </div>

      <Link href="/profiel" className="kaart kaart-rand" style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontWeight: 700 }}>Wat is jouw politieke profiel?</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#12141A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </Link>

      <p className="voetnoot">
        Live data uit het <a href="https://opendata.tweedekamer.nl" style={{ textDecoration: "underline" }}>Open Data Portaal van de Tweede Kamer</a>. Testversie.
      </p>
    </main>
  );
}
