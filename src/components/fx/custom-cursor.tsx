"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

type Mode = "default" | "hover" | "play" | "hidden";

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
      if (el?.closest("[data-cursor='none']")) setMode("hidden");
      else if (el?.closest("[data-cursor='play']")) setMode("play");
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
        className={`absolute top-0 left-0 size-[34px] rounded-full border transition-colors duration-200 ${
          mode === "hover" ? "border-accent bg-accent/10" : mode === "play" ? "border-accent" : "border-foreground/50"
        }`}
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          scale: mode === "hover" ? 52 / 34 : mode === "play" ? 40 / 34 : 1,
          opacity: mode === "hidden" ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
      <motion.div
        className="absolute top-0 left-0 size-1.5 rounded-full bg-accent"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: mode === "hidden" ? 0 : 1, scale: mode === "hover" || mode === "play" ? 0 : 1 }}
      />
      <motion.span
        className="absolute top-0 left-0 leading-none"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: mode === "play" ? 1 : 0, scale: mode === "play" ? 1 : 0.4, rotate: mode === "play" ? 180 : 0 }}
      >
        <svg width="18" height="18" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="9" fill="#d4ff3f" />
          <path d="M3 4.5c3 2.5 3 8.5 0 11M17 4.5c-3 2.5-3 8.5 0 11" stroke="#fff" strokeWidth="1.4" fill="none" />
        </svg>
      </motion.span>
    </div>
  );
}
