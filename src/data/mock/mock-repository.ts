import { COHORT_MIN_PARTICIPANTS } from "@/domain/constants";
import type { ParticipantIntake } from "@/domain/schema";
import type { Match, ParticipantProfile, Region } from "@/domain/types";
import { isEligible } from "@/domain/types";
import type { Repository } from "../repository";
import { MOCK_PARTICIPANTS } from "./participants";

/**
 * In-memory repository backed by synthetic data.
 *
 * Lets the whole team build and demo without a database. State lives in module
 * memory, so it resets on server restart — that's fine for the hackathon.
 */
export class MockRepository implements Repository {
  private participants: ParticipantProfile[] = [...MOCK_PARTICIPANTS];
  private matches: Match[] = [];

  async listParticipants(): Promise<ParticipantProfile[]> {
    return [...this.participants];
  }

  async getParticipant(id: string): Promise<ParticipantProfile | null> {
    return this.participants.find((p) => p.id === id) ?? null;
  }

  async createParticipant(intake: ParticipantIntake): Promise<ParticipantProfile> {
    const participant: ParticipantProfile = {
      ...intake,
      id: `p-${crypto.randomUUID().slice(0, 8)}`,
      learningStatus: "not-started",
      createdAt: new Date().toISOString(),
    };
    this.participants.push(participant);
    return participant;
  }

  async updateLearningStatus(
    id: string,
    status: ParticipantProfile["learningStatus"],
  ): Promise<ParticipantProfile> {
    const p = this.participants.find((x) => x.id === id);
    if (!p) throw new Error(`Participant ${id} not found`);
    p.learningStatus = status;
    return p;
  }

  async listMappableParticipants(): Promise<ParticipantProfile[]> {
    // Privacy: only eligible AND consented participants appear on the map.
    return this.participants.filter((p) => isEligible(p) && p.consentToMap);
  }

  async listRegions(): Promise<Region[]> {
    const mappable = await this.listMappableParticipants();
    const byKey = new Map<string, Region>();
    for (const p of mappable) {
      const key = `${p.location.province}:${p.location.city.toLowerCase()}`;
      const existing = byKey.get(key);
      if (existing) {
        existing.eligibleCount += 1;
        existing.canFormCohort = existing.eligibleCount >= COHORT_MIN_PARTICIPANTS;
      } else {
        byKey.set(key, {
          key,
          province: p.location.province,
          city: p.location.city,
          eligibleCount: 1,
          canFormCohort: 1 >= COHORT_MIN_PARTICIPANTS,
        });
      }
    }
    return [...byKey.values()].sort((a, b) => b.eligibleCount - a.eligibleCount);
  }

  async listMatches(): Promise<Match[]> {
    return [...this.matches];
  }

  async createMatch(input: Omit<Match, "id" | "createdAt" | "status">): Promise<Match> {
    const match: Match = {
      ...input,
      id: `m-${crypto.randomUUID().slice(0, 8)}`,
      status: "suggested",
      createdAt: new Date().toISOString(),
    };
    this.matches.push(match);
    return match;
  }

  async updateMatchStatus(
    id: string,
    status: Match["status"],
    facilitatorId?: string,
  ): Promise<Match> {
    const m = this.matches.find((x) => x.id === id);
    if (!m) throw new Error(`Match ${id} not found`);
    m.status = status;
    if (facilitatorId) m.reviewedByFacilitatorId = facilitatorId;
    return m;
  }
}
