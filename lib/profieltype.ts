import { STELLINGEN } from "./dilemmas";

// Profieltypes zeggen iets over HOE je over politiek denkt, niet WAAR je staat.
// Bewust geen links/rechts: iedereen kan elk type zijn.
export const TYPES = {
  bruggenbouwer: {
    naam: "De Bruggenbouwer",
    kleur: "#2EC4B6",
    kort: "Je ziet vaak beide kanten van een verhaal.",
    tekst: "Je hebt duidelijke meningen, maar zelden extreme. Dat maakt je iemand die gesprekken op gang houdt en kan schakelen tussen standpunten.",
  },
  koersvast: {
    naam: "De Koersvaste",
    kleur: "#FF6B4A",
    kort: "Je weet goed wat je vindt, en zegt het ook.",
    tekst: "Op veel onderwerpen heb je een uitgesproken mening. Je weet waar je voor staat, ook als het schuurt.",
  },
  scherpschutter: {
    naam: "De Scherpschutter",
    kleur: "#FFD23F",
    kort: "Je kiest je gevechten zorgvuldig.",
    tekst: "Over de meeste onderwerpen ben je rustig, maar op een paar punten ben je glashelder. Daar ligt jouw energie.",
  },
  ontdekker: {
    naam: "De Ontdekker",
    kleur: "#6F8BFF",
    kort: "Je houdt je oordeel nog even open.",
    tekst: "Op veel stellingen twijfel je nog, en dat is helemaal prima. Je wilt eerst weten hoe het zit voordat je kiest. Daar is Op Peil voor.",
  },
} as const;

export type TypeId = keyof typeof TYPES;

export function bepaalType(antwoorden: (number | null)[]): TypeId {
  const sterk = antwoorden.filter((a) => a === 0 || a === 4).length;
  const twijfel = antwoorden.filter((a) => a === null || a === 2).length;
  const n = antwoorden.length || 1;
  if (sterk / n >= 0.4) return "koersvast";
  if (sterk >= 2 && twijfel / n >= 0.33) return "scherpschutter";
  if (twijfel / n >= 0.4) return "ontdekker";
  return "bruggenbouwer";
}

function opsomming(xs: string[]): string {
  if (xs.length <= 1) return xs.join("");
  return `${xs.slice(0, -1).join(", ")} en ${xs[xs.length - 1]}`;
}

export function samenvatting(antwoorden: (number | null)[], fix: string[]): string {
  const type = TYPES[bepaalType(antwoorden)];
  const eens = antwoorden.filter((a) => a !== null && a > 2).length;
  const oneens = antwoorden.filter((a) => a !== null && a < 2).length;
  const uitgesproken = [...new Set(
    antwoorden.map((a, i) => (a === 0 || a === 4 ? STELLINGEN[i].thema.toLowerCase() : null)).filter((x): x is string => !!x),
  )].slice(0, 2);

  const delen = [
    `${type.tekst}`,
    `Je was het met ${eens} stellingen eens en met ${oneens} oneens.`,
    uitgesproken.length ? `Het meest uitgesproken ben je over ${opsomming(uitgesproken)}.` : "",
    fix.length ? `Wat jou betreft moeten ${opsomming(fix.map((f) => f.toLowerCase()))} als eerste gefixt worden. Daar houden we je vooral over op de hoogte.` : "",
  ];
  return delen.filter(Boolean).join(" ");
}
