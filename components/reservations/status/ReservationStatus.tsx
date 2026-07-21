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

const styles = {
  pending:
    "bg-yellow-100 text-yellow-700",

  confirmed:
    "bg-green-100 text-green-700",

  cancelled:
    "bg-red-100 text-red-700",

  completed:
    "bg-blue-100 text-blue-700",

  rejected:
    "bg-zinc-100 text-zinc-700",
};

export default function ReservationStatus({
  status,
  className,
}: ReservationStatusProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        styles[status],
        className
      )}
    >
      {status}
    </span>
  );
}

