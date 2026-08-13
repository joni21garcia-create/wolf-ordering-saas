"use client";

export function ActivationScreen() {
  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 pb-36 pt-20">
      {/* Glow principal */}
      <div
        className="
          pointer-events-none absolute left-1/2 top-[24%]
          h-96 w-96 -translate-x-1/2
          rounded-full bg-orange-500/15
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none absolute bottom-[-100px] left-[-100px]
          h-72 w-72 rounded-full
          bg-blue-500/10
          blur-[100px]
        "
      />

      {/* Visual */}
      <div className="relative mb-12 flex h-64 w-full max-w-sm items-center justify-center">
        {/* Círculo exterior */}
        <div
          className="
            absolute h-56 w-56 rounded-full
            border border-orange-400/10
          "
        />

        <div
          className="
            absolute h-44 w-44 rounded-full
            border border-orange-400/10
          "
        />

        {/* Centro */}
        <div
          className="
            relative flex h-32 w-32
            flex-col items-center justify-center
            rounded-[2.5rem]
            border border-white/10
            bg-white/[0.07]
            shadow-2xl
            shadow-orange-500/10
            backdrop-blur-xl
          "
        >
          <div
            className="
              flex h-14 w-14 items-center justify-center
              rounded-2xl
              bg-gradient-to-br
              from-orange-400 to-orange-600
              text-xl font-bold
              shadow-lg shadow-orange-500/20
            "
          >
            W
          </div>

          <span className="mt-2 text-[9px] font-medium uppercase tracking-[0.18em] text-white/40">
            Wolf
          </span>
        </div>

        {/* Badge 24–72h */}
        <div
          className="
            absolute right-[calc(50%-145px)] top-6
            rounded-2xl
            border border-orange-400/20
            bg-orange-500/10
            px-4 py-3
            shadow-xl
            backdrop-blur-xl
          "
        >
          <p className="text-[9px] font-medium uppercase tracking-wider text-orange-300">
            Activación
          </p>

          <p className="mt-1 text-sm font-semibold text-white">
            24–72 h
          </p>
        </div>

        {/* Badge configuración */}
        <div
          className="
            absolute bottom-5 left-[calc(50%-145px)]
            rounded-2xl
            border border-white/10
            bg-[#151515]/90
            px-4 py-3
            shadow-xl
            backdrop-blur-xl
          "
        >
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">
              ✓
            </span>

            <div>
              <p className="text-[10px] font-semibold text-white">
                Configuración
              </p>

              <p className="text-[9px] text-white/40">
                Tu restaurante
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Texto */}
      <div className="relative z-10 max-w-md text-center">
        <p
          className="
            mb-3 text-xs font-semibold uppercase
            tracking-[0.25em] text-orange-400
          "
        >
          ESTÁS A UN PASO
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
          Tu app.
          <br />
          <span className="text-orange-400">
            Tu restaurante.
          </span>
        </h1>

        <p
          className="
            mx-auto mt-5 max-w-sm
            text-base leading-7
            text-white/55
          "
        >
          Elige tu plan, completa la información de tu
          restaurante y nosotros nos encargamos de configurarlo.
        </p>

        {/* Tiempo de activación */}
        <div
          className="
            mx-auto mt-7 flex max-w-sm items-center
            justify-center gap-3
            rounded-2xl
            border border-white/10
            bg-white/[0.04]
            px-5 py-4
            text-left
          "
        >
          <div
            className="
              flex h-9 w-9 shrink-0
              items-center justify-center
              rounded-xl
              bg-orange-500/10
              text-orange-400
            "
          >
            ⏱
          </div>

          <div>
            <p className="text-xs font-semibold text-white">
              Activación estimada: 24–72 horas
            </p>

            <p className="mt-0.5 text-[10px] leading-4 text-white/40">
              Después de completar el proceso y enviar la información.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}