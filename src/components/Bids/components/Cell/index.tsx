import type { FC } from "react";
import type { Team } from "@/shared/config";

import { Icon } from "@/shared/ui/icon";

import styles from "./cell.module.css";

type CellProps = {
  selectedTeam?: Team | null;
  onClick: () => void;
};

export const Cell: FC<CellProps> = ({ selectedTeam, onClick }) => {
  return (
    <button className={styles.cell} onClick={onClick}>
      {!selectedTeam ? (
        <>
          <div className={styles.placeholder}>
            <Icon icon="union" />
          </div>
          <span className={styles.title}>Выбрать</span>
        </>
      ) : (
        <>
          <Icon className={styles.cross} icon="cross" />
          <div className={styles.selectedTeam}>
            <img
              className={styles.teamLogo}
              src={selectedTeam.logo}
              alt={selectedTeam.nameTeam}
              loading="lazy"
            />
            <span className={styles.teamName}>{selectedTeam.nameTeam}</span>
          </div>
        </>
      )}
    </button>
  );
};
