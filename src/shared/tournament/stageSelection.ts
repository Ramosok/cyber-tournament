import type { TeamId } from "@/shared/config";
import type { CellIndex } from "@/shared/tournament/stageGrid";

import { STAGE_CELL_INDEXES } from "@/shared/tournament/stageGrid";

export type StageSelection = Readonly<Record<CellIndex, TeamId | null>>;

export const createEmptyStageSelection = (): StageSelection =>
  Object.fromEntries(
    STAGE_CELL_INDEXES.map((cellIndex) => [cellIndex, null]),
  ) as Record<CellIndex, TeamId | null>;

export const setCellTeam = (
  selection: StageSelection,
  cellIndex: CellIndex,
  teamId: TeamId | null,
): StageSelection => ({ ...selection, [cellIndex]: teamId });

export const getFilledCells = (
  selection: StageSelection,
): readonly CellIndex[] =>
  STAGE_CELL_INDEXES.filter((cellIndex) => selection[cellIndex] !== null);

export const getSelectedTeamIds = (selection: StageSelection): Set<TeamId> =>
  new Set(
    getFilledCells(selection)
      .map((cellIndex) => selection[cellIndex])
      .filter((teamId): teamId is TeamId => teamId !== null),
  );
