"use client";

import type { ReservationCalendarEvent as ReservationEventType } from "@/types/reservations";
import { Clock, MapPin, Users } from "lucide-react";

interface ReservationCalendarEventProps {
  event: ReservationEventType;
  onClick?: (reservationId: string) => void;
}

const STATUS_LABELS: Record<string, string> = {
  confirmed: "Confirmada",
  pending: "Pendiente",
  checked_in: "Check-in",
  completed: "Finalizada",
  cancelled: "Cancelada",
  no_show: "No Show",
};

const STATUS_CLASSES: Record<string, string> = {
  confirmed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  checked_in: "border-blue-200 bg-blue-50 text-blue-700",
  completed: "border-zinc-200 bg-zinc-100 text-zinc-600",
  cancelled: "border-red-200 bg-red-50 text-red-700",
  no_show: "border-purple-200 bg-purple-50 text-purple-700",
};

function statusLabel(status?: string) {
  return STATUS_LABELS[status ?? ""] ?? status ?? "Pendiente";
}

function formatTime(value?: string | null) {
  if (!value) return "--:--";
  const match = value.match(/(?:T|\s)(\d{2}):(\d{2})/);
  return match ? `${match[1]}:${match[2]}` : value.slice(0, 5);
}

export function ReservationCalendarEvent({
  event,
  onClick,
}: ReservationCalendarEventProps) {
  const tables = event.tableNames?.filter(Boolean) ?? [];
  const time = formatTime(event.start);
  const end = formatTime(event.end);
  const status = event.status ?? "pending";

  return (
    <button
      type="button"
      onClick={() => onClick?.(event.reservationId)}
      className="
        group w-full rounded-xl border border-zinc-200 bg-white
        p-3 text-left shadow-sm transition
        hover:-translate-y-px hover:border-zinc-300 hover:shadow-md
        focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40
        active:scale-[0.995]
      "
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-zinc-900">
            {event.guestName ?? event.title ?? "Sin nombre"}
          </p>
          {event.typeName ? (
            <p className="mt-0.5 truncate text-[11px] text-zinc-500">
              {event.typeName}
            </p>
          ) : null}
        </div>

        <span
          className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-bold ${STATUS_CLASSES[status] ?? "border-zinc-200 bg-zinc-50 text-zinc-600"}`}
        >
          {statusLabel(status)}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-zinc-500">
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {time}
          {end !== "--:--" ? ` – ${end}` : ""}
        </span>

        <span className="inline-flex items-center gap-1">
          <Users className="h-3 w-3" />
          {event.guests ?? 0}
        </span>

        {tables.length ? (
          <span className="inline-flex min-w-0 items-center gap-1">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{tables.join(", ")}</span>
          </span>
        ) : null}
      </div>
    </button>
  );
}