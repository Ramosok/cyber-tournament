import type { FC } from "react";

import { Icon } from "@/shared/ui/icon";

import styles from "./step.module.css";

export type StepProps = {
  readonly title: string;
  readonly isComplete: boolean;
  readonly isCurrent: boolean;
  readonly hasArrow: boolean;
};

export const Step: FC<StepProps> = ({ title, isCurrent, hasArrow }) => {
  return (
    <span className={styles.step}>
      <span
        className={`${styles.title} ${isCurrent ? styles.current : styles.inactive}`}
      >
        <span className={styles.titleText}>{title}</span>
      </span>
      {hasArrow && (
        <span className={styles.arrow}>
          <Icon width="18" height="18" icon="fast-forward" />
        </span>
      )}
    </span>
  );
};
