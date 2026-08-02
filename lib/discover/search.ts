import type { Restaurant } from "@/modules/discover/types/restaurant";

import { buildIndex } from "./buildIndex";
import { rankRestaurants } from "./ranking";

export function searchRestaurants(
  restaurants: Restaurant[],
  search: string
): Restaurant[] {

  const indexes =
    restaurants.map(buildIndex);

  return rankRestaurants(
    indexes,
    search
  ).map(item => item.restaurant);

}