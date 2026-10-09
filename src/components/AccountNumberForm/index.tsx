import { useActionState, useRef } from "react";

import type { FC } from "react";
import type {
  PlayOffTeams,
  PredictionActionState,
} from "@/components/AccountNumberForm/api/submitPredictionAction";
// import type { Team } from "@/shared/config";
import type { ModalHandle } from "@/shared/ui/Modal/Modal";

import { submitPrediction } from "@/components/AccountNumberForm/api/submitPredictionAction";
import { SuccessModal } from "@/components/AccountNumberForm/components/SuccessModal";
import { TournamentConditions } from "@/components/AccountNumberForm/components/TournamentConditions";
import { handleInputOnlyNumber } from "@/components/AccountNumberForm/utils/handleInputOnlyNumber";
import { Modal } from "@/shared/ui/Modal/Modal";

import styles from "./accountNumberForm.module.css";

type AccountNumberFormProps = {
  teamList: PlayOffTeams[];
  onReset: () => void;
};

const initialState: PredictionActionState = { status: "idle" };

export const AccountNumberForm: FC<AccountNumberFormProps> = ({
  teamList,
  onReset,
}) => {
  const modalRef = useRef<ModalHandle>(null);
  const tournamentConditionsRef = useRef<ModalHandle>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    async (prevState: PredictionActionState, formData: FormData) => {
      const result = await submitPrediction(prevState, formData, teamList);

      if (result.status === "success" && modalRef.current) {
        modalRef.current.showModal();
        onReset();
        if (formRef.current) {
          formRef.current.reset();
        }
      }

      return result;
    },
    initialState,
  );

  const handleCloseModal = (): void => {
    if (modalRef.current) {
      modalRef.current.close();
    }
  };

  const handleOpenTournamentConditions = (): void => {
    if (tournamentConditionsRef.current) {
      tournamentConditionsRef.current.showModal();
    }
  };

  return (
    <>
      <form ref={formRef} className={styles.form} action={formAction}>
        <h6 className={styles.title}>Номер игрового счёта</h6>

        <input
          onInput={handleInputOnlyNumber}
          maxLength={9}
          name="accountNumber"
          placeholder="XXXXX"
          className={styles.input}
          type="text"
          autoComplete="off"
        />

        {state.status === "success" && (
          <p className={styles.success}>Прогноз успешно отправлен</p>
        )}

        <button className={styles.btnSubmit} type="submit" disabled={isPending}>
          {isPending ? "ОТПРАВКА..." : "ОСТАВИТЬ ПРОГНОЗ"}
        </button>

        {state.status === "error" && state.error && (
          <p className={styles.error}>{state.error}</p>
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
          onClick={handleOpenTournamentConditions}
        >
          Условия турнира
        </button>
      </form>
      <Modal
        className={styles.tournamentConditionsModal}
        ref={tournamentConditionsRef}
      >
        <TournamentConditions />
      </Modal>
      <Modal className={styles.successModal} noCross ref={modalRef}>
        <SuccessModal onClose={handleCloseModal} />
      </Modal>
    </>
  );
};
