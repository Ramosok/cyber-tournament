import type { FC } from "react";
import type { PlayoffProps } from "@/components/Bids/components/Playoff/types";

import { Champion } from "@/components/Bids/components/Playoff/components/Champion";
import { EmptySlot } from "@/components/Bids/components/Playoff/components/EmptySlot";
import { MatchPair } from "@/components/Bids/components/Playoff/components/MatchPair";
import { createPlayoffView } from "@/components/Bids/components/Playoff/utils/createPlayoffView";
import { createTeamIndex } from "@/shared/config";

import styles from "./playoff.module.css";

export const Playoff: FC<PlayoffProps> = ({ state, teams, onScoreChange }) => {
  const view = createPlayoffView(state, createTeamIndex(teams));
  const { quarter, semi, final, thirdPlace } = view.roundsByKey;

  return (
    <div className={styles.container}>
      <div className={styles.column}>
        <p className={styles.title}>{quarter.title}</p>
        <div className={styles.step1}>
          {quarter.matches.map((match) => (
            <MatchPair
              key={match.id}
              match={match}
              onScoreChange={(slot, value) =>
                onScoreChange("quarter", match.matchIndex, slot, value)
              }
            />
          ))}
        </div>
      </div>

      <div className={styles.column}>
        <p className={styles.title}>{semi.title}</p>
        <div className={styles.step2}>
          {semi.matches.map((match) => (
            <MatchPair
              key={match.id}
              match={match}
              onScoreChange={(slot, value) =>
                onScoreChange("semi", match.matchIndex, slot, value)
              }
            />
          ))}
        </div>
      </div>

      <div className={styles.column}>
        <p className={styles.title}>{final.title}</p>
        <div className={styles.step3}>
          <div className={styles.finalMatch}>
            {final.matches.map((match) => (
              <MatchPair
                key={match.id}
                match={match}
                onScoreChange={(slot, value) =>
                  onScoreChange("final", match.matchIndex, slot, value)
                }
              />
            ))}
          </div>

          <div className={styles.thirdPlace}>
            <p className={styles.thirdPlaceTitle}>{thirdPlace.title}</p>
            {thirdPlace.matches.map((match) => (
              <MatchPair
                key={match.id}
                match={match}
                onScoreChange={(slot, value) =>
                  onScoreChange("thirdPlace", match.matchIndex, slot, value)
                }
              />
            ))}
          </div>
        </div>
      </div>

      <div className={`${styles.column} ${styles.winner}`}>
        <p className={styles.title}>ПОБЕДИТЕЛЬ</p>
        <div className={styles.step4}>
          {view.winner ? <Champion team={view.winner} /> : <EmptySlot />}
        </div>
      </div>
    </div>
  );
};
