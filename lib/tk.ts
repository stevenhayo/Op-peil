// Haalt besluiten (stemmingen) op uit het Open Data Portaal van de Tweede Kamer.
// Documentatie: https://opendata.tweedekamer.nl  (licentie CC-0)

const BASE = "https://gegevensmagazijn.tweedekamer.nl/OData/v4/2.0/";
const REVALIDATE_SECONDS = 3600; // elk uur verse data

export type Uitslag = "aangenomen" | "verworpen" | "aangehouden" | "overig";

export type FractieStem = { fractie: string; zetels: number; soort: "Voor" | "Tegen" | "Niet deelgenomen" | string };

export type Besluit = {
  id: string;
  datum: string; // ISO
  soort: string; // Motie, Wetgeving, Amendement, ...
  titel: string;
  indiener: string | null;
  nummer: string | null;
  uitslag: Uitslag;
  besluitTekst: string;
  voor: number;
  tegen: number;
  stemmen: FractieStem[];
  algemeneStemmen: boolean;
};

type Raw = Record<string, any>;

function uitslagVan(tekst: string): Uitslag {
  const t = tekst.toLowerCase();
  if (t.includes("verworpen")) return "verworpen";
  if (t.includes("aangenomen")) return "aangenomen";
  if (t.includes("aangehouden")) return "aangehouden";
  return "overig";
}

// "Motie van het lid Rajkowski c.s. over gesprekken met werkgevers" -> titel + indiener
function splitTitel(onderwerp: string): { titel: string; indiener: string | null } {
  const m = onderwerp.match(/^(?:Gewijzigde\s+)?(?:Motie|Amendement)\s+van\s+(?:het\s+lid|de\s+leden)\s+(.+?)\s+over\s+(.+)$/i);
  if (m) {
    const titel = m[2].trim();
    return { titel: titel.charAt(0).toUpperCase() + titel.slice(1), indiener: m[1].trim() };
  }
  return { titel: onderwerp, indiener: null };
}

function normaliseer(b: Raw): Besluit | null {
  const zaken: Raw[] = Array.isArray(b.Zaak) ? b.Zaak.filter((z: Raw) => !z.Verwijderd) : [];
  const zaak = zaken[0];
  if (!zaak) return null;
  const onderwerp: string = zaak.Onderwerp || zaak.Titel || "Onbekend onderwerp";
  const { titel, indiener: uitTitel } = splitTitel(onderwerp);
  const indienerActor = Array.isArray(zaak.ZaakActor)
    ? zaak.ZaakActor.find((a: Raw) => (a.Relatie || "").toLowerCase() === "indiener")
    : null;
  // Bij een gewone stemming is er één regel per fractie (met FractieGrootte).
  // Bij een hoofdelijke stemming is er één regel per Kamerlid (met Persoon_Id): die tellen we op per fractie.
  const perFractie = new Map<string, FractieStem>();
  for (const s of (Array.isArray(b.Stemming) ? b.Stemming : []) as Raw[]) {
    if (s.Verwijderd || !s.ActorFractie || !s.Soort) continue;
    const telt = s.Persoon_Id ? 1 : Number(s.FractieGrootte) || 0;
    const sleutel = `${s.ActorFractie}|${s.Soort}`;
    const bestaand = perFractie.get(sleutel);
    if (bestaand) bestaand.zetels += telt;
    else perFractie.set(sleutel, { fractie: s.ActorFractie, zetels: telt, soort: s.Soort });
  }
  const stemmen: FractieStem[] = [...perFractie.values()];
  const voor = stemmen.filter((s) => s.soort === "Voor").reduce((n, s) => n + s.zetels, 0);
  const tegen = stemmen.filter((s) => s.soort === "Tegen").reduce((n, s) => n + s.zetels, 0);
  const tekst: string = b.BesluitTekst || "";
  const datum: string = b.Agendapunt?.Activiteit?.Datum || b.Agendapunt?.Activiteit?.Aanvangstijd || b.GewijzigdOp;
  return {
    id: b.Id,
    datum,
    soort: zaak.Soort || "Overig",
    titel,
    indiener: indienerActor?.ActorNaam || uitTitel,
    nummer: zaak.Nummer || null,
    uitslag: uitslagVan(tekst),
    besluitTekst: tekst,
    voor,
    tegen,
    stemmen,
    algemeneStemmen: tekst.toLowerCase().includes("algemene stemmen") || (stemmen.length > 0 && tegen === 0),
  };
}

async function haal(url: string): Promise<Raw | null> {
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS }, headers: { Accept: "application/json" } });
    if (!res.ok) {
      console.error("Kamer-API gaf status", res.status, url);
      return null;
    }
    return await res.json();
  } catch (e) {
    console.error("Kamer-API niet bereikbaar", e);
    return null;
  }
}

const EXPAND_RIJK = "Stemming,Zaak($expand=ZaakActor),Agendapunt($expand=Activiteit)";
const EXPAND_KAAL = "Stemming,Zaak";

/** Besluiten met een stemming uit de afgelopen `dagen` dagen, nieuwste eerst. */
export async function recenteBesluiten(dagen = 14): Promise<{ besluiten: Besluit[]; ok: boolean }> {
  const sinds = new Date(Date.now() - dagen * 864e5).toISOString().slice(0, 19) + "Z";
  const filter = `Verwijderd eq false and StemmingsSoort ne null and GewijzigdOp ge ${sinds}`;
  const maak = (expand: string) =>
    `${BASE}Besluit?$filter=${encodeURIComponent(filter)}&$expand=${encodeURIComponent(expand)}&$orderby=GewijzigdOp desc&$top=250`;

  let json = await haal(maak(EXPAND_RIJK));
  if (!json) json = await haal(maak(EXPAND_KAAL)); // terugval als geneste expand niet werkt
  if (!json || !Array.isArray(json.value)) return { besluiten: [], ok: false };

  const besluiten = (json.value as Raw[])
    .map(normaliseer)
    .filter((b): b is Besluit => b !== null)
    .sort((a, b) => (a.datum < b.datum ? 1 : -1));
  return { besluiten, ok: true };
}

export async function besluitOpId(id: string): Promise<Besluit | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  let json = await haal(`${BASE}Besluit(${id})?$expand=${encodeURIComponent(EXPAND_RIJK)}`);
  if (!json) json = await haal(`${BASE}Besluit(${id})?$expand=${encodeURIComponent(EXPAND_KAAL)}`);
  return json ? normaliseer(json) : null;
}

/** De belangrijkste aangenomen wet uit de lijst: de "wet van de week". */
export function wetVanDeWeek(besluiten: Besluit[]): Besluit | null {
  return (
    besluiten.find((b) => (b.soort === "Wetgeving" || b.soort === "Initiatiefwetgeving") && b.uitslag === "aangenomen") ||
    besluiten.find((b) => b.soort === "Wetgeving" || b.soort === "Initiatiefwetgeving") ||
    null
  );
}

export function datumKort(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
  } catch {
    return "";
  }
}
