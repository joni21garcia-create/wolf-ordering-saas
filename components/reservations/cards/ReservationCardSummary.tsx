"use client";

import { FileText, Package, Ticket } from "lucide-react";
import type { Reservation } from "@/types/reservations";

interface ReservationCardSummaryProps {
  reservation: Reservation;
}

export function ReservationCardSummary({
  reservation,
}: ReservationCardSummaryProps) {
  const services = reservation.services ?? [];

  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-zinc-400">
        <FileText className="h-3.5 w-3.5" />
        Resumen
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Info
          icon={<Package className="h-3.5 w-3.5" />}
          label="Servicios"
          value={String(services.length)}
        />

        <Info
          icon={<Ticket className="h-3.5 w-3.5" />}
          label="Código"
          value={reservation.confirmationCode || "—"}
        />
      </div>

      {reservation.customerNotes ? (
        <div className="mt-3 rounded-xl border border-zinc-200 bg-white p-3">
          <div className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">
            Nota
          </div>
          <p className="mt-1 text-sm leading-5 text-zinc-600">
            {reservation.customerNotes}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-xl bg-white px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-zinc-400">
        {icon}
        {label}
      </div>
      <div className="mt-1 truncate text-sm font-bold text-zinc-800">
        {value}
      </div>
    </div>
  );
}