import { Reveal } from "../reveal";

/** Título de seção da página única: "01 / Sobre" + título grande + subtítulo opcional. */
export function SectionHeading({ index, label, title, subtitle }: { index: string; label: string; title: string; subtitle?: string }) {
  return (
    <Reveal className="mb-12">
      <p className="font-mono text-xs tracking-widest text-muted uppercase">
        <span className="text-accent">{index}</span> / {label}
      </p>
      <h2 data-buck-floor className="mt-3 w-fit text-4xl font-medium tracking-tight sm:text-6xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 max-w-xl text-lg text-muted">{subtitle}</p>}
    </Reveal>
  );
}

export function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} data-section className="scroll-mt-20 border-t border-border/60 py-24 first:border-t-0">
      {children}
    </section>
  );
}
