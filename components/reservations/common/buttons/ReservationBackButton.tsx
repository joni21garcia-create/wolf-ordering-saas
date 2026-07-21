"use client";

import { ButtonHTMLAttributes } from "react";
import { ArrowLeft } from "lucide-react";
import ReservationButton from "./ReservationButton";

export interface ReservationBackButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export default function ReservationBackButton({
  label = "Volver",
  ...props
}: ReservationBackButtonProps) {
  return (
    <ReservationButton
      type="button"
      variant="ghost"
      leftIcon={<ArrowLeft className="h-4 w-4" />}
      {...props}
    >
      {label}
    </ReservationButton>
  );
}


