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

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    // Sign in immediately after signup so middleware can read the session
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      toast.error("Account created — please sign in.");
      router.push("/auth/login");
      return;
    }

    router.push("/onboarding");
  }

  return (
    <div className="grid min-h-screen min-[861px]:grid-cols-2">
      <aside className="bg-spruce-800 text-on-dark hidden flex-col justify-between p-12 min-[861px]:flex">
        <RtrBrand href="/" />
        <div>
          <p className="font-heading text-on-dark max-w-[20ch] text-[26px] leading-[1.4] italic">
            &ldquo;We were told the truth. Now we choose the relationship.&rdquo;
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
          <h1>Join RTR</h1>
          <p className="text-ink-soft mt-2">
            Create your account to begin the reconciliation journey.
          </p>

          <Card className="mt-6">
            <CardHeader className="sr-only">
              <CardTitle>Create account</CardTitle>
              <CardDescription>Join Reconciliation Through Relationships.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm password</Label>
                  <Input
                    id="confirm"
                    type="password"
                    placeholder="••••••••"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account…" : "Create account"}
                </Button>
                <p className="text-ink-soft text-center text-[13.5px]">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="text-river-700 hover:text-spruce-800 underline underline-offset-4"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
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
