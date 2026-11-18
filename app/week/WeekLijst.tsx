"use client";

import { Children, isValidElement, useEffect, useState, type ReactNode, type ReactElement } from "react";
import { PETTEN, pettenVoor, OPSLAG_PETTEN, type PetId } from "@/lib/petten";

export default function WeekLijst({ children }: { children: ReactNode }) {
  const [gekozen, setGekozen] = useState<PetId[]>(["student", "ondernemer"]);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(OPSLAG_PETTEN) || "null");
      if (Array.isArray(s)) setGekozen(s);
    } catch {}
  }, []);

  const wissel = (id: PetId) => {
    const nieuw = gekozen.includes(id) ? gekozen.filter((x) => x !== id) : [...gekozen, id];
    setGekozen(nieuw);
    try {
      localStorage.setItem(OPSLAG_PETTEN, JSON.stringify(nieuw));
    } catch {}
  };

  const items = Children.toArray(children).filter((c): c is ReactElement<{ "data-titel": string }> => isValidElement(c));
  const zichtbaar = items.filter((c) => pettenVoor(c.props["data-titel"] || "").some((p) => gekozen.includes(p)));

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span className="label">KIES JE PETTEN</span>
        <div className="chips">
          {PETTEN.map((p) => {
            const aan = gekozen.includes(p.id);
            return (
              <button
                key={p.id}
                className="chip"
                aria-pressed={aan}
                onClick={() => wissel(p.id)}
                style={aan ? { background: p.kleur, color: "var(--inkt)", borderColor: p.kleur } : { background: "transparent", color: "#fff", borderColor: "rgba(255,255,255,.6)" }}
              >
                {p.naam}
              </button>
            );
          })}
        </div>
      </div>

      <section className="kaart kaart-wit" style={{ color: "var(--inkt)" }}>
        <h2 style={{ margin: 0, fontSize: 20 }}>Voor jou ({zichtbaar.length})</h2>
        {gekozen.length === 0 ? (
          <p className="leeg">Kies hierboven minstens één pet.</p>
        ) : zichtbaar.length === 0 ? (
          <p className="leeg">Niets voor deze petten in de afgelopen twee weken. Ook dat is nieuws.</p>
        ) : (
          zichtbaar
        )}
      </section>
      <p className="voetnoot" style={{ color: "#DCE3FF" }}>
        Petten worden nu nog gekoppeld op trefwoorden. Dat wordt later slimmer.
      </p>
    </>
  );
}
