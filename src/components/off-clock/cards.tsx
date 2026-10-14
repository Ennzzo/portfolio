import Image from "next/image";
import type { ComponentType, ReactNode, SVGProps } from "react";
import { profile } from "@/data/profile";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getLetterboxdFilms, stars } from "@/lib/integrations/letterboxd";
import { getStravaSummary } from "@/lib/integrations/strava";
import { getValorantProfile } from "@/lib/integrations/valorant";
import { ArrowUpRight, Letterboxd, Strava, Valorant } from "../icons";

type Dict = Dictionary["offClock"];
type Icon = ComponentType<SVGProps<SVGSVGElement>>;

function Card({
  label,
  color,
  icon: BrandIcon,
  live,
  liveLabel,
  children,
}: {
  label: string;
  color: string;
  icon: Icon;
  live: boolean;
  liveLabel: string;
  children: ReactNode;
}) {
  return (
    <article className="relative flex min-h-56 flex-col overflow-hidden rounded-2xl border border-border bg-surface p-6">
      <div aria-hidden className="absolute -top-16 -right-16 size-40 rounded-full opacity-20 blur-3xl" style={{ background: color }} />
      <header className="mb-5 flex items-center justify-between">
        <h3 className="inline-flex items-center gap-2.5 font-mono text-xs tracking-widest uppercase" style={{ color }}>
          <BrandIcon height={18} width={BrandIcon === Letterboxd ? 36 : 18} aria-hidden />
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

const intl = (lang: Locale) => (lang === "pt" ? "pt-BR" : "en-US");

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
    <Card label={dict.strava.label} color="#fc4c02" icon={Strava} live={!!last} liveLabel={dict.live}>
      {last ? (
        <div>
          <p className="font-mono text-[11px] text-muted uppercase">
            {dict.strava.last} ·{" "}
            {new Intl.DateTimeFormat(intl(lang), { day: "2-digit", month: "short", timeZone: profile.timeZone }).format(new Date(last.date))}
          </p>
          <p className="mt-1 text-xl font-medium">{last.name}</p>
          <p className="mt-2 font-mono text-sm text-muted">
            {last.distanceKm > 0 && `${last.distanceKm.toLocaleString(intl(lang))} km · `}
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

export async function LetterboxdCard({ dict }: { dict: Dict }) {
  const user = profile.accounts.letterboxd;
  const films = user ? await getLetterboxdFilms(user) : null;
  return (
    <Card label={dict.letterboxd.label} color="#00e054" icon={Letterboxd} live={!!films?.length} liveLabel={dict.live}>
      {films?.length ? (
        <div className="flex flex-1 flex-col">
          <p className="mb-3 font-mono text-[11px] text-muted uppercase">{dict.letterboxd.recent}</p>
          <ul className="grid grid-cols-4 gap-2">
            {films.map((f) => (
              <li key={f.url}>
                <a href={f.url} target="_blank" rel="noopener noreferrer" title={`${f.title}${f.year ? ` (${f.year})` : ""}`} className="group block">
                  <div className="aspect-[2/3] overflow-hidden rounded-md border border-border bg-surface-hover">
                    {f.poster && (
                      <Image
                        src={f.poster}
                        alt={f.title}
                        width={120}
                        height={180}
                        unoptimized
                        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                  </div>
                  {f.rating !== null && <p className="mt-1 text-center text-[10px] tracking-tight text-[#00e054]">{stars(f.rating)}</p>}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={`https://letterboxd.com/${user}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-1 pt-4 text-sm text-muted hover:text-foreground"
          >
            {dict.letterboxd.profile} <ArrowUpRight width={14} height={14} />
          </a>
        </div>
      ) : (
        <p className="text-lg text-muted">{dict.letterboxd.fallback}</p>
      )}
    </Card>
  );
}

export async function ValorantCard({ dict, ranks }: { dict: Dict; ranks: Dictionary["game"]["ranks"] }) {
  const account = profile.accounts.valorant;
  const riotId = `${account.name}#${account.tag}`;
  const data = await getValorantProfile(account.region, account.name, account.tag);
  // "Immortal 3" → "Imortal 3" usando os nomes do jogo AIM BUCK!
  const tr = (rank: string) => {
    const [name, div] = rank.split(" ");
    const t = ranks[name.toLowerCase() as keyof typeof ranks];
    return t ? `${t}${div ? ` ${div}` : ""}` : rank;
  };

  return (
    <Card label={dict.valorant.label} color="#ff4655" icon={Valorant} live={!!data} liveLabel={dict.live}>
      <p className="text-muted">{dict.valorant.text}</p>
      <a
        href={`https://tracker.gg/valorant/profile/riot/${encodeURIComponent(riotId)}/overview`}
        target="_blank"
        rel="noopener noreferrer"
        title={dict.valorant.profile}
        className="mt-3 inline-flex w-fit items-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-2 font-mono text-base transition-colors hover:border-[#ff4655]"
      >
        {riotId} <ArrowUpRight width={14} height={14} />
      </a>
      {data && (data.peak || data.level) && (
        <div className="mt-auto flex items-center gap-3 border-t border-border pt-4">
          {data.peakIcon && <Image src={data.peakIcon} alt="" width={40} height={40} unoptimized />}
          <div>
            {data.peak && (
              <p className="text-lg leading-tight">
                <span className="mr-2 font-mono text-[10px] text-muted uppercase">{dict.valorant.peak}</span>
                {tr(data.peak)}
              </p>
            )}
            <p className="mt-1 text-sm text-muted">
              {[data.lastRanked && `${dict.valorant.lastAct}: ${tr(data.lastRanked)}`, data.level && `${dict.valorant.level} ${data.level}`]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}

export function CardSkeleton() {
  return <div className="min-h-56 animate-pulse rounded-2xl border border-border bg-surface" aria-hidden />;
}
