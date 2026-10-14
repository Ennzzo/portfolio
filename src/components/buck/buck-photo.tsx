"use client";

import Image from "next/image";
import { emit } from "@/lib/events";

/** Foto do Buck estilo polaroid; clicar abre o jogo. */
export function BuckPhoto({ alt, caption, play }: { alt: string; caption: string; play: string }) {
  return (
    <figure className="group mx-auto w-56 rotate-3 rounded-2xl border border-border bg-surface p-3 pb-4 shadow-2xl transition-transform duration-300 hover:rotate-0 sm:w-64">
      <button
        type="button"
        onClick={() => emit("game:open")}
        data-cursor="play"
        aria-label={play}
        title={play}
        className="block w-full overflow-hidden rounded-xl"
      >
        <Image
          src="/buck.webp"
          alt={alt}
          width={800}
          height={1000}
          sizes="256px"
          className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </button>
      <figcaption className="mt-3 text-center font-mono text-xs text-muted">{caption}</figcaption>
    </figure>
  );
}
