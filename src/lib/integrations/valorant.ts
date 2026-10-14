import { cacheLife } from "next/cache";

export type ValorantProfile = {
  /** null quando está sem rank na temporada atual */
  current: string | null;
  peak: string | null;
  peakIcon: string | null;
  /** último rank final em uma temporada jogada */
  lastRanked: string | null;
  level: number | null;
};

// Ícones dos ranks na tabela atual de tiers (o pico pode ser de um episódio antigo,
// com numeração diferente, então o ícone é escolhido pelo nome do rank).
const TIERS_TABLE = "https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04";
const RANK_BASE: Record<string, number> = {
  Iron: 3,
  Bronze: 6,
  Silver: 9,
  Gold: 12,
  Platinum: 15,
  Diamond: 18,
  Ascendant: 21,
  Immortal: 24,
  Radiant: 27,
};

export function rankIcon(patched: string): string | null {
  const [name, division] = patched.split(" ");
  const base = RANK_BASE[name];
  if (base === undefined) return null;
  const tier = name === "Radiant" ? base : base + (Number(division || 1) - 1);
  return `${TIERS_TABLE}/${tier}/largeicon.png`;
}

type Mmr = {
  data?: {
    current_data?: { currenttierpatched?: string | null };
    highest_rank?: { patched_tier?: string | null } | null;
    by_season?: Record<string, { error?: unknown; final_rank_patched?: string }>;
  };
};

const ranked = (r?: string | null) => (r && r !== "Unrated" ? r : null);

/** Converte o /v2/mmr da HenrikDev API no formato usado pelo card. */
export function parseValorantMmr(json: Mmr, level: number | null = null): ValorantProfile | null {
  const data = json.data;
  if (!data) return null;
  const peak = ranked(data.highest_rank?.patched_tier);
  const seasons = Object.values(data.by_season ?? {})
    .filter((s) => !s.error)
    .map((s) => ranked(s.final_rank_patched))
    .filter(Boolean) as string[];
  return {
    current: ranked(data.current_data?.currenttierpatched),
    peak,
    peakIcon: peak ? rankIcon(peak) : null,
    lastRanked: seasons.at(-1) ?? null,
    level,
  };
}

/**
 * Perfil do Valorant via HenrikDev API (não oficial; a Riot não libera rank para sites pessoais).
 * Precisa de HENRIK_API_KEY (grátis, pedida no Discord da HenrikDev).
 */
export async function getValorantProfile(region: string, name: string, tag: string): Promise<ValorantProfile | null> {
  "use cache";
  cacheLife("hours");
  const key = process.env.HENRIK_API_KEY;
  if (!key) return null;
  const headers = { Authorization: key };
  const id = `${encodeURIComponent(name)}/${encodeURIComponent(tag)}`;
  try {
    const [mmr, account] = await Promise.all([
      fetch(`https://api.henrikdev.xyz/valorant/v2/mmr/${region}/${id}`, { headers }),
      fetch(`https://api.henrikdev.xyz/valorant/v1/account/${id}`, { headers }),
    ]);
    if (!mmr.ok) return null;
    const level = account.ok ? (((await account.json()) as { data?: { account_level?: number } }).data?.account_level ?? null) : null;
    return parseValorantMmr(await mmr.json(), level);
  } catch {
    return null;
  }
}
