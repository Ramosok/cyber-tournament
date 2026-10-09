import type {
  PlayoffState,
  Round,
} from "@/components/Bids/components/Playoff/types";

export const createInitialState = (): PlayoffState => {
  const quarter: Round = {
    teams: [
      [0, 1],
      [2, 3],
      [4, 5],
      [6, 7],
    ],
    scores: Array.from({ length: 4 }, () => ({ team1: "", team2: "" })),
  };

  const semi: Round = {
    teams: [
      [undefined, undefined],
      [undefined, undefined],
    ],
    scores: Array.from({ length: 2 }, () => ({ team1: "", team2: "" })),
  };

  const final: Round = {
    teams: [[undefined, undefined]],
    scores: [{ team1: "", team2: "" }],
  };

  return { quarter, semi, final };
};
