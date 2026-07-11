"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/data/supabase/browser-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CheckCircle2, XCircle, Plus, Zap, MapPin } from "lucide-react";
import { toast } from "sonner";
import type { Match, Profile, Connection } from "@/data/supabase/database.types";
import { computeMatches, criteriaLabels } from "@/domain/profile-matching";
import { PageIntro } from "@/components/page-intro";

type Props = {
  matches: Match[];
  pendingReviewConnections: Connection[];
  profileMap: Record<string, Profile>;
  indigenous: Profile[];
  nonIndigenous: Profile[];
  facilitatorId: string;
  autoMatchingEnabled: boolean;
};

export default function MatchingClient({
  matches,
  pendingReviewConnections,
  profileMap,
  indigenous,
  nonIndigenous,
  facilitatorId,
  autoMatchingEnabled: initialAutoMatching,
}: Props) {
  const [autoMatching, setAutoMatching] = useState(initialAutoMatching);
  const [matchList, setMatchList] = useState<Match[]>(matches);
  const [reviewList, setReviewList] = useState<Connection[]>(pendingReviewConnections);
  const [profileDialog, setProfileDialog] = useState<Profile | null>(null);
  const [selectedIndigenous, setSelectedIndigenous] = useState("");
  const [selectedNonIndigenous, setSelectedNonIndigenous] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const supabase = createSupabaseBrowserClient();

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
            : m,
        ),
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
          for (const userId of [
            match.indigenous_participant_id,
            match.non_indigenous_participant_id,
          ]) {
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
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      <PageIntro
        eyebrow="Facilitated introductions"
        title="Match management"
        description="Review, approve, or create matches between Indigenous and non-Indigenous participants."
        actions={
          <div className="border-border bg-parchment shadow-rtr-1 flex items-center gap-3 rounded-xl border px-4 py-3">
            <Zap className="text-spruce-600 size-4" />
            <Label htmlFor="auto-matching" className="cursor-pointer">
              Auto-matching
            </Label>
            <Switch
              id="auto-matching"
              checked={autoMatching}
              onCheckedChange={toggleAutoMatching}
            />
          </div>
        }
      />

      {/* Manual match creation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="h-4 w-4" />
            Create manual match
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Select
              value={selectedIndigenous}
              onValueChange={(v) => setSelectedIndigenous(v ?? "")}
            >
              <SelectTrigger className="flex-1">
                <span className="truncate">
                  {selectedIndigenous
                    ? (() => {
                        const p = indigenous.find((p) => p.id === selectedIndigenous);
                        return p ? `${p.first_name} ${p.last_name} — ${p.city}` : "";
                      })()
                    : "Select Indigenous participant"}
                </span>
              </SelectTrigger>
              <SelectContent>
                {indigenous.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.first_name} {p.last_name} — {p.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedNonIndigenous}
              onValueChange={(v) => setSelectedNonIndigenous(v ?? "")}
            >
              <SelectTrigger className="flex-1">
                <span className="truncate">
                  {selectedNonIndigenous
                    ? (() => {
                        const p = nonIndigenous.find((p) => p.id === selectedNonIndigenous);
                        return p ? `${p.first_name} ${p.last_name} — ${p.city}` : "";
                      })()
                    : "Select Non-Indigenous participant"}
                </span>
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
            {suggested.length > 0 && <Badge className="ml-1.5 text-xs">{suggested.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="mutual">
            Mutual connect requests
            {reviewList.length > 0 && (
              <Badge className="ml-1.5 text-xs">{reviewList.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="mutual" className="mt-4 space-y-3">
          {reviewList.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center text-sm">
              No mutual connect requests awaiting review.
            </p>
          ) : (
            reviewList.map((conn) => {
              const a = profileMap[conn.participant_a_id];
              const b = profileMap[conn.participant_b_id];
              if (!a || !b) return null;
              return (
                <Card key={conn.id} className="border-border">
                  <CardContent className="p-5 flex flex-col sm:flex-row gap-4 items-start">
                    <div className="flex flex-1 items-center gap-3">
                      {[a, b].map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setProfileDialog(p)}
                          className="hover:bg-muted/50 flex items-center gap-2 rounded-lg p-1 text-left transition-colors"
                        >
                          <Avatar size="sm" variant="default">
                            <AvatarFallback>
                              {`${p.first_name?.[0] ?? ""}${p.last_name?.[0] ?? ""}`.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium underline-offset-2 hover:underline">
                              {p.first_name} {p.last_name}
                            </p>
                            <Badge
                              variant={p.is_indigenous ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {p.is_indigenous ? "Indigenous" : "Non-Ind."}
                            </Badge>
                            <p className="text-muted-foreground mt-0.5 text-xs">
                              {p.city}, {p.province}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2 sm:flex-col shrink-0">
                      <Button
                        size="sm"
                        onClick={async () => {
                          const { error } = await supabase
                            .from("connections")
                            .update({
                              status: "active",
                              connected_at: new Date().toISOString(),
                            })
                            .eq("id", conn.id);
                          if (error) {
                            toast.error("Failed to approve.");
                            return;
                          }
                          setReviewList((prev) => prev.filter((c) => c.id !== conn.id));
                          await supabase.from("notifications").insert([
                            {
                              user_id: conn.participant_a_id,
                              type: "match_approved",
                              title: "Your connection has been approved!",
                              body: "Visit your connections to start chatting.",
                              data: { connection_id: conn.id },
                            },
                            {
                              user_id: conn.participant_b_id,
                              type: "match_approved",
                              title: "Your connection has been approved!",
                              body: "Visit your connections to start chatting.",
                              data: { connection_id: conn.id },
                            },
                          ]);
                          toast.success("Connection approved.");
                        }}
                        className="gap-1.5 flex-1 sm:flex-none"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          const { error } = await supabase
                            .from("connections")
                            .delete()
                            .eq("id", conn.id);
                          if (error) {
                            toast.error("Failed to reject.");
                            return;
                          }
                          setReviewList((prev) => prev.filter((c) => c.id !== conn.id));
                          toast.success("Connection rejected.");
                        }}
                        className="gap-1.5 flex-1 sm:flex-none"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        {[
          { key: "suggested", list: suggested },
          { key: "approved", list: approved },
          { key: "rejected", list: rejected },
        ].map(({ key, list }) => (
          <TabsContent key={key} value={key} className="mt-4 space-y-3">
            {list.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center text-sm">No {key} matches.</p>
            ) : (
              list.map((match) => {
                const ind = profileMap[match.indigenous_participant_id];
                const nonInd = profileMap[match.non_indigenous_participant_id];
                if (!ind || !nonInd) return null;

                const criteria = match.match_criteria as Record<string, number>;
                const labels = criteriaLabels(
                  criteria as Parameters<typeof criteriaLabels>[0],
                ).filter((l) => l.points > 0);

                return (
                  <Card key={match.id} className="border-border">
                    <CardContent className="p-5">
                      <div className="flex flex-col gap-4 sm:flex-row">
                        {/* Participants */}
                        <div className="flex flex-1 items-center gap-3">
                          {[ind, nonInd].map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => setProfileDialog(p)}
                              className="hover:bg-muted/50 flex items-center gap-2 rounded-lg p-1 text-left transition-colors"
                            >
                              <Avatar size="sm" variant="default">
                                <AvatarFallback>
                                  {`${p.first_name?.[0] ?? ""}${p.last_name?.[0] ?? ""}`.toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium underline-offset-2 hover:underline">
                                  {p.first_name} {p.last_name}
                                </p>
                                <Badge
                                  variant={p.is_indigenous ? "default" : "secondary"}
                                  className="text-xs"
                                >
                                  {p.is_indigenous ? "Indigenous" : "Non-Ind."}
                                </Badge>
                                <p className="text-muted-foreground mt-0.5 text-xs">
                                  {p.city}, {p.province}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>

                        {/* Score & criteria */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-primary text-2xl font-bold">
                              {Math.round(match.match_score ?? 0)}%
                            </span>
                            <Progress value={match.match_score ?? 0} className="h-2 flex-1" />
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {labels.map((l) => (
                              <Badge key={l.label} variant="outline" className="gap-1 text-xs">
                                {l.label}
                                <span className="text-primary font-medium">+{l.points}</span>
                              </Badge>
                            ))}
                            {match.auto_generated ? (
                              <Badge variant="secondary" className="gap-1 text-xs">
                                <Zap className="h-2.5 w-2.5" />
                                Auto
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">
                                Manual
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        {key === "suggested" && (
                          <div className="flex shrink-0 gap-2 sm:flex-col">
                            <Button
                              size="sm"
                              onClick={() => updateMatchStatus(match.id, "approved")}
                              disabled={updating === match.id}
                              className="flex-1 gap-1.5 sm:flex-none"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateMatchStatus(match.id, "rejected")}
                              disabled={updating === match.id}
                              className="text-destructive border-destructive/30 hover:bg-destructive/10 flex-1 gap-1.5 sm:flex-none"
                            >
                              <XCircle className="h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        )}

                        {key === "approved" && (
                          <Badge variant="matched" className="self-start">
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

      {/* Participant profile dialog */}
      <Dialog open={profileDialog !== null} onOpenChange={(open) => !open && setProfileDialog(null)}>
        <DialogContent className="max-w-lg p-6 sm:p-8">
          {profileDialog && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-3">
                  <Avatar size="lg" variant="default">
                    <AvatarFallback>
                      {`${profileDialog.first_name?.[0] ?? ""}${profileDialog.last_name?.[0] ?? ""}`.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <DialogTitle>
                      {profileDialog.first_name} {profileDialog.last_name}
                    </DialogTitle>
                    <DialogDescription>
                      <span className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant={profileDialog.is_indigenous ? "default" : "secondary"}>
                          {profileDialog.is_indigenous ? "Indigenous" : "Non-Indigenous"}
                        </Badge>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {profileDialog.city}, {profileDialog.province}
                        </span>
                      </span>
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 pt-2 text-sm">
                {profileDialog.bio && (
                  <div>
                    <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-1">About</p>
                    <p>{profileDialog.bio}</p>
                  </div>
                )}

                {profileDialog.treaty_area && (
                  <div>
                    <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-1">Treaty area</p>
                    <p>{profileDialog.treaty_area}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {profileDialog.faith_tradition && (
                    <div>
                      <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-1">Faith</p>
                      <p className="capitalize">
                        {profileDialog.faith_tradition === "other"
                          ? profileDialog.faith_tradition_other
                          : profileDialog.faith_tradition.replace(/_/g, " ")}
                      </p>
                    </div>
                  )}
                  {profileDialog.language_preferences.length > 0 && (
                    <div>
                      <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-1">Languages</p>
                      <p className="capitalize">{profileDialog.language_preferences.join(", ")}</p>
                    </div>
                  )}
                  {profileDialog.participation_format.length > 0 && (
                    <div>
                      <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-1">Format</p>
                      <p className="capitalize">
                        {profileDialog.participation_format.map((f) => f.replace(/_/g, " ")).join(", ")}
                      </p>
                    </div>
                  )}
                  {profileDialog.sex && (
                    <div>
                      <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-1">Sex</p>
                      <p className="capitalize">{profileDialog.sex.replace(/_/g, " ")}</p>
                    </div>
                  )}
                </div>

                {profileDialog.participation_categories.length > 0 && (
                  <div>
                    <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-1">Roles</p>
                    <div className="flex flex-wrap gap-1">
                      {profileDialog.participation_categories.map((c) => (
                        <Badge key={c} variant="outline" className="text-xs capitalize">
                          {c.replace(/_/g, " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {profileDialog.interests.length > 0 && (
                  <div>
                    <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-1">Interests</p>
                    <div className="flex flex-wrap gap-1">
                      {profileDialog.interests.map((i) => (
                        <Badge key={i} variant="secondary" className="text-xs capitalize">
                          {i}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {profileDialog.personal_boundaries && (
                  <div>
                    <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-1">Personal boundaries</p>
                    <p>{profileDialog.personal_boundaries}</p>
                  </div>
                )}

                {profileDialog.additional_matching_info && (
                  <div>
                    <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-1">Additional info</p>
                    <p>{profileDialog.additional_matching_info}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
