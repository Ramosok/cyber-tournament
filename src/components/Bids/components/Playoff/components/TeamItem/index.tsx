import type { ChangeEvent, FC, FormEvent } from "react";

import trophy from "../../../../../../shared/assets/trophy.svg";

import styles from "./teamItem.module.css";

type TeamItemProps = {
  logo: string;
  teamName: string;
  score: string;
  isWinner: boolean;
  onScoreChange: (value: string) => void;
  isChampion?: boolean;
  bo: 3 | 5;
};

export const TeamItem: FC<TeamItemProps> = ({
  logo,
  teamName,
  score,
  isWinner,
  onScoreChange,
  isChampion,
  bo,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    onScoreChange(e.target.value);
  };

  const maxGame = Math.ceil(bo / 2);

  const pattern = bo === 3 ? "[12]" : "[123";

  return (
    <div className={`${styles.teamContainer} ${isWinner && styles.winner}`}>
      <img className={styles.logo} src={logo} alt={teamName} />
      <p className={styles.name}>{teamName}</p>
      <div className={styles.score}>
        <span className={styles.scoreTitle}>Счёт:</span>
        {isChampion ? (
          <img className={styles.trophy} src={trophy} alt="Кубок чемпиона" />
        ) : (
          <input
            className={styles.scoreInput}
            inputMode="numeric"
            min={0}
            max={3}
            maxLength={1}
            value={score}
            onChange={handleChange}
            pattern={pattern}
            title={`Введите только 0, 1 или ${maxGame}`}
            onInput={(e: FormEvent<HTMLInputElement>) => {
              const target = e.currentTarget as HTMLInputElement;
              if (Number(target.value) < 0) target.value = "0";
              if (Number(target.value) > maxGame)
                target.value = String(maxGame);
            }}
          />
        )}
      </div>
    </div>
  );
};
