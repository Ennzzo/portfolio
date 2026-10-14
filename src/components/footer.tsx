import { profile } from "@/data/profile";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { LiveClock } from "./live-clock";
import { SocialLinks } from "./social-links";

export function Footer({ lang, dict }: { lang: Locale; dict: Dictionary["footer"] }) {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <SocialLinks />
        <div className="flex items-center gap-4 font-mono text-xs">
          <span>
            © {profile.name} · {dict.built}
          </span>
          <LiveClock lang={lang} label={dict.localTime} timeZone={profile.timeZone} />
        </div>
      </div>
    </footer>
  );
}
