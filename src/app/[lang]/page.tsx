import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { ArrowUpRight } from "@/components/icons";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const featured = projects.filter((p) => p.featured).reverse();

  return (
    <>
      <section className="flex min-h-[70dvh] flex-col justify-center py-20">
        <Reveal>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 font-mono text-xs text-muted">
            <span className="size-1.5 rounded-full bg-accent" />
            {dict.home.eyebrow}
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="max-w-4xl text-5xl font-medium leading-[1.05] tracking-tight sm:text-7xl">
            {lang === "pt" ? "Oi, eu sou o " : "Hi, I'm "}
            {profile.shortName}.<br />
            <span className="text-muted">{profile.headline[lang]}</span>
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-8 max-w-xl text-lg text-muted">{profile.bio[lang]}</p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {profile.tags.map((t) => (
              <li key={t} className="rounded-full bg-surface px-3 py-1 font-mono text-xs text-muted">
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="py-16">
        <Reveal className="mb-8 flex items-end justify-between gap-4">
          <h2 className="font-mono text-sm uppercase tracking-widest text-muted">{dict.home.selectedWork}</h2>
          <Link href={`/${lang}/projects`} className="inline-flex items-center gap-1 text-sm text-muted hover:text-accent">
            {dict.home.allProjects} <ArrowUpRight width={14} height={14} />
          </Link>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          {featured.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08}>
              <ProjectCard project={p} lang={lang} dict={dict.projects} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-24 text-center">
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-4xl font-medium tracking-tight sm:text-5xl">{dict.home.ctaTitle}</h2>
          <Link
            href={`/${lang}/contact`}
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-medium text-accent-foreground transition-transform hover:scale-[1.03]"
          >
            {dict.home.ctaButton} <ArrowUpRight width={16} height={16} />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
