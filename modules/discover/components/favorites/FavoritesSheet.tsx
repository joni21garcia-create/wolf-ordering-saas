"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  Heart,
  Loader2,
  Sparkles,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase/client";

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

const styles = `
  @keyframes favoritesBackdropIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes favoritesPanelIn {
    from {
      opacity: 0;
      transform: translateX(24px) scale(.985);
    }
    to {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }

  @keyframes favoritesContentIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes favoritesShimmer {
    0% { transform: translateX(-120%); }
    100% { transform: translateX(120%); }
  }

  .favorites-backdrop {
    animation: favoritesBackdropIn 220ms ease-out both;
  }

  .favorites-panel {
    animation: favoritesPanelIn 360ms cubic-bezier(.22,1,.36,1) both;
  }

  .favorites-content {
    animation: favoritesContentIn 420ms cubic-bezier(.22,1,.36,1) 70ms both;
  }

  .favorites-scroll {
    scrollbar-width: thin;
    scrollbar-color: rgba(23,23,23,.14) transparent;
  }

  .favorites-scroll::-webkit-scrollbar {
    width: 6px;
  }

  .favorites-scroll::-webkit-scrollbar-track {
    background: transparent;
  }

  .favorites-scroll::-webkit-scrollbar-thumb {
    background: rgba(23,23,23,.12);
    border-radius: 999px;
  }

  .favorites-close:active {
    transform: scale(.92);
  }

  .favorites-close {
    transition:
      transform 150ms ease,
      background 180ms ease,
      color 180ms ease,
      box-shadow 180ms ease;
  }

  .favorites-close:hover {
    box-shadow: 0 8px 22px rgba(0,0,0,.07);
  }

  .favorites-loading-shimmer {
    position: relative;
    overflow: hidden;
  }

  .favorites-loading-shimmer::after {
    content: "";
    position: absolute;
    inset: 0;
    width: 55%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,.72),
      transparent
    );
    animation: favoritesShimmer 1.35s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .favorites-backdrop,
    .favorites-panel,
    .favorites-content,
    .favorites-loading-shimmer::after {
      animation: none !important;
    }

    .favorites-close {
      transition: none !important;
    }
  }
`;

export default function FavoritesSheet({
  open,
  onClose,
  onOpenRestaurant,
}: FavoritesSheetProps) {
  const router = useRouter();

  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);
  const [openingRestaurantId, setOpeningRestaurantId] = useState<string | null>(
    null,
  );

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
        console.error("[FAVORITES] Error cargando favoritos:", error);

        if (!cancelled) {
          setFavorites([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadFavorites();

    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  const handleRemove = async (restaurantId: string) => {
    const previous = favorites;

    setFavorites((current) =>
      current.filter(
        (favorite) => favorite.restaurant_id !== restaurantId,
      ),
    );

    try {
      const success = await removeFavorite(restaurantId);

      if (!success) {
        setFavorites(previous);
      }
    } catch (error) {
      console.error("[FAVORITES] Error eliminando favorito:", error);
      setFavorites(previous);
    }
  };

  const handleOpenRestaurant = async (favorite: Favorite) => {
    /*
     * Si el contenedor padre ya tiene una navegación propia,
     * la respetamos. Esto mantiene el componente reutilizable.
     */
    if (onOpenRestaurant) {
      onOpenRestaurant(favorite);
      return;
    }

    /*
     * Fallback directo y robusto:
     * Favorite usa restaurant_id, mientras que las páginas públicas
     * de restaurante utilizan /[slug].
     *
     * No dependemos de que Favorite tenga slug en su tipo.
     */
    if (!favorite.restaurant_id || openingRestaurantId) {
      return;
    }

    setOpeningRestaurantId(favorite.restaurant_id);

    try {
      const { data, error } = await supabase
        .from("restaurants")
        .select("slug")
        .eq("id", favorite.restaurant_id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      const slug =
        typeof data?.slug === "string" ? data.slug.trim() : "";

      if (!slug) {
        console.error(
          "[FAVORITES] El restaurante no tiene un slug válido:",
          favorite.restaurant_id,
        );
        return;
      }

      onClose();
      router.push(`/${slug}`);
    } catch (error) {
      console.error(
        "[FAVORITES] Error navegando al restaurante:",
        error,
      );
    } finally {
      setOpeningRestaurantId(null);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100]"
      role="dialog"
      aria-modal="true"
      aria-label="Mis favoritos"
    >
      <style>{styles}</style>

      {/* Backdrop */}
      <button
        type="button"
        aria-label="Cerrar favoritos"
        onClick={onClose}
        className="
          favorites-backdrop
          absolute inset-0
          cursor-default
          border-0
          bg-neutral-950/38
          p-0
          backdrop-blur-[7px]
        "
      />

      {/* Sheet */}
      <aside
        className="
          favorites-panel
          absolute right-0 top-0
          flex h-full w-full max-w-md
          flex-col
          overflow-hidden
          border-l border-white/70
          bg-white
          shadow-[-24px_0_70px_rgba(0,0,0,.16)]
        "
      >
        {/* Premium top glow */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute inset-x-0 top-0 z-10
            h-28
            bg-gradient-to-b
            from-orange-50/90
            via-orange-50/25
            to-transparent
          "
        />

        {/* Header */}
        <header
          className="
            relative z-20
            flex shrink-0 items-center justify-between
            border-b border-neutral-100/90
            bg-white/88
            px-5 pb-4 pt-5
            backdrop-blur-xl
          "
        >
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="
                flex h-11 w-11 shrink-0
                items-center justify-center
                rounded-[15px]
                border border-orange-100
                bg-gradient-to-br from-orange-50 to-white
                text-orange-500
                shadow-[0_8px_22px_rgba(249,115,22,.10)]
              "
            >
              <Heart
                size={19}
                strokeWidth={2}
                fill="currentColor"
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2
                  className="
                    truncate
                    text-[18px] font-bold
                    tracking-[-0.035em]
                    text-neutral-950
                  "
                >
                  Favoritos
                </h2>

                {!loading && favorites.length > 0 && (
                  <span
                    className="
                      rounded-full
                      border border-orange-100
                      bg-orange-50
                      px-2 py-0.5
                      text-[9px] font-bold
                      tracking-[0.08em]
                      text-orange-600
                    "
                  >
                    {favorites.length}
                  </span>
                )}
              </div>

              <p className="mt-0.5 text-[11px] text-neutral-400">
                Tus restaurantes guardados
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar favoritos"
            className="
              favorites-close
              flex h-9 w-9 shrink-0
              items-center justify-center
              rounded-full
              border border-neutral-100
              bg-white/90
              text-neutral-400
              hover:bg-neutral-50
              hover:text-neutral-900
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-orange-500/30
            "
          >
            <X size={17} strokeWidth={2} />
          </button>
        </header>

        {/* Content */}
        <div
          className="
            favorites-scroll
            min-h-0 flex-1
            overflow-y-auto
            bg-[linear-gradient(180deg,#fff_0%,#fcfcfb_100%)]
          "
        >
          <div className="favorites-content px-4 pb-7 pt-4">
            {loading ? (
              <FavoritesLoading />
            ) : favorites.length > 0 ? (
              <>
                <div
                  className="
                    mb-4 flex items-center justify-between
                    rounded-[18px]
                    border border-neutral-100
                    bg-neutral-50/75
                    px-3.5 py-3
                  "
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="
                        flex h-8 w-8 items-center justify-center
                        rounded-[11px]
                        bg-white
                        text-orange-500
                        shadow-[0_3px_12px_rgba(0,0,0,.045)]
                      "
                    >
                      <Sparkles size={14} strokeWidth={2} />
                    </div>

                    <div>
                      <p
                        className="
                          text-[10px] font-bold uppercase
                          tracking-[0.13em]
                          text-neutral-400
                        "
                      >
                        Tu selección
                      </p>
                      <p className="mt-0.5 text-[11px] text-neutral-600">
                        Lugares que quieres volver a visitar
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold text-neutral-300">
                    {favorites.length}
                  </span>
                </div>

                <FavoriteGrid
                  favorites={favorites}
                  onOpen={handleOpenRestaurant}
                  onRemove={handleRemove}
                />

                {openingRestaurantId && (
                  <div
                    className="
                      fixed inset-0 z-[120]
                      flex items-center justify-center
                      bg-neutral-950/10
                      backdrop-blur-[1px]
                    "
                    aria-live="polite"
                    aria-label="Abriendo restaurante"
                  >
                    <div
                      className="
                        flex items-center gap-2
                        rounded-full
                        border border-white/80
                        bg-white/95
                        px-4 py-2.5
                        text-xs font-semibold
                        text-neutral-700
                        shadow-[0_14px_40px_rgba(0,0,0,.14)]
                      "
                    >
                      <Loader2
                        size={14}
                        className="animate-spin text-orange-500"
                      />
                      Abriendo restaurante…
                    </div>
                  </div>
                )}
              </>
            ) : (
              <FavoritesEmpty onClose={onClose} />
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}

function FavoritesLoading() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="
            overflow-hidden
            rounded-[22px]
            border border-neutral-100
            bg-white
            shadow-[0_3px_18px_rgba(0,0,0,.035)]
          "
        >
          <div
            className="
              favorites-loading-shimmer
              aspect-[1.35/1]
              bg-neutral-100
            "
          />

          <div className="space-y-3 p-3.5">
            <div className="favorites-loading-shimmer h-4 w-3/4 rounded-lg bg-neutral-100" />
            <div className="favorites-loading-shimmer h-3 w-1/2 rounded-lg bg-neutral-100" />
            <div className="favorites-loading-shimmer h-9 w-full rounded-xl bg-neutral-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function FavoritesEmpty({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div
      className="
        flex min-h-[62vh]
        flex-col items-center justify-center
        px-8 text-center
      "
    >
      <div
        className="
          relative
          flex h-20 w-20
          items-center justify-center
          rounded-[26px]
          border border-orange-100
          bg-gradient-to-br from-orange-50 to-white
          text-orange-400
          shadow-[0_18px_45px_rgba(249,115,22,.10)]
        "
      >
        <div
          aria-hidden="true"
          className="
            absolute -inset-2
            rounded-[31px]
            border border-orange-100/50
          "
        />

        <Heart
          size={28}
          strokeWidth={1.65}
        />
      </div>

      <p
        className="
          mt-6
          text-[10px] font-bold uppercase
          tracking-[0.16em]
          text-orange-500/80
        "
      >
        Tu colección
      </p>

      <h3
        className="
          mt-2
          text-[18px] font-bold
          tracking-[-0.035em]
          text-neutral-950
        "
      >
        Aún no tienes favoritos
      </h3>

      <p
        className="
          mt-2 max-w-[260px]
          text-[12px] leading-5
          text-neutral-400
        "
      >
        Guarda los restaurantes que más te gusten y
        tendrás todos tus favoritos en un solo lugar.
      </p>

      <button
        type="button"
        onClick={onClose}
        className="
          mt-6 inline-flex items-center gap-2
          rounded-full
          bg-neutral-950
          px-4 py-2.5
          text-[11px] font-semibold
          text-white
          shadow-[0_10px_25px_rgba(0,0,0,.14)]
          transition
          hover:-translate-y-0.5
          hover:bg-neutral-800
          active:translate-y-0
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-orange-500/40
        "
      >
        <ArrowLeft size={13} />
        Explorar Discover
        <ChevronRight size={13} />
      </button>
    </div>
  );
}