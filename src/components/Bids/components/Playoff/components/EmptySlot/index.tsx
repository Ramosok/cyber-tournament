import type { FC } from "react";

import styles from "./emptySlot.module.css";

export const EmptySlot: FC = () => {
  return <div className={styles.emptySlot}>Команда не выбрана</div>;
};
