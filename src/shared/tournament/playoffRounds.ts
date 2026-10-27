/** Формат раундов плей-офф: 1/4 и 1/2 играются до двух побед, финал — до трёх. */

export const PLAYOFF_ROUND_KEYS = ["quarter", "semi", "final"] as const;

export type PlayoffRoundKey = (typeof PLAYOFF_ROUND_KEYS)[number];

export type BestOf = 3 | 5;

export const BEST_OF_BY_ROUND: Readonly<Record<PlayoffRoundKey, BestOf>> = {
  quarter: 3,
  semi: 3,
  final: 5,
};

export const ROUND_LABELS: Readonly<Record<PlayoffRoundKey, string>> = {
  quarter: "1/4",
  semi: "1/2",
  final: "ФИНАЛ",
};

export const MATCH_SLOTS = [0, 1] as const;

export type MatchSlot = (typeof MATCH_SLOTS)[number];

/** Сколько побед нужно для выигрыша серии. */
export const getMaxWins = (bestOf: BestOf): number => Math.ceil(bestOf / 2);
