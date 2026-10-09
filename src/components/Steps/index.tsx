import { useState } from "react";

import type { FC } from "react";
import type {
  BettingStatus,
  StepNumber,
} from "@/shared/tournament/bettingStatus";

import { Step } from "@/components/Steps/Step";
import {
  FINAL_STEP,
  getBettingStatus,
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
  { step: FINAL_STEP, title: "ФИНАЛ", hasArrow: false },
];

export const Steps: FC = () => {
  const [bettingStatus] = useState<BettingStatus>(getBettingStatus);

  return (
    <section className={styles.container}>
      <div className={styles.wrapper}>
        {STEP_VIEWS.map(({ step, title, hasArrow }) => (
          <Step
            key={title}
            title={title}
            hasArrow={hasArrow}
            isCurrent={bettingStatus.currentStep === step}
            isComplete={bettingStatus.currentStep > step}
          />
        ))}
      </div>
    </section>
  );
};
