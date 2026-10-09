import { isValidCsScore } from "@/components/Bids/components/Playoff/utils/isValidCsScore";

import { parseScore } from "./parseScore";

export const getWinnerIndexInPair = (
  score1: string,
  score2: string,
  bo: number,
): 0 | 1 | null => {
  const s1 = parseScore(score1, bo);
  const s2 = parseScore(score2, bo);
  if (s1 === null || s2 === null) return null;
  if (!isValidCsScore(s1, s2, bo)) return null;
  return s1 > s2 ? 0 : 1;
};
