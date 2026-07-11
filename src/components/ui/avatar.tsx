"use client";

import * as React from "react";
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "group/avatar relative flex shrink-0 items-center justify-center rounded-full font-sans font-bold tracking-[0.02em] select-none",
  {
    variants: {
      size: {
        sm: "size-8 text-xs",
        default: "size-11 text-[15px]",
        lg: "size-16 text-[22px]",
        xl: "size-[88px] text-[30px]",
      },
      variant: {
        default: "bg-spruce-100 text-spruce-800",
        river: "bg-river-100 text-river-700",
        ochre: "bg-ochre-100 text-ochre-700",
        berry: "bg-berry-100 text-berry-700",
        dark: "bg-spruce-700 text-on-dark",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  },
);

function Avatar({
  className,
  size = "default",
  variant = "default",
  ...props
}: AvatarPrimitive.Root.Props & VariantProps<typeof avatarVariants>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      data-variant={variant}
      className={cn(avatarVariants({ size, variant }), className)}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full rounded-full object-cover", className)}
      {...props}
    />
  );
}

function AvatarFallback({ className, ...props }: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-inherit text-inherit",
        className,
      )}
      {...props}
    />
  );
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "bg-ochre-500 text-spruce-900 ring-parchment absolute right-0 bottom-0 z-10 inline-flex size-3 items-center justify-center rounded-full ring-2 select-none group-data-[size=lg]/avatar:size-4 group-data-[size=sm]/avatar:size-2 group-data-[size=xl]/avatar:size-5 [&>svg]:size-2",
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group *:data-[slot=avatar]:ring-parchment flex -space-x-2.5 *:data-[slot=avatar]:ring-2",
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroupCount({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "bg-berry-100 text-berry-700 ring-parchment relative flex size-11 shrink-0 items-center justify-center rounded-full text-[15px] font-bold ring-2 group-has-data-[size=lg]/avatar-group:size-16 group-has-data-[size=lg]/avatar-group:text-[22px] group-has-data-[size=sm]/avatar-group:size-8 group-has-data-[size=sm]/avatar-group:text-xs group-has-data-[size=xl]/avatar-group:size-[88px] group-has-data-[size=xl]/avatar-group:text-[30px]",
        className,
      )}
      {...props}
    />
  );
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
  avatarVariants,
};
