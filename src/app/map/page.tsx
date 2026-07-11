import { getRepository } from "@/data";
import { COHORT_MIN_PARTICIPANTS } from "@/domain/constants";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { CohortCircle } from "@/components/cohort-circle";
import { EmptyState } from "@/components/empty-state";
import { PageIntro } from "@/components/page-intro";

/**
 * Regional participant discovery. Server component — reads eligible + consented
 * participants via the repository and groups them into regions.
 *
 * ⚠️ Map squad: this renders the DATA correctly (privacy + cohort threshold are
 * already enforced in the repository). TODO: replace the region list with an
 * actual map (e.g. react-leaflet / MapLibre) using participant lat/lng, plus a
 * facilitator-only toggle to reveal names. Keep using repo.listRegions() /
 * repo.listMappableParticipants() so privacy rules stay centralized.
 */
export default async function MapPage() {
  const repo = getRepository();
  const [regions, mappable] = await Promise.all([
    repo.listRegions(),
    repo.listMappableParticipants(),
  ]);

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <AppHeader homeHref="/" subtitle="Regional discovery" />
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-4 py-8 sm:px-6">
        <PageIntro
          eyebrow="Consent-first discovery"
          title="Regional map & cohorts"
          description={
            <p>
              Only participants who completed the learning journey <em>and</em> consented to appear
              are shown. Regions—not precise locations—protect participant privacy.
            </p>
          }
        />

        {regions.length === 0 ? (
          <EmptyState
            title="No cohort in your region yet"
            description="Circles take time. Every eligible participant brings a regional gathering closer."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {regions.map((r) => (
              <Card key={r.key}>
                <CardHeader className="grid-cols-[auto_1fr] items-center gap-5">
                  <CohortCircle count={r.eligibleCount} threshold={COHORT_MIN_PARTICIPANTS} />
                  <div>
                    <CardTitle>
                      {r.city}, {r.province}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {r.eligibleCount} eligible participant{r.eligibleCount === 1 ? "" : "s"}
                    </CardDescription>
                    <Badge variant={r.canFormCohort ? "eligible" : "pending"} className="mt-3">
                      {r.canFormCohort
                        ? "Ready to gather"
                        : `${COHORT_MIN_PARTICIPANTS - r.eligibleCount} seats remaining`}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        <p className="text-ink-soft text-sm">
          {mappable.length} consenting participants across {regions.length} regions.
        </p>
      </main>
      <AppFooter />
    </div>
  );
}
