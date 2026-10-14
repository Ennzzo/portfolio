import { describe, expect, it } from "vitest";
import { buildCalendar, type ContributionDay } from "@/lib/integrations/github-contributions";

const day = (date: string, count: number): ContributionDay => ({ date, count, level: count ? 1 : 0 });

describe("buildCalendar", () => {
  // 2026-10-01 é quinta-feira
  const days = [
    day("2026-09-29", 1), // terça
    day("2026-09-30", 2),
    day("2026-10-01", 0),
    day("2026-10-02", 5),
    day("2026-10-03", 1),
    day("2026-10-04", 1), // domingo
    day("2026-10-05", 0), // hoje, sem commits ainda
  ];
  const cal = buildCalendar(days);

  it("monta colunas de 7 dias começando no domingo", () => {
    expect(cal.weeks).toHaveLength(2);
    expect(cal.weeks[0].slice(0, 2)).toEqual([null, null]);
    expect(cal.weeks[0][2]?.date).toBe("2026-09-29");
    expect(cal.weeks[1][0]?.date).toBe("2026-10-04");
    expect(cal.weeks[1].filter(Boolean)).toHaveLength(2);
  });

  it("marca o mês na primeira semana em que ele começa", () => {
    expect(cal.months).toEqual([{ week: 0, month: 9 }]);
  });

  it("calcula total, sequências e melhor dia", () => {
    expect(cal.stats.total).toBe(10);
    expect(cal.stats.longestStreak).toBe(3);
    expect(cal.stats.currentStreak).toBe(3);
    expect(cal.stats.bestDay?.date).toBe("2026-10-02");
    expect(cal.stats.activeDays).toBe(5);
  });
});
