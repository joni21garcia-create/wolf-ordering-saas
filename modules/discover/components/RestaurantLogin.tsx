"use client";

import Link from "next/link";

export default function RestaurantLogin() {
  return (
    <section className="mt-12 rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">
        ¿Administras un restaurante?
      </h2>

      <p className="mt-2 text-sm text-gray-500">
        Inicia sesión para administrar tu menú, pedidos y configuración.
      </p>

      <Link
        href="/restaurant/login"
        className="
          mt-6
          inline-flex
          items-center
          justify-center
          rounded-xl
          bg-orange-500
          px-5
          py-3
          text-sm
          font-medium
          text-white
          transition-colors
          hover:bg-orange-600
        "
      >
        Iniciar sesión →
      </Link>
    </section>
  );
}