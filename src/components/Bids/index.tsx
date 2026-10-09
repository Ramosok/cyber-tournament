import { useState } from "react";

import type { FC } from "react";
import type { PlayOffTeams } from "@/components/AccountNumberForm/api/submitPredictionAction";
import type { PlayoffState } from "@/components/Bids/components/Playoff/types";
import type { Team } from "@/shared/config";
import type { BettingStatus } from "@/shared/utils/getCurrentBettingEndDate";

import { AccountNumberForm } from "@/components/AccountNumberForm";
import { Playoff } from "@/components/Bids/components/Playoff";
import { createInitialState } from "@/components/Bids/components/Playoff/utils/createInitialState";
// import { Stage } from "@/components/Bids/components/Stage";
// import { TeamList } from "@/components/Bids/components/TeamList";
import { TEAM_LIST } from "@/shared/config";
// import { Modal, type ModalHandle } from "@/shared/ui/Modal/Modal";
import { getCurrentBettingEndDate } from "@/shared/utils/getCurrentBettingEndDate";

import styles from "./bids.module.css";

const CELL_COUNT = 16;
export const initialTeams = Array(CELL_COUNT).fill(null) as (Team | null)[];

export const Bids: FC = () => {
  // const modalRef = useRef<ModalHandle>(null);

  const [selectedTeams, setSelectedTeams] = useState<PlayOffTeams[]>([]);
  const [state, setState] = useState<PlayoffState>(() => createInitialState());
  // const [selectedTeamIds, setSelectedTeamIds] = useState<Set<string>>(
  //   new Set(),
  // );
  // const [currentCellIndex, setCurrentCellIndex] = useState<number | null>(null);

  // const handleCellClick = (index: number): void => {
  //   const currentTeam = selectedTeams[index];
  //
  //   if (currentTeam) {
  //     setSelectedTeams((prev) => {
  //       const newArr = [...prev];
  //       newArr[index] = null;
  //       return newArr;
  //     });
  //
  //     setSelectedTeamIds((prev) => {
  //       const newSet = new Set(prev);
  //       newSet.delete(currentTeam.id);
  //       return newSet;
  //     });
  //   } else {
  //     setCurrentCellIndex(index);
  //     modalRef.current?.showModal();
  //   }
  // };

  // const handleTeamSelect = (teamId: string): void => {
  //   const team = TEAM_LIST.find((t) => t.id === teamId);
  //   if (!team || currentCellIndex === null) return;
  //
  //   const label = CELL_LABEL_MAP[currentCellIndex];
  //
  //   setSelectedTeams((prev) => {
  //     const newArr = [...prev];
  //
  //     newArr[currentCellIndex] = {
  //       ...team,
  //       metaData: label,
  //     };
  //
  //     return newArr;
  //   });
  //
  //   setSelectedTeamIds((prev) => new Set([...prev, teamId]));
  //   modalRef.current?.close();
  //   setCurrentCellIndex(null);
  // };

  const onResetSelectedTeams = (): void => {
    setSelectedTeams([]);
    setState(createInitialState());
    // selectedTeamIds.clear();
    // setCurrentCellIndex(null);
  };

  const bettingStatus: BettingStatus = getCurrentBettingEndDate();

  return (
    <>
      {bettingStatus.hasActiveStage ? (
        <div className={styles.msgUnvaluable}>
          Прием прогнозов закрыт! Турнир окончен
          {/*Прием прогнозов на 3-й этап закрыт! Следующий этап откроется 8*/}
          {/*декабря.*/}
        </div>
      ) : (
        <section className={styles.container}>
          <h2 className={styles.title}>Выбери команды</h2>

          <Playoff
            setState={setState}
            state={state}
            setSelectedTeams={setSelectedTeams}
            teams={TEAM_LIST}
          />
          {/*<Stage*/}
          {/*  handleCellClick={handleCellClick}*/}
          {/*  selectedTeams={selectedTeams}*/}
          {/*/>*/}
          <AccountNumberForm
            onReset={onResetSelectedTeams}
            teamList={selectedTeams}
          />
        </section>
      )}

      {/*<Modal ref={modalRef}>*/}
      {/*  <TeamList*/}
      {/*    selectedTeamIds={selectedTeamIds}*/}
      {/*    onTeamSelect={handleTeamSelect}*/}
      {/*    currentCellIndex={currentCellIndex}*/}
      {/*  />*/}
      {/*</Modal>*/}
    </>
  );
};
