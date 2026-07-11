"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { List, Map as MapIcon, MapPin, Search, SlidersHorizontal } from "lucide-react";
import type { Profile, Connection } from "@/types/database";
import ParticipantMap from "./ParticipantMap";

const PROVINCES = [
  "All provinces",
  "Alberta", "British Columbia", "Manitoba", "New Brunswick",
  "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia",
  "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon",
];

const FAITHS = [
  "All faiths",
  "Indigenous Traditional", "Christian", "Muslim", "Jewish",
  "Hindu", "Buddhist", "Atheist", "Other",
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

  const connectionMap = new globalThis.Map<string, (typeof connections)[number]>(
    connections.map((c) => {
      const otherId =
        c.participant_a_id === currentUser.id ? c.participant_b_id : c.participant_a_id;
      return [otherId, c] as [string, (typeof connections)[number]];
    })
  );

  const filtered = participants.filter((p) => {
    const name = `${p.first_name} ${p.last_name}`.toLowerCase();
    const matchesSearch =
      !search || name.includes(search.toLowerCase()) ||
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
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, city, or interest…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={province} onValueChange={(v) => setProvince(v ?? "All provinces")}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PROVINCES.map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={background} onValueChange={(v) => setBackground(v ?? "all")}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Background" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All backgrounds</SelectItem>
            <SelectItem value="indigenous">Indigenous</SelectItem>
            <SelectItem value="non_indigenous">Non-Indigenous</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-1 border border-border rounded-lg p-1">
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

      <p className="text-sm text-muted-foreground">
        {filtered.length} participant{filtered.length !== 1 ? "s" : ""}
      </p>

      {viewMode === "map" ? (
        <ParticipantMap participants={filtered} currentUser={currentUser} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((participant) => {
            const connection = connectionMap.get(participant.id);
            const initials =
              `${participant.first_name?.[0] ?? ""}${participant.last_name?.[0] ?? ""}`.toUpperCase();

            return (
              <Card key={participant.id} className="border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">
                        {initials || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {participant.first_name} {participant.last_name}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="text-xs text-muted-foreground truncate">
                          {participant.city}, {participant.province}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant={participant.is_indigenous ? "default" : "secondary"}
                      className="text-xs shrink-0"
                    >
                      {participant.is_indigenous ? "Indigenous" : "Non-Ind."}
                    </Badge>
                  </div>

                  {participant.interests.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {participant.interests.slice(0, 3).map((i) => (
                        <Badge key={i} variant="outline" className="text-xs capitalize">{i}</Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/profile/${participant.id}`}>View</Link>
                    </Button>
                    {connection ? (
                      <Button size="sm" className="flex-1" asChild>
                        <Link href={`/connections/${connection.id}`}>
                          {connection.status === "active" ? "Chat" : "Pending"}
                        </Link>
                      </Button>
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

          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-muted-foreground">
              No participants match your filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
