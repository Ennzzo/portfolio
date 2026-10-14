import type { Localized } from "@/i18n/config";

export type ExperienceType =
  | "work"
  | "internship"
  | "freelance"
  | "opensource"
  | "event"
  | "academic"
  | "military";

export type Experience = {
  organization: string;
  role: Localized;
  type: ExperienceType;
  /** AAAA-MM */
  start: string;
  /** AAAA-MM; ausente = atual */
  end?: string;
  description: Localized;
  highlights?: Localized<string[]>;
  url?: string;
  /** Documento comprobatório em /public/docs. */
  attachment?: { label: Localized; href: string };
};

// TODO(enzo): confirmar as datas de início/fim.
export const experiences: Experience[] = [
  {
    organization: "Abrasel — Associação Brasileira de Bares e Restaurantes",
    role: { pt: "Desenvolvedor Full Stack", en: "Full Stack Developer" },
    type: "internship",
    start: "2025-03",
    url: "https://abrasel.com.br",
    description: {
      pt: "Desenvolvo soluções tecnológicas de ponta a ponta para a associação, do back-end à interface.",
      en: "I build end-to-end technology solutions for the association, from back end to user interface.",
    },
    highlights: {
      pt: [
        "Desenvolvimento e manutenção de sistemas web full stack",
        "Participação nas reuniões de definição e planejamento do time",
        "Aplicação de metodologias ágeis no dia a dia",
      ],
      en: [
        "Building and maintaining full stack web systems",
        "Taking part in the team's definition and planning meetings",
        "Applying agile methodologies day to day",
      ],
    },
  },
  {
    organization: "Exército Brasileiro — CPOR/CMBH",
    role: { pt: "Soldado — Seção de Tecnologia da Informação", en: "Private — IT Section" },
    type: "military",
    start: "2024-03",
    end: "2025-02",
    description: {
      pt: "Atuei na seção de TI do Centro de Preparação de Oficiais da Reserva / Colégio Militar de Belo Horizonte, além das atribuições militares de defesa da pátria e proteção do aquartelamento.",
      en: "Served on the IT section of the Reserve Officers' Training Center / Military School of Belo Horizonte, alongside military duties of national defense and barracks security.",
    },
    highlights: {
      pt: [
        "Desenvolvimento em PHP com Laravel",
        "Manutenção de redes: racks, switches e roteadores",
        "Manutenção e conserto de computadores",
        "Instalação de câmeras de segurança",
        "Suporte às videoconferências institucionais de 2024",
      ],
      en: [
        "PHP development with Laravel",
        "Network maintenance: racks, switches and routers",
        "Computer maintenance and repair",
        "Security camera installation",
        "Support for the institution's 2024 video conferences",
      ],
    },
    attachment: {
      label: { pt: "Ver referência elogiosa", en: "View letter of commendation" },
      href: "/docs/referencia-elogiosa-exercito.pdf",
    },
  },
];

export const experiencesByDate = [...experiences].sort((a, b) =>
  (b.end ?? "9999").localeCompare(a.end ?? "9999"),
);
