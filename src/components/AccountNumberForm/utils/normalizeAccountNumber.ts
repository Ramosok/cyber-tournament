export const ACCOUNT_NUMBER_MAX_LENGTH = 9;

export const normalizeAccountNumber = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, ACCOUNT_NUMBER_MAX_LENGTH);

  return digits.replace(/^0+/, "");
};
