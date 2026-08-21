"use client";

import clsx from "clsx";

export type ReservationStatusType =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "rejected";

export interface ReservationStatusProps {
  status: ReservationStatusType;
  className?: string;
}

const styles: Record<ReservationStatusType, string> = {
  pending:
    "border-amber-200 bg-amber-50 text-amber-700",
  confirmed:
    "border-emerald-200 bg-emerald-50 text-emerald-700",
  cancelled:
    "border-red-200 bg-red-50 text-red-700",
  completed:
    "border-blue-200 bg-blue-50 text-blue-700",
  rejected:
    "border-zinc-200 bg-zinc-50 text-zinc-600",
};

const labels: Record<ReservationStatusType, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
  completed: "Completada",
  rejected: "Rechazada",
};

export default function ReservationStatus({
  status,
  className,
}: ReservationStatusProps) {
  return (
    <span
      className={clsx(
        "inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1",
        "text-[10px] font-bold leading-none sm:text-xs",
        className,
        styles[status]
      )}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-70"
      />
      <span className="truncate">
        {labels[status]}
      </span>
    </span>
  );
}