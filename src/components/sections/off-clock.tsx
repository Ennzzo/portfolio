import { Suspense } from "react";
import { CardSkeleton, LetterboxdCard, StravaCard, ValorantCard } from "../off-clock/cards";
import { Section, SectionHeading } from "./section-heading";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function OffClockSection({ lang, dict, index }: { lang: Locale; dict: Dictionary; index: string }) {
  const t = dict.offClock;
  return (
    <Section id="off-clock">
      <SectionHeading index={index} label={t.label} title={t.title} subtitle={t.subtitle} />
      <div className="grid gap-4 md:grid-cols-3">
        <Suspense fallback={<CardSkeleton />}>
          <StravaCard dict={t} lang={lang} />
        </Suspense>
        <Suspense fallback={<CardSkeleton />}>
          <LetterboxdCard dict={t} />
        </Suspense>
        <Suspense fallback={<CardSkeleton />}>
          <ValorantCard dict={t} ranks={dict.game.ranks} />
        </Suspense>
      </div>
    </Section>
  );
}
