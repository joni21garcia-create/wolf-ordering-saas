"use client";

import type { ReactNode } from "react";
import clsx from "clsx";

export interface ReservationTimelineProps {
  children: ReactNode;
  className?: string;
}

export default function ReservationTimeline({
  children,
  className,
}: ReservationTimelineProps) {
  return (
    <div
      role="list"
      className={clsx(
        "relative space-y-0",
        className
      )}
    >
      {children}
    </div>
  );
}