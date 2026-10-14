import { ContactForm } from "../contact-form";
import { CopyEmail } from "../copy-email";
import { Reveal } from "../reveal";
import { socials } from "../social-links";
import { WhatsAppComposer } from "../whatsapp-composer";
import { Section, SectionHeading } from "./section-heading";
import { profile } from "@/data/profile";
import type { Dictionary } from "@/i18n/dictionaries";

export function ContactSection({ dict: all, index }: { dict: Dictionary; index: string }) {
  const dict = all.contact;
  const wa = all.whatsapp;
  return (
    <Section id="contact">
      <SectionHeading index={index} label={all.nav.contact} title={all.home.ctaTitle} subtitle={dict.subtitle} />

      <Reveal className="mb-16 max-w-2xl">
        <h3 data-buck-floor className="w-fit text-2xl font-medium">{wa.title}</h3>
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
    </Section>
  );
}
