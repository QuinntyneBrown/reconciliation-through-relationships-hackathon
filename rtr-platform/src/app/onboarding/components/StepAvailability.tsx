"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { OnboardingData } from "../page";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIMES = ["Morning (6am–12pm)", "Afternoon (12pm–5pm)", "Evening (5pm–9pm)", "Weekends only"];

const FORMATS = [
  { value: "in_person", label: "In-person cohort" },
  { value: "online", label: "Online (video calls)" },
  { value: "chat_only", label: "Chat only" },
];

const LANGUAGES = [
  { value: "english", label: "English" },
  { value: "french", label: "French" },
];

type Props = {
  data: OnboardingData;
  onChange: (fields: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function StepAvailability({ data, onChange, onNext, onBack }: Props) {
  function toggleDay(day: string) {
    const current = data.availability.days;
    onChange({
      availability: {
        ...data.availability,
        days: current.includes(day) ? current.filter((d) => d !== day) : [...current, day],
      },
    });
  }

  function toggleTime(time: string) {
    const current = data.availability.times;
    onChange({
      availability: {
        ...data.availability,
        times: current.includes(time) ? current.filter((t) => t !== time) : [...current, time],
      },
    });
  }

  function toggleFormat(value: string) {
    const current = data.participation_format;
    onChange({
      participation_format: current.includes(value)
        ? current.filter((f) => f !== value)
        : [...current, value],
    });
  }

  function toggleLanguage(value: string) {
    const current = data.language_preferences;
    onChange({
      language_preferences: current.includes(value)
        ? current.filter((l) => l !== value)
        : [...current, value],
    });
  }

  const canContinue =
    data.participation_format.length > 0 && data.language_preferences.length > 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Availability & Preferences</h2>
        <p className="text-muted-foreground mt-1">
          Help us find connections who are available when you are.
        </p>
      </div>

      {/* Days */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Days available</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DAYS.map((day) => (
            <div
              key={day}
              className="flex items-center gap-2 p-2.5 rounded-lg border border-border hover:bg-muted/50 cursor-pointer"
              onClick={() => toggleDay(day)}
            >
              <Checkbox
                checked={data.availability.days.includes(day)}
                onCheckedChange={() => toggleDay(day)}
                id={`day_${day}`}
              />
              <Label htmlFor={`day_${day}`} className="cursor-pointer text-sm">
                {day.slice(0, 3)}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Times */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Preferred times</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {TIMES.map((time) => (
            <div
              key={time}
              className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer"
              onClick={() => toggleTime(time)}
            >
              <Checkbox
                checked={data.availability.times.includes(time)}
                onCheckedChange={() => toggleTime(time)}
                id={`time_${time}`}
              />
              <Label htmlFor={`time_${time}`} className="cursor-pointer text-sm">
                {time}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Participation format */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Preferred participation format *</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {FORMATS.map(({ value, label }) => (
            <div
              key={value}
              className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer"
              onClick={() => toggleFormat(value)}
            >
              <Checkbox
                checked={data.participation_format.includes(value)}
                onCheckedChange={() => toggleFormat(value)}
                id={`fmt_${value}`}
              />
              <Label htmlFor={`fmt_${value}`} className="cursor-pointer text-sm">
                {label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Language */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Language preferences *</Label>
        <div className="flex gap-3">
          {LANGUAGES.map(({ value, label }) => (
            <div
              key={value}
              className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer"
              onClick={() => toggleLanguage(value)}
            >
              <Checkbox
                checked={data.language_preferences.includes(value)}
                onCheckedChange={() => toggleLanguage(value)}
                id={`lang_${value}`}
              />
              <Label htmlFor={`lang_${value}`} className="cursor-pointer">
                {label}
              </Label>
            </div>
          ))}
        </div>
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
