import type { FC } from "react";

import styles from "./tournamentConditions.module.css";

export const TournamentConditions: FC = () => {
  return (
    <div className={styles.container}>
      <iframe
        className={styles.doc}
        src="https://cdn.maxline.by/prize-tournament/Major_2025.pdf"
      />
    </div>
  );
};
