import { HeroTitle } from "../fx/hero-title";
import { profile } from "@/data/profile";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function HeroSection({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  return (
    <section id="home" data-section className="flex min-h-[calc(100dvh-4rem)] flex-col justify-center pt-16 pb-16">
      <div className="hero-in" style={{ animationDelay: "0s" }}>
        <p
          data-buck-floor
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 font-mono text-xs text-muted"
        >
          <span className="size-1.5 rounded-full bg-accent" />
          {dict.home.eyebrow}
        </p>
      </div>
      <div className="hero-in" style={{ animationDelay: "0.08s" }}>
        <HeroTitle
          lines={[
            { text: `${lang === "pt" ? "Oi, eu sou o" : "Hi, I'm"} ${profile.shortName}.` },
            { text: profile.headline[lang], muted: true },
          ]}
        />
      </div>
      <div className="hero-in" style={{ animationDelay: "0.16s" }}>
        <p className="mt-8 max-w-xl text-lg text-muted">{profile.bio[lang]}</p>
        <ul data-buck-floor className="mt-8 flex w-fit flex-wrap gap-2">
          {profile.tags.map((t) => (
            <li key={t} className="rounded-full bg-surface px-3 py-1 font-mono text-xs text-muted">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
