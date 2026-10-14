"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, type AnimationPlaybackControls } from "motion/react";
import type { Dictionary } from "@/i18n/dictionaries";
import { emit } from "@/lib/events";
import { BuckSvg, type BuckPose } from "./buck-svg";

const WIDTH = 132;
const SPEED = 70; // px/s

/** Buck passeando pelo topo do hero. Mouse em cima: ele para e fala. Clique: abre o jogo. */
export function BuckWalker({ dict }: { dict: Dictionary["buck"] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [pose, setPose] = useState<BuckPose>("idle");
  const [hovered, setHovered] = useState(false);
  const [line, setLine] = useState(0);
  const controls = useRef<AnimationPlaybackControls | null>(null);

  const stroll = useCallback(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const step = () => {
      const track = trackRef.current;
      if (!track || cancelled) return;
      const max = Math.max(0, track.clientWidth - WIDTH);
      const from = x.get();
      // Próximo destino: um ponto aleatório a pelo menos 120px de distância.
      let to = Math.random() * max;
      if (Math.abs(to - from) < 120) to = from < max / 2 ? Math.min(max, from + 160) : Math.max(0, from - 160);

      setDir(to >= from ? 1 : -1);
      setPose("walk");
      controls.current = animate(x, to, { duration: Math.abs(to - from) / SPEED, ease: "linear" });
      controls.current.finished.then(() => {
        if (cancelled) return;
        setPose("idle");
        timer = setTimeout(step, 1500 + Math.random() * 3000);
      });
    };

    timer = setTimeout(step, 1200);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      controls.current?.stop();
    };
  }, [x]);

  useEffect(() => {
    if (hovered || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    return stroll();
  }, [hovered, stroll]);

  const bubble = dict.lines[line % dict.lines.length];

  return (
    <div ref={trackRef} className="relative h-24 w-full">
      <motion.div className="absolute bottom-0 left-0" style={{ x, width: WIDTH }}>
        <AnimatePresence>
          {hovered && (
            <motion.p
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.97 }}
              className="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 w-max max-w-64 -translate-x-1/2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm shadow-xl"
            >
              {bubble.pre} <span className="text-accent">{bubble.hi}</span>
            </motion.p>
          )}
        </AnimatePresence>
        <button
          type="button"
          aria-label={dict.aria}
          title={dict.aria}
          onClick={() => emit("game:open")}
          data-cursor="play"
          onPointerEnter={() => {
            setHovered(true);
            setPose("happy");
          }}
          onPointerLeave={() => {
            setHovered(false);
            setPose("idle");
            setLine((l) => l + 1);
          }}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          className="block w-full rounded-lg"
          style={{ transform: `scaleX(${dir})` }}
        >
          <BuckSvg pose={pose} className="w-full" />
        </button>
      </motion.div>
    </div>
  );
}
