import type { PredictionForm } from "@/shared/prediction/types";
import type { PlayoffRoundKey } from "@/shared/tournament/playoffRounds";

import { isPredictionFormComplete } from "@/shared/prediction/types";

const ROUND_NAMES: Readonly<Record<PlayoffRoundKey, string>> = {
  quarter: "1/4 финала",
  semi: "1/2 финала",
  final: "финала",
  thirdPlace: "матча за 3-е место",
};

const getPlayoffError = (form: PredictionForm): string => {
  const progress = `${form.filledCount} из ${form.requiredCount}`;
  const round = form.firstIncompleteRound;

  if (!round) {
    return `Заполните счёт во всех матчах плей-офф (${progress})`;
  }

  return `Заполните счёт в матчах ${ROUND_NAMES[round]} (${progress})`;
};

export const getPredictionValidationError = (
  form: PredictionForm,
): string | null => {
  if (isPredictionFormComplete(form)) {
    return null;
  }

  if (form.mode === "playoff") {
    return getPlayoffError(form);
  }

  return `Заполните все ячейки команд (${form.filledCount} из ${form.requiredCount})`;
};
