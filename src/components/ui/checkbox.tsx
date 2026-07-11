"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";

import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-border-strong bg-parchment hover:border-spruce-600 focus-visible:outline-ochre-600 data-checked:border-spruce-700 data-checked:bg-spruce-700 disabled:bg-sand aria-invalid:border-berry-700 aria-invalid:outline-berry-700 relative mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[4px] border-[1.5px] text-white transition-colors duration-[180ms] outline-none after:absolute after:-inset-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-4"
      >
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
