import type { FC } from "react";
import type { Team } from "@/shared/config";
import type { GroupLabel } from "@/shared/tournament/stageGrid";

import { Icon } from "@/shared/ui/icon";

import styles from "./cell.module.css";

export type CellProps = {
  readonly label: GroupLabel;
  readonly team: Team | null;
  readonly onClick: () => void;
};

export const Cell: FC<CellProps> = ({ label, team, onClick }) => {
  if (!team) {
    return (
      <button
        className={styles.cell}
        type="button"
        onClick={onClick}
        aria-label={`Выбрать команду в ячейку ${label}`}
      >
        <span className={styles.placeholder}>
          <Icon icon="union" />
        </span>
        <span className={styles.title}>Выбрать</span>
      </button>
    );
  }

  return (
    <button
      className={styles.cell}
      type="button"
      onClick={onClick}
      aria-label={`Убрать ${team.nameTeam} из ячейки ${label}`}
    >
      <Icon className={styles.cross} icon="cross" />
      <span className={styles.selectedTeam}>
        <img
          className={styles.teamLogo}
          src={team.logo}
          alt={team.nameTeam}
          loading="lazy"
          decoding="async"
        />
        <span className={styles.teamName}>{team.nameTeam}</span>
      </span>
    </button>
  );
};
