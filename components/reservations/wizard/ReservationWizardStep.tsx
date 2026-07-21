"use client";

import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function ReservationWizardStep({
  children,
}: Props) {
  return (
    <section className="space-y-6">
      {children}
    </section>
  );
}


