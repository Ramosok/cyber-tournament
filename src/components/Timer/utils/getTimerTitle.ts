import type { BettingStatus } from "@/shared/tournament/bettingStatus";

export const getTimerTitle = (status: BettingStatus): string => {
  if (status.isFinished) {
    return "Турнир завершён";
  }

  return status.isBettingOpen
    ? "До окончания приёма прогнозов:"
    : "До окончания этапа:";
};
