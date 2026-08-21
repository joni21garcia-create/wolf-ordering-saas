"use client";

import { CalendarDays, Search, SlidersHorizontal } from "lucide-react";
import type { ReservationStatus } from "@/types/reservations";
import { RESERVATION_STATUS_LABELS } from "@/constants/reservations/reservation-status";

interface ReservationTableFiltersProps {
  status?: ReservationStatus;
  date?: string;
  search?: string;
  onStatusChange?: (status?: ReservationStatus) => void;
  onDateChange?: (date?: string) => void;
  onSearchChange?: (search?: string) => void;
}

export function ReservationTableFilters({
  status,
  date,
  search,
  onStatusChange,
  onDateChange,
  onSearchChange,
}: ReservationTableFiltersProps) {
  return (
    <details className="group rounded-2xl border border-zinc-200 bg-white md:open">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-semibold text-zinc-800 [&::-webkit-details-marker]:hidden">
        <SlidersHorizontal className="h-4 w-4 text-orange-500" />
        <span>Filtros</span>
        <span className="ml-auto text-xs font-normal text-zinc-400 group-open:hidden md:hidden">
          Buscar, fecha y estado
        </span>
      </summary>

      <div className="grid gap-2 border-t border-zinc-100 p-3 sm:grid-cols-3 md:border-t-0 md:p-4">
        <label className="relative sm:col-span-1">
          <span className="sr-only">Buscar cliente</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            value={search ?? ""}
            onChange={(e) =>
              onSearchChange?.(e.target.value || undefined)
            }
            placeholder="Buscar cliente..."
            className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-500/10"
          />
        </label>

        <label className="relative">
          <span className="sr-only">Filtrar por fecha</span>
          <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="date"
            value={date ?? ""}
            onChange={(e) =>
              onDateChange?.(e.target.value || undefined)
            }
            className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-sm text-zinc-900 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-500/10"
          />
        </label>

        <label>
          <span className="sr-only">Filtrar por estado</span>
          <select
            value={status ?? ""}
            onChange={(e) =>
              onStatusChange?.(
                e.target.value
                  ? (e.target.value as ReservationStatus)
                  : undefined
              )
            }
            className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-500/10"
          >
            <option value="">Todos los estados</option>
            {Object.entries(RESERVATION_STATUS_LABELS).map(
              ([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              )
            )}
          </select>
        </label>
      </div>
    </details>
  );
}