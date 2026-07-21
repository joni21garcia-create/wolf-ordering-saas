"use client";

import ReservationInput from "./ReservationInput";

export type ReservationTimeInputProps =
  React.ComponentProps<typeof ReservationInput>;

export default function ReservationTimeInput(
  props: ReservationTimeInputProps
) {
  return (
    <ReservationInput
      type="time"
      {...props}
    />
  );
}


