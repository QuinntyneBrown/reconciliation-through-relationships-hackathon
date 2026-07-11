import Link from "next/link";

import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  muted?: boolean;
};

export function BrandMark({ className, muted = false }: BrandMarkProps) {
  const ochre = muted ? "#C9BCA3" : "#E0A34E";
  const river = muted ? "#C9BCA3" : "#7FB5AE";

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("size-8 shrink-0", className)}>
      <path
        d="M16 4a12 12 0 0 1 0 24"
        fill="none"
        stroke={ochre}
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        d="M16 28a12 12 0 0 1 0-24"
        fill="none"
        stroke={river}
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeDasharray={muted ? "2 7" : undefined}
      />
      {!muted && (
        <>
          <circle cx="12.4" cy="16" r="2.1" fill={ochre} />
          <circle cx="19.6" cy="16" r="2.1" fill={river} />
        </>
      )}
    </svg>
  );
}

type BrandProps = {
  href?: string;
  subtitle?: string;
  className?: string;
};

export function RtrBrand({ href = "/dashboard", subtitle, className }: BrandProps) {
  return (
    <Link
      href={href}
      className={cn(
        "text-on-dark hover:text-on-dark mr-3 flex shrink-0 items-center gap-2.5 no-underline",
        className,
      )}
    >
      <BrandMark className="size-[30px]" />
      <span className="leading-none">
        <span className="font-heading block text-[19px] leading-[1.1] font-semibold tracking-[0.01em]">
          RTR Portal
        </span>
        <span className="text-on-dark-soft mt-0.5 hidden text-[10.5px] leading-none font-semibold tracking-[0.12em] uppercase sm:block">
          {subtitle ?? "Reconciliation Through Relationships"}
        </span>
      </span>
    </Link>
  );
}

export function Weave({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <div aria-hidden="true" className={cn("rtr-weave", onDark && "rtr-weave-on-dark", className)} />
  );
}
