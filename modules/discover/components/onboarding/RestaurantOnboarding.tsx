"use client";

import { useEffect, useState } from "react";

import { OnboardingProgress } from "./OnboardingProgress";
import { OnboardingNavigation } from "./OnboardingNavigation";

import { OwnAppScreen } from "./screens/OwnAppScreen";
import { DirectOrdersScreen } from "./screens/DirectOrdersScreen";
import { WolfEcosystemScreen } from "./screens/WolfEcosystemScreen";
import { ActivationScreen } from "./screens/ActivationScreen";
import { PlansScreen } from "./plans/PlansScreen";
import { SubscriptionSuccessScreen } from "./screens/SubscriptionSuccessScreen";
import { RequestSubmittedScreen } from "./screens/RequestSubmittedScreen";
import {
  RestaurantInfoScreen,
  type RestaurantInfo,
} from "./screens/RestaurantInfoScreen";

import type { RestaurantOnboardingProps } from "./types";

const TOTAL_STEPS = 8;
const PAYPAL_SUBSCRIPTION_STORAGE_KEY = "wolf_paypal_subscription_id";

type Plan = "basic" | "pro";

export function RestaurantOnboarding({
  onClose,
}: RestaurantOnboardingProps) {
  const [step, setStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [restaurantInfo, setRestaurantInfo] =
    useState<RestaurantInfo | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const paypalStatus = params.get("paypal");
    const planParam = params.get("plan");
    const returnedSubscriptionId = params.get("subscription_id");

    const returnedPlan: Plan | null =
      planParam === "basic" || planParam === "pro" ? planParam : null;

    if (returnedPlan) {
      setSelectedPlan(returnedPlan);
    }

    const storedSubscriptionId = window.sessionStorage.getItem(
      PAYPAL_SUBSCRIPTION_STORAGE_KEY,
    );

    const effectiveSubscriptionId =
      returnedSubscriptionId || storedSubscriptionId || null;

    if (effectiveSubscriptionId) {
      setSubscriptionId(effectiveSubscriptionId);
      window.sessionStorage.setItem(
        PAYPAL_SUBSCRIPTION_STORAGE_KEY,
        effectiveSubscriptionId,
      );
    }

    if (paypalStatus === "success") {
      if (!effectiveSubscriptionId || !returnedPlan) {
        setPaymentError(
          "PayPal regresó sin los datos necesarios. Vuelve a seleccionar tu plan.",
        );
        setStep(4);
        return;
      }

      void verifySubscription(
        effectiveSubscriptionId,
        returnedPlan,
      );
      return;
    }

    if (paypalStatus === "cancelled") {
      setPaymentError(
        "El pago fue cancelado. Puedes volver a elegir tu plan.",
      );
      setStep(4);
    }
  }, []);

  const verifySubscription = async (
    paypalSubscriptionId: string,
    plan: Plan,
  ) => {
    setIsPaying(true);
    setPaymentError(null);

    try {
      const response = await fetch("/api/paypal/verify-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriptionId: paypalSubscriptionId,
          plan,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "No pudimos verificar la suscripción de PayPal.",
        );
      }

      setStep(5);
    } catch (error) {
      console.error("[PAYPAL] Error verificando suscripción:", error);
      setPaymentError(
        error instanceof Error
          ? error.message
          : "No pudimos verificar el pago.",
      );
      setStep(4);
    } finally {
      setIsPaying(false);
    }
  };

  const next = () => {
    if (step >= TOTAL_STEPS - 1) return;
    setStep((current) => Math.min(current + 1, TOTAL_STEPS - 1));
  };

  const back = () => {
    if (isPaying || isSubmittingRequest) return;

    if (step === 0) {
      onClose?.();
      return;
    }

    setStep((current) => Math.max(current - 1, 0));
  };

  const handlePlanSelect = async (plan: Plan) => {
    if (isPaying) return;

    setSelectedPlan(plan);
    setPaymentError(null);
    setIsPaying(true);

    try {
      console.log("[PAYPAL] Iniciando checkout público", { plan });

      const response = await fetch("/api/paypal/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("[PAYPAL] Error creando suscripción:", data);
        throw new Error(
          data?.message ||
            data?.error ||
            "No pudimos iniciar el pago con PayPal.",
        );
      }

      if (!data?.approveUrl || !data?.subscriptionId) {
        console.error("[PAYPAL] Respuesta incompleta:", data);
        throw new Error(
          "PayPal no devolvió los datos necesarios para continuar.",
        );
      }

      window.sessionStorage.setItem(
        PAYPAL_SUBSCRIPTION_STORAGE_KEY,
        data.subscriptionId,
      );
      setSubscriptionId(data.subscriptionId);

      console.log("[PAYPAL] Suscripción creada", {
        plan,
        subscriptionId: data.subscriptionId,
      });

      window.location.href = data.approveUrl;
    } catch (error) {
      console.error("[PAYPAL] Error iniciando checkout:", error);
      setPaymentError(
        error instanceof Error
          ? error.message
          : "No pudimos iniciar el pago. Inténtalo nuevamente.",
      );
      setIsPaying(false);
    }
  };

  const handlePlansBack = () => {
    if (isPaying) return;
    setSelectedPlan(null);
    setPaymentError(null);
    back();
  };

  const handleRestaurantInfoBack = () => {
    if (isSubmittingRequest) return;
    setPaymentError(null);
    setStep(5);
  };

  const handleRestaurantInfoContinue = async (info: RestaurantInfo) => {
    if (!selectedPlan || !subscriptionId || isSubmittingRequest) {
      if (!subscriptionId) {
        setPaymentError(
          "No encontramos la suscripción de PayPal. Vuelve a iniciar el pago.",
        );
      }
      return;
    }

    setPaymentError(null);
    setIsSubmittingRequest(true);

    try {
      const response = await fetch("/api/restaurant-creation-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurant_name: info.restaurantName.trim(),
          owner_name: info.ownerName.trim(),
          owner_email: info.email.trim().toLowerCase(),
          owner_phone: info.phone.trim(),
          password: info.password,
          plan: selectedPlan,
          paypal_subscription_id: subscriptionId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "[RESTAURANT ACTIVATION REQUEST] Error:",
          data,
        );
        throw new Error(
          data?.message ||
            data?.error ||
            "No pudimos crear tu cuenta y restaurante.",
        );
      }

      setRestaurantInfo({
        restaurantName: info.restaurantName.trim(),
        ownerName: info.ownerName.trim(),
        email: info.email.trim().toLowerCase(),
        phone: info.phone.trim(),
        password: "",
      });

      window.sessionStorage.removeItem(
        PAYPAL_SUBSCRIPTION_STORAGE_KEY,
      );

      setPaymentError(null);
      console.log("[RESTAURANT ACTIVATION REQUEST] Cuenta creada", {
        requestId: data?.requestId ?? null,
        restaurantId: data?.restaurantId ?? null,
        subscriptionId,
      });

      setStep(7);
    } catch (error) {
      console.error(
        "[RESTAURANT ACTIVATION REQUEST] Error:",
        error,
      );
      setPaymentError(
        error instanceof Error
          ? error.message
          : "No pudimos crear la cuenta. Inténtalo nuevamente.",
      );
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  return (
    <main className="relative min-h-dvh overflow-hidden bg-black text-white">
      <OnboardingProgress current={step} total={TOTAL_STEPS} />

      <div className="relative min-h-dvh">
        {step === 0 && <OwnAppScreen />}
        {step === 1 && <DirectOrdersScreen />}
        {step === 2 && <WolfEcosystemScreen />}
        {step === 3 && <ActivationScreen />}

        {step === 4 && (
          <>
            <PlansScreen
              selectedPlan={selectedPlan}
              onSelectPlan={handlePlanSelect}
              onBack={handlePlansBack}
            />

            {paymentError && !isPaying && (
              <div className="fixed bottom-5 left-1/2 z-[100] w-[calc(100%-32px)] max-w-md -translate-x-1/2">
                <div className="rounded-2xl border border-red-400/20 bg-[#17100f] p-4 shadow-2xl backdrop-blur-xl">
                  <p className="text-sm font-bold text-white">
                    No pudimos continuar
                  </p>
                  <p className="mt-1 text-xs leading-5 text-white/45">
                    {paymentError}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {step === 5 && (
          <SubscriptionSuccessScreen
            plan={selectedPlan}
            paypalSubscriptionId={subscriptionId ?? ""}
            onContinue={() => setStep(6)}
          />
        )}

        {step === 6 && (
          <RestaurantInfoScreen
            selectedPlan={selectedPlan}
            onContinue={handleRestaurantInfoContinue}
            onBack={handleRestaurantInfoBack}
            isSubmitting={isSubmittingRequest}
          />
        )}

        {step === 7 && (
          <RequestSubmittedScreen
            restaurantName={restaurantInfo?.restaurantName}
            plan={selectedPlan}
            onContinue={() => {
              window.location.href = "/login";
            }}
          />
        )}

        {isPaying && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-5 backdrop-blur-md">
            <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#101010] p-6 text-center shadow-2xl">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-orange-400/30 bg-orange-500/10">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-orange-400" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">
                {step === 4
                  ? "Preparando tu suscripción"
                  : "Verificando tu pago"}
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/45">
                {step === 4
                  ? "Estamos conectando con PayPal de forma segura."
                  : "Estamos confirmando tu suscripción con PayPal."}
              </p>
            </div>
          </div>
        )}

        {paymentError &&
          !isPaying &&
          !isSubmittingRequest &&
          step !== 4 && (
            <div className="fixed bottom-5 left-1/2 z-[100] w-[calc(100%-32px)] max-w-md -translate-x-1/2">
              <div className="rounded-2xl border border-red-400/20 bg-[#17100f] p-4 shadow-2xl backdrop-blur-xl">
                <p className="text-sm font-bold text-white">
                  No pudimos continuar
                </p>
                <p className="mt-1 text-xs leading-5 text-white/45">
                  {paymentError}
                </p>
                <button
                  type="button"
                  onClick={() => setPaymentError(null)}
                  className="mt-3 text-xs font-bold text-orange-400"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
      </div>

      {step < 4 && (
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