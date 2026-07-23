"use client";

import ReservationHeader from "./components/ReservationHeader";
import ReservationStats from "./components/ReservationStats";
import ReservationContent from "./components/ReservationContent";

import type {
  Reservation,
  ReservationCalendarEvent,
} from "@/types/reservations";

export default function ReservationsPage() {

  const reservations: Reservation[] = [];

  const events: ReservationCalendarEvent[] = [];

  return (

    <main className="space-y-8 p-8">

      <ReservationHeader />

      <ReservationStats />

      <ReservationContent
        reservations={reservations}
        events={events}
      />

    </main>

  );

}