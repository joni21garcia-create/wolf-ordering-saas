"use client";

import {
  CalendarDays,
  Plus,
  Settings2,
} from "lucide-react";

interface ReservationHeaderProps {
  onNewReservation?: () => void;
  onSettings?: () => void;
}

export default function ReservationHeader({
  onNewReservation,
  onSettings,
}: ReservationHeaderProps) {
  const today =
    new Date().toLocaleDateString(
      "es-EC",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );

  return (
    <section
      className="
        rounded-2xl border border-white/10
        bg-zinc-900/60 px-4 py-4
        shadow-sm backdrop-blur
        sm:px-5 sm:py-5
      "
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-orange-400">
            <CalendarDays className="h-4 w-4 shrink-0" />
            <span className="truncate text-xs font-medium capitalize text-zinc-400">
              {today}
            </span>
          </div>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Reservas
          </h1>

          <p className="mt-1 hidden text-sm text-zinc-500 sm:block">
            Gestiona la operación de reservas desde un solo lugar.
          </p>
        </div>

        <div className="flex w-full justify-end gap-2 sm:w-auto">
          {onSettings ? (
            <button
              type="button"
              onClick={onSettings}
              aria-label="Configuración de reservas"
              className="
                inline-flex h-11 w-11 shrink-0 items-center justify-center
                rounded-xl border border-white/10 bg-zinc-900
                text-zinc-300 transition
                hover:bg-white/5 active:scale-95
              "
            >
              <Settings2 className="h-4 w-4" />
            </button>
          ) : null}

          <button
            type="button"
            onClick={onNewReservation}
            className="
              inline-flex h-10 shrink-0 items-center justify-center gap-1.5
              rounded-xl bg-orange-500 px-3.5
              text-sm font-semibold text-white
              shadow-md shadow-orange-500/10 transition
              hover:bg-orange-400 active:scale-[0.97]
              sm:h-11 sm:px-4
            "
          >
            <Plus className="h-4 w-4" />
            <span>Nueva reserva</span>
          </button>
        </div>
      </div>
    </section>
  );
}