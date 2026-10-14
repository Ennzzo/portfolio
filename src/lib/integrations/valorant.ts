import { cacheLife } from "next/cache";

export type ValorantRank = { tier: string; icon: string | null; rr: number | null; peak: string | null };

type Mmr = {
  data?: {
    current_data?: { currenttierpatched?: string | null; images?: { small?: string; large?: string } | null; ranking_in_tier?: number | null };
    highest_rank?: { patched_tier?: string | null } | null;
  };
};

/** Converte o /v2/mmr da HenrikDev API no formato usado pelo card. */
export function parseValorantMmr(json: Mmr): ValorantRank | null {
  const current = json.data?.current_data;
  if (!current?.currenttierpatched) return null;
  return {
    tier: current.currenttierpatched,
    icon: current.images?.large ?? current.images?.small ?? null,
    rr: current.ranking_in_tier ?? null,
    peak: json.data?.highest_rank?.patched_tier ?? null,
  };
}

/**
 * Rank atual do Valorant via HenrikDev API (não oficial; a Riot não libera rank para sites pessoais).
 * Precisa de HENRIK_API_KEY (grátis, pedida no Discord da HenrikDev).
 */
export async function getValorantRank(region: string, name: string, tag: string): Promise<ValorantRank | null> {
  "use cache";
  cacheLife("hours");
  const key = process.env.HENRIK_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(
      `https://api.henrikdev.xyz/valorant/v2/mmr/${region}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`,
      { headers: { Authorization: key } },
    );
    if (!res.ok) return null;
    return parseValorantMmr(await res.json());
  } catch {
    return null;
  }
}
