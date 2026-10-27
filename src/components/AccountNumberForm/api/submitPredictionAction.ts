import type { PredictionActionState } from "@/components/AccountNumberForm/api/predictionActionState";
import type { PredictionForm } from "@/shared/prediction/types";

import { BASE_URL } from "@/components/AccountNumberForm/api/config";
import { buildPredictionPayload } from "@/components/AccountNumberForm/api/predictionPayload";
import { getPredictionValidationError } from "@/components/AccountNumberForm/api/predictionValidationError";
import { getDateAndTime } from "@/components/AccountNumberForm/utils/getDateAndTime";

const ERROR_NO_ACCOUNT = "Укажите номер игрового счёта";
const ERROR_NETWORK = "Не удалось отправить данные";

const readAccountNumber = (formData: FormData): string => {
  const rawAccount = formData.get("accountNumber");

  return typeof rawAccount === "string" ? rawAccount.trim() : "";
};

export const submitPrediction = async (
  _prevState: PredictionActionState,
  formData: FormData,
  form: PredictionForm,
): Promise<PredictionActionState> => {
  const accountNumber = readAccountNumber(formData);

  if (accountNumber === "") {
    return { status: "error", error: ERROR_NO_ACCOUNT };
  }

  const validationError = getPredictionValidationError(form);

  if (validationError !== null) {
    return { status: "error", error: validationError };
  }

  const payload = buildPredictionPayload(form, accountNumber, getDateAndTime());

  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      body: new URLSearchParams({ ...payload }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");

      return {
        status: "error",
        error: text === "" ? `Ошибка отправки (${response.status})` : text,
      };
    }

    return { status: "success" };
  } catch (error) {
    console.error(error);

    return { status: "error", error: ERROR_NETWORK };
  }
};
