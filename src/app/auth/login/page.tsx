"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/data/supabase/browser-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RtrBrand, Weave } from "@/components/rtr-brand";
import { toast } from "sonner";
import Link from "next/link";

type Mode = "magic" | "password";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const router = useRouter();

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("We could not load your account. Please try again.");
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, onboarding_completed, learning_completed")
      .eq("id", user.id)
      .single();

    if (profile?.role === "facilitator") router.push("/facilitator");
    else if (!profile?.onboarding_completed) router.push("/onboarding");
    else if (!profile?.learning_completed) router.push("/learn");
    else router.push("/dashboard");

    router.refresh();
    setLoading(false);
  }

  return (
    <div className="grid min-h-screen min-[861px]:grid-cols-2">
      <aside className="bg-spruce-800 text-on-dark hidden flex-col justify-between p-12 min-[861px]:flex">
        <RtrBrand href="/" />
        <div>
          <p className="font-heading text-on-dark max-w-[20ch] text-[26px] leading-[1.4] italic">
            “We were told the truth. Now we choose the relationship.”
          </p>
          <Weave onDark className="mt-5 w-[120px]" />
        </div>
        <p className="text-on-dark-soft text-sm">
          Participants across every treaty territory in Canada.
        </p>
      </aside>

      <main className="grid place-items-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-[420px]">
          <Link
            href="/"
            className="text-spruce-700 mb-8 inline-flex text-sm font-semibold min-[861px]:hidden"
          >
            ← Back to RTR
          </Link>
          <h1>{sent ? "Check your email" : "Welcome back"}</h1>
          <p className="text-ink-soft mt-2">
            {sent
              ? `We sent a sign-in link to ${email}. Click it to continue.`
              : mode === "password"
                ? "Enter your email and password to continue."
                : "Enter your email and we’ll send you a sign-in link. No password to remember."}
          </p>

          <Card className="mt-6">
            <CardHeader className="sr-only">
              <CardTitle>{sent ? "Email sent" : "Sign in"}</CardTitle>
              <CardDescription>Secure access to the RTR Portal.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!sent && (
                <div className="border-border bg-birch flex gap-1 rounded-lg border p-1">
                  <button
                    type="button"
                    onClick={() => setMode("password")}
                    className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                      mode === "password"
                        ? "bg-spruce-700 text-white"
                        : "text-ink-soft hover:bg-spruce-100 hover:text-spruce-800"
                    }`}
                  >
                    Email & password
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("magic")}
                    className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                      mode === "magic"
                        ? "bg-spruce-700 text-white"
                        : "text-ink-soft hover:bg-spruce-100 hover:text-spruce-800"
                    }`}
                  >
                    Magic link
                  </button>
                </div>
              )}
              {sent ? (
                <div className="space-y-4 py-2 text-center">
                  <div className="text-5xl">📬</div>
                  <p className="text-ink-soft text-sm">
                    Didn&apos;t receive it?{" "}
                    <button
                      className="text-river-700 hover:text-spruce-800 underline underline-offset-4"
                      onClick={() => setSent(false)}
                    >
                      Try again
                    </button>
                  </p>
                </div>
              ) : mode === "password" ? (
                <form onSubmit={handlePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in…" : "Sign in"}
                  </Button>
                  <p className="text-ink-soft text-center text-[13.5px]">
                    New here? Choose magic link to create your account.
                  </p>
                </form>
              ) : (
                <form onSubmit={handleMagicLink} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-magic">Email address</Label>
                    <Input
                      id="email-magic"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Sending…" : "Send sign-in link"}
                  </Button>
                  <p className="text-ink-soft text-center text-[13.5px]">
                    New here? We&apos;ll create your account automatically.
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
          <p className="text-ink-faint mt-5 text-center text-xs">
            Your email is used only for your RTR account and portal notifications.
          </p>
        </div>
      </main>
    </div>
  );
}
