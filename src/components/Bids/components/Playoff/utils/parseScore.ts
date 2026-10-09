export const parseScore = (value: string, bo: number): number | null => {
  const MAX_WINS = Math.ceil(bo / 2);
  const trimmed = value.trim();
  if (trimmed === "") return null;

  const n = Number(trimmed);

  if (!Number.isFinite(n) || !Number.isInteger(n)) return null;
  if (n < 0 || n > MAX_WINS) return null;

  return n;
};
