import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const statusBase =
  "gap-1.5 bg-current/0 px-[11px] py-[3px] text-status font-bold tracking-status before:size-[7px] before:shrink-0 before:rounded-full before:bg-current";

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden rounded-full whitespace-nowrap transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-success-subtle text-success gap-1.5 px-3 py-1 text-caption font-semibold",
        secondary: "bg-warning-subtle text-warning gap-1.5 px-3 py-1 text-caption font-semibold",
        destructive: `${statusBase} bg-destructive-subtle text-destructive`,
        outline:
          "min-h-control-sm border-input bg-card text-primary hover:border-primary hover:text-heading gap-1.5 border-control px-4 text-sm font-semibold",
        ghost: "bg-info-subtle text-info gap-1.5 px-3 py-1 text-caption font-semibold",
        link: "text-link hover:text-link-hover rounded-sm px-0 underline-offset-4 hover:underline",
        "filter-active":
          "min-h-control-sm border-primary bg-primary text-primary-foreground gap-1.5 border-control px-4 text-sm font-semibold",
        // Domain statuses are separate variants even when some currently share styling;
        // their visual meanings can evolve independently without changing call sites.
        eligible: `${statusBase} bg-success-subtle text-success`,
        learning: `${statusBase} bg-warning-subtle text-warning`,
        pending: `${statusBase} bg-muted text-muted-foreground`,
        matched: `${statusBase} bg-info-subtle text-info`,
        waitlist: `${statusBase} bg-muted text-muted-foreground`,
        alert: `${statusBase} bg-destructive-subtle text-destructive`,
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  });
}

export { Badge, badgeVariants };
