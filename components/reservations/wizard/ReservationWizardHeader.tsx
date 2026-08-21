"use client";

import {
  useReservationWizard,
} from "./ReservationWizardContext";

import ReservationWizardProgress from "./ReservationWizardProgress";

interface Props {
  title: string;
  subtitle?: string;
}

export default function ReservationWizardHeader({
  title,
  subtitle,
}: Props) {
  const {
    currentStep,
    totalSteps,
  } = useReservationWizard();

  return (
    <header className="space-y-4">

      <div className="min-w-0">

        <div className="flex items-center justify-between gap-3">

          <h2 className="truncate text-xl font-bold tracking-tight text-white sm:text-2xl">
            {title}
          </h2>

          <span className="shrink-0 rounded-full bg-orange-500/10 px-2.5 py-1 text-[11px] font-bold text-orange-400">
            {currentStep + 1}/{totalSteps}
          </span>

        </div>

        {subtitle ? (
          <p className="mt-1 text-sm leading-5 text-zinc-400">
            {subtitle}
          </p>
        ) : null}

      </div>

      <div className="space-y-2">

        <ReservationWizardProgress
          currentStep={currentStep}
          totalSteps={totalSteps}
        />

        <div className="flex items-center justify-between text-[11px] text-zinc-500">
          <span>
            Progreso
          </span>

          <span>
            {Math.round(
              ((currentStep + 1) /
                totalSteps) *
                100
            )}
            %
          </span>
        </div>

      </div>

    </header>
  );
}