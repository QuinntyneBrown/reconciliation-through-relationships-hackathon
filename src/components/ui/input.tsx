import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "@/lib/utils";
import { controlStyles } from "@/components/ui/control-styles";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        controlStyles,
        "file:text-foreground min-w-0 file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-bold disabled:pointer-events-none",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
