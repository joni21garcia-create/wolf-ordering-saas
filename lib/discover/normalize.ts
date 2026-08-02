import { CORRECTIONS } from "./corrections";

export function normalize(
  text: string
): string {

  const normalized = text

    .normalize("NFD")

    .replace(/[\u0300-\u036f]/g, "")

    .toLowerCase()

    .trim();

  return normalized
    .split(/\s+/)
    .map(
      word =>
        CORRECTIONS[word] ?? word
    )
    .join(" ");

}
