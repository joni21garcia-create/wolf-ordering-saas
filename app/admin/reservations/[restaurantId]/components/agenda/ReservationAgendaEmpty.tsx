"use client";

import { CalendarDays } from "lucide-react";

export default function ReservationAgendaEmpty() {
  return (
    <div className="flex h-96 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40">

      <div className="mb-4 rounded-full bg-orange-500/10 p-4">
        <CalendarDays className="h-8 w-8 text-orange-400" />
      </div>

      <h3 className="text-lg font-semibold text-white">
        No hay reservas
      </h3>

      <p className="mt-2 text-sm text-zinc-400">
        No existen reservas para este día.
      </p>

    </div>
  );
}
