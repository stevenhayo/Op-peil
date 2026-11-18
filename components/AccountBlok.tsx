"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { Profiel } from "@/lib/dilemmas";

type Props = { profiel?: Profiel | null; onGeladen?: (p: Profiel) => void };

const invoer = { font: "inherit", padding: "12px 14px", borderRadius: 14, border: "2px solid rgba(255,255,255,.55)", background: "transparent", color: "#fff", minHeight: 48, width: "100%" } as const;

export default function AccountBlok({ profiel, onGeladen }: Props) {
  const sb = supabase();
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [toestemming, setToestemming] = useState(false);
  const [opgeslagen, setOpgeslagen] = useState(false);
  const [melding, setMelding] = useState<string | null>(null);
  const [bezig, setBezig] = useState(false);

  useEffect(() => {
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data } = sb.auth.onAuthStateChange((_e, sessie) => setUser(sessie?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, [sb]);

  // Ingelogd: kijk of er al een opgeslagen profiel is
  useEffect(() => {
    if (!sb || !user) return;
    sb.from("profielen").select("data").eq("user_id", user.id).maybeSingle().then(({ data, error }) => {
      if (error) return setMelding("Je profiel kon niet worden opgehaald. Is de database al ingericht?");
      if (data?.data) {
        setOpgeslagen(true);
        setToestemming(true);
        onGeladen?.(data.data as Profiel);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sb, user]);

  if (!sb) return null;

  const stuurLink = async () => {
    if (!email.includes("@")) return setMelding("Vul een geldig e-mailadres in.");
    setBezig(true);
    const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/profiel` } });
    setBezig(false);
    setMelding(error ? `Dat lukte niet: ${error.message}` : "Check je mail en tik op de inloglink.");
  };

  const bewaar = async () => {
    if (!user || !profiel) return;
    setBezig(true);
    const { error } = await sb.from("profielen").upsert({ user_id: user.id, data: profiel, toestemming_op: new Date().toISOString(), bijgewerkt_op: new Date().toISOString() });
    setBezig(false);
    if (error) return setMelding(`Opslaan lukte niet: ${error.message}`);
    setOpgeslagen(true);
    setMelding("Opgeslagen in je account.");
  };

  const verwijder = async () => {
    if (!user) return;
    const { error } = await sb.from("profielen").delete().eq("user_id", user.id);
    if (error) return setMelding(`Verwijderen lukte niet: ${error.message}`);
    setOpgeslagen(false);
    setToestemming(false);
    setMelding("Je profiel is uit je account verwijderd. Op dit apparaat staat het nog.");
  };

  return (
    <section className="kaart" style={{ background: "var(--inkt-2)", color: "#fff", gap: 12 }}>
      <span className="label" style={{ color: "var(--mint)" }}>JOUW ACCOUNT</span>
      {!user ? (
        <>
          <span style={{ fontSize: 15, lineHeight: 1.45 }}>
            {profiel ? "Log in om je profiel op al je apparaten te bewaren." : "Al een profiel? Log in om het op te halen."}
          </span>
          <label htmlFor="email" className="label" style={{ color: "#B7BCC8" }}>E-MAILADRES</label>
          <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jij@voorbeeld.nl" style={invoer} />
          <button className="knop knop-koraal" onClick={stuurLink} disabled={bezig}>{bezig ? "Even geduld…" : "Stuur me een inloglink"}</button>
        </>
      ) : (
        <>
          <span style={{ fontSize: 14 }}>Ingelogd als <b>{user.email}</b></span>
          {profiel && (
            <>
              <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13, lineHeight: 1.45, color: "#DCDFE6" }}>
                <input type="checkbox" checked={toestemming} onChange={(e) => setToestemming(e.target.checked)} style={{ width: 22, height: 22, marginTop: 1, flexShrink: 0 }} />
                Ik geef uitdrukkelijk toestemming om mijn profiel, inclusief mijn politieke opvattingen, in mijn account op te slaan. Alleen ik kan het zien en ik kan het altijd verwijderen.
              </label>
              <button className="knop knop-koraal" onClick={bewaar} disabled={!toestemming || bezig} style={{ opacity: toestemming ? 1 : 0.4 }}>
                {opgeslagen ? "Bijwerken in mijn account" : "Bewaar in mijn account"}
              </button>
              {opgeslagen && (
                <button onClick={verwijder} style={{ background: "none", border: 0, color: "#FF9A85", fontWeight: 700, minHeight: 40 }}>Verwijder uit mijn account</button>
              )}
            </>
          )}
          <button onClick={() => sb.auth.signOut()} style={{ background: "none", border: 0, color: "#B7BCC8", fontWeight: 700, minHeight: 40 }}>Uitloggen</button>
        </>
      )}
      {melding && <span role="status" style={{ fontSize: 13, color: "var(--geel)" }}>{melding}</span>}
    </section>
  );
}
