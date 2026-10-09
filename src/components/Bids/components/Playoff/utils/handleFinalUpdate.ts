import type { PlayoffState } from "@/components/Bids/components/Playoff/types";

export const handleFinalUpdate = (
  next: PlayoffState,
  winnerInPair: 0 | 1 | null,
): void => {
  const [idx1, idx2] = next.final.teams[0];

  const hasBothTeams = idx1 !== undefined && idx2 !== undefined;
  const hasWinner = winnerInPair !== null && hasBothTeams;

  if (hasWinner) {
    next.winnerIndex = winnerInPair === 0 ? idx1 : idx2;
  } else {
    next.winnerIndex = undefined;
  }
};
