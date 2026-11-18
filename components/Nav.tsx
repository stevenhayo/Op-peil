"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "Home", pad: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" },
  { href: "/week", label: "Voor jou", pad: "M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z" },
  { href: "/kamer", label: "De Kamer", pad: "M3 21h18M5 21V10M9.5 21V10M14.5 21V10M19 21V10M2 10l10-6 10 6z" },
  { href: "/profiel", label: "Profiel", pad: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" },
];

export default function Nav() {
  const pad = usePathname();
  return (
    <nav className="nav" aria-label="Hoofdmenu">
      <div className="nav-in">
        {ITEMS.map((i) => {
          const actief = i.href === "/" ? pad === "/" : pad.startsWith(i.href);
          return (
            <Link key={i.href} href={i.href} aria-current={actief ? "page" : undefined}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={i.pad} />
              </svg>
              {i.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
