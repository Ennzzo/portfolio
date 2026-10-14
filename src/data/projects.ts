import type { Localized } from "@/i18n/config";

export type Project = {
  slug: string;
  name: string;
  /** Data de início (AAAA-MM), usada para ordenar a linha do tempo. */
  date: string;
  description: Localized;
  tech: string[];
  /** "owner/repo" no GitHub — as estatísticas vêm da API do GitHub. */
  repo: string;
  url?: string;
  /** Imagem ou GIF em /public/projects. */
  image?: string;
  featured?: boolean;
};

// TODO(enzo): revisar descrições, escolher os destaques e adicionar prints/GIFs.
export const projects: Project[] = [
  {
    slug: "compasso",
    name: "Compasso",
    date: "2021-09",
    description: {
      pt: "Meu primeiro site: uma página sobre danças, feita para aprender HTML e CSS.",
      en: "My first website: a page about dance styles, built to learn HTML and CSS.",
    },
    tech: ["HTML", "CSS"],
    repo: "Ennzzo/Compasso-",
  },
  {
    slug: "world-dance",
    name: "World Dance",
    date: "2022-05",
    description: {
      pt: "Versão reformulada do Compasso, com novo layout e mais conteúdo.",
      en: "A redesigned version of Compasso with a new layout and more content.",
    },
    tech: ["HTML", "CSS", "JavaScript"],
    repo: "Ennzzo/World-Dance",
  },
  {
    slug: "site-noticias",
    name: "Site de Notícias",
    date: "2023-06",
    description: {
      pt: "Mini-projeto de portal de notícias com layout em grid.",
      en: "A small news portal project with a grid layout.",
    },
    tech: ["HTML", "CSS"],
    repo: "Ennzzo/Mini-Projeto-Site-Noticias",
  },
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
    tech: ["TypeScript"],
    repo: "Ennzzo/qrcode",
  },
  {
    slug: "acadus",
    name: "Acadus",
    date: "2026-06",
    description: {
      pt: "Projeto de Trabalho Interdisciplinar da PUC Minas, desenvolvido em equipe.",
      en: "PUC Minas interdisciplinary team project.",
    },
    tech: ["TypeScript", "React"],
    repo: "Ennzzo/plf-es-2026-1-ti2-1381100-Acadus",
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
