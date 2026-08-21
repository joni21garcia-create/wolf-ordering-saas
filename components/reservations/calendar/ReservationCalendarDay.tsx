"use client";

import { CalendarDays } from "lucide-react";
import type { ReservationCalendarEvent } from "@/types/reservations";
import { ReservationCalendarEvent as CalendarEvent } from "./ReservationCalendarEvent";

interface ReservationCalendarDayProps {
  date: string;
  events: ReservationCalendarEvent[];
  onSelectReservation?: (reservationId: string) => void;
}

export function ReservationCalendarDay({
  date,
  events,
  onSelectReservation,
}: ReservationCalendarDayProps) {
  return (
    <section
      className="
        flex min-h-[180px] flex-col overflow-hidden
        rounded-2xl border border-zinc-200 bg-white shadow-sm
      "
      aria-label={`Reservas del ${date}`}
    >
      <header className="flex items-center justify-between gap-2 border-b border-zinc-100 bg-zinc-50/70 px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <CalendarDays className="h-4 w-4 shrink-0 text-orange-500" />
          <span className="truncate text-sm font-bold text-zinc-900">
            {date}
          </span>
        </div>

        <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-zinc-500 ring-1 ring-zinc-200">
          {events.length}
        </span>
      </header>

      <div className="flex flex-1 flex-col gap-2 p-3">
        {events.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-6 text-center text-xs text-zinc-400">
            Sin reservas
          </div>
        ) : (
          events.map((event) => (
            <CalendarEvent
              key={event.id ?? event.reservationId}
              event={event}
              onClick={onSelectReservation}
            />
          ))
        )}
      </div>
    </section>
  );
}