import Link from "next/link";
import type { Besluit } from "@/lib/tk";
import { datumKort } from "@/lib/tk";
import { PETTEN, pettenVoor } from "@/lib/petten";

export default function BesluitItem({ b, toonPetten = true }: { b: Besluit; toonPetten?: boolean }) {
  const petten = toonPetten ? pettenVoor(b.titel) : [];
  const totaal = b.voor + b.tegen;
  return (
    <Link href={`/besluit/${b.id}`} className="item">
      <div className="item-rij">
        <span className="item-titel">{b.titel}</span>
        <span className={`pil u-${b.uitslag}`}>{b.uitslag.toUpperCase()}</span>
      </div>
      {totaal > 0 && (
        <div className="balk" aria-label={`${b.voor} zetels voor, ${b.tegen} tegen`}>
          <div style={{ flex: b.voor, background: "var(--lila)" }} />
          <div style={{ flex: b.tegen, background: "var(--koraal)" }} />
        </div>
      )}
      {petten.length > 0 && (
        <div className="chips" style={{ gap: 6 }}>
          {petten.map((id) => {
            const p = PETTEN.find((x) => x.id === id)!;
            return (
              <span key={id} className="pil" style={{ background: p.kleur }}>
                {p.naam.toUpperCase()}
              </span>
            );
          })}
        </div>
      )}
      <div className="meta">
        <span>
          {b.soort} · {datumKort(b.datum)}
        </span>
        {b.indiener && <span>{b.indiener}</span>}
        {totaal > 0 && (
          <span>
            {b.voor} voor · {b.tegen} tegen
          </span>
        )}
        {b.algemeneStemmen && <span>Met algemene stemmen</span>}
      </div>
    </Link>
  );
}
