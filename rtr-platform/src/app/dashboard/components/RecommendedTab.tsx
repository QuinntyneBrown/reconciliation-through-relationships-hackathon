"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { MapPin, Heart } from "lucide-react";
import type { Profile, Match, Connection } from "@/types/database";
import type { MatchResult } from "@/lib/matching";
import { criteriaLabels } from "@/lib/matching";

type Props = {
  matches: MatchResult[];
  approvedMatches: Match[];
  connections: Connection[];
  currentUser: Profile;
};

export default function RecommendedTab({ matches, approvedMatches, connections, currentUser }: Props) {
  if (matches.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <Heart className="h-10 w-10 mx-auto mb-4 opacity-30" />
        <p className="font-medium">No recommendations yet</p>
        <p className="text-sm mt-1">
          A facilitator is reviewing potential matches for you. Check back soon.
        </p>
      </div>
    );
  }

  const connectionMap = new Map(
    connections.map((c) => {
      const otherId =
        c.participant_a_id === currentUser.id ? c.participant_b_id : c.participant_a_id;
      return [otherId, c];
    })
  );

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Your top {matches.length} recommended connection{matches.length !== 1 ? "s" : ""},
        reviewed by RTR facilitators.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {matches.map(({ participant, score, criteria }) => {
          const connection = connectionMap.get(participant.id);
          const initials =
            `${participant.first_name?.[0] ?? ""}${participant.last_name?.[0] ?? ""}`.toUpperCase();
          const labels = criteriaLabels(criteria).filter((l) => l.points > 0);

          return (
            <Card key={participant.id} className="border-border hover:border-primary/40 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                      {initials || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">
                      {participant.first_name} {participant.last_name}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                      <span className="text-xs text-muted-foreground truncate">
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
                  <div className="text-right shrink-0">
                    <p className="text-2xl font-bold text-primary">{Math.round(score)}%</p>
                    <p className="text-xs text-muted-foreground">match</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Match criteria chips */}
                <div className="flex flex-wrap gap-1">
                  {labels.map((l) => (
                    <Badge key={l.label} variant="outline" className="text-xs gap-1">
                      {l.label}
                      <span className="text-primary font-medium">+{l.points}</span>
                    </Badge>
                  ))}
                </div>

                <Progress value={(score / 100) * 100} className="h-1.5" />

                {participant.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{participant.bio}</p>
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

                <div className="flex gap-2 pt-1">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href={`/profile/${participant.id}`}>View profile</Link>
                  </Button>
                  {connection ? (
                    <Button size="sm" className="flex-1" asChild>
                      <Link href={`/connections/${connection.id}`}>
                        {connection.status === "active" ? "Open chat" : "Pending…"}
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
