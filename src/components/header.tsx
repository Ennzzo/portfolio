"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { profile } from "@/data/profile";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { Close, Menu } from "./icons";

const routes = ["", "/about", "/projects", "/experience", "/contact"] as const;
const labelKey = {
  "": "home",
  "/about": "about",
  "/projects": "projects",
  "/experience": "experience",
  "/contact": "contact",
} as const;

export function Header({ lang, dict }: { lang: Locale; dict: Dictionary["nav"] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const current = pathname.replace(/^\/(pt|en)/, "") || "";
  const otherLang: Locale = lang === "pt" ? "en" : "pt";

  const links = routes.map((r) => {
    const active = r === "" ? current === "" : current.startsWith(r);
    return (
      <Link
        key={r}
        href={`/${lang}${r}`}
        aria-current={active ? "page" : undefined}
        onClick={() => setOpen(false)}
        className={`transition-colors hover:text-foreground ${active ? "text-foreground" : "text-muted"}`}
      >
        {dict[labelKey[r]]}
      </Link>
    );
  });

  return (
    <header className="sticky top-0 z-40 border-b border-transparent bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 sm:px-8">
        <Link href={`/${lang}`} className="font-mono text-lg font-semibold tracking-tight" aria-label={profile.name}>
          {profile.monogram}
          <sup className="text-accent">®</sup>
        </Link>

        <nav className="hidden items-center gap-7 text-sm md:flex" aria-label="Principal">
          {links}
          <LangSwitch href={`/${otherLang}${current}`} label={otherLang} />
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <LangSwitch href={`/${otherLang}${current}`} label={otherLang} />
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
