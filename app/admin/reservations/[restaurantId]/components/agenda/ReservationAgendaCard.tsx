"use client";

import {
  Users,
  Clock3,
  UtensilsCrossed,
} from "lucide-react";

import {
  RESERVATION_STATUS_COLORS,
  RESERVATION_STATUS_LABELS,
} from "@/constants/reservations/reservation-status";

interface ReservationAgendaCardProps {
  customer: string;
  table: string;
  guests: number;
  time: string;
  status?: string;
  onClick?: () => void;
}

export default function ReservationAgendaCard({
  customer,
  table,
  guests,
  time,
  status = "confirmed",
  onClick,
}: ReservationAgendaCardProps) {
  const statusColor =
    RESERVATION_STATUS_COLORS[
      status as keyof typeof RESERVATION_STATUS_COLORS
    ] ??
    "border-zinc-700 bg-zinc-800/50 text-zinc-300";

  const statusLabel =
    RESERVATION_STATUS_LABELS[
      status as keyof typeof RESERVATION_STATUS_LABELS
    ] ??
    status;

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full
        rounded-xl
        border-l-4
        p-4
        text-left
        transition-all
        duration-200
        hover:scale-[1.01]
        hover:shadow-lg
        focus:outline-none
        focus:ring-2
        focus:ring-orange-500/60
      "
      aria-label={`Reserva de ${customer}`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 truncate font-semibold text-white">
          {customer}
        </h3>

        <span
          className={`
            shrink-0
            rounded-full
            border
            px-2
            py-1
            text-xs
            font-medium
            ${statusColor}
          `}
        >
          {statusLabel}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-zinc-300">
        <span className="flex items-center gap-1.5">
          <UtensilsCrossed className="h-4 w-4 text-zinc-500" />
          {table || "Sin mesa"}
        </span>

        <span className="flex items-center gap-1.5">
          <Users className="h-4 w-4 text-zinc-500" />
          {guests}
        </span>

        <span className="flex items-center gap-1.5">
          <Clock3 className="h-4 w-4 text-zinc-500" />
          {time}
        </span>
      </div>
    </button>
  );
}