export const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
export const MILLISECONDS_PER_MINUTE =
  MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const INITIAL_VALUE = 0;

const MILLISECONDS_PER_HOUR = MILLISECONDS_PER_MINUTE * MINUTES_PER_HOUR;
const MILLISECONDS_PER_DAY = MILLISECONDS_PER_HOUR * HOURS_PER_DAY;

export type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const createZeroTimeLeft = (): TimeLeft => ({
  days: INITIAL_VALUE,
  hours: INITIAL_VALUE,
  minutes: INITIAL_VALUE,
  seconds: INITIAL_VALUE,
});

export const calculateTimeLeft = (
  endDate: Date | null,
  now: Date = new Date(),
): TimeLeft => {
  if (!endDate) {
    return createZeroTimeLeft();
  }

  const difference = endDate.getTime() - now.getTime();

  if (difference <= INITIAL_VALUE) {
    return createZeroTimeLeft();
  }

  return {
    days: Math.floor(difference / MILLISECONDS_PER_DAY),
    hours: Math.floor((difference / MILLISECONDS_PER_HOUR) % HOURS_PER_DAY),
    minutes: Math.floor(
      (difference / MILLISECONDS_PER_MINUTE) % SECONDS_PER_MINUTE,
    ),
    seconds: Math.floor(
      (difference / MILLISECONDS_PER_SECOND) % SECONDS_PER_MINUTE,
    ),
  };
};
