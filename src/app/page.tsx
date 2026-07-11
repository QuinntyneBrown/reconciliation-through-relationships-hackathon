import Link from "next/link";

import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { Weave } from "@/components/rtr-brand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const journeySteps = [
  ["Create your profile", "Share who you are, what you value, and how you prefer to connect."],
  [
    "Complete the learning journey",
    "Build a shared foundation for respectful, meaningful conversation.",
  ],
  ["Meet your match", "A facilitator reviews every recommendation before an introduction."],
  ["Build the relationship", "Talk, listen, and take part in reconciliation in your community."],
];

const participantTypes = [
  "Indigenous leader",
  "Non-Indigenous neighbour",
  "Faith leader",
  "Elected leader",
  "Artist",
  "Community builder",
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader
        homeHref="/"
        className="border-b-0"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="quiet"
              asChild
              className="text-on-dark-soft hover:bg-spruce-700 hover:text-on-dark hidden sm:inline-flex"
            >
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button variant="on-dark" size="sm" asChild>
              <Link href="/auth/signup">Join RTR</Link>
            </Button>
          </div>
        }
      />

      <main>
        <section className="bg-spruce-800 text-on-dark rtr-panel-on-dark overflow-hidden px-4 pt-12 [--rtr-figure-position:right_25%_bottom] sm:px-6 sm:pt-16">
          <div className="relative mx-auto max-w-7xl">
            <svg
              viewBox="0 0 200 200"
              aria-hidden="true"
              className="absolute -top-10 -right-10 hidden w-[380px] opacity-90 min-[861px]:block"
            >
              <path
                d="M100 18a82 82 0 0 1 0 164"
                fill="none"
                stroke="#E0A34E"
                strokeWidth="7"
                strokeLinecap="round"
                opacity=".85"
              />
              <path
                d="M100 182a82 82 0 0 1 0-164"
                fill="none"
                stroke="#7FB5AE"
                strokeWidth="7"
                strokeLinecap="round"
                opacity=".85"
              />
              <path
                d="M100 46a54 54 0 0 1 0 108"
                fill="none"
                stroke="#E0A34E"
                strokeWidth="5"
                strokeLinecap="round"
                opacity=".4"
              />
              <path
                d="M100 154a54 54 0 0 1 0-108"
                fill="none"
                stroke="#7FB5AE"
                strokeWidth="5"
                strokeLinecap="round"
                opacity=".4"
              />
            </svg>

            <div className="relative z-10 max-w-3xl">
              <span className="rtr-eyebrow text-ochre-500 mb-3">
                An invitation in response to the TRC&apos;s calls to action
              </span>
              <h1 className="text-on-dark max-w-[760px] text-[clamp(38px,6vw,60px)] leading-[1.06] font-[480]">
                Reconciliation begins with a <em className="text-ochre-500">relationship</em>.
              </h1>
              <p className="text-on-dark-soft mt-5 max-w-[52ch] text-[19px] leading-[1.55]">
                RTR brings Indigenous and non-Indigenous people together—to learn the truth, listen
                well, and walk together in your own community. Not a program. A friendship.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button variant="on-dark" size="lg" asChild>
                  <Link href="/auth/signup">Begin your journey</Link>
                </Button>
                <Button
                  variant="quiet"
                  size="lg"
                  asChild
                  className="text-on-dark-soft hover:bg-spruce-700 hover:text-on-dark"
                >
                  <Link href="#how">See how it works</Link>
                </Button>
              </div>
            </div>

            <div className="border-on-dark/15 text-on-dark-soft mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t py-4 text-sm">
              <span>Founded in 2021 by Indigenous leaders</span>
              <span aria-hidden="true">·</span>
              <span>Participants across every treaty territory</span>
            </div>
          </div>
        </section>

        <section id="how" className="px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-7xl">
            <span className="rtr-eyebrow mb-2">The journey</span>
            <h2>Four steps, at your pace</h2>
            <Weave className="mt-4 mb-8 w-[120px]" />
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {journeySteps.map(([title, description], index) => (
                <div key={title}>
                  <div className="font-heading text-ochre-500 text-[40px] leading-none font-medium">
                    {index + 1}
                  </div>
                  <h3 className="mt-3 mb-2">{title}</h3>
                  <p className="text-ink-soft text-[15px] leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-spruce-100 px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto grid max-w-7xl items-center gap-8 min-[861px]:grid-cols-[1fr_340px]">
            <div>
              <span className="rtr-eyebrow mb-2">Who it&apos;s for</span>
              <h2>Every seat in the circle matters</h2>
              <p className="text-ink-soft mt-3 max-w-[56ch]">
                You might come as a leader, a neighbour, an artist, or simply a person who believes
                the TRC&apos;s calls to action were addressed to them. Choose every category that
                fits; it helps us find the right relationship.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {participantTypes.map((type, index) => (
                  <Badge key={type} variant="secondary">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="border-spruce-200 bg-parchment shadow-rtr-1 rounded-2xl border p-6">
              <p className="font-heading text-spruce-700 text-[22px] leading-[1.4] italic">
                “Meaningful conversation. Shared understanding. Right relationship.”
              </p>
              <Button className="mt-5 w-full" asChild>
                <Link href="/auth/signup">Find your place in the circle</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="px-4 py-12 text-center sm:px-6 sm:py-16">
          <p className="font-heading text-spruce-700 mx-auto max-w-3xl text-[27px] leading-[1.4] italic">
            “We were told the truth. Now we choose the relationship.”
          </p>
          <p className="text-ink-soft mt-3 text-sm">
            The heart of RTR&apos;s response to the Truth and Reconciliation Commission
          </p>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}
