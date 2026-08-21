export function qs(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}
