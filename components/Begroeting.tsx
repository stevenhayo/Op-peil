"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { OPSLAG_PROFIEL, type Profiel } from "@/lib/dilemmas";

function dagdeel(): string {
  const u = new Date().getHours();
  if (u < 6) return "Goedenacht";
  if (u < 12) return "Goedemorgen";
  if (u < 18) return "Goedemiddag";
  return "Goedenavond";
}

export default function Begroeting() {
  const [naam, setNaam] = useState<string | null>(null);
  const [geladen, setGeladen] = useState(false);

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem(OPSLAG_PROFIEL) || "null") as Profiel | null;
      const n = p?.overJou?.naam?.trim();
      if (n) setNaam(n);
    } catch {}
    setGeladen(true);
  }, []);

  if (!geladen) return <div style={{ height: 34 }} />;

  if (naam) {
    return (
      <p className="display" style={{ margin: 0, fontSize: 26, fontWeight: 700 }}>
        Hey {naam}! <span style={{ color: "var(--grijs)", fontSize: 16, fontWeight: 600 }}>{dagdeel()}.</span>
      </p>
    );
  }

  return (
    <Link href="/profiel" className="kaart" style={{ background: "var(--blauw)", color: "#fff", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontWeight: 700 }}>Hey! Maak je profiel, dan weten we wat jou raakt.</span>
      <span aria-hidden="true" style={{ fontSize: 20 }}>→</span>
    </Link>
  );
}
