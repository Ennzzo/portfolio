import { profile } from "@/data/profile";
import { GitHub, Instagram, LinkedIn, Mail, WhatsApp } from "./icons";

const { contact } = profile;

export const socials = [
  { label: "E-mail", href: `mailto:${contact.email}`, Icon: Mail, value: contact.email },
  { label: "WhatsApp", href: `https://wa.me/${contact.whatsapp}`, Icon: WhatsApp, value: contact.whatsapp },
  { label: "LinkedIn", href: contact.linkedin, Icon: LinkedIn, value: contact.linkedin },
  { label: "GitHub", href: contact.github, Icon: GitHub, value: contact.github },
  { label: "Instagram", href: contact.instagram, Icon: Instagram, value: contact.instagram },
].filter((s) => s.value);

export function SocialLinks({ size = 18 }: { size?: number }) {
  return (
    <ul className="flex items-center gap-4">
      {socials.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target={href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="text-muted transition-colors hover:text-accent"
          >
            <Icon width={size} height={size} />
          </a>
        </li>
      ))}
    </ul>
  );
}
