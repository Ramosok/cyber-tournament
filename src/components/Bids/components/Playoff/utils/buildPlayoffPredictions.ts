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
} from "@/shared/prediction/types";

import {
  isFinishedScore,
  parseScore,
} from "@/components/Bids/components/Playoff/utils/matchScore";
import { getTeamById } from "@/shared/config";
import { PLAYOFF_ROUND_KEYS } from "@/shared/tournament/playoffRounds";

export const PLAYOFF_MATCH_COUNT = 7;

/** 7 матчей + чемпион. */
export const PLAYOFF_PREDICTION_COUNT = PLAYOFF_MATCH_COUNT + 1;

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

const createDraft = (
  predictions: readonly Prediction[],
  filledCount: number,
): PredictionDraft => ({
  predictions,
  filledCount,
  requiredCount: PLAYOFF_PREDICTION_COUNT,
});

/**
 * Собирает плей-офф в ту же модель `Prediction`, что и общая сетка:
 * 4 матча 1/4 + 2 матча 1/2 + финал + чемпион.
 * Встретили незаполненный матч — дальше не идём, поэтому `filledCount`
 * показывает реальный прогресс заполнения сетки.
 */
export const buildPlayoffPredictions = (
  state: PlayoffState,
  teams: ReadonlyMap<TeamId, Team>,
): PredictionDraft => {
  const predictions: Prediction[] = [];

  for (const roundKey of PLAYOFF_ROUND_KEYS) {
    const round = state.rounds[roundKey];

    for (const [matchIndex, match] of round.matches.entries()) {
      const prediction = createMatchPrediction(round, matchIndex, match, teams);

      if (!prediction) {
        return createDraft(predictions, predictions.length);
      }

      predictions.push(prediction);
    }
  }

  const winner = getTeamById(teams, state.winnerId);

  if (!winner) {
    return createDraft(predictions, predictions.length);
  }

  predictions.push({
    kind: "winner",
    team: { id: winner.id, name: winner.nameTeam },
  });

  return createDraft(predictions, predictions.length);
};
