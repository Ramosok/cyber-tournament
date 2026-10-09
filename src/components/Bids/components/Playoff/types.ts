import type { Dispatch, SetStateAction } from "react";
import type { PlayOffTeams } from "@/components/AccountNumberForm/api/submitPredictionAction";
import type { Team } from "@/shared/config";

export type MatchScore = { team1: string; team2: string };

export type Round = {
  teams: [number | undefined, number | undefined][];
  scores: MatchScore[];
};

export type PlayoffState = {
  quarter: Round;
  semi: Round;
  final: Round;
  winnerIndex?: number | undefined;
};

export type PlayoffProps = {
  teams: (Team | null)[];
  setSelectedTeams: Dispatch<SetStateAction<PlayOffTeams[]>>;
  setState: Dispatch<SetStateAction<PlayoffState>>;
  state: PlayoffState;
};
