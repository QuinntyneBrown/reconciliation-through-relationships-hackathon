import type { Profile } from "@/data/supabase/database.types";

/**
 * Scores how well a facilitator fits a participant, on three signals:
 * interests, location, and gender. Gender uses a same-gender-preferred rule
 * (comfort/safety) and is only applied when the participant opts in via
 * `matching_preferences.weight_sex`. Location and interests are applied unless
 * the participant explicitly opts out.
 *
 * Pure function, mirroring src/domain/profile-matching.ts so it stays easy to
 * unit-test and reason about. A facilitator still makes the final call.
 */

export type FacilitatorMatchCriteria = {
  location: number;
  interests: number;
  gender: number;
};

export type FacilitatorMatchResult = {
  facilitator: Profile;
  score: number;
  criteria: FacilitatorMatchCriteria;
};

const MAX = { location: 40, interests: 40, gender: 20 } as const;

type MatchingPreferences = {
  weight_sex?: boolean;
  weight_interests?: boolean;
  weight_location?: boolean;
};

function preferences(p: Profile): MatchingPreferences {
  return (p.matching_preferences as MatchingPreferences | null) ?? {};
}

function scoreLocation(participant: Profile, facilitator: Profile): number {
  if (preferences(participant).weight_location === false) return 0;
  if (!participant.city || !facilitator.city) return 0;
  if (participant.city.toLowerCase() === facilitator.city.toLowerCase()) return MAX.location;
  if (
    participant.province &&
    facilitator.province &&
    participant.province === facilitator.province
  ) {
    return Math.round(MAX.location / 2);
  }
  return 0;
}

function scoreInterests(participant: Profile, facilitator: Profile): number {
  if (preferences(participant).weight_interests === false) return 0;
  const a = participant.interests ?? [];
  const b = facilitator.interests ?? [];
  if (a.length === 0 || b.length === 0) return 0;
  const lowerB = b.map((i) => i.toLowerCase());
  const shared = a.filter((i) => lowerB.includes(i.toLowerCase())).length;
  if (shared === 0) return 0;
  const ratio = shared / Math.min(a.length, b.length);
  return Math.round(ratio * MAX.interests);
}

/** Same-gender preferred, opt-in via weight_sex. "prefer_not_to_say"/null is neutral. */
function scoreGender(participant: Profile, facilitator: Profile): number {
  if (!preferences(participant).weight_sex) return 0;
  const a = participant.sex;
  const b = facilitator.sex;
  if (!a || !b || a === "prefer_not_to_say" || b === "prefer_not_to_say") return 0;
  return a === b ? MAX.gender : 0;
}

export function scoreFacilitator(
  participant: Profile,
  facilitator: Profile,
): FacilitatorMatchResult {
  const criteria: FacilitatorMatchCriteria = {
    location: scoreLocation(participant, facilitator),
    interests: scoreInterests(participant, facilitator),
    gender: scoreGender(participant, facilitator),
  };
  const score = criteria.location + criteria.interests + criteria.gender;
  return { facilitator, score, criteria };
}

/** Rank facilitators for a participant, best fit first. */
export function computeFacilitatorMatches(
  participant: Profile,
  facilitators: Profile[],
): FacilitatorMatchResult[] {
  return facilitators
    .map((facilitator) => scoreFacilitator(participant, facilitator))
    .sort((a, b) => b.score - a.score);
}

export function facilitatorCriteriaLabels(criteria: FacilitatorMatchCriteria): {
  label: string;
  points: number;
  max: number;
}[] {
  return [
    { label: "Location", points: criteria.location, max: MAX.location },
    { label: "Shared interests", points: criteria.interests, max: MAX.interests },
    { label: "Gender", points: criteria.gender, max: MAX.gender },
  ];
}
