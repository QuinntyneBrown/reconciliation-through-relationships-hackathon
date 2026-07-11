"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { List, Map as MapIcon, MapPin, Search, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 9;
import type { Profile, Connection } from "@/data/supabase/database.types";
import ParticipantMap from "./ParticipantMap";

const PROVINCES = [
  "All provinces",
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Northwest Territories",
  "Nova Scotia",
  "Nunavut",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Yukon",
];

const FAITHS = [
  "All faiths",
  "Indigenous Traditional",
  "Christian",
  "Muslim",
  "Jewish",
  "Hindu",
  "Buddhist",
  "Atheist",
  "Other",
];

type Props = {
  participants: Profile[];
  currentUser: Profile;
  connections: Connection[];
};

export default function AllParticipantsTab({ participants, currentUser, connections }: Props) {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [search, setSearch] = useState("");
  const [province, setProvince] = useState("All provinces");
  const [faith, setFaith] = useState("All faiths");
  const [background, setBackground] = useState("all");
  const [page, setPage] = useState(1);

  const connectionMap = new globalThis.Map<string, (typeof connections)[number]>(
    connections.map((c) => {
      const otherId =
        c.participant_a_id === currentUser.id ? c.participant_b_id : c.participant_a_id;
      return [otherId, c] as [string, (typeof connections)[number]];
    }),
  );

  const filtered = participants.filter((p) => {
    const name = `${p.first_name} ${p.last_name}`.toLowerCase();
    const matchesSearch =
      !search ||
      name.includes(search.toLowerCase()) ||
      p.city?.toLowerCase().includes(search.toLowerCase()) ||
      p.interests.some((i) => i.includes(search.toLowerCase()));
    const matchesProvince = province === "All provinces" || p.province === province;
    const matchesFaith =
      faith === "All faiths" ||
      p.faith_tradition?.toLowerCase() === faith.toLowerCase().replace(/ /g, "_");
    const matchesBackground =
      background === "all" ||
      (background === "indigenous" && p.is_indigenous) ||
      (background === "non_indigenous" && !p.is_indigenous);

    return matchesSearch && matchesProvince && matchesFaith && matchesBackground;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search by name, city, or interest…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={province}
          onValueChange={(v) => {
            setProvince(v ?? "All provinces");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PROVINCES.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={background}
          onValueChange={(v) => {
            setBackground(v ?? "all");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Background" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All backgrounds</SelectItem>
            <SelectItem value="indigenous">Indigenous</SelectItem>
            <SelectItem value="non_indigenous">Non-Indigenous</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={faith}
          onValueChange={(v) => {
            setFaith(v ?? "All faiths");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Faith tradition" />
          </SelectTrigger>
          <SelectContent>
            {FAITHS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="border-border flex gap-1 rounded-lg border p-1">
          <Button
            size="sm"
            variant={viewMode === "list" ? "default" : "ghost"}
            onClick={() => setViewMode("list")}
            className="gap-1.5"
          >
            <List className="h-4 w-4" />
            List
          </Button>
          <Button
            size="sm"
            variant={viewMode === "map" ? "default" : "ghost"}
            onClick={() => setViewMode("map")}
            className="gap-1.5"
          >
            <MapIcon className="h-4 w-4" />
            Map
          </Button>
        </div>
      </div>

      {(() => {
        const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
        const currentPage = Math.min(page, totalPages);
        const start = (currentPage - 1) * PAGE_SIZE;
        const pageItems = viewMode === "map" ? filtered : filtered.slice(start, start + PAGE_SIZE);

        return (
          <>
            <p className="text-muted-foreground text-sm">
              {viewMode === "list" && filtered.length > 0
                ? `Showing ${start + 1}–${start + pageItems.length} of ${filtered.length}`
                : `${filtered.length} participant${filtered.length !== 1 ? "s" : ""}`}
            </p>

            {viewMode === "map" ? (
              <ParticipantMap participants={filtered} />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
                  {pageItems.map((participant) => {
            const connection = connectionMap.get(participant.id);
            const initials =
              `${participant.first_name?.[0] ?? ""}${participant.last_name?.[0] ?? ""}`.toUpperCase();

            return (
              <Card
                key={participant.id}
                className="border-border hover:border-primary/30 transition-colors flex flex-col h-full"
              >
                <CardContent className="space-y-3 p-4 flex flex-col flex-1">
                  <div className="flex items-start gap-3">
                    <Avatar variant="default">
                      <AvatarFallback>{initials || "?"}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">
                        {participant.first_name} {participant.last_name}
                      </p>
                      <div className="mt-0.5 flex items-center gap-1">
                        <MapPin className="text-muted-foreground h-3 w-3 shrink-0" />
                        <span className="text-muted-foreground truncate text-xs">
                          {participant.city}, {participant.province}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant={participant.is_indigenous ? "default" : "secondary"}
                      className="shrink-0 text-xs"
                    >
                      {participant.is_indigenous ? "Indigenous" : "Non-Ind."}
                    </Badge>
                  </div>

                  {participant.interests.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {participant.interests.slice(0, 3).map((i) => (
                        <Badge key={i} variant="outline" className="text-xs capitalize">
                          {i}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 mt-auto">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/profile/${participant.id}`}>View</Link>
                    </Button>
                    {connection ? (
                      (() => {
                        const isActive = connection.status === "active";
                        const isReview = connection.status === "pending_review";
                        const iAmA = connection.participant_a_id === currentUser.id;
                        const iConnected = iAmA
                          ? connection.participant_a_connected
                          : connection.participant_b_connected;
                        const tooltip = isActive
                          ? "Open chat"
                          : isReview
                            ? "Waiting for a facilitator to approve this match"
                            : iConnected
                              ? `Waiting for ${participant.first_name} to accept`
                              : `${participant.first_name} is waiting for you to accept`;

                        const btn = (
                          <Button size="sm" className="flex-1" asChild>
                            <Link href={`/connections/${connection.id}`}>
                              {isActive ? "Chat" : "Pending"}
                            </Link>
                          </Button>
                        );
                        return isActive ? (
                          btn
                        ) : (
                          <Tooltip>
                            <TooltipTrigger render={<div className="flex-1" />}>{btn}</TooltipTrigger>
                            <TooltipContent>{tooltip}</TooltipContent>
                          </Tooltip>
                        );
                      })()
                    ) : (
                      <Button size="sm" variant="secondary" className="flex-1" asChild>
                        <Link href={`/profile/${participant.id}`}>Connect</Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}

                  {pageItems.length === 0 && (
                    <div className="text-muted-foreground col-span-full py-16 text-center">
                      No participants match your filters.
                    </div>
                  )}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between gap-2 pt-4">
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
              </>
            )}
          </>
        );
      })()}
    </div>
  );
}
