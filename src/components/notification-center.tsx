"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/data/supabase/browser-client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, MessageCircle, Heart, Video, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import type { Notification } from "@/data/supabase/database.types";

type Props = {
  userId: string;
};

const TYPE_ICONS: Record<Notification["type"], typeof Bell> = {
  connect_request: Heart,
  match_approved: CheckCircle2,
  new_message: MessageCircle,
  meeting_scheduled: Video,
};

function targetHref(n: Notification): string | null {
  const data = (n.data ?? {}) as Record<string, unknown>;
  const connectionId = typeof data.connection_id === "string" ? data.connection_id : null;
  if (n.type === "new_message" || n.type === "connect_request" || n.type === "meeting_scheduled") {
    return connectionId ? `/connections/${connectionId}` : "/connections";
  }
  if (n.type === "match_approved") {
    return connectionId ? `/connections/${connectionId}` : "/dashboard";
  }
  return null;
}

export function NotificationCenter({ userId }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    let mounted = true;

    async function load() {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);
      if (mounted && data) setNotifications(data);
    }
    load();

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const n = payload.new as Notification;
          setNotifications((prev) =>
            prev.some((x) => x.id === n.id) ? prev : [n, ...prev].slice(0, 20),
          );
          toast(n.title, {
            description: n.body ?? undefined,
            action: {
              label: "View",
              onClick: () => {
                const href = targetHref(n);
                if (href) router.push(href);
              },
            },
          });
        },
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [userId, router]);

  const unread = notifications.filter((n) => !n.read).length;

  async function markAllRead() {
    const supabase = createSupabaseBrowserClient();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await supabase.from("notifications").update({ read: true }).eq("user_id", userId).eq("read", false);
  }

  async function handleClick(n: Notification) {
    const supabase = createSupabaseBrowserClient();
    if (!n.read) {
      setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
      await supabase.from("notifications").update({ read: true }).eq("id", n.id);
    }
    const href = targetHref(n);
    if (href) {
      setOpen(false);
      router.push(href);
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="quiet"
          size="icon"
          className="text-on-dark hover:bg-spruce-700 hover:text-on-dark relative rounded-full"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="bg-ochre-500 text-spruce-900 absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="border-border flex items-center justify-between border-b px-4 py-2.5">
          <p className="font-semibold text-sm">Notifications</p>
          {unread > 0 && (
            <button
              onClick={markAllRead}
              className="text-primary hover:text-primary-hover text-xs font-medium"
            >
              Mark all read
            </button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-muted-foreground px-4 py-8 text-center text-sm">
              <Bell className="mx-auto mb-2 h-6 w-6 opacity-30" />
              No notifications yet
            </div>
          ) : (
            notifications.map((n) => {
              const Icon = TYPE_ICONS[n.type] ?? Bell;
              return (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={`hover:bg-muted/50 border-border flex w-full items-start gap-3 border-b p-3 text-left transition-colors last:border-b-0 ${
                    !n.read ? "bg-primary/5" : ""
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      !n.read ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm ${!n.read ? "font-semibold" : "font-medium"}`}>
                      {n.title}
                    </p>
                    {n.body && (
                      <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs">{n.body}</p>
                    )}
                    <p className="text-muted-foreground mt-1 text-[11px]">
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  {!n.read && (
                    <span className="bg-primary mt-2 h-2 w-2 shrink-0 rounded-full" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
