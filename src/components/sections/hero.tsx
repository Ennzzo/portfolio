import { HeroTitle } from "../fx/hero-title";
import { Reveal } from "../reveal";
import { profile } from "@/data/profile";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function HeroSection({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  return (
    <section id="home" data-section className="flex min-h-[calc(100dvh-4rem)] flex-col justify-center pt-16 pb-16">
      <Reveal>
        <p
          data-buck-floor
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 font-mono text-xs text-muted"
        >
          <span className="size-1.5 rounded-full bg-accent" />
          {dict.home.eyebrow}
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <HeroTitle
          lines={[
            { text: `${lang === "pt" ? "Oi, eu sou o" : "Hi, I'm"} ${profile.shortName}.` },
            { text: profile.headline[lang], muted: true },
          ]}
        />
      </Reveal>
      <Reveal delay={0.2}>
        <p className="mt-8 max-w-xl text-lg text-muted">{profile.bio[lang]}</p>
        <ul data-buck-floor className="mt-8 flex w-fit flex-wrap gap-2">
          {profile.tags.map((t) => (
            <li key={t} className="rounded-full bg-surface px-3 py-1 font-mono text-xs text-muted">
              {t}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
