import { afterEach, describe, expect, it, vi } from "vitest";

import { getTimerTitle } from "@/components/Timer/utils/getTimerTitle";
import { getBettingClosedMessage } from "@/shared/tournament/bettingClosedMessage";
import { getBettingStatus } from "@/shared/tournament/bettingStatus";

describe("getBettingStatus", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("до старта турнира приём открыт, текущий шаг — первый", () => {
    const status = getBettingStatus(new Date("2026-10-09T12:00:00"));

    expect([
      status.currentStep,
      status.isBettingOpen,
      status.isFinished,
    ]).toEqual([1, true, false]);
    expect(status.isFinalStep).toBe(false);
  });

  it("пока этап идёт, приём закрыт и известна дата следующего этапа", () => {
    const status = getBettingStatus(new Date("2026-10-11T12:00:00"));

    expect(status.currentStep).toBe(2);
    expect(status.isBettingOpen).toBe(false);
    expect(getBettingClosedMessage(status)).toBe(
      "Прием прогнозов на 2-й этап закрыт! Следующий этап откроется 12 октября.",
    );
    expect(getTimerTitle(status)).toBe("До окончания этапа:");
  });

  it("на последнем этапе включается плей-офф", () => {
    const status = getBettingStatus(new Date("2026-10-13T12:00:00"));

    expect(status.isFinalStep).toBe(true);
    expect(status.isFinished).toBe(false);
    expect(getBettingClosedMessage(status)).toBe(
      "Прием прогнозов закрыт! Идёт финал турнира",
    );
  });

  it("после окончания турнира показывается заглушка", () => {
    const status = getBettingStatus(new Date("2026-10-14T12:00:00"));

    expect([status.isBettingOpen, status.isFinished]).toEqual([false, true]);
    expect(getBettingClosedMessage(status)).toBe(
      "Прием прогнозов закрыт! Турнир окончен",
    );
    expect(getTimerTitle(status)).toBe("Турнир завершён");
    expect(status.endsAt).toBeNull();
  });

  it("VITE_PREVIEW_STEP принудительно включает этап", () => {
    vi.stubEnv("VITE_PREVIEW_STEP", "1");

    const status = getBettingStatus(new Date("2026-12-01T12:00:00"));

    expect([
      status.currentStep,
      status.isBettingOpen,
      status.isFinalStep,
    ]).toEqual([1, true, false]);
  });

  it("VITE_PREVIEW_STEP=done показывает завершённый турнир", () => {
    vi.stubEnv("VITE_PREVIEW_STEP", "done");

    const status = getBettingStatus(new Date("2026-10-09T12:00:00"));

    expect([status.isBettingOpen, status.isFinished]).toEqual([false, true]);
  });

  it("открытый приём тикает до старта ближайшего этапа", () => {
    const status = getBettingStatus(new Date("2026-10-09T12:00:00"));

    expect(status.endsAt?.toISOString()).toBe(
      new Date("2026-10-10T00:00:00").toISOString(),
    );
    expect(getTimerTitle(status)).toBe("До окончания приёма прогнозов:");
  });
});
