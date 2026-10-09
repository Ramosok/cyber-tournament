import { useEffect, useState } from "react";

import type { FC } from "react";
import type { BettingStatus } from "@/shared/tournament/bettingStatus";

import { Item } from "@/components/Timer/components/Item";
import {
  calculateTimeLeft,
  MILLISECONDS_PER_SECOND,
} from "@/components/Timer/utils/calculateTimeLeft";
import { getTimerTitle } from "@/components/Timer/utils/getTimerTitle";
import { getBettingStatus } from "@/shared/tournament/bettingStatus";

import styles from "./timer.module.css";

export const Timer: FC = () => {
  const [bettingStatus] = useState<BettingStatus>(getBettingStatus);
  const { endsAt } = bettingStatus;

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(endsAt));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endsAt));
    }, MILLISECONDS_PER_SECOND);

    return () => clearInterval(timer);
  }, [endsAt]);

  return (
    <section className={styles.container}>
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
