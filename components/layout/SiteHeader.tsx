"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/play", label: "Fight" },
  { href: "/stats", label: "Stats" },
  { href: "/settings", label: "Settings" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between gap-4 border-b border-line/70 bg-ink/40 px-4 py-3 backdrop-blur-md sm:px-6">
      <Link
        href="/"
        className="font-display text-lg tracking-[0.28em] text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mint"
      >
        WORD<span className="text-mint">STRIKE</span>
      </Link>
      <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-3">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-mint ${
                active ? "bg-mint/10 text-mint" : "text-fog hover:text-paper"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
