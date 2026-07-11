import type { ReactNode } from "react";

import { Weave } from "@/components/rtr-brand";
import { cn } from "@/lib/utils";

type PageIntroProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function PageIntro({ eyebrow, title, description, actions, className }: PageIntroProps) {
  return (
    <div className={cn("flex flex-col justify-between gap-5 sm:flex-row sm:items-end", className)}>
      <div className="max-w-3xl">
        {eyebrow && <span className="rtr-eyebrow mb-2">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <div className="rtr-lead mt-1">{description}</div>}
        <Weave className="mt-4 w-[120px]" />
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
    </div>
  );
}
