import { useActionState, useRef, useState } from "react";

import type { ChangeEvent, FC } from "react";
import type { PredictionActionState } from "@/components/AccountNumberForm/api/predictionActionState";
import type { PredictionForm } from "@/shared/prediction/types";
import type { ModalHandle } from "@/shared/ui/Modal/Modal";

import { INITIAL_ACTION_STATE } from "@/components/AccountNumberForm/api/predictionActionState";
import { submitPrediction } from "@/components/AccountNumberForm/api/submitPredictionAction";
import { SuccessModal } from "@/components/AccountNumberForm/components/SuccessModal";
import { TournamentConditions } from "@/components/AccountNumberForm/components/TournamentConditions";
import {
  ACCOUNT_NUMBER_MAX_LENGTH,
  normalizeAccountNumber,
} from "@/components/AccountNumberForm/utils/normalizeAccountNumber";
import { isPredictionFormComplete } from "@/shared/prediction/types";
import { Modal } from "@/shared/ui/Modal/Modal";

import styles from "./accountNumberForm.module.css";

export type AccountNumberFormProps = {
  readonly form: PredictionForm;
  readonly onReset: () => void;
};

export const AccountNumberForm: FC<AccountNumberFormProps> = ({
  form,
  onReset,
}) => {
  const successModalRef = useRef<ModalHandle>(null);
  const conditionsModalRef = useRef<ModalHandle>(null);

  const [accountNumber, setAccountNumber] = useState("");

  const isPredictionReady = isPredictionFormComplete(form);
  const progressLabel =
    form.mode === "playoff" ? "Заполнено матчей" : "Заполнено ячеек";

  const [actionState, formAction, isPending] = useActionState<
    PredictionActionState,
    FormData
  >(async (prevState, formData) => {
    const result = await submitPrediction(prevState, formData, form);

    if (result.status === "success") {
      successModalRef.current?.showModal();
      setAccountNumber("");
      onReset();
    }

    return result;
  }, INITIAL_ACTION_STATE);

  const handleAccountChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setAccountNumber(normalizeAccountNumber(event.target.value));
  };

  const handleCloseSuccessModal = (): void => {
    successModalRef.current?.close();
  };

  const handleOpenConditions = (): void => {
    conditionsModalRef.current?.showModal();
  };

  return (
    <>
      <form className={styles.form} action={formAction}>
        <h3 className={styles.title}>Номер игрового счёта</h3>

        <input
          className={styles.input}
          name="accountNumber"
          value={accountNumber}
          onChange={handleAccountChange}
          maxLength={ACCOUNT_NUMBER_MAX_LENGTH}
          placeholder="XXXXX"
          type="text"
          inputMode="numeric"
          autoComplete="off"
        />

        {!isPredictionReady && (
          <p className={styles.progress}>
            {progressLabel}: {form.filledCount} из {form.requiredCount}
          </p>
        )}

        {actionState.status === "success" && (
          <p className={styles.success}>Прогноз успешно отправлен</p>
        )}

        <button
          className={styles.btnSubmit}
          type="submit"
          disabled={isPending || !isPredictionReady}
        >
          {isPending ? "ОТПРАВКА..." : "ОСТАВИТЬ ПРОГНОЗ"}
        </button>

        {actionState.status === "error" && (
          <p className={styles.error}>{actionState.error}</p>
        )}

        <span className={styles.linkWrapper}>
          Нет игрового счёта?{" "}
          <a
            className={styles.link}
            target="_blank"
            rel="noreferrer"
            href="https://maxline.by/?modal=registration"
          >
            Регистрация
          </a>{" "}
        </span>

        <button
          disabled={isPending}
          type="button"
          className={styles.link}
          onClick={handleOpenConditions}
        >
          Условия турнира
        </button>
      </form>

      <Modal
        ariaLabel="Условия турнира"
        className={styles.tournamentConditionsModal}
        ref={conditionsModalRef}
      >
        <TournamentConditions />
      </Modal>

      <Modal
        ariaLabel="Прогноз отправлен"
        className={styles.successModal}
        noCross
        ref={successModalRef}
      >
        <SuccessModal onClose={handleCloseSuccessModal} />
      </Modal>
    </>
  );
};
