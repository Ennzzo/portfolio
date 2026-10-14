"use client";

import { useEffect, useRef } from "react";

const RADIUS = 150;

/**
 * Título do hero com letras que reagem ao cursor: engordam (peso variável da Geist),
 * sobem e acendem; um marca-texto verde-limão aparece por baixo das letras ativas.
 */
export function HeroTitle({ lines }: { lines: { text: string; muted?: boolean }[] }) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const title = titleRef.current;
    const marker = markerRef.current;
    if (!title || !marker) return;
    if (!matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;

    const letters = Array.from(title.querySelectorAll<HTMLSpanElement>("[data-letter]"));
    let frame = 0;
    let pointer: { x: number; y: number } | null = null;

    const render = () => {
      frame = 0;
      let box: { left: number; right: number; top: number; bottom: number } | null = null;
      const titleRect = title.getBoundingClientRect();

      const marked = new Set<HTMLSpanElement>();
      for (const el of letters) {
        let t = 0;
        if (pointer) {
          const r = el.getBoundingClientRect();
          const d = Math.hypot(pointer.x - (r.left + r.width / 2), pointer.y - (r.top + r.height / 2));
          t = Math.max(0, 1 - d / RADIUS) ** 2;
          // O marca-texto cobre as letras bem ativas da linha mais próxima do cursor.
          if (t > 0.3 && Math.abs(pointer.y - (r.top + r.height / 2)) < r.height / 2) {
            marked.add(el);
            box = box
              ? { left: Math.min(box.left, r.left), right: Math.max(box.right, r.right), top: r.top, bottom: r.bottom }
              : { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
          }
        }
        el.style.fontVariationSettings = `"wght" ${Math.round(500 + 400 * t)}`;
        el.style.transform = `translateY(${(-8 * t).toFixed(2)}px)`;
        if (marked.has(el)) el.style.color = "var(--accent-foreground)";
        else if (el.dataset.muted) {
          el.style.color = `color-mix(in oklab, var(--foreground) ${Math.round(t * 100)}%, var(--muted))`;
        } else el.style.color = "";
      }

      if (box) {
        const lineHeight = box.bottom - box.top;
        marker.style.opacity = "1";
        marker.style.left = `${box.left - titleRect.left - 8}px`;
        marker.style.width = `${box.right - box.left + 16}px`;
        marker.style.top = `${box.top - titleRect.top + lineHeight * 0.06}px`;
        marker.style.height = `${lineHeight * 0.9}px`;
      } else {
        marker.style.opacity = "0";
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    const move = (e: PointerEvent) => {
      pointer = { x: e.clientX, y: e.clientY };
      schedule();
    };
    const leave = () => {
      pointer = null;
      schedule();
    };

    title.addEventListener("pointermove", move);
    title.addEventListener("pointerleave", leave);
    return () => {
      title.removeEventListener("pointermove", move);
      title.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <h1
      ref={titleRef}
      className="relative isolate max-w-4xl py-2 text-5xl leading-[1.08] font-medium tracking-tight sm:text-7xl"
      aria-label={lines.map((l) => l.text).join(" ")}
    >
      <span
        ref={markerRef}
        aria-hidden
        className="pointer-events-none absolute -z-10 -rotate-1 rounded-lg bg-accent opacity-0 transition-[left,width,top,height,opacity] duration-200 ease-out"
      />
      {lines.map((line, i) => (
        <span key={i} aria-hidden className="block">
          {line.text.split(" ").map((word, w) => (
            <span key={w} className="inline-block whitespace-nowrap">
              {Array.from(word).map((ch, c) => (
                <span
                  key={c}
                  data-letter
                  data-muted={line.muted ? "" : undefined}
                  className={`inline-block transition-[transform,color] duration-150 ease-out ${line.muted ? "text-muted" : ""}`}
                >
                  {ch}
                </span>
              ))}
              {w < line.text.split(" ").length - 1 && <span className="inline-block">&nbsp;</span>}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}
