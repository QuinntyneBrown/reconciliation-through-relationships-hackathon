import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-control border-control border-transparent bg-clip-padding font-sans text-action font-bold tracking-action whitespace-nowrap transition-colors outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-transparent disabled:bg-muted disabled:text-subtle-foreground disabled:opacity-100 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        outline:
          "border-primary bg-transparent text-primary hover:bg-primary-subtle hover:text-heading",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-hover",
        ghost: "bg-transparent text-link hover:bg-accent hover:text-accent-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive-hover",
        "destructive-outline":
          "border-destructive bg-transparent text-destructive hover:bg-destructive-subtle hover:text-destructive",
        inverse:
          "bg-inverse-accent text-inverse-accent-foreground hover:bg-inverse-accent-hover hover:text-inverse-accent-foreground",
        link: "text-link hover:text-link-hover h-auto min-h-0 rounded-sm border-0 p-0 underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-11 px-[22px] py-2",
        xs: "min-h-8 rounded-lg px-3 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "min-h-9 rounded-lg px-4 py-1.5 text-sm [&_svg:not([class*='size-'])]:size-3.5",
        lg: "min-h-13 rounded-xl px-[30px] py-2.5 text-card-title",
        icon: "size-11 p-0",
        "icon-xs": "size-8 rounded-lg p-0 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9 rounded-lg p-0 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-13 rounded-xl p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
