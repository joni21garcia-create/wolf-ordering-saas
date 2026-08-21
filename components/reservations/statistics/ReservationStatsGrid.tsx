"use client";

import type { ReactNode } from "react";
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
        "flex gap-2 overflow-x-auto pb-1",
        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        "sm:grid sm:grid-cols-2 sm:gap-3",
        "xl:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  );
}