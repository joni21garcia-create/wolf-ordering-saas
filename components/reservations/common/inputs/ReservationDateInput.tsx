"use client";

import ReservationInput from "./ReservationInput";

export type ReservationDateInputProps =
  React.ComponentProps<typeof ReservationInput>;

export default function ReservationDateInput(
  props: ReservationDateInputProps
) {
  return (
    <ReservationInput
      type="date"
      {...props}
    />
  );
}


