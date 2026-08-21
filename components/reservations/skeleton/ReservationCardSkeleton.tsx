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
      aria-hidden="true"
      className={clsx(
        "overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm",
        className
      )}
    >
      <div className="animate-pulse p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-muted" />

          <div className="min-w-0 flex-1 space-y-2.5">
            <div className="h-3.5 w-2/5 rounded-full bg-muted" />
            <div className="h-6 w-3/5 rounded-lg bg-muted" />
            <div className="h-3 w-4/5 rounded-full bg-muted" />
          </div>

          <div className="hidden h-7 w-16 rounded-full bg-muted sm:block" />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
          <div className="h-10 rounded-xl bg-muted" />
          <div className="h-10 rounded-xl bg-muted" />
          <div className="hidden h-10 rounded-xl bg-muted sm:block" />
        </div>
      </div>
    </div>
  );
}