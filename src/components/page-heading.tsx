import { Reveal } from "./reveal";

export function PageHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <Reveal className="pt-16 pb-12 sm:pt-24">
      <h1 className="text-4xl font-medium tracking-tight sm:text-6xl">{title}</h1>
      {subtitle && <p className="mt-4 max-w-xl text-lg text-muted">{subtitle}</p>}
    </Reveal>
  );
}
