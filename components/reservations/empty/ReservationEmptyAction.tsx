"use client";

import { ReactNode } from "react";
import clsx from "clsx";

export interface ReservationEmptyActionProps {
  children: ReactNode;

  className?: string;
}

export default function ReservationEmptyAction({
  children,
  className,
}: ReservationEmptyActionProps) {
  return (
    <div
      className={clsx(
        "mt-5",
        className
      )}
    >
      {children}
    </div>
  );
}

