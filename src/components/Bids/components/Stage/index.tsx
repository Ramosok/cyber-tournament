import { Fragment, useMemo } from "react";

import type { FC } from "react";
import type { Team } from "@/shared/config";
import type { CellIndex, StageGroup } from "@/shared/tournament/stageGrid";
import type { StageSelection } from "@/shared/tournament/stageSelection";

import { GroupColumn } from "@/components/Bids/components/Stage/components/GroupColumn";
import { createTeamIndex } from "@/shared/config";
import { STAGE_ROWS } from "@/shared/tournament/stageGrid";

import styles from "./stage.module.css";

export type StageProps = {
  readonly selection: StageSelection;
  readonly teams: readonly Team[];
  readonly onCellClick: (cellIndex: CellIndex) => void;
};

type StageRowView = {
  readonly key: string;
  readonly groups: readonly [StageGroup, StageGroup];
  readonly hasTopDivider: boolean;
};

const ROW_VIEWS: readonly StageRowView[] = STAGE_ROWS.map((groups, index) => ({
  key: groups.map((group) => group.label).join("-"),
  groups,
  hasTopDivider: index > 0,
}));

/** Общая сетка группового этапа (этапы 1–3). */
export const Stage: FC<StageProps> = ({ selection, teams, onCellClick }) => {
  const teamIndex = useMemo(() => createTeamIndex(teams), [teams]);

  return (
    <div className={styles.gridWrapper}>
      {ROW_VIEWS.map(({ key, groups, hasTopDivider }) => (
        <Fragment key={key}>
          {hasTopDivider && (
            <div className={styles.horizontalDivider} aria-hidden="true" />
          )}

          <div className={styles.row}>
            <GroupColumn
              group={groups[0]}
              selection={selection}
              teams={teamIndex}
              onCellClick={onCellClick}
            />

            <div className={styles.verticalDivider} aria-hidden="true" />

            <GroupColumn
              group={groups[1]}
              selection={selection}
              teams={teamIndex}
              onCellClick={onCellClick}
            />
          </div>
        </Fragment>
      ))}
    </div>
  );
};
