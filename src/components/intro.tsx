"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Dictionary } from "@/i18n/dictionaries";

const KEY = "portfolio:intro-seen";
const GREETINGS = ["Olá", "Hello", "Hola", "Bonjour", "Ciao", "こんにちは"];

// Roda antes do primeiro paint para esconder o splash via CSS se ele já foi visto na sessão.
const seenScript = `try{if(sessionStorage.getItem("${KEY}"))document.documentElement.dataset.introSeen="";sessionStorage.setItem("${KEY}","1")}catch(e){}`;

export function Intro({ dict }: { dict: Dictionary["intro"] }) {
  const [show, setShow] = useState(true);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!show) return;
    const last = i >= GREETINGS.length - 1;
    const t = setTimeout(
      () => (last ? setShow(false) : setI((n) => n + 1)),
      last ? 500 : i === 0 ? 700 : 220,
    );
    return () => clearTimeout(t);
  }, [show, i]);

  return (
    <>
      {/* text/plain no cliente evita o aviso do React sobre <script> renderizado. */}
      <script
        type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: seenScript }}
      />
      <AnimatePresence>
        {show && (
          <motion.button
            type="button"
            onClick={() => setShow(false)}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="intro fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center bg-background"
            aria-label={dict.skip}
          >
            <span className="flex items-center gap-3 text-4xl font-medium sm:text-6xl">
              <span className="size-2.5 rounded-full bg-accent" />
              {i === 0 ? dict.hello : GREETINGS[i]}
            </span>
            <span className="absolute bottom-10 font-mono text-xs text-muted">{dict.skip}</span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
