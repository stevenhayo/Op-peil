import { recenteBesluiten } from "@/lib/tk";
import BesluitItem from "@/components/BesluitItem";
import KamerFilter from "./KamerFilter";

export const revalidate = 3600;

export default async function Kamer() {
  const { besluiten, ok } = await recenteBesluiten(14);
  const tel = (u: string) => besluiten.filter((b) => b.uitslag === u).length;
  const tegels = [
    { n: tel("aangenomen"), label: "aangenomen", kleur: "var(--mint)" },
    { n: tel("verworpen"), label: "verworpen", kleur: "var(--koraal)" },
    { n: besluiten.filter((b) => b.algemeneStemmen && b.uitslag === "aangenomen").length, label: "met algemene stemmen", kleur: "var(--geel)" },
  ];

  return (
    <main className="inhoud" style={{ background: "var(--inkt)", color: "#fff", minHeight: "100dvh" }}>
      <header>
        <p className="label" style={{ color: "var(--mint)" }}>ALLES WAT ER GEBEURT, VOOR IEDEREEN GELIJK</p>
        <h1 className="kop">De Kamer</h1>
      </header>
      {!ok && <p>De Kamer-data is nu niet bereikbaar. Probeer het later opnieuw.</p>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
        {tegels.map((t) => (
          <div key={t.label} style={{ background: t.kleur, color: "var(--inkt)", borderRadius: 18, padding: "14px 12px" }}>
            <div className="display" style={{ fontSize: 30, fontWeight: 700 }}>{t.n}</div>
            <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.25 }}>{t.label}</div>
          </div>
        ))}
      </div>
      <KamerFilter>
        {besluiten.map((b) => (
          <div key={b.id} data-soort={b.soort}>
            <BesluitItem b={b} toonPetten={false} />
          </div>
        ))}
      </KamerFilter>
    </main>
  );
}
