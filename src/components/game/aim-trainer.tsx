"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Dictionary } from "@/i18n/dictionaries";
import { BuckSvg } from "../buck/buck-svg";
import { accuracy, avgReaction, points, rankFor, type Stats } from "./scoring";

const DURATION = 30_000;
const BEST_KEY = "portfolio:aim-best";
const MAX_TARGETS = 3;

type Target = { id: number; x: number; y: number; born: number; life: number };
type Phase = "intro" | "playing" | "result";

const emptyStats = (): Stats => ({ hits: 0, misses: 0, expired: 0, reactions: [] });

function readBest() {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

/** Aim trainer: bolinhas aparecem e encolhem; acerte antes que sumam. */
export function AimTrainer({ dict, onClose }: { dict: Dictionary["game"]; onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [targets, setTargets] = useState<Target[]>([]);
  const [stats, setStats] = useState<Stats>(emptyStats);
  const [remaining, setRemaining] = useState(DURATION);
  // Só renderiza depois de um clique (nunca no servidor), então ler o storage aqui é seguro.
  const [best, setBest] = useState(readBest);
  const [newBest, setNewBest] = useState(false);
  const [pops, setPops] = useState<{ id: number; x: number; y: number }[]>([]);
  const arenaRef = useRef<HTMLDivElement>(null);
  const crosshairRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const startedAt = useRef(0);

  const start = () => {
    setStats(emptyStats());
    setTargets([]);
    setPops([]);
    setRemaining(DURATION);
    setNewBest(false);
    startedAt.current = performance.now();
    setPhase("playing");
  };

  const statsRef = useRef(stats);
  useEffect(() => {
    statsRef.current = stats;
  }, [stats]);

  // Relógio da partida; no fim salva o recorde.
  useEffect(() => {
    if (phase !== "playing") return;
    const id = setInterval(() => {
      const left = Math.max(0, DURATION - (performance.now() - startedAt.current));
      setRemaining(left);
      if (left > 0) return;
      const pts = points(statsRef.current);
      if (pts > readBest()) {
        try {
          localStorage.setItem(BEST_KEY, String(pts));
        } catch {}
        setBest(pts);
        setNewBest(true);
      }
      setPhase("result");
    }, 100);
    return () => clearInterval(id);
  }, [phase]);

  // Gera alvos cada vez mais rápido e com vida mais curta.
  useEffect(() => {
    if (phase !== "playing") return;
    let timer: ReturnType<typeof setTimeout>;
    const spawn = () => {
      const progress = Math.min(1, (performance.now() - startedAt.current) / DURATION);
      setTargets((ts) => {
        if (ts.length >= MAX_TARGETS) return ts;
        return [
          ...ts,
          {
            id: nextId.current++,
            x: 8 + Math.random() * 84,
            y: 14 + Math.random() * 76,
            born: performance.now(),
            life: 1500 - 600 * progress,
          },
        ];
      });
      timer = setTimeout(spawn, 700 - 330 * progress);
    };
    spawn();
    return () => clearTimeout(timer);
  }, [phase]);

  const hit = useCallback((t: Target, e: ReactPointerEvent) => {
    e.stopPropagation();
    setTargets((ts) => ts.filter((x) => x.id !== t.id));
    setStats((s) => ({ ...s, hits: s.hits + 1, reactions: [...s.reactions, performance.now() - t.born] }));
    setPops((p) => [...p.slice(-5), { id: t.id, x: t.x, y: t.y }]);
  }, []);

  const expire = useCallback((id: number) => {
    setTargets((ts) => ts.filter((t) => t.id !== id));
    setStats((s) => ({ ...s, expired: s.expired + 1 }));
  }, []);

  const moveCrosshair = (e: ReactPointerEvent) => {
    const arena = arenaRef.current;
    const cross = crosshairRef.current;
    if (!arena || !cross || e.pointerType !== "mouse") return;
    const r = arena.getBoundingClientRect();
    cross.style.transform = `translate(${e.clientX - r.left}px, ${e.clientY - r.top}px)`;
  };

  const pts = points(stats);
  const rank = rankFor(pts);
  const seconds = (remaining / 1000).toFixed(1);

  return (
    <div className="relative flex h-full w-full flex-col">
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="m-auto w-full max-w-md p-8 sm:p-10"
          >
            <p className="font-mono text-xs tracking-[0.2em] text-muted uppercase">{dict.howTo}</p>
            <h2 className="mt-3 text-6xl font-semibold tracking-tighter sm:text-7xl">{dict.title}</h2>
            <ul className="mt-8 divide-y divide-border">
              {dict.rules.map((r) => (
                <li key={r.strong} className="py-3.5 text-lg">
                  <strong className="font-medium">{r.strong}</strong> <span className="text-muted">{r.rest}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={start}
              autoFocus
              className="mt-8 w-full rounded-xl bg-accent py-4 font-mono text-sm font-semibold tracking-[0.2em] text-accent-foreground uppercase transition-transform hover:scale-[1.02]"
            >
              {dict.start}
            </button>
            <p className="mt-5 text-center font-mono text-xs tracking-[0.2em] text-muted uppercase">
              {dict.escape}
              {best > 0 && (
                <>
                  {" · "}
                  {dict.best}: {best} {dict.points}
                </>
              )}
            </p>
          </motion.div>
        )}

        {phase === "playing" && (
          <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-4 border-b border-border py-3 pr-14 pl-5 font-mono text-sm">
              <span>
                <span className="text-muted">{dict.time}</span> <span className="tabular-nums">{seconds}s</span>
              </span>
              <span>
                <span className="text-muted">{dict.hits}</span> <span className="tabular-nums text-accent">{stats.hits}</span>
              </span>
              <span>
                <span className="text-muted">{dict.accuracy}</span>{" "}
                <span className="tabular-nums">{Math.round(accuracy(stats) * 100)}%</span>
              </span>
            </div>
            <div className="h-0.5 bg-border">
              <div className="h-full bg-accent transition-[width] duration-100 ease-linear" style={{ width: `${(remaining / DURATION) * 100}%` }} />
            </div>
            <div
              ref={arenaRef}
              data-cursor="none"
              onPointerMove={moveCrosshair}
              onPointerDown={() => setStats((s) => ({ ...s, misses: s.misses + 1 }))}
              className="relative flex-1 cursor-none touch-none overflow-hidden select-none"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(237,237,239,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(237,237,239,0.05) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            >
              {targets.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  aria-label="alvo"
                  tabIndex={-1}
                  onPointerDown={(e) => hit(t, e)}
                  onAnimationEnd={() => expire(t.id)}
                  className="aim-target absolute size-14 -translate-x-1/2 -translate-y-1/2 cursor-none"
                  style={{ left: `${t.x}%`, top: `${t.y}%`, animationDuration: `${t.life}ms` }}
                >
                  <svg viewBox="0 0 20 20" className="size-full drop-shadow-[0_0_12px_rgba(212,255,63,0.45)]">
                    <circle cx="10" cy="10" r="9.5" fill="#d4ff3f" />
                    <path d="M2.6 4.2c3.2 2.7 3.2 8.9 0 11.6M17.4 4.2c-3.2 2.7-3.2 8.9 0 11.6" stroke="#fff" strokeWidth="1.2" fill="none" />
                  </svg>
                </button>
              ))}

              {pops.map((p) => (
                <span
                  key={p.id}
                  className="aim-pop pointer-events-none absolute font-mono text-sm font-semibold text-accent"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                >
                  +1
                </span>
              ))}

              {/* Mira estilo Valorant */}
              <div ref={crosshairRef} className="pointer-events-none absolute top-0 left-0 hidden [@media(pointer:fine)]:block">
                <div className="relative -translate-x-1/2 -translate-y-1/2">
                  <span className="absolute top-1/2 left-1/2 size-[3px] -translate-1/2 bg-accent" />
                  <span className="absolute top-1/2 left-[calc(50%-13px)] h-[2px] w-[8px] -translate-y-1/2 bg-accent" />
                  <span className="absolute top-1/2 left-[calc(50%+5px)] h-[2px] w-[8px] -translate-y-1/2 bg-accent" />
                  <span className="absolute top-[calc(50%-13px)] left-1/2 h-[8px] w-[2px] -translate-x-1/2 bg-accent" />
                  <span className="absolute top-[calc(50%+5px)] left-1/2 h-[8px] w-[2px] -translate-x-1/2 bg-accent" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {phase === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="m-auto w-full max-w-lg p-8 text-center sm:p-10"
          >
            <BuckSvg pose={pts >= 25 ? "happy" : "idle"} className="mx-auto w-32" />
            <p className="mt-4 font-mono text-xs tracking-[0.2em] text-muted uppercase">Rank</p>
            <h2 className="mt-1 text-5xl font-semibold tracking-tight sm:text-6xl" style={{ color: rank.color }}>
              {dict.ranks[rank.id]}
            </h2>
            <p className="mt-2 font-mono text-sm text-muted">
              {pts} {dict.points}
              {newBest && <span className="ml-2 text-accent">· {dict.newBest}</span>}
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-3 text-left sm:grid-cols-4">
              {[
                [dict.hits, String(stats.hits)],
                [dict.accuracy, `${Math.round(accuracy(stats) * 100)}%`],
                [dict.reaction, `${avgReaction(stats)} ms`],
                [dict.best, String(best)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-border bg-background/60 p-3">
                  <dt className="font-mono text-[11px] text-muted uppercase">{label}</dt>
                  <dd className="mt-1 text-xl tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-muted">{pts < 18 ? dict.verdictLow : pts < 37 ? dict.verdictMid : dict.verdictHigh}</p>
            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={start}
                autoFocus
                className="flex-1 rounded-xl bg-accent py-3.5 font-mono text-sm font-semibold tracking-widest text-accent-foreground uppercase"
              >
                {dict.again}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-border py-3.5 font-mono text-sm tracking-widest uppercase hover:border-foreground"
              >
                {dict.close}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
