import Image from "next/image";
import type { ReactNode } from "react";
import { BuckPhoto } from "../buck/buck-photo";
import { ArrowUpRight } from "../icons";
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

      <Reveal className="max-w-3xl space-y-5 text-xl leading-relaxed sm:text-2xl">
        {about.intro[lang].map((p) => (
          <p key={p}>{p}</p>
        ))}
      </Reveal>

      <Reveal className="mt-10 flex max-w-xl items-center gap-5 rounded-2xl border border-border bg-surface/60 p-4 sm:gap-6 sm:p-5">
        <BuckPhoto alt={t.buckAlt} play={t.buckPlay} />
        <div>
          <p className="font-mono text-xs tracking-widest text-muted uppercase">{t.buckTitle}</p>
          <p className="mt-1.5 text-lg leading-snug">{t.buckText}</p>
          <p className="mt-2 text-sm text-muted">{t.buckHint}</p>
        </div>
      </Reveal>

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
