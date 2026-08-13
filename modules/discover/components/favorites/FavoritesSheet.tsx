"use client";

import { useEffect, useState } from "react";

import { WolfSheet } from "@/lib/wolf-ui";

import type { Favorite } from "../../types/favorite";
import {
  getFavorites,
  removeFavorite,
} from "../../services/favorites";

import FavoriteGrid from "./FavoriteGrid";

interface FavoritesSheetProps {
  open: boolean;
  onClose: () => void;
  onOpenRestaurant?: (favorite: Favorite) => void;
}

export default function FavoritesSheet({
  open,
  onClose,
  onOpenRestaurant,
}: FavoritesSheetProps) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;

    async function loadFavorites() {
      setLoading(true);

      try {
        const data = await getFavorites();

        if (!cancelled) {
          setFavorites(data);
        }
      } catch (error) {
        console.error(
          "[FAVORITES] Error cargando favoritos:",
          error
        );

        if (!cancelled) {
          setFavorites([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadFavorites();

    return () => {
      cancelled = true;
    };
  }, [open]);

  const handleRemove = async (restaurantId: string) => {
    const previous = favorites;

    setFavorites((current) =>
      current.filter(
        (favorite) =>
          favorite.restaurant_id !== restaurantId
      )
    );

    const success = await removeFavorite(
      restaurantId
    );

    if (!success) {
      setFavorites(previous);
    }
  };

  const handleOpenRestaurant = (
    favorite: Favorite
  ) => {
    if (onOpenRestaurant) {
      onOpenRestaurant(favorite);
      return;
    }

    onClose();
  };

  if (!open) {
    return null;
  }

  return (
    <WolfSheet
      open={open}
      onClose={onClose}
      title="Favoritos"
      subtitle="Tus restaurantes guardados"
      ariaLabel="Mis favoritos"
      dismissible
      showCloseButton
      maxWidth={520}
      tone="light"
    >
      {loading ? (
        <FavoritesLoading />
      ) : favorites.length > 0 ? (
        <div className="p-4">
          <FavoriteGrid
            favorites={favorites}
            onOpen={handleOpenRestaurant}
            onRemove={handleRemove}
          />
        </div>
      ) : (
        <FavoritesEmpty />
      )}
    </WolfSheet>
  );
}

function FavoritesLoading() {
  return (
    <div
      className="
        grid
        grid-cols-2
        gap-3
        p-4
      "
    >
      {Array.from({ length: 4 }).map(
        (_, index) => (
          <div
            key={index}
            className="
              overflow-hidden
              rounded-[22px]
              border
              border-neutral-100
              bg-white
            "
          >
            <div
              className="
                aspect-[1.35/1]
                animate-pulse
                bg-neutral-100
              "
            />

            <div className="space-y-3 p-3.5">
              <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-100" />

              <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-100" />

              <div className="h-8 w-full animate-pulse rounded-xl bg-neutral-100" />
            </div>
          </div>
        )
      )}
    </div>
  );
}

function FavoritesEmpty() {
  return (
    <div
      className="
        flex
        min-h-[60vh]
        flex-col
        items-center
        justify-center
        px-8
        text-center
      "
    >
      <div
        className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          bg-neutral-100
          text-neutral-400
        "
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
        </svg>
      </div>

      <h3
        className="
          mt-4
          text-base
          font-semibold
          text-neutral-900
        "
      >
        Aún no tienes favoritos
      </h3>

      <p
        className="
          mt-1.5
          max-w-xs
          text-sm
          leading-6
          text-neutral-400
        "
      >
        Guarda tus restaurantes favoritos
        y aparecerán aquí.
      </p>
    </div>
  );
}