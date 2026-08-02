import Link from "next/link";
import { ChefHat, ArrowRight } from "lucide-react";

export default function DiscoverHeader() {
  return (
    <header className="mb-6">
      {/* Encabezado */}
      <div>
        <span className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-3 py-1 text-sm font-semibold text-orange-400">
          🐺 Wolf Ordering
        </span>

        {/* Acceso Restaurante */}
        <Link
          href="https://app.wolfordering.com/login"
          target="_blank"
          rel="noopener noreferrer"
          className="
            group
            mt-4
            inline-flex
            items-center
            gap-3
            rounded-xl
            border
            border-orange-500/20
            bg-white/5
            px-4
            py-2.5
            backdrop-blur-sm
            transition-all
            duration-300
            hover:border-orange-400
            hover:bg-orange-500/10
            hover:shadow-lg
            hover:shadow-orange-500/20
          "
        >
          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              bg-orange-500/15
              text-orange-400
              transition-all
              duration-300
              group-hover:bg-orange-500
              group-hover:text-white
            "
          >
            <ChefHat className="h-5 w-5" />
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-xs uppercase tracking-wide text-zinc-400">
              Acceso
            </span>

            <span className="font-semibold text-white">
              Soy restaurante
            </span>
          </div>

          <ArrowRight
            className="
              h-4
              w-4
              text-zinc-500
              transition-all
              duration-300
              group-hover:translate-x-1
              group-hover:text-orange-400
            "
          />
        </Link>

        <h1 className="mt-6 text-2xl font-bold tracking-tight text-white md:text-3xl">
          ¿Qué deseas comer hoy? 👋
        </h1>

        <p className="mt-2 text-sm text-zinc-400">
          Explora los restaurantes más populares.
        </p>
      </div>

      {/* Categoría */}
      <div className="mt-8 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-semibold text-white">
          ⭐ Los mejores restaurantes de la ciudad
        </h2>
      </div>
    </header>
  );
}
