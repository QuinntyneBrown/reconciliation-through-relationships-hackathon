import { INDIGENOUS_CATEGORIES } from "./constants";
import type { ParticipantProfile } from "./types";
import { isEligible } from "./types";

export function isIndigenous(p: ParticipantProfile): boolean {
  return p.categories.some((c) => INDIGENOUS_CATEGORIES.includes(c));
}

export interface MatchSuggestion {
  a: ParticipantProfile;
  b: ParticipantProfile;
  score: number;
  reasons: string[];
}

/**
 * Score a potential pairing 0..100 with human-readable reasons.
 *
 * This is intentionally a simple, transparent heuristic — a facilitator makes
 * the final call (the brief requires human approval). Tune the weights freely;
 * keep it a pure function so it stays easy to unit-test and reason about.
 */
export function scorePair(a: ParticipantProfile, b: ParticipantProfile): MatchSuggestion {
  const reasons: string[] = [];
  let score = 0;

  // Geography (same city is strongest signal for local relationship-building).
  if (a.location.province === b.location.province) {
    if (a.location.city.toLowerCase() === b.location.city.toLowerCase()) {
      score += 30;
      reasons.push(`Both in ${a.location.city}`);
    } else {
      score += 12;
      reasons.push(`Both in ${a.location.province}`);
    }
  }

  // Shared languages.
  const sharedLangs = a.languages.filter((l) =>
    b.languages.map((x) => x.toLowerCase()).includes(l.toLowerCase()),
  );
  if (sharedLangs.length > 0) {
    score += 20;
    reasons.push(`Shared language: ${sharedLangs.join(", ")}`);
  }

  // Shared interests.
  const sharedInterests = a.interests.filter((i) =>
    b.interests.map((x) => x.toLowerCase()).includes(i.toLowerCase()),
  );
  if (sharedInterests.length > 0) {
    score += Math.min(20, sharedInterests.length * 8);
    reasons.push(`Shared interests: ${sharedInterests.join(", ")}`);
  }

  // Compatible participation format.
  if (a.preferredFormat === b.preferredFormat) {
    score += 15;
    reasons.push(`Both prefer ${a.preferredFormat}`);
  } else if (a.preferredFormat === "hybrid" || b.preferredFormat === "hybrid") {
    score += 8;
    reasons.push("Compatible participation format");
  }

  // Availability overlap.
  const av = a.availability;
  const bv = b.availability;
  if (
    (av.weekdays && bv.weekdays) ||
    (av.weekends && bv.weekends) ||
    (av.evenings && bv.evenings)
  ) {
    score += 15;
    reasons.push("Overlapping availability");
  }

  return { a, b, score: Math.min(100, score), reasons };
}

/**
 * Produce facilitator-reviewable match suggestions.
 *
 * Only pairs an eligible Indigenous participant with an eligible non-Indigenous
 * one (per the brief). Returns highest-scoring suggestions first.
 */
export function suggestMatches(
  participants: ParticipantProfile[],
  { minScore = 20, limit = 50 }: { minScore?: number; limit?: number } = {},
): MatchSuggestion[] {
  const eligible = participants.filter(isEligible);
  const indigenous = eligible.filter(isIndigenous);
  const nonIndigenous = eligible.filter((p) => !isIndigenous(p));

  const suggestions: MatchSuggestion[] = [];
  for (const a of indigenous) {
    for (const b of nonIndigenous) {
      const s = scorePair(a, b);
      if (s.score >= minScore) suggestions.push(s);
    }
  }

  return suggestions.sort((x, y) => y.score - x.score).slice(0, limit);
}

/**
 * The brief calls out registration imbalance: if non-Indigenous participants
 * outnumber Indigenous ones, some will be waitlisted / offered a
 * learning-resources-only pathway. This surfaces that gap for the UI.
 */
export function matchingBalance(participants: ParticipantProfile[]) {
  const eligible = participants.filter(isEligible);
  const indigenousCount = eligible.filter(isIndigenous).length;
  const nonIndigenousCount = eligible.length - indigenousCount;
  return {
    indigenousCount,
    nonIndigenousCount,
    /** How many non-Indigenous participants likely can't be matched right now. */
    waitlistedEstimate: Math.max(0, nonIndigenousCount - indigenousCount),
  };
}
