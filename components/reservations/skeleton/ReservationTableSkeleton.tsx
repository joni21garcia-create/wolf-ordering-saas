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
  const safeRows = Math.max(1, Math.min(Math.trunc(rows), 12));
  const safeColumns = Math.max(1, Math.min(Math.trunc(columns), 8));

  return (
    <div
      aria-hidden="true"
      className={clsx(
        "overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm",
        className
      )}
    >
      {/* Header */}
      <div className="border-b border-border/70 bg-muted/20 px-4 py-3 sm:px-5">
        <div className="animate-pulse flex items-center justify-between gap-3">
          <div className="space-y-2">
            <div className="h-4 w-32 rounded-full bg-muted" />
            <div className="h-2.5 w-48 max-w-[55vw] rounded-full bg-muted/80" />
          </div>
          <div className="h-7 w-16 rounded-full bg-muted" />
        </div>
      </div>

      {/* Mobile rows */}
      <div className="divide-y divide-border/60 md:hidden">
        {Array.from({ length: Math.min(safeRows, 6) }).map((_, row) => (
          <div
            key={row}
            className="animate-pulse flex items-center gap-3 px-4 py-3.5"
          >
            <div className="h-10 w-10 shrink-0 rounded-full bg-muted" />

            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-3.5 w-3/5 rounded-full bg-muted" />
              <div className="h-2.5 w-4/5 rounded-full bg-muted/80" />
            </div>

            <div className="h-4 w-4 shrink-0 rounded bg-muted" />
          </div>
        ))}
      </div>

      {/* Desktop table-like rows */}
      <div className="hidden md:block">
        <div
          className="animate-pulse grid gap-4 border-b border-border/60 px-5 py-3"
          style={{
            gridTemplateColumns: `repeat(${safeColumns}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: safeColumns }).map((_, column) => (
            <div
              key={column}
              className="h-3 w-3/5 rounded-full bg-muted"
            />
          ))}
        </div>

        <div className="divide-y divide-border/60">
          {Array.from({ length: safeRows }).map((_, row) => (
            <div
              key={row}
              className="animate-pulse grid gap-4 px-5 py-4"
              style={{
                gridTemplateColumns: `repeat(${safeColumns}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: safeColumns }).map(
                (_, column) => (
                  <div
                    key={column}
                    className={clsx(
                      "h-4 rounded-full bg-muted",
                      column === 0 && "w-4/5",
                      column !== 0 && "w-3/5"
                    )}
                  />
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}