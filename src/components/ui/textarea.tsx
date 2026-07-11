import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-border-strong bg-parchment text-ink placeholder:text-ink-faint hover:border-spruce-600 focus-visible:border-spruce-600 focus-visible:outline-ochre-600 disabled:bg-sand disabled:text-ink-faint aria-invalid:border-berry-700 aria-invalid:outline-berry-700 flex min-h-[110px] w-full resize-y rounded-[10px] border-[1.5px] px-3.5 py-2.5 font-sans text-base leading-[1.55] font-normal transition-colors duration-[180ms] outline-none focus-visible:outline-2 focus-visible:outline-offset-1 disabled:cursor-not-allowed disabled:opacity-100",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
