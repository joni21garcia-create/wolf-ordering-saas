"use client";

import ReservationInput from "./ReservationInput";

export type ReservationPhoneInputProps =
  React.ComponentProps<typeof ReservationInput>;

export default function ReservationPhoneInput(
  props: ReservationPhoneInputProps
) {
  return (
    <ReservationInput
      type="tel"
      autoComplete="tel"
      placeholder="+593 999 999 999"
      {...props}
    />
  );
}