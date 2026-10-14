import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeading } from "@/components/page-heading";
import { Reveal } from "@/components/reveal";
import { profile } from "@/data/profile";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  return hasLocale(lang) ? { title: getDictionary(lang).about.title } : {};
}

export default async function About({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang).about;
  const { about } = profile;

  return (
    <>
      <PageHeading title={dict.title} />

      <Reveal className="max-w-3xl space-y-5 text-xl leading-relaxed sm:text-2xl">
        {about.intro[lang].map((p) => (
          <p key={p}>{p}</p>
        ))}
      </Reveal>

      <div className="mt-20 grid gap-12 md:grid-cols-2">
        <Block title={dict.education}>
          <ul className="space-y-4">
            {about.education.map((e) => (
              <li key={e.institution + e.period}>
                <p className="text-lg">{e.course[lang]}</p>
                <p className="text-muted">
                  {e.institution}
                  {e.period && <span className="font-mono text-sm"> · {e.period}</span>}
                </p>
              </li>
            ))}
          </ul>
        </Block>

        <Block title={dict.goals}>
          <p className="text-lg">{about.goals[lang]}</p>
        </Block>

        <Block title={dict.interests}>
          <ul className="space-y-2 text-lg">
            {about.interests[lang].map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </Block>

        <Block title={dict.skills}>
          <ul className="flex flex-wrap gap-2">
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
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <h2 className="mb-5 font-mono text-sm uppercase tracking-widest text-muted">{title}</h2>
      {children}
    </Reveal>
  );
}
