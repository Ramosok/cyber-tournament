import type {
  Match,
  MatchTeams,
  PlayoffState,
  RoundState,
} from "@/components/Bids/components/Playoff/types";
import type { Team } from "@/shared/config";

import { createEmptyScore } from "@/components/Bids/components/Playoff/utils/matchScore";
import { BEST_OF_BY_ROUND } from "@/shared/tournament/playoffRounds";

const createEmptyMatches = (matchCount: number): readonly Match[] =>
  Array.from(
    { length: matchCount },
    (): Match => ({
      teams: [null, null] as const,
      score: createEmptyScore(),
    }),
  );

/** 1/4 финала: пары соседних команд из списка (1–2, 3–4, 5–6, 7–8). */
const createSeededMatches = (teams: readonly Team[]): readonly Match[] => {
  const matches: Match[] = [];

  for (let index = 0; index < teams.length; index += 2) {
    const pair: MatchTeams = [
      teams[index]?.id ?? null,
      teams[index + 1]?.id ?? null,
    ];

    matches.push({ teams: pair, score: createEmptyScore() });
  }

  return matches;
};

const createRound = (
  key: RoundState["key"],
  matches: readonly Match[],
): RoundState => ({ key, bestOf: BEST_OF_BY_ROUND[key], matches });

export const createInitialState = (teams: readonly Team[]): PlayoffState => {
  const seededMatches = createSeededMatches(teams);
  const semiMatchCount = Math.floor(seededMatches.length / 2);

  return {
    rounds: {
      quarter: createRound("quarter", seededMatches),
      semi: createRound("semi", createEmptyMatches(semiMatchCount)),
      final: createRound("final", createEmptyMatches(1)),
    },
    winnerId: null,
  };
};
