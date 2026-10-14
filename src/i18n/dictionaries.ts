import type { Locale } from "./config";

const pt = {
  nav: {
    home: "Início",
    about: "Sobre",
    projects: "Projetos",
    experience: "Experiências",
    contact: "Contato",
  },
  intro: { hello: "Olá", skip: "Clique para pular" },
  home: {
    eyebrow: "Aberto a novas oportunidades",
    selectedWork: "Trabalhos selecionados",
    allProjects: "Ver todos os projetos",
    ctaTitle: "Tem uma ideia que vale a pena construir?",
    ctaButton: "Vamos conversar",
  },
  about: {
    title: "Sobre mim",
    education: "Formação",
    skills: "Habilidades",
    interests: "Interesses",
    goals: "Objetivos",
    resume: "Baixar currículo",
  },
  projects: {
    title: "Projetos",
    subtitle: "Linha do tempo, do mais antigo ao mais recente.",
    repo: "Repositório",
    live: "Ver online",
    stars: "estrelas",
    updated: "Último push",
    private: "Repositório privado",
  },
  experience: {
    title: "Experiências",
    subtitle: "Trabalho, estágios, freelas, open source e eventos.",
    present: "Atual",
    types: {
      work: "Trabalho",
      internship: "Estágio",
      freelance: "Freela",
      opensource: "Open source",
      event: "Evento",
      academic: "Acadêmico",
    },
  },
  contact: {
    title: "Contato",
    subtitle: "Mande uma mensagem ou me chame por um dos canais abaixo.",
    copy: "Copiar e-mail",
    copied: "Copiado!",
    form: {
      name: "Nome",
      email: "E-mail",
      message: "Mensagem",
      send: "Enviar mensagem",
      sending: "Enviando…",
      success: "Mensagem enviada! Respondo em breve.",
      error: "Não foi possível enviar agora. Tente pelo e-mail direto.",
      errors: {
        name: "Informe seu nome (mín. 2 caracteres).",
        email: "Informe um e-mail válido.",
        message: "A mensagem precisa ter pelo menos 10 caracteres.",
      },
    },
  },
  footer: { built: "Feito com Next.js", localTime: "BH" },
  notFound: { title: "Página não encontrada", back: "Voltar ao início" },
};

export type Dictionary = typeof pt;

const en: Dictionary = {
  nav: {
    home: "Home",
    about: "About",
    projects: "Projects",
    experience: "Experience",
    contact: "Contact",
  },
  intro: { hello: "Hello", skip: "Click to skip" },
  home: {
    eyebrow: "Open to new opportunities",
    selectedWork: "Selected work",
    allProjects: "See all projects",
    ctaTitle: "Have an idea worth building?",
    ctaButton: "Let's talk",
  },
  about: {
    title: "About me",
    education: "Education",
    skills: "Skills",
    interests: "Interests",
    goals: "Goals",
    resume: "Download résumé",
  },
  projects: {
    title: "Projects",
    subtitle: "Timeline, from oldest to most recent.",
    repo: "Repository",
    live: "Live site",
    stars: "stars",
    updated: "Last push",
    private: "Private repository",
  },
  experience: {
    title: "Experience",
    subtitle: "Work, internships, freelance, open source and events.",
    present: "Present",
    types: {
      work: "Work",
      internship: "Internship",
      freelance: "Freelance",
      opensource: "Open source",
      event: "Event",
      academic: "Academic",
    },
  },
  contact: {
    title: "Contact",
    subtitle: "Send me a message or reach me through any channel below.",
    copy: "Copy e-mail",
    copied: "Copied!",
    form: {
      name: "Name",
      email: "E-mail",
      message: "Message",
      send: "Send message",
      sending: "Sending…",
      success: "Message sent! I'll get back to you soon.",
      error: "Couldn't send right now. Please use the e-mail link instead.",
      errors: {
        name: "Enter your name (min. 2 characters).",
        email: "Enter a valid e-mail.",
        message: "The message must be at least 10 characters.",
      },
    },
  },
  footer: { built: "Built with Next.js", localTime: "BH" },
  notFound: { title: "Page not found", back: "Back home" },
};

const dictionaries: Record<Locale, Dictionary> = { pt, en };

export const getDictionary = (locale: Locale) => dictionaries[locale];
