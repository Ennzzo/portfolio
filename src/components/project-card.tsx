import Image from "next/image";
import { Suspense } from "react";
import type { Project } from "@/data/projects";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatMonth } from "@/lib/format";
import { ArrowUpRight, GitHub } from "./icons";
import { RepoStats, RepoStatsFallback } from "./repo-stats";

type Props = { project: Project; lang: Locale; dict: Dictionary["projects"] };

export function ProjectCard({ project, lang, dict }: Props) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:bg-surface-hover">
      {project.image && (
        <div className="relative aspect-video overflow-hidden border-b border-border">
          <Image
            src={project.image}
            alt={project.name}
            fill
            sizes="(min-width: 768px) 640px, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            // GIF/WebP animados vão sem otimização para manter a animação.
            unoptimized={/\.(gif|webp)$/.test(project.image)}
          />
        </div>
      )}
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-muted">{formatMonth(project.date, lang)}</p>
            <h3 className="mt-1 text-xl font-medium">{project.name}</h3>
          </div>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${dict.live}: ${project.name}`}
              className="rounded-full border border-border p-2 text-muted transition-all group-hover:border-accent group-hover:text-accent"
            >
              <ArrowUpRight width={16} height={16} />
            </a>
          )}
        </div>
        <p className="text-muted">{project.description[lang]}</p>
        <ul className="flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <li key={t} className="rounded-full border border-border px-2.5 py-0.5 font-mono text-xs text-muted">
              {t}
            </li>
          ))}
        </ul>
        {project.team && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs text-muted">{dict.team}</span>
            <ul className="flex -space-x-2">
              {project.team.map((m) => (
                <li key={m.name}>
                  <a
                    href={m.github ? `https://github.com/${m.github}` : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={m.name}
                    aria-label={m.name}
                    className="block rounded-full ring-2 ring-surface transition-transform hover:z-10 hover:scale-110"
                  >
                    <Image
                      src={`https://avatars.githubusercontent.com/${m.github}?s=64`}
                      alt=""
                      width={28}
                      height={28}
                      className="rounded-full bg-surface-hover"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          {project.repo ? (
            <>
              <a
                href={`https://github.com/${project.repo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
              >
                <GitHub width={16} height={16} /> {dict.repo}
              </a>
              <Suspense fallback={<RepoStatsFallback />}>
                <RepoStats repo={project.repo} lang={lang} dict={dict} />
              </Suspense>
            </>
          ) : (
            <span className="inline-flex items-center gap-2 font-mono text-xs text-muted">
              <GitHub width={16} height={16} /> {dict.private}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
