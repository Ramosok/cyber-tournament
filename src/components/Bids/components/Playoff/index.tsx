import type { FC } from "react";
import type { PlayoffProps } from "@/components/Bids/components/Playoff/types";
import type { PlayoffRoundKey } from "@/shared/tournament/playoffRounds";

import { Champion } from "@/components/Bids/components/Playoff/components/Champion";
import { EmptySlot } from "@/components/Bids/components/Playoff/components/EmptySlot";
import { MatchPair } from "@/components/Bids/components/Playoff/components/MatchPair";
import { createPlayoffView } from "@/components/Bids/components/Playoff/utils/createPlayoffView";
import { createTeamIndex } from "@/shared/config";

import styles from "./playoff.module.css";

const ROUND_CLASS_NAMES: Readonly<Record<PlayoffRoundKey, string>> = {
  quarter: styles.step1,
  semi: styles.step2,
  final: styles.step3,
};

export const Playoff: FC<PlayoffProps> = ({ state, teams, onScoreChange }) => {
  const view = createPlayoffView(state, createTeamIndex(teams));

  return (
    <div className={styles.container}>
      {view.rounds.map((round) => (
        <div key={round.key}>
          <p className={styles.title}>{round.title}</p>
          <div className={ROUND_CLASS_NAMES[round.key]}>
            {round.matches.map((match) => (
              <MatchPair
                key={match.id}
                match={match}
                onScoreChange={(slot, value) =>
                  onScoreChange(round.key, match.matchIndex, slot, value)
                }
              />
            ))}
          </div>
        </div>
      ))}

      <div className={styles.winner}>
        <p className={styles.title}>ПОБЕДИТЕЛЬ</p>
        <div className={styles.step4}>
          {view.winner ? <Champion team={view.winner} /> : <EmptySlot />}
        </div>
      </div>
    </div>
  );
};
