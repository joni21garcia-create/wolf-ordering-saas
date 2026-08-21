"use client";

import type { ReactNode } from "react";
import ReservationLoadingSpinner from "./ReservationLoadingSpinner";

export interface ReservationLoadingProps {
  message?: ReactNode;
  className?: string;
}

export default function ReservationLoading({
  message = "Cargando...",
  className,
}: ReservationLoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex min-h-40 flex-col items-center justify-center gap-3 rounded-2xl border border-border/60 bg-card/80 px-5 py-8 text-center shadow-sm ${className ?? ""}`}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
        <ReservationLoadingSpinner size="md" />
      </div>

      <p className="text-sm font-medium text-foreground">
        {message}
      </p>
    </div>
  );
}