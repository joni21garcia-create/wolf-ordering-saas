"use client";

import clsx from "clsx";

export interface ReservationCardSkeletonProps {
  className?: string;
}

export default function ReservationCardSkeleton({
  className,
}: ReservationCardSkeletonProps) {
  return (
    <div
      className={clsx(
        "animate-pulse rounded-2xl border border-border bg-card p-5 space-y-4",
        className
      )}
    >
      <div className="h-4 w-1/2 rounded bg-muted" />

      <div className="h-8 w-1/3 rounded bg-muted" />

      <div className="h-3 w-3/4 rounded bg-muted" />
    </div>
  );
}

