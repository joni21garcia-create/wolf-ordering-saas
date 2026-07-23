"use client";

import type { ReservationCalendarEvent } from "@/types/reservations";

interface Props {
  events?: ReservationCalendarEvent[];
  date?: string;
}

export function Calendar({
  events = [],
  date,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-8">
      <h2 className="text-xl font-bold">
        Nuevo Calendario
      </h2>

      <p className="mt-2 text-sm text-gray-500">
        Fecha: {date}
      </p>

      <p className="mt-2">
        Eventos: {events.length}
      </p>
    </div>
  );
}
