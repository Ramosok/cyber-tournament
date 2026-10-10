import type { TeamId } from "@/shared/config";
import type { CellIndex } from "@/shared/tournament/stageGrid";

import { STAGE_CELL_INDEXES } from "@/shared/tournament/stageGrid";

/**
 * Выбор пользователя на групповом этапе: в каждой из 16 ячеек либо команда, либо пусто.
 * Ключ — индекс ячейки, поэтому пропуск ячейки невозможен на уровне типа.
 */
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
