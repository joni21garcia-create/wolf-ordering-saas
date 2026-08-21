"use client";

import clsx from "clsx";

export interface ReservationStatsSkeletonProps {
  items?: number;
  className?: string;
}

export default function ReservationStatsSkeleton({
  items = 4,
  className,
}: ReservationStatsSkeletonProps) {
  const safeItems = Math.max(
    1,
    Math.min(Math.trunc(items), 8)
  );

  return (
    <div
      aria-hidden="true"
      className={clsx(
        "flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        "md:grid md:grid-cols-2 md:gap-3 xl:grid-cols-4",
        className
      )}
    >
      {Array.from({ length: safeItems }).map(
        (_, index) => (
          <div
            key={index}
            className="
              flex min-w-[118px] shrink-0 items-center gap-2.5
              rounded-xl border border-border/70
              bg-card px-3 py-2.5 shadow-sm
              md:min-w-0 md:rounded-2xl md:px-4 md:py-3.5
            "
          >
            <div className="animate-pulse h-8 w-8 shrink-0 rounded-xl bg-muted md:h-9 md:w-9" />

            <div className="min-w-0 flex-1 space-y-2">
              <div className="animate-pulse h-2.5 w-16 rounded-full bg-muted" />
              <div
                className={clsx(
                  "animate-pulse h-5 rounded-lg bg-muted",
                  index % 2 === 0
                    ? "w-10"
                    : "w-14"
                )}
              />
            </div>
          </div>
        )
      )}
    </div>
  );
}