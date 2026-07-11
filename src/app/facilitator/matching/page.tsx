import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/data/supabase/server-client";
import FacilitatorNav from "../components/FacilitatorNav";
import MatchingClient from "./MatchingClient";
import { AppFooter } from "@/components/app-footer";

export default async function FacilitatorMatchingPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  if (!profile || profile.role !== "facilitator") redirect("/dashboard");

  // Get all suggested and approved matches
  const { data: matches } = await supabase
    .from("matches")
    .select("*")
    .order("created_at", { ascending: false });

  // Get all eligible participants for manual matching
  const { data: allParticipants } = await supabase
    .from("profiles")
    .select("*")
    .eq("learning_completed", true)
    .eq("onboarding_completed", true)
    .eq("role", "participant");

  const participants = allParticipants ?? [];
  const indigenous = participants.filter((p) => p.is_indigenous);
  const nonIndigenous = participants.filter((p) => !p.is_indigenous);

  // Collect all profile IDs referenced in matches
  const profileIds = new Set(
    (matches ?? []).flatMap((m) => [m.indigenous_participant_id, m.non_indigenous_participant_id]),
  );
  const matchProfiles = participants.filter((p) => profileIds.has(p.id));
  const profileMap = new Map(matchProfiles.map((p) => [p.id, p]));

  // Facilitator assignments (participant <-> facilitator)
  const { data: facilitators } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "facilitator");

  const { data: assignments } = await supabase
    .from("facilitator_assignments")
    .select("*")
    .order("created_at", { ascending: false });

  // Profiles referenced by assignments (participants may not all be eligible,
  // so build the lookup from every profile we've loaded plus facilitators).
  const assignmentLookup = new Map<string, (typeof participants)[number]>();
  for (const p of [...participants, ...(facilitators ?? [])]) assignmentLookup.set(p.id, p);
  const assignmentProfileMap = new Map(
    (assignments ?? [])
      .flatMap((a) => [a.participant_id, a.facilitator_id])
      .map((id) => [id, assignmentLookup.get(id)] as const)
      .filter(([, p]) => p != null) as [string, (typeof participants)[number]][],
  );

  // Get system settings
  const { data: settings } = await supabase.from("system_settings").select("*");
  const settingsMap = new Map((settings ?? []).map((s) => [s.key, s.value]));
  const autoMatchingEnabled = settingsMap.get("auto_matching_enabled") ?? true;
  const autoFacilitatorMatchingEnabled =
    settingsMap.get("auto_facilitator_matching_enabled") ?? true;

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <FacilitatorNav facilitator={profile} />
      <MatchingClient
        matches={matches ?? []}
        profileMap={Object.fromEntries(profileMap)}
        indigenous={indigenous}
        nonIndigenous={nonIndigenous}
        facilitatorId={user.id}
        autoMatchingEnabled={autoMatchingEnabled as boolean}
        facilitators={facilitators ?? []}
        assignments={assignments ?? []}
        assignmentProfileMap={Object.fromEntries(assignmentProfileMap)}
        autoFacilitatorMatchingEnabled={autoFacilitatorMatchingEnabled as boolean}
      />
      <AppFooter />
    </div>
  );
}
