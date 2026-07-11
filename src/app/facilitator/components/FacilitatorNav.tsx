"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/data/supabase/browser-client";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import type { Profile } from "@/data/supabase/database.types";

const NAV_LINKS = [
  { label: "Overview", href: "/facilitator" },
  { label: "Participants", href: "/facilitator/participants" },
  { label: "Matches", href: "/facilitator/matching" },
  { label: "Cohorts", href: "/map" },
  { label: "Settings", href: "/facilitator/settings" },
];

export default function FacilitatorNav({ facilitator }: { facilitator: Profile }) {
  const router = useRouter();
  const initials =
    `${facilitator.first_name?.[0] ?? ""}${facilitator.last_name?.[0] ?? ""}`.toUpperCase();

  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <AppHeader
      homeHref="/facilitator"
      subtitle="Facilitator"
      navItems={NAV_LINKS}
      roleLabel="Facilitator"
      actions={
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="quiet"
              size="icon"
              className="text-on-dark hover:bg-spruce-700 hover:text-on-dark rounded-full"
              aria-label="Open account menu"
            >
              <Avatar size="sm" variant="default">
                <AvatarFallback>{initials || "F"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-2">
              <p className="font-semibold">
                {facilitator.first_name} {facilitator.last_name}
              </p>
              <p className="text-ink-soft text-xs">Facilitator</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-berry-700 gap-2">
              <LogOut />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      }
    />
  );
}
