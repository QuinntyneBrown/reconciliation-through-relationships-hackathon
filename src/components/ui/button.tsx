import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-[10px] border-[1.5px] border-transparent bg-clip-padding font-sans text-[15.5px] font-bold tracking-[0.01em] whitespace-nowrap transition-colors duration-[180ms] outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ochre-600 disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-transparent disabled:bg-sand disabled:text-ink-faint disabled:opacity-100 aria-invalid:border-berry-700 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-spruce-700 text-white hover:bg-spruce-800",
        outline:
          "border-spruce-700 bg-transparent text-spruce-700 hover:bg-spruce-100 hover:text-spruce-800",
        secondary: "bg-ochre-100 text-ochre-700 hover:bg-ochre-200",
        soft: "bg-ochre-100 text-ochre-700 hover:bg-ochre-200",
        ghost: "bg-transparent text-river-700 hover:bg-river-100 hover:text-river-700",
        quiet: "bg-transparent text-river-700 hover:bg-river-100 hover:text-river-700",
        destructive: "bg-berry-700 text-white hover:bg-[#6f2726]",
        "danger-quiet":
          "border-berry-700 bg-transparent text-berry-700 hover:bg-berry-100 hover:text-berry-700",
        "on-dark": "bg-ochre-500 text-spruce-900 hover:bg-ochre-200 hover:text-spruce-900",
        link: "h-auto min-h-0 rounded-sm border-0 p-0 text-river-700 underline-offset-4 hover:text-spruce-800 hover:underline",
      },
      size: {
        default: "min-h-11 px-[22px] py-2",
        xs: "min-h-8 rounded-lg px-3 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "min-h-9 rounded-lg px-4 py-1.5 text-sm [&_svg:not([class*='size-'])]:size-3.5",
        lg: "min-h-13 rounded-xl px-[30px] py-2.5 text-[17px]",
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
