"use client";

import clsx from "clsx";

export interface ReservationSkeletonProps {
  className?: string;
  lines?: number;
}

export default function ReservationSkeleton({
  className,
  lines = 3,
}: ReservationSkeletonProps) {
  const safeLines = Math.max(1, Math.min(Math.trunc(lines), 8));

  return (
    <div
      aria-hidden="true"
      className={clsx(
        "animate-pulse space-y-3",
        className
      )}
    >
      {Array.from({ length: safeLines }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3"
        >
          <div className="h-9 w-9 shrink-0 rounded-xl bg-muted" />

          <div className="min-w-0 flex-1 space-y-2">
            <div
              className={clsx(
                "h-3.5 rounded-full bg-muted",
                index % 3 === 0 ? "w-4/5" : "w-3/5"
              )}
            />
            <div className="h-2.5 w-2/5 rounded-full bg-muted/80" />
          </div>

          <div className="hidden h-7 w-12 rounded-full bg-muted sm:block" />
        </div>
      ))}
    </div>
  );
}