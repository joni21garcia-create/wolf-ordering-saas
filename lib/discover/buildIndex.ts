import { DISCOVER_DICTIONARY } from "./searchDictionary";
import { normalize } from "./normalize";

import type { Restaurant } from "@/modules/discover/types/restaurant";

export interface SearchIndex {

  restaurant: Restaurant;

  nameTokens: string[];

  categoryTokens: string[];

  addressTokens: string[];

  dictionaryTokens: string[];

}

function tokenize(
  value: string | null | undefined
) {

  if (!value) return [];

  return normalize(value)
    .split(/\s+/)
    .filter(Boolean);

}

export function buildIndex(
  restaurant: Restaurant
): SearchIndex {

  const category =
    restaurant.category?.toLowerCase() ?? "";

  const dictionary =
    DISCOVER_DICTIONARY[
      category as keyof typeof DISCOVER_DICTIONARY
    ] ?? [];

  return {

    restaurant,

    nameTokens:
      tokenize(restaurant.name),

    categoryTokens:
      tokenize(restaurant.category),

    addressTokens:
      tokenize(restaurant.address),

    dictionaryTokens:
      dictionary.flatMap(tokenize),

  };

}
