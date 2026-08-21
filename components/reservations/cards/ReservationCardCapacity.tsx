"use client";

import { Users } from "lucide-react";

interface ReservationCardCapacityProps {
  guests: number;
  adults?: number;
  children?: number;
  babies?: number;
}

export function ReservationCardCapacity({
  guests,
  adults,
  children,
  babies,
}: ReservationCardCapacityProps) {
  const hasBreakdown =
    adults !== undefined ||
    children !== undefined ||
    babies !== undefined;

  return (
    <div className="rounded-xl bg-zinc-50 p-3">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-zinc-400">
        <Users className="h-3.5 w-3.5" />
        Capacidad
      </div>

      <div className="mt-1 text-sm font-bold text-zinc-900">
        {guests} {guests === 1 ? "persona" : "personas"}
      </div>

      {hasBreakdown ? (
        <div className="mt-1 text-[11px] text-zinc-500">
          {adults !== undefined ? `${adults} adultos` : null}
          {children !== undefined
            ? ` · ${children} niños`
            : null}
          {babies !== undefined ? ` · ${babies} bebés` : null}
        </div>
      ) : null}
    </div>
  );
}