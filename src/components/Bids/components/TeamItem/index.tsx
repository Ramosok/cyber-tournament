import type { FC } from "react";
import type { Team, TeamId } from "@/shared/config";

import styles from "./teamItem.module.css";

export type TeamItemProps = {
  readonly team: Team;
  readonly isSelected: boolean;
  readonly onSelect: (teamId: TeamId) => void;
};

export const TeamItem: FC<TeamItemProps> = ({ team, isSelected, onSelect }) => {
  const handleClick = (): void => {
    onSelect(team.id);
  };

  return (
    <button
      className={styles.teamItem}
      type="button"
      disabled={isSelected}
      aria-pressed={isSelected}
      onClick={handleClick}
    >
      <img
        width="54"
        height="54"
        src={team.logo}
        alt={team.nameTeam}
        loading="lazy"
      />
      <p>{team.nameTeam}</p>
    </button>
  );
};
