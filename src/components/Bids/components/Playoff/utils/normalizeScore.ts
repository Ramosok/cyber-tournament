const SCORE_INPUT_LENGTH = 1;

export const normalizeScore = (value: string, maxWins: number): string => {
  const digits = value.replace(/\D/g, "").slice(0, SCORE_INPUT_LENGTH);

  if (digits === "") {
    return "";
  }

  return String(Math.min(Number(digits), maxWins));
};
