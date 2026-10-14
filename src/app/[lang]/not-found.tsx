import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[60dvh] flex-col items-start justify-center gap-6">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="text-4xl font-medium tracking-tight sm:text-6xl">Página não encontrada / Page not found</h1>
      <Link href="/" className="text-muted underline-offset-4 hover:text-foreground hover:underline">
        ← Início / Home
      </Link>
    </section>
  );
}
