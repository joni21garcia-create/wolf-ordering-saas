"use client";

import { Armchair, Users } from "lucide-react";

interface ReservationCardTableProps {
  table?: {
    id: string;
    code?: string;
    name?: string;
    capacity?: number;
    zone?: string;
  };
}

export function ReservationCardTable({
  table,
}: ReservationCardTableProps) {
  return (
    <div className="rounded-xl bg-zinc-50 p-3">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-zinc-400">
        <Armchair className="h-3.5 w-3.5" />
        Mesa asignada
      </div>

      {table ? (
        <>
          <div className="mt-1 truncate text-sm font-bold text-zinc-900">
            {table.name ?? table.code ?? "Mesa"}
          </div>

          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-zinc-500">
            {table.zone ? <span>Zona {table.zone}</span> : null}
            {table.capacity ? (
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                Capacidad {table.capacity}
              </span>
            ) : null}
          </div>
        </>
      ) : (
        <div className="mt-1 text-xs font-medium text-zinc-500">
          Sin mesa asignada
        </div>
      )}
    </div>
  );
}