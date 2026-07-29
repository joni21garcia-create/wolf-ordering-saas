"use client";

import RestaurantCard from "./RestaurantCard";
import type { Restaurant } from "../types/restaurant";

interface RestaurantGridProps {
  restaurants: Restaurant[];
}

export default function RestaurantGrid({
  restaurants,
}: RestaurantGridProps) {
  if (restaurants.length === 0) {
    return (
      <div className="rounded-xl border p-10 text-center text-muted-foreground">
        No hay restaurantes disponibles.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          restaurant={restaurant}
        />
      ))}
    </div>
  );
}