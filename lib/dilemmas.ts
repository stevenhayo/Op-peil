// 15 stellingen in Stemwijzer-stijl. Bewust gemengd: "eens" hoort niet steeds bij dezelfde kant.
export const STELLINGEN = [
  { thema: "Wonen", tekst: "Er moeten sneller veel meer huizen gebouwd worden, ook als dat ten koste gaat van natuur." },
  { thema: "Wonen", tekst: "Huurprijzen moeten strenger worden begrensd." },
  { thema: "Klimaat", tekst: "Nederland moet sneller stoppen met fossiele brandstoffen, ook als energie daardoor duurder wordt." },
  { thema: "Migratie", tekst: "Nederland moet minder asielzoekers toelaten." },
  { thema: "Werk", tekst: "Arbeidsmigranten zijn nodig voor de Nederlandse economie." },
  { thema: "Zorg", tekst: "Het eigen risico in de zorg moet fors omlaag of helemaal verdwijnen." },
  { thema: "Belasting", tekst: "Mensen met een groot vermogen moeten meer belasting betalen." },
  { thema: "Ondernemen", tekst: "Ondernemers moeten minder regels en lasten krijgen." },
  { thema: "Defensie", tekst: "Nederland moet meer geld uitgeven aan defensie." },
  { thema: "Europa", tekst: "Nederland moet meer beslissingen samen met de Europese Unie nemen." },
  { thema: "Veiligheid", tekst: "De politie moet meer bevoegdheden krijgen, ook als dat ten koste gaat van privacy." },
  { thema: "Landbouw", tekst: "De stikstofregels voor boeren moeten worden versoepeld." },
  { thema: "Inkomen", tekst: "Het minimumloon moet verder omhoog." },
  { thema: "Democratie", tekst: "Burgers moeten via een bindend referendum over wetten kunnen beslissen." },
  { thema: "Onderwijs", tekst: "De overheid moet meer investeren in onderwijs, ook als belastingen daarvoor omhoog moeten." },
];

export const SCHAAL = ["Helemaal niet mee eens", "Niet mee eens", "Neutraal", "Mee eens", "Helemaal mee eens"];

export const FIX_THEMAS = [
  "Wonen", "Zorg", "Klimaat en energie", "Migratie", "Veiligheid",
  "Onderwijs", "Werk en economie", "Koopkracht", "Europa en de wereld", "Democratie en bestuur",
];

// "Over jou": vragen over leefomgeving en situatie
export const OVER_JOU = {
  leeftijd: ["16–24", "25–34", "35–49", "50–64", "65+"],
  omgeving: ["Grote stad", "Kleinere stad", "Dorp", "Platteland"],
  provincie: ["Groningen", "Friesland", "Drenthe", "Overijssel", "Flevoland", "Gelderland", "Utrecht", "Noord-Holland", "Zuid-Holland", "Zeeland", "Noord-Brabant", "Limburg", "Buitenland"],
  // Situaties zijn meerkeuze en worden omgezet naar petten
  situatie: [
    { label: "Student", pet: "student" },
    { label: "Werknemer", pet: "werknemer" },
    { label: "Ondernemer of zzp", pet: "ondernemer" },
    { label: "Gepensioneerd", pet: "senior" },
    { label: "Huurder", pet: "huurder" },
    { label: "Ouder van kinderen", pet: "ouder" },
  ],
} as const;

// Top-3-thema's die ook een pet opleveren
export const FIX_NAAR_PET: Record<string, string> = {
  "Wonen": "huurder",
  "Zorg": "zorg",
  "Klimaat en energie": "klimaat",
  "Veiligheid": "veiligheid",
  "Onderwijs": "student",
  "Werk en economie": "werknemer",
};

export const OPSLAG_PROFIEL = "kb-profiel-v2";

export type Profiel = {
  overJou: { leeftijd: string | null; omgeving: string | null; provincie: string | null; situatie: string[] };
  antwoorden: (number | null)[]; // 0..4 op SCHAAL, null = weet ik niet
  fix: string[];
  klaar: boolean;
};
