"use client";

import { AppHeader } from "@/components/app-header";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/onboarding", label: "Join" },
  { href: "/learn", label: "Learning" },
  { href: "/map", label: "Regional map" },
  { href: "/facilitator", label: "Facilitator" },
];

export function SiteNav() {
  return <AppHeader homeHref="/" navItems={LINKS} />;
}
