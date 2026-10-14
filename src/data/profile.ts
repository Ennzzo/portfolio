import type { Localized } from "@/i18n/config";

// TODO(enzo): revisar todos os textos e preencher os contatos.
export const profile = {
  name: "Enzo Bambirra",
  shortName: "Enzo",
  monogram: "EB",
  githubUser: "Ennzzo",
  location: "Belo Horizonte, MG",
  timeZone: "America/Sao_Paulo",
  role: {
    pt: "Estudante de Engenharia de Software",
    en: "Software Engineering student",
  } satisfies Localized,
  headline: {
    pt: "Eu construo software que resolve problemas reais.",
    en: "I build software that solves real problems.",
  } satisfies Localized,
  bio: {
    pt: "Estudante de Engenharia de Software na PUC Minas, focado em desenvolvimento web full stack com TypeScript, React e Node.js.",
    en: "Software Engineering student at PUC Minas, focused on full-stack web development with TypeScript, React and Node.js.",
  } satisfies Localized,
  tags: ["Belo Horizonte", "Full Stack", "TypeScript"],
  about: {
    intro: {
      pt: [
        "Sou estudante de Engenharia de Software na PUC Minas e trabalho com desenvolvimento web.",
        "Gosto de transformar problemas do dia a dia em ferramentas simples e úteis.",
      ],
      en: [
        "I'm a Software Engineering student at PUC Minas working with web development.",
        "I enjoy turning everyday problems into simple, useful tools.",
      ],
    } satisfies Localized<string[]>,
    education: [
      {
        course: {
          pt: "Bacharelado em Engenharia de Software",
          en: "B.Sc. in Software Engineering",
        } satisfies Localized,
        institution: "PUC Minas",
        period: "2026 – 2029",
      },
    ],
    interests: {
      pt: ["Desenvolvimento web", "Automação", "Inteligência artificial aplicada"],
      en: ["Web development", "Automation", "Applied AI"],
    } satisfies Localized<string[]>,
    goals: {
      pt: "Conseguir um estágio em desenvolvimento e evoluir como engenheiro full stack.",
      en: "Land a software development internship and grow as a full-stack engineer.",
    } satisfies Localized,
    skills: [
      "TypeScript",
      "JavaScript",
      "React",
      "Next.js",
      "Node.js",
      "Java",
      "Python",
      "PHP / Laravel",
      "HTML & CSS",
      "Tailwind CSS",
      "Git & GitHub",
      "Docker",
    ],
  },
  contact: {
    email: "seu-email@exemplo.com",
    whatsapp: "5531900000000",
    linkedin: "https://www.linkedin.com/in/seu-perfil",
    github: "https://github.com/Ennzzo",
    instagram: "",
  },
};
