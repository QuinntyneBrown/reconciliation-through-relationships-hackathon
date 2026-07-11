"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { OnboardingData } from "../page";

const PARTICIPATION_CATEGORIES = [
  { value: "indigenous_leader", label: "Indigenous Leader" },
  { value: "indigenous_individual", label: "Indigenous Individual" },
  { value: "non_indigenous_individual", label: "Non-Indigenous Individual" },
  { value: "elected_leader", label: "Elected Leader" },
  { value: "religious_leader", label: "Religious Leader" },
  { value: "artist", label: "Artist" },
  { value: "other", label: "Other" },
];

type Props = {
  data: OnboardingData;
  onChange: (fields: Partial<OnboardingData>) => void;
  onNext: () => void;
};

export default function StepBasicInfo({ data, onChange, onNext }: Props) {
  function toggleCategory(value: string) {
    const current = data.participation_categories;
    onChange({
      participation_categories: current.includes(value)
        ? current.filter((c) => c !== value)
        : [...current, value],
    });
  }

  const requiredCategories = [
    "indigenous_leader",
    "indigenous_individual",
    "non_indigenous_individual",
  ];
  const hasRequiredCategory = data.participation_categories.some((c) =>
    requiredCategories.includes(c),
  );

  const canContinue =
    data.first_name.trim() &&
    data.last_name.trim() &&
    data.age &&
    data.sex &&
    data.is_indigenous !== null &&
    hasRequiredCategory;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Tell us about yourself</h2>
        <p className="text-muted-foreground mt-1">
          This information helps us create your profile and find the right connections for you.
        </p>
      </div>

      {/* Name */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First name *</Label>
          <Input
            id="first_name"
            value={data.first_name}
            onChange={(e) => onChange({ first_name: e.target.value })}
            placeholder="Jane"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Last name *</Label>
          <Input
            id="last_name"
            value={data.last_name}
            onChange={(e) => onChange({ last_name: e.target.value })}
            placeholder="Smith"
          />
        </div>
      </div>

      {/* Age */}
      <div className="space-y-2">
        <Label htmlFor="age">Age *</Label>
        <Input
          id="age"
          type="number"
          value={data.age ?? ""}
          onChange={(e) => onChange({ age: e.target.value ? parseInt(e.target.value, 10) : null })}
          placeholder="25"
          min="13"
          max="120"
        />
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={data.bio}
          onChange={(e) => onChange({ bio: e.target.value })}
          placeholder="Share a little about who you are — your story, what you care about, and what brings you to RTR."
          rows={4}
        />
      </div>

      {/* Additional matching info */}
      <div className="space-y-2">
        <Label htmlFor="additional_matching_info">Additional matching information</Label>
        <Textarea
          id="additional_matching_info"
          value={data.additional_matching_info}
          onChange={(e) => onChange({ additional_matching_info: e.target.value })}
          placeholder="Anything else you'd like a potential match to know about you before connecting."
          rows={3}
        />
      </div>

      {/* Are you Indigenous */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Are you Indigenous? *</Label>
        <RadioGroup
          value={data.is_indigenous === null ? "" : data.is_indigenous ? "yes" : "no"}
          onValueChange={(v) => onChange({ is_indigenous: v === "yes" })}
          className="flex gap-6"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="yes" id="indigenous_yes" />
            <Label htmlFor="indigenous_yes">Yes</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="no" id="indigenous_no" />
            <Label htmlFor="indigenous_no">No</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Sex */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Sex *</Label>
        <RadioGroup
          value={data.sex}
          onValueChange={(v) => onChange({ sex: v })}
          className="flex flex-wrap gap-6"
        >
          {[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "prefer_not_to_say", label: "Prefer not to say" },
          ].map(({ value, label }) => (
            <div key={value} className="flex items-center gap-2">
              <RadioGroupItem value={value} id={`sex_${value}`} />
              <Label htmlFor={`sex_${value}`}>{label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Participation categories */}
      <div className="space-y-3">
        <div>
          <Label className="text-base font-medium">Participation categories *</Label>
          <p className="text-muted-foreground mt-0.5 text-sm">
            Select all that apply. At least one of Indigenous Leader, Indigenous Individual, or
            Non-Indigenous Individual is required.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {PARTICIPATION_CATEGORIES.map(({ value, label }) => (
            <div
              key={value}
              className="border-border hover:bg-muted/50 flex cursor-pointer items-center gap-3 rounded-lg border p-3"
              onClick={() => toggleCategory(value)}
            >
              <Checkbox
                checked={data.participation_categories.includes(value)}
                onCheckedChange={() => toggleCategory(value)}
                id={`cat_${value}`}
              />
              <Label htmlFor={`cat_${value}`} className="cursor-pointer">
                {label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={onNext} disabled={!canContinue} className="w-full" size="lg">
        Continue
      </Button>
    </div>
  );
}
