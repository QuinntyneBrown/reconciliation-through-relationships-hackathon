"use client";

import { useCallback, useEffect, useState } from "react";
import { RtrBrand, Weave } from "@/components/rtr-brand";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  BookOpen,
  MessageCircle,
  Video,
  MapPin,
  Zap,
  Shield,
  Heart,
  CheckCircle2,
  Layers,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

type Slide = {
  id: string;
  render: () => React.ReactNode;
};

const SLIDES: Slide[] = [
  // 1. Title
  {
    id: "title",
    render: () => (
      <div className="bg-spruce-800 text-on-dark flex h-full flex-col items-center justify-center px-12 text-center">
        <RtrBrand className="mb-16" />
        <Badge className="bg-ochre-500 text-spruce-900 mb-6">
          Hackathon Demo · 2026
        </Badge>
        <h1 className="font-heading text-on-dark mb-6 text-6xl italic sm:text-7xl md:text-8xl">
          Reconciliation begins with a{" "}
          <span className="text-ochre-500">relationship.</span>
        </h1>
        <Weave onDark className="mt-8 w-40" />
        <p className="text-on-dark-soft mt-12 max-w-2xl text-lg">
          A digital home for the Truth and Reconciliation Commission&apos;s call to
          real, human connection between Indigenous and non-Indigenous Canadians.
        </p>
      </div>
    ),
  },

  // 2. The Challenge
  {
    id: "challenge",
    render: () => (
      <div className="flex h-full flex-col justify-center px-12 sm:px-24">
        <p className="rtr-eyebrow mb-4">The Challenge</p>
        <h2 className="font-heading text-heading mb-8 text-5xl sm:text-6xl">
          How do you build friendships across a 400-year fault line?
        </h2>
        <div className="text-ink max-w-4xl space-y-5 text-xl leading-relaxed">
          <p>
            <strong>Reconciliation Through Relationships (RTR)</strong> was founded in
            direct response to the TRC&apos;s 94 Calls to Action — specifically the
            call for meaningful, human contact across cultural divides.
          </p>
          <p>
            Today, the work is done through spreadsheets, email chains, and phone
            calls. It doesn&apos;t scale. It doesn&apos;t protect participants&apos;
            time or safety. And it can&apos;t answer basic questions like:{" "}
            <em>&ldquo;how many people are ready to gather in Regina?&rdquo;</em>
          </p>
        </div>
        <Weave className="mt-10 w-32" />
      </div>
    ),
  },

  // 3. The Problem
  {
    id: "problem",
    render: () => (
      <div className="flex h-full flex-col justify-center px-12 sm:px-24">
        <p className="rtr-eyebrow mb-4">The Problem</p>
        <h2 className="font-heading text-heading mb-10 text-5xl">
          A gathering can&apos;t happen if the pieces never meet.
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[
            {
              icon: Shield,
              title: "Consent is fragile",
              body: "Matching Indigenous and non-Indigenous participants is not a Tinder swipe. Boundaries, safety, cultural context all matter.",
            },
            {
              icon: BookOpen,
              title: "Learning has to come first",
              body: "Non-Indigenous participants show up unprepared — the burden of educating shouldn't fall on Indigenous participants.",
            },
            {
              icon: Users,
              title: "Facilitators are the bottleneck",
              body: "Every match reviewed by hand. Every reminder sent by hand. A few coordinators can't hold thousands of relationships.",
            },
            {
              icon: MapPin,
              title: "Local cohorts are invisible",
              body: "Nobody can see who's nearby — so blanket exercises, film screenings, and treaty walks never form.",
            },
          ].map((p) => (
            <div
              key={p.title}
              className="border-border bg-parchment shadow-rtr-1 rounded-2xl border p-6"
            >
              <div className="bg-spruce-100 text-spruce-700 mb-4 flex h-11 w-11 items-center justify-center rounded-xl">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="text-heading mb-2 text-lg font-semibold">
                {p.title}
              </h3>
              <p className="text-ink-soft text-base leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // 4. Before vs After (Benefits)
  {
    id: "benefits",
    render: () => (
      <div className="flex h-full flex-col justify-center px-12 sm:px-24">
        <p className="rtr-eyebrow mb-4">What the app changes</p>
        <h2 className="font-heading text-heading mb-10 text-5xl">
          From spreadsheets and phone calls to a real portal.
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Before */}
          <div className="border-berry-700/20 bg-berry-100/30 rounded-2xl border p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="bg-berry-700 h-2 w-2 rounded-full" />
              <p className="text-berry-700 text-sm font-semibold uppercase tracking-wide">
                Before
              </p>
            </div>
            <h3 className="text-heading mb-4 text-xl font-semibold">
              Manual, brittle, invisible
            </h3>
            <ul className="text-ink space-y-3 text-base leading-relaxed">
              <li className="flex gap-2">
                <span className="text-berry-700">×</span>
                Matches tracked in spreadsheets and email threads
              </li>
              <li className="flex gap-2">
                <span className="text-berry-700">×</span>
                Facilitators phoning each side to introduce them one by one
              </li>
              <li className="flex gap-2">
                <span className="text-berry-700">×</span>
                No visibility into who&apos;s ready in each region
              </li>
              <li className="flex gap-2">
                <span className="text-berry-700">×</span>
                Learning happened off-platform, if at all
              </li>
              <li className="flex gap-2">
                <span className="text-berry-700">×</span>
                Every Zoom link scheduled by hand
              </li>
              <li className="flex gap-2">
                <span className="text-berry-700">×</span>
                Growth capped by facilitator capacity
              </li>
            </ul>
          </div>

          {/* After */}
          <div className="border-spruce-700/20 bg-spruce-100 rounded-2xl border p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="bg-spruce-700 h-2 w-2 rounded-full" />
              <p className="text-spruce-700 text-sm font-semibold uppercase tracking-wide">
                With RTR Portal
              </p>
            </div>
            <h3 className="text-heading mb-4 text-xl font-semibold">
              Guided, safe, scalable
            </h3>
            <ul className="text-ink space-y-3 text-base leading-relaxed">
              <li className="flex gap-2">
                <span className="text-spruce-700">✓</span>
                Weighted algorithm surfaces the strongest matches automatically
              </li>
              <li className="flex gap-2">
                <span className="text-spruce-700">✓</span>
                Facilitators approve or reject in one queue — 30 seconds per match
              </li>
              <li className="flex gap-2">
                <span className="text-spruce-700">✓</span>
                Regional map shows exactly where a cohort is ready to gather
              </li>
              <li className="flex gap-2">
                <span className="text-spruce-700">✓</span>
                Structured learning gates the journey, resumes on any device
              </li>
              <li className="flex gap-2">
                <span className="text-spruce-700">✓</span>
                Participants schedule their own Zoom calls — one click, both notified
              </li>
              <li className="flex gap-2">
                <span className="text-spruce-700">✓</span>
                One facilitator can now support hundreds, not dozens
              </li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },

  // 5. Our Process
  {
    id: "process",
    render: () => (
      <div className="flex h-full flex-col justify-center px-12 sm:px-24">
        <p className="rtr-eyebrow mb-4">Our Process</p>
        <h2 className="font-heading text-heading mb-10 text-5xl">
          Indigenous-led design, weekend build.
        </h2>
        <ol className="space-y-6">
          {[
            [
              "Listen",
              "Read RTR&apos;s brief, the TRC calls to action, and the founders&apos; own words. Design tokens started from ceremony imagery — earth tones, not corporate green.",
            ],
            [
              "Map the journey",
              "Every participant follows the same gated arc: sign up → complete profile → complete learning → get matched → connect. Facilitators can hold and release at every step.",
            ],
            [
              "Build with real safeguards",
              "Consent-first: your name only appears to a matched partner. City-level location. Facilitator approval required before any chat opens.",
            ],
            [
              "Ship end-to-end",
              "Auth, onboarding, LMS, matching algorithm, chat, Zoom scheduling, notifications, admin dashboard — all live at rtr-platform.vercel.app.",
            ],
          ].map(([title, body], i) => (
            <li key={title} className="flex gap-6">
              <div className="bg-ochre-500 text-spruce-900 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl font-bold">
                {i + 1}
              </div>
              <div>
                <h3 className="text-heading text-xl font-semibold">{title}</h3>
                <p
                  className="text-ink mt-1 text-lg leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: body }}
                />
              </div>
            </li>
          ))}
        </ol>
      </div>
    ),
  },

  // 5. Solution — Architecture
  {
    id: "architecture",
    render: () => (
      <div className="flex h-full flex-col justify-center px-12 sm:px-24">
        <p className="rtr-eyebrow mb-4">Solution · Stack</p>
        <h2 className="font-heading text-heading mb-10 text-5xl">
          A modern portal, built to grow.
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              label: "Next.js 16",
              body: "App Router · Server Components · Server Actions · deployed on Vercel edge",
            },
            {
              label: "Supabase",
              body: "Postgres · Row-Level Security · Realtime channels for chat + notifications",
            },
            {
              label: "Zoom S2S OAuth",
              body: "Meeting links minted on demand, shared to both participants + facilitator",
            },
            {
              label: "Custom matching",
              body: "Weighted algorithm: location, availability, interests, language, faith, format",
            },
            {
              label: "Mapbox GL",
              body: "Regional discovery map — city precision only, consent required to appear",
            },
            {
              label: "RTR design system",
              body: "Spruce, ochre, birch tokens — accessible, culturally grounded, mobile-first",
            },
          ].map((t) => (
            <div
              key={t.label}
              className="border-border bg-parchment shadow-rtr-1 rounded-2xl border p-6"
            >
              <Badge className="bg-spruce-100 text-spruce-700 mb-3">
                {t.label}
              </Badge>
              <p className="text-ink-soft leading-relaxed">{t.body}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // 6. Solution — Journey
  {
    id: "journey",
    render: () => (
      <div className="bg-birch flex h-full flex-col justify-center px-12 sm:px-24">
        <p className="rtr-eyebrow mb-4">Solution · Journey</p>
        <h2 className="font-heading text-heading mb-10 text-5xl">
          Four intentional steps, at your own pace.
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {[
            {
              icon: Users,
              step: "01",
              title: "Create your profile",
              body: "Bio, location, treaty area, faith, interests, availability, boundaries, matching preferences.",
            },
            {
              icon: BookOpen,
              step: "02",
              title: "Complete the learning journey",
              body: "Separate tracks for Indigenous and non-Indigenous participants. Progress saves; return anytime.",
            },
            {
              icon: Heart,
              step: "03",
              title: "Get matched",
              body: "Algorithm suggests, facilitator approves. Both parties opt-in before chat unlocks.",
            },
            {
              icon: MessageCircle,
              step: "04",
              title: "Build the relationship",
              body: "Real-time chat, Zoom scheduling, meeting reminders — the app gets out of the way.",
            },
          ].map((s) => (
            <div key={s.step} className="flex flex-col">
              <span className="text-ochre-500 font-heading mb-2 text-4xl italic">
                {s.step}
              </span>
              <div className="bg-spruce-100 text-spruce-700 mb-3 flex h-10 w-10 items-center justify-center rounded-xl">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="text-heading mb-1 text-lg font-semibold">
                {s.title}
              </h3>
              <p className="text-ink-soft text-base leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
        <Weave className="mt-10 w-32" />
      </div>
    ),
  },

  // 7. Solution — Facilitator superpowers
  {
    id: "facilitator",
    render: () => (
      <div className="bg-spruce-800 text-on-dark flex h-full flex-col justify-center px-12 sm:px-24">
        <p className="text-ochre-500 rtr-eyebrow mb-4">
          Solution · Facilitator
        </p>
        <h2 className="font-heading text-on-dark mb-10 text-5xl">
          What used to take a week now takes a Zoom.
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {[
            {
              icon: Zap,
              title: "Auto-matching toggle",
              body: "When on, the algorithm surfaces top matches automatically. When off, every match is hand-picked. Approval is always required.",
            },
            {
              icon: CheckCircle2,
              title: "Mutual connect approval queue",
              body: "When both participants say yes, facilitators see one clean queue to review, approve, or reject before chat opens.",
            },
            {
              icon: Layers,
              title: "Live participant directory",
              body: "Search by name, city, background, journey status. Click a profile to see the full picture without SQL.",
            },
            {
              icon: Video,
              title: "Zoom on tap",
              body: "Participants schedule their own calls. Facilitator has no meetings to book.",
            },
          ].map((s) => (
            <div key={s.title} className="flex gap-5">
              <div className="bg-ochre-500 text-spruce-900 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                <s.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-on-dark mb-2 text-xl font-semibold">
                  {s.title}
                </h3>
                <p className="text-on-dark-soft text-lg leading-relaxed">
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // 8. Live demo pointer
  {
    id: "demo",
    render: () => (
      <div className="flex h-full flex-col items-center justify-center px-12 text-center sm:px-24">
        <Badge className="bg-ochre-500 text-spruce-900 mb-6">Live now</Badge>
        <h2 className="font-heading text-heading mb-6 text-6xl">
          Let&apos;s open the platform.
        </h2>
        <p className="text-ink mb-8 max-w-2xl text-xl leading-relaxed">
          Two test accounts on the deployed app — sign in as a participant to
          walk the journey, then as a facilitator to approve a match.
        </p>
        <div className="border-border bg-parchment shadow-rtr-1 mb-6 rounded-2xl border p-8">
          <p className="text-ink-soft mb-3 text-sm font-semibold uppercase tracking-wide">
            Try it
          </p>
          <a
            href="https://rtr-platform.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-spruce-700 hover:text-spruce-800 font-heading inline-flex items-center gap-2 text-3xl underline underline-offset-4"
          >
            rtr-platform.vercel.app
            <ExternalLink className="h-6 w-6" />
          </a>
          <div className="border-border mt-6 border-t pt-6 text-left">
            <p className="text-ink-soft mb-2 text-sm">Facilitator</p>
            <p className="text-ink font-mono">facilitator@rtr-demo.ca</p>
            <p className="text-ink-soft mt-4 mb-2 text-sm">Participant</p>
            <p className="text-ink font-mono">mary.fineday@rtr-demo.ca</p>
            <p className="text-ink-soft mt-4 mb-2 text-sm">Password (all demo accounts)</p>
            <p className="text-ink font-mono">RTRdemo2024!</p>
          </div>
        </div>
      </div>
    ),
  },

  // 9. What's next / Conclusion
  {
    id: "conclusion",
    render: () => (
      <div className="flex h-full flex-col justify-center px-12 sm:px-24">
        <p className="rtr-eyebrow mb-4">Where we landed</p>
        <h2 className="font-heading text-heading mb-8 text-5xl">
          Everything you need to run a real cohort — except the cohort tools.
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Shipped */}
          <div className="border-border bg-parchment shadow-rtr-1 rounded-2xl border p-6">
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-spruce-700 h-5 w-5" />
              <p className="text-heading text-lg font-semibold">Shipped</p>
            </div>
            <ul className="text-ink space-y-2 text-base leading-relaxed">
              <li>Magic-link + password authentication</li>
              <li>5-step onboarding + profile management</li>
              <li>Learning journey with two audience tracks</li>
              <li>Weighted matching algorithm</li>
              <li>Mutual-consent connection flow</li>
              <li>Real-time chat with read receipts</li>
              <li>Zoom Server-to-Server OAuth meeting creation</li>
              <li>Notification center (chat + matches + meetings)</li>
              <li>Facilitator dashboard, matching queue, participant table</li>
              <li>Regional map with consent + threshold detection</li>
            </ul>
          </div>

          {/* Next */}
          <div className="border-border bg-birch shadow-rtr-1 rounded-2xl border p-6">
            <div className="mb-4 flex items-center gap-2">
              <MapPin className="text-ochre-700 h-5 w-5" />
              <p className="text-heading text-lg font-semibold">Next up: Cohorts</p>
            </div>
            <p className="text-ink mb-4 text-base leading-relaxed">
              The map already <em>detects</em> when a region has 5+ eligible
              participants. The next milestone builds the cohort itself:
            </p>
            <ul className="text-ink space-y-2 text-base leading-relaxed">
              <li>Facilitator forms a cohort from the map</li>
              <li>Group invitations + accept flow</li>
              <li>Cohort event scheduling (film screenings, blanket exercises)</li>
              <li>Group messaging space</li>
              <li>June 21 &amp; September 30 event templates</li>
              <li>Elected-leader banner: &ldquo;a circle is ready in your city&rdquo;</li>
            </ul>
          </div>
        </div>

        <p className="text-ink-soft mt-8 text-lg italic">
          The foundation is complete. The circle can gather next.
        </p>
      </div>
    ),
  },

  // 10. Thank you
  {
    id: "thanks",
    render: () => (
      <div className="bg-spruce-800 text-on-dark flex h-full flex-col items-center justify-center px-12 text-center">
        <Weave onDark className="mb-10 w-40" />
        <h1 className="font-heading text-on-dark mb-6 text-7xl italic">
          Miigwech.
        </h1>
        <p className="font-heading text-ochre-500 mb-12 text-3xl italic">
          Thank you.
        </p>
        <p className="text-on-dark-soft max-w-2xl text-xl leading-relaxed">
          We were told the truth. Now we choose the relationship.
        </p>
        <p className="text-on-dark-soft mt-16 text-sm">
          Built with Reconciliation Through Relationships · rightrelationship.ca
        </p>
      </div>
    ),
  },
];

export default function DemoPage() {
  const [index, setIndex] = useState(0);
  const total = SLIDES.length;

  const next = useCallback(() => setIndex((i) => Math.min(total - 1, i + 1)), [total]);
  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") next();
      else if (e.key === "ArrowLeft" || e.key === "PageUp") prev();
      else if (e.key === "Home") setIndex(0);
      else if (e.key === "End") setIndex(total - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, total]);

  const current = SLIDES[index];

  return (
    <div className="bg-birch fixed inset-0 flex flex-col">
      {/* Slide surface */}
      <div className="flex-1 overflow-hidden">
        <div key={current.id} className="animate-in fade-in slide-in-from-right-4 h-full duration-300">
          {current.render()}
        </div>
      </div>

      {/* Nav bar */}
      <div className="border-border bg-parchment/95 supports-[backdrop-filter]:bg-parchment/80 flex items-center justify-between border-t px-6 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <RtrBrand />
          <span className="text-ink-faint text-sm">Hackathon Demo</span>
        </div>

        <div className="flex items-center gap-1">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === index
                  ? "bg-spruce-700 w-8"
                  : i < index
                    ? "bg-spruce-300 w-2"
                    : "bg-border w-2"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-ink-soft mr-2 text-sm tabular-nums">
            {index + 1} / {total}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={prev}
            disabled={index === 0}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={next} disabled={index === total - 1} aria-label="Next slide">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
