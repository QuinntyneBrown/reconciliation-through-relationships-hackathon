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
import { LogOut, User } from "lucide-react";
import type { Profile } from "@/data/supabase/database.types";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home" },
  { href: "/learn", label: "Learning" },
  { href: "/connections", label: "Connections" },
  { href: "/map", label: "Regional map" },
];

export default function DashboardNav({ user }: { user: Profile }) {
  const router = useRouter();
  const initials = `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase();

  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <AppHeader
      homeHref="/dashboard"
      navItems={NAV_ITEMS}
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
                <AvatarFallback>{initials || "?"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-2">
              <p className="font-semibold">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-ink-soft text-xs capitalize">
                {user.is_indigenous ? "Indigenous" : "Non-Indigenous"} participant
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push(`/profile/${user.id}`)} className="gap-2">
              <User />
              My profile
            </DropdownMenuItem>
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
