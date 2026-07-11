"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import type { OnboardingData } from "../page";

type Props = {
  data: OnboardingData;
  onChange: (fields: Partial<OnboardingData>) => void;
  onBack: () => void;
  onSubmit: () => void;
  saving: boolean;
};

export default function StepMatchingPreferences({
  data,
  onChange,
  onBack,
  onSubmit,
  saving,
}: Props) {
  function updateMatchPref(key: keyof OnboardingData["matching_preferences"], value: boolean) {
    onChange({
      matching_preferences: { ...data.matching_preferences, [key]: value },
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Matching preferences</h2>
        <p className="text-muted-foreground mt-1">
          Tell us what matters most when finding your connection, and share any boundaries
          you&apos;d like us to respect.
        </p>
      </div>

      {/* Matching weights */}
      <div className="space-y-4">
        <Label className="text-base font-medium">
          Which factors are important in your match?
        </Label>
        <div className="space-y-3">
          {[
            { key: "weight_location" as const, label: "Location (same city/region)" },
            { key: "weight_interests" as const, label: "Shared interests" },
            { key: "weight_sex" as const, label: "Same sex" },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between p-4 rounded-lg border border-border">
              <Label htmlFor={key} className="cursor-pointer">
                {label}
              </Label>
              <Switch
                id={key}
                checked={data.matching_preferences[key]}
                onCheckedChange={(checked) => updateMatchPref(key, checked)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Personal boundaries */}
      <div className="space-y-2">
        <Label htmlFor="personal_boundaries">Personal boundaries & other preferences</Label>
        <p className="text-sm text-muted-foreground">
          Anything you&apos;d like a facilitator to know when making your match — topics you&apos;re not comfortable
          discussing, accessibility needs, or other preferences.
        </p>
        <Textarea
          id="personal_boundaries"
          value={data.personal_boundaries}
          onChange={(e) => onChange({ personal_boundaries: e.target.value })}
          placeholder="e.g. I prefer not to discuss specific denominations. I have limited mobility."
          rows={4}
        />
      </div>

      {/* Map consent */}
      <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-muted/30">
        <Checkbox
          id="map_consent"
          checked={data.map_consent}
          onCheckedChange={(checked) => onChange({ map_consent: checked === true })}
          className="mt-0.5"
        />
        <div>
          <Label htmlFor="map_consent" className="cursor-pointer font-medium">
            Show me on the regional map
          </Label>
          <p className="text-sm text-muted-foreground mt-0.5">
            I consent to my city (not my exact address) being shown on the participant map
            to help facilitators identify local reconciliation cohorts. This is optional.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground mb-1">Privacy commitment</p>
        <p>
          Your personal information is only shared with your matched connection and RTR facilitators.
          Your exact location is never shown to other participants. You can update or delete your
          profile at any time.
        </p>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={onSubmit} disabled={saving} className="flex-1" size="lg">
          {saving ? "Saving…" : "Complete profile"}
        </Button>
      </div>
    </div>
  );
}
