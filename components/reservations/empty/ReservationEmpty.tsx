"use client";

import { ReactNode } from "react";
import clsx from "clsx";

export interface ReservationEmptyProps {
  children?: ReactNode;

  className?: string;
}

export default function ReservationEmpty({
  children,
  className,
}: ReservationEmptyProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-10 text-center",
        className
      )}
    >
      {children}
    </div>
  );
}

