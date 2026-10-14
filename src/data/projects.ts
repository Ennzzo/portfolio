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
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "condingevents",
    name: "Coding Events",
    date: "2025-06",
    description: {
      pt: "Plataforma de eventos de tecnologia com cadastro, autenticação e inscrição em eventos.",
      en: "A tech events platform with sign-up, authentication and event registration.",
    },
    tech: ["PHP", "Laravel", "MySQL", "Blade"],
    repo: "Ennzzo/condingevents",
    featured: true,
  },
  {
    slug: "qrcode",
    name: "QR Code Generator",
    date: "2025-07",
    description: {
      pt: "Gerador de QR Code a partir de qualquer texto ou link, com download da imagem.",
      en: "Generates a QR code from any text or link, with image download.",
    },
    tech: ["Next.js", "TypeScript", "qrcode.react"],
    repo: "Ennzzo/qrcode",
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
    url: "https://plf-es-2026-1-ti2-1381100-acadus.vercel.app",
    featured: true,
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
    featured: true,
  },
];

export const projectsByDate = [...projects].sort((a, b) =>
  a.date.localeCompare(b.date),
);
