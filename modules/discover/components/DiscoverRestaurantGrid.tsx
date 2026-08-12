"use client";

import type { CSSProperties } from "react";

import type { Restaurant } from "@/modules/discover/types/restaurant";
import DiscoverRestaurantCard from "./DiscoverRestaurantCard";

interface DiscoverRestaurantGridProps {
  restaurants: Restaurant[];
  loading?: boolean;
  emptyMessage?: string;
  priorityFirst?: boolean;
  userLocation?: {
    latitude: number;
    longitude: number;
  } | null;
}

const sectionStyle: CSSProperties = {
  width: "100%",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
  gap: "14px",
  width: "100%",
};

const emptyStyle: CSSProperties = {
  width: "100%",
  minHeight: "180px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
  boxSizing: "border-box",
  border: "1px solid rgba(255,255,255,.07)",
  borderRadius: 20,
  background: "rgba(255,255,255,.03)",
  color: "rgba(255,255,255,.50)",
  textAlign: "center",
  fontSize: 14,
  lineHeight: 1.5,
  fontWeight: 500,
};

const skeletonCardStyle: CSSProperties = {
  width: "100%",
  overflow: "hidden",
  border: "1px solid rgba(255,255,255,.065)",
  borderRadius: 20,
  background: "rgba(255,255,255,.03)",
};

const styles = `
@keyframes wolfDiscoverSkeleton {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.wolf-discover-skeleton-shimmer {
  background:
    linear-gradient(
      100deg,
      rgba(255,255,255,.03) 20%,
      rgba(255,255,255,.075) 38%,
      rgba(255,255,255,.03) 56%
    );
  background-size: 200% 100%;
  animation: wolfDiscoverSkeleton 1.45s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .wolf-discover-skeleton-shimmer {
    animation: none !important;
  }
}
`;

function RestaurantSkeleton() {
  return (
    <div aria-hidden="true" style={skeletonCardStyle}>
      <div
        className="wolf-discover-skeleton-shimmer"
        style={{
          width: "100%",
          aspectRatio: "16 / 9",
        }}
      />

      <div
        style={{
          padding: 14,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div
          style={{
            width: "68%",
            height: 17,
            borderRadius: 6,
            background: "rgba(255,255,255,.065)",
          }}
        />
        <div
          style={{
            width: "42%",
            height: 12,
            borderRadius: 6,
            background: "rgba(255,255,255,.045)",
          }}
        />
        <div
          style={{
            width: "55%",
            height: 11,
            borderRadius: 6,
            background: "rgba(255,255,255,.045)",
          }}
        />
      </div>
    </div>
  );
}

export default function DiscoverRestaurantGrid({
  restaurants,
  loading = false,
  emptyMessage = "No encontramos restaurantes con estos criterios.",
  priorityFirst = true,
  userLocation = null,
}: DiscoverRestaurantGridProps) {
  return (
    <>
      <style>{styles}</style>

      {loading && restaurants.length === 0 ? (
        <section
          aria-label="Cargando restaurantes"
          style={sectionStyle}
        >
          <div style={gridStyle}>
            {Array.from({ length: 4 }).map((_, index) => (
              <RestaurantSkeleton key={index} />
            ))}
          </div>
        </section>
      ) : null}

      {!loading && restaurants.length === 0 ? (
        <section aria-live="polite" style={sectionStyle}>
          <div style={emptyStyle}>{emptyMessage}</div>
        </section>
      ) : null}

      {!loading && restaurants.length > 0 ? (
        <section aria-label="Restaurantes" style={sectionStyle}>
          <div style={gridStyle}>
            {restaurants.map((restaurant, index) => (
              <DiscoverRestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                priority={priorityFirst && index === 0}
                userLocation={userLocation}
              />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}