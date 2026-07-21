"use client";

import { ReactNode } from "react";
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
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm">
      <ReservationLoadingSpinner size="lg" />

      <p className="text-sm font-medium text-muted-foreground">
        {message}
      </p>
    </div>
  );
}

