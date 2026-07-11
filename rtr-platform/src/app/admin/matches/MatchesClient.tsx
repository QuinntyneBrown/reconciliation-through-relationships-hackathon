"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, Plus, Zap } from "lucide-react";
import { toast } from "sonner";
import type { Match, Profile } from "@/types/database";
import { computeMatches, criteriaLabels } from "@/lib/matching";

type Props = {
  matches: Match[];
  profileMap: Record<string, Profile>;
  indigenous: Profile[];
  nonIndigenous: Profile[];
  facilitatorId: string;
  autoMatchingEnabled: boolean;
};

export default function MatchesClient({
  matches,
  profileMap,
  indigenous,
  nonIndigenous,
  facilitatorId,
  autoMatchingEnabled: initialAutoMatching,
}: Props) {
  const [autoMatching, setAutoMatching] = useState(initialAutoMatching);
  const [matchList, setMatchList] = useState<Match[]>(matches);
  const [selectedIndigenous, setSelectedIndigenous] = useState("");
  const [selectedNonIndigenous, setSelectedNonIndigenous] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const suggested = matchList.filter((m) => m.status === "suggested");
  const approved = matchList.filter((m) => m.status === "approved" || m.status === "connected");
  const rejected = matchList.filter((m) => m.status === "rejected");

  async function toggleAutoMatching(enabled: boolean) {
    setAutoMatching(enabled);
    await supabase
      .from("system_settings")
      .update({ value: enabled })
      .eq("key", "auto_matching_enabled");
  }

  async function updateMatchStatus(matchId: string, status: "approved" | "rejected") {
    setUpdating(matchId);
    const { error } = await supabase
      .from("matches")
      .update({
        status,
        approved_by: status === "approved" ? facilitatorId : undefined,
        approved_at: status === "approved" ? new Date().toISOString() : undefined,
      })
      .eq("id", matchId);

    if (error) {
      toast.error("Failed to update match.");
    } else {
      setMatchList((prev) =>
        prev.map((m) =>
          m.id === matchId
            ? { ...m, status, approved_by: facilitatorId, approved_at: new Date().toISOString() }
            : m
        )
      );

      if (status === "approved") {
        const match = matchList.find((m) => m.id === matchId);
        if (match) {
          // Create connection
          await supabase.from("connections").insert({
            match_id: matchId,
            participant_a_id: match.indigenous_participant_id,
            participant_b_id: match.non_indigenous_participant_id,
          });

          // Notify both participants
          for (const userId of [match.indigenous_participant_id, match.non_indigenous_participant_id]) {
            await supabase.from("notifications").insert({
              user_id: userId,
              type: "match_approved",
              title: "Your match has been approved!",
              body: "A facilitator has approved your connection. Visit your connections to begin.",
              data: { match_id: matchId },
            });
          }

          toast.success("Match approved and participants notified.");
        }
      } else {
        toast.success("Match rejected.");
      }
    }
    setUpdating(null);
  }

  async function createManualMatch() {
    if (!selectedIndigenous || !selectedNonIndigenous) return;

    const indProfile = indigenous.find((p) => p.id === selectedIndigenous);
    const nonIndProfile = nonIndigenous.find((p) => p.id === selectedNonIndigenous);

    if (!indProfile || !nonIndProfile) return;

    const results = computeMatches(indProfile, [nonIndProfile]);
    const matchResult = results[0];
    const score = matchResult?.score ?? 0;
    const criteria = matchResult?.criteria ?? {};

    const { data: newMatch, error } = await supabase
      .from("matches")
      .insert({
        indigenous_participant_id: selectedIndigenous,
        non_indigenous_participant_id: selectedNonIndigenous,
        match_score: score,
        match_criteria: criteria,
        status: "suggested",
        auto_generated: false,
        created_by: facilitatorId,
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to create match.");
      return;
    }

    setMatchList((prev) => [newMatch, ...prev]);
    setSelectedIndigenous("");
    setSelectedNonIndigenous("");
    toast.success("Manual match created.");
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">Match Management</h1>
          <p className="text-sm text-muted-foreground">
            Review, approve, or create matches between Indigenous and non-Indigenous participants.
          </p>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
          <Zap className="h-4 w-4 text-primary" />
          <Label htmlFor="auto-matching" className="cursor-pointer">
            Auto-matching
          </Label>
          <Switch
            id="auto-matching"
            checked={autoMatching}
            onCheckedChange={toggleAutoMatching}
          />
        </div>
      </div>

      {/* Manual match creation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create manual match
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={selectedIndigenous} onValueChange={(v) => setSelectedIndigenous(v ?? "")}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select Indigenous participant" />
              </SelectTrigger>
              <SelectContent>
                {indigenous.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.first_name} {p.last_name} — {p.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedNonIndigenous} onValueChange={(v) => setSelectedNonIndigenous(v ?? "")}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select Non-Indigenous participant" />
              </SelectTrigger>
              <SelectContent>
                {nonIndigenous.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.first_name} {p.last_name} — {p.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={createManualMatch}
              disabled={!selectedIndigenous || !selectedNonIndigenous}
            >
              Create match
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="suggested">
        <TabsList>
          <TabsTrigger value="suggested">
            Pending review
            {suggested.length > 0 && (
              <Badge className="ml-1.5 text-xs">{suggested.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
        </TabsList>

        {[
          { key: "suggested", list: suggested },
          { key: "approved", list: approved },
          { key: "rejected", list: rejected },
        ].map(({ key, list }) => (
          <TabsContent key={key} value={key} className="mt-4 space-y-3">
            {list.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground text-sm">
                No {key} matches.
              </p>
            ) : (
              list.map((match) => {
                const ind = profileMap[match.indigenous_participant_id];
                const nonInd = profileMap[match.non_indigenous_participant_id];
                if (!ind || !nonInd) return null;

                const criteria = match.match_criteria as Record<string, number>;
                const labels = criteriaLabels(criteria as Parameters<typeof criteriaLabels>[0]).filter(
                  (l) => l.points > 0
                );

                return (
                  <Card key={match.id} className="border-border">
                    <CardContent className="p-5">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Participants */}
                        <div className="flex items-center gap-3 flex-1">
                          {[ind, nonInd].map((p) => (
                            <div key={p.id} className="flex items-center gap-2">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback className="text-xs bg-primary/20 text-primary font-semibold">
                                  {`${p.first_name?.[0] ?? ""}${p.last_name?.[0] ?? ""}`.toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">
                                  {p.first_name} {p.last_name}
                                </p>
                                <Badge
                                  variant={p.is_indigenous ? "default" : "secondary"}
                                  className="text-xs"
                                >
                                  {p.is_indigenous ? "Indigenous" : "Non-Ind."}
                                </Badge>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {p.city}, {p.province}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Score & criteria */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-primary">
                              {Math.round(match.match_score ?? 0)}%
                            </span>
                            <Progress
                              value={match.match_score ?? 0}
                              className="flex-1 h-2"
                            />
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {labels.map((l) => (
                              <Badge key={l.label} variant="outline" className="text-xs gap-1">
                                {l.label}
                                <span className="text-primary font-medium">+{l.points}</span>
                              </Badge>
                            ))}
                            {match.auto_generated ? (
                              <Badge variant="secondary" className="text-xs gap-1">
                                <Zap className="h-2.5 w-2.5" />
                                Auto
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">Manual</Badge>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        {key === "suggested" && (
                          <div className="flex gap-2 sm:flex-col shrink-0">
                            <Button
                              size="sm"
                              onClick={() => updateMatchStatus(match.id, "approved")}
                              disabled={updating === match.id}
                              className="gap-1.5 flex-1 sm:flex-none"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateMatchStatus(match.id, "rejected")}
                              disabled={updating === match.id}
                              className="gap-1.5 flex-1 sm:flex-none text-destructive border-destructive/30 hover:bg-destructive/10"
                            >
                              <XCircle className="h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        )}

                        {key === "approved" && (
                          <Badge className="self-start bg-accent/20 text-accent-foreground border-accent/20">
                            {match.status === "connected" ? "Connected" : "Approved"}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        ))}
      </Tabs>
    </main>
  );
}
