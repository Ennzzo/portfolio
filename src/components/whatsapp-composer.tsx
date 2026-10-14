"use client";

import { useState, type FormEvent } from "react";
import { profile } from "@/data/profile";
import type { Dictionary } from "@/i18n/dictionaries";
import { WhatsApp } from "./icons";

export function WhatsAppComposer({ dict }: { dict: Dictionary["whatsapp"] }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const text = message.trim();
    if (text.length < 3) {
      setError(true);
      return;
    }
    setError(false);
    const url = `https://wa.me/${profile.contact.whatsapp}?text=${encodeURIComponent(`${dict.greeting} ${text}`)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-surface p-2 focus-within:border-accent">
      <label htmlFor="wa-message" className="sr-only">
        {dict.label}
      </label>
      <textarea
        id="wa-message"
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            e.currentTarget.form?.requestSubmit();
          }
        }}
        placeholder={dict.placeholder}
        aria-invalid={error}
        aria-describedby={error ? "wa-error" : undefined}
        className="block w-full resize-none bg-transparent px-3 py-2 text-lg text-foreground outline-none placeholder:text-muted focus-visible:outline-none"
      />
      <div className="flex flex-wrap items-center justify-between gap-3 px-2 pb-1">
        <span id="wa-error" className={`text-sm ${error ? "text-red-400" : "text-muted"}`}>
          {error ? dict.error : dict.hint}
        </span>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-[#25d366] px-5 py-2.5 font-medium text-[#0a0a0b] transition-transform hover:scale-[1.03]"
        >
          <WhatsApp width={18} height={18} /> {dict.send}
        </button>
      </div>
    </form>
  );
}
