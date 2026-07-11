import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/data/supabase/server-client";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DashboardNav from "../dashboard/components/DashboardNav";
import { Clock } from "lucide-react";
import { AppFooter } from "@/components/app-footer";
import { EmptyState } from "@/components/empty-state";
import { PageIntro } from "@/components/page-intro";

export default async function ConnectionsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  if (!profile) redirect("/onboarding");

  const { data: connections } = await supabase
    .from("connections")
    .select("*")
    .or(`participant_a_id.eq.${user.id},participant_b_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  // Get partner profiles
  const partnerIds = (connections ?? []).map((c) =>
    c.participant_a_id === user.id ? c.participant_b_id : c.participant_a_id,
  );

  const { data: partners } = partnerIds.length
    ? await supabase.from("profiles").select("*").in("id", partnerIds)
    : { data: [] };

  const partnerMap = new Map((partners ?? []).map((p) => [p.id, p]));

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <DashboardNav user={profile} />
      <main className="mx-auto w-full max-w-4xl flex-1 space-y-8 px-4 py-8 sm:px-6">
        <PageIntro
          eyebrow="Walking together"
          title="My connections"
          description="Relationships grow at their own pace. Return to a conversation or see where a new introduction stands."
        />

        {!connections || connections.length === 0 ? (
          <EmptyState
            title="No active connections yet"
            description="Your facilitator reviews every match personally. While you wait, keep your profile current so recommendations reflect who you are."
            action={
              <Button asChild variant="secondary">
                <Link href="/dashboard">Explore recommendations</Link>
              </Button>
            }
          />
        ) : (
          <div className="space-y-2">
            {connections.map((connection) => {
              const partnerId =
                connection.participant_a_id === user.id
                  ? connection.participant_b_id
                  : connection.participant_a_id;
              const partner = partnerMap.get(partnerId);
              if (!partner) return null;

              const initials =
                `${partner.first_name?.[0] ?? ""}${partner.last_name?.[0] ?? ""}`.toUpperCase();
              const isActive = connection.status === "active";

              return (
                <Link
                  key={connection.id}
                  href={`/connections/${connection.id}`}
                  className="border-border bg-parchment hover:border-spruce-600 shadow-rtr-1 flex items-center gap-4 rounded-2xl border p-5 no-underline transition-colors"
                >
                  <Avatar>
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      {partner.first_name} {partner.last_name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {partner.city}, {partner.province}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <Badge variant="matched">Active</Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1 text-xs">
                        <Clock className="h-3 w-3" />
                        Pending
                      </Badge>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
      <AppFooter />
    </div>
  );
}
