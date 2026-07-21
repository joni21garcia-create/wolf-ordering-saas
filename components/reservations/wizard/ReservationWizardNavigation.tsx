"use client";

import { useReservationWizard } from "./ReservationWizardContext";

export default function ReservationWizardNavigation() {
  const {
    currentStep,
    totalSteps,
    previous,
    next,
  } = useReservationWizard();

  return (
    <div className="flex items-center justify-between">
      <button
        onClick={previous}
        disabled={currentStep === 0}
        className="rounded-xl border px-5 py-3 disabled:opacity-40"
      >
        Atrás
      </button>

      <button
        onClick={next}
        className="rounded-xl bg-orange-500 px-5 py-3 font-medium text-white"
      >
        {currentStep === totalSteps - 1
          ? "Confirmar"
          : "Siguiente"}
      </button>
    </div>
  );
}


