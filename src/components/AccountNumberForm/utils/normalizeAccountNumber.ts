export const ACCOUNT_NUMBER_MAX_LENGTH = 9;

/**
 * Номер игрового счёта — только цифры, без ведущих нулей.
 * Поле контролируемое, поэтому возвращаем строку, а не правим DOM напрямую.
 */
export const normalizeAccountNumber = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, ACCOUNT_NUMBER_MAX_LENGTH);

  return digits.replace(/^0+/, "");
};
