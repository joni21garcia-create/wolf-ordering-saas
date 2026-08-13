"use client";

export function DirectOrdersScreen() {
  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 pb-36 pt-20">
      {/* Glow */}
      <div
        className="
          pointer-events-none absolute right-[-120px] top-[28%]
          h-80 w-80 rounded-full
          bg-blue-500/15
          blur-[110px]
        "
      />

      <div
        className="
          pointer-events-none absolute bottom-[20%] left-[-140px]
          h-72 w-72 rounded-full
          bg-orange-500/10
          blur-[100px]
        "
      />

      {/* Visual */}
      <div className="relative mb-12 h-64 w-full max-w-sm">
        {/* Restaurant card */}
        <div
          className="
            absolute left-1/2 top-1/2
            w-[270px] -translate-x-1/2 -translate-y-1/2
            rotate-[-3deg]
            rounded-[28px]
            border border-white/10
            bg-white/[0.06]
            p-4
            shadow-2xl
            backdrop-blur-xl
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-12 w-12 shrink-0
                items-center justify-center
                rounded-2xl
                bg-gradient-to-br
                from-orange-400 to-orange-600
                text-lg
                font-bold
              "
            >
              W
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                Tu restaurante
              </p>

              <p className="text-xs text-white/40">
                Pedidos directos
              </p>
            </div>

            <span
              className="
                ml-auto h-2.5 w-2.5 rounded-full
                bg-emerald-400
                shadow-[0_0_12px_rgba(52,211,153,0.6)]
              "
            />
          </div>

          {/* Pedido */}
          <div
            className="
              mt-4 rounded-2xl
              bg-black/30
              p-4
            "
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/40">
                NUEVO PEDIDO
              </span>

              <span className="text-[10px] font-medium text-orange-400">
                #WOF-1024
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  María Camila
                </p>

                <p className="mt-1 text-[10px] text-white/40">
                  2 productos
                </p>
              </div>

              <p className="text-sm font-semibold text-white">
                $18.90
              </p>
            </div>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-1/2 rounded-full bg-orange-500" />
            </div>
          </div>
        </div>

        {/* Cliente */}
        <div
          className="
            absolute bottom-1 right-[calc(50%-150px)]
            rounded-2xl
            border border-white/10
            bg-[#161616]/90
            px-4 py-3
            shadow-xl
            backdrop-blur-xl
          "
        >
          <div className="flex items-center gap-2.5">
            <div
              className="
                flex h-8 w-8 items-center justify-center
                rounded-full
                bg-blue-500/15
                text-sm
              "
            >
              👤
            </div>

            <div>
              <p className="text-[10px] font-semibold text-white">
                Tu cliente
              </p>

              <p className="text-[9px] text-white/40">
                Pedido directo
              </p>
            </div>
          </div>
        </div>

        {/* Conector */}
        <div
          className="
            absolute left-1/2 top-1/2
            h-28 w-28 -translate-x-1/2 -translate-y-1/2
            rounded-full
            border border-dashed border-orange-400/20
          "
        />
      </div>

      {/* Texto */}
      <div className="relative z-10 max-w-md text-center">
        <p
          className="
            mb-3 text-xs font-semibold uppercase
            tracking-[0.25em] text-blue-400
          "
        >
          DIRECTO
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
          Tus pedidos.
          <br />
          Tus clientes.
          <br />
          <span className="text-orange-400">
            Tu negocio.
          </span>
        </h1>

        <p
          className="
            mx-auto mt-5 max-w-sm
            text-base leading-7
            text-white/55
          "
        >
          Recibe pedidos directamente desde tu propia
          app y mantén el control de tu negocio.
        </p>
      </div>
    </section>
  );
}