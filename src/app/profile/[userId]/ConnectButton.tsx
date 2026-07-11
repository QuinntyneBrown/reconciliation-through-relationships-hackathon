"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/data/supabase/browser-client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Heart } from "lucide-react";

type Props = {
  matchId: string;
  currentUserId: string;
  partnerId: string;
  partnerName: string;
};

export default function ConnectButton({ matchId, currentUserId, partnerId, partnerName }: Props) {
  const [connecting, setConnecting] = useState(false);
  const router = useRouter();

  async function handleConnect() {
    setConnecting(true);
    const supabase = createSupabaseBrowserClient();

    // Check if connection already exists
    const { data: existing } = await supabase
      .from("connections")
      .select("id")
      .eq("match_id", matchId)
      .single();

    if (existing) {
      // Connection record exists — update my flag
      const field =
        currentUserId < partnerId ? "participant_a_connected" : "participant_b_connected";

      const updatePayload =
        field === "participant_a_connected"
          ? { participant_a_connected: true }
          : { participant_b_connected: true };

      await supabase.from("connections").update(updatePayload).eq("id", existing.id);
    } else {
      // Create connection record
      const isA = currentUserId < partnerId;
      await supabase.from("connections").insert({
        match_id: matchId,
        participant_a_id: isA ? currentUserId : partnerId,
        participant_b_id: isA ? partnerId : currentUserId,
        participant_a_connected: isA,
        participant_b_connected: !isA,
      });
    }

    // Notify partner
    await supabase.from("notifications").insert({
      user_id: partnerId,
      type: "connect_request",
      title: "Someone wants to connect with you",
      body: "Visit your connections to accept.",
      data: { match_id: matchId },
    });

    toast.success(`Connection request sent to ${partnerName}!`);
    router.refresh();
    setConnecting(false);
  }

  return (
    <Button onClick={handleConnect} disabled={connecting} className="flex-1 gap-2">
      <Heart className="h-4 w-4" />
      {connecting ? "Sending…" : `Connect with ${partnerName}`}
    </Button>
  );
}
