"use client";

import { ReactNode } from "react";
import clsx from "clsx";

export interface ReservationSectionActionsProps {
  children: ReactNode;

  className?: string;

  align?: "start" | "center" | "end";
}

const alignClasses = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
};

export default function ReservationSectionActions({
  children,
  className,
  align = "end",
}: ReservationSectionActionsProps) {
  return (
    <div
      className={clsx(
        "flex items-center gap-2",
        alignClasses[align],
        className
      )}
    >
      {children}
    </div>
  );
}

