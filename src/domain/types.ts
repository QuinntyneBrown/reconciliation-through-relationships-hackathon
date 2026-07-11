import type {
  FaithTradition,
  ParticipationCategory,
  ParticipationFormat,
  Province,
  Sex,
} from "./constants";

/** The three user roles. Exact permissions are still TBD — see docs/DECISIONS.md. */
export type UserRole = "participant" | "facilitator" | "admin";

/** Where a participant is in the required learning journey before they become matchable. */
export type LearningStatus = "not-started" | "in-progress" | "completed";

export interface GeoLocation {
  /** City, town, or county from the brief. */
  city: string;
  province: Province;
  /** Nearest treaty area (e.g. "Treaty 6"). Optionally sourced from native-land.ca. */
  treatyArea?: string;
  /** For the regional map. Optional until we geocode; keep matching working without it. */
  lat?: number;
  lng?: number;
}

export interface Availability {
  /** Free-form for the hackathon, e.g. "Weekday evenings", "Weekends". */
  notes?: string;
  weekdays?: boolean;
  weekends?: boolean;
  evenings?: boolean;
}

export interface ParticipantProfile {
  id: string;
  name: string;
  email: string;
  sex: Sex;
  /** Only when sex === "self-described". */
  sexSelfDescribed?: string;
  age?: number;

  /** At least one required — enforced by the intake schema. */
  categories: ParticipationCategory[];

  location: GeoLocation;

  faithTradition: FaithTradition;
  /** Only when faithTradition === "other". */
  faithOther?: string;

  /** Free-form keywords/tags used for shared-interest matching. */
  interests: string[];
  availability: Availability;
  preferredFormat: ParticipationFormat;
  languages: string[];
  /** Personal boundaries and other matching preferences (free text). */
  boundaries?: string;

  /** Consent to appear on the regional map. Defaults to false — privacy first. */
  consentToMap: boolean;

  learningStatus: LearningStatus;
  createdAt: string;
}

/** A participant is eligible for map/cohort/matching only after finishing learning. */
export function isEligible(p: ParticipantProfile): boolean {
  return p.learningStatus === "completed";
}

export type MatchStatus = "suggested" | "approved" | "rejected" | "connected";

/** A facilitator-reviewed suggested pairing between two participants. */
export interface Match {
  id: string;
  participantAId: string;
  participantBId: string;
  score: number;
  /** Human-readable reasons the two were suggested (shown to the facilitator). */
  reasons: string[];
  status: MatchStatus;
  reviewedByFacilitatorId?: string;
  createdAt: string;
}

/** An aggregation used to render the regional map and cohort suggestions. */
export interface Region {
  key: string;
  province: Province;
  city: string;
  eligibleCount: number;
  /** True once eligibleCount >= COHORT_MIN_PARTICIPANTS. */
  canFormCohort: boolean;
}
