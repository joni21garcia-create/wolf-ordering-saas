"use client";

import ReservationAgendaHour from "./ReservationAgendaHour";
import ReservationAgendaEmpty from "./ReservationAgendaEmpty";

interface AgendaReservation {
  id: string;
  customer: string;
  table: string;
  guests: number;
  time: string;
  status?:
    | "confirmed"
    | "pending"
    | "checked_in"
    | "completed";
}

interface ReservationAgendaProps {
  reservations?: AgendaReservation[];
}

export default function ReservationAgenda({
  reservations = [],
}: ReservationAgendaProps) {

  if (reservations.length === 0) {
    return <ReservationAgendaEmpty />;
  }

  const hours = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
  ];

  return (

    <section className="rounded-2xl border border-zinc-800 bg-zinc-950/70 overflow-hidden">

      <div className="border-b border-zinc-800 px-8 py-6">

        <h2 className="text-2xl font-bold text-white">
          Agenda del día
        </h2>

        <p className="mt-2 text-zinc-400">
          Visualiza todas las reservas organizadas por horario.
        </p>

      </div>

      <div className="p-8">

        {hours.map((hour) => (

          <ReservationAgendaHour
            key={hour}
            hour={hour}
            reservations={reservations.filter(
              (r) => r.time === hour
            )}
          />

        ))}

      </div>

    </section>

  );

}