import { getRepository } from "@/data";
import { matchingBalance, suggestMatches } from "@/domain/matching";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Facilitator match review. Server component — computes suggestions from the
 * pure matching engine (src/domain/matching.ts) over eligible participants.
 *
 * ⚠️ Matching squad: the suggestions + waitlist math are wired. TODO: make the
 * Approve/Reject buttons real (call repo.createMatch / repo.updateMatchStatus
 * from a Server Action) and persist facilitator decisions.
 */
export default async function MatchingPage() {
  const repo = getRepository();
  const participants = await repo.listParticipants();
  const suggestions = suggestMatches(participants);
  const balance = matchingBalance(participants);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Suggested matches</h1>
      <p className="text-muted-foreground mt-2">
        A facilitator must approve a match before participants are connected.
      </p>

      {balance.waitlistedEstimate > 0 && (
        <Card className="mt-6 border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20">
          <CardHeader>
            <CardTitle className="text-base">Registration imbalance</CardTitle>
            <CardDescription>
              {balance.nonIndigenousCount} non-Indigenous vs {balance.indigenousCount} Indigenous
              eligible participants. ~{balance.waitlistedEstimate} may need the waitlist or a
              learning-resources-only pathway.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="mt-8 space-y-3">
        {suggestions.length === 0 && (
          <p className="text-muted-foreground">
            No suggestions yet — participants must complete the learning journey to become eligible.
          </p>
        )}
        {suggestions.map((s) => (
          <Card key={`${s.a.id}-${s.b.id}`}>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <CardTitle className="text-base">
                  {s.a.name} &nbsp;×&nbsp; {s.b.name}
                </CardTitle>
                <Badge variant="secondary">{s.score}% match</Badge>
              </div>
              <CardDescription>{s.reasons.join(" · ")}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              {/* TODO: wire to a Server Action calling repo.updateMatchStatus */}
              <Button size="sm">Approve</Button>
              <Button size="sm" variant="outline">
                Reject
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
