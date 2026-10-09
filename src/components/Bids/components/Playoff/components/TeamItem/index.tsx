import type { FC, PropsWithChildren } from "react";

import styles from "./teamItem.module.css";

export type TeamItemProps = PropsWithChildren<{
  readonly logo: string;
  readonly teamName: string;
  readonly isWinner: boolean;
}>;

/** Команда в матче плей-офф. Содержимое слота счёта передаётся через children. */
export const TeamItem: FC<TeamItemProps> = ({
  logo,
  teamName,
  isWinner,
  children,
}) => {
  return (
    <div className={`${styles.teamContainer} ${isWinner ? styles.winner : ""}`}>
      <img className={styles.logo} src={logo} alt={teamName} />
      <p className={styles.name}>{teamName}</p>
      <div className={styles.score}>
        <span className={styles.scoreTitle}>Счёт:</span>
        {children}
      </div>
    </div>
  );
};
