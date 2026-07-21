"use client";

import ReservationSelect from "../common/inputs/ReservationSelect";
import {
  ReservationStatusType,
} from "../status/ReservationStatus";

export interface ReservationStatusFilterProps {
  value?: ReservationStatusType | "";

  onChange?: (
    value: ReservationStatusType | ""
  ) => void;
}

const options: {
  value: ReservationStatusType | "";
  label: string;
}[] = [
  {
    value: "",
    label: "Todos los estados",
  },
  {
    value: "pending",
    label: "Pendientes",
  },
  {
    value: "confirmed",
    label: "Confirmadas",
  },
  {
    value: "cancelled",
    label: "Canceladas",
  },
  {
    value: "completed",
    label: "Completadas",
  },
  {
    value: "rejected",
    label: "Rechazadas",
  },
];

export default function ReservationStatusFilter({
  value = "",
  onChange,
}: ReservationStatusFilterProps) {
  return (
    <ReservationSelect
      value={value}
      onChange={(e) =>
        onChange?.(
          e.target.value as ReservationStatusType | ""
        )
      }
    >
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </ReservationSelect>
  );
}

