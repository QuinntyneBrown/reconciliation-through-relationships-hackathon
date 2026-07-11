import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// The RTR type scale (--text-action, --text-card-title, …) adds custom text-*
// font-size utilities that tailwind-merge would otherwise classify as text
// colors, making them cancel out classes like text-primary-foreground.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["action", "card-title", "caption", "label", "status"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
