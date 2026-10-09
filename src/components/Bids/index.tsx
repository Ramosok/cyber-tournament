import { useCallback, useMemo, useRef, useState } from "react";

import type { FC } from "react";
import type { PlayoffState } from "@/components/Bids/components/Playoff/types";
import type { TeamId } from "@/shared/config";
import type { PredictionForm } from "@/shared/prediction/types";
import type { BettingStatus } from "@/shared/tournament/bettingStatus";
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
import { createTeamIndex, STAGE_TEAM_LIST, TEAM_LIST } from "@/shared/config";
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

export const Bids: FC = () => {
  const [bettingStatus] = useState<BettingStatus>(getBettingStatus);

  const [stageSelection, setStageSelection] = useState<StageSelection>(
    createEmptyStageSelection,
  );
  const [playoffState, setPlayoffState] = useState<PlayoffState>(() =>
    createInitialState(TEAM_LIST),
  );
  const [pickedCellIndex, setPickedCellIndex] = useState<CellIndex | null>(
    null,
  );

  const teamPickerRef = useRef<ModalHandle>(null);

  // Для сетки 1–3 этапов — все 16 участников, для плей-офф — 8 прошедших.
  const stageTeamIndex = useMemo(() => createTeamIndex(STAGE_TEAM_LIST), []);
  const playoffTeamIndex = useMemo(() => createTeamIndex(TEAM_LIST), []);
  const selectedTeamIds = useMemo(
    () => getSelectedTeamIds(stageSelection),
    [stageSelection],
  );

  /**
   * И сетка, и плей-офф отдают одну и ту же модель PredictionForm,
   * поэтому форма ниже не знает, какой этап сейчас идёт.
   */
  const predictionForm = useMemo<PredictionForm>(() => {
    const draft = bettingStatus.isFinalStep
      ? buildPlayoffPredictions(playoffState, playoffTeamIndex)
      : buildStagePredictions(stageSelection, stageTeamIndex);

    return createPredictionForm(bettingStatus.currentStep, draft);
  }, [
    bettingStatus,
    playoffState,
    stageSelection,
    stageTeamIndex,
    playoffTeamIndex,
  ]);

  const handleCellClick = useCallback(
    (cellIndex: CellIndex): void => {
      if (stageSelection[cellIndex] !== null) {
        setStageSelection((prev) => setCellTeam(prev, cellIndex, null));
        return;
      }

      setPickedCellIndex(cellIndex);
      teamPickerRef.current?.showModal();
    },
    [stageSelection],
  );

  const handleTeamSelect = useCallback(
    (teamId: TeamId): void => {
      if (pickedCellIndex === null) {
        return;
      }

      setStageSelection((prev) => setCellTeam(prev, pickedCellIndex, teamId));
      teamPickerRef.current?.close();
      setPickedCellIndex(null);
    },
    [pickedCellIndex],
  );

  const handleScoreChange = useCallback(
    (
      round: PlayoffRoundKey,
      matchIndex: number,
      slot: MatchSlot,
      value: string,
    ): void => {
      setPlayoffState((prev) =>
        setMatchScore(prev, round, matchIndex, slot, value),
      );
    },
    [],
  );

  const handleReset = useCallback((): void => {
    setStageSelection(createEmptyStageSelection());
    setPlayoffState(createInitialState(TEAM_LIST));
    setPickedCellIndex(null);
  }, []);

  if (!bettingStatus.isBettingOpen) {
    return (
      <div className={styles.msgUnvaluable}>
        {getBettingClosedMessage(bettingStatus)}
      </div>
    );
  }

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Выбери команды</h2>

      {bettingStatus.isFinalStep ? (
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

      {!bettingStatus.isFinalStep && (
        <Modal ref={teamPickerRef}>
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
