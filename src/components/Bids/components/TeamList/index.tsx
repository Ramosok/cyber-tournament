import type { FC } from "react";

import { TeamItem } from "@/components/Bids/components/TeamItem";
import { TEAM_LIST } from "@/shared/config";

import styles from "./teamList.module.css";

type TeamListProps = {
  selectedTeamIds: Set<string>;
  onTeamSelect?: (teamId: string) => void;
  currentCellIndex?: number | null;
};

export const TeamList: FC<TeamListProps> = ({
  selectedTeamIds,
  onTeamSelect,
  currentCellIndex,
}) => {
  return (
    <div className={styles.container}>
      {TEAM_LIST.map(({ logo, id, nameTeam }) => (
        <TeamItem
          key={id}
          logo={logo}
          nameTeam={nameTeam}
          id={id}
          isSelected={selectedTeamIds.has(id)}
          onTeamSelect={onTeamSelect}
          currentCellIndex={currentCellIndex}
        />
      ))}
    </div>
  );
};
