"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { LogOut } from "lucide-react";
import type { Profile } from "@/types/database";

const NAV_LINKS = [
  { label: "Overview", href: "/admin" },
  { label: "Participants", href: "/admin/participants" },
  { label: "Matches", href: "/admin/matches" },
  { label: "Cohorts", href: "/admin/cohorts" },
  { label: "Settings", href: "/admin/settings" },
];

export default function AdminNav({ facilitator }: { facilitator: Profile }) {
  const router = useRouter();
  const initials =
    `${facilitator.first_name?.[0] ?? ""}${facilitator.last_name?.[0] ?? ""}`.toUpperCase();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <header className="border-b border-border bg-card sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-6">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="font-bold text-primary">RTR</span>
          <Badge variant="secondary" className="text-xs">Facilitator</Badge>
        </Link>

        <nav className="hidden sm:flex items-center gap-1 flex-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full ml-auto">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {initials || "F"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">
                {facilitator.first_name} {facilitator.last_name}
              </p>
              <p className="text-xs text-muted-foreground">Facilitator</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="gap-2 text-destructive">
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
