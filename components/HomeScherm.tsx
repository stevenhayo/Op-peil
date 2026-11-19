"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { OPSLAG_PROFIEL, type Profiel } from "@/lib/dilemmas";
import { PETTEN, pettenVoor, OPSLAG_PETTEN, type PetId } from "@/lib/petten";
import { TYPES, bepaalType } from "@/lib/profieltype";

type Props = { ok: boolean; totaal: number; aangenomen: number; titels: string[]; wet: { id: string; titel: string } | null };

function dagdeel(): string {
  const u = new Date().getHours();
  if (u < 6) return "Goedenacht";
  if (u < 12) return "Goedemorgen";
  if (u < 18) return "Goedemiddag";
  return "Goedenavond";
}

const Pijl = () => <span aria-hidden="true" style={{ fontSize: 18, fontWeight: 700 }}>→</span>;

function Regel({ href, kleur, inhoud, titel, sub }: { href: string; kleur: string; inhoud?: string; titel: string; sub: string }) {
  return (
    <Link href={href} style={{ display: "flex", gap: 14, alignItems: "center", padding: "16px 0", borderBottom: "1px solid #ECEEF2" }}>
      <span className="display" style={{ width: 48, height: 48, borderRadius: "50%", background: kleur, color: "#fff", fontWeight: 700, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {inhoud}
      </span>
      <span style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: 16, fontWeight: 800 }}>{titel}</span>
        <span style={{ fontSize: 13, color: "var(--grijs)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sub}</span>
      </span>
      <Pijl />
    </Link>
  );
}

export default function HomeScherm({ ok, totaal, aangenomen, titels, wet }: Props) {
  const [groet, setGroet] = useState("Hallo");
  const [naam, setNaam] = useState<string | null>(null);
  const [petten, setPetten] = useState<PetId[]>([]);
  const [type, setType] = useState<string | null>(null);

  useEffect(() => {
    setGroet(dagdeel());
    try {
      const p = JSON.parse(localStorage.getItem(OPSLAG_PROFIEL) || "null") as Profiel | null;
      if (p?.overJou?.naam?.trim()) setNaam(p.overJou.naam.trim());
      if (p?.klaar) setType(TYPES[bepaalType(p.antwoorden)].naam);
      const pt = JSON.parse(localStorage.getItem(OPSLAG_PETTEN) || "null");
      if (Array.isArray(pt)) setPetten(pt);
    } catch {}
  }, []);

  const voorJou = titels.filter((t) => pettenVoor(t).some((p) => petten.includes(p)));
  const petNamen = PETTEN.filter((p) => petten.includes(p.id)).map((p) => p.naam.toLowerCase());

  return (
    <main style={{ minHeight: "100dvh", paddingBottom: 110, background: "#fff" }}>
      <header style={{ background: "var(--geel)", padding: "calc(28px + env(safe-area-inset-top)) 22px 26px", display: "flex", flexDirection: "column", gap: 14, borderRadius: "0 0 32px 32px" }}>
        <h1 className="kop" style={{ fontSize: 34 }}>{naam ? `${groet}, ${naam}` : groet}</h1>
        {ok ? (
          <p style={{ margin: 0, fontSize: 18, fontWeight: 600, lineHeight: 1.4 }}>
            De Kamer nam deze twee weken <b>{aangenomen} voorstellen</b> aan.
            {petten.length > 0 && <> <b>{voorJou.length}</b> daarvan {voorJou.length === 1 ? "raakt" : "raken"} jou.</>}
          </p>
        ) : (
          <p style={{ margin: 0, fontSize: 18, fontWeight: 600, lineHeight: 1.4 }}>De Kamer-data is nu even niet bereikbaar.</p>
        )}
      </header>

      <div style={{ padding: "10px 22px" }}>
        {petten.length > 0 ? (
          <Regel href="/week" kleur="var(--blauw)" inhoud={String(voorJou.length)} titel="Voor jou" sub={petNamen.length ? `Voor jou als ${petNamen.slice(0, 3).join(", ")}` : "Wat jou raakt"} />
        ) : (
          <Regel href="/profiel" kleur="var(--blauw)" titel="Voor jou" sub="Maak je profiel, dan weten we wat jou raakt" />
        )}
        <Regel href={wet ? `/besluit/${wet.id}` : "/kamer"} kleur="var(--koraal)" titel="Wet van de week" sub={wet ? wet.titel : "Deze week geen nieuwe wet"} />
        <Regel href="/kamer" kleur="var(--mint)" titel="De Kamer" sub={`Alle ${totaal} besluiten`} />
        <Regel href="/profiel" kleur="var(--inkt)" titel="Jouw profiel" sub={type ?? "Wat is jouw politieke profiel?"} />
      </div>
    </main>
  );
}
