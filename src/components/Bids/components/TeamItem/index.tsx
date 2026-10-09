import type { FC } from "react";
import type { Team } from "@/shared/config";

import styles from "./teamItem.module.css";

type TeamItemProps = Team & {
  logo: string;
  nameTeam: string;
  id: string;
  isSelected: boolean;
  onTeamSelect: ((teamId: string) => void) | undefined;
  currentCellIndex: number | null | undefined;
};

export const TeamItem: FC<TeamItemProps> = ({
  logo,
  id,
  isSelected,
  nameTeam,
  onTeamSelect,
  currentCellIndex,
}) => {
  const handleClick = (): void => {
    if (!isSelected && currentCellIndex !== null && onTeamSelect) {
      onTeamSelect(id);
    }
  };

  return (
    <button
      disabled={isSelected || currentCellIndex === null}
      className={styles.teamItem}
      id={id}
      onClick={handleClick}
    >
      <img width="54" height="54" src={logo} alt={nameTeam} />
      <p>{nameTeam}</p>
    </button>
  );
};
