"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { Profile, Meeting } from "@/types/database";

type Props = {
  connectionId: string;
  currentUser: Profile;
  partner: Profile;
  onClose: () => void;
  onScheduled: (meeting: Meeting) => void;
};

export default function ScheduleMeetingModal({
  connectionId,
  currentUser,
  partner,
  onClose,
  onScheduled,
}: Props) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [topic, setTopic] = useState(
    `RTR Connection Call — ${currentUser.first_name} & ${partner.first_name}`
  );
  const [scheduling, setScheduling] = useState(false);

  async function handleSchedule() {
    if (!date || !time) {
      toast.error("Please select a date and time.");
      return;
    }

    setScheduling(true);
    const scheduledAt = new Date(`${date}T${time}`).toISOString();

    const res = await fetch("/api/zoom/create-meeting", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        connectionId,
        scheduledAt,
        durationMinutes: parseInt(duration),
        topic,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      toast.error(err.error ?? "Failed to schedule meeting. Please try again.");
      setScheduling(false);
      return;
    }

    const meeting: Meeting = await res.json();
    onScheduled(meeting);
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule a call</DialogTitle>
          <DialogDescription>
            A Zoom link will be created and shared with both you and {partner.first_name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Topic</Label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Duration</Label>
            <Select value={duration} onValueChange={(v) => setDuration(v ?? "60")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSchedule} disabled={scheduling} className="flex-1">
              {scheduling ? "Creating Zoom link…" : "Schedule call"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
