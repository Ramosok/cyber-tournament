export type TourNumber = 1 | 2 | 3 | 4;

type Tour = {
  readonly number: TourNumber;
  readonly start: Date;
  readonly end: Date;
};

const TOURS: readonly Tour[] = [
  {
    number: 1,
    start: new Date("2025-11-18T18:00:00"),
    end: new Date("2025-11-24T12:00:00"),
  },
  {
    number: 2,
    start: new Date("2025-11-28T08:00:00"),
    end: new Date("2025-11-29T13:00:00"),
  },
  {
    number: 3,
    start: new Date("2025-12-03T10:00:00"),
    end: new Date("2025-12-07T13:00:00"),
  },
  {
    number: 4,
    start: new Date("2025-12-08T03:00:00"),
    end: new Date("2025-12-11T17:00:00"),
  },
];

export type BettingStatus =
  | { hasActiveStage: false; currentTour: 1 }
  | {
      hasActiveStage: true;
      tourNumber: TourNumber;
      endDate: Date;
      currentTour: number;
    };

export const getCurrentBettingEndDate = (
  now: Date = new Date(),
): BettingStatus => {
  const activeTour = TOURS.find((tour) => now >= tour.start && now <= tour.end);

  if (!activeTour) {
    return { hasActiveStage: false, currentTour: 1 };
  }

  return {
    hasActiveStage: true,
    tourNumber: activeTour.number,
    endDate: activeTour.end,
    currentTour: activeTour.number,
  };
};
