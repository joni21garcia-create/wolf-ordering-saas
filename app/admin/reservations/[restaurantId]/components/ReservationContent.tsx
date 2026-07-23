"use client";

import type {
  Reservation,
  ReservationCalendarEvent,
} from "@/types/reservations";

import { ReservationCalendar } from "@/components/reservations/calendar";
import { ReservationTable } from "@/components/reservations/tables";

import ReservationUpcoming from "./ReservationUpcoming";
import ReservationAgenda from "./agenda/ReservationAgenda";

interface ReservationContentProps {
  reservations?: Reservation[];
  events?: ReservationCalendarEvent[];
}

export default function ReservationContent({
  reservations = [],
  events = [],
}: ReservationContentProps) {
  return (
    <div className="space-y-8">

      <section className="grid gap-6 xl:grid-cols-[2fr_380px]">

        <ReservationCalendar
          events={events}
          date="2026-07-22"
        />

        <ReservationUpcoming
          reservations={reservations}
        />

      </section>

      <ReservationAgenda />

      <ReservationTable
        reservations={reservations}
      />

    </div>
  );
}
