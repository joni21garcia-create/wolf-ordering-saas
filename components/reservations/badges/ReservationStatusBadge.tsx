"use client";

import ReservationBadge from "./ReservationBadge";
import ReservationStatusLabel from "../status/ReservationStatusLabel";
import {
  ReservationStatusType,
} from "../status/ReservationStatus";

interface Props {
  status: ReservationStatusType;

  className?: string;
}

const variants = {
  pending: "warning",
  confirmed: "success",
  cancelled: "danger",
  completed: "info",
  rejected: "default",
} as const;

export default function ReservationStatusBadge({
  status,
  className,
}: Props) {
  return (
    <ReservationBadge
      variant={variants[status]}
      className={className}
    >
      <ReservationStatusLabel
        status={status}
      />
    </ReservationBadge>
  );
}

