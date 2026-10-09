import type { TeamId } from "@/shared/config";
import type { StepNumber } from "@/shared/tournament/bettingStatus";
import type { PlayoffRoundKey } from "@/shared/tournament/playoffRounds";
import type { CellIndex, GroupLabel } from "@/shared/tournament/stageGrid";

/**
 * Единая модель прогноза.
 * И общая сетка (Stage), и плей-офф (Playoff) собирают один и тот же список
 * `Prediction`, поэтому форма и отправка не зависят от текущего этапа.
 */

/** Команда в прогнозе — только то, что нужно для отправки. */
export type PredictionTeam = {
  readonly id: TeamId;
  readonly name: string;
};

export type PredictionTeamScore = PredictionTeam & {
  readonly score: number;
};

/** Выбранная команда в ячейке общей сетки (этапы 1–3). */
export type GroupPickPrediction = {
  readonly kind: "groupPick";
  readonly group: GroupLabel;
  readonly cellIndex: CellIndex;
  readonly team: PredictionTeam;
};

/** Сыгранный матч плей-офф. */
export type MatchPrediction = {
  readonly kind: "match";
  readonly round: PlayoffRoundKey;
  readonly matchIndex: number;
  readonly team1: PredictionTeamScore;
  readonly team2: PredictionTeamScore;
};

/** Победитель турнира. */
export type WinnerPrediction = {
  readonly kind: "winner";
  readonly team: PredictionTeam;
};

export type Prediction =
  | GroupPickPrediction
  | MatchPrediction
  | WinnerPrediction;

/** Какой сценарий заполняет пользователь: общая сетка или плей-офф. */
export type PredictionMode = "stage" | "playoff";

/** Результат сборки прогноза: что уже заполнено и сколько всего нужно. */
export type PredictionDraft = {
  readonly predictions: readonly Prediction[];
  readonly filledCount: number;
  readonly requiredCount: number;
  /** Раунд плей-офф, на котором заполнение остановилось. */
  readonly firstIncompleteRound?: PlayoffRoundKey;
};

/** Форма прогноза, с которой работает AccountNumberForm и API. */
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
