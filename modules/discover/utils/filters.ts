import { searchRestaurants } from "@/lib/discover/search";

import type { Restaurant } from "@/modules/discover/types/restaurant";

export function filterRestaurants(
  restaurants: Restaurant[],
  search: string
): Restaurant[] {

  if (!search.trim()) {
    return restaurants;
  }

  return searchRestaurants(
    restaurants,
    search
  );

}