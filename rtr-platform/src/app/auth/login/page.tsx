"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
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
              : "Enter your email to receive a sign-in link — no password needed."}
          </CardDescription>
        </CardHeader>

        <CardContent>
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
          ) : (
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
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending…" : "Send sign-in link"}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                New here? Use your email and we&apos;ll create your account automatically.
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
