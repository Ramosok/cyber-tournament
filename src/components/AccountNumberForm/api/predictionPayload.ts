import type { PredictionForm } from "@/shared/prediction/types";

import { formatPredictionLines } from "@/shared/prediction/formatPrediction";

export const PREDICTION_FIELDS = [
  "f1",
  "f2",
  "f3",
  "f4",
  "f5",
  "f6",
  "f7",
  "f8",
] as const;

export type PredictionFieldName = (typeof PREDICTION_FIELDS)[number];

export type PredictionFields = Readonly<Record<PredictionFieldName, string>>;

export type PredictionPayload = PredictionFields & {
  readonly account_number: string;
  readonly time: string;
  readonly step: string;
};

const toFields = (lines: readonly string[]): PredictionFields =>
  Object.fromEntries(
    PREDICTION_FIELDS.map((field, index) => [field, lines[index] ?? ""]),
  ) as PredictionFields;

export const buildPredictionPayload = (
  form: PredictionForm,
  accountNumber: string,
  time: string,
): PredictionPayload => ({
  ...toFields(formatPredictionLines(form.predictions)),
  account_number: accountNumber,
  time,
  step: String(form.step),
});
