"use client";

import { useEffect } from "react";

/** Eventos globais simples entre componentes que não se conhecem (Buck, menu Ctrl+K, jogo…). */
type Events = {
  "game:open": undefined;
  "buck:zoomies": undefined;
};

export function emit<K extends keyof Events>(name: K) {
  window.dispatchEvent(new CustomEvent(name));
}

export function useEvent<K extends keyof Events>(name: K, handler: () => void) {
  useEffect(() => {
    window.addEventListener(name, handler);
    return () => window.removeEventListener(name, handler);
  }, [name, handler]);
}
