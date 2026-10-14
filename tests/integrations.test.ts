import { describe, expect, it } from "vitest";
import { parseLetterboxdRss, stars } from "@/lib/integrations/letterboxd";
import { isPublic, parseStravaActivity, toRunTotals } from "@/lib/integrations/strava";
import { parseValorantMmr, rankIcon } from "@/lib/integrations/valorant";

describe("parseValorantMmr", () => {
  const mmr = {
    data: {
      current_data: { currenttierpatched: "Unrated" },
      highest_rank: { patched_tier: "Immortal 3" },
      by_season: {
        e10a2: { final_rank_patched: "Ascendant 3" },
        e11a1: { error: "No data Available" },
        e11a2: { final_rank_patched: "Ascendant 2" },
        e11a5: { final_rank_patched: "Unrated" },
      },
    },
  };

  it("trata Unrated como sem rank e pega o pico e a última temporada ranqueada", () => {
    expect(parseValorantMmr(mmr, 219)).toEqual({
      current: null,
      peak: "Immortal 3",
      peakIcon: expect.stringContaining("/26/largeicon.png"),
      lastRanked: "Ascendant 2",
      level: 219,
    });
  });

  it("retorna null sem dados", () => {
    expect(parseValorantMmr({})).toBeNull();
  });
});

describe("rankIcon", () => {
  it("usa a numeração atual de tiers pelo nome do rank", () => {
    expect(rankIcon("Iron 1")).toContain("/3/");
    expect(rankIcon("Ascendant 2")).toContain("/22/");
    expect(rankIcon("Radiant")).toContain("/27/");
    expect(rankIcon("Unknown 1")).toBeNull();
  });
});

describe("parseLetterboxdRss", () => {
  const xml = `<rss><channel>
    <item><title>Lista qualquer</title><link>https://letterboxd.com/x/list/a/</link></item>
    <item><title>Interstellar, 2014 - ★★★★½</title><link>https://letterboxd.com/x/film/interstellar/</link>
      <letterboxd:watchedDate>2026-10-12</letterboxd:watchedDate><letterboxd:filmTitle>Interstellar</letterboxd:filmTitle>
      <letterboxd:filmYear>2014</letterboxd:filmYear><letterboxd:memberRating>4.5</letterboxd:memberRating>
      <letterboxd:memberLike>Yes</letterboxd:memberLike>
      <description><![CDATA[ <p><img src="https://a.ltrbxd.com/poster.jpg"/></p> ]]></description></item>
    <item><title>Arrival, 2016</title><link>https://letterboxd.com/x/film/arrival/</link>
      <letterboxd:filmTitle>Arrival &amp; Co</letterboxd:filmTitle><letterboxd:filmYear>2016</letterboxd:filmYear></item>
  </channel></rss>`;

  it("ignora itens que não são filmes e extrai nota, like e pôster", () => {
    const films = parseLetterboxdRss(xml);
    expect(films).toHaveLength(2);
    expect(films[0]).toMatchObject({ title: "Interstellar", year: "2014", rating: 4.5, liked: true, poster: "https://a.ltrbxd.com/poster.jpg" });
    expect(films[1]).toMatchObject({ title: "Arrival & Co", rating: null, liked: false, poster: null });
  });

  it("converte nota em estrelas", () => {
    expect(stars(4.5)).toBe("★★★★½");
    expect(stars(3)).toBe("★★★");
  });
});

describe("parseStravaActivity", () => {
  it("calcula distância em km e pace de corrida", () => {
    const a = parseStravaActivity({ name: "Treino", sport_type: "Run", distance: 5000, moving_time: 1500, start_date: "2026-10-13T10:00:00Z" });
    expect(a.distanceKm).toBe(5);
    expect(a.paceSecondsPerKm).toBe(300);
  });

  it("não calcula pace para treinos que não são corrida", () => {
    const a = parseStravaActivity({ name: "HYROX", sport_type: "Crossfit", distance: 0, moving_time: 3600, start_date: "2026-10-13T10:00:00Z" });
    expect(a.paceSecondsPerKm).toBeNull();
  });
});

describe("toRunTotals", () => {
  it("converte metros em km com uma casa decimal", () => {
    expect(toRunTotals({ count: 4, distance: 25632, moving_time: 7490 })).toEqual({ count: 4, km: 25.6, seconds: 7490 });
    expect(toRunTotals(undefined)).toBeNull();
  });
});

describe("isPublic", () => {
  const base = { name: "x", distance: 1, moving_time: 1, start_date: "2026-10-01T00:00:00Z" };
  it("só aceita atividades visíveis para todos", () => {
    expect(isPublic({ ...base, private: false, visibility: "everyone" })).toBe(true);
    expect(isPublic({ ...base, private: true, visibility: "only_me" })).toBe(false);
    expect(isPublic({ ...base, private: false, visibility: "followers_only" })).toBe(false);
  });
});
