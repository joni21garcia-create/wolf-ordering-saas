import { SearchIndex } from "./buildIndex";
import { calculateScore } from "./score";

export function rankRestaurants(
  indexes: SearchIndex[],
  search: string
) {
  return indexes
    .map((index) => ({
      restaurant: index.restaurant,
      score: calculateScore(index, search),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
}