import { notFound } from "next/navigation";
import { AboutSection } from "@/components/sections/about";
import { ContactSection } from "@/components/sections/contact";
import { ExperienceSection } from "@/components/sections/experience";
import { GithubSection } from "@/components/sections/github";
import { HeroSection } from "@/components/sections/hero";
import { ProjectsSection } from "@/components/sections/projects";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <HeroSection lang={lang} dict={dict} />
      <AboutSection lang={lang} dict={dict} index="01" />
      <ProjectsSection lang={lang} dict={dict} index="02" />
      <GithubSection lang={lang} dict={dict} index="03" />
      <ExperienceSection lang={lang} dict={dict} index="04" />
      <ContactSection dict={dict} index="05" />
    </>
  );
}
