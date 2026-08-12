"use client";

import { Heart, Sparkles } from "lucide-react";

import type { Favorite } from "../../types/favorite";
import FavoriteCard from "./FavoriteCard";

interface FavoriteGridProps {
  favorites: Favorite[];
  onOpen: (favorite: Favorite) => void;
  onRemove: (restaurantId: string) => void;
}

export default function FavoriteGrid({
  favorites,
  onOpen,
  onRemove,
}: FavoriteGridProps) {
  if (!favorites.length) {
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes favoriteGridReveal {
          from {
            opacity: 0;
            transform: translateY(10px) scale(.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .favorite-grid-card {
          animation: favoriteGridReveal 420ms
            cubic-bezier(.22,1,.36,1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .favorite-grid-card {
            animation: none !important;
          }
        }
      `}</style>

      <section aria-label="Restaurantes favoritos">
        {/* Collection header */}
        <div className="mb-4 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-1.5 flex items-center gap-2">
              <span
                className="
                  flex h-7 w-7 items-center justify-center
                  rounded-[10px]
                  border border-orange-100
                  bg-orange-50
                  text-orange-500
                "
              >
                <Heart
                  size={13}
                  strokeWidth={2.2}
                  fill="currentColor"
                />
              </span>

              <span
                className="
                  text-[10px] font-bold uppercase
                  tracking-[0.14em] text-neutral-400
                "
              >
                Tu colección
              </span>
            </div>

            <h3
              className="
                text-[17px] font-bold tracking-[-0.035em]
                text-neutral-950
              "
            >
              Restaurantes guardados
            </h3>

            <p className="mt-0.5 text-[11px] text-neutral-400">
              {favorites.length === 1
                ? "1 restaurante en tu colección"
                : `${favorites.length} restaurantes en tu colección`}
            </p>
          </div>

          <div
            className="
              flex shrink-0 items-center gap-1.5
              rounded-full
              border border-neutral-100
              bg-neutral-50/90
              px-2.5 py-1.5
              text-[10px] font-semibold
              text-neutral-500
            "
          >
            <Sparkles
              size={11}
              className="text-orange-400"
              aria-hidden="true"
            />
            <span>Favoritos</span>
          </div>
        </div>

        {/* Premium two-column collection */}
        <div
          className="
            grid grid-cols-2
            gap-x-3 gap-y-4
            sm:gap-x-4 sm:gap-y-5
          "
        >
          {favorites.map((favorite, index) => (
            <div
              key={favorite.id}
              className="favorite-grid-card min-w-0"
              style={{
                animationDelay: `${Math.min(index * 55, 330)}ms`,
              }}
            >
              <FavoriteCard
                favorite={favorite}
                onOpen={onOpen}
                onRemove={onRemove}
              />
            </div>
          ))}
        </div>

        {/* Quiet collection footer */}
        <div
          className="
            mt-6 flex items-center justify-center gap-2
            pb-1 text-center
          "
        >
          <span className="h-px w-8 bg-neutral-100" />
          <span
            className="
              text-[9px] font-medium uppercase
              tracking-[0.16em] text-neutral-300
            "
          >
            Tu selección
          </span>
          <span className="h-px w-8 bg-neutral-100" />
        </div>
      </section>
    </>
  );
}