"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

type Mode = "default" | "hover" | "hidden";

/**
 * Cursor próprio: um ponto que segue o mouse e um anel que vem atrás com mola.
 * Só liga em dispositivos com mouse e sem preferência por menos movimento.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("default");
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.6 });

  useEffect(() => {
    const query = matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    const update = () => {
      setEnabled(query.matches);
      document.documentElement.toggleAttribute("data-custom-cursor", query.matches);
    };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as Element | null;
      // Áreas com cursor próprio (ex.: mira do jogo) escondem o nosso.
      if (el?.closest("[data-cursor='none']")) setMode("hidden");
      else if (el?.closest("a, button, [role='button'], input, textarea, select, label, [data-cursor='hover']")) setMode("hover");
      else setMode("default");
    };
    const leave = () => setMode("hidden");
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <motion.div
        className="absolute top-0 left-0 rounded-full border border-foreground/60"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: mode === "hover" ? 52 : 34,
          height: mode === "hover" ? 52 : 34,
          opacity: mode === "hidden" ? 0 : 1,
          backgroundColor: mode === "hover" ? "rgba(212,255,63,0.12)" : "rgba(0,0,0,0)",
          borderColor: mode === "hover" ? "rgba(212,255,63,0.9)" : "rgba(237,237,239,0.5)",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
      <motion.div
        className="absolute top-0 left-0 size-1.5 rounded-full bg-accent"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: mode === "hidden" ? 0 : 1, scale: mode === "hover" ? 0 : 1 }}
      />
    </div>
  );
}
