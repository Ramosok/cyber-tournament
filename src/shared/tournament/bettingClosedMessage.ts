import type { BettingStatus } from "@/shared/tournament/bettingStatus";

const MESSAGE_TOURNAMENT_FINISHED = "Прием прогнозов закрыт! Турнир окончен";
const MESSAGE_FINAL_IN_PROGRESS = "Прием прогнозов закрыт! Идёт финал турнира";

const NEXT_STEP_DATE_FORMAT = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  timeZone: "Europe/Minsk",
});

/** Сообщение, которое показывается вместо формы, пока этап идёт или турнир окончен. */
export const getBettingClosedMessage = (status: BettingStatus): string => {
  if (status.isFinished) {
    return MESSAGE_TOURNAMENT_FINISHED;
  }

  if (status.isFinalStep || status.nextStepStartsAt === null) {
    return MESSAGE_FINAL_IN_PROGRESS;
  }

  const opensAt = NEXT_STEP_DATE_FORMAT.format(status.nextStepStartsAt);

  return `Прием прогнозов на ${status.currentStep}-й этап закрыт! Следующий этап откроется ${opensAt}.`;
};
