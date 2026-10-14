import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/contact-form";
import { CopyEmail } from "@/components/copy-email";
import { PageHeading } from "@/components/page-heading";
import { WhatsAppComposer } from "@/components/whatsapp-composer";
import { Reveal } from "@/components/reveal";
import { socials } from "@/components/social-links";
import { profile } from "@/data/profile";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  return hasLocale(lang) ? { title: getDictionary(lang).contact.title } : {};
}

export default async function Contact({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang).contact;
  const wa = getDictionary(lang).whatsapp;

  return (
    <>
      <PageHeading title={dict.title} subtitle={dict.subtitle} />

      <Reveal className="mb-16 max-w-2xl">
        <h2 className="text-2xl font-medium">{wa.title}</h2>
        <p className="mt-2 mb-5 text-muted">{wa.subtitle}</p>
        <WhatsAppComposer dict={wa} />
      </Reveal>

      <Reveal>
        <CopyEmail email={profile.contact.email} copyLabel={dict.copy} copiedLabel={dict.copied} />
      </Reveal>

      <div className="mt-16 grid gap-16 md:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <ul className="flex flex-col gap-3">
            {socials.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-xl border border-border bg-surface px-5 py-4 transition-colors hover:border-accent"
                >
                  <Icon className="text-muted transition-colors group-hover:text-accent" />
                  <span>{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1}>
          <ContactForm dict={dict.form} />
        </Reveal>
      </div>
    </>
  );
}
