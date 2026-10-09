import type { PlayoffState } from "@/components/Bids/components/Playoff/types";

export const handleSemiUpdate = (
  next: PlayoffState,
  matchIndex: number,
  winnerInPair: 0 | 1 | null,
): void => {
  const [idx1, idx2] = next.semi.teams[matchIndex];

  const hasBothTeams = idx1 !== undefined && idx2 !== undefined;
  const hasWinner = winnerInPair !== null && hasBothTeams;

  if (hasWinner) {
    const winnerTeamIndex = winnerInPair === 0 ? idx1 : idx2;
    next.final.teams[0][matchIndex] = winnerTeamIndex;
  } else {
    next.final.teams[0][matchIndex] = undefined;
  }

  // состав финала поменялся → сбрасываем его счёт и победителя
  next.final.scores[0] = { team1: "", team2: "" };
  next.winnerIndex = undefined;
};
