"use client";

import { CalendarDays } from "lucide-react";

interface ReservationAgendaEmptyProps {
  message?: string;
  description?: string;
  onCreateReservation?: () => void;
}

export default function ReservationAgendaEmpty({
  message = "No hay reservas",
  description = "No existen reservas para este día.",
  onCreateReservation,
}: ReservationAgendaEmptyProps) {
  return (
    <div
      className="
        flex
        min-h-[360px]
        flex-col
        items-center
        justify-center
        rounded-2xl
        border
        border-dashed
        border-zinc-700
        bg-zinc-900/40
        px-6
        py-12
        text-center
      "
    >
      <div className="mb-4 rounded-full bg-orange-500/10 p-4">
        <CalendarDays className="h-8 w-8 text-orange-400" />
      </div>

      <h3 className="text-lg font-semibold text-white">
        {message}
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-400">
        {description}
      </p>

      {onCreateReservation ? (
        <button
          type="button"
          onClick={onCreateReservation}
          className="
            mt-5
            rounded-xl
            bg-orange-500
            px-4
            py-2.5
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-orange-600
            active:scale-95
          "
        >
          Nueva reserva
        </button>
      ) : null}
    </div>
  );
}