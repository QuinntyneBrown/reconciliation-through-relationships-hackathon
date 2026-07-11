"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/onboarding", label: "Join" },
  { href: "/learn", label: "Learning" },
  { href: "/map", label: "Regional Map" },
  { href: "/facilitator", label: "Facilitator" },
];

export function SiteNav() {
  const pathname = usePathname();
  return (
    <header className="border-b">
      <nav className="mx-auto flex max-w-5xl items-center gap-1 px-4 py-3">
        <Link href="/" className="mr-4 font-semibold">
          RTR
        </Link>
        {LINKS.map((link) => {
          const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-muted-foreground hover:text-foreground rounded-md px-3 py-1.5 text-sm transition-colors",
                active && "bg-muted text-foreground font-medium",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
