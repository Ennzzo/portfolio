import type { Localized } from "@/i18n/config";

export const profile = {
  name: "Enzo Bambirra",
  shortName: "Enzo",
  githubUser: "Ennzzo",
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
        "Sou Enzo Bambirra, desenvolvedor full stack e estudante do 3º período de Engenharia de Software na PUC Minas, com conclusão prevista para o final de 2028. Sou técnico em Informática pelo CEFET-MG, atual Universidade Federal de Ciência e Inovação de Minas Gerais (UFCIMG).",
        "Atualmente desenvolvo soluções web na Abrasel com React, Next.js e TypeScript, participando de todo o ciclo de entrega — da definição de requisitos com o time à implementação —, com uso de metodologias ágeis. Anteriormente, atuei com otimização de SEO na Myth e na Seção de Tecnologia da Informação do Exército Brasileiro, com desenvolvimento em PHP/Laravel, infraestrutura de redes e suporte técnico.",
        "Tenho interesse em desenvolvimento de software, segurança da informação e infraestrutura, e busco oportunidades para aplicar e aprofundar esses conhecimentos em projetos que gerem impacto real.",
      ],
      en: [
        "I'm Enzo Bambirra, a full stack developer and 3rd-semester Software Engineering student at PUC Minas, expected to graduate at the end of 2028. I hold an IT technician degree from CEFET-MG, now the Federal University of Science and Innovation of Minas Gerais (UFCIMG).",
        "I currently build web solutions at Abrasel with React, Next.js and TypeScript, taking part in the whole delivery cycle — from defining requirements with the team to implementation — using agile methodologies. Previously, I worked on SEO optimization at Myth and on the Brazilian Army's Information Technology Section, with PHP/Laravel development, network infrastructure and technical support.",
        "I'm interested in software development, information security and infrastructure, and I'm looking for opportunities to apply and deepen this knowledge in projects with real impact.",
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
        certificate: "/docs/certificado-tecnico-informatica-cefet-mg.webp",
      },
    ],
    interests: {
      pt: [
        "Desenvolvimento de software",
        "Segurança da informação",
        "Infraestrutura e redes",
        "Otimização para mecanismos de busca (SEO)",
      ],
      en: [
        "Software development",
        "Information security",
        "Infrastructure and networking",
        "Search engine optimization (SEO)",
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
      "SEO",
      { pt: "Redes (switches e roteadores)", en: "Networking (switches & routers)" },
      { pt: "Manutenção de hardware", en: "Hardware maintenance" },
      { pt: "Metodologias ágeis", en: "Agile methodologies" },
    ] satisfies (string | Localized)[],
  },
  contact: {
    email: "enzzobambirra@gmail.com",
    whatsapp: "5531984360707",
    linkedin: "https://www.linkedin.com/in/enzobambirra",
    github: "https://github.com/Ennzzo",
    instagram: "https://www.instagram.com/enzzofn__",
  },
};
