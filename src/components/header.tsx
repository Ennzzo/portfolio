"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { profile } from "@/data/profile";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { emit } from "@/lib/events";
import { Close, Menu } from "./icons";
import { LogoMark } from "./logo-mark";

const sections = ["home", "about", "projects", "github", "experience", "contact"] as const;
type SectionId = (typeof sections)[number];

/** Seção visível agora (a que cruza a faixa de 35% do topo da tela). */
function useActiveSection() {
  const [active, setActive] = useState<SectionId>("home");
  useEffect(() => {
    const els = sections.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id as SectionId);
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

export function Header({ lang, dict, paletteLabel }: { lang: Locale; dict: Dictionary["nav"]; paletteLabel: string }) {
  const [open, setOpen] = useState(false);
  const active = useActiveSection();
  const otherLang: Locale = lang === "pt" ? "en" : "pt";
  const hash = active === "home" ? "" : `#${active}`;

  const links = sections.map((id) => (
    <Link
      key={id}
      href={id === "home" ? `/${lang}` : `/${lang}#${id}`}
      aria-current={active === id ? "location" : undefined}
      onClick={() => setOpen(false)}
      className={`transition-colors hover:text-foreground ${active === id ? "text-foreground" : "text-muted"}`}
    >
      {id === "github" ? "GitHub" : dict[id]}
    </Link>
  ));

  return (
    <header className="sticky top-0 z-40 border-b border-transparent bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 sm:px-8">
        <Link href={`/${lang}`} className="group inline-flex items-center gap-2 font-mono text-lg font-semibold tracking-tight" aria-label={profile.name}>
          <LogoMark className="size-7" />
          Enzzo
        </Link>

        <nav className="hidden items-center gap-7 text-sm md:flex" aria-label="Principal">
          {links}
          <LangSwitch href={`/${otherLang}${hash}`} label={otherLang} />
          <button
            type="button"
            onClick={() => emit("palette:open")}
            aria-label={paletteLabel}
            title={paletteLabel}
            className="rounded-md border border-border px-2 py-1 font-mono text-[11px] text-muted transition-colors hover:border-foreground hover:text-foreground"
          >
            Ctrl K
          </button>
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <LangSwitch href={`/${otherLang}${hash}`} label={otherLang} />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Menu"
            className="rounded-md p-2 text-foreground"
          >
            {open ? <Close /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-border bg-background md:hidden"
            aria-label="Principal"
          >
            <div className="flex flex-col gap-5 px-5 py-6 text-2xl">{links}</div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function LangSwitch({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      hrefLang={label}
      className="rounded-full border border-border px-3 py-1 font-mono text-xs uppercase text-muted transition-colors hover:border-foreground hover:text-foreground"
    >
      {label}
    </Link>
  );
}
