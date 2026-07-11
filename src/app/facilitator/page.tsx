import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Facilitator home. In the real app this whole section is gated to the
 * "facilitator" and "admin" roles — see docs/DECISIONS.md for the role matrix
 * still to confirm with RTR, and wire auth in middleware once Supabase is live.
 */
export default function FacilitatorPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Facilitator dashboard</h1>
      <p className="text-muted-foreground mt-2">
        Review suggested matches, manage the waitlist, and support cohort formation.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link href="/facilitator/matching" className="group">
          <Card className="group-hover:border-foreground/30 h-full transition-colors">
            <CardHeader>
              <CardTitle>Review matches</CardTitle>
              <CardDescription>
                Approve or reject suggested Indigenous / non-Indigenous pairings.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/map" className="group">
          <Card className="group-hover:border-foreground/30 h-full transition-colors">
            <CardHeader>
              <CardTitle>Regional map</CardTitle>
              <CardDescription>See where cohorts are ready to form.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
