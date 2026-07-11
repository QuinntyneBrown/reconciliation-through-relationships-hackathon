import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DashboardNav from "../dashboard/components/DashboardNav";
import { MessageSquare, Clock } from "lucide-react";

export default async function ConnectionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/onboarding");

  const { data: connections } = await supabase
    .from("connections")
    .select("*")
    .or(`participant_a_id.eq.${user.id},participant_b_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  // Get partner profiles
  const partnerIds = (connections ?? []).map((c) =>
    c.participant_a_id === user.id ? c.participant_b_id : c.participant_a_id
  );

  const { data: partners } = partnerIds.length
    ? await supabase.from("profiles").select("*").in("id", partnerIds)
    : { data: [] };

  const partnerMap = new Map((partners ?? []).map((p) => [p.id, p]));

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={profile} />
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        <h1 className="text-xl font-semibold">My Connections</h1>

        {!connections || connections.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>No active connections yet.</p>
            <Button asChild className="mt-4" variant="outline">
              <Link href="/dashboard">Find connections</Link>
            </Button>
          </div>
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

              // Check if current user has clicked connect
              const myField =
                connection.participant_a_id === user.id
                  ? "participant_a_connected"
                  : "participant_b_connected";
              const iWaited = !connection[myField];

              return (
                <Link
                  key={connection.id}
                  href={`/connections/${connection.id}`}
                  className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {partner.first_name} {partner.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {partner.city}, {partner.province}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <Badge className="bg-accent/20 text-accent-foreground border-accent/20 text-xs">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs gap-1">
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
    </div>
  );
}
