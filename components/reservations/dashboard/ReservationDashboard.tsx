"use client";

import { ReactNode } from "react";
import clsx from "clsx";

export interface ReservationDashboardProps {
  children: ReactNode;

  className?: string;
}

export default function ReservationDashboard({
  children,
  className,
}: ReservationDashboardProps) {
  return (
    <div
      className={clsx(
        "space-y-8",
        className
      )}
    >
      {children}
    </div>
  );
}

