import type { FC } from "react";
import type { BettingStatus } from "@/shared/utils/getCurrentBettingEndDate";

import { Step } from "@/components/Steps/Step";
import { getCurrentBettingEndDate } from "@/shared/utils/getCurrentBettingEndDate";

import styles from "./steps.module.css";

export const Steps: FC = () => {
  const bettingStatus: BettingStatus = getCurrentBettingEndDate();

  const currentStep = bettingStatus?.currentTour;

  return (
    <section className={styles.container}>
      <div className={styles.wrapper}>
        <Step
          key="1 ЭТАП"
          isCurrentStep={currentStep === 1}
          isComplete={currentStep > 1}
          title="1 ЭТАП"
          isNeededArrow={true}
        />
        <Step
          key="2 ЭТАП"
          isCurrentStep={currentStep === 2}
          isComplete={currentStep > 2}
          title="2 ЭТАП"
          isNeededArrow={true}
        />
        <Step
          key="3 ЭТАП"
          isCurrentStep={currentStep === 3}
          isComplete={currentStep > 3}
          title="3 ЭТАП"
          isNeededArrow={true}
        />
        <Step
          key="ФИНАЛ"
          isCurrentStep={currentStep === 4}
          isComplete={currentStep > 4}
          title="ФИНАЛ"
          isNeededArrow={false}
        />
      </div>
    </section>
  );
};
