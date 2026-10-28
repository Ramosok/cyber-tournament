import type { FC, PropsWithChildren } from "react";

import styles from "./teamItem.module.css";

export type TeamItemProps = PropsWithChildren<{
  readonly logo: string;
  readonly teamName: string;
  readonly isWinner: boolean;
  readonly showScoreLabel?: boolean;
}>;

export const TeamItem: FC<TeamItemProps> = ({
  logo,
  teamName,
  isWinner,
  showScoreLabel = true,
  children,
}) => {
  return (
    <div className={`${styles.teamContainer} ${isWinner ? styles.winner : ""}`}>
      <img className={styles.logo} src={logo} alt={teamName} decoding="async" />
      <p className={styles.name}>{teamName}</p>
      <div className={styles.score}>
        {showScoreLabel && <span className={styles.scoreTitle}>Счёт:</span>}
        {children}
      </div>
    </div>
  );
};
