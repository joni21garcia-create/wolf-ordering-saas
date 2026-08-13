"use client";

type Plan = "basic" | "pro";

type PlansScreenProps = {
  selectedPlan?: Plan | null;
  onSelectPlan?: (plan: Plan) => void;
  onBack?: () => void;
};

const plans: Record<
  Plan,
  {
    name: string;
    price: string;
    description: string;
    features: string[];
  }
> = {
  pro: {
    name: "PRO",
    price: "$46",
    description: "Para restaurantes que quieren crecer.",
    features: [
      "Aparece destacado en Discover",
      "Insignia Wolf",
      "Impulsa tu posición",
      "Todo lo de Básico",
    ],
  },
  basic: {
    name: "BÁSICO",
    price: "$35",
    description: "Para restaurantes que están comenzando.",
    features: [
      "Pedidos directos",
      "Menú digital",
      "Gestión de pedidos",
      "Página de restaurante",
    ],
  },
};

export function PlansScreen({
  selectedPlan = null,
  onSelectPlan,
  onBack,
}: PlansScreenProps) {
  const proSelected = selectedPlan === "pro";
  const basicSelected = selectedPlan === "basic";

  return (
    <section className="relative min-h-dvh overflow-hidden bg-[#050505] px-4 pb-10 pt-12 text-white sm:px-6 sm:pt-16">
      <style>{`
        @keyframes plansGlow {
          0%, 100% {
            opacity: .20;
            transform: scale(.96);
          }
          50% {
            opacity: .42;
            transform: scale(1.04);
          }
        }

        @keyframes rankingRise {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes proPulse {
          0%, 100% {
            box-shadow:
              0 0 0 0 rgba(249,115,22,0),
              0 24px 70px rgba(0,0,0,.45);
          }
          50% {
            box-shadow:
              0 0 0 1px rgba(249,115,22,.16),
              0 24px 80px rgba(249,115,22,.12);
          }
        }

        @keyframes selectedGlow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(249,115,22,.12);
          }
          50% {
            box-shadow: 0 0 0 5px rgba(249,115,22,.06);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .plans-glow,
          .ranking-rise,
          .pro-pulse,
          .selected-glow {
            animation: none !important;
          }
        }
      `}</style>

      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="plans-glow pointer-events-none absolute left-1/2 top-[7%] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-orange-500/[0.055] blur-[120px]"
        style={{ animation: "plansGlow 5s ease-in-out infinite" }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[43%] h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-orange-600/[0.045] blur-[120px]"
      />

      {/* Header */}
      <div className="relative z-10 mx-auto max-w-md text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-orange-400">
          WOLF ORDERING
        </p>

        <h1 className="mt-3 text-[34px] font-bold leading-[1.02] tracking-[-0.045em] sm:text-5xl">
          Tu restaurante
          <br />
          puede estar <span className="text-orange-400">aquí.</span>
        </h1>

        <p className="mx-auto mt-4 max-w-[320px] text-[14px] leading-6 text-white/50">
          Ponlo frente a más clientes y empieza a{" "}
          <span className="font-semibold text-orange-300">crecer.</span>
        </p>
      </div>

      {/* Discover before / after */}
      <div className="relative z-10 mx-auto mt-8 max-w-md">
        <div className="relative flex items-center justify-between gap-3">
          <div className="w-[43%] rounded-2xl border border-white/[0.08] bg-white/[0.025] p-3">
            <div className="mb-2 text-[8px] font-bold uppercase tracking-[0.16em] text-white/35">
              Antes
            </div>

            <div className="text-[8px] font-semibold text-white/50">
              DISCOVER
            </div>

            <div className="mt-2 space-y-1.5">
              {[
                ["1", "Restaurante A"],
                ["2", "Restaurante B"],
                ["3", "Tu restaurante"],
                ["4", "Restaurante C"],
              ].map(([position, name]) => (
                <div
                  key={position}
                  className={[
                    "flex items-center gap-2 rounded-lg px-1.5 py-1.5",
                    name === "Tu restaurante"
                      ? "bg-orange-500/[0.06] text-orange-300"
                      : "text-white/35",
                  ].join(" ")}
                >
                  <span className="w-3 text-[8px] font-bold">{position}</span>
                  <span className="h-4 w-4 rounded-md bg-white/[0.08]" />
                  <span className="truncate text-[7px] font-medium">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex w-[14%] flex-col items-center justify-center">
            <span className="text-[7px] font-bold uppercase tracking-[0.1em] text-orange-400">
              Impulsa
            </span>
            <span className="mt-1 text-2xl leading-none text-orange-400">
              →
            </span>
          </div>

          <div
            className="ranking-rise w-[43%] rounded-2xl border border-orange-400/50 bg-orange-500/[0.055] p-3 shadow-[0_0_35px_rgba(249,115,22,.08)]"
            style={{ animation: "rankingRise 3.8s ease-in-out infinite" }}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-white/55">
                Después
              </span>

              <span className="rounded-full bg-orange-500 px-1.5 py-0.5 text-[6px] font-bold text-black">
                DESTACADO
              </span>
            </div>

            <div className="text-[8px] font-semibold text-white/70">
              DISCOVER
            </div>

            <div className="mt-2 space-y-1.5">
              {[
                ["1", "Tu restaurante"],
                ["2", "Restaurante A"],
                ["3", "Restaurante B"],
                ["4", "Restaurante C"],
              ].map(([position, name]) => (
                <div
                  key={position}
                  className={[
                    "flex items-center gap-2 rounded-lg px-1.5 py-1.5",
                    name === "Tu restaurante"
                      ? "bg-orange-500/15 text-orange-300"
                      : "text-white/35",
                  ].join(" ")}
                >
                  <span className="w-3 text-[8px] font-bold">{position}</span>

                  <span
                    className={[
                      "h-4 w-4 rounded-md",
                      name === "Tu restaurante"
                        ? "bg-orange-400/30"
                        : "bg-white/[0.08]",
                    ].join(" ")}
                  />

                  <span className="truncate text-[7px] font-semibold">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PRO */}
      <div
        className={[
          "relative z-10 mx-auto mt-7 max-w-md rounded-[28px] border bg-gradient-to-b from-[#15110d] to-[#0a0a0a] p-5 transition-all duration-300",
          proSelected
            ? "selected-glow border-orange-300 bg-orange-500/[0.08]"
            : "border-orange-400/60",
        ].join(" ")}
        style={{
          animation: "proPulse 4s ease-in-out infinite",
        }}
      >
        <div className="absolute left-5 top-0 -translate-y-1/2 rounded-full bg-orange-500 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-black shadow-[0_8px_25px_rgba(249,115,22,.25)]">
          ★ Más elegido
        </div>

        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">
              WOLF
            </p>

            <h2 className="mt-0.5 text-4xl font-black tracking-[-0.04em]">
              PRO
            </h2>

            <p className="mt-1 text-[11px] text-white/45">
              Para restaurantes que quieren{" "}
              <span className="text-orange-300">crecer.</span>
            </p>
          </div>

          <div className="text-right">
            <div className="text-4xl font-black tracking-[-0.05em]">$46</div>
            <div className="text-[10px] text-white/40">/ mes</div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {[
            [
              "↗",
              "Aparece destacado en Discover",
              "Más visibilidad frente a clientes que están buscando dónde pedir.",
            ],
            [
              "★",
              "Insignia Wolf",
              "Haz que tu restaurante destaque visualmente.",
            ],
            [
              "🚀",
              "Impulsa tu posición",
              "Promociona tu restaurante para aparecer entre los primeros lugares durante el período que elijas.",
            ],
            [
              "✓",
              "Todo lo de Básico",
              "Pedidos directos, menú digital, gestión de pedidos y presencia en Wolf.",
            ],
          ].map(([icon, title, description]) => (
            <div key={title} className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-orange-400/20 bg-orange-500/[0.07] text-orange-400">
                {icon}
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-bold text-white">{title}</p>
                <p className="mt-0.5 text-[10px] leading-4 text-white/40">
                  {description}
                </p>
              </div>

              <span className="pt-1 text-orange-400">✓</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onSelectPlan?.("pro")}
          className={[
            "mt-6 flex h-14 w-full items-center justify-center rounded-2xl px-4 text-[15px] font-bold text-white shadow-[0_12px_35px_rgba(249,115,22,.24)] transition-all active:scale-[0.99]",
            proSelected
              ? "bg-orange-400"
              : "bg-orange-500 hover:bg-orange-400",
          ].join(" ")}
        >
          {proSelected ? "Pro seleccionado" : "🚀 Quiero crecer con Pro"}
          <span className="ml-2 text-lg">→</span>
        </button>

        <p className="mt-3 text-center text-[9px] text-white/30">
          🔒 Pago seguro · Puedes cambiar de plan cuando quieras
        </p>
      </div>

      {/* BÁSICO */}
      <div
        className={[
          "relative z-10 mx-auto mt-4 max-w-md rounded-[24px] border p-5 transition-all duration-300",
          basicSelected
            ? "selected-glow border-orange-300 bg-orange-500/[0.05]"
            : "border-white/[0.10] bg-white/[0.025]",
        ].join(" ")}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
              WOLF
            </p>

            <h2 className="mt-0.5 text-3xl font-black">BÁSICO</h2>

            <p className="mt-1 text-[10px] text-white/40">
              Para restaurantes que están comenzando.
            </p>
          </div>

          <div className="text-right">
            <div className="text-3xl font-black">$35</div>
            <div className="text-[9px] text-white/35">/ mes</div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {[
            "Pedidos directos",
            "Menú digital",
            "Gestión de pedidos",
            "Página de restaurante",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-1.5 text-[9px] text-white/50"
            >
              <span className="text-orange-400">✓</span>
              {item}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onSelectPlan?.("basic")}
          className={[
            "mt-5 h-12 w-full rounded-xl text-[13px] font-bold transition-all active:scale-[0.99]",
            basicSelected
              ? "border border-orange-300 bg-orange-500 text-white"
              : "border border-white/20 bg-transparent text-white hover:border-white/40 hover:bg-white/[0.04]",
          ].join(" ")}
        >
          {basicSelected ? "Básico seleccionado" : "Elegir Básico"}
          {basicSelected && <span className="ml-2">✓</span>}
        </button>
      </div>

      {/* Trust */}
      <div className="relative z-10 mx-auto mt-4 max-w-md rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
        <div className="grid grid-cols-3 divide-x divide-white/[0.08]">
          {[
            ["⌑", "Pago seguro", "Datos protegidos"],
            ["↻", "Cambia cuando quieras", "Sin complicaciones"],
            ["◉", "Soporte", "Estamos contigo"],
          ].map(([icon, title, description]) => (
            <div key={title} className="px-2 text-center first:pl-0 last:pr-0">
              <div className="text-lg text-orange-400">{icon}</div>
              <p className="mt-1 text-[8px] font-bold text-white/75">
                {title}
              </p>
              <p className="mt-0.5 text-[7px] leading-3 text-white/30">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Back only; no global Finalizar */}
      <button
        type="button"
        onClick={onBack}
        className="relative z-10 mx-auto mt-5 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2 text-[10px] font-semibold text-white/40 transition hover:border-white/20 hover:text-white/70"
      >
        ← Volver
      </button>

      <p className="relative z-10 mx-auto mt-4 max-w-md text-center text-[8px] font-medium uppercase tracking-[0.16em] text-white/20">
        Selecciona tu plan para continuar al pago
      </p>
    </section>
  );
}