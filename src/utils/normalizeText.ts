export const normalizeText = (
  value: string | null | undefined,
  fallback: string = "N/A"
): string => {
  if (typeof value !== "string") return fallback;

  const trimmed = value.trim();
  return trimmed === "" ? fallback : trimmed;
};