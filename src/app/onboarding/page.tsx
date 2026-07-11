"use client";

import { useState } from "react";
import type { ProfileRow } from "@/data/supabase/database.types";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/data/supabase/browser-client";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import StepBasicInfo from "./components/StepBasicInfo";
import StepLocation from "./components/StepLocation";
import StepFaithInterests from "./components/StepFaithInterests";
import StepAvailability from "./components/StepAvailability";
import StepMatchingPreferences from "./components/StepMatchingPreferences";

export type OnboardingData = {
  first_name: string;
  last_name: string;
  bio: string;
  additional_matching_info: string;
  is_indigenous: boolean | null;
  sex: string;
  age: number | null;
  participation_categories: string[];
  city: string;
  province: string;
  treaty_area: string;
  faith_tradition: string;
  faith_tradition_other: string;
  interests: string[];
  availability: { days: string[]; times: string[] };
  participation_format: string[];
  language_preferences: string[];
  personal_boundaries: string;
  matching_preferences: {
    weight_sex: boolean;
    weight_interests: boolean;
    weight_location: boolean;
  };
  map_consent: boolean;
};

const INITIAL_DATA: OnboardingData = {
  first_name: "",
  last_name: "",
  bio: "",
  additional_matching_info: "",
  is_indigenous: null,
  sex: "",
  age: null,
  participation_categories: [],
  city: "",
  province: "",
  treaty_area: "",
  faith_tradition: "",
  faith_tradition_other: "",
  interests: [],
  availability: { days: [], times: [] },
  participation_format: [],
  language_preferences: [],
  personal_boundaries: "",
  matching_preferences: {
    weight_sex: false,
    weight_interests: true,
    weight_location: true,
  },
  map_consent: false,
};

const STEPS = [
  "Basic Info",
  "Location & Treaty",
  "Faith & Interests",
  "Availability & Format",
  "Matching Preferences",
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(INITIAL_DATA);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  function updateData(fields: Partial<OnboardingData>) {
    setData((prev) => ({ ...prev, ...fields }));
  }

  function next() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submit() {
    setSaving(true);
    const supabase = createSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Session expired. Please sign in again.");
      router.push("/auth/login");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: data.first_name,
        last_name: data.last_name,
        bio: data.bio,
        additional_matching_info: data.additional_matching_info,
        is_indigenous: data.is_indigenous,
        sex: data.sex as "male" | "female" | "prefer_not_to_say" | undefined,
        age: data.age,
        participation_categories: data.participation_categories,
        city: data.city,
        province: data.province,
        treaty_area: data.treaty_area,
        faith_tradition: data.faith_tradition as ProfileRow["faith_tradition"],
        faith_tradition_other: data.faith_tradition_other,
        interests: data.interests,
        availability: data.availability,
        participation_format: data.participation_format,
        language_preferences: data.language_preferences,
        personal_boundaries: data.personal_boundaries,
        matching_preferences: data.matching_preferences,
        map_consent: data.map_consent,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      toast.error("Something went wrong. Please try again.");
      setSaving(false);
      return;
    }

    toast.success("Profile saved! Let's start your learning journey.");
    router.push("/learn");
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-primary">RTR · Create your profile</p>
            <button
              onClick={async () => {
                const { createSupabaseBrowserClient } = await import("@/data/supabase/browser-client");
                await createSupabaseBrowserClient().auth.signOut();
                router.push("/auth/login");
              }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign out
            </button>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <Progress value={progress} className="flex-1 h-2" />
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              Step {step + 1} of {STEPS.length}
            </span>
          </div>
          <div className="mt-2 flex gap-1">
            {STEPS.map((s, i) => (
              <span
                key={s}
                className={`text-xs px-2 py-0.5 rounded-full ${
                  i === step
                    ? "bg-primary text-primary-foreground"
                    : i < step
                    ? "bg-accent/20 text-accent-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Step content */}
      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-2xl">
          {step === 0 && (
            <StepBasicInfo data={data} onChange={updateData} onNext={next} />
          )}
          {step === 1 && (
            <StepLocation data={data} onChange={updateData} onNext={next} onBack={back} />
          )}
          {step === 2 && (
            <StepFaithInterests data={data} onChange={updateData} onNext={next} onBack={back} />
          )}
          {step === 3 && (
            <StepAvailability data={data} onChange={updateData} onNext={next} onBack={back} />
          )}
          {step === 4 && (
            <StepMatchingPreferences
              data={data}
              onChange={updateData}
              onBack={back}
              onSubmit={submit}
              saving={saving}
            />
          )}
        </div>
      </main>
    </div>
  );
}
