"use client";

import { Mail, Phone, UserRound } from "lucide-react";
import type { ReservationGuest } from "@/types/reservations";

interface ReservationCardGuestProps {
  guest: ReservationGuest;
}

export function ReservationCardGuest({
  guest,
}: ReservationCardGuestProps) {
  return (
    <div className="rounded-xl bg-zinc-50 p-3">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-zinc-400">
        <UserRound className="h-3.5 w-3.5" />
        Cliente
      </div>

      <div className="mt-1 truncate text-sm font-bold text-zinc-900">
        {guest.fullName || "Sin nombre"}
      </div>

      {guest.phone ? (
        <div className="mt-1 flex items-center gap-1 text-xs text-zinc-600">
          <Phone className="h-3 w-3" />
          <span className="truncate">{guest.phone}</span>
        </div>
      ) : null}

      {guest.email ? (
        <div className="mt-1 flex items-center gap-1 text-[11px] text-zinc-500">
          <Mail className="h-3 w-3" />
          <span className="truncate">{guest.email}</span>
        </div>
      ) : null}
    </div>
  );
}