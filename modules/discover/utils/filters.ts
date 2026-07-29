import { DISCOVER_CATEGORIES } from "@/lib/discover/categories";

import { Restaurant } from "../types/restaurant";

export function filterRestaurants(
  restaurants: Restaurant[],
  search: string
): Restaurant[] {
  const query = search.trim().toLowerCase();

  if (!query) {
    return restaurants;
  }

  return restaurants.filter((restaurant) => {
    const searchableText = [
      restaurant.name,
      restaurant.category,
      restaurant.address,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (searchableText.includes(query)) {
      return true;
    }

    if (!restaurant.category) {
      return false;
    }

    const category = DISCOVER_CATEGORIES.find(
      (item) => item.id === restaurant.category
    );

    if (!category) {
      return false;
    }

    return category.keywords.some((keyword) =>
      keyword.toLowerCase().includes(query)
    );
  });
}