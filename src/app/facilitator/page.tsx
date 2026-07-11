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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Review pending matches",
              icon: GitMerge,
              href: "/facilitator/matching",
              variant: "default" as const,
            },
            {
              label: "View all participants",
              icon: Users,
              href: "/facilitator/participants",
              variant: "outline" as const,
            },
            { label: "Manage cohorts", icon: MapPin, href: "/map", variant: "outline" as const },
            {
              label: "Platform settings",
              icon: Settings,
              href: "/facilitator/settings",
              variant: "outline" as const,
            },
          ].map((action) => (
            <Button
              key={action.label}
              variant={action.variant}
              asChild
              className="h-auto flex-col gap-2 py-4"
            >
              <Link href={action.href}>
                <action.icon className="h-5 w-5" />
                <span>{action.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
