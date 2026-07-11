"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";
import type { Profile, Connection } from "@/data/supabase/database.types";

const PAGE_SIZE = 10;

type StatusFilter = "all" | "active" | "pending" | "pending_review";

type Props = {
  connections: Connection[];
  partners: Profile[];
  currentUserId: string;
};

export default function ConnectionsTab({ connections, partners, currentUserId }: Props) {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const partnerMap = new Map(partners.map((p) => [p.id, p]));

  const filtered = useMemo(() => {
    if (filter === "all") return connections;
    return connections.filter((c) => c.status === filter);
  }, [connections, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  const filterLabels: Record<StatusFilter, string> = {
    all: "All statuses",
    active: "Active",
    pending: "Pending",
    pending_review: "Under review",
  };

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
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Select
          value={filter}
          onValueChange={(v) => {
            setFilter(((v as StatusFilter) ?? "all"));
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-48">
            <span className="truncate">{filterLabels[filter]}</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="pending_review">Under review</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-muted-foreground text-sm">
          Showing {pageItems.length === 0 ? 0 : start + 1}–{start + pageItems.length} of{" "}
          {filtered.length}
        </p>
      </div>

      {/* List */}
      <div className="space-y-2">
        {pageItems.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center text-sm">
            No connections match this filter.
          </p>
        ) : (
          pageItems.map((connection) => {
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
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Badge variant="secondary" className="gap-1 text-xs">
                            <Clock className="h-3 w-3" />
                            Under review
                          </Badge>
                        }
                      />
                      <TooltipContent>
                        Waiting for a facilitator to approve this match
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    (() => {
                      const iAmA = connection.participant_a_id === currentUserId;
                      const iConnected = iAmA
                        ? connection.participant_a_connected
                        : connection.participant_b_connected;
                      const tip = iConnected
                        ? `Waiting for ${partner.first_name} to accept`
                        : `${partner.first_name} is waiting for you to accept`;
                      return (
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Badge variant="secondary" className="gap-1 text-xs">
                                <Clock className="h-3 w-3" />
                                Pending
                              </Badge>
                            }
                          />
                          <TooltipContent>{tip}</TooltipContent>
                        </Tooltip>
                      );
                    })()
                  )}
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-2 pt-2">
          <span className="text-muted-foreground text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
