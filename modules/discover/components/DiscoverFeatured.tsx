"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Clock3, Heart, MapPin, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { favoriteService } from "@/services/favorite.service";
import { getRestaurantStatus } from "@/lib/schedule";
import type { Restaurant } from "@/modules/discover/types/restaurant";
import DiscoverBadge from "@/modules/discover/components/DiscoverBadge";
import {
  calculateDistanceKm,
  formatDistance,
} from "@/modules/discover/utils/distance";

interface DiscoverFeaturedProps {
  restaurants: Restaurant[];
  onViewAll?: () => void;
  userLocation?: {
    latitude: number;
    longitude: number;
  } | null;
}

const sectionStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const headingRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  color: "#fff",
  fontSize: "17px",
  lineHeight: 1.2,
  fontWeight: 750,
  letterSpacing: "-0.025em",
};

const actionStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "2px",
  padding: 0,
  border: 0,
  background: "transparent",
  color: "rgba(255,255,255,0.55)",
  fontSize: "12px",
  fontWeight: 650,
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
};

const scrollStyle: React.CSSProperties = {
  display: "flex",
  gap: "12px",
  width: "100%",
  overflowX: "auto",
  overflowY: "hidden",
  padding: "2px 2px 7px",
  scrollbarWidth: "none",
  WebkitOverflowScrolling: "touch",
  overscrollBehaviorX: "contain",
};

const cardStyle: React.CSSProperties = {
  position: "relative",
  flex: "0 0 min(74vw, 292px)",
  overflow: "hidden",
  aspectRatio: "1.22 / 1",
  borderRadius: "24px",
  border: "1px solid rgba(255,255,255,0.10)",
  background: "#0b0b0b",
  textDecoration: "none",
  color: "#fff",
  WebkitTapHighlightColor: "transparent",
  boxShadow:
    "0 18px 44px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.055)",
  transition:
    "transform 220ms cubic-bezier(.2,.8,.2,1), border-color 220ms ease, box-shadow 220ms ease",
};

const favoriteButtonStyle: React.CSSProperties = {
  position: "absolute",
  top: "11px",
  right: "11px",
  width: "38px",
  height: "38px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "999px",
  background: "rgba(0,0,0,0.52)",
  color: "#fff",
  backdropFilter: "blur(10px)",
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
};

const overlayStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(to bottom, rgba(0,0,0,0.04) 18%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.88) 100%)",
  pointerEvents: "none",
};

const contentStyle: React.CSSProperties = {
  position: "absolute",
  left: "13px",
  right: "13px",
  bottom: "13px",
};


const featuredPremiumCss = `
.discover-featured-card {
  transform: translateZ(0);
  transition:
    transform 220ms cubic-bezier(.2,.8,.2,1),
    border-color 220ms ease,
    box-shadow 220ms ease;
  will-change: transform;
}

.discover-featured-card:hover,
.discover-featured-card:focus-visible {
  transform: translateY(-4px);
  border-color: rgba(255,255,255,.17) !important;
  box-shadow:
    0 24px 54px rgba(0,0,0,.34),
    0 8px 22px rgba(0,0,0,.16),
    inset 0 1px 0 rgba(255,255,255,.075) !important;
}

.discover-featured-card:active {
  transform: translateY(-1px) scale(.992);
}

.discover-featured-card--premium:hover,
.discover-featured-card--premium:focus-visible {
  border-color: rgba(251,191,36,.30) !important;
  box-shadow:
    0 26px 58px rgba(0,0,0,.34),
    0 0 28px rgba(251,191,36,.055),
    inset 0 1px 0 rgba(255,244,190,.09) !important;
}

.discover-featured-image {
  transition: transform 500ms cubic-bezier(.2,.7,.2,1), filter 260ms ease;
}

.discover-featured-card:hover .discover-featured-image,
.discover-featured-card:focus-visible .discover-featured-image {
  transform: scale(1.035);
}

.discover-featured-card--premium:hover .discover-featured-image {
  filter: saturate(1.025) contrast(1.01);
}

.discover-featured-favorite {
  transition:
    transform 160ms ease,
    background 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease;
}

.discover-featured-favorite:hover {
  background: rgba(8,8,8,.72) !important;
  border-color: rgba(255,255,255,.17) !important;
  box-shadow: 0 8px 20px rgba(0,0,0,.24);
}

.discover-featured-favorite:active {
  transform: scale(.90);
}

@media (prefers-reduced-motion: reduce) {
  .discover-featured-card,
  .discover-featured-image,
  .discover-featured-favorite {
    transition: none !important;
  }
}
`;






function FeaturedCard({
  restaurant,
  userLocation = null,
}: {
  restaurant: Restaurant;
  userLocation?: {
    latitude: number;
    longitude: number;
  } | null;
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const value = await favoriteService.isFavorite(restaurant.id);
        if (mounted) setIsFavorite(value);
      } catch (error) {
        console.error("[DISCOVER] Error cargando favorito destacado:", error);
      }
    };

    void load();

    return () => {
      mounted = false;
    };
  }, [restaurant.id]);

  const status = useMemo(
    () => getRestaurantStatus(restaurant.schedule_settings),
    [restaurant.schedule_settings],
  );

  const isOpen = restaurant.accepting_orders && status.isOpen;
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
      console.error("[DISCOVER] Error actualizando favorito destacado:", error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <>
      <Link
      href={`/${restaurant.slug}`}
      style={cardStyle}
      aria-label={`Abrir ${restaurant.name}`}
      className={`group discover-featured-card ${
        isPremium ? "discover-featured-card--premium" : ""
      }`.trim()}
      tabIndex={0}
    >
      {restaurant.banner_url ? (
        <Image
          src={restaurant.banner_url}
          alt={restaurant.name}
          fill
          sizes="(max-width: 640px) 74vw, 292px"
          style={{
            objectFit: "cover",
            transition: "transform 350ms ease",
          }}
          className="group-hover:scale-[1.04] discover-featured-image"
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
              "linear-gradient(135deg, rgba(249,115,22,0.20), rgba(255,255,255,0.03))",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "84px",
              height: "84px",
              overflow: "hidden",
              borderRadius: "24px",
            }}
          >
            <Image
              src={restaurant.logo_url}
              alt=""
              fill
              sizes="84px"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      ) : null}

      <div style={overlayStyle} />

      <DiscoverBadge
        type={restaurant.featured_type}
        size="md"
        style={{
          position: "absolute",
          top: 11,
          left: 11,
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
        className="discover-featured-favorite"
        style={{
          ...favoriteButtonStyle,
          color: isFavorite ? "#f97316" : "#fff",
          opacity: favoriteLoading ? 0.65 : 1,
        }}
      >
        <Heart
          size={18}
          strokeWidth={2}
          fill={isFavorite ? "currentColor" : "none"}
          aria-hidden="true"
        />
      </button>

      <div style={contentStyle}>
        <h3
          style={{
            margin: 0,
            overflow: "hidden",
            fontSize: "18px",
            lineHeight: 1.1,
            fontWeight: 800,
            letterSpacing: "-0.035em",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {restaurant.name}
        </h3>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "8px",
            marginTop: "6px",
            color: "rgba(255,255,255,0.72)",
            fontSize: "10.5px",
            fontWeight: 600,
          }}
        >
          {restaurant.rating !== null &&
          restaurant.rating !== undefined ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <Star
                size={12}
                fill="currentColor"
                strokeWidth={1.8}
                aria-hidden="true"
              />
              {restaurant.rating.toFixed(1)}
            </span>
          ) : null}

          <span
            style={{
              width: "3px",
              height: "3px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.35)",
            }}
            aria-hidden="true"
          />

          <span
            style={{
              color: isOpen ? "#34d399" : "rgba(255,255,255,0.58)",
            }}
          >
            ● {isOpen ? "Abierto" : "Cerrado"}
          </span>

          {preparationTime ? (
            <>
              <span
                style={{
                  width: "3px",
                  height: "3px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.35)",
                }}
                aria-hidden="true"
              />
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <Clock3 size={11} strokeWidth={2} aria-hidden="true" />
                {preparationTime}
              </span>
            </>
          ) : null}
          {distance ? (
            <>
              <span
                style={{
                  width: "3px",
                  height: "3px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.22)",
                }}
                aria-hidden="true"
              />
              <span
                className="discover-featured-distance"
                aria-label={`Distancia ${distance}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 3,
                  color: "rgba(255,255,255,.50)",
                  fontSize: 10.5,
                  fontWeight: 550,
                  letterSpacing: "-0.01em",
                }}
              >
                <MapPin
                  size={10}
                  strokeWidth={1.65}
                  aria-hidden="true"
                  style={{ opacity: 0.72, flexShrink: 0 }}
                />
                {distance}
              </span>
            </>
          ) : null}
        </div>
      </div>
    </Link>
    </>
  );
}

export default function DiscoverFeatured({
  restaurants,
  onViewAll,
  userLocation = null,
}: DiscoverFeaturedProps) {
  const featured = [...restaurants].sort(
    (a, b) => (a.featured_order ?? 9999) - (b.featured_order ?? 9999),
  );

  if (featured.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="discover-featured-title"
      style={sectionStyle}
    >
      <div style={headingRowStyle}>
        <h2 id="discover-featured-title" style={titleStyle}>
          Destacados
        </h2>

        {onViewAll ? (
          <button
            type="button"
            onClick={onViewAll}
            style={actionStyle}
            aria-label="Ver todos los restaurantes destacados"
          >
            Ver todos
            <ChevronRight size={14} strokeWidth={2} aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <div
        style={scrollStyle}
        className="discover-featured-scroll"
        aria-label="Restaurantes destacados"
      >
        {featured.map((restaurant) => (
          <FeaturedCard
            key={restaurant.id}
            restaurant={restaurant}
            userLocation={userLocation}
          />
        ))}
      </div>
    </section>
  );
}