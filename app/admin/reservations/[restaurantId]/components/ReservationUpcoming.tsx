"use client";

import { Clock, Users } from "lucide-react";
import type { Reservation } from "@/types/reservations";

import ReservationUpcomingEmpty from "./empty/ReservationUpcomingEmpty";

interface ReservationUpcomingProps {
  reservations: Reservation[];
}

export default function ReservationUpcoming({
  reservations,
}: ReservationUpcomingProps) {
  if (!reservations.length) {
    return <ReservationUpcomingEmpty />;
  }

  return (
    <aside className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">

      <div className="border-b border-zinc-800 p-5">

        <h2 className="text-lg font-semibold text-white">
          Próximas reservas
        </h2>

        <p className="mt-1 text-sm text-zinc-400">
          Hoy
        </p>

      </div>

      <div className="divide-y divide-zinc-800">

        {reservations.map((reservation) => (

          <button
            key={reservation.id}
            className="
              flex
              w-full
              flex-col
              gap-3
              p-5
              text-left
              transition
              hover:bg-zinc-800/60
            "
          >

            <div className="flex items-center justify-between">

              <span className="font-semibold text-white">
                {reservation.customerName}
              </span>

              <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-400">
                {reservation.status}
              </span>

            </div>

            <div className="flex items-center gap-2 text-sm text-zinc-400">

              <Clock className="h-4 w-4" />

              {reservation.time}

            </div>

            <div className="flex items-center gap-2 text-sm text-zinc-400">

              <Users className="h-4 w-4" />

              {reservation.partySize} personas

            </div>

          </button>

        ))}

      </div>

    </aside>
  );
}
