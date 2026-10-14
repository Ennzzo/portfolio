import type { Localized } from "@/i18n/config";

export type Project = {
  slug: string;
  name: string;
  /** Data de início (AAAA-MM), usada para ordenar a linha do tempo. */
  date: string;
  description: Localized;
  tech: string[];
  /** "owner/repo" no GitHub — as estatísticas vêm da API do GitHub. */
  repo?: string;
  /** Projetos em equipe: integrantes e perfis no GitHub. */
  team?: { name: string; github?: string }[];
  url?: string;
  /** Imagem ou GIF em /public/projects. */
  image?: string;
};

export const projects: Project[] = [
  {
    slug: "condingevents",
    name: "Coding Events",
    date: "2025-06",
    description: {
      pt: "Plataforma de eventos de tecnologia: lista os próximos eventos e permite criar novos com título, cidade, descrição e visibilidade. Meu primeiro projeto com Laravel e arquitetura MVC.",
      en: "A tech events platform: lists upcoming events and lets you create new ones with title, city, description and visibility. My first Laravel project using MVC.",
    },
    tech: ["PHP", "Laravel", "Blade", "SQLite", "Eloquent ORM"],
    repo: "Ennzzo/condingevents",
    image: "/projects/coding-events.webp",
  },
  {
    slug: "qrcode",
    name: "QR Code Generator",
    date: "2025-07",
    description: {
      pt: "Gera QR Codes a partir de qualquer link, com cores personalizadas, logo no centro em tamanhos variados e download em PNG.",
      en: "Generates QR codes from any link, with custom colors, a center logo in several sizes and PNG download.",
    },
    tech: ["Next.js", "TypeScript", "React", "qrcode.react"],
    repo: "Ennzzo/qrcode",
    image: "/projects/qrcode.webp",
  },
  {
    slug: "acadus",
    name: "Acadus",
    date: "2026-06",
    description: {
      pt: "Aplicação web para organizar trabalhos acadêmicos em equipe: quadro Kanban, distribuição de tarefas, chat e painel de progresso. Trabalho Interdisciplinar da PUC Minas.",
      en: "Web app to organize academic team projects: Kanban board, task assignment, chat and a progress dashboard. PUC Minas interdisciplinary project.",
    },
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Java", "Spring Boot", "MySQL"],
    // Repositório da organização da PUC Minas (privado).
    team: [
      { name: "Enzo Bambirra Pinto", github: "Ennzzo" },
      { name: "Francisco Maycon Lima Castro", github: "franciscopuc" },
      { name: "Rafael Henrique de Oliveira Cruz", github: "rafaelhoc" },
      { name: "Sofia Ferreira Costa", github: "costa-sofia" },
      { name: "Thiago Junio Oliveira da Silva", github: "ThiagoOliveiraJ" },
    ],
    image: "/projects/acadus.webp",
  },
  {
    slug: "grade-puc-es",
    name: "Grade PUC ES",
    date: "2026-10",
    description: {
      pt: "Grade curricular interativa de Engenharia de Software da PUC Minas: marca disciplinas cursadas, mostra pré-requisitos e ementas. Usada por colegas do curso.",
      en: "Interactive curriculum map for PUC Minas Software Engineering: track completed courses, prerequisites and syllabi. Used by classmates.",
    },
    tech: ["TypeScript", "Vite", "GitHub Actions", "GitHub Pages"],
    repo: "Ennzzo/grade-puc-es",
    url: "https://ennzzo.github.io/grade-puc-es/",
    image: "/projects/grade-puc-es.webp",
  },
];

export const projectsByDate = [...projects].sort((a, b) =>
  a.date.localeCompare(b.date),
);
