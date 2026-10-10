const SCORE_INPUT_LENGTH = 1;

/**
 * Приводит ввод к валидному счёту: одна цифра от 0 до числа побед в серии.
 * Поле полностью контролируемое, поэтому DOM напрямую не правим.
 */
export const normalizeScore = (value: string, maxWins: number): string => {
  const digits = value.replace(/\D/g, "").slice(0, SCORE_INPUT_LENGTH);

  if (digits === "") {
    return "";
  }

  return String(Math.min(Number(digits), maxWins));
};
