import { afterEach, describe, expect, it, vi } from "vitest";

import { getTimerTitle } from "@/components/Timer/utils/getTimerTitle";
import { getBettingClosedMessage } from "@/shared/tournament/bettingClosedMessage";
import { getBettingStatus } from "@/shared/tournament/bettingStatus";

describe("getBettingStatus", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("до закрытия Stage 1 приём открыт, текущий шаг — первый", () => {
    const status = getBettingStatus(new Date("2026-11-21T12:00:00+03:00"));

    expect([
      status.currentStep,
      status.isBettingOpen,
      status.isFinished,
    ]).toEqual([1, true, false]);
    expect(status.isFinalStep).toBe(false);
    expect(status.endsAt?.toISOString()).toBe(
      new Date("2026-11-24T08:55:00+03:00").toISOString(),
    );
  });

  it("между закрытием Stage 1 (08:55) и открытием Stage 2 (18:00) приём закрыт", () => {
    const status = getBettingStatus(new Date("2026-11-24T12:00:00+03:00"));

    expect(status.currentStep).toBe(1);
    expect(status.isBettingOpen).toBe(false);
    expect(getBettingClosedMessage(status)).toBe(
      "Прием прогнозов на 1-й этап закрыт! Следующий этап откроется 24 ноября.",
    );
    expect(getTimerTitle(status)).toBe("До окончания этапа:");
  });

  it("в окно Stage 2 (24.11 18:00 — 28.11 08:55) приём открыт на 2-й этап", () => {
    const status = getBettingStatus(new Date("2026-11-25T15:00:00+03:00"));

    expect([status.currentStep, status.isBettingOpen]).toEqual([2, true]);
    expect(status.endsAt?.toISOString()).toBe(
      new Date("2026-11-28T08:55:00+03:00").toISOString(),
    );
  });

  it("после закрытия Stage 3 (02.12 08:55) ждёт открытия плей-офф 7 декабря", () => {
    const status = getBettingStatus(new Date("2026-12-04T12:00:00+03:00"));

    expect(status.currentStep).toBe(3);
    expect(status.isBettingOpen).toBe(false);
    expect(getBettingClosedMessage(status)).toBe(
      "Прием прогнозов на 3-й этап закрыт! Следующий этап откроется 7 декабря.",
    );
  });

  it("в окно Playoffs (07.12 10:00 — 10.12 11:55) открыт приём на финал", () => {
    const status = getBettingStatus(new Date("2026-12-08T12:00:00+03:00"));

    expect([
      status.currentStep,
      status.isBettingOpen,
      status.isFinalStep,
    ]).toEqual([4, true, true]);
    expect(status.endsAt?.toISOString()).toBe(
      new Date("2026-12-10T11:55:00+03:00").toISOString(),
    );
  });

  it("во время матчей плей-офф (10.12 11:55 — 13.12 23:59:59) приём закрыт", () => {
    const status = getBettingStatus(new Date("2026-12-12T12:00:00+03:00"));

    expect(status.isFinalStep).toBe(true);
    expect(status.isBettingOpen).toBe(false);
    expect(status.isFinished).toBe(false);
    expect(getBettingClosedMessage(status)).toBe(
      "Прием прогнозов закрыт! Идёт финал турнира",
    );
  });

  it("после окончания турнира (после 13.12) показывается заглушка", () => {
    const status = getBettingStatus(new Date("2026-12-14T12:00:00+03:00"));

    expect([status.isBettingOpen, status.isFinished]).toEqual([false, true]);
    expect(getBettingClosedMessage(status)).toBe(
      "Прием прогнозов закрыт! Турнир окончен",
    );
    expect(getTimerTitle(status)).toBe("Турнир завершён");
    expect(status.endsAt).toBeNull();
  });

  it("VITE_PREVIEW_STEP принудительно включает этап", () => {
    vi.stubEnv("VITE_PREVIEW_STEP", "1");

    const status = getBettingStatus(new Date("2026-12-12T12:00:00+03:00"));

    expect([
      status.currentStep,
      status.isBettingOpen,
      status.isFinalStep,
    ]).toEqual([1, true, false]);
  });

  it("VITE_PREVIEW_STEP=done показывает завершённый турнир", () => {
    vi.stubEnv("VITE_PREVIEW_STEP", "done");

    const status = getBettingStatus(new Date("2026-11-21T12:00:00+03:00"));

    expect([status.isBettingOpen, status.isFinished]).toEqual([false, true]);
  });

  it("открытый приём тикает до закрытия окна прогнозов этапа", () => {
    const status = getBettingStatus(new Date("2026-11-21T12:00:00+03:00"));

    expect(status.endsAt?.toISOString()).toBe(
      new Date("2026-11-24T08:55:00+03:00").toISOString(),
    );
    expect(getTimerTitle(status)).toBe("До окончания приёма прогнозов:");
  });
});
