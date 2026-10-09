import { Fragment, useEffect, useMemo } from "react";

import type { FC } from "react";
import type {
  PlayoffProps,
  PlayoffState,
} from "@/components/Bids/components/Playoff/types";
// import type { PlayoffResult } from "@/components/Bids/components/Playoff/utils/buildPlayoffResults";
import type { Team } from "@/shared/config";

import { EmptySlot } from "@/components/Bids/components/Playoff/components/EmptySlot";
import { TeamItem } from "@/components/Bids/components/Playoff/components/TeamItem";
import { buildPlayoffResults } from "@/components/Bids/components/Playoff/utils/buildPlayoffResults";
import { clonePlayoffState } from "@/components/Bids/components/Playoff/utils/clonePlayoffState";
// import { createInitialState } from "@/components/Bids/components/Playoff/utils/createInitialState";
import { getWinnerIndexInPair } from "@/components/Bids/components/Playoff/utils/getWinnerIndexInPair";
import { handleFinalUpdate } from "@/components/Bids/components/Playoff/utils/handleFinalUpdate";
import { handleQuarterUpdate } from "@/components/Bids/components/Playoff/utils/handleQuarterUpdate";
import { handleSemiUpdate } from "@/components/Bids/components/Playoff/utils/handleSemiUpdate";
import { isWinner } from "@/components/Bids/components/Playoff/utils/isWinner";

import styles from "./playoff.module.css";

export const Playoff: FC<PlayoffProps> = ({
  teams,
  setSelectedTeams,
  setState,
  state,
}) => {
  const updateRoundScore = (
    roundKey: "quarter" | "semi" | "final",
    matchIndex: number,
    teamIndex: 0 | 1,
    value: string,
  ): void => {
    setState((prev): PlayoffState => {
      const next = clonePlayoffState(prev);

      const round = next[roundKey];
      const scoreObj = round.scores[matchIndex];
      const field = teamIndex === 0 ? "team1" : "team2";

      scoreObj[field] = value;

      const BO = roundKey === "final" ? 5 : 3;

      const winnerInPair = getWinnerIndexInPair(
        scoreObj.team1,
        scoreObj.team2,
        BO,
      );

      switch (roundKey) {
        case "quarter":
          handleQuarterUpdate(next, matchIndex, winnerInPair);
          break;
        case "semi":
          handleSemiUpdate(next, matchIndex, winnerInPair);
          break;
        case "final":
          handleFinalUpdate(next, winnerInPair);
          break;
      }

      return next;
    });
  };

  const quarterMatches = useMemo(
    () =>
      state.quarter.teams.map(([i1, i2], matchIndex) => ({
        matchIndex,
        team1: i1 !== undefined ? teams[i1] : undefined,
        team2: i2 !== undefined ? teams[i2] : undefined,
        score: state.quarter.scores[matchIndex],
      })),
    [state.quarter, teams],
  );

  const semiMatches = useMemo(
    () =>
      state.semi.teams.map(([i1, i2], matchIndex) => ({
        matchIndex,
        team1: i1 !== undefined ? teams[i1] : undefined,
        team2: i2 !== undefined ? teams[i2] : undefined,
        score: state.semi.scores[matchIndex],
      })),
    [state.semi, teams],
  );

  const finalMatch = useMemo(() => {
    const [i1, i2] = state.final.teams[0];
    return {
      team1: i1 !== undefined ? teams[i1] : undefined,
      team2: i2 !== undefined ? teams[i2] : undefined,
      score: state.final.scores[0],
    };
  }, [state.final, teams]);

  const winner = useMemo(
    () =>
      state.winnerIndex !== undefined ? teams[state.winnerIndex] : undefined,
    [state.winnerIndex, teams],
  );

  const playoffResults = useMemo(
    () => buildPlayoffResults(state, teams as Team[]),
    [state],
  );

  useEffect(() => {
    if (playoffResults) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setSelectedTeams(playoffResults);
    }
  }, [playoffResults]);

  const BO3 = 3;
  const BO5 = 5;

  return (
    <div className={styles.container}>
      {/* 1/4 */}
      <div>
        <p className={styles.title}>1/4 (BO3)</p>
        <div className={styles.step1}>
          {quarterMatches.map(({ matchIndex, team1, team2, score }) => (
            <Fragment key={matchIndex}>
              {team1 && (
                <TeamItem
                  logo={team1.logo}
                  teamName={team1.nameTeam}
                  score={score.team1}
                  bo={BO3}
                  isWinner={isWinner(score, BO3).team1}
                  onScoreChange={(val) =>
                    updateRoundScore("quarter", matchIndex, 0, val)
                  }
                />
              )}
              {team2 && (
                <TeamItem
                  logo={team2.logo}
                  teamName={team2.nameTeam}
                  score={score.team2}
                  bo={BO3}
                  isWinner={isWinner(score, BO3).team2}
                  onScoreChange={(val) =>
                    updateRoundScore("quarter", matchIndex, 1, val)
                  }
                />
              )}
            </Fragment>
          ))}
        </div>
      </div>
      {/* 1/2 */}
      <div>
        <p className={styles.title}>1/2 (BO3)</p>
        <div className={styles.step2}>
          {semiMatches.map(({ matchIndex, team1, team2, score }) => (
            <Fragment key={matchIndex}>
              {team1 ? (
                <TeamItem
                  logo={team1.logo}
                  teamName={team1.nameTeam}
                  score={score.team1}
                  bo={BO3}
                  isWinner={isWinner(score, BO3).team1}
                  onScoreChange={(val) =>
                    updateRoundScore("semi", matchIndex, 0, val)
                  }
                />
              ) : (
                <EmptySlot />
              )}

              {team2 ? (
                <TeamItem
                  logo={team2.logo}
                  teamName={team2.nameTeam}
                  bo={BO3}
                  isWinner={isWinner(score, BO3).team2}
                  score={score.team2}
                  onScoreChange={(val) =>
                    updateRoundScore("semi", matchIndex, 1, val)
                  }
                />
              ) : (
                <EmptySlot />
              )}
            </Fragment>
          ))}
        </div>
      </div>
      {/* ФИНАЛ */}
      <div>
        <p className={styles.title}>ФИНАЛ (BO5)</p>
        <div className={styles.step3}>
          {finalMatch.team1 ? (
            <TeamItem
              logo={finalMatch.team1.logo}
              teamName={finalMatch.team1.nameTeam}
              score={finalMatch.score.team1}
              bo={BO5}
              isWinner={isWinner(finalMatch.score, BO5).team1}
              onScoreChange={(val) => updateRoundScore("final", 0, 0, val)}
            />
          ) : (
            <EmptySlot />
          )}

          {finalMatch.team2 ? (
            <TeamItem
              logo={finalMatch.team2.logo}
              teamName={finalMatch.team2.nameTeam}
              score={finalMatch.score.team2}
              bo={BO5}
              isWinner={isWinner(finalMatch.score, BO5).team2}
              onScoreChange={(val) => updateRoundScore("final", 0, 1, val)}
            />
          ) : (
            <EmptySlot />
          )}
        </div>
      </div>

      <div className={styles.winner}>
        <p className={styles.title}>ПОБЕДИТЕЛЬ</p>
        <div className={styles.step4}>
          {winner ? (
            <TeamItem
              logo={winner.logo}
              teamName={winner.nameTeam}
              score={""}
              isWinner={true}
              isChampion={true}
              bo={BO5}
              onScoreChange={(val) => updateRoundScore("semi", 0, 0, val)}
            />
          ) : (
            <EmptySlot />
          )}
        </div>
      </div>
    </div>
  );
};
