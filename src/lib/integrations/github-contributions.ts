import { cacheLife } from "next/cache";

export type ContributionDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

export type ContributionStats = {
  total: number;
  longestStreak: number;
  currentStreak: number;
  bestDay: ContributionDay | null;
  activeDays: number;
};

export type ContributionCalendar = {
  // Colunas de domingo a sábado; null completa a primeira e a última semana.
  weeks: (ContributionDay | null)[][];
  months: { week: number; month: number }[];
  stats: ContributionStats;
};

const weekday = (date: string) => new Date(`${date}T00:00:00Z`).getUTCDay();

export function buildCalendar(days: ContributionDay[]): ContributionCalendar {
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const weeks: (ContributionDay | null)[][] = [];
  let week: (ContributionDay | null)[] = sorted.length ? Array(weekday(sorted[0].date)).fill(null) : [];
  for (const day of sorted) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) weeks.push([...week, ...Array(7 - week.length).fill(null)]);

  const months: ContributionCalendar["months"] = [];
  weeks.forEach((w, i) => {
    const first = w.find((d) => d && Number(d.date.slice(8)) <= 7);
    if (!first) return;
    const month = Number(first.date.slice(5, 7)) - 1;
    if (months.at(-1)?.month !== month) months.push({ week: i, month });
  });

  let longest = 0;
  let run = 0;
  for (const d of sorted) {
    run = d.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  // Sequência atual: termina hoje ou ontem (o dia de hoje pode ainda não ter commits).
  let current = 0;
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].count > 0) current++;
    else if (i === sorted.length - 1) continue;
    else break;
  }

  return {
    weeks,
    months,
    stats: {
      total: sorted.reduce((sum, d) => sum + d.count, 0),
      longestStreak: longest,
      currentStreak: current,
      bestDay: sorted.reduce<ContributionDay | null>((best, d) => (d.count > (best?.count ?? 0) ? d : best), null),
      activeDays: sorted.filter((d) => d.count > 0).length,
    },
  };
}

export async function getContributions(user: string): Promise<ContributionCalendar | null> {
  "use cache";
  cacheLife("hours");
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(user)}?y=last`);
    if (!res.ok) return null;
    const json = (await res.json()) as { contributions?: ContributionDay[] };
    return json.contributions?.length ? buildCalendar(json.contributions) : null;
  } catch {
    return null;
  }
}
