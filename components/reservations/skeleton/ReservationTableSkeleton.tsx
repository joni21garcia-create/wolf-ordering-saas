"use client";

import clsx from "clsx";

export interface ReservationTableSkeletonProps {
  rows?: number;

  columns?: number;

  className?: string;
}

export default function ReservationTableSkeleton({
  rows = 5,
  columns = 4,
  className,
}: ReservationTableSkeletonProps) {
  return (
    <div
      className={clsx(
        "animate-pulse overflow-hidden rounded-2xl border border-border bg-card",
        className
      )}
    >
      <div className="border-b border-border p-4">
        <div className="h-4 w-1/3 rounded bg-muted" />
      </div>

      <div className="space-y-3 p-4">
        {Array.from({ length: rows }).map((_, row) => (
          <div
            key={row}
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: columns }).map((_, column) => (
              <div
                key={column}
                className="h-4 rounded bg-muted"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

