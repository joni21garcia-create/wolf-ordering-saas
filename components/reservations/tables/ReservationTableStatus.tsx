"use client";

import type { ReservationStatus } from "@/types/reservations";
import {
  RESERVATION_STATUS_COLORS,
  RESERVATION_STATUS_LABELS,
} from "@/constants/reservations/reservation-status";

interface ReservationTableStatusProps {
  status: ReservationStatus;
}

export function ReservationTableStatus({
  status,
}: ReservationTableStatusProps) {
  const classes =
    RESERVATION_STATUS_COLORS[status] ??
    "border-zinc-200 bg-zinc-50 text-zinc-600";

  const label =
    RESERVATION_STATUS_LABELS[status] ??
    String(status);

  return (
    <span
      className={`
        inline-flex shrink-0 items-center gap-1.5
        rounded-full border px-2.5 py-1
        text-[10px] font-bold
        ${classes}
      `}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full bg-current opacity-70"
      />
      {label}
    </span>
  );
}