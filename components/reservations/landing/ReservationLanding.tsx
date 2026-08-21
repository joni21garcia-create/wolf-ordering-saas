"use client";

import type { ReactNode } from "react";
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
        "px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8",
        className
      )}
    >
      <div className="mx-auto w-full max-w-6xl">
        {children}
      </div>
    </main>
  );
}