"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/data/supabase/browser-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Zap, Users } from "lucide-react";
import { PageIntro } from "@/components/page-intro";

type Props = {
  settings: Record<string, unknown>;
  facilitatorId: string;
};

export default function SettingsClient({ settings, facilitatorId }: Props) {
  const [autoMatching, setAutoMatching] = useState(
    (settings.auto_matching_enabled as boolean) ?? true,
  );
  const [cohortThreshold, setCohortThreshold] = useState(String(settings.cohort_threshold ?? "5"));
  const [saving, setSaving] = useState(false);
  const supabase = createSupabaseBrowserClient();

  async function saveSettings() {
    setSaving(true);
    const updates = [
      supabase.from("system_settings").upsert({
        key: "auto_matching_enabled",
        value: autoMatching,
        updated_by: facilitatorId,
        updated_at: new Date().toISOString(),
      }),
      supabase.from("system_settings").upsert({
        key: "cohort_threshold",
        value: parseInt(cohortThreshold),
        updated_by: facilitatorId,
        updated_at: new Date().toISOString(),
      }),
    ];

    const results = await Promise.all(updates);
    const hasError = results.some((r) => r.error);

    if (hasError) {
      toast.error("Failed to save settings.");
    } else {
      toast.success("Settings saved.");
    }
    setSaving(false);
  }

  return (
    <main className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6">
      <PageIntro
        eyebrow="Platform administration"
        title="Platform settings"
        description="Configure matching behavior and the threshold for forming regional reconciliation cohorts."
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Zap className="h-4 w-4" />
            Matching
          </CardTitle>
          <CardDescription>Control how the matching algorithm behaves.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-border flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label className="cursor-pointer font-medium">Auto-matching enabled</Label>
              <p className="text-muted-foreground mt-0.5 text-xs">
                When on, the system automatically generates match suggestions. Facilitator approval
                is always required regardless.
              </p>
            </div>
            <Switch checked={autoMatching} onCheckedChange={setAutoMatching} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4" />
            Regional Cohorts
          </CardTitle>
          <CardDescription>
            Set the minimum number of eligible participants required to suggest forming a cohort.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Label htmlFor="cohort-threshold" className="shrink-0">
              Cohort threshold
            </Label>
            <Input
              id="cohort-threshold"
              type="number"
              min="3"
              max="20"
              value={cohortThreshold}
              onChange={(e) => setCohortThreshold(e.target.value)}
              className="w-24"
            />
            <span className="text-muted-foreground text-sm">participants</span>
          </div>
        </CardContent>
      </Card>

      <Button onClick={saveSettings} disabled={saving}>
        {saving ? "Saving…" : "Save settings"}
      </Button>
    </main>
  );
}
