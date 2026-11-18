"use client";

import { Children, isValidElement, useState, type ReactNode, type ReactElement } from "react";

const FILTERS = [
  { id: "alles", label: "Alles", soorten: null },
  { id: "wetten", label: "Wetten", soorten: ["Wetgeving", "Initiatiefwetgeving"] },
  { id: "moties", label: "Moties", soorten: ["Motie"] },
  { id: "amendementen", label: "Amendementen", soorten: ["Amendement"] },
];

export default function KamerFilter({ children }: { children: ReactNode }) {
  const [actief, setActief] = useState("alles");
  const f = FILTERS.find((x) => x.id === actief)!;
  const items = Children.toArray(children).filter((c): c is ReactElement<{ "data-soort": string }> => isValidElement(c));
  const zichtbaar = f.soorten ? items.filter((c) => f.soorten!.includes(c.props["data-soort"])) : items;

  return (
    <>
      <div className="chips">
        {FILTERS.map((x) => (
          <button
            key={x.id}
            className="chip"
            aria-pressed={x.id === actief}
            onClick={() => setActief(x.id)}
            style={x.id === actief ? { background: "var(--geel)", color: "var(--inkt)", borderColor: "var(--geel)" } : { background: "transparent", color: "#fff", borderColor: "#3a3e4a" }}
          >
            {x.label}
          </button>
        ))}
      </div>
      <section className="kaart kaart-wit" style={{ color: "var(--inkt)" }}>
        {zichtbaar.length ? zichtbaar : <p className="leeg">Niets gevonden in deze categorie.</p>}
      </section>
    </>
  );
}
