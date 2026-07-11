import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "border-border-strong bg-parchment text-ink file:text-ink placeholder:text-ink-faint hover:border-spruce-600 focus-visible:border-spruce-600 focus-visible:outline-ochre-600 disabled:bg-sand disabled:text-ink-faint aria-invalid:border-berry-700 aria-invalid:outline-berry-700 min-h-[46px] w-full min-w-0 rounded-[10px] border-[1.5px] px-3.5 py-2.5 font-sans text-base font-normal transition-colors duration-[180ms] outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-bold focus-visible:outline-2 focus-visible:outline-offset-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-100",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
