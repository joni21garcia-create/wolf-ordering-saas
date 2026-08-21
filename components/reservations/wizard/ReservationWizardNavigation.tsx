"use client";

import { useReservationWizard } from "./ReservationWizardContext";

interface ReservationWizardNavigationProps {
  onConfirm?: () => void | Promise<void>;
  loading?: boolean;
}

export default function ReservationWizardNavigation({
  onConfirm,
  loading = false,
}: ReservationWizardNavigationProps) {
  const {
    currentStep,
    totalSteps,
    previous,
    next,
  } = useReservationWizard();

  const isLastStep =
    currentStep === totalSteps - 1;

  const handleNext = () => {
    if (isLastStep) {
      if (onConfirm) {
        return onConfirm();
      }

      return;
    }

    next();
  };

  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={previous}
        disabled={
          currentStep === 0 || loading
        }
        className="rounded-xl border border-zinc-300 bg-transparent px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-30"
      >
        Atrás
      </button>

      <button
        type="button"
        onClick={handleNext}
        disabled={loading}
        className="rounded-xl bg-zinc-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-900/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Guardando..."
          : isLastStep
            ? "Confirmar"
            : "Continuar"}
      </button>
    </div>
  );
}