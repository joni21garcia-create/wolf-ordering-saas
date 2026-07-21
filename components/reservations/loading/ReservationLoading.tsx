"use client";

import { ReactNode } from "react";
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
      className={`flex flex-col items-center justify-center gap-4 py-12 ${className ?? ""}`}
    >
      <ReservationLoadingSpinner />

      <p className="text-sm text-muted-foreground">
        {message}
      </p>
    </div>
  );
}    

