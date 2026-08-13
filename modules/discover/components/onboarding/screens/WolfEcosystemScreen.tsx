"use client";

export function WolfEcosystemScreen() {
  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 pb-36 pt-20">
      {/* Glows */}
      <div
        className="
          pointer-events-none absolute left-1/2 top-[20%]
          h-96 w-96 -translate-x-1/2
          rounded-full bg-orange-500/10
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none absolute bottom-[15%] right-[-120px]
          h-72 w-72 rounded-full
          bg-blue-500/10
          blur-[100px]
        "
      />

      {/* Visual principal */}
      <div className="relative mb-12 h-64 w-full max-w-sm">
        {/* App */}
        <div
          className="
            absolute left-[8%] top-8
            h-40 w-28
            rotate-[-8deg]
            rounded-[22px]
            border border-white/10
            bg-[#151515]
            p-1.5
            shadow-2xl
          "
        >
          <div className="h-full overflow-hidden rounded-[17px] bg-white">
            <div className="px-3 pb-2 pt-5">
              <div className="h-1.5 w-10 rounded-full bg-black/15" />
              <div className="mt-2 h-3 w-16 rounded-full bg-black/80" />
            </div>

            <div className="mx-2 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600" />

            <div className="space-y-1.5 px-2 pt-2">
              <div className="h-5 rounded-lg bg-black/[0.06]" />
              <div className="h-5 rounded-lg bg-black/[0.06]" />
              <div className="h-5 rounded-lg bg-black/[0.06]" />
            </div>
          </div>
        </div>

        {/* Panel */}
        <div
          className="
            absolute right-[6%] top-2
            w-52
            rounded-3xl
            border border-white/10
            bg-white/[0.07]
            p-4
            shadow-2xl
            backdrop-blur-xl
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] text-white/40">
                PANEL
              </p>

              <p className="mt-1 text-sm font-semibold text-white">
                Tu restaurante
              </p>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/15 text-xs text-orange-400">
              W
            </div>
          </div>

          {/* Métricas */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-black/20 p-2.5">
              <p className="text-[8px] text-white/35">
                PEDIDOS
              </p>

              <p className="mt-1 text-sm font-semibold text-white">
                24
              </p>
            </div>

            <div className="rounded-xl bg-black/20 p-2.5">
              <p className="text-[8px] text-white/35">
                VENTAS
              </p>

              <p className="mt-1 text-sm font-semibold text-white">
                $428
              </p>
            </div>
          </div>

          {/* Mini gráfico */}
          <div className="mt-3 flex h-12 items-end gap-1.5 rounded-xl bg-black/20 px-3 py-2">
            {[30, 45, 35, 60, 50, 75, 65].map((height, index) => (
              <div
                key={index}
                className="flex-1 rounded-full bg-orange-400/70"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>

        {/* Web */}
        <div
          className="
            absolute bottom-0 left-1/2
            w-52
            -translate-x-1/2
            rounded-2xl
            border border-white/10
            bg-[#121212]
            p-3
            shadow-xl
          "
        >
          <div className="mb-2 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400/70" />
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-400/70" />
            <span className="h-1.5 w-1.5 rounded-full bg-green-400/70" />

            <div className="ml-2 h-2 flex-1 rounded-full bg-white/10" />
          </div>

          <div className="rounded-xl bg-white/[0.04] p-3">
            <p className="text-[8px] uppercase tracking-widest text-orange-400">
              Tu restaurante
            </p>

            <p className="mt-1 text-xs font-semibold text-white">
              Pide directamente
            </p>

            <div className="mt-2 h-1.5 w-20 rounded-full bg-white/10" />
          </div>
        </div>

        {/* Conectores */}
        <div className="absolute left-1/2 top-1/2 h-px w-20 -translate-x-1/2 rotate-[-25deg] bg-gradient-to-r from-transparent via-orange-400/50 to-transparent" />

        <div className="absolute left-1/2 top-[48%] h-20 w-px -translate-x-1/2 bg-gradient-to-b from-orange-400/40 to-transparent" />
      </div>

      {/* Texto */}
      <div className="relative z-10 max-w-md text-center">
        <p
          className="
            mb-3 text-xs font-semibold uppercase
            tracking-[0.25em] text-orange-400
          "
        >
          TODO EN UN LUGAR
        </p>

        <h1
          className="
            text-4xl font-semibold
            leading-[1.05]
            tracking-[-0.04em]
            text-white
            sm:text-5xl
          "
        >
          Todo tu restaurante.
          <br />
          <span className="text-orange-400">
            En un solo lugar.
          </span>
        </h1>

        <p
          className="
            mx-auto mt-5 max-w-sm
            text-base leading-7
            text-white/55
          "
        >
          App, página y administración de pedidos
          conectados en un mismo ecosistema.
        </p>
      </div>
    </section>
  );
}