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
        success: <CircleCheckIcon className="text-ochre-500 size-4" />,
        info: <InfoIcon className="text-ochre-500 size-4" />,
        warning: <TriangleAlertIcon className="text-ochre-500 size-4" />,
        error: <OctagonXIcon className="text-ochre-500 size-4" />,
        loading: <Loader2Icon className="text-ochre-500 size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--spruce-900)",
          "--normal-text": "var(--on-dark)",
          "--normal-border": "transparent",
          "--border-radius": "var(--r-md)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "!gap-2.5 !border-transparent !bg-spruce-900 !px-[18px] !py-3 !font-sans !text-[14.5px] !font-semibold !text-on-dark !shadow-rtr-2",
          description: "!text-on-dark-soft",
          actionButton: "!bg-ochre-500 !font-bold !text-spruce-900",
          cancelButton: "!bg-transparent !font-bold !text-on-dark-soft",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
