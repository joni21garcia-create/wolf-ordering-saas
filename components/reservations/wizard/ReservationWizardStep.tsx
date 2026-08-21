"use client";

import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function ReservationWizardStep({
  children,
}: Props) {
  return (
    <section
      aria-label="Paso de reserva"
      className="space-y-5 sm:space-y-6"
    >
      {children}
    </section>
  );
}