import { useRef, useState } from "react";

import type { FC } from "react";
import type { PlayoffState } from "@/components/Bids/components/Playoff/types";
import type { TeamId } from "@/shared/config";
import type {
  MatchSlot,
  PlayoffRoundKey,
} from "@/shared/tournament/playoffRounds";
import type { CellIndex } from "@/shared/tournament/stageGrid";
import type { StageSelection } from "@/shared/tournament/stageSelection";
import type { ModalHandle } from "@/shared/ui/Modal/Modal";

import { AccountNumberForm } from "@/components/AccountNumberForm";
import { Playoff } from "@/components/Bids/components/Playoff";
import { buildPlayoffPredictions } from "@/components/Bids/components/Playoff/utils/buildPlayoffPredictions";
import { createInitialState } from "@/components/Bids/components/Playoff/utils/createInitialState";
import { setMatchScore } from "@/components/Bids/components/Playoff/utils/setMatchScore";
import { Stage } from "@/components/Bids/components/Stage";
import { TeamList } from "@/components/Bids/components/TeamList";
import { MILLISECONDS_PER_SECOND } from "@/components/Timer/utils/calculateTimeLeft";
import { createTeamIndex, STAGE_TEAM_LIST, TEAM_LIST } from "@/shared/config";
import { useNow } from "@/shared/hooks/useNow";
import { buildStagePredictions } from "@/shared/prediction/buildStagePredictions";
import { createPredictionForm } from "@/shared/prediction/types";
import { getBettingClosedMessage } from "@/shared/tournament/bettingClosedMessage";
import { getBettingStatus } from "@/shared/tournament/bettingStatus";
import {
  createEmptyStageSelection,
  getSelectedTeamIds,
  setCellTeam,
} from "@/shared/tournament/stageSelection";
import { Modal } from "@/shared/ui/Modal/Modal";

import styles from "./bids.module.css";

// Списки команд статичны — индексы строятся один раз на модуль.
const stageTeamIndex = createTeamIndex(STAGE_TEAM_LIST);
const playoffTeamIndex = createTeamIndex(TEAM_LIST);

export const Bids: FC = () => {
  const bettingStatus = getBettingStatus(useNow(MILLISECONDS_PER_SECOND));

  const [stageSelection, setStageSelection] = useState<StageSelection>(
    createEmptyStageSelection,
  );
  const [playoffState, setPlayoffState] = useState<PlayoffState>(() =>
    createInitialState(TEAM_LIST),
  );

  const pickedCellRef = useRef<CellIndex | null>(null);
  const teamPickerRef = useRef<ModalHandle>(null);

  const selectedTeamIds = getSelectedTeamIds(stageSelection);

  /**
   * И сетка, и плей-офф отдают одну и ту же модель PredictionForm,
   * поэтому форма ниже не знает, какой этап сейчас идёт.
   */
  const isPlayoff = bettingStatus.isFinalStep;
  const predictionForm = createPredictionForm(
    bettingStatus.currentStep,
    isPlayoff ? "playoff" : "stage",
    isPlayoff
      ? buildPlayoffPredictions(playoffState, playoffTeamIndex)
      : buildStagePredictions(stageSelection, stageTeamIndex),
  );

  const handleCellClick = (cellIndex: CellIndex): void => {
    if (stageSelection[cellIndex] !== null) {
      setStageSelection((prev) => setCellTeam(prev, cellIndex, null));
      return;
    }

    pickedCellRef.current = cellIndex;
    teamPickerRef.current?.showModal();
  };

  const handleTeamSelect = (teamId: TeamId): void => {
    const cellIndex = pickedCellRef.current;
    if (cellIndex === null) {
      return;
    }

    setStageSelection((prev) => setCellTeam(prev, cellIndex, teamId));
    teamPickerRef.current?.close();
    pickedCellRef.current = null;
  };

  const handleScoreChange = (
    round: PlayoffRoundKey,
    matchIndex: number,
    slot: MatchSlot,
    value: string,
  ): void => {
    setPlayoffState((prev) =>
      setMatchScore(prev, round, matchIndex, slot, value),
    );
  };

  const handleReset = (): void => {
    setStageSelection(createEmptyStageSelection());
    setPlayoffState(createInitialState(TEAM_LIST));
    pickedCellRef.current = null;
  };

  if (!bettingStatus.isBettingOpen) {
    return (
      <div className={styles.msgClosed}>
        {getBettingClosedMessage(bettingStatus)}
      </div>
    );
  }

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Выбери команды</h2>

      {isPlayoff ? (
        <Playoff
          state={playoffState}
          teams={TEAM_LIST}
          onScoreChange={handleScoreChange}
        />
      ) : (
        <Stage
          selection={stageSelection}
          teams={STAGE_TEAM_LIST}
          onCellClick={handleCellClick}
        />
      )}

      <AccountNumberForm form={predictionForm} onReset={handleReset} />

      {!isPlayoff && (
        <Modal ariaLabel="Выбор команды" ref={teamPickerRef}>
          <TeamList
            teams={STAGE_TEAM_LIST}
            selectedTeamIds={selectedTeamIds}
            onTeamSelect={handleTeamSelect}
          />
        </Modal>
      )}
    </section>
  );
};
