import type { BettingStatus } from "@/shared/tournament/bettingStatus";

/**
 * Таймер тикает до разных моментов: пока приём открыт — до старта этапа,
 * пока этап идёт — до его окончания. После турнира считать нечего.
 */
export const getTimerTitle = (status: BettingStatus): string => {
  if (status.isFinished) {
    return "Турнир завершён";
  }

  return status.isBettingOpen
    ? "До окончания приёма прогнозов:"
    : "До окончания этапа:";
};
