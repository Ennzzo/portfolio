import type { Localized } from "@/i18n/config";

export const profile = {
  name: "Enzo Bambirra",
  shortName: "Enzo",
  monogram: "EB",
  githubUser: "Ennzzo",
  location: "Belo Horizonte, MG",
  timeZone: "America/Sao_Paulo",
  role: {
    pt: "Desenvolvedor Full Stack",
    en: "Full Stack Developer",
  } satisfies Localized,
  headline: {
    pt: "Eu uso tecnologia para resolver problemas reais.",
    en: "I use technology to solve real problems.",
  } satisfies Localized,
  bio: {
    pt: "Desenvolvedor full stack na Abrasel e estudante de Engenharia de Software na PUC Minas. Técnico em Informática pelo CEFET-MG, com passagem pela seção de TI do Exército Brasileiro.",
    en: "Full stack developer at Abrasel and Software Engineering student at PUC Minas. IT technician from CEFET-MG, formerly on the Brazilian Army's IT team.",
  } satisfies Localized,
  tags: ["Belo Horizonte", "Full Stack", "React · Next.js", "TypeScript"],
  about: {
    intro: {
      pt: [
        "Salve! Sou o Enzo Bambirra, desenvolvedor full stack e estudante do 3º período de Engenharia de Software na PUC Minas, com formatura prevista para o fim de 2028. Antes disso, me formei técnico em Informática pelo CEFET-MG — hoje Universidade Federal de Ciência e Inovação de Minas Gerais (UFCIMG).",
        "Sou apaixonado por tecnologia: pela forma como ela resolve grandes problemas do mundo atual e se reinventa a todo momento. Já trabalhei com desenvolvimento, redes e suporte na seção de TI do Exército Brasileiro e hoje desenvolvo soluções full stack na Abrasel.",
        "Fora do código, sou viciado em jogos competitivos de FPS e treino toda semana corrida e HYROX — modalidade que mistura corrida com exercícios de força. E, em casa, divido a mesa com o Buck, meu supervisor de código.",
      ],
      en: [
        "Hey! I'm Enzo Bambirra, a full stack developer and 3rd-semester Software Engineering student at PUC Minas, graduating by the end of 2028. Before that, I earned an IT technician degree from CEFET-MG — now the Federal University of Science and Innovation of Minas Gerais (UFCIMG).",
        "I'm passionate about technology: how it solves some of today's biggest problems and keeps reinventing itself. I've worked on development, networking and support on the Brazilian Army's IT team, and today I build full stack solutions at Abrasel.",
        "Away from the keyboard, I'm hooked on competitive FPS games and train running and HYROX — a sport that mixes running with strength workouts — every week. At home, I share my desk with Buck, my code supervisor.",
      ],
    } satisfies Localized<string[]>,
    education: [
      {
        course: {
          pt: "Bacharelado em Engenharia de Software",
          en: "B.Sc. in Software Engineering",
        } satisfies Localized,
        institution: "PUC Minas",
        period: "2025 – 2028",
      },
      {
        course: {
          pt: "Técnico em Informática",
          en: "IT Technician",
        } satisfies Localized,
        institution: "CEFET-MG (UFCIMG)",
        period: "2021 – 2023",
      },
    ],
    interests: {
      pt: [
        "Desenvolvimento de software",
        "Segurança da informação",
        "Infraestrutura e redes",
        "Jogos competitivos de FPS",
        "Corrida e HYROX",
      ],
      en: [
        "Software development",
        "Information security",
        "Infrastructure and networking",
        "Competitive FPS games",
        "Running and HYROX",
      ],
    } satisfies Localized<string[]>,
    goals: {
      pt: "Estou finalizando meu estágio e busco minha próxima oportunidade em tecnologia — seja em desenvolvimento, segurança, infraestrutura ou redes.",
      en: "I'm wrapping up my internship and looking for my next opportunity in tech — whether in development, security, infrastructure or networking.",
    } satisfies Localized,
    skills: [
      "PHP",
      "Laravel",
      "TypeScript",
      "JavaScript",
      "React",
      "Next.js",
      "Java",
      "Spring Boot",
      "Python",
      "MySQL",
      "HTML & CSS",
      "Tailwind CSS",
      "Git & GitHub",
      "Docker",
      { pt: "Redes (switches e roteadores)", en: "Networking (switches & routers)" },
      { pt: "Manutenção de hardware", en: "Hardware maintenance" },
      { pt: "Metodologias ágeis", en: "Agile methodologies" },
    ] satisfies (string | Localized)[],
  },
  /** Contas usadas nos cards "Fora do código" (null = card sem dados ao vivo). */
  accounts: {
    valorant: { region: "br", name: "Sparkyzz", tag: "11111" },
    // TODO(enzo): usuário do Letterboxd (letterboxd.com/<usuario>).
    letterboxd: null as string | null,
  },
  contact: {
    email: "enzzobambirra@gmail.com",
    whatsapp: "5531984360707",
    linkedin: "https://www.linkedin.com/in/enzobambirra",
    github: "https://github.com/Ennzzo",
    instagram: "https://www.instagram.com/enzzofn__",
  },
};
