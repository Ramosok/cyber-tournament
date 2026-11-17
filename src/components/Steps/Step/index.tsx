import type { FC } from "react";
import type { StepNumber } from "@/shared/tournament/bettingStatus";

import { Icon } from "@/shared/ui/icon";

import styles from "./step.module.css";

export type StepProps = {
  readonly title: string;
  readonly isComplete: boolean;
  readonly isCurrent: boolean;
  readonly hasArrow: boolean;
  readonly step?: StepNumber;
  readonly onClick?: (step: StepNumber) => void;
};

export const Step: FC<StepProps> = ({
  title,
  isCurrent,
  hasArrow,
  step = 1,
  onClick,
}) => {
  const currentStepClass = styles[`currentStep${step}`] ?? "";

  return (
    <span className={styles.step}>
      <button
        type="button"
        className={`${styles.stepButton} ${styles.title} ${
          isCurrent ? `${styles.current} ${currentStepClass}` : styles.inactive
        }`}
        onClick={() => onClick?.(step)}
        aria-label={`Этап: ${title}`}
      >
        <span className={styles.titleText}>{title}</span>
      </button>
      {hasArrow && (
        <span className={styles.arrow} aria-hidden="true">
          <Icon width="18" height="18" icon="fast-forward" />
        </span>
      )}
    </span>
  );
};
