"use client";

import { ReactNode } from "react";
import clsx from "clsx";

export interface ReservationDashboardContentProps {
  children: ReactNode;

  className?: string;
}

export default function ReservationDashboardContent({
  children,
  className,
}: ReservationDashboardContentProps) {
  return (
    <section
      className={clsx(
        "space-y-8",
        className
      )}
    >
      {children}
    </section>
  );
}

