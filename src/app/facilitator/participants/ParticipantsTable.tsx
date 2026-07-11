"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { CheckCircle2, Circle, Clock, Search, ChevronLeft, ChevronRight } from "lucide-react";
import type { Profile } from "@/data/supabase/database.types";

const PAGE_SIZE = 10;

type BackgroundFilter = "all" | "indigenous" | "non_indigenous";
type JourneyFilter = "all" | "ready" | "learning" | "onboarding";

type Props = {
  participants: Profile[];
};

export default function ParticipantsTable({ participants }: Props) {
  const [search, setSearch] = useState("");
  const [background, setBackground] = useState<BackgroundFilter>("all");
  const [journey, setJourney] = useState<JourneyFilter>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return participants.filter((p) => {
      const query = search.trim().toLowerCase();
      if (query) {
        const name = `${p.first_name ?? ""} ${p.last_name ?? ""}`.toLowerCase();
        const city = (p.city ?? "").toLowerCase();
        const province = (p.province ?? "").toLowerCase();
        if (!name.includes(query) && !city.includes(query) && !province.includes(query)) {
          return false;
        }
      }
      if (background !== "all") {
        const isIndigenous = background === "indigenous";
        if (p.is_indigenous !== isIndigenous) return false;
      }
      if (journey !== "all") {
        if (journey === "ready" && !p.learning_completed) return false;
        if (journey === "learning" && (!p.onboarding_completed || p.learning_completed))
          return false;
        if (journey === "onboarding" && p.onboarding_completed) return false;
      }
      return true;
    });
  }, [participants, search, background, journey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  function resetToFirstPage<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v);
      setPage(1);
    };
  }

  const backgroundLabels: Record<BackgroundFilter, string> = {
    all: "All backgrounds",
    indigenous: "Indigenous",
    non_indigenous: "Non-Indigenous",
  };

  const journeyLabels: Record<JourneyFilter, string> = {
    all: "All statuses",
    ready: "Ready",
    learning: "Learning",
    onboarding: "Onboarding",
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search by name, city, or province…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={background}
          onValueChange={(v) =>
            resetToFirstPage(setBackground)((v as BackgroundFilter) ?? "all")
          }
        >
          <SelectTrigger className="w-full sm:w-48">
            <span className="truncate">{backgroundLabels[background]}</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All backgrounds</SelectItem>
            <SelectItem value="indigenous">Indigenous</SelectItem>
            <SelectItem value="non_indigenous">Non-Indigenous</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={journey}
          onValueChange={(v) => resetToFirstPage(setJourney)((v as JourneyFilter) ?? "all")}
        >
          <SelectTrigger className="w-full sm:w-40">
            <span className="truncate">{journeyLabels[journey]}</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="learning">Learning</SelectItem>
            <SelectItem value="onboarding">Onboarding</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="text-muted-foreground text-sm">
        Showing {pageItems.length === 0 ? 0 : start + 1}–{start + pageItems.length} of{" "}
        {filtered.length} participant{filtered.length !== 1 ? "s" : ""}
        {filtered.length !== participants.length && (
          <>
            {" "}
            <button
              onClick={() => {
                setSearch("");
                setBackground("all");
                setJourney("all");
                setPage(1);
              }}
              className="text-primary underline underline-offset-2"
            >
              Clear filters
            </button>
          </>
        )}
      </p>

      {/* Table */}
      <div className="rtr-table-wrap">
        <table className="rtr-table">
          <thead>
            <tr>
              <th>Name</th>
              <th className="hidden sm:table-cell">Location</th>
              <th className="hidden md:table-cell">Background</th>
              <th>Journey</th>
              <th className="hidden lg:table-cell">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-muted-foreground py-8 text-center text-sm">
                  No participants match your filters.
                </td>
              </tr>
            ) : (
              pageItems.map((p) => {
                const initials =
                  `${p.first_name?.[0] ?? ""}${p.last_name?.[0] ?? ""}`.toUpperCase();
                const progressStep = p.learning_completed ? 3 : p.onboarding_completed ? 2 : 1;
                const progressPct = (progressStep / 3) * 100;

                return (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/profile/${p.id}`}
                        className="flex items-center gap-2 hover:underline"
                      >
                        <Avatar size="sm" variant="default">
                          <AvatarFallback>{initials || "?"}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          {p.first_name} {p.last_name}
                        </span>
                      </Link>
                    </td>
                    <td className="text-muted-foreground hidden px-4 py-3 sm:table-cell">
                      {p.city ? `${p.city}, ${p.province}` : "—"}
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <Badge
                        variant={p.is_indigenous ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {p.is_indigenous ? "Indigenous" : "Non-Indigenous"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex min-w-24 items-center gap-2">
                        <Progress value={progressPct} className="h-1.5 flex-1" />
                        {p.learning_completed ? (
                          <Badge variant="matched" className="gap-1 text-xs whitespace-nowrap">
                            <CheckCircle2 className="h-3 w-3" />
                            Ready
                          </Badge>
                        ) : p.onboarding_completed ? (
                          <Badge className="bg-ochre-100 text-ochre-700 border-ochre-200 gap-1 border text-xs whitespace-nowrap">
                            <Clock className="h-3 w-3" />
                            Learning
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1 text-xs whitespace-nowrap">
                            <Circle className="h-3 w-3" />
                            Onboarding
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="text-muted-foreground hidden px-4 py-3 text-xs lg:table-cell">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
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
