import type { FC } from "react";
import type { Team, TeamId } from "@/shared/config";
import type { CellIndex, StageGroup } from "@/shared/tournament/stageGrid";
import type { StageSelection } from "@/shared/tournament/stageSelection";

import { Cell } from "@/components/Bids/components/Cell";
import { getTeamById } from "@/shared/config";

import styles from "../../stage.module.css";

export type GroupColumnProps = {
  readonly group: StageGroup;
  readonly selection: StageSelection;
  readonly teams: ReadonlyMap<TeamId, Team>;
  readonly onCellClick: (cellIndex: CellIndex) => void;
};

export const GroupColumn: FC<GroupColumnProps> = ({
  group,
  selection,
  teams,
  onCellClick,
}) => {
  const cells = group.cellIndexes.map((cellIndex) => ({
    cellIndex,
    team: getTeamById(teams, selection[cellIndex]),
  }));

  return (
    <div className={styles.group}>
      <div className={styles.groupLabel}>{group.label}</div>
      <div className={styles.groupCells}>
        {cells.map(({ cellIndex, team }) => (
          <Cell
            key={cellIndex}
            label={group.label}
            team={team}
            onClick={() => onCellClick(cellIndex)}
          />
        ))}
      </div>
    </div>
  );
};
