import type { ReactNode } from "react";
import { ArrowUpRight, GitHub, Mail, WhatsApp } from "../icons";
import { LogoMark } from "../logo-mark";
import { Reveal } from "../reveal";
import { Section, SectionHeading } from "./section-heading";
import { colors, motion, radii, typeScale } from "@/data/design-system";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function DesignSystemSection({ lang, dict, index }: { lang: Locale; dict: Dictionary; index: string }) {
  const t = dict.design;

  return (
    <Section id="design">
      <SectionHeading index={index} label={dict.nav.design} title={t.title} subtitle={t.subtitle} />

      <div className="space-y-16">
        <Group title={t.colors} note={t.colorsNote}>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {colors.map((c) => (
              <li key={c.name} className="overflow-hidden rounded-xl border border-border bg-surface">
                <div className="h-16 border-b border-border" style={{ background: `var(${c.cssVar})` }} />
                <div className="p-3">
                  <p className="font-mono text-sm">{c.name}</p>
                  <p className="mt-0.5 text-xs text-muted">{c.usage[lang]}</p>
                  <p className="mt-2 flex gap-3 font-mono text-[11px] text-muted">
                    <span className="inline-flex items-center gap-1">
                      <span className="size-2.5 rounded-full border border-border" style={{ background: c.dark }} />
                      {c.dark}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="size-2.5 rounded-full border border-border" style={{ background: c.light }} />
                      {c.light}
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Group>

        <Group title={t.typography} note={t.typographyNote}>
          <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">
            {typeScale.map((s) => (
              <li key={s.name} className="grid items-baseline gap-2 px-5 py-4 sm:grid-cols-[140px_1fr_auto] sm:gap-6">
                <span className="font-mono text-xs text-muted uppercase">{s.name}</span>
                <span className={`truncate ${s.className}`}>{s.name === "Label" ? t.sampleLabel : t.sample}</span>
                <span className="font-mono text-[11px] text-muted">{s.spec}</span>
              </li>
            ))}
          </ul>
        </Group>

        <Group title={t.components}>
          <div className="grid gap-4 md:grid-cols-2">
            <Specimen label={t.buttons}>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-accent px-5 py-2.5 font-medium text-accent-foreground">{t.primary}</span>
                <span className="rounded-full border border-border px-5 py-2.5">{t.secondary}</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#25d366] px-5 py-2.5 font-medium text-[#0a0a0b]">
                  <WhatsApp width={16} height={16} /> WhatsApp
                </span>
              </div>
            </Specimen>
            <Specimen label={t.tags}>
              <div className="flex flex-wrap gap-2">
                {["React", "Next.js", "TypeScript"].map((x) => (
                  <span key={x} className="rounded-full border border-border px-2.5 py-0.5 font-mono text-xs text-muted">
                    {x}
                  </span>
                ))}
                <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 font-mono text-xs text-muted">
                  <span className="size-1.5 rounded-full bg-accent" /> {dict.home.eyebrow}
                </span>
              </div>
            </Specimen>
            <Specimen label={t.input}>
              <span className="block w-full rounded-xl border border-accent bg-surface px-4 py-3 text-muted">{t.inputPlaceholder}</span>
            </Specimen>
            <Specimen label={t.links}>
              <div className="flex flex-wrap items-center gap-5 text-sm">
                <span className="inline-flex items-center gap-1 text-accent">
                  {t.linkSample} <ArrowUpRight width={14} height={14} />
                </span>
                <span className="inline-flex items-center gap-2 text-muted">
                  <GitHub width={16} height={16} /> GitHub
                </span>
                <span className="inline-flex items-center gap-2 text-muted">
                  <Mail width={16} height={16} /> E-mail
                </span>
              </div>
            </Specimen>
          </div>
        </Group>

        <div className="grid gap-16 md:grid-cols-2">
          <Group title={t.shape} note={t.shapeNote}>
            <ul className="flex flex-wrap items-end gap-4">
              {radii.map((r) => (
                <li key={r.name} className="text-center">
                  <div className={`size-16 border border-accent bg-accent/10 ${r.className}`} />
                  <p className="mt-2 font-mono text-[11px] text-muted">
                    {r.name} · {r.value}
                  </p>
                </li>
              ))}
            </ul>
          </Group>

          <Group title={t.brand} note={t.brandNote}>
            <div className="flex items-center gap-4">
              <LogoMark className="size-14" />
              <span className="font-mono text-2xl font-semibold">Enzzo</span>
            </div>
          </Group>
        </div>

        <Group title={t.motion} note={t.motionNote}>
          <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">
            {motion.map((m) => (
              <li key={m.name} className="grid gap-1 px-5 py-4 sm:grid-cols-[140px_1fr_auto] sm:gap-6">
                <span className="font-mono text-xs text-muted uppercase">{m.name}</span>
                <span className="font-mono text-sm">{m.curve}</span>
                <span className="text-sm text-muted">
                  {m.duration} · {m.usage[lang]}
                </span>
              </li>
            ))}
          </ul>
        </Group>

        <Group title={t.stack}>
          <ul className="flex flex-wrap gap-2">
            {["Tailwind CSS 4", "Motion", "Geist / Geist Mono", "SVG", "CSS custom properties", "View Transitions API"].map((x) => (
              <li key={x} className="rounded-full bg-surface px-3 py-1 font-mono text-xs text-muted">
                {x}
              </li>
            ))}
          </ul>
        </Group>
      </div>
    </Section>
  );
}

function Group({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <Reveal>
      <h3 className="font-mono text-sm tracking-widest text-muted uppercase">{title}</h3>
      {note && <p className="mt-2 max-w-2xl text-muted">{note}</p>}
      <div className="mt-5">{children}</div>
    </Reveal>
  );
}

function Specimen({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <p className="mb-4 font-mono text-[11px] text-muted uppercase">{label}</p>
      {children}
    </div>
  );
}
