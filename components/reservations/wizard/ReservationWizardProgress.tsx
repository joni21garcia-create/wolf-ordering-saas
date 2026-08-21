"use client";

interface Props {
  currentStep: number;
  totalSteps: number;
}

export default function ReservationWizardProgress({
  currentStep,
  totalSteps,
}: Props) {
  const safeTotalSteps = Math.max(1, totalSteps);
  const safeStep = Math.min(
    Math.max(currentStep, 0),
    safeTotalSteps - 1
  );
  const progress =
    ((safeStep + 1) / safeTotalSteps) * 100;

  return (
    <div
      role="progressbar"
      aria-label="Progreso de la reserva"
      aria-valuemin={1}
      aria-valuemax={safeTotalSteps}
      aria-valuenow={safeStep + 1}
      className="w-full"
    >
      <div className="h-1 overflow-hidden rounded-full bg-zinc-200">
        <div
          className="h-full rounded-full bg-[#d65a1f] transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}