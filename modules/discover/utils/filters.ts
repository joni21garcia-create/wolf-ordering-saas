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
    const name = restaurant.name.toLowerCase();
    const category = restaurant.category.toLowerCase();

    return (
      name.includes(query) ||
      category.includes(query)
    );
  });
}