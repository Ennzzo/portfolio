import { cacheLife } from "next/cache";

export type RepoStats = { stars: number; pushedAt: string };

const API = "https://api.github.com";

function headers(): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  // Opcional: sem token o limite é 60 req/h por IP, mas o cache segura isso.
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

/** Estatísticas de um repositório. Retorna null se for privado ou a API falhar. */
export async function getRepoStats(repo: string): Promise<RepoStats | null> {
  "use cache";
  cacheLife("hours");

  try {
    const res = await fetch(`${API}/repos/${repo}`, { headers: headers() });
    if (!res.ok) return null;
    const data = await res.json();
    return { stars: data.stargazers_count, pushedAt: data.pushed_at };
  } catch {
    return null;
  }
}
