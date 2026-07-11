import * as React from "react";

import { cn } from "@/lib/utils";
import { controlStyles } from "@/components/ui/control-styles";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(controlStyles, "min-h-textarea leading-copy flex resize-y", className)}
      {...props}
    />
  );
}

export { Textarea };
