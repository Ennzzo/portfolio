import Image from "next/image";
import { Suspense, type ReactNode } from "react";
import { BuckPhoto } from "../buck/buck-photo";
import { ArrowUpRight } from "../icons";
import { CardSkeleton, LetterboxdCard, StravaCard, ValorantCard } from "../off-clock/cards";
import { Reveal } from "../reveal";
import { Section, SectionHeading } from "./section-heading";
import { profile } from "@/data/profile";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function AboutSection({ lang, dict, index }: { lang: Locale; dict: Dictionary; index: string }) {
  const t = dict.about;
  const { about } = profile;

  return (
    <Section id="about">
      <SectionHeading index={index} label={dict.nav.about} title={t.title} />

      <div className="grid items-start gap-12 md:grid-cols-[1fr_auto]">
        <Reveal className="max-w-3xl space-y-5 text-xl leading-relaxed sm:text-2xl">
          {about.intro[lang].map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Reveal>
        <Reveal delay={0.15}>
          <BuckPhoto alt={t.buckAlt} caption={t.buckCaption} play={t.buckPlay} />
        </Reveal>
      </div>

      <div className="mt-20 grid gap-12 md:grid-cols-2">
        <Block title={t.education}>
          <ul className="space-y-4">
            {about.education.map((e) => (
              <li key={e.institution + e.period}>
                <p className="text-lg">{e.course[lang]}</p>
                <p className="text-muted">
                  {e.institution}
                  {e.period && <span className="font-mono text-sm"> · {e.period}</span>}
                </p>
                {"certificate" in e && e.certificate && (
                  <a
                    href={e.certificate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-3 flex w-fit items-center gap-3 rounded-xl border border-border bg-surface p-2 pr-4 transition-colors hover:border-accent"
                  >
                    <Image
                      src={e.certificate}
                      alt={t.certificateAlt}
                      width={96}
                      height={65}
                      className="rounded-md transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="inline-flex items-center gap-1 text-sm text-accent">
                      {t.certificate} <ArrowUpRight width={14} height={14} />
                    </span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </Block>

        <Block title={t.goals}>
          <p className="text-lg">{about.goals[lang]}</p>
        </Block>

        <Block title={t.interests}>
          <ul className="space-y-2 text-lg">
            {about.interests[lang].map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </Block>

        <Block title={t.skills}>
          <ul data-buck-floor className="flex flex-wrap gap-2">
            {about.skills.map((s) => {
              const label = typeof s === "string" ? s : s[lang];
              return (
                <li key={label} className="rounded-full border border-border px-3 py-1 font-mono text-sm text-muted">
                  {label}
                </li>
              );
            })}
          </ul>
        </Block>
      </div>

      <div className="mt-24">
        <Reveal>
          <h3 data-buck-floor className="w-fit text-3xl font-medium tracking-tight sm:text-4xl">
            {dict.offClock.title}
          </h3>
          <p className="mt-2 mb-8 text-muted">{dict.offClock.subtitle}</p>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          <Suspense fallback={<CardSkeleton />}>
            <StravaCard dict={dict.offClock} lang={lang} />
          </Suspense>
          <Suspense fallback={<CardSkeleton />}>
            <LetterboxdCard dict={dict.offClock} />
          </Suspense>
          <Suspense fallback={<CardSkeleton />}>
            <ValorantCard dict={dict.offClock} ranks={dict.game.ranks} />
          </Suspense>
        </div>
      </div>
    </Section>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Reveal>
      <h3 className="mb-5 font-mono text-sm tracking-widest text-muted uppercase">{title}</h3>
      {children}
    </Reveal>
  );
}
