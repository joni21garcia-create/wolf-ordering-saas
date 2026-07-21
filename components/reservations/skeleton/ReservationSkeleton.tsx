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
  return (
    <div
      className={clsx(
        "animate-pulse space-y-3",
        className
      )}
    >
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={clsx(
            "h-4 rounded-lg bg-muted",
            index === lines - 1 && "w-2/3"
          )}
        />
      ))}
    </div>
  );
}

