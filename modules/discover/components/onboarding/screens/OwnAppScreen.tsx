"use client";

export function OwnAppScreen() {
  return (
    <section className="relative flex min-h-dvh flex-col overflow-hidden bg-[#050505] px-5 pb-32 pt-14 text-white sm:px-6 sm:pt-16">
      <style>{`
        @keyframes wolfPhoneFloat {
          0%, 100% {
            transform: translate(-50%, 0) rotate(-4deg);
          }
          50% {
            transform: translate(-50%, -7px) rotate(-2deg);
          }
        }

        @keyframes wolfOrderFloat {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-6px) scale(1.015);
          }
        }

        @keyframes wolfRestaurantFloat {
          0%, 100% {
            transform: translateY(0) rotate(2deg);
          }
          50% {
            transform: translateY(-5px) rotate(0deg);
          }
        }

        @keyframes wolfAmbientGlow {
          0%, 100% {
            opacity: .18;
            transform: translate(-50%, -50%) scale(.94);
          }
          50% {
            opacity: .38;
            transform: translate(-50%, -50%) scale(1.04);
          }
        }

        @keyframes wolfShine {
          0%, 55% {
            transform: translateX(-180%) skewX(-15deg);
          }
          75%, 100% {
            transform: translateX(430%) skewX(-15deg);
          }
        }

        @keyframes wolfDataPulse {
          0%, 100% {
            opacity: .78;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes wolfDotFloat {
          0%, 100% {
            transform: translateY(0);
            opacity: .45;
          }
          50% {
            transform: translateY(-7px);
            opacity: .9;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .wolf-phone,
          .wolf-order,
          .wolf-restaurant,
          .wolf-ambient-glow,
          .wolf-shine,
          .wolf-data,
          .wolf-dot {
            animation: none !important;
          }
        }
      `}</style>

      {/* =========================================================
          ATMÓSFERA
          Fondo negro profundo + naranja muy controlado.
         ========================================================= */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[28%] h-[330px] w-[330px] -translate-x-1/2 rounded-full bg-orange-500/[0.055] blur-[115px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 h-[240px] w-[430px] -translate-x-1/2 rounded-full bg-orange-950/[0.18] blur-[105px]"
      />

      {/* =========================================================
          HERO VISUAL
          Importante: NO contiene el progreso.
          OnboardingProgress.tsx ya lo renderiza.
         ========================================================= */}
      <div className="relative z-10 mx-auto mt-6 h-[318px] w-full max-w-[350px] shrink-0 sm:mt-8 sm:h-[370px] sm:max-w-sm">
        {/* Halo principal */}
        <div
          aria-hidden="true"
          className="wolf-ambient-glow absolute left-1/2 top-[48%] h-[255px] w-[255px] rounded-full border border-orange-400/[0.075]"
          style={{ animation: "wolfAmbientGlow 5s ease-in-out infinite" }}
        />

        {/* Segundo anillo, casi invisible */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[48%] h-[205px] w-[205px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.035]"
        />

        {/* Líneas orbitales */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[3%] top-[29%] h-[150px] w-[150px] rounded-full border border-orange-400/[0.045]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-2%] top-[17%] h-[185px] w-[185px] rounded-full border border-white/[0.035]"
        />

        {/* Puntos decorativos */}
        <span
          aria-hidden="true"
          className="wolf-dot absolute left-[5%] top-[46%] h-1.5 w-1.5 rounded-full bg-orange-400 shadow-[0_0_12px_rgba(249,115,22,.8)]"
          style={{ animation: "wolfDotFloat 3.8s ease-in-out infinite" }}
        />

        <span
          aria-hidden="true"
          className="wolf-dot absolute right-[7%] top-[29%] h-1 w-1 rounded-full bg-orange-300/80"
          style={{ animation: "wolfDotFloat 4.4s ease-in-out infinite .7s" }}
        />

        <span
          aria-hidden="true"
          className="wolf-dot absolute right-[18%] bottom-[22%] h-1.5 w-1.5 rounded-full bg-orange-400/70"
          style={{ animation: "wolfDotFloat 4s ease-in-out infinite 1.1s" }}
        />

        {/* =======================================================
            RESTAURANTE
            Elemento secundario: representa el negocio, no compite
            con el teléfono.
           ======================================================= */}
        <div
          className="wolf-restaurant absolute bottom-[31px] left-[1%] z-10 h-[145px] w-[145px]"
          style={{
            animation: "wolfRestaurantFloat 5.5s ease-in-out infinite",
          }}
        >
          {/* Sombra de suelo */}
          <div className="absolute bottom-0 left-1 right-1 h-5 rounded-full bg-black/80 blur-md" />

          {/* Edificio */}
          <div className="absolute bottom-4 left-3 right-3 top-8 rounded-[23px] border border-white/[0.10] bg-gradient-to-b from-[#29231e] via-[#181512] to-[#0c0c0b] shadow-[0_25px_55px_rgba(0,0,0,.68)]">
            {/* Techo */}
            <div className="absolute -left-2 -right-2 top-[-9px] h-9 rounded-[12px] border border-white/[0.08] bg-gradient-to-b from-[#27221e] to-[#11100f]" />

            {/* Toldo */}
            <div className="absolute -left-2 -right-2 top-[-1px] flex h-8 overflow-hidden rounded-[9px] border border-orange-300/15 shadow-[0_7px_18px_rgba(249,115,22,.10)]">
              {[0, 1, 2, 3, 4].map((item) => (
                <span
                  key={item}
                  className={[
                    "flex-1",
                    item % 2 === 0 ? "bg-orange-500/90" : "bg-[#1b130d]",
                  ].join(" ")}
                />
              ))}
            </div>

            {/* Ventanas */}
            <div className="absolute left-4 top-14 h-11 w-10 rounded-xl border border-white/[0.08] bg-[#070707] shadow-inner">
              <div className="mx-auto mt-2 h-7 w-6 rounded-md bg-orange-300/[0.10]" />
              <div className="absolute inset-x-2 bottom-2 h-px bg-orange-300/15" />
            </div>

            <div className="absolute right-4 top-14 h-11 w-10 rounded-xl border border-white/[0.08] bg-[#070707] shadow-inner">
              <div className="mx-auto mt-2 h-7 w-6 rounded-md bg-orange-300/[0.10]" />
              <div className="absolute inset-x-2 bottom-2 h-px bg-orange-300/15" />
            </div>

            {/* Puerta */}
            <div className="absolute bottom-0 left-1/2 h-16 w-10 -translate-x-1/2 rounded-t-xl border border-white/[0.08] bg-black/75">
              <span className="absolute right-2 top-8 h-1.5 w-1.5 rounded-full bg-orange-300 shadow-[0_0_8px_rgba(249,115,22,.7)]" />
            </div>

            {/* Luz cálida */}
            <div className="absolute bottom-0 left-1/2 h-20 w-24 -translate-x-1/2 rounded-full bg-orange-500/[0.07] blur-2xl" />
          </div>

          {/* Icono restaurante */}
          <div className="absolute left-1/2 top-[-31px] flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-orange-300/20 bg-[#12100e] shadow-[0_0_28px_rgba(249,115,22,.16)]">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-orange-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M7 3v7" />
              <path d="M4.5 3v4.5a2.5 2.5 0 0 0 5 0V3" />
              <path d="M7 10v11" />
              <path d="M15.5 3v18" />
              <path d="M15.5 3c2.2 1.2 3.5 3.1 3.5 5.2 0 1.8-1.2 3-3.5 3" />
            </svg>
          </div>

          {/* Planta */}
          <div className="absolute bottom-1 left-0">
            <div className="mx-auto h-9 w-2 rounded-full bg-[#17110d]" />
            <div className="absolute bottom-6 left-[-6px] h-7 w-4 -rotate-20 rounded-full bg-emerald-500/20" />
            <div className="absolute bottom-8 left-1 h-8 w-4 rotate-25 rounded-full bg-emerald-400/15" />
          </div>
        </div>

        {/* =======================================================
            TELÉFONO
            Foco principal.
           ======================================================= */}
        <div
          className="wolf-phone absolute left-1/2 top-[4px] z-20 h-[278px] w-[164px] -translate-x-1/2 rounded-[2.9rem] border border-white/[0.18] bg-[#171717] p-2 shadow-[0_35px_80px_rgba(0,0,0,.72),0_0_55px_rgba(249,115,22,.12)]"
          style={{
            animation: "wolfPhoneFloat 5.8s ease-in-out infinite",
          }}
        >
          <div className="relative h-full overflow-hidden rounded-[2.35rem] bg-[#f7f7f7]">
            {/* Isla dinámica */}
            <div className="absolute left-1/2 top-2.5 z-30 h-5 w-20 -translate-x-1/2 rounded-full bg-black" />

            {/* Reflejo premium */}
            <div
              aria-hidden="true"
              className="wolf-shine pointer-events-none absolute inset-y-0 left-0 z-40 w-1/4 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              style={{
                animation: "wolfShine 5.5s ease-in-out infinite",
              }}
            />

            {/* Header */}
            <div className="px-4 pb-3 pt-11">
              <p className="text-[7px] font-semibold uppercase tracking-[0.14em] text-black/35">
                TU RESTAURANTE
              </p>

              <div className="mt-1.5 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-500 text-[9px] font-black text-white">
                  W
                </span>

                <div>
                  <p className="text-[11px] font-bold text-black">
                    ¡Hola, Juan!
                  </p>
                  <p className="text-[7px] text-black/40">
                    Miércoles, 14 de mayo
                  </p>
                </div>
              </div>
            </div>

            {/* Pedido nuevo */}
            <div className="mx-3 rounded-2xl bg-gradient-to-br from-orange-400 via-orange-500 to-orange-700 p-3 shadow-[0_8px_20px_rgba(249,115,22,.20)]">
              <div className="flex items-center justify-between">
                <span className="text-[7px] font-semibold uppercase tracking-[0.08em] text-white/75">
                  Pedido directo
                </span>

                <span className="text-[7px] font-medium text-white/65">
                  Ahora
                </span>
              </div>

              <p className="mt-1 text-[13px] font-bold leading-tight text-white">
                Nuevo pedido recibido
              </p>

              <p className="mt-1 text-[9px] font-semibold text-white/90">
                #1027
              </p>
            </div>

            {/* Datos simulados */}
            <div
              className="wolf-data space-y-2 px-3 pt-3"
              style={{
                animation: "wolfDataPulse 3.5s ease-in-out infinite",
              }}
            >
              {[
                {
                  icon: "person",
                  label: "Cliente",
                  value: "María González",
                },
                {
                  icon: "money",
                  label: "Total",
                  value: "$28.50",
                },
                {
                  icon: "delivery",
                  label: "Entrega",
                  value: "A domicilio",
                },
                {
                  icon: "pin",
                  label: "Dirección",
                  value: "Av. Solano 12-45",
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center gap-2 rounded-xl bg-white px-2.5 py-2 shadow-[0_2px_10px_rgba(0,0,0,.04)]"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                    {row.icon === "person" && (
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="8" r="3" />
                        <path d="M5 20c.8-3.4 3.1-5 7-5s6.2 1.6 7 5" />
                      </svg>
                    )}

                    {row.icon === "money" && (
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 3v18" />
                        <path d="M16 7.5c-.8-1-2-1.5-4-1.5-2.4 0-4 1.1-4 2.8 0 4.2 8 1.7 8 5.7 0 1.7-1.5 2.9-4 2.9-2 0-3.4-.6-4.3-1.7" />
                      </svg>
                    )}

                    {row.icon === "delivery" && (
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M3 6h11v10H3z" />
                        <path d="M14 10h4l3 3v3h-7z" />
                        <circle cx="7" cy="18" r="2" />
                        <circle cx="18" cy="18" r="2" />
                      </svg>
                    )}

                    {row.icon === "pin" && (
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                        <circle cx="12" cy="10" r="2.5" />
                      </svg>
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-[7px] text-black/40">{row.label}</p>
                    <p className="truncate text-[9px] font-semibold text-black">
                      {row.value}
                    </p>
                  </div>

                  {row.label === "Dirección" && (
                    <span className="text-[11px] text-black/25">›</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =======================================================
            NOTIFICACIÓN
            Se siente como una notificación que acaba de llegar.
           ======================================================= */}
        <div
          className="wolf-order absolute right-[-1%] top-[58px] z-30 rounded-[20px] border border-white/[0.11] bg-[#151515]/95 px-3.5 py-3 shadow-[0_20px_50px_rgba(0,0,0,.58),0_0_22px_rgba(249,115,22,.06)] backdrop-blur-xl"
          style={{
            animation: "wolfOrderFloat 4.2s ease-in-out infinite .4s",
          }}
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500/15">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white shadow-[0_0_14px_rgba(249,115,22,.35)]">
                ✓
              </span>
            </span>

            <div>
              <p className="text-[10px] font-semibold text-white">
                Pedido recibido
              </p>
              <p className="mt-0.5 text-[8px] text-white/40">
                Directo de tu cliente
              </p>
            </div>

            <span className="text-[9px] font-semibold text-orange-300">
              #1027
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================
          COPY
          Separado completamente del hero.
         ========================================================= */}
      <div className="relative z-40 mx-auto w-full max-w-md text-center">
        <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.32em] text-orange-400">
          WOLF ORDERING
        </p>

        <h1 className="text-[36px] font-semibold leading-[1.04] tracking-[-0.045em] text-white sm:text-5xl">
          Tu restaurante
          <br />
          merece su{" "}
          <span className="text-orange-400">propia app.</span>
        </h1>

        <p className="mx-auto mt-4 max-w-[320px] text-[14px] leading-6 text-white/50 sm:max-w-sm sm:text-[15px] sm:leading-7">
          Vende directamente a tus clientes con una experiencia de pedidos
          hecha para tu restaurante.
        </p>
      </div>
    </section>
  );
}