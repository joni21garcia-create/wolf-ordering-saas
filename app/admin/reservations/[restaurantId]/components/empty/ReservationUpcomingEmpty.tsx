"use client";

import { CalendarX } from "lucide-react";

export default function ReservationUpcomingEmpty() {
  return (
    <div
      className="
        flex
        min-h-[320px]
        flex-col
        items-center
        justify-center
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900
        p-8
        text-center
      "
    >
      <div
        className="
          mb-5
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-full
          bg-zinc-800
        "
      >
        <CalendarX className="h-8 w-8 text-orange-400" />
      </div>

      <h3 className="text-lg font-semibold text-white">
        No hay próximas reservas
      </h3>

      <p className="mt-2 max-w-xs text-sm text-zinc-400">
        Las reservas programadas para hoy aparecerán aquí automáticamente.
      </p>
    </div>
  );
}
