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
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadFavorite = async () => {
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
    };

    loadFavorite();

    return () => {
      mounted = false;
    };
  }, [restaurant.id]);

  const handleFavorite = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
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
  };

const categoryLabel =
  DISCOVER_CATEGORIES.find(
    (item) => item.id === restaurant.category
  )?.label ??
  restaurant.category ??
  "Restaurante";

  return (
    <Link
      href={`/${restaurant.slug}`}
      className="
        group
        block
        overflow-hidden
        rounded-2xl
        border
        border-white/10
        bg-zinc-950
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-orange-500/40
        hover:shadow-xl
      "
    >
      {/* ================= Banner ================= */}

      <div className="relative h-40 w-full overflow-hidden">

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

        {/* Favorito */}

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

      {/* ================= Contenido ================= */}

      <div className="relative px-4 pb-4 pt-10">

        {/* Logo */}

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

        {/* Nombre */}

        <h3 className="truncate text-lg font-bold text-white">
          {restaurant.name}
        </h3>

        {/* Categoría */}

<div className="mt-2 inline-flex items-center rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-medium text-orange-400">
  🍽️ {categoryLabel}
</div>
               {/* ================= Estado + Tiempo ================= */}

<div className="mt-4 flex items-start justify-between gap-4">
  <RestaurantStatus restaurant={restaurant} />

  {restaurant.estimated_min_time !== null &&
    restaurant.estimated_max_time !== null && (
      <span className="shrink-0 text-xs font-medium text-zinc-400">
        {restaurant.estimated_min_time}–{restaurant.estimated_max_time} min
      </span>
    )}
</div>
        {/* Dirección */}

        {restaurant.address && (
          <div className="mt-3 flex items-center gap-1 text-xs text-zinc-500">
            <span>📍</span>

            <span className="truncate">
              {restaurant.address}
            </span>
          </div>
        )}

      </div>
    </Link>
  );
}