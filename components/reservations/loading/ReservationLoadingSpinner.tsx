"use client";

import clsx from "clsx";

export interface ReservationLoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "h-4 w-4 border-2",
  md: "h-7 w-7 border-2",
  lg: "h-10 w-10 border-[3px]",
};

export default function ReservationLoadingSpinner({
  size = "md",
  className,
}: ReservationLoadingSpinnerProps) {
  return (
    <span
      role="progressbar"
      aria-label="Cargando"
      className={clsx(
        "inline-block animate-spin rounded-full border-current border-t-transparent",
        sizes[size],
        className
      )}
    />
  );
}