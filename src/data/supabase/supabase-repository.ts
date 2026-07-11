import type { ParticipantIntake } from "@/domain/schema";
import type { Match, ParticipantProfile, Region } from "@/domain/types";
import type { Repository } from "../repository";

/**
 * Supabase-backed implementation of the Repository contract.
 *
 * ⚠️ STUB — backend team, this is your workspace. Fill each method by querying
 * Supabase and mapping rows to the domain types. The MockRepository is the
 * reference behaviour to match. See docs/ARCHITECTURE.md for the table sketch.
 *
 * Wire it up in ../index.ts by setting DATA_SOURCE=supabase once ready.
 */
export class SupabaseRepository implements Repository {
  private notImplemented(method: string): never {
    throw new Error(
      `SupabaseRepository.${method} is not implemented yet. ` +
        `Use DATA_SOURCE=mock or implement this method. See docs/ARCHITECTURE.md.`,
    );
  }

  async listParticipants(): Promise<ParticipantProfile[]> {
    return this.notImplemented("listParticipants");
  }
  async getParticipant(_id: string): Promise<ParticipantProfile | null> {
    return this.notImplemented("getParticipant");
  }
  async createParticipant(_intake: ParticipantIntake): Promise<ParticipantProfile> {
    return this.notImplemented("createParticipant");
  }
  async updateLearningStatus(
    _id: string,
    _status: ParticipantProfile["learningStatus"],
  ): Promise<ParticipantProfile> {
    return this.notImplemented("updateLearningStatus");
  }
  async listMappableParticipants(): Promise<ParticipantProfile[]> {
    return this.notImplemented("listMappableParticipants");
  }
  async listRegions(): Promise<Region[]> {
    return this.notImplemented("listRegions");
  }
  async listMatches(): Promise<Match[]> {
    return this.notImplemented("listMatches");
  }
  async createMatch(_input: Omit<Match, "id" | "createdAt" | "status">): Promise<Match> {
    return this.notImplemented("createMatch");
  }
  async updateMatchStatus(
    _id: string,
    _status: Match["status"],
    _facilitatorId?: string,
  ): Promise<Match> {
    return this.notImplemented("updateMatchStatus");
  }
}
