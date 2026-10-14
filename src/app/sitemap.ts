import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["pt", "en"].map((lang) => ({
    url: `${siteUrl}/${lang}`,
    changeFrequency: "monthly",
    priority: lang === "pt" ? 1 : 0.8,
    alternates: { languages: { "pt-BR": `${siteUrl}/pt`, en: `${siteUrl}/en` } },
  }));
}
