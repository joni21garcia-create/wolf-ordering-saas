"use client";

import clsx from "clsx";

export interface ReservationLoadingSpinnerProps {
  size?: "sm" | "md" | "lg";

  className?: string;
}

const sizes = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-4",
};

export default function ReservationLoadingSpinner({
  size = "md",
  className,
}: ReservationLoadingSpinnerProps) {
  return (
    <span
      className={clsx(
        "inline-block animate-spin rounded-full border-current border-t-transparent",
        sizes[size],
        className
      )}
    />
  );
}

