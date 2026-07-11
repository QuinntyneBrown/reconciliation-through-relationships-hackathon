"use client";

import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Video, FileText } from "lucide-react";
import type { LearningModule } from "@/data/supabase/database.types";

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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          {module.content_type === "video" ? (
            <Video className="h-4 w-4 text-muted-foreground" />
          ) : (
            <FileText className="h-4 w-4 text-muted-foreground" />
          )}
          <Badge variant="secondary" className="capitalize text-xs">
            {module.content_type}
          </Badge>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span className="text-xs">{module.duration_minutes} min</span>
          </div>
          {isCompleted && (
            <Badge className="bg-accent/20 text-accent-foreground border-accent/20 text-xs gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Completed
            </Badge>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold">{module.title}</h1>
        {module.description && (
          <p className="text-muted-foreground mt-2 leading-relaxed">{module.description}</p>
        )}
      </div>

      {/* Video content */}
      {module.content_type === "video" && module.content_url && (
        <div className="rounded-xl overflow-hidden border border-border aspect-video bg-muted">
          <iframe
            src={module.content_url}
            title={module.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Text content */}
      {module.content_type === "text" && module.content_body && (
        <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className="text-xl font-bold mb-4 text-foreground">{children}</h1>,
              h2: ({ children }) => <h2 className="text-lg font-semibold mt-6 mb-3 text-foreground">{children}</h2>,
              h3: ({ children }) => <h3 className="text-base font-semibold mt-4 mb-2 text-foreground">{children}</h3>,
              p: ({ children }) => <p className="mb-4 leading-relaxed text-foreground last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="mb-4 ml-4 space-y-1 list-disc text-foreground">{children}</ul>,
              ol: ({ children }) => <ol className="mb-4 ml-4 space-y-1 list-decimal text-foreground">{children}</ol>,
              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
              em: ({ children }) => <em className="italic">{children}</em>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary/40 pl-4 my-4 italic text-muted-foreground">
                  {children}
                </blockquote>
              ),
              hr: () => <hr className="my-6 border-border" />,
            }}
          >
            {module.content_body}
          </ReactMarkdown>
        </div>
      )}

      {/* Mark complete */}
      <div className="border border-border rounded-xl p-6 bg-card flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {isCompleted ? (
          <div className="flex items-center gap-2 text-accent-foreground">
            <CheckCircle2 className="h-5 w-5 text-accent" />
            <span className="font-medium">You&apos;ve completed this module</span>
          </div>
        ) : (
          <>
            <div className="flex-1">
              <p className="font-medium">Ready to continue?</p>
              <p className="text-sm text-muted-foreground">
                Mark this module complete when you&apos;ve finished the content above.
              </p>
            </div>
            <Button
              onClick={onMarkComplete}
              disabled={completing}
              size="lg"
              className="shrink-0"
            >
              {completing ? "Saving…" : "Mark complete"}
            </Button>
          </>
        )}
      </div>

      {allComplete && (
        <div className="rounded-xl border border-accent/30 bg-accent/10 p-6 text-center">
          <CheckCircle2 className="h-8 w-8 text-accent mx-auto mb-2" />
          <p className="font-semibold text-lg">Learning journey complete!</p>
          <p className="text-muted-foreground text-sm mt-1">
            You&apos;re ready to connect with participants. Redirecting to your dashboard…
          </p>
        </div>
      )}
    </div>
  );
}
