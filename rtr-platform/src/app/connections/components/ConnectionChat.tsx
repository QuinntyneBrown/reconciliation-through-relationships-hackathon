"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Send, Video, Clock, Check, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import type { Profile, Connection, Message, Meeting } from "@/types/database";
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
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  const partnerInitials =
    `${partner.first_name?.[0] ?? ""}${partner.last_name?.[0] ?? ""}`.toUpperCase();
  const iHaveConnected = connectionState[myConnectedField];
  const isActive = connectionState.status === "active";

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
          setMessages((prev) => [...prev, payload.new as Message]);
        }
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
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [connection.id]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleConnect() {
    const { error } = await supabase
      .from("connections")
      .update({
        [myConnectedField]: true,
        ...(connectionState[
          myConnectedField === "participant_a_connected"
            ? "participant_b_connected"
            : "participant_a_connected"
        ]
          ? { status: "active", connected_at: new Date().toISOString() }
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

    toast.success("Connection request sent!");
    router.refresh();
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !isActive) return;

    setSending(true);
    const content = input.trim();
    setInput("");

    const { error } = await supabase.from("messages").insert({
      connection_id: connection.id,
      sender_id: currentUser.id,
      content,
    });

    if (error) {
      toast.error("Failed to send message.");
      setInput(content);
    }

    setSending(false);
  }

  function onMeetingScheduled(meeting: Meeting) {
    setMeetingList((prev) => [...prev, meeting]);
    setShowSchedule(false);
    toast.success("Meeting scheduled! Both participants have been notified.");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-3 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/connections">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
              {partnerInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium text-sm">
              {partner.first_name} {partner.last_name}
            </p>
            <p className="text-xs text-muted-foreground">
              {partner.city}, {partner.province}
            </p>
          </div>
          {isActive && (
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

      <div className="flex-1 flex max-w-3xl mx-auto w-full">
        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {/* Connect prompt */}
          {!isActive && (
            <div className="p-4 bg-primary/5 border-b border-border text-center">
              {iHaveConnected ? (
                <p className="text-sm text-muted-foreground">
                  Waiting for <strong>{partner.first_name}</strong> to accept your connection request…
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    RTR has matched you with {partner.first_name}!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Click connect to start your relationship journey. Both parties must connect to activate chat.
                  </p>
                  <Button onClick={handleConnect} size="sm">
                    Connect with {partner.first_name}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Upcoming meetings */}
          {meetingList.length > 0 && (
            <div className="px-4 py-3 bg-muted/30 border-b border-border">
              {meetingList.slice(0, 1).map((meeting) => (
                <div key={meeting.id} className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-medium">Next call:</span>
                  <span>{format(new Date(meeting.scheduled_at), "PPp")}</span>
                  {meeting.zoom_join_url && (
                    <a
                      href={meeting.zoom_join_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto text-primary underline text-xs"
                    >
                      Join Zoom
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && isActive && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                You&apos;re connected! Say hello to {partner.first_name}.
              </div>
            )}
            {messages.map((msg) => {
              const isMine = msg.sender_id === currentUser.id;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  {!isMine && (
                    <Avatar className="h-6 w-6 mr-2 shrink-0 mt-1">
                      <AvatarFallback className="text-xs bg-primary/20 text-primary">
                        {partnerInitials}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                      isMine
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-card border border-border rounded-bl-sm"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className={`text-xs mt-1 ${isMine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {format(new Date(msg.created_at), "h:mm a")}
                      {isMine && (
                        <span className="ml-1">
                          {msg.read_at ? <CheckCheck className="inline h-3 w-3" /> : <Check className="inline h-3 w-3" />}
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
          <div className="border-t border-border p-3 bg-card">
            <form onSubmit={sendMessage} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isActive ? "Type a message…" : "Connect first to start chatting"}
                disabled={!isActive || sending}
                className="flex-1"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!isActive || !input.trim() || sending}
              >
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
    </div>
  );
}
