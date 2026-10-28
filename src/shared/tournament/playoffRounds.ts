export const PLAYOFF_ROUND_KEYS = [
  "quarter",
  "semi",
  "final",
  "thirdPlace",
] as const;

export type PlayoffRoundKey = (typeof PLAYOFF_ROUND_KEYS)[number];

export type BestOf = 3 | 5;

export const BEST_OF_BY_ROUND: Readonly<Record<PlayoffRoundKey, BestOf>> = {
  quarter: 3,
  semi: 3,
  final: 5,
  thirdPlace: 3,
};

export const ROUND_LABELS: Readonly<Record<PlayoffRoundKey, string>> = {
  quarter: "1/4",
  semi: "1/2",
  final: "ФИНАЛ",
  thirdPlace: "3-Е МЕСТО",
};

export const MATCH_SLOTS = [0, 1] as const;

export type MatchSlot = (typeof MATCH_SLOTS)[number];

export const getMaxWins = (bestOf: BestOf): number => Math.ceil(bestOf / 2);
