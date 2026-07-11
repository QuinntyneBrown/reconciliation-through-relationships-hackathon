import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, Globe, Clock, MessageSquare } from "lucide-react";
import DashboardNav from "../../dashboard/components/DashboardNav";
import ConnectButton from "./ConnectButton";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const [{ data: currentUser }, { data: profile }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("profiles").select("*").eq("id", userId).single(),
  ]);

  if (!currentUser) redirect("/onboarding");
  if (!profile || profile.role === "facilitator") notFound();

  const isSelf = user.id === userId;

  // Check for existing connection
  const { data: connection } = await supabase
    .from("connections")
    .select("*")
    .or(
      `and(participant_a_id.eq.${user.id},participant_b_id.eq.${userId}),and(participant_a_id.eq.${userId},participant_b_id.eq.${user.id})`
    )
    .single();

  // Check for approved match
  const { data: match } = await supabase
    .from("matches")
    .select("*")
    .in("status", ["approved", "connected"])
    .or(
      `and(indigenous_participant_id.eq.${user.id},non_indigenous_participant_id.eq.${userId}),and(indigenous_participant_id.eq.${userId},non_indigenous_participant_id.eq.${user.id})`
    )
    .single();

  const initials =
    `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`.toUpperCase();

  const faithLabels: Record<string, string> = {
    indigenous_traditional: "Indigenous Traditional",
    atheist: "Atheist",
    christian: "Christian",
    jewish: "Jewish",
    muslim: "Muslim",
    hindu: "Hindu",
    buddhist: "Buddhist",
    other: profile.faith_tradition_other ?? "Other",
    prefer_not_to_say: "Prefer not to say",
  };

  const formatLabels: Record<string, string> = {
    in_person: "In-person",
    online: "Online (video)",
    chat_only: "Chat only",
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={currentUser} />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <Button variant="ghost" size="sm" asChild className="mb-6 gap-2">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </Button>

        {/* Profile header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">
                  {initials || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold">
                  {profile.first_name} {profile.last_name}
                </h1>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge variant={profile.is_indigenous ? "default" : "secondary"}>
                    {profile.is_indigenous ? "Indigenous" : "Non-Indigenous"}
                  </Badge>
                  {profile.participation_categories.map((cat) => (
                    <Badge key={cat} variant="outline" className="text-xs capitalize">
                      {cat.replace(/_/g, " ")}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {profile.city}, {profile.province}
                </div>
                {profile.treaty_area && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {profile.treaty_area}
                  </p>
                )}
              </div>
            </div>

            {!isSelf && (
              <div className="flex gap-2 mt-4">
                {connection ? (
                  <Button asChild className="flex-1 gap-2">
                    <Link href={`/connections/${connection.id}`}>
                      <MessageSquare className="h-4 w-4" />
                      {connection.status === "active" ? "Open chat" : "View connection"}
                    </Link>
                  </Button>
                ) : match ? (
                  <ConnectButton
                    matchId={match.id}
                    currentUserId={user.id}
                    partnerId={userId}
                    partnerName={profile.first_name ?? "them"}
                  />
                ) : (
                  <Button variant="outline" disabled className="flex-1">
                    Awaiting facilitator match
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bio */}
        {profile.bio && (
          <div className="mt-4 space-y-1">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">About</h2>
            <p className="text-sm leading-relaxed">{profile.bio}</p>
          </div>
        )}

        <Separator className="my-6" />

        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {profile.faith_tradition && (
            <div>
              <p className="text-muted-foreground font-medium mb-0.5">Faith tradition</p>
              <p>{faithLabels[profile.faith_tradition] ?? profile.faith_tradition}</p>
            </div>
          )}
          {profile.language_preferences.length > 0 && (
            <div>
              <p className="text-muted-foreground font-medium mb-0.5">Languages</p>
              <p className="capitalize">{profile.language_preferences.join(", ")}</p>
            </div>
          )}
          {profile.participation_format.length > 0 && (
            <div>
              <p className="text-muted-foreground font-medium mb-0.5">Prefers connecting</p>
              <p>{profile.participation_format.map((f) => formatLabels[f] ?? f).join(", ")}</p>
            </div>
          )}
        </div>

        {/* Interests */}
        {profile.interests.length > 0 && (
          <div className="mt-4">
            <p className="text-muted-foreground font-medium text-sm mb-2">Interests</p>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <Badge key={interest} variant="secondary" className="capitalize">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
