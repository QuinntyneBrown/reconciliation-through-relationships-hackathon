"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Video, FileText } from "lucide-react";
import type { LearningModule } from "@/data/supabase/database.types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Props = {
  module: LearningModule;
  isCompleted: boolean;
  onMarkComplete: () => void;
  completing: boolean;
  allComplete: boolean;
};

export default function ModuleContent({
  module,
  isCompleted,
  onMarkComplete,
  completing,
  allComplete,
}: Props) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          {module.content_type === "video" ? (
            <Video className="text-muted-foreground h-4 w-4" />
          ) : (
            <FileText className="text-muted-foreground h-4 w-4" />
          )}
          <Badge variant="secondary" className="text-xs capitalize">
            {module.content_type}
          </Badge>
          <div className="text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span className="text-xs">{module.duration_minutes} min</span>
          </div>
          {isCompleted && (
            <Badge variant="eligible">
              <CheckCircle2 className="h-3 w-3" />
              Completed
            </Badge>
          )}
        </div>
        <h1>{module.title}</h1>
        {module.description && (
          <p className="text-muted-foreground mt-2 leading-relaxed">{module.description}</p>
        )}
      </div>

      {/* Video content */}
      {module.content_type === "video" && module.content_url && (
        <div className="border-border bg-muted aspect-video overflow-hidden rounded-xl border">
          <iframe
            src={module.content_url}
            title={module.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Text content */}
      {module.content_type === "text" && module.content_body && (
        <div className="border-border bg-parchment shadow-rtr-1 max-w-none rounded-2xl border p-6">
          {module.content_body.split("\n\n").map((paragraph, i) => (
            <p key={i} className="text-foreground mb-4 leading-relaxed last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      )}

      {/* Mark complete */}
      <div className="border-border bg-parchment shadow-rtr-1 flex flex-col items-start gap-4 rounded-2xl border p-6 sm:flex-row sm:items-center">
        {isCompleted ? (
          <div className="text-accent-foreground flex items-center gap-2">
            <CheckCircle2 className="text-accent h-5 w-5" />
            <span className="font-medium">You&apos;ve completed this module</span>
          </div>
        ) : (
          <>
            <div className="flex-1">
              <p className="font-medium">Ready to continue?</p>
              <p className="text-muted-foreground text-sm">
                Mark this module complete when you&apos;ve finished the content above.
              </p>
            </div>
            <Button onClick={onMarkComplete} disabled={completing} size="lg" className="shrink-0">
              {completing ? "Saving…" : "Mark complete"}
            </Button>
          </>
        )}
      </div>

      {allComplete && (
        <Alert variant="success">
          <CheckCircle2 />
          <AlertTitle>Learning journey complete!</AlertTitle>
          <AlertDescription>
            You&apos;re ready to connect with participants. Redirecting to your dashboard…
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
