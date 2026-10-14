"use client";

import type { MouseEvent } from "react";

const LIT_MS = 480;
const timers = new WeakMap<HTMLElement, ReturnType<typeof setTimeout>>();

/**
 * Acende a letra por um instante. Só troca uma classe: a animação é feita pelo CSS
 * com transform + background (sem medir layout nem mudar o peso da fonte), por isso
 * roda liso mesmo passando o mouse rápido — e deixa um "rastro" pelas letras.
 */
function lightUp(e: MouseEvent<HTMLSpanElement>) {
  const el = e.currentTarget;
  clearTimeout(timers.get(el));
  el.classList.remove("lit");
  void el.offsetWidth; // reinicia a transição se a letra já estava acesa
  el.classList.add("lit");
  timers.set(
    el,
    setTimeout(() => el.classList.remove("lit"), LIT_MS),
  );
}

export function HeroTitle({ lines }: { lines: { text: string; muted?: boolean }[] }) {
  return (
    <h1
      className="hero-title max-w-4xl text-5xl leading-[1.08] font-medium tracking-tight sm:text-7xl"
      aria-label={lines.map((l) => l.text).join(" ")}
    >
      {lines.map((line, i) => {
        const words = line.text.split(" ");
        return (
          <span key={i} aria-hidden className={`block ${line.muted ? "text-muted" : ""}`}>
            {words.map((word, w) => (
              <span key={w} className="inline-block whitespace-nowrap">
                {Array.from(word).map((ch, c) => (
                  <span key={c} className="ch" onMouseEnter={lightUp}>
                    {ch}
                  </span>
                ))}
                {w < words.length - 1 && <span className="inline-block">&nbsp;</span>}
              </span>
            ))}
          </span>
        );
      })}
    </h1>
  );
}
