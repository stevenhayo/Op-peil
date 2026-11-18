"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DILEMMAS, FIX_THEMAS, OPSLAG_PROFIEL, type Profiel } from "@/lib/dilemmas";

// Korte woorden voor wat een antwoord zegt over iemands waarden (A, B)
const WAARDEN: [string, string][] = [
  ["Gelijkheid", "Verdienste"], ["Zekerheid", "Vrijheid"], ["Betaalbaarheid", "Lange termijn"], ["Samen dragen", "Eigen regie"],
  ["Natuur", "Bouwen"], ["Ruimhartig", "Zorgvuldig kiezen"], ["Samen in Europa", "Zelf beslissen"], ["Veiligheid", "Privacy"],
  ["Houvast", "Vernieuwing"], ["Dichtbij", "Gelijke regels"], ["Kansen", "Talent"], ["Platteland", "Natuur en water"],
  ["Investeren", "Zuinig"], ["Afschrikken", "Voorkomen"],
];
const KLEUREN = ["#FF6B4A", "#FFD23F", "#6F8BFF", "#2EC4B6"];
const LEEG: Profiel = { antwoorden: Array(DILEMMAS.length).fill(null), fix: [], klaar: false };

export default function ProfielFlow() {
  const [p, setP] = useState<Profiel>(LEEG);
  const [stap, setStap] = useState<number>(-1); // -1 intro, 0..13 vragen, 14 fix, 15 resultaat
  const [keuze, setKeuze] = useState<number | null>(null);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(OPSLAG_PROFIEL) || "null");
      if (s && Array.isArray(s.antwoorden)) {
        setP(s);
        if (s.klaar) setStap(15);
      }
    } catch {}
  }, []);

  const bewaar = (nieuw: Profiel) => {
    setP(nieuw);
    try { localStorage.setItem(OPSLAG_PROFIEL, JSON.stringify(nieuw)); } catch {}
  };

  const volgende = (waarde: number | null) => {
    const antwoorden = [...p.antwoorden];
    antwoorden[stap] = waarde;
    bewaar({ ...p, antwoorden });
    setKeuze(null);
    setStap(stap + 1);
  };

  // INTRO
  if (stap === -1) {
    return (
      <main className="inhoud" style={{ background: "var(--blauw)", color: "#fff", minHeight: "100dvh", position: "relative", overflow: "hidden" }}>
        <span className="bol" style={{ width: 260, height: 260, background: "var(--koraal)", top: -110, right: -90 }} />
        <span className="bol" style={{ width: 140, height: 140, background: "var(--geel)", bottom: 160, left: -70 }} />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 16, marginTop: 40 }}>
          <span className="label">GEEN HOKJE. JOUW EIGEN MIX.</span>
          <h1 className="kop" style={{ fontSize: 42 }}>Wat is jouw politieke profiel?</h1>
          <p style={{ fontSize: 16, lineHeight: 1.5, color: "#DCE3FF", margin: 0 }}>
            14 dilemma&apos;s, geen goede of foute antwoorden. Daarna kies je wat er als eerste gefixt moet worden.
          </p>
          <p style={{ fontSize: 13, lineHeight: 1.5, color: "#DCE3FF", margin: 0 }}>
            Je antwoorden blijven alleen op dit apparaat. Wij slaan ze nergens op.
          </p>
          <button className="knop knop-koraal" onClick={() => setStap(0)} style={{ marginTop: 12 }}>Start</button>
        </div>
      </main>
    );
  }

  // DILEMMA'S
  if (stap < DILEMMAS.length) {
    const d = DILEMMAS[stap];
    const kaart = (aan: boolean, ring: string) => ({
      textAlign: "left" as const, display: "flex", flexDirection: "column" as const, gap: 6, padding: 18, borderRadius: 20,
      color: "var(--inkt)", border: `3px solid ${aan ? ring : "transparent"}`, background: aan ? "#fff" : "#F2F4FF",
      transform: aan ? "scale(1.02)" : "none", opacity: keuze !== null && !aan ? 0.75 : 1, transition: "all .15s",
    });
    return (
      <main className="inhoud" style={{ background: "var(--blauw)", color: "#fff", minHeight: "100dvh", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span className="label">WAT IS JOUW POLITIEKE PROFIEL?</span>
          <span className="label">{stap + 1} / {DILEMMAS.length}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${DILEMMAS.length}, minmax(0, 1fr))`, gap: 3 }}>
          {DILEMMAS.map((_, i) => (
            <div key={i} style={{ height: 6, borderRadius: 3, background: i < stap ? "var(--geel)" : i === stap ? "#fff" : "rgba(255,255,255,.3)" }} />
          ))}
        </div>
        <span className="pil" style={{ background: "var(--geel)", color: "var(--inkt)", alignSelf: "flex-start", marginTop: 8 }}>{d.thema.toUpperCase()}</span>
        <h1 className="kop" style={{ fontSize: 34 }}>{d.vraag}</h1>
        <button onClick={() => setKeuze(0)} style={kaart(keuze !== null && keuze < 2, "var(--koraal)")}>
          <span style={{ fontSize: 12, fontWeight: 800, color: "#C2410C" }}>A</span>
          <span style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3 }}>{d.a}</span>
        </button>
        <button onClick={() => setKeuze(4)} style={kaart(keuze !== null && keuze > 2, "var(--blauw)")}>
          <span style={{ fontSize: 12, fontWeight: 800, color: "var(--blauw)" }}>B</span>
          <span style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3 }}>{d.b}</span>
        </button>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 4px" }}>
          {[0, 1, 2, 3, 4].map((v) => {
            const maat = v === 2 ? 20 : v === 0 || v === 4 ? 38 : 28;
            const kleur = v < 2 ? "var(--koraal)" : v > 2 ? "var(--geel)" : "#fff";
            return (
              <button key={v} aria-label={["Sterk A", "Een beetje A", "Neutraal", "Een beetje B", "Sterk B"][v]} onClick={() => setKeuze(v)}
                style={{ width: maat, height: maat, borderRadius: "50%", padding: 0, border: `3px solid ${kleur}`, background: keuze === v ? kleur : "transparent", transform: keuze === v ? "scale(1.2)" : "none", transition: "all .15s" }} />
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, color: "#DCE3FF" }}>
          <span>Sterk A</span><span>Neutraal</span><span>Sterk B</span>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button className="knop" onClick={() => volgende(null)} style={{ background: "transparent", color: "#fff", border: "2px solid rgba(255,255,255,.6)" }}>Weet ik niet</button>
          <button className={`knop ${keuze !== null ? "knop-koraal" : "knop-uit"}`} style={{ flex: 1 }} onClick={() => keuze !== null && volgende(keuze)}>
            {keuze !== null ? "Volgende" : "Kies eerst"}
          </button>
        </div>
      </main>
    );
  }

  // WAT MOET ER GEFIXT WORDEN
  if (stap === DILEMMAS.length) {
    const wissel = (t: string) => {
      const fix = p.fix.includes(t) ? p.fix.filter((x) => x !== t) : p.fix.length < 3 ? [...p.fix, t] : p.fix;
      bewaar({ ...p, fix });
    };
    const klaar = p.fix.length === 3;
    return (
      <main className="inhoud" style={{ background: "var(--geel)", minHeight: "100dvh", gap: 16 }}>
        <span className="label">LAATSTE VRAAG</span>
        <h1 className="kop">Wat moet er als eerste gefixt worden?</h1>
        <p style={{ margin: 0, fontWeight: 500 }}>Kies er 3. Hierover houden we je het best op de hoogte.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
          {FIX_THEMAS.map((t) => {
            const r = p.fix.indexOf(t);
            const aan = r > -1;
            return (
              <button key={t} onClick={() => wissel(t)}
                style={{ textAlign: "left", minHeight: 64, padding: "12px 14px", borderRadius: 16, border: "2px solid var(--inkt)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
                  background: aan ? "var(--inkt)" : "#FFF6D1", color: aan ? "#fff" : "var(--inkt)", transform: aan ? "rotate(-1.5deg)" : "none",
                  opacity: p.fix.length >= 3 && !aan ? 0.45 : 1, fontWeight: 800, fontSize: 15, transition: "all .15s" }}>
                {t}
                {aan && <span style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--koraal)", color: "var(--inkt)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{r + 1}</span>}
              </button>
            );
          })}
        </div>
        <button className="knop knop-donker" disabled={!klaar} style={{ opacity: klaar ? 1 : 0.35 }}
          onClick={() => { bewaar({ ...p, klaar: true }); setStap(stap + 1); }}>
          {klaar ? "Bekijk mijn profiel" : `Nog ${3 - p.fix.length} kiezen`}
        </button>
      </main>
    );
  }

  // RESULTAAT
  const sterkst = p.antwoorden
    .map((a, i) => ({ a, i }))
    .filter((x): x is { a: number; i: number } => x.a !== null && x.a !== 2)
    .sort((x, y) => Math.abs(y.a - 2) - Math.abs(x.a - 2))
    .slice(0, 3)
    .map((x) => WAARDEN[x.i][x.a < 2 ? 0 : 1]);
  const stralen = p.antwoorden.map((a, i) => {
    const hoek = (i / DILEMMAS.length) * Math.PI * 2 - Math.PI / 2;
    const lengte = 32 + (a === null ? 0.15 : 0.3 + Math.abs(a - 2) * 0.35) * 118;
    return { x: 170 + Math.cos(hoek) * lengte, y: 170 + Math.sin(hoek) * lengte, kleur: a === null ? "#3A3E4A" : KLEUREN[i % 4] };
  });

  return (
    <main className="inhoud" style={{ background: "var(--inkt)", color: "#fff", minHeight: "100dvh", gap: 16 }}>
      <span className="label" style={{ color: "var(--geel)" }}>GEEN HOKJE. JOUW EIGEN MIX.</span>
      <h1 className="kop" style={{ fontSize: 32 }}>Dit is jouw politieke profiel</h1>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <svg width="300" height="300" viewBox="0 0 340 340" role="img" aria-label="Jouw vingerafdruk: één straal per dilemma">
          {[150, 100, 50].map((r) => <circle key={r} cx="170" cy="170" r={r} fill="none" stroke="#2A2D36" />)}
          {stralen.map((s, i) => <line key={i} x1="170" y1="170" x2={s.x} y2={s.y} stroke={s.kleur} strokeWidth="13" strokeLinecap="round" />)}
          <circle cx="170" cy="170" r="22" fill="#12141A" stroke="#fff" strokeWidth="3" />
        </svg>
      </div>
      {sterkst.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span className="label" style={{ color: "#B7BCC8" }}>WAT JIJ HET STERKST VINDT</span>
          <div className="chips">
            {sterkst.map((w, i) => <span key={w} className="pil" style={{ background: KLEUREN[i], color: "var(--inkt)", fontSize: 14, padding: "8px 12px" }}>{w}</span>)}
          </div>
        </div>
      )}
      <div className="kaart" style={{ background: "var(--inkt-2)" }}>
        <span className="label" style={{ color: "#B7BCC8" }}>JOUW TOP 3 OM TE FIXEN</span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
          {p.fix.map((t, i) => (
            <div key={t}>
              <div className="display" style={{ fontSize: 26, fontWeight: 700, color: KLEUREN[i] }}>{i + 1}</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{t}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button className="knop" style={{ flex: 1, background: "transparent", color: "#fff", border: "2px solid #fff" }}
          onClick={() => { bewaar(LEEG); setStap(-1); }}>Opnieuw</button>
        <Link href="/week" className="knop knop-koraal" style={{ flex: 1 }}>Naar je week</Link>
      </div>
      <p className="voetnoot" style={{ color: "#9095A3" }}>Testversie. &quot;Jouw verrassing&quot; komt zodra er genoeg profielen zijn om mee te vergelijken.</p>
    </main>
  );
}
