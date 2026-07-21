"use client";

import { Check } from "lucide-react";
import { ButtonHTMLAttributes } from "react";
import ReservationButton from "./ReservationButton";

export interface ReservationSubmitButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;

  loadingText?: string;

  label?: string;

  fullWidth?: boolean;
}

export default function ReservationSubmitButton({
  loading = false,
  loadingText = "Guardando...",
  label = "Guardar",
  fullWidth = false,
  ...props
}: ReservationSubmitButtonProps) {
  return (
    <ReservationButton
      type="submit"
      variant="primary"
      loading={loading}
      fullWidth={fullWidth}
      leftIcon={!loading ? <Check className="h-4 w-4" /> : undefined}
      {...props}
    >
      {loading ? loadingText : label}
    </ReservationButton>
  );
}


