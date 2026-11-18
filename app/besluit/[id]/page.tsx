import Link from "next/link";
import { notFound } from "next/navigation";
import { besluitOpId, datumKort } from "@/lib/tk";
import { PETTEN, pettenVoor } from "@/lib/petten";

export const revalidate = 3600;

export default async function BesluitPagina({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const b = await besluitOpId(id);
  if (!b) notFound();

  const voor = b.stemmen.filter((s) => s.soort === "Voor").sort((a, c) => c.zetels - a.zetels);
  const tegen = b.stemmen.filter((s) => s.soort === "Tegen").sort((a, c) => c.zetels - a.zetels);
  const petten = pettenVoor(b.titel);
  const kleur = b.uitslag === "aangenomen" ? "var(--mint)" : b.uitslag === "verworpen" ? "var(--koraal)" : "var(--geel)";
  const zoekUrl = b.nummer ? `https://www.tweedekamer.nl/zoeken?qry=${encodeURIComponent(b.nummer)}` : "https://www.tweedekamer.nl/kamerstukken/stemmingsuitslagen";

  return (
    <main style={{ minHeight: "100dvh", paddingBottom: 110 }}>
      <div style={{ background: kleur, padding: "calc(18px + env(safe-area-inset-top)) 20px 28px", display: "flex", flexDirection: "column", gap: 12, position: "relative", overflow: "hidden" }}>
        <span className="bol" style={{ width: 160, height: 160, background: "rgba(255,255,255,.35)", right: -50, bottom: -70 }} />
        <Link href="/kamer" style={{ fontWeight: 800, fontSize: 14, minHeight: 44, display: "flex", alignItems: "center", gap: 6, position: "relative" }}>
          ← De Kamer
        </Link>
        <span className="pil" style={{ background: "var(--inkt)", color: "var(--geel)", alignSelf: "flex-start", position: "relative" }}>
          {b.soort.toUpperCase()} · {datumKort(b.datum)}
        </span>
        <h1 className="kop" style={{ fontSize: 30, position: "relative" }}>{b.titel}</h1>
        <span style={{ fontSize: 15, fontWeight: 700, position: "relative" }}>
          {b.uitslag === "overig" ? b.besluitTekst : b.uitslag.charAt(0).toUpperCase() + b.uitslag.slice(1)}
          {b.voor + b.tegen > 0 && ` · ${b.voor} voor, ${b.tegen} tegen`}
        </span>
      </div>

      <div style={{ padding: "18px 18px 0", display: "flex", flexDirection: "column", gap: 14 }}>
        {b.indiener && (
          <section className="kaart kaart-wit">
            <span className="label" style={{ color: "var(--grijs)" }}>INGEDIEND DOOR</span>
            <span style={{ fontWeight: 700 }}>{b.indiener}</span>
          </section>
        )}

        {petten.length > 0 && (
          <section className="kaart" style={{ background: "var(--geel)" }}>
            <span className="label">RAAKT VOORAL</span>
            <div className="chips">
              {petten.map((pid) => {
                const p = PETTEN.find((x) => x.id === pid)!;
                return <span key={pid} className="pil" style={{ background: "#fff", fontSize: 13 }}>{p.naam}</span>;
              })}
            </div>
          </section>
        )}

        {b.stemmen.length > 0 && (
          <section className="kaart kaart-rand">
            <h2 style={{ margin: 0, fontSize: 20 }}>Zo stemden de partijen</h2>
            <div className="balk" style={{ height: 14 }}>
              <div style={{ flex: b.voor, background: "var(--lila)" }} />
              <div style={{ flex: b.tegen, background: "var(--koraal)" }} />
            </div>
            <span className="label" style={{ color: "var(--grijs)" }}>VOOR ({b.voor})</span>
            <div className="chips" style={{ gap: 6 }}>
              {voor.map((s) => <span key={s.fractie} className="pil" style={{ background: "var(--lila)", fontSize: 12 }}>{s.fractie} · {s.zetels}</span>)}
            </div>
            <span className="label" style={{ color: "var(--grijs)" }}>TEGEN ({b.tegen})</span>
            <div className="chips" style={{ gap: 6 }}>
              {tegen.length ? tegen.map((s) => <span key={s.fractie} className="pil" style={{ background: "var(--koraal)", fontSize: 12 }}>{s.fractie} · {s.zetels}</span>) : <span className="leeg">Niemand</span>}
            </div>
          </section>
        )}

        <a href={zoekUrl} className="knop knop-donker">Bekijk op tweedekamer.nl</a>
        <p className="voetnoot">Uitleg in gewone taal en de drie lagen (feiten, cijfers, standpunten) volgen in een volgende versie.</p>
      </div>
    </main>
  );
}
