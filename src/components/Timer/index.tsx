import type { FC } from "react";

import { Item } from "@/components/Timer/components/Item";
import {
  calculateTimeLeft,
  MILLISECONDS_PER_SECOND,
} from "@/components/Timer/utils/calculateTimeLeft";
import { getTimerTitle } from "@/components/Timer/utils/getTimerTitle";
import { useNow } from "@/shared/hooks/useNow";
import { getBettingStatus } from "@/shared/tournament/bettingStatus";

import styles from "./timer.module.css";

export const Timer: FC = () => {
  const now = useNow(MILLISECONDS_PER_SECOND);
  const bettingStatus = getBettingStatus(now);
  const { endsAt } = bettingStatus;
  const timeLeft = calculateTimeLeft(endsAt, now);

  return (
    <section className={styles.container} role="timer" aria-live="off">
      <h3 className={styles.title}>{getTimerTitle(bettingStatus)}</h3>

      {endsAt && (
        <div className={styles.timerWrapper}>
          <Item count={timeLeft.days} label="дд" />
          <Item count={timeLeft.hours} label="чч" />
          <Item count={timeLeft.minutes} label="мм" />
          <Item count={timeLeft.seconds} label="сс" isHighlighted />
        </div>
      )}
    </section>
  );
};
