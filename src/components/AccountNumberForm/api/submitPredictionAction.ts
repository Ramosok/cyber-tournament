import type { PredictionActionState } from "@/components/AccountNumberForm/api/predictionActionState";
import type { PredictionForm } from "@/shared/prediction/types";

import { BASE_URL } from "@/components/AccountNumberForm/api/config";
import { buildPredictionPayload } from "@/components/AccountNumberForm/api/predictionPayload";
import { getDateAndTime } from "@/components/AccountNumberForm/utils/getDateAndTime";
import { isPredictionFormComplete } from "@/shared/prediction/types";

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

  if (!isPredictionFormComplete(form)) {
    return {
      status: "error",
      error: `Заполните все ячейки команд (${form.filledCount} из ${form.requiredCount})`,
    };
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
