"use client";

import {
  Users,
  Clock3,
  UtensilsCrossed,
} from "lucide-react";

interface ReservationAgendaCardProps {

  customer: string;

  table: string;

  guests: number;

  time: string;

  status?:
    | "confirmed"
    | "pending"
    | "checked_in"
    | "completed";

}

export default function ReservationAgendaCard({

  customer,

  table,

  guests,

  time,

  status = "confirmed",

}: ReservationAgendaCardProps) {

  const colors = {

    confirmed:
      "border-emerald-500 bg-emerald-500/10",

    pending:
      "border-yellow-500 bg-yellow-500/10",

    checked_in:
      "border-blue-500 bg-blue-500/10",

    completed:
      "border-zinc-600 bg-zinc-700/30",

  };

  return (

    <div
      className={`
        rounded-xl
        border-l-4
        p-4
        transition-all
        hover:scale-[1.02]
        hover:shadow-lg
        cursor-pointer
        ${colors[status]}
      `}
    >

      <div className="flex items-center justify-between">

        <h3 className="font-semibold text-white">

          {customer}

        </h3>

        <span className="text-xs text-zinc-400">

          {time}

        </span>

      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-sm text-zinc-300">

        <div className="flex items-center gap-1">

          <UtensilsCrossed className="h-4 w-4" />

          {table}

        </div>

        <div className="flex items-center gap-1">

          <Users className="h-4 w-4" />

          {guests}

        </div>

        <div className="flex items-center gap-1">

          <Clock3 className="h-4 w-4" />

          {time}

        </div>

      </div>

    </div>

  );

}