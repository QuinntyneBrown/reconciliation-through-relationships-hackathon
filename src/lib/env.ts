/**
 * Centralized environment access. Import `env` instead of reading
 * process.env.* scattered across the codebase.
 *
 * Supabase vars are optional while DATA_SOURCE=mock so the app runs with zero
 * config. They're required once you switch to the Supabase repository.
 */
export const env = {
  dataSource: (process.env.DATA_SOURCE ?? "mock") as "mock" | "supabase",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
};

export function assertSupabaseEnv() {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error(
      "Supabase env vars missing. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local (see .env.example).",
    );
  }
}
