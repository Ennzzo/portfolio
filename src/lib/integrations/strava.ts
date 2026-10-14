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

export type StravaSummary = { last: StravaActivity | null; recentRunKm: number | null };

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

/** Último treino e km corridos nas últimas 4 semanas (Strava API, OAuth com refresh token). */
export async function getStravaSummary(): Promise<StravaSummary | null> {
  "use cache";
  cacheLife("minutes");
  try {
    const token = await accessToken();
    if (!token) return null;
    const headers = { Authorization: `Bearer ${token}` };
    const res = await fetch("https://www.strava.com/api/v3/athlete/activities?per_page=1", { headers });
    if (!res.ok) return null;
    const [raw] = (await res.json()) as (RawActivity & { athlete?: { id: number } })[];

    let recentRunKm: number | null = null;
    if (raw?.athlete?.id) {
      const stats = await fetch(`https://www.strava.com/api/v3/athletes/${raw.athlete.id}/stats`, { headers });
      if (stats.ok) {
        const json = (await stats.json()) as { recent_run_totals?: { distance: number } };
        if (json.recent_run_totals) recentRunKm = Math.round(json.recent_run_totals.distance / 100) / 10;
      }
    }
    return { last: raw ? parseStravaActivity(raw) : null, recentRunKm };
  } catch {
    return null;
  }
}
