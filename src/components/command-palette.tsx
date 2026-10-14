"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { profile } from "@/data/profile";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { emit, useEvent } from "@/lib/events";
import { toggleTheme } from "@/lib/theme";
import { ArrowUpRight, Copy, GitHub, WhatsApp } from "./icons";

type Item = { id: string; group: "navigation" | "actions"; label: string; icon?: ReactNode; run: () => void };

export function CommandPalette({ lang, nav, dict }: { lang: Locale; nav: Dictionary["nav"]; dict: Dictionary["palette"] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState("");
  const router = useRouter();
  const listRef = useRef<HTMLUListElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  useEvent("palette:open", useCallback(() => setOpen(true), []));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const items = useMemo<Item[]>(() => {
    const other: Locale = lang === "pt" ? "en" : "pt";
    const go = (hash: string) => () => router.push(`/${lang}${hash}`);
    return [
      { id: "home", group: "navigation", label: nav.home, run: go("") },
      { id: "about", group: "navigation", label: nav.about, run: go("#about") },
      { id: "projects", group: "navigation", label: nav.projects, run: go("#projects") },
      { id: "github", group: "navigation", label: "GitHub", run: go("#github") },
      { id: "experience", group: "navigation", label: nav.experience, run: go("#experience") },
      { id: "contact", group: "navigation", label: nav.contact, run: go("#contact") },
      {
        id: "lang",
        group: "actions",
        label: dict.switchLang,
        icon: <span className="font-mono text-[11px] uppercase">{other}</span>,
        run: () => router.push(`/${other}${window.location.hash}`),
      },
      {
        id: "copy",
        group: "actions",
        label: dict.copyEmail,
        icon: <Copy width={16} height={16} />,
        run: () => {
          navigator.clipboard?.writeText(profile.contact.email).catch(() => {});
          setToast(dict.copied);
          setTimeout(() => setToast(""), 1800);
        },
      },
      {
        id: "whatsapp",
        group: "actions",
        label: dict.whatsapp,
        icon: <WhatsApp width={16} height={16} />,
        run: () => window.open(`https://wa.me/${profile.contact.whatsapp}`, "_blank", "noopener,noreferrer"),
      },
      { id: "theme", group: "actions", label: dict.theme, icon: <span>◐</span>, run: toggleTheme },
      { id: "play", group: "actions", label: dict.play, icon: <span>🎯</span>, run: () => emit("game:open") },
      { id: "zoomies", group: "actions", label: dict.zoomies, icon: <span>🐕</span>, run: () => emit("buck:zoomies") },
      {
        id: "source",
        group: "actions",
        label: dict.source,
        icon: <GitHub width={16} height={16} />,
        run: () => window.open("https://github.com/Ennzzo/portfolio", "_blank", "noopener,noreferrer"),
      },
    ];
  }, [dict, lang, nav, router]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
    if (!q) return items;
    return items.filter((i) => i.label.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").includes(q));
  }, [items, query]);

  const runItem = (item: Item) => {
    close();
    item.run();
  };

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  let index = -1;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[70] flex items-start justify-center bg-black/60 px-4 pt-[15vh] backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && close()}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={dict.open}
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
            >
              <input
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActive((a) => Math.min(filtered.length - 1, a + 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActive((a) => Math.max(0, a - 1));
                  } else if (e.key === "Enter" && filtered[active]) {
                    e.preventDefault();
                    runItem(filtered[active]);
                  } else if (e.key === "Escape") close();
                }}
                placeholder={dict.placeholder}
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-list"
                aria-activedescendant={filtered[active] ? `palette-${filtered[active].id}` : undefined}
                className="w-full border-b border-border bg-transparent px-5 py-4 text-lg outline-none placeholder:text-muted focus-visible:outline-none"
              />
              <ul ref={listRef} id="palette-list" role="listbox" className="max-h-80 overflow-y-auto p-2">
                {filtered.length === 0 && <li className="px-3 py-6 text-center text-muted">{dict.empty}</li>}
                {(["navigation", "actions"] as const).map((group) => {
                  const groupItems = filtered.filter((i) => i.group === group);
                  if (groupItems.length === 0) return null;
                  return (
                    <li key={group} role="presentation">
                      <p className="px-3 pt-3 pb-1 font-mono text-[11px] tracking-widest text-muted uppercase">{dict[group]}</p>
                      <ul role="presentation">
                        {groupItems.map((item) => {
                          index++;
                          const i = index;
                          return (
                            <li
                              key={item.id}
                              id={`palette-${item.id}`}
                              role="option"
                              aria-selected={i === active}
                              data-index={i}
                              onMouseMove={() => setActive(i)}
                              onClick={() => runItem(item)}
                              className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 ${
                                i === active ? "bg-surface-hover text-foreground" : "text-muted"
                              }`}
                            >
                              <span className="flex size-5 items-center justify-center text-muted">
                                {item.icon ?? <ArrowUpRight width={14} height={14} />}
                              </span>
                              {item.label}
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  );
                })}
              </ul>
              <p className="border-t border-border px-5 py-2.5 font-mono text-[11px] text-muted">{dict.hint}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.p
            role="status"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
          >
            {toast}
          </motion.p>
        )}
      </AnimatePresence>
    </>
  );
}
