import type { ChangeEvent, FC } from "react";
import type { BestOf } from "@/shared/tournament/playoffRounds";

import { normalizeScore } from "@/components/Bids/components/Playoff/utils/normalizeScore";
import { getMaxWins } from "@/shared/tournament/playoffRounds";

import styles from "./scoreInput.module.css";

export type ScoreInputProps = {
  readonly bestOf: BestOf;
  readonly score: string;
  readonly teamName: string;
  readonly onScoreChange: (value: string) => void;
};

export const ScoreInput: FC<ScoreInputProps> = ({
  bestOf,
  score,
  teamName,
  onScoreChange,
}) => {
  const maxWins = getMaxWins(bestOf);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onScoreChange(normalizeScore(event.target.value, maxWins));
  };

  return (
    <input
      className={styles.scoreInput}
      value={score}
      onChange={handleChange}
      inputMode="numeric"
      autoComplete="off"
      maxLength={1}
      min={0}
      max={maxWins}
      pattern={`[0-${maxWins}]`}
      aria-label={`Счёт команды ${teamName}`}
      title={`Введите число от 0 до ${maxWins}`}
    />
  );
};
