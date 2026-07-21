"use client";

import { ReservationStatusType } from "./ReservationStatus";

interface Props {
  status: ReservationStatusType;
}

const labels: Record<ReservationStatusType, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
  completed: "Completada",
  rejected: "Rechazada",
};

export default function ReservationStatusLabel({
  status,
}: Props) {
  return (
    <span>
      {labels[status]}
    </span>
  );
}

