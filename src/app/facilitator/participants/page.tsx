import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/data/supabase/server-client";
import FacilitatorNav from "../components/FacilitatorNav";
import { AppFooter } from "@/components/app-footer";
import { PageIntro } from "@/components/page-intro";
import ParticipantsTable from "./ParticipantsTable";

export default async function AdminParticipantsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  if (!profile || profile.role !== "facilitator") redirect("/dashboard");

  const { data: participants } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "participant")
    .order("created_at", { ascending: false });

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <FacilitatorNav facilitator={profile} />
      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6">
        <PageIntro
          eyebrow="Participant community"
          title="Participants"
          description={`${participants?.length ?? 0} registered participants across the RTR journey.`}
        />
        <ParticipantsTable participants={participants ?? []} />
      </main>
      <AppFooter />
    </div>
  );
}
