"use client";

import type { ReactNode } from "react";

import ReservationCard from "../common/layouts/ReservationCard";
import { ReservationWizardProvider } from "./ReservationWizardContext";

interface Props {
  children: ReactNode;
  totalSteps: number;
}

export default function ReservationWizard({
  children,
  totalSteps,
}: Props) {
  return (
    <ReservationWizardProvider totalSteps={totalSteps}>
      <ReservationCard
        className="
          w-full
          space-y-6
          overflow-hidden
          rounded-[26px]
          border border-zinc-200
          bg-[#f8f7f4]
          text-zinc-950
          shadow-[0_18px_55px_rgba(24,24,27,0.08)]
          px-4 py-5
          sm:space-y-8
          sm:px-7 sm:py-7
          lg:px-9 lg:py-8
        "
      >
        {children}
      </ReservationCard>
    </ReservationWizardProvider>
  );
}