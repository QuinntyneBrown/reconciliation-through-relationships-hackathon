import { z } from "zod";
import {
  CANADIAN_PROVINCES,
  FAITH_TRADITIONS,
  PARTICIPATION_CATEGORIES,
  PARTICIPATION_FORMATS,
  SEX_OPTIONS,
} from "./constants";

/**
 * Single source of truth for validating participant intake.
 * Frontend forms and API routes both import this — no duplicated validation.
 */
export const participantIntakeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  sex: z.enum(SEX_OPTIONS),
  sexSelfDescribed: z.string().optional(),

  // The brief: at least one participation category must be selected.
  categories: z
    .array(z.enum(PARTICIPATION_CATEGORIES))
    .min(1, "Select at least one participation category"),

  location: z.object({
    city: z.string().min(1, "City, town, or county is required"),
    province: z.enum(CANADIAN_PROVINCES),
    treatyArea: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
  }),

  faithTradition: z.enum(FAITH_TRADITIONS),
  faithOther: z.string().optional(),

  interests: z.array(z.string()).default([]),
  availability: z
    .object({
      notes: z.string().optional(),
      weekdays: z.boolean().optional(),
      weekends: z.boolean().optional(),
      evenings: z.boolean().optional(),
    })
    .default({}),
  preferredFormat: z.enum(PARTICIPATION_FORMATS),
  languages: z.array(z.string()).min(1, "Add at least one language"),
  boundaries: z.string().optional(),
  consentToMap: z.boolean().default(false),
});

export type ParticipantIntake = z.infer<typeof participantIntakeSchema>;
