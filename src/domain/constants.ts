/**
 * Option lists taken directly from the RTR challenge brief.
 * Use these to build forms/filters so the UI and data layer never drift.
 * If the brief changes, change it here once.
 */

export const PARTICIPATION_CATEGORIES = [
  "indigenous-leader",
  "indigenous-individual",
  "non-indigenous-individual",
  "elected-leader",
  "religious-leader",
  "artist",
] as const;

export const PARTICIPATION_CATEGORY_LABELS: Record<ParticipationCategory, string> = {
  "indigenous-leader": "Indigenous leader",
  "indigenous-individual": "Indigenous individual",
  "non-indigenous-individual": "Non-Indigenous individual",
  "elected-leader": "Elected leader",
  "religious-leader": "Religious leader",
  artist: "Artist",
};

/** Categories that mark a participant as Indigenous for matching purposes. */
export const INDIGENOUS_CATEGORIES: ParticipationCategory[] = [
  "indigenous-leader",
  "indigenous-individual",
];

export const FAITH_TRADITIONS = [
  "indigenous-traditional",
  "atheist",
  "christian",
  "jewish",
  "muslim",
  "hindu",
  "buddhist",
  "other",
] as const;

export const FAITH_TRADITION_LABELS: Record<FaithTradition, string> = {
  "indigenous-traditional": "Indigenous Traditional",
  atheist: "Atheist",
  christian: "Christian",
  jewish: "Jewish",
  muslim: "Muslim",
  hindu: "Hindu",
  buddhist: "Buddhist",
  other: "Other",
};

export const SEX_OPTIONS = ["female", "male", "self-described"] as const;

export const PARTICIPATION_FORMATS = ["in-person", "virtual", "hybrid"] as const;

export const CANADIAN_PROVINCES = [
  "AB",
  "BC",
  "MB",
  "NB",
  "NL",
  "NS",
  "NT",
  "NU",
  "ON",
  "PE",
  "QC",
  "SK",
  "YT",
] as const;

/**
 * Cohort formation threshold. The brief proposes 5 eligible participants per
 * region but flags this as "must confirm with RTR" — keep it configurable here.
 * See docs/DECISIONS.md.
 */
export const COHORT_MIN_PARTICIPANTS = 5;

export type ParticipationCategory = (typeof PARTICIPATION_CATEGORIES)[number];
export type FaithTradition = (typeof FAITH_TRADITIONS)[number];
export type Sex = (typeof SEX_OPTIONS)[number];
export type ParticipationFormat = (typeof PARTICIPATION_FORMATS)[number];
export type Province = (typeof CANADIAN_PROVINCES)[number];
