"use client";

import { useSyncExternalStore } from "react";
import type { Locale } from "@/i18n/config";

const subscribe = (tick: () => void) => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
};
const getSecond = () => Math.floor(Date.now() / 1000);
// No servidor não há relógio do visitante: mostra placeholder.
const getServerSecond = () => null;

export function LiveClock({ lang, label, timeZone }: { lang: Locale; label: string; timeZone: string }) {
  const second = useSyncExternalStore(subscribe, getSecond, getServerSecond);

  const time =
    second === null
      ? "--:--:--"
      : new Intl.DateTimeFormat(lang === "pt" ? "pt-BR" : "en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone,
        }).format(second * 1000);

  return (
    <span className="inline-flex items-center gap-2 tabular-nums">
      <span className="size-1.5 animate-pulse rounded-full bg-accent" aria-hidden />
      {label} {time}
    </span>
  );
}
