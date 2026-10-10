import type { FC } from "react";
import type { Team, TeamId } from "@/shared/config";

import { TeamItem } from "@/components/Bids/components/TeamItem";

import styles from "./teamList.module.css";

export type TeamListProps = {
  readonly teams: readonly Team[];
  readonly selectedTeamIds: ReadonlySet<TeamId>;
  readonly onTeamSelect: (teamId: TeamId) => void;
};

export const TeamList: FC<TeamListProps> = ({
  teams,
  selectedTeamIds,
  onTeamSelect,
}) => {
  return (
    <div className={styles.container}>
      {teams.map((team) => (
        <TeamItem
          key={team.id}
          team={team}
          isSelected={selectedTeamIds.has(team.id)}
          onSelect={onTeamSelect}
        />
      ))}
    </div>
  );
};
