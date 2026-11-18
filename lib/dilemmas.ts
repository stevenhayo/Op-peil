export const DILEMMAS = [
  { thema: "Inkomen", vraag: "Wat vind jij eerlijk?", a: "Grote verschillen in wat mensen overhouden zijn oneerlijk", b: "Wie harder werkt of meer risico neemt, mag flink meer overhouden" },
  { thema: "Werk", vraag: "Wat vind jij belangrijker?", a: "Vaste contracten en goede bescherming voor werkenden", b: "Ruimte om flexibel te werken en te ondernemen, met minder regels" },
  { thema: "Energie en klimaat", vraag: "Wat weegt voor jou zwaarder?", a: "Betaalbare energie nu, ook als klimaatdoelen later worden gehaald", b: "Nu meer betalen om uitstoot sneller te verlagen" },
  { thema: "Zorg", vraag: "Waar kies jij voor?", a: "De overheid regelt goede zorg voor iedereen, ook als dat meer belasting kost", b: "Mensen en families regelen meer zelf, met lagere belastingen" },
  { thema: "Wonen", vraag: "Waar kies jij voor?", a: "Natuur en open ruimte beschermen, ook als er minder huizen bijkomen", b: "Snel veel huizen bouwen, ook in het groen" },
  { thema: "Migratie", vraag: "Wat vind jij eerlijk?", a: "Ruimhartig zijn voor mensen die vluchten of hier willen werken", b: "Strenger kiezen wie er mag komen, zodat de samenleving het aankan" },
  { thema: "Europa", vraag: "Wat vind jij belangrijker?", a: "Grote problemen samen in Europa oplossen, ook als Nederland zeggenschap inlevert", b: "Nederland beslist zelf over zijn eigen zaken, ook als samenwerken lastiger wordt" },
  { thema: "Veiligheid", vraag: "Wat gaat voor?", a: "Politie en overheid mogen meer meekijken als dat misdaad voorkomt", b: "Privacy gaat voor, ook als opsporing moeilijker wordt" },
  { thema: "Samenleving", vraag: "Waar sta jij?", a: "Tradities en gewoonten geven houvast; verander ze voorzichtig", b: "Een samenleving moet zich snel aanpassen aan nieuwe tijden" },
  { thema: "Bestuur", vraag: "Wat vind jij eerlijk?", a: "Gemeenten en regio's beslissen meer zelf, ook als het per plek verschilt", b: "Dezelfde regels voor het hele land, zodat iedereen gelijk wordt behandeld" },
  { thema: "Onderwijs", vraag: "Waar kies jij voor?", a: "Extra geld naar kinderen die het moeilijk hebben", b: "Iedereen dezelfde basis, en ruimte voor talent om uit te blinken" },
  { thema: "Platteland", vraag: "Wat weegt voor jou zwaarder?", a: "Boeren houden de ruimte, ook als natuurdoelen later worden gehaald", b: "Natuur en water gaan voor, ook als boeren moeten veranderen" },
  { thema: "Overheidsgeld", vraag: "Waar kies jij voor?", a: "De overheid investeert nu, ook als de staatsschuld oploopt", b: "De overheid is zuinig, zodat volgende generaties niet de rekening krijgen" },
  { thema: "Straffen", vraag: "Wat werkt volgens jou beter?", a: "Zwaarder straffen houdt mensen tegen", b: "Meer inzetten op voorkomen en terugkeer in de samenleving" },
];

export const FIX_THEMAS = [
  "Wonen", "Zorg", "Klimaat en energie", "Migratie", "Veiligheid",
  "Onderwijs", "Werk en economie", "Koopkracht", "Europa en de wereld", "Democratie en bestuur",
];

export const OPSLAG_PROFIEL = "kb-profiel";

export type Profiel = { antwoorden: (number | null)[]; fix: string[]; klaar: boolean };
