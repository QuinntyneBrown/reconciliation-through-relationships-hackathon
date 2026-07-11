"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import type { OnboardingData } from "../page";

const FAITH_TRADITIONS = [
  { value: "indigenous_traditional", label: "Indigenous Traditional" },
  { value: "christian", label: "Christian" },
  { value: "muslim", label: "Muslim" },
  { value: "jewish", label: "Jewish" },
  { value: "hindu", label: "Hindu" },
  { value: "buddhist", label: "Buddhist" },
  { value: "atheist", label: "Atheist / Non-religious" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
  { value: "other", label: "Other" },
];

type Props = {
  data: OnboardingData;
  onChange: (fields: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function StepFaithInterests({ data, onChange, onNext, onBack }: Props) {
  const [interestInput, setInterestInput] = useState("");

  function addInterest() {
    const trimmed = interestInput.trim().toLowerCase();
    if (trimmed && !data.interests.includes(trimmed)) {
      onChange({ interests: [...data.interests, trimmed] });
    }
    setInterestInput("");
  }

  function removeInterest(interest: string) {
    onChange({ interests: data.interests.filter((i) => i !== interest) });
  }

  const canContinue = !!data.faith_tradition;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Faith & Interests</h2>
        <p className="text-muted-foreground mt-1">
          These help us find connections who share your values and passions.
        </p>
      </div>

      {/* Faith tradition */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Faith tradition *</Label>
        <RadioGroup
          value={data.faith_tradition}
          onValueChange={(v) => onChange({ faith_tradition: v, faith_tradition_other: "" })}
          className="grid grid-cols-1 gap-2 sm:grid-cols-2"
        >
          {FAITH_TRADITIONS.map(({ value, label }) => (
            <div
              key={value}
              className="border-border hover:bg-muted/50 flex cursor-pointer items-center gap-3 rounded-lg border p-3"
            >
              <RadioGroupItem value={value} id={`faith_${value}`} />
              <Label htmlFor={`faith_${value}`} className="cursor-pointer">
                {label}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {data.faith_tradition === "other" && (
          <div className="space-y-2 pt-1">
            <Label htmlFor="faith_other">Please specify</Label>
            <Input
              id="faith_other"
              value={data.faith_tradition_other}
              onChange={(e) => onChange({ faith_tradition_other: e.target.value })}
              placeholder="Your faith tradition"
            />
          </div>
        )}
      </div>

      {/* Interests */}
      <div className="space-y-3">
        <div>
          <Label className="text-base font-medium">Hobbies & interests</Label>
          <p className="text-muted-foreground mt-0.5 text-sm">
            Add keywords or tags — e.g. hiking, cooking, music, storytelling.
          </p>
        </div>

        <div className="flex gap-2">
          <Input
            value={interestInput}
            onChange={(e) => setInterestInput(e.target.value)}
            placeholder="Add an interest…"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addInterest();
              }
            }}
          />
          <Button type="button" variant="secondary" onClick={addInterest}>
            Add
          </Button>
        </div>

        {data.interests.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.interests.map((interest) => (
              <Badge key={interest} variant="secondary" className="gap-1 capitalize">
                {interest}
                <button onClick={() => removeInterest(interest)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
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
