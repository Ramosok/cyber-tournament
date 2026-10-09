export const STEP_COUNT = 4;

/** Последний этап — плей-офф. На нём вместо общей сетки показывается Playoff. */
export const FINAL_STEP = 4;

export type StepNumber = 1 | 2 | 3 | 4;

export const isStepNumber = (value: number): value is StepNumber =>
  Number.isInteger(value) && value >= 1 && value <= STEP_COUNT;

type Tour = {
  readonly step: StepNumber;
  readonly start: Date;
  readonly end: Date;
};

/**
 * Расписание: турнир стартует 10.10.2026, каждый этап идёт сутки,
 * плей-офф — четвёртые сутки. После окончания последнего этапа турнир завершён.
 */
const TOURS: readonly Tour[] = [
  {
    step: 1,
    start: new Date("2026-10-10T00:00:00"),
    end: new Date("2026-10-10T23:59:59"),
  },
  {
    step: 2,
    start: new Date("2026-10-11T00:00:00"),
    end: new Date("2026-10-11T23:59:59"),
  },
  {
    step: 3,
    start: new Date("2026-10-12T00:00:00"),
    end: new Date("2026-10-12T23:59:59"),
  },
  {
    step: FINAL_STEP,
    start: new Date("2026-10-13T00:00:00"),
    end: new Date("2026-10-13T23:59:59"),
  },
];

export type BettingStatus = {
  /** Прогнозы принимаются: не идёт ни один этап и турнир не завершён. */
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

const findTourStart = (step: StepNumber): Date | null =>
  TOURS.find((tour) => tour.step === step)?.start ?? null;

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
      endsAt: null,
      nextStepStartsAt: null,
    });
  }

  const activeTour = TOURS.find((tour) => now >= tour.start && now <= tour.end);

  // Этап идёт — прогнозы не принимаем, таймер до его окончания.
  if (activeTour) {
    const nextStep = activeTour.step + 1;

    return createStatus({
      currentStep: activeTour.step,
      isBettingOpen: false,
      endsAt: activeTour.end,
      nextStepStartsAt: isStepNumber(nextStep) ? findTourStart(nextStep) : null,
    });
  }

  const upcomingTour = TOURS.find((tour) => now < tour.start);

  // Этап ещё не начался — приём открыт, таймер идёт до его старта.
  if (upcomingTour) {
    return createStatus({
      currentStep: upcomingTour.step,
      isBettingOpen: true,
      endsAt: upcomingTour.start,
      nextStepStartsAt: null,
    });
  }

  // Все этапы позади.
  return FINISHED_STATUS;
};
