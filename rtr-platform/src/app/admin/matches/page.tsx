import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminNav from "../components/AdminNav";
import MatchesClient from "./MatchesClient";
import { computeMatches } from "@/lib/matching";

export default async function AdminMatchesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

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
    (matches ?? []).flatMap((m) => [
      m.indigenous_participant_id,
      m.non_indigenous_participant_id,
    ])
  );
  const matchProfiles = participants.filter((p) => profileIds.has(p.id));
  const profileMap = new Map(matchProfiles.map((p) => [p.id, p]));

  // Get system settings
  const { data: settings } = await supabase
    .from("system_settings")
    .select("*");
  const settingsMap = new Map((settings ?? []).map((s) => [s.key, s.value]));
  const autoMatchingEnabled = settingsMap.get("auto_matching_enabled") ?? true;

  return (
    <div className="min-h-screen bg-background">
      <AdminNav facilitator={profile} />
      <MatchesClient
        matches={matches ?? []}
        profileMap={Object.fromEntries(profileMap)}
        indigenous={indigenous}
        nonIndigenous={nonIndigenous}
        facilitatorId={user.id}
        autoMatchingEnabled={autoMatchingEnabled as boolean}
      />
    </div>
  );
}
