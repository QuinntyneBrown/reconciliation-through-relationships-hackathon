import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cardVariants = cva(
  "group/card flex flex-col gap-0 overflow-hidden rounded-2xl border text-card-foreground [--card-padding:24px] [--card-section-padding:16px] data-[size=sm]:[--card-padding:16px] data-[size=sm]:[--card-section-padding:12px]",
  {
    variants: {
      variant: {
        default: "border-border bg-card shadow-rtr-1",
        tinted: "border-border bg-birch shadow-none",
        spruce: "border-spruce-200 bg-spruce-100 shadow-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Card({
  className,
  size = "default",
  variant = "default",
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof cardVariants> & {
    size?: "default" | "sm";
  }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      data-variant={variant}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header border-border @container/card-header grid auto-rows-min items-start gap-1 border-b px-(--card-padding) py-(--card-section-padding) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "text-spruce-800 font-sans text-[17px] leading-[1.25] font-bold group-data-[size=sm]/card:text-[15.5px]",
        className,
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-ink-soft text-[13.5px] leading-normal", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-content" className={cn("p-(--card-padding)", className)} {...props} />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "border-border flex flex-wrap items-center gap-3 border-t px-(--card-padding) py-(--card-section-padding)",
        className,
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  cardVariants,
};
