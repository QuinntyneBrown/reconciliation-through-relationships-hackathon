import type { Repository } from "./repository";
import { MockRepository } from "./mock/mock-repository";
import { SupabaseRepository } from "./supabase/supabase-repository";

/**
 * The app's single entry point for data access.
 *
 *   import { getRepository } from "@/data";
 *   const repo = getRepository();
 *   const participants = await repo.listParticipants();
 *
 * Which implementation runs is controlled by DATA_SOURCE in .env.local
 * ("mock" by default). Nothing else in the app knows or cares.
 */
let instance: Repository | null = null;

export function getRepository(): Repository {
  if (instance) return instance;
  const source = process.env.DATA_SOURCE ?? "mock";
  instance = source === "supabase" ? new SupabaseRepository() : new MockRepository();
  return instance;
}

export type { Repository } from "./repository";
