import { Discipline, FormatEntretien, Langue, Niveau, StatutColloque } from "@prisma/client";

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function cleanString(value: unknown, max = 10_000): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.trim();
  return cleaned && cleaned.length <= max ? cleaned : null;
}

export function optionalString(value: unknown, max = 10_000): string | null {
  if (value == null || value === "") return null;
  return cleanString(value, max);
}

export function isEmail(value: unknown): value is string {
  return typeof value === "string" && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function enumValue<T extends Record<string, string>>(
  enumObject: T,
  value: unknown,
): T[keyof T] | null {
  return typeof value === "string" && Object.values(enumObject).includes(value)
    ? (value as T[keyof T])
    : null;
}

export const disciplineValue = (value: unknown) => enumValue(Discipline, value);
export const languageValue = (value: unknown) => enumValue(Langue, value);
export const formatValue = (value: unknown) => enumValue(FormatEntretien, value);
export const levelValue = (value: unknown) => enumValue(Niveau, value);
export const colloqueStatusValue = (value: unknown) => enumValue(StatutColloque, value);

export function positiveInt(value: unknown, max = 1_000_000): number | null {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isInteger(parsed) && parsed > 0 && parsed <= max ? parsed : null;
}

export function nonNegativeNumber(value: unknown, max = 1_000_000_000): number | null {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= max ? parsed : null;
}

export function stringArray(value: unknown, maxItems = 30, maxLength = 100): string[] | null {
  if (!Array.isArray(value) || value.length > maxItems) return null;
  const cleaned = value.map((item) => cleanString(item, maxLength));
  return cleaned.every((item): item is string => item !== null) ? Array.from(new Set(cleaned)) : null;
}

export function pageValue(value: string | null): number {
  return positiveInt(value ?? 1, 10_000) ?? 1;
}
