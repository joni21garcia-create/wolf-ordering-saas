"use client";

import { useState } from "react";

import { OnboardingProgress } from "./OnboardingProgress";
import { OnboardingNavigation } from "./OnboardingNavigation";

import { OwnAppScreen } from "./screens/OwnAppScreen";
import { DirectOrdersScreen } from "./screens/DirectOrdersScreen";
import { WolfEcosystemScreen } from "./screens/WolfEcosystemScreen";
import { ActivationScreen } from "./screens/ActivationScreen";
import { PlansScreen } from "./plans/PlansScreen";

import type { RestaurantOnboardingProps } from "./types";

const TOTAL_STEPS = 5;

export function RestaurantOnboarding({
  onComplete,
  onClose,
}: RestaurantOnboardingProps) {
  const [step, setStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "pro" | null>(
    null,
  );

  const next = () => {
    if (step === TOTAL_STEPS - 1) {
      return;
    }

    setStep((current) => Math.min(current + 1, TOTAL_STEPS - 1));
  };

  const back = () => {
    if (step === 0) {
      onClose?.();
      return;
    }

    setStep((current) => Math.max(current - 1, 0));
  };

  /**
   * Punto único de entrada para la futura integración de pago.
   *
   * Aquí NO llamamos PayPal todavía.
   * Cuando conectemos el checkout:
   *
   *   PRO    -> createPayPalCheckout("pro")
   *   BÁSICO -> createPayPalCheckout("basic")
   *
   * La selección queda guardada en selectedPlan para que el checkout
   * reciba exactamente el plan elegido.
   */
  const handlePlanSelect = (plan: "basic" | "pro") => {
    setSelectedPlan(plan);

    console.log("[ONBOARDING PLAN SELECTED]", {
      plan,
      source: "restaurant-onboarding",
    });

    // TODO(PAYPAL):
    // iniciar aquí el checkout correspondiente al plan seleccionado.
    //
    // Ejemplo futuro:
    // await startPayPalCheckout({ plan });
  };

  const handlePlansBack = () => {
    setSelectedPlan(null);
    back();
  };

  return (
    <main className="relative min-h-dvh overflow-hidden bg-black text-white">
      <OnboardingProgress
        current={step}
        total={TOTAL_STEPS}
      />

      <div className="relative min-h-dvh">
        {step === 0 && <OwnAppScreen />}

        {step === 1 && <DirectOrdersScreen />}

        {step === 2 && <WolfEcosystemScreen />}

        {step === 3 && <ActivationScreen />}

        {step === 4 && (
          <PlansScreen
            selectedPlan={selectedPlan}
            onSelectPlan={handlePlanSelect}
            onBack={handlePlansBack}
          />
        )}
      </div>

      {/* En Planes NO mostramos la navegación global.
          La pantalla de planes controla sus propios CTA. */}
      {step !== 4 && (
        <OnboardingNavigation
          step={step}
          total={TOTAL_STEPS}
          onBack={back}
          onNext={next}
        />
      )}
    </main>
  );
}