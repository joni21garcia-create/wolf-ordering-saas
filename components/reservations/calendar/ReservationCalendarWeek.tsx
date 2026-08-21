"use client";

import type { ReservationCalendarEvent } from "@/types/reservations";
import { ReservationCalendarDay } from "./ReservationCalendarDay";

interface ReservationCalendarWeekProps {
  days: {
    date: string;
    events: ReservationCalendarEvent[];
  }[];
  onSelectReservation?: (reservationId: string) => void;
}

export function ReservationCalendarWeek({
  days,
  onSelectReservation,
}: ReservationCalendarWeekProps) {
  return (
    <div className="grid grid-cols-1 gap-2.5 md:grid-cols-7 md:gap-3">
      {days.map((day) => (
        <ReservationCalendarDay
          key={day.date}
          date={day.date}
          events={day.events}
          onSelectReservation={onSelectReservation}
        />
      ))}
    </div>
  );
}