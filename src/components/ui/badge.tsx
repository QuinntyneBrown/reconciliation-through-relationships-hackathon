import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const statusBase =
  "gap-1.5 bg-current/0 px-[11px] py-[3px] text-[12.5px] font-bold tracking-[0.02em] before:size-[7px] before:shrink-0 before:rounded-full before:bg-current";

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden rounded-full whitespace-nowrap transition-colors duration-[180ms] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ochre-600 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "gap-1.5 bg-spruce-100 px-3 py-1 text-[13.5px] font-semibold text-spruce-700",
        secondary: "gap-1.5 bg-ochre-100 px-3 py-1 text-[13.5px] font-semibold text-ochre-700",
        destructive: `${statusBase} bg-berry-100 text-berry-700`,
        outline:
          "min-h-[38px] gap-1.5 border-[1.5px] border-border-strong bg-parchment px-4 text-[14.5px] font-semibold text-spruce-700 hover:border-spruce-600 hover:text-spruce-800",
        ghost: "gap-1.5 bg-river-100 px-3 py-1 text-[13.5px] font-semibold text-river-700",
        link: "rounded-sm px-0 text-river-700 underline-offset-4 hover:text-spruce-800 hover:underline",
        ochre: "gap-1.5 bg-ochre-100 px-3 py-1 text-[13.5px] font-semibold text-ochre-700",
        river: "gap-1.5 bg-river-100 px-3 py-1 text-[13.5px] font-semibold text-river-700",
        filter:
          "min-h-[38px] gap-1.5 border-[1.5px] border-border-strong bg-parchment px-4 text-[14.5px] font-semibold text-spruce-700 hover:border-spruce-600 hover:text-spruce-800",
        "filter-active":
          "min-h-[38px] gap-1.5 border-[1.5px] border-spruce-700 bg-spruce-700 px-4 text-[14.5px] font-semibold text-white",
        eligible: `${statusBase} bg-spruce-100 text-spruce-700`,
        learning: `${statusBase} bg-ochre-100 text-ochre-700`,
        pending: `${statusBase} bg-sand text-ink-soft`,
        matched: `${statusBase} bg-river-100 text-river-700`,
        waitlist: `${statusBase} bg-sand text-ink-soft`,
        alert: `${statusBase} bg-berry-100 text-berry-700`,
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
