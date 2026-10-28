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

export type PlayoffRoundsView = Readonly<
  Record<PlayoffRoundKey, PlayoffRoundView>
>;

export type PlayoffView = {
  readonly rounds: readonly PlayoffRoundView[];
  readonly roundsByKey: PlayoffRoundsView;
  readonly winner: Team | null;
};

const createRoundView = (
  state: PlayoffState,
  roundKey: PlayoffRoundKey,
  teams: ReadonlyMap<TeamId, Team>,
): PlayoffRoundView => {
  const round = state.rounds[roundKey];

  return {
    key: roundKey,
    title: ROUND_LABELS[roundKey],
    matches: round.matches.map((match, matchIndex) => ({
      id: `${roundKey}-${matchIndex}`,
      matchIndex,
      bestOf: round.bestOf,
      score: match.score,
      team1: getTeamById(teams, match.teams[0]),
      team2: getTeamById(teams, match.teams[1]),
    })),
  };
};

export const createPlayoffView = (
  state: PlayoffState,
  teams: ReadonlyMap<TeamId, Team>,
): PlayoffView => {
  const roundsByKey: PlayoffRoundsView = {
    quarter: createRoundView(state, "quarter", teams),
    semi: createRoundView(state, "semi", teams),
    final: createRoundView(state, "final", teams),
    thirdPlace: createRoundView(state, "thirdPlace", teams),
  };

  return {
    rounds: PLAYOFF_ROUND_KEYS.map((roundKey) => roundsByKey[roundKey]),
    roundsByKey,
    winner: getTeamById(teams, state.winnerId),
  };
};
