"use client";

import Link from "next/link";

export default function RestaurantLogin() {
  return (
    <section className="relative mt-14 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-10 shadow-2xl">
      {/* Glow */}
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-orange-500/15 blur-3xl" />
      <div className="absolute -left-12 bottom-0 h-40 w-40 rounded-full bg-orange-400/10 blur-3xl" />

      <div className="relative flex flex-col items-center text-center">
        <span className="inline-flex items-center rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1 text-sm font-semibold text-orange-400">
          🐺 Portal de Restaurantes
        </span>

        <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
          ¿Administras un restaurante?
        </h2>

        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
          Accede al panel administrativo para gestionar tu menú, recibir pedidos
          en tiempo real y mantener tu restaurante siempre actualizado.
        </p>

        <Link
          href="/restaurant/login"
          className="
            mt-8
            inline-flex
            items-center
            gap-2
            rounded-2xl
            bg-orange-500
            px-8
            py-4
            font-semibold
            text-white
            transition-all
            duration-300
            hover:scale-105
            hover:bg-orange-600
            hover:shadow-xl
            hover:shadow-orange-500/30
          "
        >
          Iniciar sesión
          <span aria-hidden="true">→</span>
        </Link>

        <p className="mt-5 text-sm text-zinc-500">
          Gestiona productos, categorías y pedidos desde un solo lugar.
        </p>
      </div>
    </section>
  );
}
