import { useActionState, useRef } from "react";

import type { FC } from "react";
import type { PredictionActionState } from "@/components/AccountNumberForm/api/predictionActionState";
import type { PredictionForm } from "@/shared/prediction/types";
import type { ModalHandle } from "@/shared/ui/Modal/Modal";

import { INITIAL_ACTION_STATE } from "@/components/AccountNumberForm/api/predictionActionState";
import { submitPrediction } from "@/components/AccountNumberForm/api/submitPredictionAction";
import { SuccessModal } from "@/components/AccountNumberForm/components/SuccessModal";
import { TournamentConditions } from "@/components/AccountNumberForm/components/TournamentConditions";
import { handleInputOnlyNumber } from "@/components/AccountNumberForm/utils/handleInputOnlyNumber";
import { Modal } from "@/shared/ui/Modal/Modal";

import styles from "./accountNumberForm.module.css";

export type AccountNumberFormProps = {
  readonly form: PredictionForm;
  readonly onReset: () => void;
};

const ACCOUNT_MAX_LENGTH = 9;

export const AccountNumberForm: FC<AccountNumberFormProps> = ({
  form,
  onReset,
}) => {
  const successModalRef = useRef<ModalHandle>(null);
  const conditionsModalRef = useRef<ModalHandle>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [actionState, formAction, isPending] = useActionState<
    PredictionActionState,
    FormData
  >(async (_prevState, formData) => {
    const result = await submitPrediction(_prevState, formData, form);

    if (result.status === "success") {
      successModalRef.current?.showModal();
      formRef.current?.reset();
      onReset();
    }

    return result;
  }, INITIAL_ACTION_STATE);

  const handleCloseSuccessModal = (): void => {
    successModalRef.current?.close();
  };

  const handleOpenConditions = (): void => {
    conditionsModalRef.current?.showModal();
  };

  return (
    <>
      <form ref={formRef} className={styles.form} action={formAction}>
        <h6 className={styles.title}>Номер игрового счёта</h6>

        <input
          onInput={handleInputOnlyNumber}
          maxLength={ACCOUNT_MAX_LENGTH}
          name="accountNumber"
          placeholder="XXXXX"
          className={styles.input}
          type="text"
          autoComplete="off"
        />

        {actionState.status === "success" && (
          <p className={styles.success}>Прогноз успешно отправлен</p>
        )}

        <button className={styles.btnSubmit} type="submit" disabled={isPending}>
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
        className={styles.tournamentConditionsModal}
        ref={conditionsModalRef}
      >
        <TournamentConditions />
      </Modal>

      <Modal className={styles.successModal} noCross ref={successModalRef}>
        <SuccessModal onClose={handleCloseSuccessModal} />
      </Modal>
    </>
  );
};
