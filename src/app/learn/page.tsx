import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * ⚠️ SCAFFOLD — Learning squad, this is your workspace.
 *
 * Participants must complete this journey before they become eligible for the
 * map, cohorts, or matching (repo.updateLearningStatus sets "completed").
 *
 * TODO: embed RTR's real training videos, track per-video progress, and mark
 * the journey complete. "What counts as completion" is a decision to confirm
 * with RTR — see docs/DECISIONS.md.
 */
const MODULES = [
  { title: "Welcome & Why Reconciliation", length: "6 min", status: "done" },
  { title: "Truth: Our Shared History", length: "14 min", status: "done" },
  { title: "Understanding Treaties", length: "11 min", status: "current" },
  { title: "Listening & Relationship", length: "9 min", status: "locked" },
  { title: "From Learning to Local Action", length: "8 min", status: "locked" },
];

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Your learning journey</h1>
      <p className="text-muted-foreground mt-2">
        Complete these modules to unlock the regional map and participant matching.
      </p>

      <div className="mt-8 space-y-3">
        {MODULES.map((m, i) => (
          <Card key={m.title} className={m.status === "locked" ? "opacity-60" : undefined}>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <CardTitle className="text-base">
                  {i + 1}. {m.title}
                </CardTitle>
                <Badge
                  variant={
                    m.status === "done"
                      ? "default"
                      : m.status === "current"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {m.status === "done"
                    ? "Completed"
                    : m.status === "current"
                      ? "In progress"
                      : "Locked"}
                </Badge>
              </div>
              <CardDescription>{m.length} · video</CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              TODO: embed video + track progress.
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
