"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useEvent } from "@/lib/events";
import { BuckSvg } from "./buck-svg";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

/** Easter egg: o Konami code (ou o menu Ctrl+K) solta o Buck correndo pela tela. */
export function BuckZoomies({ label }: { label: string }) {
  const [runs, setRuns] = useState<{ id: number; width: number }[]>([]);

  const release = useCallback(() => {
    const id = Date.now();
    setRuns((r) => [...r, { id, width: window.innerWidth }]);
    setTimeout(() => setRuns((r) => r.filter((x) => x.id !== id)), 4200);
  }, []);

  useEvent("buck:zoomies", release);

  useEffect(() => {
    let pos = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      pos = key === KONAMI[pos] ? pos + 1 : key === KONAMI[0] ? 1 : 0;
      if (pos === KONAMI.length) {
        pos = 0;
        release();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [release]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 z-[65] h-40 overflow-hidden">
      <AnimatePresence>
        {runs.map(({ id, width }) => (
          <motion.div
            key={id}
            className="absolute bottom-2 left-0 w-44"
            initial={{ x: -200 }}
            animate={{ x: width + 40, y: [0, -26, 0, -18, 0, -10, 0] }}
            exit={{ opacity: 0 }}
            transition={{ x: { duration: 3.2, ease: "easeInOut" }, y: { duration: 3.2, times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 1] } }}
          >
            <BuckSvg pose="run" className="w-full" />
          </motion.div>
        ))}
      </AnimatePresence>
      <AnimatePresence>
        {runs.length > 0 && (
          <motion.p
            role="status"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-2 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1.5 font-mono text-xs font-semibold text-accent-foreground"
          >
            {label}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
