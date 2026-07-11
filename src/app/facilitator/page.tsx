import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/data/supabase/server-client";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FacilitatorNav from "./components/FacilitatorNav";
import { Users, GitMerge, MapPin, Settings, TrendingUp } from "lucide-react";
import { AppFooter } from "@/components/app-footer";
import { PageIntro } from "@/components/page-intro";

export default async function FacilitatorPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  if (!profile || profile.role !== "facilitator") redirect("/dashboard");

  // Stats
  const [
    { count: totalParticipants },
    { count: completedLearning },
    { count: pendingMatches },
    { count: activeConnections },
    { count: totalCohorts },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "participant"),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("learning_completed", true)
      .eq("role", "participant"),
    supabase.from("matches").select("id", { count: "exact", head: true }).eq("status", "suggested"),
    supabase
      .from("connections")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
    supabase.from("cohorts").select("id", { count: "exact", head: true }),
  ]);

  const stats = [
    {
      label: "Total participants",
      value: totalParticipants ?? 0,
      icon: Users,
      href: "/facilitator/participants",
    },
    {
      label: "Completed learning",
      value: completedLearning ?? 0,
      icon: TrendingUp,
      href: "/facilitator/participants",
    },
    {
      label: "Pending matches",
      value: pendingMatches ?? 0,
      icon: GitMerge,
      href: "/facilitator/matching",
    },
    {
      label: "Active connections",
      value: activeConnections ?? 0,
      icon: Users,
      href: "/facilitator/participants",
    },
    { label: "Regional cohorts", value: totalCohorts ?? 0, icon: MapPin, href: "/map" },
  ];

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <FacilitatorNav facilitator={profile} />

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
        <PageIntro
          eyebrow="Facilitator workspace"
          title="Community overview"
          description="Review the RTR participant community, learning progress, matches, and regional cohorts."
        />

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat) => (
            <Link key={stat.label} href={stat.href}>
              <Card className="hover:border-primary/40 cursor-pointer transition-colors">
                <CardContent className="p-4">
                  <stat.icon className="text-primary mb-2 h-5 w-5" />
                  <p className="font-heading text-spruce-800 text-[34px] leading-[1.1] font-semibold">
                    {stat.value}
                  </p>
                  <p className="text-ink-soft mt-1 text-[13.5px] font-semibold">{stat.label}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick actions */}
        <div className="border-border bg-card divide-border overflow-hidden rounded-2xl border divide-y">
          {[
            {
              label: "Review pending matches",
              description: "Approve or reject facilitator-suggested and mutual connect matches.",
              icon: GitMerge,
              href: "/facilitator/matching",
            },
            {
              label: "View all participants",
              description: "Browse everyone in the program and their journey status.",
              icon: Users,
              href: "/facilitator/participants",
            },
            {
              label: "Manage cohorts",
              description: "Form and manage regional reconciliation cohorts.",
              icon: MapPin,
              href: "/map",
            },
            {
              label: "Platform settings",
              description: "Toggle auto-matching, cohort thresholds, and other options.",
              icon: Settings,
              href: "/facilitator/settings",
            },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="hover:bg-muted/50 flex items-center gap-4 px-5 py-4 no-underline transition-colors"
            >
              <div className="bg-spruce-100 text-spruce-700 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                <action.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-heading font-semibold">{action.label}</p>
                <p className="text-muted-foreground text-sm">{action.description}</p>
              </div>
              <span className="text-muted-foreground text-lg">›</span>
            </Link>
          ))}
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
