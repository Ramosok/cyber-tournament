import type { PlayoffState } from "@/components/Bids/components/Playoff/types";
import type { MatchScore } from "@/components/Bids/components/Playoff/utils/matchScore";
import type { Team, TeamId } from "@/shared/config";
import type {
  BestOf,
  PlayoffRoundKey,
} from "@/shared/tournament/playoffRounds";

import { getTeamById } from "@/shared/config";
import {
  PLAYOFF_ROUND_KEYS,
  ROUND_LABELS,
} from "@/shared/tournament/playoffRounds";

export type PlayoffMatchView = {
  readonly id: string;
  readonly matchIndex: number;
  readonly bestOf: BestOf;
  readonly score: MatchScore;
  readonly team1: Team | null;
  readonly team2: Team | null;
};

export type PlayoffRoundView = {
  readonly key: PlayoffRoundKey;
  readonly title: string;
  readonly matches: readonly PlayoffMatchView[];
};

export type PlayoffView = {
  readonly rounds: readonly PlayoffRoundView[];
  readonly winner: Team | null;
};

/** Разворачивает состояние сетки в готовые к рендеру данные. */
export const createPlayoffView = (
  state: PlayoffState,
  teams: ReadonlyMap<TeamId, Team>,
): PlayoffView => ({
  rounds: PLAYOFF_ROUND_KEYS.map((roundKey) => {
    const round = state.rounds[roundKey];

    return {
      key: roundKey,
      title: `${ROUND_LABELS[roundKey]} (BO${round.bestOf})`,
      matches: round.matches.map((match, matchIndex) => ({
        id: `${roundKey}-${matchIndex}`,
        matchIndex,
        bestOf: round.bestOf,
        score: match.score,
        team1: getTeamById(teams, match.teams[0]),
        team2: getTeamById(teams, match.teams[1]),
      })),
    };
  }),
  winner: getTeamById(teams, state.winnerId),
});
