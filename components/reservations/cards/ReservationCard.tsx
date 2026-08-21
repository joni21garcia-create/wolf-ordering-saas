"use client";

import type { Reservation } from "@/types/reservations";
import { ReservationTableStatus } from "../tables";
import {
  CalendarDays,
  ChevronRight,
  Clock3,
  Users,
} from "lucide-react";

interface ReservationCardProps {
  reservation: Reservation;
  onClick?: (reservation: Reservation) => void;
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("es-EC", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(date)
    .replace(".", "");
}

function formatTime(value?: string | null) {
  return value ? value.slice(0, 5) : "--:--";
}

export function ReservationCard({
  reservation,
  onClick,
}: ReservationCardProps) {
  const guestName = reservation.guest?.fullName || "Sin nombre";
  const guests = reservation.capacity?.guests ?? 0;
  const date = formatDate(reservation.datetime?.date);
  const start = formatTime(reservation.datetime?.startTime);
  const end = formatTime(reservation.datetime?.endTime);
  const tables = reservation.assignment?.tables ?? [];
  const tableText =
    tables.length > 0
      ? tables.map((table) => table.name || "Mesa").join(", ")
      : "Sin mesa";

  return (
    <button
      type="button"
      onClick={() => onClick?.(reservation)}
      className="
        group w-full rounded-2xl border border-zinc-200
        bg-white p-4 text-left shadow-sm
        transition hover:-translate-y-0.5 hover:border-zinc-300
        hover:shadow-md focus:outline-none
        focus-visible:ring-2 focus-visible:ring-orange-500/30
        sm:p-5
      "
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
          <CalendarDays className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-zinc-900 sm:text-base">
                {guestName}
              </h3>

              <p className="mt-0.5 truncate text-xs text-zinc-500">
                {date}
              </p>
            </div>

            <ReservationTableStatus status={reservation.status} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            <Info
              icon={<Clock3 className="h-3.5 w-3.5" />}
              label="Horario"
              value={`${start} – ${end}`}
            />

            <Info
              icon={<Users className="h-3.5 w-3.5" />}
              label="Personas"
              value={String(guests)}
            />

            <Info
              label="Mesa"
              value={tableText}
              className="col-span-2 sm:col-span-1"
            />
          </div>

          {reservation.confirmationCode ? (
            <div className="mt-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-400">
              {reservation.confirmationCode}
            </div>
          ) : null}
        </div>

        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-zinc-300 transition group-hover:translate-x-0.5 group-hover:text-zinc-500" />
      </div>
    </button>
  );
}

function Info({
  icon,
  label,
  value,
  className = "",
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`min-w-0 rounded-xl bg-zinc-50 px-3 py-2 ${className}`}>
      <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
        {icon}
        {label}
      </div>
      <div className="mt-0.5 truncate text-xs font-semibold text-zinc-800">
        {value}
      </div>
    </div>
  );
}