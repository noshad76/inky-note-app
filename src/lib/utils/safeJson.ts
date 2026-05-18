export function safeJsonParse(value: string | null | undefined) {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
