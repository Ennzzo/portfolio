import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeading } from "@/components/page-heading";
import { ArrowUpRight } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { experiencesByDate } from "@/data/experiences";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { formatMonth } from "@/lib/format";

export async function generateMetadata({ params }: PageProps<"/[lang]/experience">): Promise<Metadata> {
  const { lang } = await params;
  return hasLocale(lang) ? { title: getDictionary(lang).experience.title } : {};
}

export default async function ExperiencePage({ params }: PageProps<"/[lang]/experience">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang).experience;

  return (
    <>
      <PageHeading title={dict.title} subtitle={dict.subtitle} />

      <ul className="divide-y divide-border border-y border-border">
        {experiencesByDate.map((exp) => (
          <li key={exp.organization + exp.start}>
            <Reveal className="grid gap-3 py-8 md:grid-cols-[200px_1fr] md:gap-10">
              <div className="font-mono text-sm text-muted">
                <p>
                  {formatMonth(exp.start, lang)} — {exp.end ? formatMonth(exp.end, lang) : dict.present}
                </p>
                <p className="mt-2 inline-block rounded-full border border-border px-2.5 py-0.5 text-xs">
                  {dict.types[exp.type]}
                </p>
              </div>
              <div>
                <h2 className="text-xl font-medium">{exp.role[lang]}</h2>
                <p className="mt-1 text-muted">
                  {exp.url ? (
                    <a href={exp.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                      {exp.organization}
                    </a>
                  ) : (
                    exp.organization
                  )}
                </p>
                <p className="mt-4 max-w-2xl leading-relaxed">{exp.description[lang]}</p>
                {exp.highlights && (
                  <ul className="mt-4 max-w-2xl space-y-1.5 text-muted">
                    {exp.highlights[lang].map((h) => (
                      <li key={h} className="flex gap-3">
                        <span className="mt-2.5 size-1 shrink-0 rounded-full bg-accent" aria-hidden />
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
                {exp.attachment && (
                  <a
                    href={exp.attachment.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 text-sm text-accent hover:underline"
                  >
                    {exp.attachment.label[lang]} <ArrowUpRight width={14} height={14} />
                  </a>
                )}
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </>
  );
}
