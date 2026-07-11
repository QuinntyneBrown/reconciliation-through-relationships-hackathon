import { removeTestUsers } from "./supabase-admin";

export default async function globalTeardown() {
  await removeTestUsers();
}
