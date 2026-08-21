"use client";

import type { ReservationCalendarEvent } from "@/types/reservations";
import { ReservationCalendarGrid } from "./ReservationCalendarGrid";

interface ReservationCalendarProps {
  events: ReservationCalendarEvent[];
  date: string;
  loading?: boolean;
  onDateChange?: (date: string) => void;
  onSelectReservation?: (reservationId: string) => void;
  onCreateReservation?: (date: string) => void;
}

export function ReservationCalendar({
  events,
  date,
  loading = false,
  onDateChange,
  onSelectReservation,
  onCreateReservation,
}: ReservationCalendarProps) {
  if (loading) {
    return (
      <div className="flex min-h-[520px] items-center justify-center rounded-2xl border border-zinc-200 bg-white p-8 text-sm text-zinc-500 shadow-sm">
        Cargando calendario...
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <ReservationCalendarGrid
        events={events}
        date={date}
        onSelectReservation={onSelectReservation}
        onCreateReservation={onCreateReservation}
      />
    </section>
  );
}

