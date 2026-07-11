import type { Profile } from "@/data/supabase/database.types";

export type MatchResult = {
  participant: Profile;
  score: number;
  criteria: {
    location: number;
    availability: number;
    interests: number;
    language: number;
    faith: number;
    format: number;
  };
};

export function computeMatches(currentUser: Profile, candidates: Profile[]): MatchResult[] {
  // Only match Indigenous ↔ Non-Indigenous
  const eligible = candidates.filter((c) => c.is_indigenous !== currentUser.is_indigenous);

  return eligible
    .map((candidate) => {
      const criteria = scoreCriteria(currentUser, candidate);
      const score = Object.values(criteria).reduce((a, b) => a + b, 0);
      return { participant: candidate, score, criteria };
    })
    .sort((a, b) => b.score - a.score);
}

function scoreCriteria(user: Profile, candidate: Profile): MatchResult["criteria"] {
  return {
    location: scoreLocation(user, candidate),
    availability: scoreAvailability(user, candidate),
    interests: scoreInterests(user, candidate),
    language: scoreLanguage(user, candidate),
    faith: scoreFaith(user, candidate),
    format: scoreFormat(user, candidate),
  };
}

function scoreLocation(a: Profile, b: Profile): number {
  if (!a.city || !b.city) return 0;
  if (a.city.toLowerCase() === b.city.toLowerCase()) return 30;
  if (a.province && b.province && a.province === b.province) return 15;
  return 0;
}

function scoreAvailability(a: Profile, b: Profile): number {
  const avA = a.availability as { days?: string[]; times?: string[] } | null;
  const avB = b.availability as { days?: string[]; times?: string[] } | null;
  if (!avA || !avB) return 0;

  const daysA = avA.days ?? [];
  const daysB = avB.days ?? [];
  const timesA = avA.times ?? [];
  const timesB = avB.times ?? [];

  const dayOverlap = daysA.filter((d) => daysB.includes(d)).length;
  const timeOverlap = timesA.filter((t) => timesB.includes(t)).length;

  if (dayOverlap === 0 && timeOverlap === 0) return 0;
  const dayScore = Math.min(dayOverlap / Math.max(daysA.length, 1), 1) * 10;
  const timeScore = Math.min(timeOverlap / Math.max(timesA.length, 1), 1) * 10;
  return Math.round(dayScore + timeScore);
}

function scoreInterests(a: Profile, b: Profile): number {
  const iA = a.interests ?? [];
  const iB = b.interests ?? [];
  if (iA.length === 0 || iB.length === 0) return 0;

  const shared = iA.filter((i) => iB.includes(i)).length;
  const ratio = shared / Math.min(iA.length, iB.length);
  return Math.round(ratio * 20);
}

function scoreLanguage(a: Profile, b: Profile): number {
  const lA = a.language_preferences ?? [];
  const lB = b.language_preferences ?? [];
  if (lA.length === 0 || lB.length === 0) return 0;
  return lA.some((l) => lB.includes(l)) ? 10 : 0;
}

function scoreFaith(a: Profile, b: Profile): number {
  if (!a.faith_tradition || !b.faith_tradition) return 0;
  return a.faith_tradition === b.faith_tradition ? 10 : 0;
}

function scoreFormat(a: Profile, b: Profile): number {
  const fA = a.participation_format ?? [];
  const fB = b.participation_format ?? [];
  if (fA.length === 0 || fB.length === 0) return 0;
  return fA.some((f) => fB.includes(f)) ? 10 : 0;
}

export function criteriaLabels(criteria: MatchResult["criteria"]): {
  label: string;
  points: number;
  max: number;
}[] {
  return [
    { label: "Location", points: criteria.location, max: 30 },
    { label: "Availability", points: criteria.availability, max: 20 },
    { label: "Shared interests", points: criteria.interests, max: 20 },
    { label: "Language", points: criteria.language, max: 10 },
    { label: "Faith tradition", points: criteria.faith, max: 10 },
    { label: "Format", points: criteria.format, max: 10 },
  ];
}
