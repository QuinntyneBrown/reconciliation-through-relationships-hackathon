"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="text-inverse-accent size-4" />,
        info: <InfoIcon className="text-inverse-accent size-4" />,
        warning: <TriangleAlertIcon className="text-inverse-accent size-4" />,
        error: <OctagonXIcon className="text-inverse-accent size-4" />,
        loading: <Loader2Icon className="text-inverse-accent size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--inverse)",
          "--normal-text": "var(--inverse-foreground)",
          "--normal-border": "transparent",
          "--border-radius": "var(--r-md)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "!bg-inverse !text-inverse-foreground !shadow-rtr-2 !gap-2.5 !border-transparent !px-[18px] !py-3 !font-sans !text-sm !font-semibold",
          description: "!text-inverse-muted-foreground",
          actionButton: "!bg-inverse-accent !text-inverse-accent-foreground !font-bold",
          cancelButton: "!text-inverse-muted-foreground !bg-transparent !font-bold",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
