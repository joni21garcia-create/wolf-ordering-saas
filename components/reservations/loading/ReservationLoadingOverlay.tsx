"use client";

import type { ReactNode } from "react";
import ReservationLoadingSpinner from "./ReservationLoadingSpinner";

export interface ReservationLoadingOverlayProps {
  visible?: boolean;
  message?: ReactNode;
}

export default function ReservationLoadingOverlay({
  visible = true,
  message = "Cargando...",
}: ReservationLoadingOverlayProps) {
  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/65 px-5 backdrop-blur-md"
    >
      <div className="flex w-full max-w-xs flex-col items-center rounded-2xl border border-border/70 bg-card/95 px-6 py-6 text-center shadow-xl shadow-black/10">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
          <ReservationLoadingSpinner size="lg" />
        </div>

        <p className="mt-4 text-sm font-semibold text-foreground">
          {message}
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          Un momento, por favor.
        </p>
      </div>
    </div>
  );
}