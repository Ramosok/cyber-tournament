/** Состояние формы отправки прогноза. Ошибка всегда приходит вместе с текстом. */
export type PredictionActionState =
  | { readonly status: "idle" }
  | { readonly status: "pending" }
  | { readonly status: "success" }
  | { readonly status: "error"; readonly error: string };

export const INITIAL_ACTION_STATE: PredictionActionState = { status: "idle" };
