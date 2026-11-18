"use client";

import { Children, isValidElement, useEffect, useState, type ReactNode, type ReactElement } from "react";
import { PETTEN, pettenVoor, OPSLAG_PETTEN, type PetId } from "@/lib/petten";

const SOORTEN = [
  { id: "alles", label: "Alles", soorten: null },
  { id: "wetten", label: "Wetten", soorten: ["Wetgeving", "Initiatiefwetgeving"] },
  { id: "moties", label: "Moties", soorten: ["Motie"] },
  { id: "amendementen", label: "Amendementen", soorten: ["Amendement"] },
];

type Props = { "data-soort": string; "data-titel": string; "data-uitslag": string };

export default function KamerFilter({ children }: { children: ReactNode }) {
  const [soort, setSoort] = useState("alles");
  const [petten, setPetten] = useState<PetId[]>([]);

  // Standaard staan de petten uit je profiel aan; aanpassen kan, maar bij een volgend bezoek staan ze weer zo.
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(OPSLAG_PETTEN) || "null");
      if (Array.isArray(s)) setPetten(s.filter((x: string) => PETTEN.some((p) => p.id === x)));
    } catch {}
  }, []);
  const f = SOORTEN.find((x) => x.id === soort)!;

  const items = Children.toArray(children).filter((c): c is ReactElement<Props> => isValidElement(c));
  const zichtbaar = items.filter((c) => {
    const okSoort = !f.soorten || f.soorten.includes(c.props["data-soort"]);
    const okPet = petten.length === 0 || pettenVoor(c.props["data-titel"] || "").some((p) => petten.includes(p));
    return okSoort && okPet;
  });
  const tel = (u: string) => zichtbaar.filter((c) => c.props["data-uitslag"] === u).length;
  const wisselPet = (id: PetId) => setPetten(petten.includes(id) ? petten.filter((x) => x !== id) : [...petten, id]);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="label" style={{ color: "var(--geel)" }}>JOUW PETTEN</span>
          {petten.length > 0 && <button onClick={() => setPetten([])} style={{ background: "none", border: 0, color: "#B7BCC8", fontSize: 13, fontWeight: 700, minHeight: 36 }}>Alles tonen</button>}
        </div>
        <div className="chips">
          {PETTEN.map((p) => {
            const aan = petten.includes(p.id);
            return (
              <button key={p.id} className="chip" aria-pressed={aan} onClick={() => wisselPet(p.id)}
                style={aan ? { background: p.kleur, borderColor: p.kleur, color: "var(--inkt)" } : { background: "transparent", color: "#fff", borderColor: "#3a3e4a" }}>
                {p.naam}
              </button>
            );
          })}
        </div>
      </div>

      <div className="chips">
        {SOORTEN.map((x) => (
          <button key={x.id} className="chip" aria-pressed={x.id === soort} onClick={() => setSoort(x.id)}
            style={x.id === soort ? { background: "#fff", color: "var(--inkt)", borderColor: "#fff" } : { background: "transparent", color: "#fff", borderColor: "#3a3e4a" }}>
            {x.label}
          </button>
        ))}
      </div>

      {petten.length > 0 && (
        <div className="kaart" style={{ background: "var(--inkt-2)", flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
          <span style={{ fontWeight: 800 }}>In dit gebied:</span>
          <span><b style={{ color: "var(--mint)" }}>{tel("aangenomen")}</b> aangenomen</span>
          <span><b style={{ color: "var(--koraal)" }}>{tel("verworpen")}</b> verworpen</span>
          <span><b style={{ color: "var(--geel)" }}>{tel("aangehouden")}</b> aangehouden</span>
        </div>
      )}

      <section className="kaart kaart-wit" style={{ color: "var(--inkt)" }}>
        {zichtbaar.length ? zichtbaar : <p className="leeg">Niets gevonden met deze petten in de afgelopen twee weken.</p>}
      </section>
      <p className="voetnoot" style={{ color: "#9095A3" }}>Petten worden nu nog op trefwoorden gekoppeld. Dat wordt later slimmer.</p>
    </>
  );
}
