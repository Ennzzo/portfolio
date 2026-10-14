import Image from "next/image";
import type { ReactNode } from "react";
import { profile } from "@/data/profile";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getOverwatchProfile } from "@/lib/integrations/overwatch";
import { getStravaSummary } from "@/lib/integrations/strava";
import { getValorantRank } from "@/lib/integrations/valorant";

type Dict = Dictionary["offClock"];

function Card({ label, color, live, liveLabel, children }: { label: string; color: string; live: boolean; liveLabel: string; children: ReactNode }) {
  return (
    <article className="relative flex min-h-48 flex-col overflow-hidden rounded-2xl border border-border bg-surface p-6">
      <div aria-hidden className="absolute -top-16 -right-16 size-40 rounded-full opacity-20 blur-3xl" style={{ background: color }} />
      <header className="mb-5 flex items-center justify-between">
        <h3 className="font-mono text-xs tracking-widest uppercase" style={{ color }}>
          {label}
        </h3>
        {live && (
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-muted uppercase">
            <span className="size-1.5 animate-pulse rounded-full" style={{ background: color }} /> {liveLabel}
          </span>
        )}
      </header>
      {children}
    </article>
  );
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export async function ValorantCard({ dict }: { dict: Dict }) {
  const account = profile.games.valorant;
  const rank = account ? await getValorantRank(account.region, account.name, account.tag) : null;
  return (
    <Card label={dict.valorant.label} color="#ff4655" live={!!rank} liveLabel={dict.live}>
      {rank ? (
        <div className="flex items-center gap-4">
          {rank.icon && <Image src={rank.icon} alt="" width={64} height={64} unoptimized />}
          <div>
            <p className="font-mono text-[11px] text-muted uppercase">{dict.valorant.rank}</p>
            <p className="text-2xl font-medium">{rank.tier}</p>
            <p className="mt-1 font-mono text-xs text-muted">
              {rank.rr !== null && `${rank.rr} ${dict.valorant.rr}`}
              {rank.peak && ` · ${dict.valorant.peak}: ${rank.peak}`}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-lg text-muted">{dict.valorant.fallback}</p>
      )}
    </Card>
  );
}

export async function OverwatchCard({ dict }: { dict: Dict }) {
  const tag = profile.games.overwatch;
  const ow = tag ? await getOverwatchProfile(tag) : null;
  return (
    <Card label={dict.overwatch.label} color="#f99e1a" live={!!ow && ow.ranks.length > 0} liveLabel={dict.live}>
      {ow && ow.ranks.length > 0 ? (
        <ul className="space-y-3">
          {ow.ranks.map((r) => (
            <li key={r.role} className="flex items-center gap-3">
              <Image src={r.rankIcon} alt="" width={36} height={36} unoptimized />
              <div>
                <p className="font-mono text-[11px] text-muted uppercase">{dict.overwatch.roles[r.role]}</p>
                <p className="font-medium">
                  {capitalize(r.division)} {r.tier}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-lg text-muted">{dict.overwatch.fallback}</p>
      )}
    </Card>
  );
}

const duration = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h ? `${h}h ${String(m).padStart(2, "0")}min` : `${m}min`;
};
const pace = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}/km`;

export async function StravaCard({ dict, lang }: { dict: Dict; lang: Locale }) {
  const data = await getStravaSummary();
  const last = data?.last;
  return (
    <Card label={dict.strava.label} color="#fc4c02" live={!!last} liveLabel={dict.live}>
      {last ? (
        <div>
          <p className="font-mono text-[11px] text-muted uppercase">
            {dict.strava.last} ·{" "}
            {new Intl.DateTimeFormat(lang === "pt" ? "pt-BR" : "en-US", { day: "2-digit", month: "short", timeZone: profile.timeZone }).format(
              new Date(last.date),
            )}
          </p>
          <p className="mt-1 text-xl font-medium">{last.name}</p>
          <p className="mt-2 font-mono text-sm text-muted">
            {last.distanceKm > 0 && `${last.distanceKm.toLocaleString(lang === "pt" ? "pt-BR" : "en-US")} km · `}
            {duration(last.movingSeconds)}
            {last.paceSecondsPerKm && ` · ${pace(last.paceSecondsPerKm)}`}
          </p>
          {data.recentRunKm !== null && (
            <p className="mt-4 border-t border-border pt-3 text-sm text-muted">
              {dict.strava.recent}: <span className="text-foreground">{data.recentRunKm} km</span>
            </p>
          )}
        </div>
      ) : (
        <p className="text-lg text-muted">{dict.strava.fallback}</p>
      )}
    </Card>
  );
}

export function CardSkeleton() {
  return <div className="min-h-48 animate-pulse rounded-2xl border border-border bg-surface" aria-hidden />;
}
