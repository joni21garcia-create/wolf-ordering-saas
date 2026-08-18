"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

interface OnboardingNavigationProps {
  step: number;
  total: number;
  onBack: () => void;
  onNext: () => void;
}

export function OnboardingNavigation({
  step,
  total,
  onBack,
  onNext,
}: OnboardingNavigationProps) {
  const isFirst = step === 0;
  const isLast = step === total - 1;
  const isActivation = step === 3;

  const primaryLabel = isActivation
    ? "Ver planes"
    : isLast
      ? "Finalizar"
      : "Continuar";

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-3">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/90 to-transparent" />

      <div className="relative mx-auto flex w-full max-w-md items-center gap-3">
        {!isFirst && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] text-white/75 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/[0.07] hover:text-white active:scale-95"
          >
            <ArrowLeft size={18} strokeWidth={1.8} />
          </button>
        )}

        <button
          type="button"
          onClick={onNext}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-orange-300/20 bg-gradient-to-b from-orange-400 to-orange-500 px-6 text-[15px] font-semibold text-white shadow-[0_10px_32px_rgba(249,115,22,0.20)] transition-all hover:from-orange-300 hover:to-orange-400 active:scale-[0.985]"
        >
          <span>{primaryLabel}</span>
          <ArrowRight size={17} strokeWidth={1.9} />
        </button>
      </div>


    </div>
  );
}