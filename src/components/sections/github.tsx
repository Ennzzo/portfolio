import { Suspense } from "react";
import { GithubHeatmap } from "../github-heatmap";
import { ArrowUpRight, GitHub } from "../icons";
import { Reveal } from "../reveal";
import { Section, SectionHeading } from "./section-heading";
import { profile } from "@/data/profile";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getContributions } from "@/lib/integrations/github-contributions";

export function GithubSection({ lang, dict, index }: { lang: Locale; dict: Dictionary; index: string }) {
  const t = dict.github;
  return (
    <Section id="github">
      <SectionHeading index={index} label="GitHub" title={t.title} subtitle={t.subtitle} />
      <Reveal>
        <div data-buck-floor className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <Suspense fallback={<div className="h-48 animate-pulse rounded-xl bg-surface-hover" aria-hidden />}>
            <Contributions lang={lang} dict={dict} />
          </Suspense>
        </div>
      </Reveal>
    </Section>
  );
}

async function Contributions({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.github;
  const cal = await getContributions(profile.githubUser);
  const profileUrl = `https://github.com/${profile.githubUser}`;
  if (!cal) {
    return (
      <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-muted hover:text-foreground">
        <GitHub /> {t.fallback} <ArrowUpRight width={14} height={14} />
      </a>
    );
  }
  const num = (n: number) => n.toLocaleString(lang === "pt" ? "pt-BR" : "en-US");
  const best = cal.stats.bestDay;
  const stats = [
    [t.total, num(cal.stats.total)],
    [t.activeDays, num(cal.stats.activeDays)],
    [t.longest, `${cal.stats.longestStreak} ${t.days}`],
    [t.best, best ? `${best.count}` : "—"],
  ];

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
        <p className="text-4xl font-medium tracking-tight sm:text-5xl">
          {num(cal.stats.total)} <span className="text-lg text-muted">{t.lastYear}</span>
        </p>
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-foreground"
        >
          <GitHub width={16} height={16} /> @{profile.githubUser} <ArrowUpRight width={14} height={14} />
        </a>
      </div>
      <GithubHeatmap calendar={cal} lang={lang} dict={t} />
      <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-border pt-6 sm:grid-cols-4">
        {stats.map(([label, value]) => (
          <div key={label}>
            <dt className="font-mono text-[11px] text-muted uppercase">{label}</dt>
            <dd className="mt-1 text-2xl tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
