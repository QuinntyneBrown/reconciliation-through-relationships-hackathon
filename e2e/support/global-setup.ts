import { createTestFixtures } from "./supabase-admin";

export default async function globalSetup() {
  await createTestFixtures();
}
