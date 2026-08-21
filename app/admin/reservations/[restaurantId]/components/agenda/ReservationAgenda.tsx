"use client";

import {
  CalendarDays,
  ChevronDown,
  Clock3,
  ListFilter,
} from "lucide-react";

import ReservationAgendaHour from "./ReservationAgendaHour";
import ReservationAgendaEmpty from "./ReservationAgendaEmpty";

interface AgendaReservation {
  id: string;
  customer: string;
  table: string;
  guests: number;
  time: string;
  date: string;
  timezone?: string;
  status?: string;
}

interface ReservationAgendaProps {
  reservations?: AgendaReservation[];
  startHour?: number;
  endHour?: number;
}

function normalizeHour(value: string) {
  return value.slice(0, 5);
}

function getHour(value: string) {
  return `${value.slice(0, 2)}:00`;
}

function isOperationalStatus(status?: string) {
  return [
    "pending",
    "confirmed",
  ].includes(status ?? "");
}

function getTodayKey(timezone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone || "America/Guayaquil",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  ) as Record<string, string>;

  return `${values.year}-${values.month}-${values.day}`;
}

function buildHours(
  startHour: number,
  endHour: number
) {
  const hours: string[] = [];

  for (
    let hour = startHour;
    hour <= endHour;
    hour++
  ) {
    hours.push(
      `${String(hour).padStart(2, "0")}:00`
    );
  }

  return hours;
}

export default function ReservationAgenda({
  reservations = [],
  startHour = 9,
  endHour = 20,
}: ReservationAgendaProps) {
  const todayReservations =
    reservations.filter((reservation) =>
      reservation.date ===
        getTodayKey(
          reservation.timezone ||
            "America/Guayaquil"
        ) &&
      isOperationalStatus(reservation.status)
    );

  if (todayReservations.length === 0) {
    return <ReservationAgendaEmpty />;
  }

  const normalizedReservations =
    todayReservations
      .map((reservation) => ({
        ...reservation,
        time: normalizeHour(
          reservation.time
        ),
        status:
          reservation.status ??
          "pending",
      }))
      .sort(
        (a, b) =>
          a.time.localeCompare(b.time)
      );

  const hours = buildHours(
    startHour,
    endHour
  );

  /*
   * Solo mostramos horas que realmente tienen
   * reservas. Así evitamos una agenda larguísima
   * llena de "Sin reservas".
   */
  const occupiedHours = hours
    .map((hour) => ({
      hour,
      reservations:
        normalizedReservations.filter(
          (reservation) =>
            getHour(reservation.time) ===
            hour
        ),
    }))
    .filter(
      (group) =>
        group.reservations.length > 0
    );

  /*
   * Si una reserva cae fuera del rango configurado,
   * no la perdemos.
   */
  const extraGroups = Array.from(
    new Set(
      normalizedReservations
        .map((reservation) =>
          getHour(reservation.time)
        )
        .filter(
          (hour) =>
            !hours.includes(hour)
        )
    )
  )
    .sort()
    .map((hour) => ({
      hour,
      reservations:
        normalizedReservations.filter(
          (reservation) =>
            getHour(reservation.time) ===
            hour
        ),
    }));

  const groups = [
    ...occupiedHours,
    ...extraGroups,
  ].sort((a, b) =>
    a.hour.localeCompare(b.hour)
  );

  const totalReservations =
    normalizedReservations.length;

  return (
    <section
      className="
        overflow-hidden
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-950
        shadow-sm
      "
    >
      <header
        className="
          border-b
          border-zinc-800
          px-4
          py-4
          sm:px-8
          sm:py-6
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-orange-500/10
              text-orange-400
            "
          >
            <CalendarDays className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-white sm:text-2xl">
              Agenda del día
            </h2>

            <p className="mt-0.5 text-xs text-zinc-500 sm:text-sm">
              {totalReservations}{" "}
              {totalReservations === 1
                ? "reserva"
                : "reservas"}{" "}
              organizadas por hora
            </p>
          </div>

          <div
            className="
              hidden
              items-center
              gap-1.5
              rounded-full
              border
              border-zinc-800
              bg-zinc-900
              px-3
              py-1.5
              text-xs
              font-medium
              text-zinc-400
              sm:flex
            "
          >
            <ListFilter className="h-3.5 w-3.5" />
            {groups.length} horarios
          </div>
        </div>
      </header>

      <div className="divide-y divide-zinc-800">
        {groups.map(
          ({ hour, reservations: hourReservations }, index) => (
<ReservationAgendaHour
  key={hour}
  hour={hour}
  reservations={hourReservations}
/>
          )
        )}
      </div>
    </section>
  );
}