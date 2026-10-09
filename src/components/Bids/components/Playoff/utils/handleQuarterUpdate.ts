import type { PlayoffState } from "@/components/Bids/components/Playoff/types";

export const handleQuarterUpdate = (
  next: PlayoffState,
  matchIndex: number,
  winnerInPair: 0 | 1 | null,
): void => {
  const [idx1, idx2] = next.quarter.teams[matchIndex];

  const semiMatchIndex = Math.floor(matchIndex / 2); // 0 или 1
  const semiSlotIndex = matchIndex % 2; // 0 или 1

  const hasBothTeams = idx1 !== undefined && idx2 !== undefined;
  const hasWinner = winnerInPair !== null && hasBothTeams;

  if (hasWinner) {
    const winnerTeamIndex = winnerInPair === 0 ? idx1 : idx2;
    next.semi.teams[semiMatchIndex][semiSlotIndex] = winnerTeamIndex;
  } else {
    // счёт невалиден или команды ещё не определены → очищаем слот
    next.semi.teams[semiMatchIndex][semiSlotIndex] = undefined;
  }

  // состав матча 1/2 поменялся → сбрасываем его счёт
  next.semi.scores[semiMatchIndex] = { team1: "", team2: "" };

  // и инвалидируем финал + победителя
  next.final.teams = [[undefined, undefined]];
  next.final.scores = [{ team1: "", team2: "" }];
  next.winnerIndex = undefined;
};
