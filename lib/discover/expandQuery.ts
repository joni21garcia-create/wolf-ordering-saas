import { normalize } from "./normalize";
import { SYNONYMS } from "./synonyms";

export function expandQuery(
  search: string
): string[] {

  const words = normalize(search)
    .split(/\s+/)
    .filter(Boolean);

  const expanded = new Set<string>();

  for (const word of words) {

    expanded.add(word);

    const synonyms =
      SYNONYMS[
        word as keyof typeof SYNONYMS
      ];

    if (synonyms) {

      synonyms.forEach((item) =>
        expanded.add(normalize(item))
      );

    }

  }

  return [...expanded];

}
