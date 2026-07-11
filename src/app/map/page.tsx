import { getRepository } from "@/data";
import { COHORT_MIN_PARTICIPANTS } from "@/domain/constants";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Regional map & cohorts</h1>
      <p className="text-muted-foreground mt-2">
        Only participants who completed the learning journey <em>and</em> consented to appear are
        shown. A cohort can form at {COHORT_MIN_PARTICIPANTS}+ participants in a region.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {regions.map((r) => (
          <Card key={r.key}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {r.city}, {r.province}
                </CardTitle>
                {r.canFormCohort ? (
                  <Badge>Cohort ready</Badge>
                ) : (
                  <Badge variant="outline">Building</Badge>
                )}
              </div>
              <CardDescription>
                {r.eligibleCount} eligible participant{r.eligibleCount === 1 ? "" : "s"}
                {!r.canFormCohort &&
                  ` · ${COHORT_MIN_PARTICIPANTS - r.eligibleCount} more to form a cohort`}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <p className="text-muted-foreground mt-8 text-sm">
        {mappable.length} participants visible on the map across {regions.length} regions. TODO:
        render an interactive map here.
      </p>
    </div>
  );
}
