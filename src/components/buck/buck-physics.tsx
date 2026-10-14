"use client";

import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { emit } from "@/lib/events";
import { BuckSvg, type BuckPose } from "./buck-svg";
import {
  G,
  HARD_LAND_VY,
  HEAVY_LAND_VY,
  WALK_V,
  clamp,
  platformUnder,
  pointerVelocity,
  squashFor,
  stepAir,
  stepSquash,
  throwVelocity,
  type Body,
  type Platform,
  type PointerSample,
} from "./physics";

const W = 120;
const H = Math.round((W * 150) / 220);

type Mode = "walk" | "idle" | "held" | "air";

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];

export function BuckPhysics({ dict }: { dict: Dictionary["buck"] }) {
  const elRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const [pose, setPose] = useState<BuckPose>("idle");
  const [dir, setDir] = useState<1 | -1>(1);
  const [bubble, setBubble] = useState<{ text: string; hi?: string } | null>(null);
  const say = useRef<(text: string, hi?: string, ms?: number) => void>(() => {});
  const dictRef = useRef(dict);
  useEffect(() => {
    dictRef.current = dict;
  }, [dict]);

  useEffect(() => {
    const el = elRef.current;
    const inner = innerRef.current;
    const layer = layerRef.current;
    if (!el || !inner || !layer) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const body: Body = { x: 0, y: 0, vx: 0, vy: 0, bounced: false };
    let mode: Mode = "idle";
    let modeT = 1.5; // tempo restante no modo atual
    let facing: 1 | -1 = 1;
    let plat: Platform | null = null;
    let platforms: Platform[] = [];
    let willFall = false; // ao chegar na borda, cai em vez de virar
    const fx = { squash: 1, squashV: 0, tilt: 0, tiltV: 0, airRot: 0, rotV: 0 };
    let heldX = 0;
    let heldY = 0;
    let offT = 0;
    let lastScroll = performance.now();
    let pointer = { x: -999, y: -999 };
    const samples: PointerSample[] = [];
    let grab: { id: number; x0: number; y0: number; t0: number; dragging: boolean } | null = null;
    let bubbleTimer: ReturnType<typeof setTimeout> | undefined;

    let currentPose: BuckPose = "idle";
    const setP = (p: BuckPose) => {
      if (p !== currentPose) {
        currentPose = p;
        setPose(p);
      }
    };
    const face = (d: 1 | -1) => {
      if (d !== facing) {
        facing = d;
        setDir(d);
      }
    };
    say.current = (text, hi, ms = 2600) => {
      clearTimeout(bubbleTimer);
      setBubble({ text, hi });
      bubbleTimer = setTimeout(() => setBubble(null), ms);
    };

    const refresh = () => {
      const sy = scrollY;
      const list: Platform[] = [];
      document.querySelectorAll("[data-buck-floor]").forEach((node) => {
        const r = node.getBoundingClientRect();
        if (r.width < 80 || r.height <= 0) return;
        // "wide" = divisória de seção, ocupa a largura toda.
        const wide = (node as HTMLElement).dataset.buckFloor === "wide";
        list.push({ x1: wide ? 8 : r.left, x2: wide ? innerWidth - 8 : r.right, y: r.top + sy, el: node });
      });
      const footer = document.querySelector("footer");
      if (footer) {
        const r = footer.getBoundingClientRect();
        list.push({ x1: 8, x2: innerWidth - 8, y: r.top + sy, el: footer });
      }
      platforms = list.sort((a, b) => a.y - b.y);
      if (plat && mode !== "air" && mode !== "held") {
        const same = platforms.find((p) => p.el === plat!.el);
        if (same) {
          plat = same;
          body.y = same.y;
          body.x = clamp(body.x, same.x1 - W * 0.3, same.x2 - W * 0.7);
        } else startFall();
      }
    };

    const visiblePlatforms = () => {
      const top = scrollY + 90;
      const bottom = scrollY + innerHeight - 20;
      return platforms.filter((p) => p.y > top && p.y < bottom);
    };

    const startWalk = () => {
      mode = "walk";
      modeT = rand(2.5, 6);
      willFall = Math.random() < 0.25;
      if (Math.random() < 0.5) face(facing === 1 ? -1 : 1);
      setP("walk");
    };
    const startIdle = (t = rand(1.5, 4)) => {
      mode = "idle";
      modeT = t;
      body.vx = 0;
      setP("idle");
    };
    function startFall(vx = 0, vy = 0) {
      mode = "air";
      plat = null;
      body.vx = vx;
      body.vy = vy;
      body.bounced = false;
      setP("air");
    }
    const dropIn = () => {
      const target = pick(visiblePlatforms().filter((p) => p.x2 - p.x1 > W)) ?? platforms.at(-1);
      body.y = scrollY - 40;
      body.x = target ? clamp(rand(target.x1, target.x2 - W), 4, innerWidth - W - 4) : innerWidth / 2;
      startFall(0, 0);
    };
    const jumpTo = (p: Platform) => {
      const tx = clamp(rand(p.x1, p.x2 - W), p.x1 - W * 0.3, p.x2 - W * 0.7);
      // Ápice 60px acima do ponto mais alto entre a origem e o destino.
      const apex = Math.min(body.y, p.y) - 60;
      const vy = -Math.sqrt(2 * G * (body.y - apex));
      const t = -vy / G + Math.sqrt((2 * (p.y - apex)) / G);
      const vx = clamp((tx - body.x) / t, -640, 640);
      face(vx >= 0 ? 1 : -1);
      startFall(vx, vy);
    };

    const land = (p: Platform, impactVy: number, bounce: boolean) => {
      fx.squash = squashFor(impactVy);
      fx.squashV = 0;
      if (impactVy > HARD_LAND_VY) puff(body.x + W / 2, p.y, impactVy > HEAVY_LAND_VY ? 8 : 5);
      if (bounce) return; // ainda vai quicar uma vez
      plat = p;
      fx.airRot = 0;
      fx.rotV = 0;
      if (impactVy > HEAVY_LAND_VY && Math.random() < 0.5) say.current(dictRef.current.oof, undefined, 1800);
      startIdle(rand(0.6, 1.4));
    };

    const puff = (x: number, y: number, n: number) => {
      for (let i = 0; i < n; i++) {
        const s = document.createElement("span");
        s.className = "buck-puff";
        s.style.left = `${x + rand(-W * 0.35, W * 0.35)}px`;
        s.style.top = `${y - 6}px`;
        s.style.setProperty("--dx", `${rand(-26, 26)}px`);
        layer.appendChild(s);
        setTimeout(() => s.remove(), 600);
      }
    };

    refresh();
    const start = visiblePlatforms()[0] ?? platforms[0];
    if (start) {
      plat = start;
      body.y = start.y;
      body.x = clamp(start.x1 + 12, 4, innerWidth - W - 4);
    }
    el.style.opacity = "1";

    let last = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      const dt = Math.min(1 / 30, (now - last) / 1000);
      last = now;
      modeT -= dt;

      if (mode === "held") {
        const tx = pointer.x - W / 2;
        const ty = pointer.y + scrollY + H * 0.78;
        heldX += (tx - heldX) * (1 - Math.exp(-14 * dt));
        heldY += (ty - heldY) * (1 - Math.exp(-10 * dt));
        body.x = heldX;
        body.y = heldY;
        const [pvx] = pointerVelocity(samples, 60);
        const target = clamp(-pvx * 0.018, -16, 16);
        fx.tiltV += (50 * (target - fx.tilt) - 8 * fx.tiltV) * dt;
        fx.tilt += fx.tiltV * dt;
      } else if (mode === "air") {
        const res = stepAir(body, dt, platforms, W, innerWidth);
        if (body.vy < 0) fx.airRot += fx.rotV * dt;
        else {
          fx.airRot += (0 - fx.airRot) * Math.min(1, dt * 8);
          fx.rotV *= Math.max(0, 1 - dt * 6);
        }
        if (res) land(res.landed, res.impactVy, res.bounce);
        else if (body.y > document.documentElement.scrollHeight + 400) dropIn();
        fx.tilt += (0 - fx.tilt) * Math.min(1, dt * 10);
      } else {
        fx.tilt += (0 - fx.tilt) * Math.min(1, dt * 10);
        if (mode === "walk") {
          body.x += facing * WALK_V * dt;
          const p = plat;
          if (p) {
            const cx = body.x + W / 2;
            const nearEdge = facing === 1 ? cx > p.x2 - W * 0.25 : cx < p.x1 + W * 0.25;
            if (body.x <= 4 || body.x >= innerWidth - W - 4) face(facing === 1 ? -1 : 1);
            else if (nearEdge && !willFall) face(facing === 1 ? -1 : 1);
            else if (!platformUnder(cx, body.y, [p])) startFall(facing * WALK_V * 1.2, -120);
          }
          if (modeT <= 0) startIdle();
        } else if (mode === "idle" && modeT <= 0) {
          const options = visiblePlatforms().filter(
            (p) => p !== plat && Math.abs(p.y - body.y) < 320 && Math.abs((p.x1 + p.x2) / 2 - body.x) < 700,
          );
          if (options.length && Math.random() < 0.3) jumpTo(pick(options));
          else startWalk();
        }
      }

      // Longe da tela por um tempo? Quando a rolagem parar, ele cai do topo.
      const onScreen = body.y > scrollY - 40 && body.y - H < scrollY + innerHeight + 40;
      offT = onScreen || mode === "held" ? 0 : offT + dt;
      if (offT > 1.2 && now - lastScroll > 400) {
        offT = 0;
        dropIn();
        setTimeout(() => say.current(dictRef.current.back, undefined, 2200), 700);
      }

      stepSquash(fx, dt);
      const sx = 1 + (1 - fx.squash) * 0.6;
      el.style.transform = `translate3d(${body.x}px, ${body.y - H}px, 0)`;
      inner.style.transform = `rotate(${fx.tilt + fx.airRot}deg) scale(${sx}, ${fx.squash})`;
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      pointer = { x: e.clientX, y: e.clientY };
      samples.push({ x: e.clientX, y: e.clientY + scrollY, t: performance.now() });
      if (samples.length > 24) samples.shift();
      if (!grab || e.pointerId !== grab.id) return;
      if (!grab.dragging && Math.hypot(e.clientX - grab.x0, e.clientY - grab.y0) > 6) {
        grab.dragging = true;
        mode = "held";
        heldX = body.x;
        heldY = body.y;
        plat = null;
        fx.airRot = 0;
        setP("held");
        el.style.zIndex = "60";
        document.documentElement.style.userSelect = "none";
        clearTimeout(bubbleTimer);
        setBubble(null);
        if (Math.random() < 0.3) say.current(dictRef.current.held, undefined, 1800);
      }
    };
    const onDown = (e: PointerEvent) => {
      if (reduced) return;
      e.preventDefault();
      grab = { id: e.pointerId, x0: e.clientX, y0: e.clientY, t0: performance.now(), dragging: false };
      pointer = { x: e.clientX, y: e.clientY };
      try {
        el.setPointerCapture(e.pointerId);
      } catch {}
    };
    const onUp = (e: PointerEvent) => {
      if (!grab || e.pointerId !== grab.id) return;
      const g = grab;
      grab = null;
      document.documentElement.style.userSelect = "";
      el.style.zIndex = "";
      if (g.dragging) {
        const [vx, vy] = throwVelocity(pointerVelocity(samples, 80));
        fx.rotV = clamp(vx * 0.06, -220, 220);
        if (vx) face(vx >= 0 ? 1 : -1);
        startFall(vx, vy);
        if (Math.hypot(vx, vy) > 900 && Math.random() < 0.6) {
          setTimeout(() => say.current(pick(dictRef.current.thrown), undefined, 1800), 250);
        }
      } else if (performance.now() - g.t0 < 450) {
        emit("game:open");
      }
    };
    const onScroll = () => {
      lastScroll = performance.now();
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", refresh);
    const interval = setInterval(refresh, 1500);
    document.fonts?.ready.then(refresh);

    if (!reduced) raf = requestAnimationFrame(loop);
    else {
      el.style.transform = `translate3d(${body.x}px, ${body.y - H}px, 0)`;
    }

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(interval);
      clearTimeout(bubbleTimer);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", refresh);
      document.documentElement.style.userSelect = "";
    };
  }, []);

  return (
    <div ref={layerRef} className="pointer-events-none absolute top-0 left-0 z-30 h-0 w-full">
      <div
        ref={elRef}
        role="button"
        tabIndex={0}
        aria-label={dict.aria}
        title={dict.aria}
        data-cursor="play"
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && emit("game:open")}
        onPointerEnter={() => {
          if (pose !== "idle" && pose !== "walk") return;
          const line = pick(dict.lines);
          say.current(line.pre, line.hi);
        }}
        className="pointer-events-auto absolute top-0 left-0 cursor-grab touch-none opacity-0 transition-opacity duration-300 select-none active:cursor-grabbing"
        style={{ width: W, height: H, willChange: "transform" }}
      >
        {bubble && (
          <p className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 w-max max-w-64 -translate-x-1/2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm shadow-xl">
            {bubble.text} {bubble.hi && <span className="text-accent">{bubble.hi}</span>}
          </p>
        )}
        <div ref={innerRef} className="size-full origin-bottom" style={{ willChange: "transform" }}>
          <div className="size-full" style={{ transform: `scaleX(${dir})` }}>
            <BuckSvg pose={pose} className="size-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
