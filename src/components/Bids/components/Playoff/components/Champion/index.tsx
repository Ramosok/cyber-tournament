import type { FC } from "react";
import type { Team } from "@/shared/config";

import { TeamItem } from "@/components/Bids/components/Playoff/components/TeamItem";
import trophy from "@/shared/assets/trophy.svg";

import styles from "./champion.module.css";

export type ChampionProps = {
  readonly team: Team;
};

export const Champion: FC<ChampionProps> = ({ team }) => {
  return (
    <TeamItem
      logo={team.logo}
      teamName={team.nameTeam}
      isWinner
      showScoreLabel={false}
    >
      <img className={styles.trophy} src={trophy} alt="Кубок чемпиона" />
    </TeamItem>
  );
};
