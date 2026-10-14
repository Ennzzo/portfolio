import { cacheLife } from "next/cache";

export type RepoStats = { stars: number; pushedAt: string };

const API = "https://api.github.com";

function headers(): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  // Sem token o limite é 60 req/h por IP; o cache de 1h dá conta.
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

// 404 (repositório privado) é uma resposta válida e fica em cache; falhas de rede não.
async function fetchRepoStats(repo: string): Promise<RepoStats | null> {
  "use cache";
  cacheLife("hours");
  const res = await fetch(`${API}/repos/${repo}`, { headers: headers() });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`github ${res.status}`);
  const data = await res.json();
  return { stars: data.stargazers_count, pushedAt: data.pushed_at };
}

export async function getRepoStats(repo: string): Promise<RepoStats | null> {
  try {
    return await fetchRepoStats(repo);
  } catch {
    return null;
  }
}
