import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/data/supabase/server-client";
import FacilitatorNav from "../components/FacilitatorNav";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { AppFooter } from "@/components/app-footer";
import { PageIntro } from "@/components/page-intro";

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
      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
        <PageIntro
          eyebrow="Participant community"
          title="Participants"
          description={`${participants?.length ?? 0} registered participants across the RTR journey.`}
        />

        <div className="rtr-table-wrap">
          <table className="rtr-table">
            <thead>
              <tr>
                <th>Name</th>
                <th className="hidden sm:table-cell">Location</th>
                <th className="hidden md:table-cell">Background</th>
                <th>Journey</th>
                <th className="hidden lg:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {(participants ?? []).map((p) => {
                const initials =
                  `${p.first_name?.[0] ?? ""}${p.last_name?.[0] ?? ""}`.toUpperCase();
                const progressStep = p.learning_completed ? 3 : p.onboarding_completed ? 2 : 1;
                const progressPct = (progressStep / 3) * 100;

                return (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/profile/${p.id}`}
                        className="flex items-center gap-2 hover:underline"
                      >
                        <Avatar size="sm" variant="default">
                          <AvatarFallback>{initials || "?"}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          {p.first_name} {p.last_name}
                        </span>
                      </Link>
                    </td>
                    <td className="text-muted-foreground hidden px-4 py-3 sm:table-cell">
                      {p.city ? `${p.city}, ${p.province}` : "—"}
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <Badge
                        variant={p.is_indigenous ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {p.is_indigenous ? "Indigenous" : "Non-Indigenous"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex min-w-24 items-center gap-2">
                        <Progress value={progressPct} className="h-1.5 flex-1" />
                        <span className="text-muted-foreground text-xs whitespace-nowrap">
                          {p.learning_completed ? (
                            <span className="text-accent flex items-center gap-0.5">
                              <CheckCircle2 className="h-3 w-3" />
                              Ready
                            </span>
                          ) : p.onboarding_completed ? (
                            <span className="flex items-center gap-0.5">
                              <Clock className="h-3 w-3" />
                              Learning
                            </span>
                          ) : (
                            <span className="flex items-center gap-0.5">
                              <Circle className="h-3 w-3" />
                              Onboarding
                            </span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="text-muted-foreground hidden px-4 py-3 text-xs lg:table-cell">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
