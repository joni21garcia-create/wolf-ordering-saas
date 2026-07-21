"use client";

import { ReactNode } from "react";
import ReservationCard from "../common/layouts/ReservationCard";
import {
  ReservationWizardProvider,
} from "./ReservationWizardContext";

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
      <ReservationCard className="space-y-8">
        {children}
      </ReservationCard>
    </ReservationWizardProvider>
  );
}


