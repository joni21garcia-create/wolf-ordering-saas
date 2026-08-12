"use client";

import { ArrowUpRight, Heart, Sparkles } from "lucide-react";

import type { Favorite } from "../../types/favorite";

interface FavoriteCardProps {
  favorite: Favorite;
  onOpen: (favorite: Favorite) => void;
  onRemove: (restaurantId: string) => void;
}

export default function FavoriteCard({
  favorite,
  onOpen,
  onRemove,
}: FavoriteCardProps) {
  const isOpen =
    favorite.active && favorite.accepting_orders;

  const category =
    favorite.category?.trim() || "Restaurante";

  return (
    <article
      className="
        group relative overflow-hidden
        rounded-[26px]
        border border-white/70
        bg-white
        shadow-[0_8px_30px_rgba(15,23,42,0.07),0_1px_2px_rgba(15,23,42,0.04)]
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-[0_18px_45px_rgba(15,23,42,0.12),0_2px_6px_rgba(15,23,42,0.05)]
      "
    >
      <button
        type="button"
        onClick={() => onOpen(favorite)}
        aria-label={`Abrir ${favorite.name}`}
        className="
          relative block w-full overflow-hidden
          text-left focus:outline-none
          focus-visible:ring-2 focus-visible:ring-orange-500/50
          focus-visible:ring-inset
        "
      >
        <div className="relative aspect-[1.12/1] w-full overflow-hidden bg-neutral-100">
          {favorite.banner_url ? (
            <img
              src={favorite.banner_url}
              alt=""
              className="
                h-full w-full object-cover
                transition duration-700 ease-out
                group-hover:scale-[1.055]
              "
            />
          ) : favorite.logo_url ? (
            <div className="flex h-full w-full items-center justify-center bg-neutral-50 p-8">
              <img
                src={favorite.logo_url}
                alt=""
                className="max-h-[68%] max-w-[72%] rounded-3xl object-contain"
              />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-4xl font-semibold text-neutral-300">
              {favorite.name.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Soft editorial gradient */}
          <div
            className="
              pointer-events-none absolute inset-x-0 bottom-0 h-28
              bg-gradient-to-t from-black/35 via-black/5 to-transparent
            "
          />

          {/* Favorite action */}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onRemove(favorite.restaurant_id);
            }}
            aria-label={`Quitar ${favorite.name} de favoritos`}
            className="
              absolute right-3.5 top-3.5
              flex h-10 w-10 items-center justify-center
              rounded-full
              border border-white/50
              bg-white/92
              text-orange-500
              shadow-[0_6px_18px_rgba(0,0,0,0.14)]
              backdrop-blur-xl
              transition-all duration-200
              hover:scale-105 hover:bg-white
              active:scale-95
              focus:outline-none
              focus-visible:ring-2 focus-visible:ring-orange-500/50
            "
          >
            <Heart
              size={18}
              strokeWidth={2}
              fill="currentColor"
            />
          </button>

          {/* Availability pill */}
          <div
            className="
              absolute bottom-3.5 left-3.5
              inline-flex items-center gap-1.5
              rounded-full
              border border-white/60
              bg-white/92
              px-2.5 py-1.5
              text-[10px] font-semibold
              text-neutral-700
              shadow-[0_4px_14px_rgba(0,0,0,0.10)]
              backdrop-blur-xl
            "
          >
            <span
              className={`
                h-1.5 w-1.5 rounded-full
                ${isOpen ? "bg-emerald-500" : "bg-neutral-400"}
              `}
            />
            <span>
              {isOpen ? "Disponible" : "No disponible"}
            </span>
          </div>
        </div>
      </button>

      <div className="p-4">
        <button
          type="button"
          onClick={() => onOpen(favorite)}
          className="
            block w-full text-left
            focus:outline-none
            focus-visible:ring-2 focus-visible:ring-orange-500/40
            focus-visible:ring-offset-2
          "
        >
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <h3
                className="
                  truncate text-[15px] font-bold tracking-[-0.025em]
                  text-neutral-950
                "
              >
                {favorite.name}
              </h3>

              <div className="mt-1 flex items-center gap-1.5">
                <span className="truncate text-[11px] font-medium text-neutral-400">
                  {category}
                </span>

                <span className="h-1 w-1 rounded-full bg-neutral-300" />

                <span className="text-[11px] text-neutral-400">
                  Favorito
                </span>
              </div>
            </div>

            <span
              className="
                flex h-8 w-8 shrink-0 items-center justify-center
                rounded-full bg-neutral-50 text-neutral-400
                transition-all duration-200
                group-hover:bg-orange-50
                group-hover:text-orange-500
              "
              aria-hidden="true"
            >
              <ArrowUpRight size={15} strokeWidth={2.1} />
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onOpen(favorite)}
          className="
            mt-4 flex w-full items-center justify-between
            rounded-[14px]
            border border-neutral-100
            bg-neutral-50/80
            px-3.5 py-2.5
            text-[11px] font-semibold
            text-neutral-800
            transition-all duration-200
            hover:border-orange-100
            hover:bg-orange-50/70
            hover:text-orange-600
            active:scale-[0.985]
          "
        >
          <span>Ver restaurante</span>

          <span
            className="
              flex h-5 w-5 items-center justify-center
              rounded-full bg-white text-neutral-400
              shadow-sm
              transition-transform duration-200
              group-hover:translate-x-0.5
            "
            aria-hidden="true"
          >
            <ArrowUpRight size={12} strokeWidth={2.2} />
          </span>
        </button>
      </div>

      {/* Subtle premium accent */}
      <div
        className="
          pointer-events-none absolute left-4 top-4
          flex h-5 w-5 items-center justify-center
          rounded-full bg-white/10 text-white/80
          opacity-0 backdrop-blur-sm
          transition-opacity duration-300
          group-hover:opacity-100
        "
        aria-hidden="true"
      >
        <Sparkles size={10} />
      </div>
    </article>
  );
}