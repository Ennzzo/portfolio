"use client";

import { useState, type FormEvent } from "react";
import { contactSchema } from "@/lib/contact-schema";
import type { Dictionary } from "@/i18n/dictionaries";

type Field = "name" | "email" | "message";
type Status = "idle" | "sending" | "success" | "error";

export function ContactForm({ dict }: { dict: Dictionary["contact"]["form"] }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      const next: Partial<Record<Field, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as Field;
        if (key in dict.errors) next[key] = dict.errors[key];
      }
      setErrors(next);
      return;
    }

    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <Input name="name" label={dict.name} error={errors.name} autoComplete="name" />
      <Input name="email" label={dict.email} error={errors.email} type="email" autoComplete="email" />
      <Input name="message" label={dict.message} error={errors.message} textarea />

      {/* Honeypot anti-spam: escondido de pessoas e leitores de tela. */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-2 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60 sm:self-start"
      >
        {status === "sending" ? dict.sending : dict.send}
      </button>

      <p role="status" aria-live="polite" className="text-sm">
        {status === "success" && <span className="text-accent">{dict.success}</span>}
        {status === "error" && <span className="text-red-400">{dict.error}</span>}
      </p>
    </form>
  );
}

type InputProps = {
  name: Field;
  label: string;
  error?: string;
  type?: string;
  autoComplete?: string;
  textarea?: boolean;
};

function Input({ name, label, error, type = "text", autoComplete, textarea }: InputProps) {
  const cls = `w-full rounded-xl border bg-surface px-4 py-3 text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent ${
    error ? "border-red-400" : "border-border"
  }`;
  const describedBy = error ? `${name}-error` : undefined;

  return (
    <label className="flex flex-col gap-2 text-sm">
      <span className="text-muted">{label}</span>
      {textarea ? (
        <textarea name={name} rows={6} className={cls} aria-invalid={!!error} aria-describedby={describedBy} />
      ) : (
        <input name={name} type={type} autoComplete={autoComplete} className={cls} aria-invalid={!!error} aria-describedby={describedBy} />
      )}
      {error && (
        <span id={`${name}-error`} className="text-red-400">
          {error}
        </span>
      )}
    </label>
  );
}
