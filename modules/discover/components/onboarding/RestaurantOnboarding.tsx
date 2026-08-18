"use client";

import { useEffect, useState } from "react";
import { getWolfAccessToken } from "@/lib/supabase/client";

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

const PAYPAL_SUBSCRIPTION_STORAGE_KEY =
  "wolf_paypal_subscription_id";

const ACTIVATION_REQUEST_API =
  "/api/restaurant-creation-requests";

type Plan = "basic" | "pro";

export function RestaurantOnboarding({
  onClose,
}: RestaurantOnboardingProps) {
  const [step, setStep] = useState(0);

  const [selectedPlan, setSelectedPlan] =
    useState<Plan | null>(null);

  const [isPaying, setIsPaying] =
    useState(false);

  const [isSubmittingRequest, setIsSubmittingRequest] =
    useState(false);

  const [paymentError, setPaymentError] =
    useState<string | null>(null);

  const [subscriptionId, setSubscriptionId] =
    useState<string | null>(null);

  const [restaurantInfo, setRestaurantInfo] =
    useState<RestaurantInfo | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(
      window.location.search,
    );

    const paypalStatus = params.get("paypal");
    const planParam = params.get("plan");

    const returnedPlan =
      planParam === "basic" || planParam === "pro"
        ? planParam
        : null;

    if (returnedPlan) {
      setSelectedPlan(returnedPlan);
    }

    const storedSubscriptionId =
      window.sessionStorage.getItem(
        PAYPAL_SUBSCRIPTION_STORAGE_KEY,
      );

    if (storedSubscriptionId) {
      setSubscriptionId(storedSubscriptionId);
    }

    if (paypalStatus === "success") {
      setPaymentError(null);
      setStep(5);
      return;
    }

    if (paypalStatus === "cancelled") {
      setPaymentError(
        "El pago fue cancelado. Puedes volver a elegir tu plan.",
      );
      setStep(4);
    }
  }, []);

  const next = () => {
    if (step >= TOTAL_STEPS - 1) {
      return;
    }

    setStep((current) =>
      Math.min(
        current + 1,
        TOTAL_STEPS - 1,
      ),
    );
  };

  const back = () => {
    if (
      isPaying ||
      isSubmittingRequest
    ) {
      return;
    }

    if (step === 0) {
      onClose?.();
      return;
    }

    setStep((current) =>
      Math.max(current - 1, 0),
    );
  };

  const handlePlanSelect = async (
    plan: Plan,
  ) => {
    if (isPaying) {
      return;
    }

    setSelectedPlan(plan);
    setPaymentError(null);
    setIsPaying(true);

    try {
      console.log(
        "[PAYPAL] Iniciando checkout",
        { plan },
      );

      const accessToken = await getWolfAccessToken();

      if (!accessToken) {
        throw new Error(
          "Tu sesión expiró o ya no está disponible. Inicia sesión nuevamente e inténtalo otra vez.",
        );
      }

      const response = await fetch(
        "/api/paypal/create-subscription",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ plan }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "[PAYPAL] Error creando suscripción:",
          data,
        );

        throw new Error(
          data?.message ||
            data?.error ||
            "No pudimos iniciar el pago con PayPal.",
        );
      }

      if (!data?.approveUrl) {
        console.error(
          "[PAYPAL] PayPal no devolvió approveUrl:",
          data,
        );

        throw new Error(
          "PayPal no devolvió la dirección de pago.",
        );
      }

      if (data?.subscriptionId) {
        window.sessionStorage.setItem(
          PAYPAL_SUBSCRIPTION_STORAGE_KEY,
          data.subscriptionId,
        );

        setSubscriptionId(
          data.subscriptionId,
        );
      }

      console.log(
        "[PAYPAL] Suscripción creada",
        {
          plan,
          subscriptionId:
            data.subscriptionId,
        },
      );

      window.location.href =
        data.approveUrl;
    } catch (error) {
      console.error(
        "[PAYPAL] Error iniciando checkout:",
        error,
      );

      setPaymentError(
        error instanceof Error
          ? error.message
          : "No pudimos iniciar el pago. Inténtalo nuevamente.",
      );

      setIsPaying(false);
    }
  };

  const handlePlansBack = () => {
    if (isPaying) {
      return;
    }

    setSelectedPlan(null);
    setPaymentError(null);
    back();
  };

  const handlePaymentSuccessContinue = () => {
    if (!selectedPlan) {
      setPaymentError(
        "No pudimos identificar el plan de tu suscripción.",
      );
      setStep(4);
      return;
    }

    setPaymentError(null);
    setStep(6);
  };

  const handleRestaurantInfoBack = () => {
    if (isSubmittingRequest) {
      return;
    }

    setPaymentError(null);
    setStep(5);
  };

  const handleRestaurantInfoContinue = async (
    info: RestaurantInfo,
  ) => {
    if (
      !selectedPlan ||
      !subscriptionId ||
      isSubmittingRequest
    ) {
      if (!subscriptionId) {
        setPaymentError(
          "No encontramos el identificador de tu suscripción. Vuelve a iniciar el pago para continuar.",
        );
      }

      return;
    }

    setPaymentError(null);
    setIsSubmittingRequest(true);

    try {
      const accessToken = await getWolfAccessToken();

      if (!accessToken) {
        throw new Error(
          "Tu sesión expiró o ya no está disponible. Inicia sesión nuevamente e inténtalo otra vez.",
        );
      }

      const response = await fetch(
        ACTIVATION_REQUEST_API,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            restaurant_name:
              info.restaurantName.trim(),
            owner_name:
              info.ownerName.trim(),
            owner_email:
              info.email.trim(),
            owner_phone:
              info.phone.trim(),
            plan: selectedPlan,
            paypal_subscription_id:
              subscriptionId,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "[RESTAURANT ACTIVATION REQUEST] Error:",
          data,
        );

        throw new Error(
          data?.message ||
            data?.error ||
            "No pudimos registrar los datos de tu restaurante.",
        );
      }

      setRestaurantInfo({
        restaurantName:
          info.restaurantName.trim(),
        ownerName:
          info.ownerName.trim(),
        email: info.email.trim(),
        phone: info.phone.trim(),
      });

      if (
        typeof window !== "undefined"
      ) {
        window.sessionStorage.removeItem(
          PAYPAL_SUBSCRIPTION_STORAGE_KEY,
        );
      }

      setPaymentError(null);

      console.log(
        "[RESTAURANT ACTIVATION REQUEST] Solicitud registrada",
        {
          requestId:
            data?.requestId ??
            data?.id ??
            null,
          plan: selectedPlan,
          subscriptionId,
        },
      );

      setStep(7);
    } catch (error) {
      console.error(
        "[RESTAURANT ACTIVATION REQUEST] Error:",
        error,
      );

      setPaymentError(
        error instanceof Error
          ? error.message
          : "No pudimos registrar la solicitud. Inténtalo nuevamente.",
      );
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  return (
    <main className="relative min-h-dvh overflow-hidden bg-black text-white">
      <OnboardingProgress
        current={step}
        total={TOTAL_STEPS}
      />

      <div className="relative min-h-dvh">
        {step === 0 && (
          <OwnAppScreen />
        )}

        {step === 1 && (
          <DirectOrdersScreen />
        )}

        {step === 2 && (
          <WolfEcosystemScreen />
        )}

        {step === 3 && (
          <ActivationScreen />
        )}

        {step === 4 && (
          <>
            <PlansScreen
              selectedPlan={selectedPlan}
              onSelectPlan={
                handlePlanSelect
              }
              onBack={
                handlePlansBack
              }
            />

            {paymentError && !isPaying && (
              <div className="fixed bottom-5 left-1/2 z-[100] w-[calc(100%-32px)] max-w-md -translate-x-1/2">
                <div className="rounded-2xl border border-red-400/20 bg-[#17100f] p-4 shadow-2xl backdrop-blur-xl">
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                      !
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-white">
                        No pudimos continuar
                      </p>

                      <p className="mt-1 text-xs leading-5 text-white/45">
                        {paymentError}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {step === 5 && (
<SubscriptionSuccessScreen
  plan={selectedPlan}
  paypalSubscriptionId={subscriptionId ?? ""}
  onContinue={() => {
    setStep(6);
  }}
/>
        )}

        {step === 6 && (
          <RestaurantInfoScreen
            selectedPlan={selectedPlan}
            onContinue={
              handleRestaurantInfoContinue
            }
            onBack={
              handleRestaurantInfoBack
            }
            isSubmitting={
              isSubmittingRequest
            }
          />
        )}

        {step === 7 && (
          <RequestSubmittedScreen
            restaurantName={
              restaurantInfo?.restaurantName
            }
            plan={selectedPlan}
            onContinue={() => {
              window.location.href = "/discover";
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
                Preparando tu suscripción
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/45">
                Estamos conectando con PayPal de forma segura.
              </p>

              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.15em] text-orange-400">
                {selectedPlan === "pro"
                  ? "WOLF PRO · $46/mes"
                  : "WOLF BÁSICO · $35/mes"}
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
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                    !
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-white">
                      No pudimos continuar
                    </p>

                    <p className="mt-1 text-xs leading-5 text-white/45">
                      {paymentError}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        setPaymentError(null)
                      }
                      className="mt-3 text-xs font-bold text-orange-400 transition hover:text-orange-300"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
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