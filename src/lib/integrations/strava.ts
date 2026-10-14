import { cacheLife } from "next/cache";

export type StravaActivity = {
  name: string;
  type: string;
  distanceKm: number;
  movingSeconds: number;
  /** min/km, só para corridas */
  paceSecondsPerKm: number | null;
  date: string;
};

export type RunTotals = { count: number; km: number; seconds: number };

export type StravaSummary = {
  /** Precisa do escopo activity:read; null se o token só tiver "read". */
  last: StravaActivity | null;
  /** Corridas nas últimas 4 semanas */
  recent: RunTotals | null;
  /** Km corridos no ano */
  yearKm: number | null;
};

type RawTotals = { count: number; distance: number; moving_time: number };

export const toRunTotals = (t?: RawTotals | null): RunTotals | null =>
  t ? { count: t.count, km: Math.round(t.distance / 100) / 10, seconds: t.moving_time } : null;

type RawActivity = { name: string; sport_type?: string; type?: string; distance: number; moving_time: number; start_date: string };

const RUN_TYPES = new Set(["Run", "TrailRun", "VirtualRun"]);

export function parseStravaActivity(a: RawActivity): StravaActivity {
  const type = a.sport_type ?? a.type ?? "Workout";
  const km = a.distance / 1000;
  return {
    name: a.name,
    type,
    distanceKm: Math.round(km * 100) / 100,
    movingSeconds: a.moving_time,
    paceSecondsPerKm: RUN_TYPES.has(type) && km > 0 ? Math.round(a.moving_time / km) : null,
    date: a.start_date,
  };
}

async function accessToken() {
  const { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_REFRESH_TOKEN } = process.env;
  if (!STRAVA_CLIENT_ID || !STRAVA_CLIENT_SECRET || !STRAVA_REFRESH_TOKEN) return null;
  const res = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: STRAVA_REFRESH_TOKEN,
    }),
  });
  if (!res.ok) return null;
  return ((await res.json()) as { access_token: string }).access_token;
}

/** Estatísticas de corrida (escopo "read") e, se permitido, o último treino (escopo activity:read). */
export async function getStravaSummary(): Promise<StravaSummary | null> {
  "use cache";
  cacheLife("minutes");
  try {
    const token = await accessToken();
    if (!token) return null;
    const headers = { Authorization: `Bearer ${token}` };
    const api = "https://www.strava.com/api/v3";

    const athlete = await fetch(`${api}/athlete`, { headers });
    if (!athlete.ok) return null;
    const { id } = (await athlete.json()) as { id: number };

    const [stats, activities] = await Promise.all([
      fetch(`${api}/athletes/${id}/stats`, { headers }),
      fetch(`${api}/athlete/activities?per_page=1`, { headers }),
    ]);
    const totals = stats.ok
      ? ((await stats.json()) as { recent_run_totals?: RawTotals; ytd_run_totals?: RawTotals })
      : {};
    const [raw] = activities.ok ? ((await activities.json()) as RawActivity[]) : [];

    return {
      last: raw ? parseStravaActivity(raw) : null,
      recent: toRunTotals(totals.recent_run_totals),
      yearKm: toRunTotals(totals.ytd_run_totals)?.km ?? null,
    };
  } catch {
    return null;
  }
}
