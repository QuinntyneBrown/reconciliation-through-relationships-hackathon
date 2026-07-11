import type { Match, ParticipantProfile, Region } from "@/domain/types";
import type { ParticipantIntake } from "@/domain/schema";

/**
 * The single seam between the app and its data source.
 *
 * Everything in the app talks to this interface — never to Supabase (or mocks)
 * directly. Swap the implementation in `./index.ts` without touching any UI.
 *
 * Backend team: implement `SupabaseRepository` against this contract.
 * Frontend team: build against `MockRepository`; it satisfies the same contract.
 */
export interface Repository {
  // Participants
  listParticipants(): Promise<ParticipantProfile[]>;
  getParticipant(id: string): Promise<ParticipantProfile | null>;
  createParticipant(intake: ParticipantIntake): Promise<ParticipantProfile>;
  updateLearningStatus(
    id: string,
    status: ParticipantProfile["learningStatus"],
  ): Promise<ParticipantProfile>;

  // Regional map & cohorts (eligible + consented participants only)
  listMappableParticipants(): Promise<ParticipantProfile[]>;
  listRegions(): Promise<Region[]>;

  // Matching (facilitator workflow)
  listMatches(): Promise<Match[]>;
  createMatch(input: Omit<Match, "id" | "createdAt" | "status">): Promise<Match>;
  updateMatchStatus(id: string, status: Match["status"], facilitatorId?: string): Promise<Match>;
}
