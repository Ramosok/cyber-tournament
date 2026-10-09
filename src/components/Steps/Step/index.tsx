import type { FC } from "react";

import { Icon } from "@/shared/ui/icon";

import styles from "./step.module.css";

export type StepProps = {
  readonly title: string;
  readonly isComplete: boolean;
  readonly isCurrent: boolean;
  readonly hasArrow: boolean;
};

export const Step: FC<StepProps> = ({
  title,
  isComplete,
  isCurrent,
  hasArrow,
}) => {
  const isHighlighted = isComplete || isCurrent;

  return (
    <span className={styles.step}>
      <span className={isHighlighted ? styles.color : styles.opacity}>
        {title}
      </span>{" "}
      {hasArrow && (
        <span
          className={isComplete && !isCurrent ? styles.current : styles.opacity}
        >
          <Icon width="18" height="18" icon="fast-forward" />
        </span>
      )}
    </span>
  );
};
