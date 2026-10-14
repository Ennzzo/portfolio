import { ProjectCard } from "../project-card";
import { Reveal } from "../reveal";
import { Section, SectionHeading } from "./section-heading";
import { projectsByDate } from "@/data/projects";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function ProjectsSection({ lang, dict, index }: { lang: Locale; dict: Dictionary; index: string }) {
  return (
    <Section id="projects">
      <SectionHeading index={index} label={dict.nav.projects} title={dict.projects.title} subtitle={dict.projects.subtitle} />

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
              <ProjectCard project={project} lang={lang} dict={dict.projects} />
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
