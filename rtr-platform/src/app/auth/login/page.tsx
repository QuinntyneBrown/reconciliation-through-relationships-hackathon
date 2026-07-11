"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
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
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, onboarding_completed, learning_completed")
        .eq("id", user.id)
        .single();

      if (profile?.role === "facilitator") router.push("/admin");
      else if (!profile?.onboarding_completed) router.push("/onboarding");
      else if (!profile?.learning_completed) router.push("/learn");
      else router.push("/dashboard");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <Link href="/" className="mb-8 text-center">
        <p className="text-2xl font-bold text-primary">RTR</p>
        <p className="text-sm text-muted-foreground">Reconciliation Through Relationships</p>
      </Link>

      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {sent ? "Check your email" : "Welcome"}
          </CardTitle>
          <CardDescription>
            {sent
              ? `We sent a sign-in link to ${email}. Click it to continue.`
              : "Sign in to your RTR account."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Mode toggle */}
          {!sent && (
            <div className="flex rounded-lg border border-border p-1 gap-1">
              <button
                type="button"
                onClick={() => setMode("password")}
                className={`flex-1 text-sm py-1.5 rounded-md transition-colors ${
                  mode === "password"
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Email & password
              </button>
              <button
                type="button"
                onClick={() => { setMode("magic"); setSent(false); }}
                className={`flex-1 text-sm py-1.5 rounded-md transition-colors ${
                  mode === "magic"
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Magic link
              </button>
            </div>
          )}

          {sent ? (
            <div className="text-center space-y-4">
              <div className="text-5xl">📬</div>
              <p className="text-sm text-muted-foreground">
                Didn&apos;t receive it?{" "}
                <button
                  className="underline text-primary hover:opacity-80"
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
              <p className="text-xs text-center text-muted-foreground">
                New here?{" "}
                <button
                  type="button"
                  className="underline text-primary"
                  onClick={() => setMode("magic")}
                >
                  Use a magic link
                </button>{" "}
                to create your account.
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
              <p className="text-xs text-center text-muted-foreground">
                New here? We&apos;ll create your account automatically.
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
