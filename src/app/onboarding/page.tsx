"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  PARTICIPATION_CATEGORIES,
  PARTICIPATION_CATEGORY_LABELS,
  type ParticipationCategory,
} from "@/domain/constants";
import { participantIntakeSchema } from "@/domain/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * ⚠️ STARTER FORM — Onboarding squad, this is your workspace.
 *
 * It demonstrates the full pattern end-to-end: shared zod schema → POST
 * /api/participants → repository. It covers only a few fields on purpose.
 *
 * TODO (from the brief): sex + self-describe, location (city/province/treaty),
 * faith tradition + other, interests/tags, availability, preferred format,
 * languages, personal boundaries, map consent. Build these out as a proper
 * multi-step wizard. All option lists live in src/domain/constants.ts.
 */
export default function OnboardingPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [categories, setCategories] = useState<ParticipationCategory[]>([]);
  const [submitting, setSubmitting] = useState(false);

  function toggleCategory(c: ParticipationCategory) {
    setCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Fill unbuilt fields with placeholders so the demo submits. Replace these
    // with real inputs as you build out the form.
    const draft = {
      name,
      email,
      sex: "self-described" as const,
      categories,
      location: { city: "Regina", province: "SK" as const },
      faithTradition: "other" as const,
      interests: [],
      availability: {},
      preferredFormat: "hybrid" as const,
      languages: ["English"],
      consentToMap: false,
    };

    const parsed = participantIntakeSchema.safeParse(draft);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      toast.error(first?.message ?? "Please check the form");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error("Request failed");
      toast.success("Welcome! Your profile was created.");
      setName("");
      setEmail("");
      setCategories([]);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Join the journey</h1>
      <p className="text-muted-foreground mt-2">
        Tell us a little about yourself. You&apos;ll begin the learning journey next.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Your details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-3">
              <Label>Participation category (choose one or more)</Label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {PARTICIPATION_CATEGORIES.map((c) => (
                  <label key={c} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={categories.includes(c)}
                      onCheckedChange={() => toggleCategory(c)}
                    />
                    {PARTICIPATION_CATEGORY_LABELS[c]}
                  </label>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
