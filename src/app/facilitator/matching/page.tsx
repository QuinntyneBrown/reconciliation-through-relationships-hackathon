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

  // Include every eligible profile so newly-created manual matches can render
  // immediately without a server refresh.
  const profileMap = new Map(participants.map((p) => [p.id, p]));

  // Get system settings
  const { data: settings } = await supabase.from("system_settings").select("*");
  const settingsMap = new Map((settings ?? []).map((s) => [s.key, s.value]));
  const autoMatchingEnabled = settingsMap.get("auto_matching_enabled") ?? true;

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
      />
      <AppFooter />
    </div>
  );
}
