"use client";

import Image from "next/image";
import { emit } from "@/lib/events";

/** Foto pequena do Buck estilo polaroid; clicar abre o jogo. */
export function BuckPhoto({ alt, play }: { alt: string; play: string }) {
  return (
    <figure className="group w-24 shrink-0 rotate-3 rounded-xl border border-border bg-surface p-1.5 shadow-xl transition-transform duration-300 hover:rotate-0 sm:w-28">
      <button
        type="button"
        onClick={() => emit("game:open")}
        data-cursor="play"
        aria-label={play}
        title={play}
        className="block w-full overflow-hidden rounded-lg"
      >
        <Image
          src="/buck-lingua.webp"
          alt={alt}
          width={800}
          height={1000}
          sizes="112px"
          className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </button>
    </figure>
  );
}
