import { PREVIEW_STEP_EVENT } from "@/shared/hooks/useNow";

export const STEP_COUNT = 4;
export const FINAL_STEP = 4;

export type StepNumber = 1 | 2 | 3 | 4;

export const PREVIEW_STEP_STORAGE_KEY = "step";

const PREVIEW_STORAGE_KEYS = [
  PREVIEW_STEP_STORAGE_KEY,
  "previewStep",
  "PREVIEW_STEP",
  "VITE_PREVIEW_STEP",
] as const;

export const isStepNumber = (value: number): value is StepNumber =>
  Number.isInteger(value) && value >= 1 && value <= STEP_COUNT;

export type Tour = {
  readonly step: StepNumber;
  readonly opensAt: Date;
  readonly closesAt: Date;
  readonly endsAt: Date;
};

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

const TOURS_BY_STEP: ReadonlyMap<StepNumber, Tour> = new Map(
  TOURS.map((tour) => [tour.step, tour]),
);

export type BettingStatus = {
  readonly isBettingOpen: boolean;
  readonly isFinished: boolean;
  readonly currentStep: StepNumber;
  readonly isFinalStep: boolean;
  readonly endsAt: Date | null;
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

const findTour = (step: StepNumber): Tour | undefined =>
  TOURS_BY_STEP.get(step);

const findTourOpensAt = (step: StepNumber): Date | null =>
  findTour(step)?.opensAt ?? null;

const findTourClosesAt = (step: StepNumber): Date | null =>
  findTour(step)?.closesAt ?? null;

const findTourEndsAt = (step: StepNumber): Date | null =>
  findTour(step)?.endsAt ?? null;

const isTourClosedNow = (tour: Tour, now: Date): boolean =>
  tour.step === FINAL_STEP
    ? now >= tour.closesAt && now <= tour.endsAt
    : now >= tour.closesAt && now < tour.endsAt;

type PreviewMode =
  | { readonly kind: "off" }
  | { readonly kind: "step"; readonly step: StepNumber }
  | { readonly kind: "closed"; readonly step: StepNumber }
  | { readonly kind: "finished" };

const readStoragePreview = (): string | null => {
  try {
    if (typeof localStorage === "undefined") {
      return null;
    }

    for (const key of PREVIEW_STORAGE_KEYS) {
      const value = localStorage.getItem(key);

      if (value !== null && value.trim() !== "") {
        return value.trim();
      }
    }
  } catch {
    return null;
  }

  return null;
};

const parsePreviewValue = (raw: string | null | undefined): PreviewMode => {
  if (!raw || raw === "off" || raw === "auto") {
    return { kind: "off" };
  }

  if (raw === "done" || raw === "finished") {
    return { kind: "finished" };
  }

  if (raw.endsWith(":closed")) {
    const step = Number(raw.slice(0, -":closed".length));

    return isStepNumber(step) ? { kind: "closed", step } : { kind: "off" };
  }

  const step = Number(raw);

  return isStepNumber(step) ? { kind: "step", step } : { kind: "off" };
};

const getPreviewMode = (): PreviewMode => {
  const fromStorage = readStoragePreview();

  if (fromStorage !== null) {
    return parsePreviewValue(fromStorage);
  }

  return parsePreviewValue(import.meta.env.VITE_PREVIEW_STEP);
};

export const setPreviewStep = (
  value: StepNumber | `${StepNumber}:closed` | "done" | "auto" | null,
): void => {
  try {
    if (typeof localStorage === "undefined") {
      return;
    }

    if (value === null || value === "auto") {
      for (const key of PREVIEW_STORAGE_KEYS) {
        localStorage.removeItem(key);
      }
    } else {
      localStorage.setItem(PREVIEW_STEP_STORAGE_KEY, String(value));
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(PREVIEW_STEP_EVENT));
    }
  } catch {
    void 0;
  }
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

  if (preview.kind === "closed") {
    const nextStep = preview.step + 1;

    return createStatus({
      currentStep: preview.step,
      isBettingOpen: false,
      endsAt: findTourEndsAt(preview.step),
      nextStepStartsAt: isStepNumber(nextStep)
        ? findTourOpensAt(nextStep)
        : null,
    });
  }

  const closedTour = TOURS.find((tour) => isTourClosedNow(tour, now));

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

  if (openTour) {
    return createStatus({
      currentStep: openTour.step,
      isBettingOpen: true,
      endsAt: openTour.closesAt,
      nextStepStartsAt: null,
    });
  }

  return FINISHED_STATUS;
};
