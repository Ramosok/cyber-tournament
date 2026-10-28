const PAD_LENGTH = 2;

const padTwoDigits = (value: number): string =>
  String(value).padStart(PAD_LENGTH, "0");

export const getDateAndTime = (date: Date = new Date()): string => {
  const day = padTwoDigits(date.getDate());
  const month = padTwoDigits(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = padTwoDigits(date.getHours());
  const minutes = padTwoDigits(date.getMinutes());

  return `${day}.${month}.${year} (${hours}:${minutes})`;
};
