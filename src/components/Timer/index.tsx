import { useEffect, useState } from "react";

import type { FC } from "react";

import { Item } from "@/components/Timer/components/Item";
import {
  calculateTimeLeft,
  MILLISECONDS_PER_SECOND,
} from "@/components/Timer/utils/calculateTimeLeft";
import {
  type BettingStatus,
  getCurrentBettingEndDate,
} from "@/shared/utils/getCurrentBettingEndDate";

import styles from "./timer.module.css";

export const Timer: FC = () => {
  const bettingStatus: BettingStatus = getCurrentBettingEndDate();

  const endDate = bettingStatus.hasActiveStage ? bettingStatus.endDate : null;

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(endDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endDate));
    }, MILLISECONDS_PER_SECOND);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <section className={styles.container}>
      <h3 className={styles.title}>До окончания приёма прогнозов:</h3>
      <div className={styles.timerWrapper}>
        <Item count={timeLeft.days} label="дд" />
        <Item count={timeLeft.hours} label="чч" />
        <Item count={timeLeft.minutes} label="мм" />
        <Item count={timeLeft.seconds} label="сс" isHighlighted />
      </div>
    </section>
  );
};
