"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { OnboardingData } from "../page";

const PROVINCES = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Northwest Territories",
  "Nova Scotia",
  "Nunavut",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Yukon",
];

type Props = {
  data: OnboardingData;
  onChange: (fields: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function StepLocation({ data, onChange, onNext, onBack }: Props) {
  const canContinue = data.city.trim() && data.province;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Where are you located?</h2>
        <p className="text-muted-foreground mt-1">
          Location helps us connect you with people in your region and identify local reconciliation cohorts.
          Only your city will be shown on the map — never your exact address.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">City / Town / County *</Label>
        <Input
          id="city"
          value={data.city}
          onChange={(e) => onChange({ city: e.target.value })}
          placeholder="e.g. Saskatoon"
        />
      </div>

      <div className="space-y-2">
        <Label>Province / Territory *</Label>
        <Select value={data.province} onValueChange={(v) => onChange({ province: v ?? "" })}>
          <SelectTrigger>
            <SelectValue placeholder="Select province or territory" />
          </SelectTrigger>
          <SelectContent>
            {PROVINCES.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="treaty_area">Nearest Treaty area</Label>
        <p className="text-sm text-muted-foreground">
          The treaty area nearest to where you live, worship, or work.{" "}
          <a
            href="https://native-land.ca/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Use native-land.ca
          </a>{" "}
          to look it up.
        </p>
        <Input
          id="treaty_area"
          value={data.treaty_area}
          onChange={(e) => onChange({ treaty_area: e.target.value })}
          placeholder="e.g. Treaty 6 Territory"
        />
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={onNext} disabled={!canContinue} className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  );
}
