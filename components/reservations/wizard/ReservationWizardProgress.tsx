"use client";

interface Props {
  currentStep: number;
  totalSteps: number;
}

export default function ReservationWizardProgress({
  currentStep,
  totalSteps,
}: Props) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full">
      <div className="h-2 overflow-hidden rounded-full bg-zinc-200">
        <div
          className="h-full rounded-full bg-orange-500 transition-all duration-300"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}


