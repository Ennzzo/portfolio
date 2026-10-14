import Link from "next/link";
import { notFound } from "next/navigation";
import { BuckWalker } from "@/components/buck/buck-walker";
import { HeroTitle } from "@/components/fx/hero-title";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { ArrowUpRight } from "@/components/icons";
import { WhatsAppComposer } from "@/components/whatsapp-composer";
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
      <section className="flex min-h-[70dvh] flex-col justify-center py-16">
        <BuckWalker dict={dict.buck} />
        <Reveal>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 font-mono text-xs text-muted">
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

      <section className="py-24">
        <Reveal className="mx-auto max-w-2xl">
          <h2 className="text-center text-4xl font-medium tracking-tight sm:text-5xl">{dict.home.ctaTitle}</h2>
          <p className="mt-4 mb-10 text-center text-lg text-muted">{dict.home.ctaSubtitle}</p>
          <WhatsAppComposer dict={dict.whatsapp} />
          <p className="mt-6 text-center text-sm text-muted">
            {dict.home.ctaOther}{" "}
            <Link href={`/${lang}/contact`} className="inline-flex items-center gap-1 text-foreground hover:text-accent">
              {dict.home.ctaButton} <ArrowUpRight width={14} height={14} />
            </Link>
          </p>
        </Reveal>
      </section>
    </>
  );
}
