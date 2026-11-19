import type { FC } from "react";

import styles from "./tournamentConditions.module.css";

type Prize = {
  readonly place: string;
  readonly amount: string;
};

export type TournamentConditionsProps = {
  readonly spreadsheetUrl: string;
};

const TOUR_PRIZES: readonly Prize[] = [
  { place: "1 место", amount: "600 BYN" },
  { place: "2 место", amount: "300 BYN" },
  { place: "3 место", amount: "200 BYN" },
  { place: "4–6 места", amount: "120 BYN" },
  { place: "7–10 места", amount: "90 BYN" },
  { place: "11–15 места", amount: "60 BYN" },
  { place: "16–20 места", amount: "40 BYN" },
  { place: "21–30 места", amount: "30 BYN" },
  { place: "31–49 места", amount: "20 BYN" },
];

const TOTAL_PRIZES: readonly Prize[] = [
  { place: "1 место", amount: "2 000 BYN" },
  { place: "2 место", amount: "1 000 BYN" },
  { place: "3 место", amount: "500 BYN" },
  { place: "4–6 места", amount: "300 BYN" },
  { place: "7–10 места", amount: "150 BYN" },
  { place: "11–15 места", amount: "110 BYN" },
  { place: "16–20 места", amount: "90 BYN" },
  { place: "21–30 места", amount: "60 BYN" },
  { place: "31–50 места", amount: "40 BYN" },
  { place: "51–70 места", amount: "30 BYN" },
];

type PrizeListProps = {
  readonly prizes: readonly Prize[];
};

const PrizeList: FC<PrizeListProps> = ({ prizes }) => (
  <ul className={styles.prizeList}>
    {prizes.map(({ place, amount }) => (
      <li key={place} className={styles.prizeItem}>
        <span>{place}</span>
        <strong>{amount}</strong>
      </li>
    ))}
  </ul>
);

export const TournamentConditions: FC<TournamentConditionsProps> = ({
  spreadsheetUrl,
}) => {
  return (
    <article className={styles.container}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>PGL Major Singapore 2026</p>
        <h2>Условия турнира прогнозистов</h2>
      </header>

      <div className={styles.content}>
        <section className={styles.section}>
          <h3>Турнир прогнозистов пройдет в 4 тура:</h3>
          <ol className={styles.tourList}>
            <li>
              <strong>1 тур — прогнозы на Этап 1:</strong> с 18:00 20.11.26 до
              06:55 24.11.26.
            </li>
            <li>
              <strong>2 тур — прогнозы на Этап 2:</strong> с 18:00 24.11.26 до
              06:55 28.11.26.
            </li>
            <li>
              <strong>3 тур — прогнозы на Этап 3:</strong> с 18:00 28.11.26 до
              06:55 02.12.26.
            </li>
            <li>
              <strong>4 тур — прогнозы на плей-офф:</strong> с 10:00 07.12.26 до
              11:55 10.12.26.
            </li>
          </ol>
          <p className={styles.prizeFund}>
            Максимальный призовой фонд турнира составляет <b>30 000 BYN.</b>
          </p>
        </section>

        <section className={styles.section}>
          <h3>Для участия в турнире необходимо в каждом из 4-х туров:</h3>
          <ol className={styles.numberedList}>
            <li>
              Сделать одиночную прематч-ставку от 20 BYN с коэффициентом от 1,6
              по линии на матчи соответствующего этапа PGL Major Singapore 2026.
            </li>
            <li>
              Оставить прогноз ЗДЕСЬ в установленный период действия тура.
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h3>Начисление баллов</h3>
          <div className={styles.scoreGrid}>
            <div className={styles.scoreCard}>
              <h4>Этапы 1, 2, 3</h4>
              <p>
                За каждую команду, у которой верно угадан итоговый результат
                этапа (3-0, 3-1, 3-2, 2-3, 1-3 или 0-3), — <b>1 балл.</b>
              </p>
            </div>
            <div className={styles.scoreCard}>
              <h4>Плей-офф</h4>
              <p>
                За верно угаданного победителя каждого матча — <b>1 балл.</b>
              </p>
            </div>
          </div>
          <p>
            За верно угаданный <b>точный счет по картам</b> в четвертьфиналах,
            полуфиналах и матче за 3-е место — дополнительно <b>1 балл.</b>
          </p>
          <p>
            За верно угаданный <b>точный счет по картам в финале</b> —
            дополнительно <b>3 балла.</b>
          </p>
          <p className={styles.totalScore}>
            Максимально можно набрать 66 баллов.
          </p>
        </section>

        <section className={styles.section}>
          <h3>
            Участники, набравшие наибольшее количество баллов по итогам каждого
            тура, получают фрибеты:
          </h3>
          <PrizeList prizes={TOUR_PRIZES} />
          <p className={styles.note}>
            *Для получения призового фрибета необходимо сделать ставку от 20 BYN
            с коэффициентом от 1,6 на матчи соответствующего этапа PGL Major
            Singapore 2026 в соответствующем туре.
          </p>
        </section>

        <section className={styles.section}>
          <h3>
            Участники, набравшие наибольшее количество баллов за весь турнир,
            получают фрибеты:
          </h3>
          <PrizeList prizes={TOTAL_PRIZES} />
          <p className={styles.note}>
            *Для получения призового фрибета необходимо сделать по одной ставке
            от 20 BYN с коэффициентом от 1,6 в каждом из 4 туров.
          </p>
        </section>

        <section className={`${styles.section} ${styles.superPrize}`}>
          <h3>Дополнительный фрибет 10 000 BYN</h3>
          <p>
            Участник, верно предсказавший результаты всех команд в Этапах 1, 2 и
            3 и точные счета по картам всех матчей плей-офф, включая матч за 3-е
            место, и набравший 66 баллов, дополнительно выигрывает фрибет
            <b> 10 000 BYN.</b>
          </p>
          <p className={styles.note}>
            *Если 66 баллов наберут несколько участников, фрибет 10 000 BYN
            будет разделен между ними в равных долях.
          </p>
        </section>

        <section className={styles.viewPredictions}>
          <p>Оставленные прогнозы можно посмотреть</p>
          <a
            href={spreadsheetUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Открыть таблицу с прогнозами"
          >
            ЗДЕСЬ
          </a>
        </section>

        <p className={styles.motto}>Платим мы — играешь ты!</p>

        <section className={`${styles.section} ${styles.legal}`}>
          <p>
            *Один участник может оставить один прогноз в рамках каждого тура.
            Если от одного участника будет оставлено несколько прогнозов, то во
            внимание будет приниматься прогноз, который был зафиксирован первым.
          </p>
          <p>
            *Одно призовое место может занять только один участник. Участник,
            подавший заявку на участие в турнире раньше других, получит
            преимущество при распределении мест в случае равного количества
            баллов.
          </p>
          <p>
            *Если по каким-либо причинам будет приостановлен чемпионат, то итоги
            турнира будут подведены после его возобновления.
          </p>
          <p>
            *Ставки, сделанные на бонусные денежные средства или фрибеты;
            ставки, по которым были получены бонусы «Maxline платит»; Cash Out;
            ставки, по которым был зачислен фрибет; сделанные ставки в ППС не
            учитываются.
          </p>
          <p>
            *Ставка и пополнение, сделанные для участия в данной акции, не могут
            принимать участие в других бонусных предложениях Maxline.
          </p>
          <p>
            *Объявление результатов будет опубликовано до <b>16.12.2026</b>{" "}
            (включительно) на сайте{" "}
            <a href="https://maxline.by" target="_blank" rel="noreferrer">
              maxline.by
            </a>
            . Зачисление фрибета происходит в течение 48 часов после
          </p>
          <p>
            *Полученный фрибет может быть задействован только при положительном
            балансе на игровом счету в ставках (одна или несколько ставок на
            разные события):
          </p>
          <ol className={styles.legalList}>
            <li>Одинар с коэффициентом от 1,5 до 3;</li>
            <li>
              Экспресс, в котором коэффициент каждого события не менее 1.5, а
              общий коэффициент не превышает 3.
            </li>
          </ol>
          <p>
            *- VIP-ставки; ставки на TV-игры; ставки на азиатский тотал,
            азиатскую фору и индивидуальный азиатский тотал; финансовые ставки,
            ставки типа «Система» и Cash Out не могут быть сделаны на фрибеты.
          </p>
          <p>
            *- Ставки, сделанные на фрибеты повторно на одно событие в линии
            и/или Live, будут рассчитаны на возврат.
          </p>
          <p>
            *- После расчета ставки фрибет на игровой счет зачисляется сумма
            выигрыша по ставке за вычетом суммы ставки. Если ставка рассчитана с
            коэффициентом 1 — выплата по «Фрибет» равна нулю.
          </p>
          <p>
            *Букмекер оставляет за собой право приостановить действие
            предложения или изменить условия по нему.
          </p>
        </section>
      </div>
    </article>
  );
};
