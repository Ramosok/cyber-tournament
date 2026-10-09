import type { MatchScore } from "@/components/Bids/components/Playoff/types";

export const isWinner = (
  score: MatchScore,
  bo: number,
): { team1: boolean; team2: boolean } => {
  const maxWin = Math.ceil(bo / 2);
  return {
    team1:
      Boolean(score.team1 && score.team2) &&
      score.team1 > score.team2 &&
      (Number(score.team1) + Number(score.team2) <= bo ||
        Number(score.team1) === maxWin ||
        Number(score.team2) === maxWin),
    team2:
      Boolean(score.team1 && score.team2) &&
      score.team1 < score.team2 &&
      (Number(score.team2) + Number(score.team1) <= bo ||
        Number(score.team1) === maxWin ||
        Number(score.team2) === maxWin),
  };
};
