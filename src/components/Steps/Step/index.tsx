import type { FC } from "react";

import { Icon } from "@/shared/ui/icon";

import styles from "./step.module.css";

type StepProps = {
  title: string;
  isComplete: boolean;
  isNeededArrow: boolean;
  isCurrentStep: boolean;
};

export const Step: FC<StepProps> = ({
  isComplete,
  title,
  isNeededArrow,
  isCurrentStep,
}) => {
  return (
    <span className={styles.step}>
      <span
        className={`${isComplete || isCurrentStep ? styles.color : styles.opacity}`}
      >
        {title}
      </span>{" "}
      {isNeededArrow && (
        <span
          className={
            !isCurrentStep && isComplete ? styles.current : styles.opacity
          }
        >
          <Icon width="18" height="18" icon="fast-forward" />
        </span>
      )}
    </span>
  );
};
