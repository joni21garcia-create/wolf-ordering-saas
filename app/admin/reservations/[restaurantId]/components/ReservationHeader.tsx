"use client";

import { CalendarDays, Plus } from "lucide-react";

interface ReservationHeaderProps {
  onNewReservation?: () => void;
}

export default function ReservationHeader({
  onNewReservation,
}: ReservationHeaderProps) {
  const today = new Date().toLocaleDateString("es-EC", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section
      className="
        flex
        flex-col
        gap-6
        lg:flex-row
        lg:items-center
        lg:justify-between
      "
    >
      <div>
        <div
          className="
            flex
            items-center
            gap-2
            text-orange-400
          "
        >
          <CalendarDays className="h-5 w-5" />

          <span
            className="
              text-sm
              font-medium
              capitalize
            "
          >
            {today}
          </span>
        </div>

        <h1
          className="
            mt-3
            text-4xl
            font-bold
            tracking-tight
            text-white
          "
        >
          Reservas
        </h1>

        <p
          className="
            mt-2
            max-w-2xl
            text-zinc-400
          "
        >
          Gestiona reservas, disponibilidad de mesas, clientes,
          confirmaciones y toda la operación del restaurante desde un solo
          lugar.
        </p>
      </div>

      <button
        type="button"
        onClick={onNewReservation}
        className="
          inline-flex
          items-center
          gap-2
          rounded-xl
          bg-orange-500
          px-6
          py-3
          text-sm
          font-semibold
          text-white
          shadow-lg
          transition-all
          duration-200
          hover:bg-orange-600
          hover:shadow-orange-500/30
          active:scale-95
        "
      >
        <Plus className="h-5 w-5" />

        Nueva reserva
      </button>
    </section>
  );
}