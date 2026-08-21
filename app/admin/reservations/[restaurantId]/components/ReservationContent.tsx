"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

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
  calendarDate?: string;
  onSelectReservation?: (reservationId: string) => void;
}

export default function ReservationContent({
  reservations = [],
  events = [],
  calendarDate,
  onSelectReservation,
}: ReservationContentProps) {
  const router = useRouter();

  // Mantiene la pantalla sincronizada sin que el usuario tenga que pulsar F5.
  // router.refresh() vuelve a pedir los datos del Server Component actual.
  useEffect(() => {
    let active = true;

    const refresh = () => {
      if (!active || document.visibilityState !== "visible") return;
      router.refresh();
    };

    const interval = window.setInterval(refresh, 5000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [router]);

  // El calendario necesita un `end` real para poder pintar la altura del bloque.
  // Si el mapper original no lo envía, lo reconstruimos desde la reserva.
  const calendarEvents = events.map((event) => {
    const reservation = reservations.find(
      (item) => item.id === event.reservationId
    );

    if (!reservation || event.end) return event;

    const date = reservation.datetime.date;
    const endTime = reservation.datetime.endTime;

    if (!date || !endTime) return event;

    const startMatch = event.start.match(/^\d{4}-\d{2}-\d{2}/);
    const eventDate = startMatch?.[0] ?? date;
    const hasTimezone = /[+-]\d{2}:?\d{2}$/.test(event.start);

    return {
      ...event,
      end: hasTimezone
        ? `${eventDate}T${endTime}${event.start.slice(-6)}`
        : `${eventDate}T${endTime}`,
    };
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="grid gap-4 sm:gap-6 xl:grid-cols-[minmax(0,2fr)_380px]">
        <ReservationCalendar
          events={calendarEvents}
          date={
            calendarDate ??
            new Date().toISOString().slice(0, 10)
          }
          onSelectReservation={onSelectReservation}
        />

        <ReservationUpcoming
          reservations={reservations}
          onSelectReservation={onSelectReservation}
        />
      </section>

      <ReservationAgenda
        reservations={reservations.map((reservation) => {
          const tables =
            reservation.assignment?.tables
              ?.map((table) => table.name)
              .filter(Boolean) ?? [];

          return {
            id: reservation.id,
            customer:
              reservation.guest.fullName || "Sin nombre",
            table:
              tables.length > 0
                ? tables.join(", ")
                : "Sin asignar",
            guests: reservation.capacity.guests ?? 0,
            time: reservation.datetime.startTime,
            date: reservation.datetime.date,
            timezone:
              reservation.datetime.timezone ||
              "America/Guayaquil",
            status: reservation.status,
          };
        })}
      />

      <ReservationTable reservations={reservations} />
    </div>
  );
}
