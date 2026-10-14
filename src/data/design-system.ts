import type { Localized } from "@/i18n/config";

export type ColorToken = { name: string; cssVar: string; dark: string; light: string; usage: Localized };

export const colors: ColorToken[] = [
  { name: "background", cssVar: "--background", dark: "#0a0a0b", light: "#f7f7f5", usage: { pt: "Fundo da página", en: "Page background" } },
  { name: "surface", cssVar: "--surface", dark: "#131315", light: "#ffffff", usage: { pt: "Cards e campos", en: "Cards and inputs" } },
  { name: "surface-hover", cssVar: "--surface-hover", dark: "#1a1a1d", light: "#efefec", usage: { pt: "Hover e skeletons", en: "Hover and skeletons" } },
  { name: "border", cssVar: "--border", dark: "#26262a", light: "#e2e2de", usage: { pt: "Bordas e divisórias", en: "Borders and dividers" } },
  { name: "foreground", cssVar: "--foreground", dark: "#ededef", light: "#111113", usage: { pt: "Texto principal", en: "Primary text" } },
  { name: "muted", cssVar: "--muted", dark: "#8b8b93", light: "#5f5f67", usage: { pt: "Texto secundário", en: "Secondary text" } },
  { name: "accent", cssVar: "--accent", dark: "#d4ff3f", light: "#4d7c0f", usage: { pt: "Destaque, botões e links", en: "Accent, buttons and links" } },
  { name: "mark", cssVar: "--mark", dark: "#d4ff3f", light: "#d9f99d", usage: { pt: "Marca-texto do título", en: "Title highlighter" } },
];

export const typeScale = [
  { name: "Display", className: "text-4xl sm:text-5xl font-medium tracking-tight", spec: "48–72px · 500 · -2%" },
  { name: "Heading", className: "text-3xl font-medium tracking-tight", spec: "30px · 500" },
  { name: "Body", className: "text-lg", spec: "18px · 400 · 1.6" },
  { name: "Small", className: "text-sm text-muted", spec: "14px · 400" },
  { name: "Label", className: "font-mono text-xs tracking-widest text-muted uppercase", spec: "Mono 12px · uppercase · +10%" },
];

export const radii = [
  { name: "md", value: "6px", className: "rounded-md" },
  { name: "xl", value: "12px", className: "rounded-xl" },
  { name: "2xl", value: "16px", className: "rounded-2xl" },
  { name: "3xl", value: "24px", className: "rounded-3xl" },
  { name: "full", value: "9999px", className: "rounded-full" },
];

export const motion = [
  { name: "Spring", curve: "cubic-bezier(.34, 1.56, .64, 1)", duration: "550ms", usage: { pt: "Letras do título, logo", en: "Title letters, logo" } },
  { name: "Ease out", curve: "cubic-bezier(.22, 1, .36, 1)", duration: "600–700ms", usage: { pt: "Entrada das seções", en: "Section reveals" } },
  { name: "Intro", curve: "cubic-bezier(.76, 0, .24, 1)", duration: "700ms", usage: { pt: "Saída da tela de saudação", en: "Greeting screen exit" } },
  { name: "Physics", curve: "g = 2600 px/s²", duration: "60 fps", usage: { pt: "Gravidade e arremesso do Buck", en: "Buck's gravity and throw" } },
];
