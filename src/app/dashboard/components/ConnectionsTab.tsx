"use client";

import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { Clock } from "lucide-react";
import type { Profile, Connection } from "@/data/supabase/database.types";

type Props = {
  connections: Connection[];
  partners: Profile[];
  currentUserId: string;
};

export default function ConnectionsTab({ connections, partners, currentUserId }: Props) {
  const partnerMap = new Map(partners.map((p) => [p.id, p]));

  if (connections.length === 0) {
    return (
      <EmptyState
        title="No active connections yet"
        description="Your facilitator reviews every match personally. While you wait, keep your profile current so recommendations reflect who you are."
        action={
          <Button asChild variant="secondary">
            <Link href="#recommended">Explore recommendations</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-2">
      {connections.map((connection) => {
        const partnerId =
          connection.participant_a_id === currentUserId
            ? connection.participant_b_id
            : connection.participant_a_id;
        const partner = partnerMap.get(partnerId);
        if (!partner) return null;

        const initials =
          `${partner.first_name?.[0] ?? ""}${partner.last_name?.[0] ?? ""}`.toUpperCase();
        const status = connection.status;

        return (
          <Link
            key={connection.id}
            href={`/connections/${connection.id}`}
            className="border-border bg-parchment hover:border-spruce-600 shadow-rtr-1 flex items-center gap-4 rounded-2xl border p-5 no-underline transition-colors"
          >
            <Avatar>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">
                {partner.first_name} {partner.last_name}
              </p>
              <p className="text-muted-foreground text-xs">
                {partner.city}, {partner.province}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {status === "active" ? (
                <Badge variant="matched">Active</Badge>
              ) : status === "pending_review" ? (
                <Badge variant="secondary" className="gap-1 text-xs">
                  <Clock className="h-3 w-3" />
                  Under facilitator review
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1 text-xs">
                  <Clock className="h-3 w-3" />
                  Pending
                </Badge>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
