export const STEP_COUNT = 4;

/** Последний этап — плей-офф. На нём вместо общей сетки показывается Playoff. */
export const FINAL_STEP = 4;

export type StepNumber = 1 | 2 | 3 | 4;

export const isStepNumber = (value: number): value is StepNumber =>
  Number.isInteger(value) && value >= 1 && value <= STEP_COUNT;

export type Tour = {
  readonly step: StepNumber;
  /** Когда открывается приём прогнозов (Минск, UTC+3). */
  readonly opensAt: Date;
  /** Когда закрывается приём прогнозов — за ~5 минут до старта этапа (Минск, UTC+3). */
  readonly closesAt: Date;
  /** До какого момента закрыт приём: открытие следующего этапа либо конец турнира. */
  readonly endsAt: Date;
};

/**
 * График этапов по минскому времени (UTC+3):
 * - Stage 1 (24–27 ноября): приём 20.11 18:00 — 24.11 08:55
 * - Stage 2 (28 ноября – 1 декабря): приём 24.11 18:00 — 28.11 08:55
 * - Stage 3 (2–6 декабря): приём 28.11 18:00 — 02.12 08:55
 * - Playoffs (10–13 декабря): приём 07.12 10:00 — 10.12 11:55, финал до 13.12 23:59:59
 */
export const TOURS: readonly Tour[] = [
  {
    step: 1,
    opensAt: new Date("2026-11-20T18:00:00+03:00"),
    closesAt: new Date("2026-11-24T08:55:00+03:00"),
    endsAt: new Date("2026-11-24T18:00:00+03:00"),
  },
  {
    step: 2,
    opensAt: new Date("2026-11-24T18:00:00+03:00"),
    closesAt: new Date("2026-11-28T08:55:00+03:00"),
    endsAt: new Date("2026-11-28T18:00:00+03:00"),
  },
  {
    step: 3,
    opensAt: new Date("2026-11-28T18:00:00+03:00"),
    closesAt: new Date("2026-12-02T08:55:00+03:00"),
    endsAt: new Date("2026-12-07T10:00:00+03:00"),
  },
  {
    step: FINAL_STEP,
    opensAt: new Date("2026-12-07T10:00:00+03:00"),
    closesAt: new Date("2026-12-10T11:55:00+03:00"),
    endsAt: new Date("2026-12-13T23:59:59+03:00"),
  },
];

export type BettingStatus = {
  /** Прогнозы принимаются: открыто окно текущего этапа и турнир не завершён. */
  readonly isBettingOpen: boolean;
  /** Все этапы позади — показываем заглушку «турнир окончен». */
  readonly isFinished: boolean;
  /** Этап, который идёт сейчас или ближайший. */
  readonly currentStep: StepNumber;
  /** Текущий этап — плей-офф. */
  readonly isFinalStep: boolean;
  /** До какого момента тикает таймер. */
  readonly endsAt: Date | null;
  /** Когда откроется следующий этап (если он есть). */
  readonly nextStepStartsAt: Date | null;
};

type BettingStatusParams = {
  readonly currentStep: StepNumber;
  readonly isBettingOpen: boolean;
  readonly endsAt: Date | null;
  readonly nextStepStartsAt: Date | null;
  readonly isFinished?: boolean;
};

const createStatus = ({
  currentStep,
  isBettingOpen,
  endsAt,
  nextStepStartsAt,
  isFinished = false,
}: BettingStatusParams): BettingStatus => ({
  isBettingOpen,
  isFinished,
  currentStep,
  isFinalStep: currentStep === FINAL_STEP,
  endsAt,
  nextStepStartsAt,
});

const findTourOpensAt = (step: StepNumber): Date | null =>
  TOURS.find((tour) => tour.step === step)?.opensAt ?? null;

const findTourClosesAt = (step: StepNumber): Date | null =>
  TOURS.find((tour) => tour.step === step)?.closesAt ?? null;

const isTourClosedNow = (tour: Tour, now: Date): boolean =>
  tour.step === FINAL_STEP
    ? now >= tour.closesAt && now <= tour.endsAt
    : now >= tour.closesAt && now < tour.endsAt;

type PreviewMode =
  | { readonly kind: "off" }
  | { readonly kind: "step"; readonly step: StepNumber }
  | { readonly kind: "finished" };

/**
 * Отладка: `VITE_PREVIEW_STEP=1…4` включает этап, `VITE_PREVIEW_STEP=done` —
 * заглушку завершённого турнира. Так сетку и плей-офф можно посмотреть,
 * не переписывая даты.
 */
const getPreviewMode = (): PreviewMode => {
  const raw = import.meta.env.VITE_PREVIEW_STEP;

  if (!raw) {
    return { kind: "off" };
  }

  if (raw === "done") {
    return { kind: "finished" };
  }

  const step = Number(raw);

  return isStepNumber(step) ? { kind: "step", step } : { kind: "off" };
};

const FINISHED_STATUS: BettingStatus = createStatus({
  currentStep: FINAL_STEP,
  isBettingOpen: false,
  isFinished: true,
  endsAt: null,
  nextStepStartsAt: null,
});

export const getBettingStatus = (now: Date = new Date()): BettingStatus => {
  const preview = getPreviewMode();

  if (preview.kind === "finished") {
    return FINISHED_STATUS;
  }

  if (preview.kind === "step") {
    return createStatus({
      currentStep: preview.step,
      isBettingOpen: true,
      endsAt: findTourClosesAt(preview.step),
      nextStepStartsAt: null,
    });
  }

  const closedTour = TOURS.find((tour) => isTourClosedNow(tour, now));

  // Приём на этап закрыт — ждём открытия следующего этапа или окончания финала.
  if (closedTour) {
    const nextStep = closedTour.step + 1;

    return createStatus({
      currentStep: closedTour.step,
      isBettingOpen: false,
      endsAt: closedTour.endsAt,
      nextStepStartsAt: isStepNumber(nextStep)
        ? findTourOpensAt(nextStep)
        : null,
    });
  }

  const openTour = TOURS.find((tour) => now < tour.closesAt);

  // Окно приёма прогнозов открыто — таймер тикает до закрытия приёма на этап.
  if (openTour) {
    return createStatus({
      currentStep: openTour.step,
      isBettingOpen: true,
      endsAt: openTour.closesAt,
      nextStepStartsAt: null,
    });
  }

  // Все этапы позади.
  return FINISHED_STATUS;
};
