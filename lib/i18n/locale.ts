export type Locale = "vi" | "en";

export const LOCALES: readonly Locale[] = ["vi", "en"] as const;
export const DEFAULT_LOCALE: Locale = "vi";

export function isLocale(value: unknown): value is Locale {
  return value === "vi" || value === "en";
}

export function localeFromPath(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "vi";
}
