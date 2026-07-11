"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { RtrBrand } from "@/components/rtr-brand";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type AppNavItem = {
  href: string;
  label: string;
};

type AppHeaderProps = {
  homeHref?: string;
  navItems?: AppNavItem[];
  roleLabel?: string;
  actions?: ReactNode;
  className?: string;
};

function isCurrentPath(pathname: string, href: string) {
  return href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export function AppHeader({
  homeHref = "/dashboard",
  navItems = [],
  roleLabel,
  actions,
  className,
}: AppHeaderProps) {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "bg-spruce-800 text-on-dark border-ochre-600 sticky top-0 z-40 border-b-[3px]",
        className,
      )}
    >
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center gap-6 px-4 sm:px-6">
        <RtrBrand href={homeHref} />

        {navItems.length > 0 && (
          <nav
            className="hidden min-w-0 flex-1 items-stretch self-stretch min-[861px]:flex"
            aria-label="Main"
          >
            {navItems.map((item) => {
              const active = isCurrentPath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "text-on-dark-soft hover:text-on-dark -mb-[3px] flex items-center border-b-[3px] border-transparent px-3 pt-[3px] text-[15px] font-semibold no-underline transition-colors",
                    active && "text-on-dark border-ochre-500",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}

        <div className="ml-auto flex items-center gap-3">
          {roleLabel && (
            <span className="bg-ochre-500 text-spruce-900 hidden rounded-full px-2.5 py-1 text-[11px] font-bold tracking-[0.1em] uppercase sm:inline-flex">
              {roleLabel}
            </span>
          )}
          {actions}

          {navItems.length > 0 && (
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    variant="on-dark"
                    size="sm"
                    className="min-[861px]:hidden"
                    aria-label="Open navigation"
                  />
                }
              >
                <Menu />
                Menu
              </SheetTrigger>
              <SheetContent side="right" className="border-spruce-700 bg-spruce-800 text-on-dark">
                <SheetHeader className="border-on-dark/15 border-b px-5 py-5">
                  <SheetTitle className="text-on-dark text-left">
                    Reconciliation Through Relationships
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col p-3" aria-label="Mobile navigation">
                  {navItems.map((item) => {
                    const active = isCurrentPath(pathname, item.href);
                    return (
                      <SheetClose
                        key={item.href}
                        render={
                          <Link
                            href={item.href}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                              "text-on-dark-soft hover:bg-spruce-700 hover:text-on-dark rounded-lg border-l-[3px] border-transparent px-4 py-3 font-semibold no-underline",
                              active && "bg-spruce-700 text-on-dark border-ochre-500",
                            )}
                          />
                        }
                      >
                        {item.label}
                      </SheetClose>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}
