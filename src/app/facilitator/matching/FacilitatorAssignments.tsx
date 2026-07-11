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
import { CheckCircle2, XCircle, Plus, Zap, Sparkles } from "lucide-react";
import { toast } from "sonner";
import type { FacilitatorAssignment, Profile } from "@/data/supabase/database.types";
import {
  computeFacilitatorMatches,
  facilitatorCriteriaLabels,
  type FacilitatorMatchCriteria,
} from "@/domain/facilitator-matching";

type Props = {
  assignments: FacilitatorAssignment[];
  profileMap: Record<string, Profile>;
  participants: Profile[];
  facilitators: Profile[];
  facilitatorId: string;
  autoMatchingEnabled: boolean;
};

function initials(p: Profile): string {
  return `${p.first_name?.[0] ?? ""}${p.last_name?.[0] ?? ""}`.toUpperCase();
}

export default function FacilitatorAssignments({
  assignments,
  profileMap: initialProfileMap,
  participants,
  facilitators,
  facilitatorId,
  autoMatchingEnabled: initialAutoMatching,
}: Props) {
  const [autoMatching, setAutoMatching] = useState(initialAutoMatching);
  const [assignmentList, setAssignmentList] = useState<FacilitatorAssignment[]>(assignments);
  const [profileMap, setProfileMap] = useState<Record<string, Profile>>(initialProfileMap);
  const [selectedParticipant, setSelectedParticipant] = useState("");
  const [selectedFacilitator, setSelectedFacilitator] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const supabase = createSupabaseBrowserClient();

  const suggested = assignmentList.filter((a) => a.status === "suggested");
  const approved = assignmentList.filter((a) => a.status === "approved");
  const rejected = assignmentList.filter((a) => a.status === "rejected");

  async function toggleAutoMatching(enabled: boolean) {
    setAutoMatching(enabled);
    await supabase.from("system_settings").upsert({
      key: "auto_facilitator_matching_enabled",
      value: enabled,
      updated_by: facilitatorId,
      updated_at: new Date().toISOString(),
    });
  }

  async function updateStatus(id: string, status: "approved" | "rejected") {
    setUpdating(id);
    const approvedAt = status === "approved" ? new Date().toISOString() : null;
    const { error } = await supabase
      .from("facilitator_assignments")
      .update({
        status,
        approved_by: status === "approved" ? facilitatorId : null,
        approved_at: approvedAt,
      })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update assignment.");
      setUpdating(null);
      return;
    }

    setAssignmentList((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status,
              approved_by: status === "approved" ? facilitatorId : null,
              approved_at: approvedAt,
            }
          : a,
      ),
    );

    if (status === "approved") {
      const assignment = assignmentList.find((a) => a.id === id);
      if (assignment) {
        await supabase.from("notifications").insert({
          user_id: assignment.participant_id,
          type: "match_approved",
          title: "You've been assigned a facilitator",
          body: "A facilitator has been assigned to support your reconciliation journey.",
          data: { facilitator_assignment_id: id },
        });
      }
      toast.success("Assignment approved and participant notified.");
    } else {
      toast.success("Assignment rejected.");
    }
    setUpdating(null);
  }

  function pairExists(participantId: string, facilitatorId: string): boolean {
    return assignmentList.some(
      (a) =>
        a.participant_id === participantId &&
        a.facilitator_id === facilitatorId &&
        a.status !== "rejected",
    );
  }

  async function createManualAssignment() {
    if (!selectedParticipant || !selectedFacilitator) return;
    if (pairExists(selectedParticipant, selectedFacilitator)) {
      toast.error("That participant and facilitator are already paired.");
      return;
    }

    const participant = participants.find((p) => p.id === selectedParticipant);
    const facilitator = facilitators.find((f) => f.id === selectedFacilitator);
    if (!participant || !facilitator) return;

    const result = computeFacilitatorMatches(participant, [facilitator])[0];

    const { data, error } = await supabase
      .from("facilitator_assignments")
      .insert({
        participant_id: selectedParticipant,
        facilitator_id: selectedFacilitator,
        match_score: result?.score ?? 0,
        match_criteria: result?.criteria ?? {},
        status: "suggested",
        auto_generated: false,
        created_by: facilitatorId,
      })
      .select()
      .single();

    if (error || !data) {
      toast.error("Failed to create assignment.");
      return;
    }

    setProfileMap((prev) => ({
      ...prev,
      [participant.id]: participant,
      [facilitator.id]: facilitator,
    }));
    setAssignmentList((prev) => [data, ...prev]);
    setSelectedParticipant("");
    setSelectedFacilitator("");
    toast.success("Assignment created.");
  }

  async function generateSuggestions() {
    if (facilitators.length === 0) {
      toast.error("No facilitators available to assign.");
      return;
    }
    setGenerating(true);

    const rows = participants
      .map((participant) => {
        const best = computeFacilitatorMatches(participant, facilitators)[0];
        if (!best || best.score === 0) return null;
        if (pairExists(participant.id, best.facilitator.id)) return null;
        return {
          participant_id: participant.id,
          facilitator_id: best.facilitator.id,
          match_score: best.score,
          match_criteria: best.criteria,
          status: "suggested" as const,
          auto_generated: true,
          created_by: facilitatorId,
        };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);

    if (rows.length === 0) {
      toast.info("No new suggestions to generate.");
      setGenerating(false);
      return;
    }

    const { data, error } = await supabase.from("facilitator_assignments").insert(rows).select();

    if (error || !data) {
      toast.error("Failed to generate suggestions.");
      setGenerating(false);
      return;
    }

    setAssignmentList((prev) => [...data, ...prev]);
    toast.success(`Generated ${data.length} suggestion${data.length === 1 ? "" : "s"}.`);
    setGenerating(false);
  }

  return (
    <div className="space-y-6">
      {/* Auto-matching + generate controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="border-border bg-parchment shadow-rtr-1 flex items-center gap-3 rounded-xl border px-4 py-3">
          <Zap className="text-spruce-600 size-4" />
          <Label htmlFor="auto-facilitator-matching" className="cursor-pointer">
            Auto facilitator matching
          </Label>
          <Switch
            id="auto-facilitator-matching"
            checked={autoMatching}
            onCheckedChange={toggleAutoMatching}
          />
        </div>
        <Button
          onClick={generateSuggestions}
          disabled={generating || !autoMatching}
          className="gap-1.5"
        >
          <Sparkles className="h-4 w-4" />
          {generating ? "Generating…" : "Generate suggestions"}
        </Button>
      </div>

      {/* Manual assignment creation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="h-4 w-4" />
            Create manual assignment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Select
              value={selectedParticipant}
              onValueChange={(v) => setSelectedParticipant(v ?? "")}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select participant" />
              </SelectTrigger>
              <SelectContent>
                {participants.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.first_name} {p.last_name} — {p.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedFacilitator}
              onValueChange={(v) => setSelectedFacilitator(v ?? "")}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select facilitator" />
              </SelectTrigger>
              <SelectContent>
                {facilitators.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.first_name} {f.last_name} — {f.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={createManualAssignment}
              disabled={!selectedParticipant || !selectedFacilitator}
            >
              Create assignment
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
              <p className="text-muted-foreground py-8 text-center text-sm">
                No {key} assignments.
              </p>
            ) : (
              list.map((assignment) => {
                const participant = profileMap[assignment.participant_id];
                const facilitator = profileMap[assignment.facilitator_id];
                if (!participant || !facilitator) return null;

                const criteria = assignment.match_criteria as FacilitatorMatchCriteria;
                const labels = facilitatorCriteriaLabels(criteria).filter((l) => l.points > 0);

                return (
                  <Card key={assignment.id} className="border-border">
                    <CardContent className="p-5">
                      <div className="flex flex-col gap-4 sm:flex-row">
                        {/* Participant + facilitator */}
                        <div className="flex flex-1 items-center gap-3">
                          {[
                            {
                              profile: participant,
                              role: "Participant",
                              variant: "default" as const,
                            },
                            {
                              profile: facilitator,
                              role: "Facilitator",
                              variant: "river" as const,
                            },
                          ].map(({ profile, role, variant }) => (
                            <div key={profile.id} className="flex items-center gap-2">
                              <Avatar size="sm" variant={variant}>
                                <AvatarFallback>{initials(profile)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">
                                  {profile.first_name} {profile.last_name}
                                </p>
                                <Badge
                                  variant={variant === "default" ? "default" : "secondary"}
                                  className="text-xs"
                                >
                                  {role}
                                </Badge>
                                <p className="text-muted-foreground mt-0.5 text-xs">
                                  {profile.city}, {profile.province}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Score & criteria */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-primary text-2xl font-bold">
                              {Math.round(assignment.match_score ?? 0)}%
                            </span>
                            <Progress value={assignment.match_score ?? 0} className="h-2 flex-1" />
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {labels.map((l) => (
                              <Badge key={l.label} variant="outline" className="gap-1 text-xs">
                                {l.label}
                                <span className="text-primary font-medium">+{l.points}</span>
                              </Badge>
                            ))}
                            {assignment.auto_generated ? (
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
                              onClick={() => updateStatus(assignment.id, "approved")}
                              disabled={updating === assignment.id}
                              className="flex-1 gap-1.5 sm:flex-none"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStatus(assignment.id, "rejected")}
                              disabled={updating === assignment.id}
                              className="text-destructive border-destructive/30 hover:bg-destructive/10 flex-1 gap-1.5 sm:flex-none"
                            >
                              <XCircle className="h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        )}

                        {key === "approved" && (
                          <Badge variant="matched" className="self-start">
                            Approved
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
    </div>
  );
}
