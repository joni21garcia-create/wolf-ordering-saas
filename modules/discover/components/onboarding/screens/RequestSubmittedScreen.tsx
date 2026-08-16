"use client";

export type RequestSubmittedScreenProps = {
  restaurantName?: string | null;
  plan?: "basic" | "pro" | null;
  onContinue: () => void;
};

export function RequestSubmittedScreen({
  restaurantName,
  plan,
  onContinue,
}: RequestSubmittedScreenProps) {
  const planLabel =
    plan === "pro"
      ? "WOLF PRO - $46/mes"
      : plan === "basic"
        ? "WOLF BASICO - $35/mes"
        : "PLAN WOLF";

  return (
    <section className="relative min-h-dvh overflow-hidden bg-[#050505] px-5 pb-28 pt-16 text-white sm:px-6 sm:pt-20">
      <div className="relative z-10 mx-auto w-full max-w-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 text-lg font-bold">
          OK
        </div>

        <p className="mt-6 text-center text-[10px] font-bold uppercase tracking-[0.28em] text-orange-400">
          SOLICITUD ENVIADA
        </p>

        <h1 className="mt-3 text-center text-4xl font-semibold leading-tight tracking-tight">
          Todo listo.
        </h1>

        <p className="mx-auto mt-4 max-w-sm text-center text-sm leading-6 text-white/55">
          {restaurantName
            ? `Recibimos los datos de ${restaurantName} y tu suscripción de PayPal.`
            : "Recibimos los datos de tu restaurante y tu suscripción de PayPal."}
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/30">
              ESTADO DE LA SUSCRIPCIÓN
            </p>
            <p className="mt-2 text-base font-semibold text-emerald-400">
              Activa
            </p>
          </div>

          <div className="mt-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/30">
              SOLICITUD
            </p>
            <p className="mt-2 text-base font-semibold text-white">
              En revisión
            </p>
          </div>

          <div className="mt-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/30">
              PLAN
            </p>
            <p className="mt-2 text-base font-semibold text-white">
              {planLabel}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-orange-400/15 bg-orange-500/[0.05] p-5">
          <p className="text-sm leading-6 text-white/70">
            Nuestro equipo revisará la información. Para completar la creación
            y configuración de tu restaurante, podemos solicitarte información
            adicional si hace falta.
          </p>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="mt-6 flex h-14 w-full items-center justify-center rounded-2xl bg-orange-500 px-5 text-sm font-bold text-white transition hover:bg-orange-400 active:scale-[0.99]"
        >
          Volver a Discover
        </button>
      </div>
    </section>
  );
}