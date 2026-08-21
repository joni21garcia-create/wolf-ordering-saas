"use client";

import {
  ChevronDown,
  Clock3,
  Users,
} from "lucide-react";

import ReservationAgendaCard from "./ReservationAgendaCard";

interface ReservationAgendaHourProps {
  hour: string;
  defaultOpen?: boolean;
  reservations?: {
    id: string;
    customer: string;
    table: string;
    guests: number;
    time: string;
    status: string;
  }[];
}

export default function ReservationAgendaHour({
  hour,
  reservations = [],
  defaultOpen = false,
}: ReservationAgendaHourProps) {
  return (
    <details
      open={defaultOpen}
      className="group"
    >
      <summary
        className="
          flex
          min-h-16
          cursor-pointer
          list-none
          items-center
          gap-3
          px-4
          py-3
          transition
          hover:bg-zinc-900/70
          active:bg-zinc-900
          [&::-webkit-details-marker]:hidden
          sm:px-8
        "
      >
        <div
          className="
            flex
            h-10
            w-16
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            border-zinc-800
            bg-zinc-900
            text-sm
            font-bold
            text-white
          "
        >
          {hour}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 shrink-0 text-orange-400" />

            <span className="text-sm font-semibold text-white">
              Reservas de las {hour}
            </span>
          </div>

          <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
            <Users className="h-3.5 w-3.5" />

            <span>
              {reservations.length}{" "}
              {reservations.length === 1
                ? "reserva"
                : "reservas"}
            </span>
          </div>
        </div>

        <span
          aria-hidden="true"
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            border-zinc-800
            bg-zinc-900
            text-zinc-400
            transition-transform
            duration-200
            group-open:rotate-180
            group-open:text-orange-400
          "
        >
          <ChevronDown className="h-4 w-4" />
        </span>
      </summary>

      <div
        className="
          border-t
          border-zinc-800
          bg-zinc-950/60
          px-3
          py-3
          sm:px-8
          sm:py-4
        "
      >
        <div className="space-y-2.5">
          {reservations.map(
            (reservation) => (
              <ReservationAgendaCard
                key={reservation.id}
                customer={
                  reservation.customer
                }
                table={reservation.table}
                guests={reservation.guests}
                time={reservation.time}
                status={reservation.status}
              />
            )
          )}
        </div>
      </div>
    </details>
  );
}