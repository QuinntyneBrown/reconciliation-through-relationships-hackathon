import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./components/DashboardClient";
import { computeMatches } from "@/lib/matching";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/onboarding");
  if (!profile.learning_completed) redirect("/learn");

  // Fetch all eligible participants (learning complete, opposite background)
  const { data: allParticipants } = await supabase
    .from("profiles")
    .select("*")
    .eq("learning_completed", true)
    .eq("onboarding_completed", true)
    .eq("role", "participant")
    .neq("id", user.id);

  const participants = allParticipants ?? [];

  // Get approved matches for current user
  const { data: approvedMatches } = await supabase
    .from("matches")
    .select("*")
    .in("status", ["approved", "connected"])
    .or(
      `indigenous_participant_id.eq.${user.id},non_indigenous_participant_id.eq.${user.id}`
    );

  // Get user's connections
  const { data: connections } = await supabase
    .from("connections")
    .select("*")
    .or(`participant_a_id.eq.${user.id},participant_b_id.eq.${user.id}`);

  // Get user's cohort membership (simplified — no join)
  const { data: cohortMembership } = await supabase
    .from("cohort_members")
    .select("cohort_id")
    .eq("participant_id", user.id)
    .single();

  // Compute recommended matches from approved matches
  const matchedParticipantIds = new Set(
    (approvedMatches ?? []).flatMap((m) => [
      m.indigenous_participant_id,
      m.non_indigenous_participant_id,
    ])
  );

  const recommendedMatches = computeMatches(profile, participants)
    .filter(
      (m) =>
        matchedParticipantIds.has(m.participant.id) ||
        // Show top candidates even without facilitator approval for display
        m.score >= 40
    )
    .slice(0, 5);

  // City-level cohort detection: count eligible people in same city
  const sameCityCount = participants.filter(
    (p) => p.city?.toLowerCase() === profile.city?.toLowerCase()
  ).length;

  return (
    <DashboardClient
      currentUser={profile}
      participants={participants}
      recommendedMatches={recommendedMatches}
      approvedMatches={approvedMatches ?? []}
      connections={connections ?? []}
      cohort={cohortMembership ? { cohort_id: cohortMembership.cohort_id } : null}
      sameCityCount={sameCityCount + 1} // include self
    />
  );
}
