"use client";

export type SubscriptionSuccessScreenProps = {
  plan?: "basic" | "pro" | null;
  paypalSubscriptionId: string;
  onContinue?: () => void;
};

const PLAN_LABELS: Record<"basic" | "pro", string> = {
  basic: "BASICO - $35/mes",
  pro: "PRO - $46/mes",
};

export function SubscriptionSuccessScreen({
  plan = null,
  paypalSubscriptionId,
  onContinue,
}: SubscriptionSuccessScreenProps) {
  const planLabel = plan ? PLAN_LABELS[plan] : "PLAN WOLF";

  return (
    <section className="relative min-h-dvh overflow-hidden bg-[#050505] px-5 pb-28 pt-16 text-white sm:px-6 sm:pt-20">
      <div className="relative z-10 mx-auto w-full max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 text-xl font-bold text-white">
          OK
        </div>

        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.28em] text-orange-400">
          SUSCRIPCION RECIBIDA
        </p>

        <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight">
          Gracias por suscribirte.
        </h1>

        <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-white/55">
          Tu suscripcion mensual fue recibida correctamente. Ahora necesitamos
          algunos datos para preparar tu restaurante.
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left">
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/30">
            PLAN
          </p>

          <p className="mt-2 text-lg font-semibold text-white">
            {planLabel}
          </p>

          <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.16em] text-white/30">
            SUSCRIPCION
          </p>

          <p className="mt-2 break-all font-mono text-xs text-white/50">
            {paypalSubscriptionId}
          </p>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="mt-6 flex h-14 w-full items-center justify-center rounded-2xl bg-orange-500 px-5 text-sm font-bold text-white transition hover:bg-orange-400 active:scale-[0.99]"
        >
          Continuar con los datos del restaurante
        </button>
      </div>
    </section>
  );
}