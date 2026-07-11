"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/data/supabase/browser-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ArrowLeft, Send, Video, Clock, Check, CheckCheck, MapPin } from "lucide-react";
import { toast } from "sonner";
import DashboardNav from "@/app/dashboard/components/DashboardNav";
import { format } from "date-fns";
import type { Profile, Connection, Message, Meeting } from "@/data/supabase/database.types";
import ScheduleMeetingModal from "./ScheduleMeetingModal";

type Props = {
  connection: Connection;
  currentUser: Profile;
  partner: Profile;
  initialMessages: Message[];
  meetings: Meeting[];
  myConnectedField: "participant_a_connected" | "participant_b_connected";
};

export default function ConnectionChat({
  connection,
  currentUser,
  partner,
  initialMessages,
  meetings,
  myConnectedField,
}: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [connectionState, setConnectionState] = useState(connection);
  const [meetingList, setMeetingList] = useState<Meeting[]>(meetings);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [supabase] = useState(createSupabaseBrowserClient);

  const partnerInitials =
    `${partner.first_name?.[0] ?? ""}${partner.last_name?.[0] ?? ""}`.toUpperCase();
  const iHaveConnected = connectionState[myConnectedField];
  const isActive = connectionState.status === "active";

  // Show Schedule call only when no meeting is currently in-progress or upcoming.
  // A meeting is "still ahead" if its scheduled end time (start + duration) is in the future.
  const now = Date.now();
  const upcomingMeeting = meetingList
    .slice()
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
    .find((m) => {
      const end =
        new Date(m.scheduled_at).getTime() + (m.duration_minutes ?? 60) * 60 * 1000;
      return end > now;
    });
  const canScheduleCall = isActive && !upcomingMeeting;

  // Subscribe to new messages
  useEffect(() => {
    const channel = supabase
      .channel(`connection:${connection.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `connection_id=eq.${connection.id}`,
        },
        (payload) => {
          setMessages((prev) => {
            const msg = payload.new as Message;
            return prev.some((m) => m.id === msg.id) ? prev : [...prev, msg];
          });
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "connections",
          filter: `id=eq.${connection.id}`,
        },
        (payload) => {
          setConnectionState(payload.new as Connection);
          if (payload.new.status === "active") {
            toast.success("You're now connected! You can start chatting.");
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [connection.id, supabase]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleConnect() {
    const partnerAlreadyConnected =
      connectionState[
        myConnectedField === "participant_a_connected"
          ? "participant_b_connected"
          : "participant_a_connected"
      ];

    let nextStatus: "pending" | "pending_review" | "active" = connectionState.status;
    if (partnerAlreadyConnected) {
      // Both parties have now clicked connect — check auto-matching setting
      const { data: setting } = await supabase
        .from("system_settings")
        .select("value")
        .eq("key", "auto_matching_enabled")
        .single();
      const autoMatching = setting?.value === true || setting?.value === "true";
      nextStatus = autoMatching ? "active" : "pending_review";
    }

    const { error } = await supabase
      .from("connections")
      .update({
        [myConnectedField]: true,
        ...(partnerAlreadyConnected
          ? {
              status: nextStatus,
              ...(nextStatus === "active" ? { connected_at: new Date().toISOString() } : {}),
            }
          : {}),
      })
      .eq("id", connection.id);

    if (error) {
      toast.error("Failed to connect. Please try again.");
      return;
    }

    // Create notification for partner
    await supabase.from("notifications").insert({
      user_id: partner.id,
      type: "connect_request",
      title: `${currentUser.first_name} ${currentUser.last_name} wants to connect`,
      body: "Click to accept and start chatting.",
      data: { connection_id: connection.id },
    });

    if (partnerAlreadyConnected && nextStatus === "pending_review") {
      toast.success("Both connected! A facilitator will review your match shortly.");
    } else {
      toast.success("Connection request sent!");
    }
    router.refresh();
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !isActive) return;

    setSending(true);
    const content = input.trim();
    setInput("");

    const { data, error } = await supabase
      .from("messages")
      .insert({
        connection_id: connection.id,
        sender_id: currentUser.id,
        content,
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to send message.");
      setInput(content);
      setSending(false);
      return;
    }

    // Optimistically append — Realtime may echo but we dedupe by id
    if (data) {
      setMessages((prev) =>
        prev.some((m) => m.id === data.id) ? prev : [...prev, data as Message],
      );
    }

    // Notify the partner about the new message
    await supabase.from("notifications").insert({
      user_id: partner.id,
      type: "new_message",
      title: `New message from ${currentUser.first_name}`,
      body: content.length > 80 ? content.slice(0, 80) + "…" : content,
      data: { connection_id: connection.id },
    });

    setSending(false);
  }

  function onMeetingScheduled(meeting: Meeting) {
    setMeetingList((prev) => [...prev, meeting]);
    setShowSchedule(false);
    toast.success("Meeting scheduled! Both participants have been notified.");
  }

  return (
    <div className="bg-background flex h-screen flex-col overflow-hidden">
      <DashboardNav user={currentUser} />
      {/* Header */}
      <header className="border-border bg-parchment border-b px-4 py-3 shrink-0">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <button
            type="button"
            onClick={() => setShowProfile(true)}
            className="hover:bg-muted/50 flex flex-1 items-center gap-3 rounded-lg p-1 text-left transition-colors"
          >
            <Avatar size="sm" variant="default">
              <AvatarFallback>{partnerInitials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium underline-offset-2 group-hover:underline">
                {partner.first_name} {partner.last_name}
              </p>
              <p className="text-muted-foreground text-xs">
                {partner.city}, {partner.province}
              </p>
            </div>
          </button>
          {canScheduleCall && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowSchedule(true)}
              className="gap-1.5"
            >
              <Video className="h-4 w-4" />
              Schedule call
            </Button>
          )}
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-3xl flex-1 min-h-0">
        {/* Chat area */}
        <div className="flex flex-1 flex-col min-h-0">
          {/* Connect prompt */}
          {!isActive && (
            <div className="bg-primary/5 border-border border-b p-4 text-center">
              {connectionState.status === "pending_review" ? (
                <div className="space-y-1">
                  <p className="text-sm font-medium">Under facilitator review</p>
                  <p className="text-muted-foreground text-sm">
                    Both you and <strong>{partner.first_name}</strong> have chosen to connect.
                    A facilitator is reviewing your match — you&apos;ll be notified once approved.
                  </p>
                </div>
              ) : iHaveConnected ? (
                <p className="text-muted-foreground text-sm">
                  Waiting for <strong>{partner.first_name}</strong> to accept your connection
                  request…
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    RTR has matched you with {partner.first_name}!
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Click connect to start your relationship journey. Both parties must connect to
                    activate chat.
                  </p>
                  <Button onClick={handleConnect} size="sm">
                    Connect with {partner.first_name}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Upcoming meeting banner (only the next un-ended one) */}
          {upcomingMeeting && (
            <div className="bg-muted/30 border-border border-b px-4 py-3">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="text-primary h-4 w-4 shrink-0" />
                <span className="font-medium">Next call:</span>
                <span>{format(new Date(upcomingMeeting.scheduled_at), "PPp")}</span>
                {upcomingMeeting.zoom_join_url && (
                  <a
                    href={upcomingMeeting.zoom_join_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary ml-auto text-xs underline"
                  >
                    Join Zoom
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && isActive && (
              <div className="text-muted-foreground py-8 text-center text-sm">
                You&apos;re connected! Say hello to {partner.first_name}.
              </div>
            )}
            {messages.map((msg) => {
              const isMine = msg.sender_id === currentUser.id;
              return (
                <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  {!isMine && (
                    <Avatar
                      size="sm"
                      variant="default"
                      className="mt-1 mr-2"
                    >
                      <AvatarFallback>{partnerInitials}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-[72%] ${isMine ? "text-right" : "text-left"}`}>
                    <div
                      className={`rounded-2xl border px-4 py-2.5 text-left text-[15.5px] ${
                        isMine
                          ? "border-spruce-200 bg-spruce-100 rounded-br-md"
                          : "border-border bg-parchment rounded-bl-md"
                      }`}
                    >
                      <p>{msg.content}</p>
                    </div>
                    <p
                      className={`text-ink-faint mt-1 px-1.5 text-xs ${isMine ? "text-right" : "text-left"}`}
                    >
                      {format(new Date(msg.created_at), "h:mm a")}
                      {isMine && (
                        <span className="ml-1">
                          {msg.read_at ? (
                            <CheckCheck className="inline h-3 w-3" />
                          ) : (
                            <Check className="inline h-3 w-3" />
                          )}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-border bg-card border-t p-3 shrink-0">
            <form onSubmit={sendMessage} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isActive ? "Type a message…" : "Connect first to start chatting"}
                disabled={!isActive || sending}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!isActive || !input.trim() || sending}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {showSchedule && (
        <ScheduleMeetingModal
          connectionId={connection.id}
          currentUser={currentUser}
          partner={partner}
          onClose={() => setShowSchedule(false)}
          onScheduled={onMeetingScheduled}
        />
      )}

      {/* Partner profile dialog */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="max-w-lg p-6 sm:p-8">
          <DialogHeader>
            <div className="flex items-start gap-3">
              <Avatar size="lg" variant="default">
                <AvatarFallback>{partnerInitials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <DialogTitle>
                  {partner.first_name} {partner.last_name}
                </DialogTitle>
                <DialogDescription>
                  <span className="flex flex-wrap items-center gap-2 mt-1">
                    <Badge variant={partner.is_indigenous ? "default" : "secondary"}>
                      {partner.is_indigenous ? "Indigenous" : "Non-Indigenous"}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {partner.city}, {partner.province}
                    </span>
                  </span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 pt-2 text-sm">
            {partner.bio && (
              <div>
                <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-1">
                  About
                </p>
                <p>{partner.bio}</p>
              </div>
            )}
            {partner.treaty_area && (
              <div>
                <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-1">
                  Treaty area
                </p>
                <p>{partner.treaty_area}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              {partner.faith_tradition && (
                <div>
                  <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-1">
                    Faith
                  </p>
                  <p className="capitalize">
                    {partner.faith_tradition === "other"
                      ? partner.faith_tradition_other
                      : partner.faith_tradition.replace(/_/g, " ")}
                  </p>
                </div>
              )}
              {partner.language_preferences.length > 0 && (
                <div>
                  <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-1">
                    Languages
                  </p>
                  <p className="capitalize">{partner.language_preferences.join(", ")}</p>
                </div>
              )}
              {partner.participation_format.length > 0 && (
                <div>
                  <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-1">
                    Format
                  </p>
                  <p className="capitalize">
                    {partner.participation_format.map((f) => f.replace(/_/g, " ")).join(", ")}
                  </p>
                </div>
              )}
            </div>
            {partner.interests.length > 0 && (
              <div>
                <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-1">
                  Interests
                </p>
                <div className="flex flex-wrap gap-1">
                  {partner.interests.map((i) => (
                    <Badge key={i} variant="secondary" className="text-xs capitalize">
                      {i}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
