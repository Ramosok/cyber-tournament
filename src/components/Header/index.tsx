import type { FC } from "react";

import { Picture } from "@/components/Picture";
import goose360 from "@/shared/assets/goose360.webp";
import goose1920 from "@/shared/assets/goose1920.webp";
import { Icon } from "@/shared/ui/icon";

import styles from "./header.module.css";

export const Header: FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.banner}>
          <Icon className={styles.logo} width="260" height="61" icon="ML" />

          <div className={styles.prizeCard}>
            <h1 className={styles.title}>ПРИЗОВОЙ ФОНД</h1>

            <svg
              className={styles.prizeAmount}
              viewBox="0 0 742 160"
              role="img"
              aria-label="30 000 BYN"
            >
              <title>30 000 BYN</title>
              <defs>
                <path
                  id="header-prize-zero"
                  fillRule="evenodd"
                  d="M64 6 C106 6 128 33 128 80 C128 127 106 154 64 154 C22 154 0 127 0 80 C0 33 22 6 64 6 Z M64 44 C47 44 40 57 40 80 C40 103 47 116 64 116 C81 116 88 103 88 80 C88 57 81 44 64 44 Z"
                />
              </defs>
              <path
                fill="currentColor"
                d="M8 10 H118 V42 L78 68 C104 72 122 89 122 114 C122 140 99 154 62 154 C27 154 4 140 0 115 L38 107 C40 116 49 121 61 121 C74 121 82 115 82 106 C82 96 74 91 55 91 H42 V64 L75 42 H8 V10 Z"
              />
              <use
                href="#header-prize-zero"
                x="134"
                y="0"
                fill="currentColor"
              />
              <use
                href="#header-prize-zero"
                x="304"
                y="0"
                fill="currentColor"
              />
              <use
                href="#header-prize-zero"
                x="444"
                y="0"
                fill="currentColor"
              />
              <path
                fill="currentColor"
                d="M648 6 C686 6 708 27 711 56 H669 C666 47 659 44 648 44 C631 44 624 57 624 80 C624 103 631 116 648 116 C659 116 666 113 669 104 H711 C708 133 686 154 648 154 C606 154 584 127 584 80 C584 33 606 6 648 6 Z"
              />
              <g fill="currentColor" transform="translate(644, 65)">
                <path
                  fillRule="evenodd"
                  d="M0 0 H18 C25 0 29 3 29 8 C29 11 27 13 24 14 C28 15 30 18 30 22 C30 27 25 30 18 30 H0 V0 Z M8 6 V12 H16 C19 12 20 11 20 9 C20 7 19 6 16 6 H8 Z M8 17 V24 H17 C20 24 21 23 21 20.5 C21 18 20 17 17 17 H8 Z"
                />
                <path d="M32 0 H41 L47 11 L53 0 H62 L51 19 V30 H43 V19 L32 0 Z" />
                <path d="M65 0 H73 L85 17 V0 H93 V30 H85 L73 13 V30 H65 V0 Z" />
              </g>
            </svg>
          </div>

          <div className={styles.subtitlePill}>
            <p className={styles.description}>
              <span>ЗА ВЕРНЫЙ ПРОГНОЗ</span>
              <span>НА PGL CS2 MAJOR SINGAPORE 2026</span>
            </p>
          </div>
        </div>

        <div className={styles.gooseWrapper}>
          <Picture
            className={styles.goose}
            src={goose1920}
            alt="Гусь"
            loading="eager"
            fetchPriority="high"
            sources={[
              {
                srcSet: goose360,
                type: "image/webp",
                media: "(max-width: 767px)",
              },
            ]}
          />
          <img
            className={styles.gooseArmOverlay}
            src={goose1920}
            alt=""
            decoding="async"
            aria-hidden="true"
          />
        </div>
      </div>
    </header>
  );
};
