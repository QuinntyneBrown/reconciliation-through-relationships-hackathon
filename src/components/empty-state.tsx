import type { ReactNode } from "react";

import { BrandMark } from "@/components/rtr-brand";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rtr-empty-state", className)}>
      <BrandMark muted className="mx-auto mb-4 size-16" />
      <h3 className="mb-2">{title}</h3>
      <div className="text-ink-soft mx-auto mb-4 max-w-md">{description}</div>
      {action}
    </div>
  );
}
