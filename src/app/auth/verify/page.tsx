import { Suspense } from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RtrBrand, Weave } from "@/components/rtr-brand";

/**
 * Where sign-up sends people when the project confirms email addresses. The
 * account already exists at this point, so /auth/login would only refuse them
 * until they click the emailed link.
 *
 * `session-proxy.ts` lists this route as public — a visitor with no session is
 * exactly who lands here.
 */
function VerifyContent({ email }: { email?: string }) {
  return (
    <div className="w-full max-w-[420px]">
      <Link
        href="/"
        className="text-spruce-700 mb-8 inline-flex text-sm font-semibold min-[861px]:hidden"
      >
        ← Back to RTR
      </Link>

      <span className="bg-spruce-50 text-spruce-800 mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full">
        <MailCheck className="h-6 w-6" aria-hidden="true" />
      </span>

      <h1 id="verify-heading">Check your email</h1>
      <p className="text-ink-soft mt-2">
        {email ? (
          <>
            Your account is created. We sent a confirmation link to{" "}
            <strong className="text-ink font-semibold">{email}</strong>. Open it to finish signing
            up.
          </>
        ) : (
          <>
            Your account is created. We sent you a confirmation link — open it to finish signing up.
          </>
        )}
      </p>

      <Card className="mt-6">
        <CardHeader className="sr-only">
          <CardTitle>Confirm your email address</CardTitle>
          <CardDescription>Open the link we emailed you to activate your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="text-ink-soft space-y-3 text-sm">
            <li>The link opens RTR and signs you in automatically.</li>
            <li>It can take a minute to arrive. Check your spam folder before trying again.</li>
            <li>Already confirmed? You can sign in below.</li>
          </ul>
          <p className="text-ink-soft mt-5 text-center text-[13.5px]">
            <Link
              href="/auth/login"
              className="text-river-700 hover:text-spruce-800 underline underline-offset-4"
            >
              Go to sign in
            </Link>
          </p>
        </CardContent>
      </Card>

      <p className="text-ink-faint mt-5 text-center text-xs">
        Your email is used only for your RTR account and notifications.
      </p>
    </div>
  );
}

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="grid min-h-screen min-[861px]:grid-cols-2">
      <aside className="bg-spruce-800 text-on-dark rtr-panel-on-dark hidden flex-col justify-between p-12 [--rtr-figure-position:center_bottom] min-[861px]:flex">
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

      <section
        className="grid place-items-center px-4 py-8 sm:px-6"
        aria-labelledby="verify-heading"
      >
        <Suspense>
          <VerifyContent email={email} />
        </Suspense>
      </section>
    </div>
  );
}
