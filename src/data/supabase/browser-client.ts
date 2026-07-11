import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";
import { env } from "@/lib/env";

/** Supabase client for Client Components (browser). */
export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(env.supabaseUrl, env.supabaseAnonKey);
}
