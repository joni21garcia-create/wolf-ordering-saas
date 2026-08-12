"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Star } from "lucide-react";
import { useEffect, useMemo, useState, type CSSProperties } from "react";

import { DISCOVER_CATEGORIES } from "@/lib/discover/categories";
import { getRestaurantStatus } from "@/lib/schedule";
import { favoriteService } from "@/services/favorite.service";
import type { Restaurant } from "@/modules/discover/types/restaurant";
import DiscoverBadge from "@/modules/discover/components/DiscoverBadge";
import {
  calculateDistanceKm,
  formatDistance,
} from "@/modules/discover/utils/distance";

interface DiscoverRestaurantCardProps {
  restaurant: Restaurant;
  priority?: boolean;
  compact?: boolean;
  userLocation?: {
    latitude: number;
    longitude: number;
  } | null;
}


function getCategoryLabel(category: string | null): string {
  if (!category) return "Restaurante";

  return (
    DISCOVER_CATEGORIES.find((item) => item.id === category)?.label ??
    category
  );
}

const styles = `
.discover-card {
  position: relative;
  transform: translateZ(0);
  border-radius: 22px;
  transition:
    transform 220ms cubic-bezier(.2,.8,.2,1),
    border-color 220ms ease,
    box-shadow 220ms ease;
  box-shadow:
    0 12px 28px rgba(0,0,0,.20),
    0 2px 7px rgba(0,0,0,.14),
    inset 0 1px 0 rgba(255,255,255,.055);
}

.discover-card::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 3;
  border-radius: inherit;
  pointer-events: none;
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,.025),
    inset 0 1px 0 rgba(255,255,255,.055);
}

.discover-card:hover {
  transform: translateY(-2px);
  border-color: rgba(255,255,255,.14) !important;
  box-shadow:
    0 17px 38px rgba(0,0,0,.25),
    0 6px 16px rgba(0,0,0,.14),
    0 0 0 1px rgba(255,255,255,.025);
}

.discover-card:active {
  transform: scale(.987);
}

.discover-card--premium {
  border-color: rgba(251,191,36,.14) !important;
  box-shadow:
    0 14px 32px rgba(0,0,0,.22),
    0 0 22px rgba(251,191,36,.045),
    inset 0 1px 0 rgba(255,244,190,.06);
}

.discover-card--premium:hover {
  border-color: rgba(251,191,36,.24) !important;
  box-shadow:
    0 19px 42px rgba(0,0,0,.27),
    0 0 26px rgba(251,191,36,.06),
    inset 0 1px 0 rgba(255,244,190,.08);
}

.discover-card-image {
  transition: transform 520ms cubic-bezier(.2,.7,.2,1), filter 260ms ease;
}

.discover-card:hover .discover-card-image {
  transform: scale(1.035);
}

.discover-card--premium:hover .discover-card-image {
  filter: saturate(1.025) contrast(1.01);
}

.discover-card-favorite {
  transition:
    transform 160ms ease,
    background 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease;
}

.discover-card-favorite:hover {
  background: rgba(8,8,8,.72) !important;
  border-color: rgba(255,255,255,.16) !important;
  box-shadow: 0 8px 20px rgba(0,0,0,.22);
}

.discover-card-favorite:active {
  transform: scale(.90);
}

@media (prefers-reduced-motion: reduce) {
  .discover-card,
  .discover-card-image,
  .discover-card-favorite {
    transition: none !important;
  }
}


`;

export default function DiscoverRestaurantCard({
  restaurant,
  priority = false,
  compact = false,
  userLocation = null,
}: DiscoverRestaurantCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadFavorite = async () => {
      try {
        const value = await favoriteService.isFavorite(restaurant.id);

        if (mounted) setIsFavorite(value);
      } catch (error) {
        console.error("[DISCOVER] Error cargando favorito:", error);
      }
    };

    void loadFavorite();

    return () => {
      mounted = false;
    };
  }, [restaurant.id]);

  const status = useMemo(
    () => getRestaurantStatus(restaurant.schedule_settings),
    [restaurant.schedule_settings],
  );

  const isOpen = restaurant.accepting_orders && status.isOpen;
  const categoryLabel = getCategoryLabel(restaurant.category);
  const isPremium = restaurant.featured_type === "premium";

  const preparationTime =
    restaurant.estimated_min_time !== null &&
    restaurant.estimated_max_time !== null
      ? `${restaurant.estimated_min_time}–${restaurant.estimated_max_time} min`
      : null;

  const distance = useMemo(() => {
    if (!userLocation) return null;

    return formatDistance(
      calculateDistanceKm(userLocation, {
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
      }),
    );
  }, [
    userLocation,
    restaurant.latitude,
    restaurant.longitude,
  ]);


  const handleFavorite = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (favoriteLoading) return;

    setFavoriteLoading(true);

    try {
      const value = await favoriteService.toggleFavorite(restaurant.id);
      setIsFavorite(value);
    } catch (error) {
      console.error("[DISCOVER] Error actualizando favorito:", error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>

      <Link
        href={`/${restaurant.slug}`}
        aria-label={`Abrir ${restaurant.name}`}
        className="group block min-w-0"
        style={{
          textDecoration: "none",
          color: "inherit",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <article
          className={`discover-card ${isPremium ? "discover-card--premium" : ""}`.trim()}
          style={{
            width: "100%",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.075)",
            borderRadius: compact ? "20px" : "22px",
            background:
              "linear-gradient(180deg, rgba(255,255,255,.052), rgba(255,255,255,.034))",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: compact ? "16 / 10" : "1.92 / 1",
              overflow: "hidden",
              background: "#111",
            }}
          >
            {restaurant.banner_url ? (
              <Image
                src={restaurant.banner_url}
                alt={restaurant.name}
                fill
                priority={priority}
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                className="discover-card-image"
                style={{ objectFit: "cover" }}
              />
            ) : restaurant.logo_url ? (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(135deg, rgba(249,115,22,.14), rgba(255,255,255,.035))",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: 68,
                    height: 68,
                    overflow: "hidden",
                    borderRadius: 20,
                    background: "#111",
                  }}
                >
                  <Image
                    src={restaurant.logo_url}
                    alt=""
                    fill
                    sizes="68px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            ) : (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(255,255,255,.38)",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Wolf Ordering
              </div>
            )}

            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,.06), rgba(0,0,0,.58))",
                pointerEvents: "none",
              }}
            />

            <DiscoverBadge
              type={restaurant.featured_type}
              style={{
                position: "absolute",
                top: 10,
                left: 10,
              }}
            />

            <button
              type="button"
              onClick={handleFavorite}
              disabled={favoriteLoading}
              aria-label={
                isFavorite
                  ? `Quitar ${restaurant.name} de favoritos`
                  : `Agregar ${restaurant.name} a favoritos`
              }
              aria-pressed={isFavorite}
              className="discover-card-favorite"
              style={{
                position: "absolute",
                top: 9,
                right: 9,
                width: 38,
                height: 38,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(255,255,255,.10)",
                borderRadius: 999,
                background: "rgba(8,8,8,.58)",
                backdropFilter: "blur(12px)",
                color: isFavorite ? "#f97316" : "#fff",
                cursor: favoriteLoading ? "wait" : "pointer",
                opacity: favoriteLoading ? 0.65 : 1,
                WebkitTapHighlightColor: "transparent",
                transition: "transform 150ms ease",
              }}
            >
              <Heart
                size={18}
                strokeWidth={2}
                fill={isFavorite ? "currentColor" : "none"}
                aria-hidden="true"
              />
            </button>
          </div>

          <div style={{ padding: compact ? 11 : 13 }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <h3
                  style={{
                    margin: 0,
                    overflow: "hidden",
                    color: "#fff",
                    fontSize: compact ? 15 : 16,
                    lineHeight: 1.2,
                    fontWeight: 780,
                    letterSpacing: "-.025em",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {restaurant.name}
                </h3>

                <p
                  style={{
                    margin: "5px 0 0",
                    overflow: "hidden",
                    color: "rgba(255,255,255,.50)",
                    fontSize: 12,
                    lineHeight: 1.3,
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {categoryLabel}
                </p>
              </div>

              {restaurant.rating !== null &&
              restaurant.rating !== undefined ? (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    flexShrink: 0,
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  <Star
                    size={13}
                    fill="currentColor"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  {restaurant.rating.toFixed(1)}
                </span>
              ) : null}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 6,
                marginTop: 9,
                color: "rgba(255,255,255,.54)",
                fontSize: 11,
                lineHeight: 1.3,
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  color: isOpen
                    ? "#34d399"
                    : "rgba(255,255,255,.45)",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    background: "currentColor",
                  }}
                />
                {isOpen ? "Abierto" : "Cerrado"}
              </span>

              {preparationTime ? (
                <>
                  <span
                    aria-hidden="true"
                    style={{
                      width: 3,
                      height: 3,
                      borderRadius: 999,
                      background: "rgba(255,255,255,.24)",
                    }}
                  />
                  <span>{preparationTime}</span>
                </>
              ) : null}

              {distance ? (
                <>
                  <span
                    aria-hidden="true"
                    style={{
                      width: 3,
                      height: 3,
                      borderRadius: 999,
                      background: "rgba(255,255,255,.20)",
                    }}
                  />
                  <span
                    aria-label={`Distancia ${distance}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 3,
                      color: "rgba(255,255,255,.48)",
                      fontSize: 10.5,
                      fontWeight: 550,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    <MapPin
                      size={10}
                      strokeWidth={1.65}
                      aria-hidden="true"
                      style={{
                        opacity: 0.72,
                        flexShrink: 0,
                      }}
                    />
                    {distance}
                  </span>
                </>
              ) : null}
            </div>
          </div>
        </article>
      </Link>
    </>
  );
}