import type {
  GroupPickPrediction,
  MatchPrediction,
  Prediction,
} from "@/shared/prediction/types";

import {
  isGroupPickPrediction,
  isMatchPrediction,
} from "@/shared/prediction/types";
import { GROUP_LABELS } from "@/shared/tournament/stageGrid";

/** «Team Spirit 2:1 Team Falcons» — формат, который ждёт бэкенд. */
export const formatMatchPrediction = (match: MatchPrediction): string =>
  `${match.team1.name} ${match.team1.score}:${match.team2.score} ${match.team2.name}`;

const formatGroupLines = (
  picks: readonly GroupPickPrediction[],
): readonly string[] =>
  GROUP_LABELS.map((label) => {
    const names = picks
      .filter((pick) => pick.group === label)
      .map((pick) => pick.team.name);

    return names.length === 0 ? "" : `${label}: ${names.join(", ")}`;
  });

/**
 * Строки для полей f1…f7.
 * Плей-офф: по одной строке на матч. Общая сетка: по одной строке на группу.
 */
export const formatPredictionLines = (
  predictions: readonly Prediction[],
): readonly string[] => {
  const matches: MatchPrediction[] = [];
  const picks: GroupPickPrediction[] = [];

  for (const prediction of predictions) {
    if (isMatchPrediction(prediction)) {
      matches.push(prediction);
    } else if (isGroupPickPrediction(prediction)) {
      picks.push(prediction);
    }
  }

  return matches.length > 0
    ? matches.map((match) => formatMatchPrediction(match))
    : formatGroupLines(picks);
};
