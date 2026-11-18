import { recenteBesluiten } from "@/lib/tk";
import WeekLijst from "./WeekLijst";
import BesluitItem from "@/components/BesluitItem";

export const revalidate = 3600;

export default async function Week() {
  const { besluiten, ok } = await recenteBesluiten(14);
  return (
    <main className="inhoud" style={{ background: "var(--blauw)", color: "#fff", minHeight: "100dvh" }}>
      <header>
        <p className="subkop" style={{ color: "#DCE3FF" }}>Afgelopen twee weken</p>
        <h1 className="kop">Wat raakt jou?</h1>
      </header>
      {!ok && <p>De Kamer-data is nu niet bereikbaar. Probeer het later opnieuw.</p>}
      <WeekLijst>
        {besluiten.map((b) => (
          <div key={b.id} data-titel={b.titel}>
            <BesluitItem b={b} />
          </div>
        ))}
      </WeekLijst>
    </main>
  );
}
