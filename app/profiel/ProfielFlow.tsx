"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { STELLINGEN, SCHAAL, FIX_THEMAS, FIX_NAAR_PET, OVER_JOU, OPSLAG_PROFIEL, type Profiel } from "@/lib/dilemmas";
import { TYPES, bepaalType, samenvatting } from "@/lib/profieltype";
import AccountBlok from "@/components/AccountBlok";
import { OPSLAG_PETTEN } from "@/lib/petten";

const KLEUREN = ["#FF6B4A", "#FFD23F", "#6F8BFF", "#2EC4B6"];
const N = STELLINGEN.length;
const LEEG: Profiel = {
  overJou: { naam: "", leeftijd: null, omgeving: null, provincie: null, situatie: [] },
  antwoorden: Array(N).fill(null),
  fix: [],
  klaar: false,
};
// Stappen: -1 intro, 0 over jou, 1..N stellingen, N+1 fix, N+2 resultaat
const STAP_FIX = N + 1;
const STAP_KLAAR = N + 2;

function Keuze({ opties, waarde, kies, kleur = "var(--geel)" }: { opties: readonly string[]; waarde: string | null; kies: (v: string) => void; kleur?: string }) {
  return (
    <div className="chips">
      {opties.map((o) => {
        const aan = waarde === o;
        return (
          <button key={o} className="chip" aria-pressed={aan} onClick={() => kies(o)}
            style={aan ? { background: kleur, borderColor: kleur, color: "var(--inkt)" } : { background: "transparent", color: "#fff", borderColor: "rgba(255,255,255,.55)" }}>
            {o}
          </button>
        );
      })}
    </div>
  );
}

export default function ProfielFlow() {
  const [p, setP] = useState<Profiel>(LEEG);
  const [stap, setStap] = useState(-1);
  const [keuze, setKeuze] = useState<number | null>(null);
  const [bewerk, setBewerk] = useState(false); // true: na een onderdeel terug naar het resultaat

  const gaNaar = (s: number, antwoorden = p.antwoorden) => {
    setStap(s);
    setKeuze(s >= 1 && s <= N ? antwoorden[s - 1] ?? null : null);
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  };

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(OPSLAG_PROFIEL) || "null");
      if (s && Array.isArray(s.antwoorden) && s.overJou) {
        setP(s);
        if (s.klaar) setStap(STAP_KLAAR);
      }
    } catch {}
  }, []);

  const bewaar = (nieuw: Profiel) => {
    setP(nieuw);
    try {
      localStorage.setItem(OPSLAG_PROFIEL, JSON.stringify(nieuw));
      const uitSituatie: string[] = OVER_JOU.situatie.filter((s) => nieuw.overJou.situatie.includes(s.label)).map((s) => s.pet);
      const uitFix = nieuw.fix.map((f) => FIX_NAAR_PET[f]).filter(Boolean);
      const petten = [...new Set([...uitSituatie, ...uitFix])];
      if (petten.length) localStorage.setItem(OPSLAG_PETTEN, JSON.stringify(petten));
    } catch {}
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
            Eerst een paar vragen over jou, dan 15 stellingen. Tot slot kies je wat er als eerste gefixt moet worden.
          </p>
          <p style={{ fontSize: 13, lineHeight: 1.5, color: "#DCE3FF", margin: 0 }}>
            Je antwoorden blijven alleen op dit apparaat. Wij slaan ze nergens op.
          </p>
          <button className="knop knop-koraal" onClick={() => { setBewerk(false); gaNaar(0); }} style={{ marginTop: 12 }}>Start</button>
          <AccountBlok onGeladen={(geladen) => { bewaar(geladen); if (geladen.klaar) setStap(STAP_KLAAR); }} />
        </div>
      </main>
    );
  }

  // OVER JOU
  if (stap === 0) {
    const o = p.overJou;
    const zet = (veld: "leeftijd" | "omgeving" | "provincie", v: string) => bewaar({ ...p, overJou: { ...o, [veld]: v } });
    const wisselSituatie = (s: string) =>
      bewaar({ ...p, overJou: { ...o, situatie: o.situatie.includes(s) ? o.situatie.filter((x) => x !== s) : [...o.situatie, s] } });
    const klaar = (o.naam ?? "").trim() && o.leeftijd && o.omgeving;
    return (
      <main className="inhoud" style={{ background: "var(--inkt)", color: "#fff", minHeight: "100dvh", gap: 20 }}>
        <div>
          <span className="label" style={{ color: "var(--mint)" }}>STAP 1 · OVER JOU</span>
          <h1 className="kop" style={{ fontSize: 32, marginTop: 8 }}>Waar sta jij in het leven?</h1>
        </div>
        <section style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <label className="label" htmlFor="naam">HOE MOGEN WE JE NOEMEN?</label>
          <input id="naam" type="text" autoComplete="given-name" maxLength={40} placeholder="Je voornaam" value={o.naam ?? ""}
            onChange={(e) => bewaar({ ...p, overJou: { ...o, naam: e.target.value } })}
            style={{ font: "inherit", fontWeight: 700, fontSize: 17, padding: "12px 14px", borderRadius: 14, border: "2px solid rgba(255,255,255,.55)", background: "var(--inkt-2)", color: "#fff", minHeight: 50 }} />
        </section>
        <section style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <span className="label">LEEFTIJD</span>
          <Keuze opties={OVER_JOU.leeftijd} waarde={o.leeftijd} kies={(v) => zet("leeftijd", v)} />
        </section>
        <section style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <span className="label">WAAR WOON JE?</span>
          <Keuze opties={OVER_JOU.omgeving} waarde={o.omgeving} kies={(v) => zet("omgeving", v)} kleur="var(--mint)" />
        </section>
        <section style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <label className="label" htmlFor="provincie">PROVINCIE</label>
          <select id="provincie" value={o.provincie ?? ""} onChange={(e) => zet("provincie", e.target.value)}
            style={{ font: "inherit", fontWeight: 700, padding: "12px 14px", borderRadius: 14, border: "2px solid rgba(255,255,255,.55)", background: "var(--inkt-2)", color: "#fff", minHeight: 48 }}>
            <option value="" disabled>Kies je provincie</option>
            {OVER_JOU.provincie.map((pr) => <option key={pr} value={pr}>{pr}</option>)}
          </select>
        </section>
        <section style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <span className="label">WAT PAST BIJ JOU? (MEERDERE MOGELIJK)</span>
          <div className="chips">
            {OVER_JOU.situatie.map((s) => {
              const aan = o.situatie.includes(s.label);
              return (
                <button key={s.label} className="chip" aria-pressed={aan} onClick={() => wisselSituatie(s.label)}
                  style={aan ? { background: "var(--koraal)", borderColor: "var(--koraal)", color: "var(--inkt)" } : { background: "transparent", color: "#fff", borderColor: "rgba(255,255,255,.55)" }}>
                  {s.label}
                </button>
              );
            })}
          </div>
          <span style={{ fontSize: 12, color: "#B7BCC8" }}>Dit worden je petten: daarover hoor je het meest.</span>
        </section>
        <button className="knop knop-koraal" disabled={!klaar} style={{ opacity: klaar ? 1 : 0.4 }} onClick={() => gaNaar(bewerk ? STAP_KLAAR : 1)}>
          {!klaar ? "Vul je naam, leeftijd en woonplek in" : bewerk ? "Opslaan" : "Naar de stellingen"}
        </button>
      </main>
    );
  }

  // STELLINGEN
  if (stap <= N) {
    const i = stap - 1;
    const s = STELLINGEN[i];
    const volgende = (waarde: number | null) => {
      const antwoorden = [...p.antwoorden];
      antwoorden[i] = waarde;
      bewaar({ ...p, antwoorden });
      gaNaar(bewerk && stap === N ? STAP_KLAAR : stap + 1, antwoorden);
    };
    const kleurVan = (v: number) => (v < 2 ? "var(--koraal)" : v > 2 ? "var(--mint)" : "#fff");
    return (
      <main className="inhoud" style={{ background: "var(--blauw)", color: "#fff", minHeight: "100dvh", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span className="label">STAP 2 · STELLINGEN</span>
          <span className="label">{i + 1} / {N}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))`, gap: 3 }}>
          {STELLINGEN.map((_, j) => (
            <div key={j} style={{ height: 6, borderRadius: 3, background: j < i ? "var(--geel)" : j === i ? "#fff" : "rgba(255,255,255,.3)" }} />
          ))}
        </div>
        <span className="pil" style={{ background: "var(--geel)", color: "var(--inkt)", alignSelf: "flex-start", marginTop: 8 }}>{s.thema.toUpperCase()}</span>
        <h1 className="kop" style={{ fontSize: 30, lineHeight: 1.12 }}>{s.tekst}</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
          {[4, 3, 2, 1, 0].map((v) => {
            const aan = keuze === v;
            return (
              <button key={v} onClick={() => setKeuze(v)}
                style={{ minHeight: 52, borderRadius: 16, border: `3px solid ${aan ? kleurVan(v) : "rgba(255,255,255,.35)"}`, background: aan ? kleurVan(v) : "transparent",
                  color: aan ? "var(--inkt)" : "#fff", fontWeight: 800, fontSize: 16, textAlign: "left", padding: "0 18px", transition: "all .15s" }}>
                {SCHAAL[v]}
              </button>
            );
          })}
        </div>
        {i > 0 && (
          <button onClick={() => gaNaar(stap - 1)} style={{ alignSelf: "flex-start", background: "none", border: 0, color: "#DCE3FF", fontWeight: 700, minHeight: 40, padding: 0 }}>← Vorige stelling</button>
        )}
        <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
          <button className="knop" onClick={() => volgende(null)} style={{ background: "transparent", color: "#fff", border: "2px solid rgba(255,255,255,.6)" }}>Weet ik niet</button>
          <button className={`knop ${keuze !== null ? "knop-koraal" : "knop-uit"}`} style={{ flex: 1 }} onClick={() => keuze !== null && volgende(keuze)}>
            {keuze !== null ? "Volgende" : "Kies eerst"}
          </button>
        </div>
      </main>
    );
  }

  // WAT MOET ER GEFIXT WORDEN
  if (stap === STAP_FIX) {
    const wissel = (t: string) => {
      const fix = p.fix.includes(t) ? p.fix.filter((x) => x !== t) : p.fix.length < 3 ? [...p.fix, t] : p.fix;
      bewaar({ ...p, fix });
    };
    const klaar = p.fix.length === 3;
    return (
      <main className="inhoud" style={{ background: "var(--geel)", minHeight: "100dvh", gap: 16 }}>
        <span className="label">STAP 3 · LAATSTE VRAAG</span>
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
          onClick={() => { bewaar({ ...p, klaar: true }); setStap(STAP_KLAAR); }}>
          {klaar ? "Bekijk mijn profiel" : `Nog ${3 - p.fix.length} kiezen`}
        </button>
      </main>
    );
  }

  // RESULTAAT
  const uitgesproken = p.antwoorden
    .map((a, i) => ({ a, i }))
    .filter((x): x is { a: number; i: number } => x.a === 0 || x.a === 4)
    .slice(0, 4);
  const stralen = p.antwoorden.map((a, i) => {
    const hoek = (i / N) * Math.PI * 2 - Math.PI / 2;
    const lengte = 32 + (a === null ? 0.12 : 0.25 + (a / 4) * 0.75) * 118;
    return { x: 170 + Math.cos(hoek) * lengte, y: 170 + Math.sin(hoek) * lengte, kleur: a === null ? "#3A3E4A" : KLEUREN[i % 4] };
  });
  const o = p.overJou;
  const type = TYPES[bepaalType(p.antwoorden)];

  return (
    <main className="inhoud" style={{ background: "var(--inkt)", color: "#fff", minHeight: "100dvh", gap: 16 }}>
      <span className="label" style={{ color: "var(--geel)" }}>{o.naam ? `${o.naam.toUpperCase()}, DIT IS JOUW POLITIEKE PROFIEL` : "JOUW POLITIEKE PROFIEL"}</span>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <h1 className="kop" style={{ fontSize: 38, color: type.kleur }}>{type.naam}</h1>
        <span style={{ fontSize: 17, fontWeight: 700 }}>{type.kort}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <svg width="300" height="300" viewBox="0 0 340 340" role="img" aria-label="Jouw vingerafdruk: één straal per stelling, langer betekent meer mee eens">
          {[150, 100, 50].map((r) => <circle key={r} cx="170" cy="170" r={r} fill="none" stroke="#2A2D36" />)}
          {stralen.map((s, i) => <line key={i} x1="170" y1="170" x2={s.x} y2={s.y} stroke={s.kleur} strokeWidth="13" strokeLinecap="round" />)}
          <circle cx="170" cy="170" r="22" fill="#12141A" stroke="#fff" strokeWidth="3" />
        </svg>
      </div>
      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: "#DCDFE6" }}>{samenvatting(p.antwoorden, p.fix)}</p>
      <div className="chips">
        {[o.leeftijd, o.omgeving, o.provincie, ...o.situatie].filter(Boolean).map((x) => (
          <span key={x as string} className="pil" style={{ background: "var(--inkt-2)", color: "#fff", fontSize: 12, padding: "7px 11px" }}>{x}</span>
        ))}
      </div>
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
      {uitgesproken.length > 0 && (
        <div className="kaart" style={{ background: "var(--geel)", color: "var(--inkt)" }}>
          <span className="label">HIER BEN JE UITGESPROKEN OVER</span>
          {uitgesproken.map(({ a, i }) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 11, fontWeight: 800 }}>{SCHAAL[a].toUpperCase()}</span>
              <span style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.35 }}>{STELLINGEN[i].tekst}</span>
            </div>
          ))}
        </div>
      )}
      <AccountBlok profiel={p} />
      <section className="kaart" style={{ background: "var(--inkt-2)", gap: 8 }}>
        <span className="label" style={{ color: "var(--geel)" }}>PROFIEL BEWERKEN</span>
        {[
          { label: "Over jou (naam, leeftijd, woonplek, petten)", stap: 0 },
          { label: "De 15 stellingen", stap: 1 },
          { label: "Jouw top 3 om te fixen", stap: STAP_FIX },
        ].map((x) => (
          <button key={x.label} onClick={() => { setBewerk(true); gaNaar(x.stap); }}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: 52, padding: "0 14px", borderRadius: 14, border: "2px solid #3A3E4A", background: "transparent", color: "#fff", fontWeight: 700, textAlign: "left" }}>
            {x.label}<span aria-hidden="true">→</span>
          </button>
        ))}
        <button onClick={() => { bewaar(LEEG); setBewerk(false); gaNaar(-1); }} style={{ background: "none", border: 0, color: "#FF9A85", fontWeight: 700, minHeight: 40 }}>Helemaal opnieuw beginnen</button>
      </section>
      <Link href="/kamer" className="knop knop-koraal">Naar de Kamer</Link>
      <p className="voetnoot" style={{ color: "#9095A3" }}>Testversie. Later zie je hier ook waar jij anders denkt dan mensen die op je lijken.</p>
    </main>
  );
}
