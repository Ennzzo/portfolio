"use client";

import { useState } from "react";
import { Check, Copy } from "./icons";

export function CopyEmail({ email, copyLabel, copiedLabel }: { email: string; copyLabel: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="group inline-flex items-center gap-3 text-xl transition-colors hover:text-accent sm:text-3xl"
      aria-label={copyLabel}
    >
      <span className="break-all">{email}</span>
      <span className="text-muted group-hover:text-accent" aria-live="polite">
        {copied ? <Check /> : <Copy />}
        <span className="sr-only">{copied ? copiedLabel : ""}</span>
      </span>
    </button>
  );
}
