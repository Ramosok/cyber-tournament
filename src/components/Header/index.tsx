import type { FC } from "react";

import { Picture } from "@/components/Picture";
import { Icon } from "@/shared/ui/icon";

import bonus360 from "../../shared/assets/bonus360.png";
import bonus1920 from "../../shared/assets/bonus1920.png";
import goose360 from "../../shared/assets/goose360.webp";
import goose1920 from "../../shared/assets/goose1920.webp";

import styles from "./header.module.css";

export const Header: FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.banner}>
        <Icon className={styles.logo} width="192" height="45" icon="ML" />
        <h1 className={styles.title}>УЧАСТВУЙ В РОЗЫГРЫШЕ</h1>
        <Picture
          key="выйграй 20_000 рублей"
          className={styles.bonus}
          src={bonus1920}
          alt="выйграй 20_000 рублей"
          sources={[
            {
              srcSet: bonus360,
              media: "(max-width: 568px)",
              type: "image/webp",
            },
            {
              srcSet: bonus1920,
              type: "image/webp",
            },
          ]}
          loading="eager"
        />
        <p className={styles.description}>
          <span>ЗА ВЕРНЫЙ ПРОГНОЗ</span> на StarLadder Budapest Major 2025
        </p>
      </div>
      <Picture
        key="гусь в маске с ножом"
        className={styles.goose}
        src={goose1920}
        alt="гусь в маске с ножом"
        sources={[
          {
            srcSet: goose360,
            media: "(max-width: 568px)",
            type: "image/webp",
          },
          {
            srcSet: goose1920,
            type: "image/webp",
          },
        ]}
        loading="eager"
      />
    </header>
  );
};
