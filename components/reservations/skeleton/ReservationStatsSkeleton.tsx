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
  return (
    <div
      className={clsx(
        "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {Array.from({ length: items }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-border bg-card p-5 space-y-4"
        >
          <div className="h-4 w-1/2 rounded bg-muted" />

          <div className="h-8 w-1/3 rounded bg-muted" />

          <div className="h-3 w-2/3 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

