"use client";

import { ReactNode } from "react";
import clsx from "clsx";

export interface ReservationFloatingButtonProps {
  children: ReactNode;

  className?: string;

  position?: "bottom-right" | "bottom-left";
}

const positions = {
  "bottom-right": "bottom-6 right-6",
  "bottom-left": "bottom-6 left-6",
};

export default function ReservationFloatingButton({
  children,
  className,
  position = "bottom-right",
}: ReservationFloatingButtonProps) {
  return (
    <div
      className={clsx(
        "fixed z-40",
        positions[position],
        className
      )}
    >
      {children}
    </div>
  );
}

