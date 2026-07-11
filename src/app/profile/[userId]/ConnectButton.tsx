"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/data/supabase/browser-client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Heart, Clock, MessageSquare, X } from "lucide-react";
import type { Connection } from "@/data/supabase/database.types";

type Props = {
  currentUserId: string;
  partnerId: string;
  partnerName: string;
  initialConnection: Connection | null;
};

export default function ConnectButton({
  currentUserId,
  partnerId,
  partnerName,
  initialConnection,
}: Props) {
  const [connection, setConnection] = useState<Connection | null>(initialConnection);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  async function sendRequest() {
    setBusy(true);

    const { data, error } = await supabase
      .from("connections")
      .insert({
        match_id: null,
        participant_a_id: currentUserId,
        participant_b_id: partnerId,
        participant_a_connected: true,
        participant_b_connected: false,
      })
      .select()
      .single();

    if (error || !data) {
      toast.error("Couldn't send your connection request. Please try again.");
      setBusy(false);
      return;
    }

    // Notify the other person so the request appears in their account.
    await supabase.from("notifications").insert({
      user_id: partnerId,
      type: "connect_request",
      title: "Someone wants to connect with you",
      body: "Visit your connections to accept.",
      data: { connection_id: data.id },
    });

    setConnection(data);
    toast.success(`Connection request sent to ${partnerName}!`);
    setBusy(false);
    router.refresh();
  }

  async function cancelRequest() {
    if (!connection) return;
    setBusy(true);

    const { error } = await supabase.from("connections").delete().eq("id", connection.id);

    if (error) {
      toast.error("Couldn't cancel the request. Please try again.");
      setBusy(false);
      return;
    }

    setConnection(null);
    toast.success("Connection request cancelled.");
    setBusy(false);
    router.refresh();
  }

  if (!connection) {
    return (
      <Button onClick={sendRequest} disabled={busy} className="flex-1 gap-2">
        <Heart className="h-4 w-4" />
        {busy ? "Sending…" : `Connect with ${partnerName}`}
      </Button>
    );
  }

  const iAmParticipantA = connection.participant_a_id === currentUserId;
  const iConnected = iAmParticipantA
    ? connection.participant_a_connected
    : connection.participant_b_connected;
  const theyConnected = iAmParticipantA
    ? connection.participant_b_connected
    : connection.participant_a_connected;
  const isActive = connection.status === "active" || (iConnected && theyConnected);

  if (isActive) {
    return (
      <Button asChild className="flex-1 gap-2">
        <Link href={`/connections/${connection.id}`}>
          <MessageSquare className="h-4 w-4" />
          Open chat
        </Link>
      </Button>
    );
  }

  // I sent a request that hasn't been accepted yet — show pending + cancel.
  if (iConnected && !theyConnected) {
    return (
      <>
        <Button variant="secondary" disabled className="flex-1 gap-2">
          <Clock className="h-4 w-4" />
          Request pending
        </Button>
        <Button variant="outline" onClick={cancelRequest} disabled={busy} className="gap-2">
          <X className="h-4 w-4" />
          {busy ? "Cancelling…" : "Cancel"}
        </Button>
      </>
    );
  }

  // They sent me a request — let me respond to it.
  return (
    <Button asChild className="flex-1 gap-2">
      <Link href={`/connections/${connection.id}`}>
        <Heart className="h-4 w-4" />
        Respond to request
      </Link>
    </Button>
  );
}
