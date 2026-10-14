import type { Localized } from "@/i18n/config";

export type ExperienceType =
  | "work"
  | "internship"
  | "freelance"
  | "opensource"
  | "event"
  | "academic";

export type Experience = {
  organization: string;
  role: Localized;
  type: ExperienceType;
  /** AAAA-MM */
  start: string;
  /** AAAA-MM; ausente = atual */
  end?: string;
  description: Localized;
  url?: string;
};

// TODO(enzo): preencher com as experiências reais.
export const experiences: Experience[] = [
  {
    organization: "Empresa atual",
    role: { pt: "Desenvolvedor", en: "Developer" },
    type: "work",
    start: "2025-01",
    description: {
      pt: "Descreva aqui o que você faz, as tecnologias e um resultado concreto.",
      en: "Describe what you do, the technologies and one concrete result.",
    },
  },
  {
    organization: "PUC Minas",
    role: {
      pt: "Trabalho Interdisciplinar — Acadus",
      en: "Interdisciplinary project — Acadus",
    },
    type: "academic",
    start: "2026-02",
    end: "2026-06",
    description: {
      pt: "Desenvolvimento em equipe de uma aplicação web, do levantamento de requisitos ao deploy.",
      en: "Team development of a web application, from requirements to deployment.",
    },
  },
];

export const experiencesByDate = [...experiences].sort((a, b) =>
  (b.end ?? "9999").localeCompare(a.end ?? "9999"),
);
