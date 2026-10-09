export const isValidCsScore = (a: number, b: number, bo: number): boolean => {
  const MAX_WINS = Math.ceil(bo / 2);

  if (a === b) return false;
  if (a === MAX_WINS && b < MAX_WINS) return true;
  if (b === MAX_WINS && a < MAX_WINS) return true;
  return false;
};
