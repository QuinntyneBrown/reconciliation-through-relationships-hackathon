"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

function Tabs({ className, orientation = "horizontal", ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn("group/tabs flex gap-2 data-horizontal:flex-col", className)}
      {...props}
    />
  );
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex w-full items-center justify-start border-border text-ink-soft group-data-horizontal/tabs:min-h-11 group-data-horizontal/tabs:border-b-2 group-data-vertical/tabs:w-fit group-data-vertical/tabs:flex-col group-data-vertical/tabs:border-r-2",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        line: "bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function TabsList({
  className,
  variant = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "text-ink-soft hover:text-spruce-800 focus-visible:outline-ochre-600 data-active:border-ochre-500 data-active:text-spruce-800 relative -mb-0.5 inline-flex min-h-11 flex-none items-center justify-center gap-1.5 border-b-[3px] border-transparent px-4 py-2 font-sans text-[15px] font-bold whitespace-nowrap transition-colors duration-[180ms] outline-none group-data-vertical/tabs:-mr-0.5 group-data-vertical/tabs:mb-0 group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start group-data-vertical/tabs:border-r-[3px] group-data-vertical/tabs:border-b-0 focus-visible:outline-2 focus-visible:outline-offset-[-2px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
