import { redirect, notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/data/supabase/server-client";
import ConnectionChat from "../components/ConnectionChat";

export default async function ConnectionPage({
  params,
}: {
  params: Promise<{ connectionId: string }>;
}) {
  const { connectionId } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: connection } = await supabase
    .from("connections")
    .select("*")
    .eq("id", connectionId)
    .single();

  if (!connection) notFound();

  const isParticipant =
    connection.participant_a_id === user.id || connection.participant_b_id === user.id;

  if (!isParticipant) redirect("/connections");

  const partnerId =
    connection.participant_a_id === user.id
      ? connection.participant_b_id
      : connection.participant_a_id;

  const [
    { data: currentProfile },
    { data: partnerProfile },
    { data: messages },
    { data: meetings },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("profiles").select("*").eq("id", partnerId).single(),
    supabase.from("messages").select("*").eq("connection_id", connectionId).order("created_at"),
    supabase.from("meetings").select("*").eq("connection_id", connectionId).order("scheduled_at"),
  ]);

  if (!currentProfile || !partnerProfile) redirect("/connections");

  const myConnectedField =
    connection.participant_a_id === user.id ? "participant_a_connected" : "participant_b_connected";

  return (
    <ConnectionChat
      connection={connection}
      currentUser={currentProfile}
      partner={partnerProfile}
      initialMessages={messages ?? []}
      meetings={meetings ?? []}
      myConnectedField={myConnectedField as "participant_a_connected" | "participant_b_connected"}
    />
  );
}
