"use client";

import EmptyRestaurants from "./EmptyRestaurants";
import RestaurantCard from "./RestaurantCard";

type Props = {
  restaurants: any[];
  onToggleStatus?: (restaurant: any) => void;
  onDelete?: (restaurant: any) => void;
};

export default function RestaurantGrid({
  restaurants,
  onToggleStatus,
  onDelete,
}: Props) {
  if (!restaurants.length) {
    return <EmptyRestaurants />;
  }

  return (
    <>
      <section className="restaurants-grid">
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            onToggleStatus={() => onToggleStatus?.(restaurant)}
            onDelete={() => onDelete?.(restaurant)}
          />
        ))}
      </section>

      <style jsx>{`
        .restaurants-grid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
          gap: 28px;
          align-items: start;
          position: relative;
          zIndex: 1;
        }

        @media (max-width: 900px) {
          .restaurants-grid {
            display: flex !important;
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            overflow-y: hidden !important;
            gap: 16px;
            padding: 6px 4px 18px;
            width: 100%;
            max-width: 100vw;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: thin;
          }

          .restaurants-grid::-webkit-scrollbar {
            height: 6px;
          }

          .restaurants-grid::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.15);
            border-radius: 999px;
          }

          .restaurants-grid :global(article) {
            min-width: 320px;
            max-width: 320px;
            flex-shrink: 0;
            scroll-snap-align: start;
          }
        }

        @media (max-width: 640px) {
          .restaurants-grid {
            padding-left: 4px;
            padding-right: 4px;
          }

          .restaurants-grid :global(article) {
            min-width: calc(100vw - 32px);
            max-width: calc(100vw - 32px);
          }
        }
      `}</style>
    </>
  );
}


