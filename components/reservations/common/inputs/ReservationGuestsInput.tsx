"use client";

import ReservationInput from "./ReservationInput";

export type ReservationGuestsInputProps =
  React.ComponentProps<typeof ReservationInput>;

export default function ReservationGuestsInput(
  props: ReservationGuestsInputProps
) {
  return (
    <ReservationInput
      type="number"
      min={1}
      max={100}
      placeholder="Número de personas"
      {...props}
    />
  );
}