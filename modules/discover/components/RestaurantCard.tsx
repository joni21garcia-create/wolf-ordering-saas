"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { Restaurant } from "../types/restaurant";
import RestaurantStatus from "./RestaurantStatus";

import { favoriteService } from "@/services/favorite.service";
import { DISCOVER_CATEGORIES } from "@/lib/discover/categories";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({
  restaurant,
}: RestaurantCardProps) {

  const [isFavorite, setIsFavorite] =
    useState(false);

  const [loadingFavorite, setLoadingFavorite] =
    useState(false);

  /*
  ==========================================================
  FAVORITOS
  ==========================================================
  */

  useEffect(() => {

    let mounted = true;

    async function loadFavorite() {

      try {

        const favorite =
          await favoriteService.isFavorite(
            restaurant.id
          );

        if (mounted) {
          setIsFavorite(favorite);
        }

      } catch (error) {

        console.error(
          "Error cargando favorito:",
          error
        );

      }

    }

    loadFavorite();

    return () => {
      mounted = false;
    };

  }, [restaurant.id]);

  async function handleFavorite(
    e: React.MouseEvent<HTMLButtonElement>
  ) {

    e.preventDefault();
    e.stopPropagation();

    if (loadingFavorite) return;

    setLoadingFavorite(true);

    try {

      const favorite =
        await favoriteService.toggleFavorite(
          restaurant.id
        );

      setIsFavorite(favorite);

    } catch (error) {

      console.error(error);

    } finally {

      setLoadingFavorite(false);

    }

  }

  /*
  ==========================================================
  DATOS
  ==========================================================
  */

  const categoryLabel =

    DISCOVER_CATEGORIES.find(
      (item) =>
        item.id === restaurant.category
    )?.label ??

    restaurant.category ??

    "Restaurante";

  const preparationTime =

    restaurant.estimated_min_time !== null &&
    restaurant.estimated_max_time !== null

      ? `${restaurant.estimated_min_time}–${restaurant.estimated_max_time} min`

      : null;

  /*
  ==========================================================
  DISTINTIVOS
  ==========================================================
  */

  const featuredBadges: Record<
    string,
    {
      label: string;
      className: string;
    }
  > = {

    wolf: {
      label: "🐺 Recomendado por Wolf Ordering",
      className:
        "from-amber-400 via-orange-400 to-orange-500",
    },

    featured: {
      label: "⭐ Restaurante destacado",
      className:
        "from-yellow-400 via-amber-400 to-orange-500",
    },

    discover: {
      label: "🌟 Destacado en Discover",
      className:
        "from-cyan-400 via-sky-500 to-blue-600",
    },

    premium: {
      label: "🏆 Restaurante Premium",
      className:
        "from-purple-500 via-fuchsia-500 to-pink-500",
    },

    popular: {
      label: "🔥 Popular",
      className:
        "from-red-500 via-orange-500 to-yellow-500",
    },

    new: {
      label: "🆕 Nuevo",
      className:
        "from-emerald-500 via-green-500 to-lime-500",
    },

    promoted: {
      label: "🚀 Impulsado",
      className:
        "from-indigo-500 via-violet-500 to-fuchsia-500",
    },

  };

  const badge =

    restaurant.featured_type &&
    restaurant.featured_type !== "none"

      ? featuredBadges[
          restaurant.featured_type
        ]

      : undefined;

  return (

    <Link
      href={`/${restaurant.slug}`}
      className={`
        group
        block
        overflow-hidden
        rounded-2xl
        border
        bg-zinc-950
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl

        ${
          badge
            ? "border-amber-400/40 shadow-lg shadow-amber-500/10"
            : "border-white/10 hover:border-orange-500/40"
        }
      `}
    >
              {/* ========================================================== */}
      {/* BANNER */}
      {/* ========================================================== */}

      <div className="relative h-40 overflow-hidden">

        {restaurant.banner_url ? (

          <Image
            src={restaurant.banner_url}
            alt={restaurant.name}
            fill
            priority={false}
            className="
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />

        ) : (

          <div className="flex h-full items-center justify-center bg-zinc-900 text-xs text-zinc-500">

            Sin imagen

          </div>

        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        {/* ========================================================== */}
        {/* DISTINTIVO */}
        {/* ========================================================== */}

        {badge && (

          <div
            className={`
              absolute
              left-3
              top-3
              rounded-full
              bg-gradient-to-r
              ${badge.className}
              px-3
              py-1
              text-[11px]
              font-bold
              uppercase
              tracking-wide
              text-white
              shadow-lg
            `}
          >

            {badge.label}

          </div>

        )}

        {/* ========================================================== */}
        {/* FAVORITO */}
        {/* ========================================================== */}

        <button
          type="button"
          onClick={handleFavorite}
          disabled={loadingFavorite}
          className={`
            absolute
            right-3
            top-3
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            backdrop-blur
            transition-all
            duration-300

            ${
              isFavorite
                ? "bg-red-500 text-white"
                : "bg-black/50 text-white hover:bg-orange-500"
            }
          `}
        >
          ❤
        </button>

      </div>

      {/* ========================================================== */}
      {/* CONTENIDO */}
      {/* ========================================================== */}

      <div className="relative px-4 pb-4 pt-10">
                {/* ========================================================== */}
        {/* LOGO */}
        {/* ========================================================== */}

        <div className="absolute -top-7 left-4">

          <div
            className="
              h-14
              w-14
              overflow-hidden
              rounded-full
              border-2
              border-zinc-950
              bg-zinc-900
              shadow-lg
            "
          >

            {restaurant.logo_url ? (

              <Image
                src={restaurant.logo_url}
                alt={restaurant.name}
                width={56}
                height={56}
                className="h-full w-full object-cover"
              />

            ) : (

              <div className="flex h-full items-center justify-center text-[10px] text-zinc-500">

                Logo

              </div>

            )}

          </div>

        </div>

        {/* ========================================================== */}
        {/* NOMBRE */}
        {/* ========================================================== */}

        <h3 className="truncate text-lg font-bold text-white">

          {restaurant.name}

        </h3>

        {/* ========================================================== */}
        {/* CATEGORÍA */}
        {/* ========================================================== */}

        <div
          className="
            mt-2
            inline-flex
            items-center
            rounded-full
            bg-orange-500/10
            px-2.5
            py-1
            text-xs
            font-medium
            text-orange-400
          "
        >

          🍽️ {categoryLabel}

        </div>

        {/* ========================================================== */}
        {/* ESTADO */}
        {/* ========================================================== */}

        <div className="mt-5">

          <RestaurantStatus
            restaurant={restaurant}
          />

          {preparationTime && (

            <div className="mt-3">

              <span
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-orange-500/20
                  bg-orange-500/10
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  text-orange-300
                "
              >

                🕒 {preparationTime}

              </span>

            </div>

          )}

        </div>
                {/* ========================================================== */}
        {/* DIRECCIÓN */}
        {/* ========================================================== */}

        {restaurant.address && (

          <div
            className="
              mt-4
              flex
              items-start
              gap-2
              text-xs
              leading-5
              text-zinc-500
            "
          >

            <span className="mt-[1px]">

              📍

            </span>

            <span className="line-clamp-2">

              {restaurant.address}

            </span>

          </div>

        )}

      </div>

    </Link>

  );

}