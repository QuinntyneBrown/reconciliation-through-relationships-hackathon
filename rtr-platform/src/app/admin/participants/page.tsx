import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminNav from "../components/AdminNav";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Clock } from "lucide-react";

export default async function AdminParticipantsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "facilitator") redirect("/dashboard");

  const { data: participants } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "participant")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-background">
      <AdminNav facilitator={profile} />
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-xl font-bold">Participants</h1>
          <p className="text-sm text-muted-foreground">
            {participants?.length ?? 0} registered participants
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Location</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Background</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Journey</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(participants ?? []).map((p) => {
                const initials =
                  `${p.first_name?.[0] ?? ""}${p.last_name?.[0] ?? ""}`.toUpperCase();
                const progressStep = p.learning_completed
                  ? 3
                  : p.onboarding_completed
                  ? 2
                  : 1;
                const progressPct = (progressStep / 3) * 100;

                return (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/profile/${p.id}`} className="flex items-center gap-2 hover:underline">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="text-xs bg-primary/20 text-primary font-semibold">
                            {initials || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          {p.first_name} {p.last_name}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                      {p.city ? `${p.city}, ${p.province}` : "—"}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <Badge
                        variant={p.is_indigenous ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {p.is_indigenous ? "Indigenous" : "Non-Indigenous"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 min-w-24">
                        <Progress value={progressPct} className="h-1.5 flex-1" />
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {p.learning_completed ? (
                            <span className="flex items-center gap-0.5 text-accent">
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
                    <td className="px-4 py-3 text-muted-foreground text-xs hidden lg:table-cell">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
