import type { Locale } from "@/i18n/config";

const intlLocale: Record<Locale, string> = { pt: "pt-BR", en: "en-US" };

export function formatMonth(yyyyMm: string, locale: Locale) {
  const [y, m] = yyyyMm.split("-").map(Number);
  return new Intl.DateTimeFormat(intlLocale[locale], {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, 1)));
}

export function formatDate(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(intlLocale[locale], {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}
