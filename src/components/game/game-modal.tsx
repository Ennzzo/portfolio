"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Dictionary } from "@/i18n/dictionaries";
import { useEvent } from "@/lib/events";
import { Close } from "../icons";
import { AimTrainer } from "./aim-trainer";

export function GameModal({ dict }: { dict: Dictionary["game"] }) {
  const [open, setOpen] = useState(false);
  useEvent("game:open", useCallback(() => setOpen(true), []));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-6"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={dict.title}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="relative flex h-[min(720px,92dvh)] w-full max-w-4xl overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={dict.close}
              className="absolute top-3 right-3 z-10 rounded-full p-2 text-muted hover:text-foreground"
            >
              <Close />
            </button>
            <AimTrainer dict={dict} onClose={() => setOpen(false)} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
