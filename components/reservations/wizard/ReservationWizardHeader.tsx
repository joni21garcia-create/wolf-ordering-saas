"use client";

import { useReservationWizard } from "./ReservationWizardContext";
import ReservationWizardProgress from "./ReservationWizardProgress";

interface Props {
  title: string;
  subtitle?: string;
}

export default function ReservationWizardHeader({
  title,
  subtitle,
}: Props) {
  const { currentStep, totalSteps } = useReservationWizard();

  return (
    <header className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-1 text-sm text-zinc-500">
            {subtitle}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <ReservationWizardProgress
          currentStep={currentStep}
          totalSteps={totalSteps}
        />

        <p className="text-xs text-zinc-500">
          Paso {currentStep + 1} de {totalSteps}
        </p>
      </div>
    </header>
  );
}


