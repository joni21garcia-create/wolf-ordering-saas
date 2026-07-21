"use client";

import { ReactNode } from "react";
import clsx from "clsx";

export interface ReservationLandingProps {
  children: ReactNode;

  className?: string;
}

export default function ReservationLanding({
  children,
  className,
}: ReservationLandingProps) {
  return (
    <main
      className={clsx(
        "min-h-screen bg-background",
        className
      )}
    >
      {children}
    </main>
  );
}

