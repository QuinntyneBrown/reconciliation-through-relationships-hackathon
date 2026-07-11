import { cn } from "@/lib/utils";

type CohortCircleProps = {
  count: number;
  threshold?: number;
  size?: "sm" | "default";
  className?: string;
};

export function CohortCircle({
  count,
  threshold = 5,
  size = "default",
  className,
}: CohortCircleProps) {
  const ready = count >= threshold;
  const displayedCount = Math.min(count, threshold);
  const diameter = size === "sm" ? 64 : 104;
  const seatSize = size === "sm" ? 11 : 16;
  const orbit = size === "sm" ? 25 : 41;

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: diameter, height: diameter }}
      role="img"
      aria-label={`${count} of ${threshold} seats filled${ready ? ", ready to gather" : ""}`}
    >
      {ready && (
        <span
          aria-hidden="true"
          className="border-ochre-500 pointer-events-none absolute rounded-full border-2 border-dashed"
          style={{ inset: size === "sm" ? -6 : -9 }}
        />
      )}
      {Array.from({ length: threshold }, (_, index) => {
        const filled = index < displayedCount;
        const angle = (360 / threshold) * index;
        return (
          <span
            key={index}
            aria-hidden="true"
            className={cn(
              "border-border-strong bg-parchment absolute top-1/2 left-1/2 rounded-full border-2",
              filled &&
                (ready ? "border-ochre-600 bg-ochre-600" : "border-spruce-600 bg-spruce-600"),
            )}
            style={{
              width: seatSize,
              height: seatSize,
              margin: -seatSize / 2,
              transform: `rotate(${angle}deg) translateY(-${orbit}px)`,
            }}
          />
        );
      })}
      <span className="font-heading text-spruce-800 absolute inset-0 grid place-content-center text-center text-[21px] leading-none font-semibold">
        {count}
        {size !== "sm" && (
          <small className="text-ink-faint mt-1 block font-sans text-[10.5px] font-bold tracking-[0.08em] uppercase">
            {ready ? "ready" : `of ${threshold}`}
          </small>
        )}
      </span>
    </div>
  );
}
