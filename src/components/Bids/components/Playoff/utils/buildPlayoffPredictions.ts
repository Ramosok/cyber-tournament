import type {
  Match,
  PlayoffState,
  RoundState,
} from "@/components/Bids/components/Playoff/types";
import type { Team, TeamId } from "@/shared/config";
import type {
  MatchPrediction,
  Prediction,
  PredictionDraft,
  WinnerPrediction,
} from "@/shared/prediction/types";

import {
  isFinishedScore,
  parseScore,
} from "@/components/Bids/components/Playoff/utils/matchScore";
import { getTeamById } from "@/shared/config";
import { PLAYOFF_ROUND_KEYS } from "@/shared/tournament/playoffRounds";

/** Сколько матчей нужно заполнить: 4 в 1/4 + 2 в 1/2 + финал. */
export const PLAYOFF_MATCH_COUNT = 7;

const createMatchPrediction = (
  round: RoundState,
  matchIndex: number,
  match: Match,
  teams: ReadonlyMap<TeamId, Team>,
): MatchPrediction | null => {
  const team1 = getTeamById(teams, match.teams[0]);
  const team2 = getTeamById(teams, match.teams[1]);
  const score1 = parseScore(match.score.team1, round.bestOf);
  const score2 = parseScore(match.score.team2, round.bestOf);

  if (!team1 || !team2 || score1 === null || score2 === null) {
    return null;
  }

  if (!isFinishedScore(score1, score2, round.bestOf)) {
    return null;
  }

  return {
    kind: "match",
    round: round.key,
    matchIndex,
    team1: { id: team1.id, name: team1.nameTeam, score: score1 },
    team2: { id: team2.id, name: team2.nameTeam, score: score2 },
  };
};

/**
 * Собирает плей-офф в ту же модель `Prediction`, что и общая сетка.
 * Считаются только матчи (чемпион выводится из счёта финала автоматически),
 * поэтому прогресс читается как «N из 7», а `firstIncompleteRound` показывает,
 * в каком раунде заполнение остановилось.
 */
export const buildPlayoffPredictions = (
  state: PlayoffState,
  teams: ReadonlyMap<TeamId, Team>,
): PredictionDraft => {
  const matches: MatchPrediction[] = [];

  for (const roundKey of PLAYOFF_ROUND_KEYS) {
    const round = state.rounds[roundKey];

    for (const [matchIndex, match] of round.matches.entries()) {
      const prediction = createMatchPrediction(round, matchIndex, match, teams);

      if (!prediction) {
        return {
          predictions: matches,
          filledCount: matches.length,
          requiredCount: PLAYOFF_MATCH_COUNT,
          firstIncompleteRound: roundKey,
        };
      }

      matches.push(prediction);
    }
  }

  const winner = getTeamById(teams, state.winnerId);

  const predictions: readonly Prediction[] = winner
    ? [
        ...matches,
        {
          kind: "winner",
          team: { id: winner.id, name: winner.nameTeam },
        } satisfies WinnerPrediction,
      ]
    : matches;

  return {
    predictions,
    filledCount: matches.length,
    requiredCount: PLAYOFF_MATCH_COUNT,
  };
};
