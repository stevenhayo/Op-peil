// Eerste, eenvoudige koppeling van besluiten aan "petten" op basis van trefwoorden.
// Later vervangen door een AI-voorstel dat een redacteur goedkeurt.

export const PETTEN = [
  { id: "student", naam: "Student", kleur: "#FFD23F", woorden: ["student", "studie", "onderwijs", "school", "universiteit", "hbo", "mbo", "lener"] },
  { id: "huurder", naam: "Huurder", kleur: "#2EC4B6", woorden: ["huur", "woning", "wonen", "woningbouw", "verhuur", "corporatie"] },
  { id: "ondernemer", naam: "Ondernemer", kleur: "#FF6B4A", woorden: ["ondernem", "bedrijf", "mkb", "zzp", "zelfstandige", "start-up", "startup", "scale-up", "vennootschap", "btw"] },
  { id: "werknemer", naam: "Werknemer", kleur: "#6F8BFF", woorden: ["werknemer", "werkgever", "arbeid", "loon", "pensioen", "cao", "minimumloon", "werkloos"] },
  { id: "senior", naam: "Gepensioneerd", kleur: "#E9D8A6", woorden: ["aow", "pensioen", "ouderen", "gepensioneerd", "mantelzorg"] },
  { id: "ouder", naam: "Ouder", kleur: "#FFB3C7", woorden: ["kind", "ouder", "kinderopvang", "jeugd", "gezin", "kinderbijslag"] },
  { id: "zorg", naam: "Zorg", kleur: "#B8F2E6", woorden: ["zorg", "ziekenhuis", "huisarts", "zorgverzeker", "eigen risico", "ggz", "patiënt"] },
  { id: "klimaat", naam: "Klimaat & energie", kleur: "#C1F07A", woorden: ["klimaat", "energie", "stikstof", "co2", "uitstoot", "duurzaam", "gas", "wind"] },
  { id: "digitaal", naam: "Tech & digitaal", kleur: "#D4C5FF", woorden: ["digitaal", "digitale", "ai", "algoritme", "data", "privacy", "cyber", "internet"] },
  { id: "veiligheid", naam: "Veiligheid", kleur: "#FFCF99", woorden: ["politie", "veiligheid", "criminal", "straf", "justitie", "defensie"] },
] as const;

export type PetId = (typeof PETTEN)[number]["id"];

export function pettenVoor(tekst: string): PetId[] {
  const t = ` ${tekst.toLowerCase()} `;
  return PETTEN.filter((p) => p.woorden.some((w) => (w === "ai" ? /\bai\b/.test(t) : t.includes(w)))).map((p) => p.id);
}

export const OPSLAG_PETTEN = "kb-petten";
