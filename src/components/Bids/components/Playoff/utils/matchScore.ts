import type { BestOf, MatchSlot } from "@/shared/tournament/playoffRounds";

import { getMaxWins } from "@/shared/tournament/playoffRounds";

export type MatchScore = {
  readonly team1: string;
  readonly team2: string;
};

export const createEmptyScore = (): MatchScore => ({ team1: "", team2: "" });

export const parseScore = (value: string, bestOf: BestOf): number | null => {
  const trimmed = value.trim();

  if (trimmed === "") {
    return null;
  }

  const wins = Number(trimmed);

  if (!Number.isInteger(wins)) {
    return null;
  }

  const maxWins = getMaxWins(bestOf);

  return wins < 0 || wins > maxWins ? null : wins;
};

export const isFinishedScore = (
  score1: number,
  score2: number,
  bestOf: BestOf,
): boolean => {
  const maxWins = getMaxWins(bestOf);

  return (
    Math.max(score1, score2) === maxWins && Math.min(score1, score2) < maxWins
  );
};

export const getWinnerSlot = (
  score: MatchScore,
  bestOf: BestOf,
): MatchSlot | null => {
  const score1 = parseScore(score.team1, bestOf);
  const score2 = parseScore(score.team2, bestOf);

  if (score1 === null || score2 === null) {
    return null;
  }

  if (!isFinishedScore(score1, score2, bestOf)) {
    return null;
  }

  return score1 > score2 ? 0 : 1;
};

export const getWinnerFlags = (
  score: MatchScore,
  bestOf: BestOf,
): { readonly team1: boolean; readonly team2: boolean } => {
  const winnerSlot = getWinnerSlot(score, bestOf);

  return { team1: winnerSlot === 0, team2: winnerSlot === 1 };
};
