import type { Team, TeamId } from "@/shared/config";
import type {
  GroupPickPrediction,
  PredictionDraft,
} from "@/shared/prediction/types";
import type { StageSelection } from "@/shared/tournament/stageSelection";

import { getTeamById } from "@/shared/config";
import {
  CELL_LABEL_MAP,
  STAGE_CELL_COUNT,
  STAGE_CELL_INDEXES,
} from "@/shared/tournament/stageGrid";

/**
 * Собирает прогноз общей сетки (этапы 1–3) в единую модель `Prediction`.
 * Заполненные ячейки попадают в список, пустые — нет, поэтому по `filledCount`
 * видно прогресс заполнения.
 */
export const buildStagePredictions = (
  selection: StageSelection,
  teams: ReadonlyMap<TeamId, Team>,
): PredictionDraft => {
  const predictions: GroupPickPrediction[] = STAGE_CELL_INDEXES.flatMap(
    (cellIndex): GroupPickPrediction[] => {
      const team = getTeamById(teams, selection[cellIndex]);

      if (!team) {
        return [];
      }

      return [
        {
          kind: "groupPick",
          group: CELL_LABEL_MAP[cellIndex],
          cellIndex,
          team: { id: team.id, name: team.nameTeam },
        },
      ];
    },
  );

  return {
    predictions,
    filledCount: predictions.length,
    requiredCount: STAGE_CELL_COUNT,
  };
};
