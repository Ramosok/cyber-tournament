import type { FC } from "react";

import styles from "./item.module.css";

type ItemProps = {
  count: number;
  label: string;
  isHighlighted?: boolean;
};

export const Item: FC<ItemProps> = ({
  count,
  label,
  isHighlighted = false,
}) => {
  const formattedCount = count.toString().padStart(2, "0");

  return (
    <div className={styles.itemWrapper}>
      <div
        className={`${styles.item} ${isHighlighted ? styles.highlighted : ""}`}
      >
        {formattedCount}
      </div>
      <span>{label}</span>
    </div>
  );
};
