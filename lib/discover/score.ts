import { expandQuery } from "./expandQuery";
import { SearchIndex } from "./buildIndex";

function scoreTokens(
  tokens: string[],
  word: string,
  exact: number,
  starts: number,
  contains: number
) {
  let score = 0;

  for (const token of tokens) {
    if (token === word) {
      score += exact;
    } else if (token.startsWith(word)) {
      score += starts;
    } else if (token.includes(word)) {
      score += contains;
    }
  }

  return score;
}

export function calculateScore(
  index: SearchIndex,
  search: string
): number {

  const words = expandQuery(search);

  let score = 0;

  for (const word of words) {

    score += scoreTokens(
      index.nameTokens,
      word,
      500,
      300,
      180
    );

    score += scoreTokens(
      index.categoryTokens,
      word,
      200,
      120,
      80
    );

    score += scoreTokens(
      index.dictionaryTokens,
      word,
      120,
      80,
      40
    );

    score += scoreTokens(
      index.addressTokens,
      word,
      40,
      20,
      10
    );

  }

  return score;
}
