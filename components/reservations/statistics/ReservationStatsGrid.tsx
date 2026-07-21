"use client";

import { ReactNode } from "react";
import clsx from "clsx";

export interface ReservationStatsGridProps {
  children: ReactNode;

  className?: string;
}

export default function ReservationStatsGrid({
  children,
  className,
}: ReservationStatsGridProps) {
  return (
    <div
      className={clsx(
        "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  );
}

