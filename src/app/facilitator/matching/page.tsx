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
<<<<<<< HEAD
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
=======
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Suggested matches</h1>
      <p className="text-muted-foreground mt-2">
        A facilitator must approve a match before participants are connected.
      </p>

      {balance.waitlistedEstimate > 0 && (
        <Card className="mt-6" variant="caution">
          <CardHeader>
            <CardTitle className="text-base">Registration imbalance</CardTitle>
            <CardDescription>
              {balance.nonIndigenousCount} non-Indigenous vs {balance.indigenousCount} Indigenous
              eligible participants. ~{balance.waitlistedEstimate} may need the waitlist or a
              learning-resources-only pathway.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="mt-8 space-y-3">
        {suggestions.length === 0 && (
          <p className="text-muted-foreground">
            No suggestions yet — participants must complete the learning journey to become eligible.
          </p>
        )}
        {suggestions.map((s) => (
          <Card key={`${s.a.id}-${s.b.id}`}>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <CardTitle className="text-base">
                  {s.a.name} &nbsp;×&nbsp; {s.b.name}
                </CardTitle>
                <Badge variant="secondary">{s.score}% match</Badge>
              </div>
              <CardDescription>{s.reasons.join(" · ")}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              {/* TODO: wire to a Server Action calling repo.updateMatchStatus */}
              <Button size="sm">Approve</Button>
              <Button size="sm" variant="outline">
                Reject
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
>>>>>>> origin/main
    </div>
  );
}
