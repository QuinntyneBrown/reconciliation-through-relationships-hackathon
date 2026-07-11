"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { MapPin } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import type { Profile, Connection } from "@/data/supabase/database.types";
import type { MatchResult } from "@/domain/profile-matching";
import { criteriaLabels } from "@/domain/profile-matching";

type Props = {
  matches: MatchResult[];
  connections: Connection[];
  currentUser: Profile;
};

export default function RecommendedTab({ matches, connections, currentUser }: Props) {
  if (matches.length === 0) {
    return (
      <EmptyState
        title="No recommendations yet"
        description="A facilitator is reviewing potential matches for you. Check back soon."
      />
    );
  }

  const connectionMap = new Map(
    connections.map((c) => {
      const otherId =
        c.participant_a_id === currentUser.id ? c.participant_b_id : c.participant_a_id;
      return [otherId, c];
    }),
  );

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        Your top {matches.length} recommended connection{matches.length !== 1 ? "s" : ""}, reviewed
        by RTR facilitators.
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 items-stretch">
        {matches.map(({ participant, score, criteria }) => {
          const connection = connectionMap.get(participant.id);
          const initials =
            `${participant.first_name?.[0] ?? ""}${participant.last_name?.[0] ?? ""}`.toUpperCase();
          const labels = criteriaLabels(criteria).filter((l) => l.points > 0);

          return (
            <Card
              key={participant.id}
              className="border-border hover:border-primary/40 transition-colors flex flex-col h-full"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <Avatar variant="default">
                    <AvatarFallback>{initials || "?"}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">
                      {participant.first_name} {participant.last_name}
                    </p>
                    <div className="mt-0.5 flex items-center gap-1">
                      <MapPin className="text-muted-foreground h-3 w-3 shrink-0" />
                      <span className="text-muted-foreground truncate text-xs">
                        {participant.city}, {participant.province}
                      </span>
                    </div>
                    <Badge
                      variant={participant.is_indigenous ? "default" : "secondary"}
                      className="mt-1 text-xs"
                    >
                      {participant.is_indigenous ? "Indigenous" : "Non-Indigenous"}
                    </Badge>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-primary text-2xl font-bold">{Math.round(score)}%</p>
                    <p className="text-muted-foreground text-xs">match</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 flex flex-col flex-1">
                {/* Match criteria chips */}
                <div className="flex flex-wrap gap-1">
                  {labels.map((l) => (
                    <Badge key={l.label} variant="outline" className="gap-1 text-xs">
                      {l.label}
                      <span className="text-primary font-medium">+{l.points}</span>
                    </Badge>
                  ))}
                </div>

                <Progress value={(score / 100) * 100} className="h-1.5" />

                {participant.bio && (
                  <p className="text-muted-foreground line-clamp-2 text-sm">{participant.bio}</p>
                )}

                {/* Shared interests */}
                {participant.interests.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {participant.interests.slice(0, 4).map((interest) => (
                      <Badge key={interest} variant="secondary" className="text-xs capitalize">
                        {interest}
                      </Badge>
                    ))}
                    {participant.interests.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{participant.interests.length - 4} more
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-1 mt-auto">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href={`/profile/${participant.id}`}>View profile</Link>
                  </Button>
                  {connection ? (
                    <Button size="sm" className="flex-1" asChild>
                      <Link href={`/connections/${connection.id}`}>
                        {connection.status === "active"
                          ? "Open chat"
                          : connection.status === "pending_review"
                            ? "Under review…"
                            : "Pending…"}
                      </Link>
                    </Button>
                  ) : (
                    <Button size="sm" className="flex-1" asChild>
                      <Link href={`/profile/${participant.id}`}>Connect</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
