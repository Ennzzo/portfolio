"use client";

import { useSyncExternalStore } from "react";

export type Theme = "dark" | "light";

const KEY = "portfolio:theme";
const EVENT = "theme:change";

// Aplicado antes do primeiro paint para não piscar o tema errado.
export const themeScript = `try{var t=localStorage.getItem("${KEY}");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.dataset.theme=t}catch(e){}`;

const read = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}

export function useTheme() {
  return useSyncExternalStore(subscribe, read, () => "dark" as Theme);
}

export function setTheme(theme: Theme) {
  const apply = () => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(KEY, theme);
    } catch {}
    window.dispatchEvent(new Event(EVENT));
  };
  if ("startViewTransition" in document && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.startViewTransition(apply);
  } else apply();
}

export const toggleTheme = () => setTheme(read() === "dark" ? "light" : "dark");
