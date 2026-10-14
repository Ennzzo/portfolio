import { cacheLife } from "next/cache";

export type LetterboxdFilm = {
  title: string;
  year: string | null;
  /** 0.5 a 5 */
  rating: number | null;
  liked: boolean;
  watchedDate: string | null;
  url: string;
  poster: string | null;
};

const tag = (xml: string, name: string) => xml.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`))?.[1]?.trim() ?? null;

const decode = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'");

/** Lê o RSS público do Letterboxd e devolve os filmes assistidos (ignora listas e reviews sem filme). */
export function parseLetterboxdRss(xml: string, limit = 4): LetterboxdFilm[] {
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
  const films: LetterboxdFilm[] = [];
  for (const item of items) {
    const title = tag(item, "letterboxd:filmTitle");
    if (!title) continue;
    const rating = tag(item, "letterboxd:memberRating");
    films.push({
      title: decode(title),
      year: tag(item, "letterboxd:filmYear"),
      rating: rating ? Number(rating) : null,
      liked: tag(item, "letterboxd:memberLike") === "Yes",
      watchedDate: tag(item, "letterboxd:watchedDate"),
      url: tag(item, "link") ?? "",
      poster: item.match(/<img src="([^"]+)"/)?.[1] ?? null,
    });
    if (films.length === limit) break;
  }
  return films;
}

/** Filmes assistidos recentemente, via RSS público (sem chave). */
export async function getLetterboxdFilms(username: string): Promise<LetterboxdFilm[] | null> {
  "use cache";
  cacheLife("hours");
  try {
    const res = await fetch(`https://letterboxd.com/${encodeURIComponent(username)}/rss/`, {
      headers: { "User-Agent": "Mozilla/5.0 (portfolio de Enzo Bambirra)" },
    });
    if (!res.ok) return null;
    return parseLetterboxdRss(await res.text());
  } catch {
    return null;
  }
}

/** "★★★½" a partir da nota 0.5–5. */
export const stars = (rating: number) => "★".repeat(Math.floor(rating)) + (rating % 1 ? "½" : "");
