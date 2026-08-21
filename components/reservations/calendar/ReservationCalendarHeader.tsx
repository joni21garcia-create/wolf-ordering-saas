"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

interface ReservationCalendarHeaderProps {
  date: string;
  onDateChange?: (date: string) => void;
}

function parseDate(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return new Date();

  return new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3])
  );
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(value: string) {
  const date = parseDate(value);

  return new Intl.DateTimeFormat("es-EC", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

export function ReservationCalendarHeader({
  date,
  onDateChange,
}: ReservationCalendarHeaderProps) {
  function changeDate(days: number) {
    const next = parseDate(date);
    next.setDate(next.getDate() + days);
    onDateChange?.(toDateKey(next));
  }

  return (
    <header className="flex items-center gap-2 border-b border-zinc-200 bg-white px-3 py-3 sm:px-4">
      <button
        type="button"
        onClick={() => changeDate(-1)}
        aria-label="Día anterior"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-200 text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30 active:scale-95"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="min-w-0 flex-1 text-center">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-orange-500">
          <CalendarDays className="h-3.5 w-3.5" />
          Reservas
        </div>
        <h2 className="truncate text-sm font-bold capitalize text-zinc-900 sm:text-base">
          {formatDate(date)}
        </h2>
      </div>

      <button
        type="button"
        onClick={() => changeDate(1)}
        aria-label="Día siguiente"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-200 text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30 active:scale-95"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </header>
  );
}