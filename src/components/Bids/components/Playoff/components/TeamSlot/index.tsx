import type { FC } from "react";
import type { Team } from "@/shared/config";
import type { BestOf } from "@/shared/tournament/playoffRounds";

import { EmptySlot } from "@/components/Bids/components/Playoff/components/EmptySlot";
import { ScoreInput } from "@/components/Bids/components/Playoff/components/ScoreInput";
import { TeamItem } from "@/components/Bids/components/Playoff/components/TeamItem";

export type TeamSlotProps = {
  readonly team: Team | null;
  readonly score: string;
  readonly bestOf: BestOf;
  readonly isWinner: boolean;
  readonly onScoreChange: (value: string) => void;
};

export const TeamSlot: FC<TeamSlotProps> = ({
  team,
  score,
  bestOf,
  isWinner,
  onScoreChange,
}) => {
  if (!team) {
    return <EmptySlot />;
  }

  return (
    <TeamItem logo={team.logo} teamName={team.nameTeam} isWinner={isWinner}>
      <ScoreInput
        bestOf={bestOf}
        score={score}
        teamName={team.nameTeam}
        onScoreChange={onScoreChange}
      />
    </TeamItem>
  );
};
