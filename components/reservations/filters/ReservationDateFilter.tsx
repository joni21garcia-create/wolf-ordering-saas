"use client";

import ReservationDateInput from "../common/inputs/ReservationDateInput";

export interface ReservationDateFilterProps {
  value?: string;

  onChange?: (
    value: string
  ) => void;
}

export default function ReservationDateFilter({
  value = "",
  onChange,
}: ReservationDateFilterProps) {
  return (
    <ReservationDateInput
      value={value}
      onChange={(e) =>
        onChange?.(e.target.value)
      }
    />
  );
}

