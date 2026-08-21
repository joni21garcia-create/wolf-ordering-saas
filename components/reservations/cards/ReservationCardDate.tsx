"use client";

import { CalendarDays, Clock3 } from "lucide-react";

interface ReservationCardDateProps {
  date: string;
  startTime: string;
  endTime: string;
}

export function ReservationCardDate({
  date,
  startTime,
  endTime,
}: ReservationCardDateProps) {
  return (
    <div className="rounded-xl bg-zinc-50 p-3">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-zinc-400">
        <CalendarDays className="h-3.5 w-3.5" />
        Fecha y horario
      </div>

      <div className="mt-1 text-sm font-bold text-zinc-900">
        {date}
      </div>

      <div className="mt-0.5 flex items-center gap-1 text-xs font-medium text-zinc-600">
        <Clock3 className="h-3.5 w-3.5" />
        {startTime} – {endTime}
      </div>
    </div>
  );
}