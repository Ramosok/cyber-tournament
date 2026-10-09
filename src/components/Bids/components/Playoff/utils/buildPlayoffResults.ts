import type { PlayoffState } from "@/components/Bids/components/Playoff/types";
import type { Team } from "@/shared/config";

import { getWinnerIndexInPair } from "./getWinnerIndexInPair";

export type RoundKey = "quarter" | "semi" | "final";

export type PlayoffMatchResult = {
  type: "match";
  round: RoundKey;
  matchIndex: number;

  team1Name: string;
  team1Score: number;
  team2Name: string;
  team2Score: number;
};

export type PlayoffWinnerResult = {
  type: "winner";
  teamName: string;
};

export type PlayoffResult = PlayoffMatchResult | PlayoffWinnerResult;

/**
 * Собираем результаты одного раунда.
 * Если какой‑то матч ещё не собран / счёт невалидный — возвращаем null.
 */
const collectRoundResults = (
  roundKey: RoundKey,
  state: PlayoffState,
  teams: Team[],
): PlayoffMatchResult[] | null => {
  const round = state[roundKey];
  const results: PlayoffMatchResult[] = [];

  for (let matchIndex = 0; matchIndex < round.teams.length; matchIndex++) {
    const [i1, i2] = round.teams[matchIndex];
    const score = round.scores[matchIndex];

    // В типе round.teams: [number | undefined, number | undefined]
    // null там вообще не бывает, поэтому проверяем именно на undefined.
    if (i1 === undefined || i2 === undefined) {
      return null;
    }
    const BO = roundKey === "final" ? 5 : 3;

    const winnerInPair = getWinnerIndexInPair(score.team1, score.team2, BO);
    if (winnerInPair === null) {
      return null;
    }

    // teams у нас: Team[]
    const team1: Team | undefined = teams[i1];
    const team2: Team | undefined = teams[i2];

    // На случай, если индекс вышел за границы массива
    if (!team1 || !team2) {
      return null;
    }

    results.push({
      type: "match",
      round: roundKey,
      matchIndex,
      team1Name: team1.nameTeam,
      team1Score: Number(score.team1),
      team2Name: team2.nameTeam,
      team2Score: Number(score.team2),
    });
  }

  return results;
};

/**
 * Собираем весь плей‑офф:
 *  - 4 матча 1/4
 *  - 2 матча 1/2
 *  - 1 финал
 *  - 1 объект с победителем
 *
 * Если что‑то не заполнено / невалидно — возвращаем null.
 */
export const buildPlayoffResults = (
  state: PlayoffState,
  teams: Team[],
): PlayoffResult[] | null => {
  const all: PlayoffResult[] = [];

  const quarter = collectRoundResults("quarter", state, teams);
  if (!quarter) return null;
  all.push(...quarter);

  const semi = collectRoundResults("semi", state, teams);
  if (!semi) return null;
  all.push(...semi);

  const final = collectRoundResults("final", state, teams);
  if (!final) return null;
  all.push(...final);

  if (state.winnerIndex === undefined) {
    return null;
  }

  const winnerTeam: Team | undefined = teams[state.winnerIndex];
  if (!winnerTeam) {
    return null;
  }

  all.push({
    type: "winner",
    teamName: winnerTeam.nameTeam,
  });

  return all;
};
