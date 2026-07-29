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

    return searchableText.includes(query);
  });
}