import type { FC, ReactElement } from "react";
import type { Team } from "@/shared/config";

import { Cell } from "@/components/Bids/components/Cell";

import styles from "../../bids.module.css";

type StageProps = {
  selectedTeams: (Team | null)[];
  handleCellClick: (index: number) => void;
};

export const Stage: FC<StageProps> = ({ selectedTeams, handleCellClick }) => {
  const renderCell = (index: number): ReactElement => (
    <Cell
      key={index}
      selectedTeam={selectedTeams[index]}
      onClick={() => handleCellClick(index)}
    />
  );

  return (
    <div className={styles.gridWrapper}>
      {/* ===== Ряд 1: 3-0 | 0-3 ===== */}
      <div className={styles.row}>
        {/* Левая группа 3-0 */}
        <div className={styles.group}>
          <div className={styles.groupLabel}>3-0</div>
          <div className={styles.groupCells}>
            {renderCell(0)}
            {renderCell(1)}
          </div>
        </div>

        {/* Вертикальная линия между группами */}
        <div className={styles.verticalDivider} aria-hidden="true" />

        {/* Правая группа 0-3 */}
        <div className={styles.group}>
          <div className={styles.groupLabel}>0-3</div>
          <div className={styles.groupCells}>
            {renderCell(2)}
            {renderCell(3)}
          </div>
        </div>
      </div>

      {/* Горизонтальная линия между 1 и 2 рядом */}
      <div className={styles.horizontalDivider} aria-hidden="true" />

      {/* ===== Ряд 2: 3-1 | 3-2 ===== */}
      <div className={styles.row}>
        <div className={styles.group}>
          <div className={styles.groupLabel}>3-1</div>
          <div className={styles.groupCells}>
            {renderCell(4)}
            {renderCell(5)}
            {renderCell(6)}
          </div>
        </div>

        <div className={styles.verticalDivider} aria-hidden="true" />

        <div className={styles.group}>
          <div className={styles.groupLabel}>3-2</div>
          <div className={styles.groupCells}>
            {renderCell(7)}
            {renderCell(8)}
            {renderCell(9)}
          </div>
        </div>
      </div>

      {/* Горизонтальная линия между 2 и 3 рядом */}
      <div className={styles.horizontalDivider} aria-hidden="true" />

      {/* ===== Ряд 3: 1-3 | 2-3 ===== */}
      <div className={styles.row}>
        <div className={styles.group}>
          <div className={styles.groupLabel}>1-3</div>
          <div className={styles.groupCells}>
            {renderCell(10)}
            {renderCell(11)}
            {renderCell(12)}
          </div>
        </div>

        <div className={styles.verticalDivider} aria-hidden="true" />

        <div className={styles.group}>
          <div className={styles.groupLabel}>2-3</div>
          <div className={styles.groupCells}>
            {renderCell(13)}
            {renderCell(14)}
            {renderCell(15)}
          </div>
        </div>
      </div>
    </div>
  );
};
