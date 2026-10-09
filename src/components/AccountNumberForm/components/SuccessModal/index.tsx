import type { FC } from "react";

import { Icon } from "@/shared/ui/icon";

import styles from "./success.module.css";

type SuccessModalProps = {
  onClose: () => void;
};

export const SuccessModal: FC<SuccessModalProps> = ({ onClose }) => {
  return (
    <div className={styles.container}>
      <Icon width="64" height="64" icon="success" />
      <p className={styles.title}>Ваш прогноз принят!</p>
      <span className={styles.subTitle}>Ожидайте результаты турнира</span>
      <button onClick={onClose} className={styles.btn}>
        OK
      </button>
    </div>
  );
};
