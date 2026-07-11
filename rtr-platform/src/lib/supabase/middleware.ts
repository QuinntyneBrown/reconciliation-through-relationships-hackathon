import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Public routes — no auth required
  const publicRoutes = ["/", "/auth/login", "/auth/verify", "/auth/callback"];
  if (publicRoutes.some((r) => pathname === r || pathname.startsWith("/auth/"))) {
    return supabaseResponse;
  }

  // Not logged in → send to login
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // Fetch profile to check completion gates and role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, onboarding_completed, learning_completed")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return supabaseResponse;
  }

  const isFacilitator = profile.role === "facilitator";

  // Facilitators bypass participant gates
  if (isFacilitator) {
    if (pathname.startsWith("/onboarding") || pathname.startsWith("/learn")) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // Participant gates
  if (!profile.onboarding_completed && !pathname.startsWith("/onboarding")) {
    const url = request.nextUrl.clone();
    url.pathname = "/onboarding";
    return NextResponse.redirect(url);
  }

  if (
    profile.onboarding_completed &&
    !profile.learning_completed &&
    !pathname.startsWith("/learn")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/learn";
    return NextResponse.redirect(url);
  }

  // Block facilitator routes for participants
  if (pathname.startsWith("/admin")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
