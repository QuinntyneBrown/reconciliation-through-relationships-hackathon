import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Landing / hub page. Each card links to a vertical owned by a different part
 * of the team (see CONTRIBUTING.md → "Who owns what"). Safe starting point.
 */
const FEATURES = [
  {
    href: "/onboarding",
    title: "1 · Join & Profile",
    description:
      "Welcoming account creation and participant intake — categories, location, faith, interests, availability, and matching preferences.",
    owner: "Onboarding squad",
  },
  {
    href: "/learn",
    title: "2 · Learning Journey",
    description:
      "Guided video learning that participants complete before becoming eligible for mapping, cohorts, or matching.",
    owner: "Learning squad",
  },
  {
    href: "/map",
    title: "3 · Regional Map & Cohorts",
    description:
      "Consented, eligible participants shown by region so facilitators can spot where a reconciliation cohort can form.",
    owner: "Map squad",
  },
  {
    href: "/facilitator",
    title: "4 · Facilitator Matching",
    description:
      "Facilitators review and approve suggested Indigenous / non-Indigenous pairings, with a waitlist for imbalance.",
    owner: "Matching squad",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <section className="mb-14 max-w-2xl">
        <p className="text-muted-foreground mb-3 text-sm font-medium">
          Reconciliation Through Relationships
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-balance">
          From registration to relationship, one welcoming step at a time.
        </h1>
        <p className="text-muted-foreground mt-4 text-lg">
          A platform that helps Indigenous and non-Indigenous participants learn together, find each
          other locally, and build lasting reconciliation cohorts.
        </p>
        <div className="mt-6 flex gap-3">
          <Button nativeButton={false} render={<Link href="/onboarding" />}>
            Get started
          </Button>
          <Button nativeButton={false} variant="outline" render={<Link href="/facilitator" />}>
            Facilitator view
          </Button>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <Link key={f.href} href={f.href} className="group">
            <Card className="group-hover:border-foreground/30 h-full transition-colors">
              <CardHeader>
                <CardTitle>{f.title}</CardTitle>
                <CardDescription>{f.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-muted-foreground text-xs">Owner: {f.owner}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
