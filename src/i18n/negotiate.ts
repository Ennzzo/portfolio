import { defaultLocale, locales, type Locale } from "./config";

/** Escolhe o idioma suportado de maior prioridade no cabeçalho Accept-Language. */
export function negotiateLocale(acceptLanguage: string | null): Locale {
  const ranked = (acceptLanguage ?? "")
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { lang: tag.toLowerCase().split("-")[0], q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  return (ranked.find((r) => (locales as readonly string[]).includes(r.lang))?.lang as Locale) ?? defaultLocale;
}
