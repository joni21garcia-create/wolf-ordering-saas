"use client";

import { ReactNode } from "react";
import clsx from "clsx";

export interface ReservationFiltersProps {
  children: ReactNode;

  className?: string;

  direction?: "row" | "column";
}

const directions = {
  row: "flex flex-col gap-3 md:flex-row md:items-end",
  column: "flex flex-col gap-3",
};

export default function ReservationFilters({
  children,
  className,
  direction = "row",
}: ReservationFiltersProps) {
  return (
    <div
      className={clsx(
        directions[direction],
        className
      )}
    >
      {children}
    </div>
  );
}

