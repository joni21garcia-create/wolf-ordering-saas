"use client";

import ReservationAgendaCard from "./ReservationAgendaCard";

interface ReservationAgendaHourProps {

  hour: string;

  reservations?: {

    id: string;

    customer: string;

    table: string;

    guests: number;

    time: string;

    status:
      | "confirmed"
      | "pending"
      | "checked_in"
      | "completed";

  }[];

}

export default function ReservationAgendaHour({

  hour,

  reservations = [],

}: ReservationAgendaHourProps) {

  return (

    <div
      className="
        grid
        grid-cols-[90px_1fr]
        gap-6
        border-b
        border-zinc-800
        py-6
      "
    >

      <div
        className="
          text-lg
          font-semibold
          text-zinc-400
        "
      >
        {hour}
      </div>

      <div className="space-y-3">

        {

          reservations.length === 0

            ? (

              <div
                className="
                  rounded-xl
                  border
                  border-dashed
                  border-zinc-700
                  py-5
                  text-center
                  text-sm
                  text-zinc-500
                "
              >

                Sin reservas

              </div>

            )

            : (

              reservations.map(

                reservation => (

                  <ReservationAgendaCard

                    key={reservation.id}

                    customer={reservation.customer}

                    table={reservation.table}

                    guests={reservation.guests}

                    time={reservation.time}

                    status={reservation.status}

                  />

                )

              )

            )

        }

      </div>

    </div>

  );

}