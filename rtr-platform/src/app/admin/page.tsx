import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AdminNav from "./components/AdminNav";
import { Users, GitMerge, MapPin, Settings, TrendingUp } from "lucide-react";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "facilitator") redirect("/dashboard");

  // Stats
  const [
    { count: totalParticipants },
    { count: completedLearning },
    { count: pendingMatches },
    { count: activeConnections },
    { count: totalCohorts },
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "participant"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("learning_completed", true).eq("role", "participant"),
    supabase.from("matches").select("id", { count: "exact", head: true }).eq("status", "suggested"),
    supabase.from("connections").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("cohorts").select("id", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Total participants", value: totalParticipants ?? 0, icon: Users, href: "/admin/participants" },
    { label: "Completed learning", value: completedLearning ?? 0, icon: TrendingUp, href: "/admin/participants" },
    { label: "Pending matches", value: pendingMatches ?? 0, icon: GitMerge, href: "/admin/matches" },
    { label: "Active connections", value: activeConnections ?? 0, icon: Users, href: "/admin/participants" },
    { label: "Regional cohorts", value: totalCohorts ?? 0, icon: MapPin, href: "/admin/cohorts" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AdminNav facilitator={profile} />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Facilitator Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of the RTR participant community.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((stat) => (
            <Link key={stat.label} href={stat.href}>
              <Card className="hover:border-primary/40 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <stat.icon className="h-5 w-5 text-primary mb-2" />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Review pending matches", icon: GitMerge, href: "/admin/matches", variant: "default" as const },
            { label: "View all participants", icon: Users, href: "/admin/participants", variant: "outline" as const },
            { label: "Manage cohorts", icon: MapPin, href: "/admin/cohorts", variant: "outline" as const },
            { label: "Platform settings", icon: Settings, href: "/admin/settings", variant: "outline" as const },
          ].map((action) => (
            <Button key={action.label} variant={action.variant} asChild className="h-auto py-4 flex-col gap-2">
              <Link href={action.href}>
                <action.icon className="h-5 w-5" />
                <span>{action.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </main>
    </div>
  );
}
