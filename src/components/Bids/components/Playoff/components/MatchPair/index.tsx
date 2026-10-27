import type { FC } from "react";
import type { PlayoffMatchView } from "@/components/Bids/components/Playoff/utils/createPlayoffView";
import type { MatchSlot } from "@/shared/tournament/playoffRounds";

import { TeamSlot } from "@/components/Bids/components/Playoff/components/TeamSlot";
import { getWinnerFlags } from "@/components/Bids/components/Playoff/utils/matchScore";

import styles from "./matchPair.module.css";

export type MatchPairProps = {
  readonly match: PlayoffMatchView;
  readonly onScoreChange: (slot: MatchSlot, value: string) => void;
};

/** Пара соперников в одном матче. */
export const MatchPair: FC<MatchPairProps> = ({ match, onScoreChange }) => {
  const winnerFlags = getWinnerFlags(match.score, match.bestOf);

  return (
    <div className={styles.matchPair}>
      <TeamSlot
        team={match.team1}
        score={match.score.team1}
        bestOf={match.bestOf}
        isWinner={winnerFlags.team1}
        onScoreChange={(value) => onScoreChange(0, value)}
      />
      <TeamSlot
        team={match.team2}
        score={match.score.team2}
        bestOf={match.bestOf}
        isWinner={winnerFlags.team2}
        onScoreChange={(value) => onScoreChange(1, value)}
      />
    </div>
  );
};
