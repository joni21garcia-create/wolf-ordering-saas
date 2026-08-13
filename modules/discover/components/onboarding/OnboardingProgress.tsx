"use client";

interface OnboardingProgressProps {
  current: number;
  total: number;
}

export function OnboardingProgress({ current, total }: OnboardingProgressProps) {
  return (
    <div className="fixed left-1/2 top-5 z-50 flex -translate-x-1/2 items-center gap-2">
      {Array.from({ length: total }).map((_, index) => {
        const active = index === current;
        const completed = index < current;

        return (
          <span
            key={index}
            className={[
              "block h-1.5 rounded-full transition-all duration-500 ease-out",
              active
                ? "w-8 bg-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.25)]"
                : completed
                  ? "w-2.5 bg-orange-400/75"
                  : "w-2.5 bg-white/15",
            ].join(" ")}
          />
        );
      })}
    </div>
  );
}
