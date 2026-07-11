import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/data/supabase/server-client";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  if (code) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, onboarding_completed, learning_completed")
        .eq("id", data.user.id)
        .single();

      if (profile?.role === "facilitator") {
        return NextResponse.redirect(`${origin}/facilitator`);
      }
      if (!profile?.onboarding_completed) {
        return NextResponse.redirect(`${origin}/onboarding`);
      }
      if (!profile?.learning_completed) {
        return NextResponse.redirect(`${origin}/learn`);
      }
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
}
