"use client";

import EmptyRestaurants from "./EmptyRestaurants";
import RestaurantCard from "./RestaurantCard";

type Props = {
  restaurants: any[];

  onDuplicate?: (restaurant: any) => void;
  onToggleStatus?: (restaurant: any) => void;
  onDelete?: (restaurant: any) => void;
};

export default function RestaurantGrid({
  restaurants,
  onDuplicate,
  onToggleStatus,
  onDelete,
}: Props) {
  if (!restaurants.length) {
    return <EmptyRestaurants />;
  }

  return (
    <>
      <section
        className="restaurants-grid"
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit,minmax(400px,1fr))",

          gap: 28,

          alignItems: "start",

          overflow: "visible",

          position: "relative",

          zIndex: 1,
        }}
      >
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            onDuplicate={() =>
              onDuplicate?.(restaurant)
            }
            onToggleStatus={() =>
              onToggleStatus?.(restaurant)
            }
            onDelete={() =>
              onDelete?.(restaurant)
            }
          />
        ))}
      </section>

      <style jsx>{`
        .restaurants-grid {
          width: 100%;
        }

        @media (max-width: 900px) {
          .restaurants-grid {
            display: flex !important;

            overflow-x: auto;

            overflow-y: visible;

            gap: 18px;

            padding: 6px 4px 18px;

            scroll-snap-type: x mandatory;

            -webkit-overflow-scrolling: touch;

            scrollbar-width: thin;
          }

          .restaurants-grid::-webkit-scrollbar {
            height: 8px;
          }

          .restaurants-grid::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.18);

            border-radius: 999px;
          }

          .restaurants-grid
            :global(article) {
            min-width: 340px;

            max-width: 340px;

            flex-shrink: 0;

            scroll-snap-align: start;
          }
        }
                  @media (max-width: 640px) {
          .restaurants-grid {
            padding-left: 8px;
            padding-right: 8px;
          }

          .restaurants-grid
            :global(article) {
            min-width: calc(100vw - 48px);
            max-width: calc(100vw - 48px);
          }
        }
      `}</style>
    </>
  );
}