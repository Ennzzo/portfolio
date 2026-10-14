"use client";

import { useState } from "react";
import type { ContributionCalendar, ContributionDay } from "@/lib/integrations/github-contributions";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

const LEVEL_BG = [
  "var(--surface-hover)",
  "color-mix(in oklab, var(--accent) 28%, var(--surface))",
  "color-mix(in oklab, var(--accent) 50%, var(--surface))",
  "color-mix(in oklab, var(--accent) 75%, var(--surface))",
  "var(--accent)",
];

export function GithubHeatmap({ calendar, lang, dict }: { calendar: ContributionCalendar; lang: Locale; dict: Dictionary["github"] }) {
  const [hover, setHover] = useState<ContributionDay | null>(null);
  const locale = lang === "pt" ? "pt-BR" : "en-US";
  const monthName = (m: number) => new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" }).format(new Date(Date.UTC(2026, m, 1)));
  const fullDate = (d: string) =>
    new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${d}T00:00:00Z`));
  const describe = (d: ContributionDay) => `${d.count} ${d.count === 1 ? dict.contribution : dict.contributions} · ${fullDate(d.date)}`;

  return (
    <div>
      <div className="-mx-1 overflow-x-auto px-1 pb-2" dir="rtl">
        <div dir="ltr" className="inline-block">
          <div className="relative mb-2 ml-8 h-4 font-mono text-[10px] text-muted" style={{ width: calendar.weeks.length * 15 }}>
            {calendar.months.map(({ week, month }) => (
              <span key={`${week}-${month}`} className="absolute" style={{ left: week * 15 }}>
                {monthName(month)}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="grid w-6 grid-rows-7 gap-[3px] font-mono text-[10px] leading-3 text-muted">
              {dict.weekdays.map((w, i) => (
                <span key={i} className="h-3">
                  {w}
                </span>
              ))}
            </div>
            <div className="flex gap-[3px]" onMouseLeave={() => setHover(null)}>
              {calendar.weeks.map((week, w) => (
                <div key={w} className="grid grid-rows-7 gap-[3px]">
                  {week.map((d, i) =>
                    d ? (
                      <span
                        key={d.date}
                        title={describe(d)}
                        onMouseEnter={() => setHover(d)}
                        className="size-3 rounded-[3px] transition-transform hover:scale-125 hover:ring-1 hover:ring-foreground/60"
                        style={{ background: LEVEL_BG[d.level] }}
                      />
                    ) : (
                      <span key={`x${i}`} className="size-3" />
                    ),
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-muted">
        <p aria-live="polite" className="min-h-4">
          {hover ? describe(hover) : dict.hint}
        </p>
        <p className="flex items-center gap-1.5">
          {dict.less}
          {LEVEL_BG.map((bg, i) => (
            <span key={i} className="size-3 rounded-[3px]" style={{ background: bg }} />
          ))}
          {dict.more}
        </p>
      </div>
    </div>
  );
}
