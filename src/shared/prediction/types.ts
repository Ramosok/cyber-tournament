import type { TeamId } from "@/shared/config";
import type { StepNumber } from "@/shared/tournament/bettingStatus";
import type { PlayoffRoundKey } from "@/shared/tournament/playoffRounds";
import type { CellIndex, GroupLabel } from "@/shared/tournament/stageGrid";

export type PredictionTeam = {
  readonly id: TeamId;
  readonly name: string;
};

export type PredictionTeamScore = PredictionTeam & {
  readonly score: number;
};

export type GroupPickPrediction = {
  readonly kind: "groupPick";
  readonly group: GroupLabel;
  readonly cellIndex: CellIndex;
  readonly team: PredictionTeam;
};

export type MatchPrediction = {
  readonly kind: "match";
  readonly round: PlayoffRoundKey;
  readonly matchIndex: number;
  readonly team1: PredictionTeamScore;
  readonly team2: PredictionTeamScore;
};

export type WinnerPrediction = {
  readonly kind: "winner";
  readonly team: PredictionTeam;
};

export type Prediction =
  | GroupPickPrediction
  | MatchPrediction
  | WinnerPrediction;

export type PredictionMode = "stage" | "playoff";

export type PredictionDraft = {
  readonly predictions: readonly Prediction[];
  readonly filledCount: number;
  readonly requiredCount: number;
  readonly firstIncompleteRound?: PlayoffRoundKey;
};

export type PredictionForm = PredictionDraft & {
  readonly step: StepNumber;
  readonly mode: PredictionMode;
};

export const isPredictionFormComplete = (form: PredictionForm): boolean =>
  form.filledCount >= form.requiredCount;

export const createPredictionForm = (
  step: StepNumber,
  mode: PredictionMode,
  draft: PredictionDraft,
): PredictionForm => ({ ...draft, step, mode });

export const isGroupPickPrediction = (
  prediction: Prediction,
): prediction is GroupPickPrediction => prediction.kind === "groupPick";

export const isMatchPrediction = (
  prediction: Prediction,
): prediction is MatchPrediction => prediction.kind === "match";
