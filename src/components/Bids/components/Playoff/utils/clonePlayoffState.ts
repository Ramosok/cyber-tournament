import type { PlayoffState } from "@/components/Bids/components/Playoff/types";

export const clonePlayoffState = (prev: PlayoffState): PlayoffState => ({
  quarter: {
    teams: prev.quarter.teams.map(
      (t) => [...t] as [number | undefined, number | undefined],
    ),
    scores: prev.quarter.scores.map((s) => ({ ...s })),
  },
  semi: {
    teams: prev.semi.teams.map(
      (t) => [...t] as [number | undefined, number | undefined],
    ),
    scores: prev.semi.scores.map((s) => ({ ...s })),
  },
  final: {
    teams: prev.final.teams.map(
      (t) => [...t] as [number | undefined, number | undefined],
    ),
    scores: prev.final.scores.map((s) => ({ ...s })),
  },
  winnerIndex: prev.winnerIndex,
});
