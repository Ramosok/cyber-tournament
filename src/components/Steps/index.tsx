import type { FC } from "react";
import type { StepNumber } from "@/shared/tournament/bettingStatus";

import { Step } from "@/components/Steps/Step";
import { MILLISECONDS_PER_SECOND } from "@/components/Timer/utils/calculateTimeLeft";
import { useNow } from "@/shared/hooks/useNow";
import {
  FINAL_STEP,
  getBettingStatus,
  setPreviewStep,
} from "@/shared/tournament/bettingStatus";

import styles from "./steps.module.css";

type StepView = {
  readonly step: StepNumber;
  readonly title: string;
  readonly hasArrow: boolean;
};

const STEP_VIEWS: readonly StepView[] = [
  { step: 1, title: "1 ЭТАП", hasArrow: true },
  { step: 2, title: "2 ЭТАП", hasArrow: true },
  { step: 3, title: "3 ЭТАП", hasArrow: true },
  { step: FINAL_STEP, title: "Плей-офф", hasArrow: false },
];

export const Steps: FC = () => {
  const bettingStatus = getBettingStatus(useNow(MILLISECONDS_PER_SECOND));
  const currentStep = bettingStatus.currentStep;

  const trackClass =
    currentStep === 1
      ? styles.trackStep1
      : currentStep === 2
        ? styles.trackStep2
        : currentStep === 3
          ? styles.trackStep3
          : styles.trackStep4;

  const handleStepClick = (step: StepNumber): void => {
    setPreviewStep(step);
  };

  return (
    <section className={styles.container}>
      <div className={styles.wrapper}>
        <div className={`${styles.track} ${trackClass}`} aria-hidden="true" />
        {STEP_VIEWS.map(({ step, title, hasArrow }) => (
          <Step
            key={title}
            step={step}
            title={title}
            hasArrow={hasArrow}
            isCurrent={
              !bettingStatus.isFinished && bettingStatus.currentStep === step
            }
            isComplete={
              bettingStatus.isFinished || bettingStatus.currentStep > step
            }
            onClick={handleStepClick}
          />
        ))}
      </div>
    </section>
  );
};
