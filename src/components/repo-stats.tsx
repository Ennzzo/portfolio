import { getRepoStats } from "@/lib/github";
import { formatDate } from "@/lib/format";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { Star } from "./icons";

export async function RepoStats({ repo, lang, dict }: { repo: string; lang: Locale; dict: Dictionary["projects"] }) {
  const stats = await getRepoStats(repo);
  if (!stats) return <span className="font-mono text-xs text-muted">{dict.private}</span>;

  return (
    <span className="flex items-center gap-3 font-mono text-xs text-muted">
      <span className="inline-flex items-center gap-1" title={dict.stars}>
        <Star width={13} height={13} /> {stats.stars}
      </span>
      <span>
        {dict.updated}: {formatDate(stats.pushedAt, lang)}
      </span>
    </span>
  );
}

export function RepoStatsFallback() {
  return <span className="h-4 w-40 animate-pulse rounded bg-surface-hover" aria-hidden />;
}
