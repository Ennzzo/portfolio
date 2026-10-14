import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeading } from "@/components/page-heading";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { projectsByDate } from "@/data/projects";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata({ params }: PageProps<"/[lang]/projects">): Promise<Metadata> {
  const { lang } = await params;
  return hasLocale(lang) ? { title: getDictionary(lang).projects.title } : {};
}

export default async function Projects({ params }: PageProps<"/[lang]/projects">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang).projects;

  return (
    <>
      <PageHeading title={dict.title} subtitle={dict.subtitle} />

      {/* Linha do tempo: do mais antigo ao mais recente */}
      <ol className="relative border-l border-border pl-6 sm:pl-10">
        {projectsByDate.map((project, i) => (
          <li key={project.slug} className="relative pb-12 last:pb-0">
            <span
              className={`absolute top-2 -left-[29px] size-2.5 rounded-full ring-4 ring-background sm:-left-[45px] ${
                i === projectsByDate.length - 1 ? "bg-accent" : "bg-muted"
              }`}
              aria-hidden
            />
            <Reveal>
              <ProjectCard project={project} lang={lang} dict={dict} />
            </Reveal>
          </li>
        ))}
      </ol>
    </>
  );
}
