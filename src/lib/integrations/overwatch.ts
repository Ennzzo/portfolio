import { cacheLife } from "next/cache";

export type OverwatchRole = "tank" | "damage" | "support" | "open";
export type OverwatchRank = { role: OverwatchRole; division: string; tier: number; rankIcon: string; roleIcon: string };
export type OverwatchProfile = { username: string; avatar: string | null; endorsement: number | null; ranks: OverwatchRank[] };

const ROLES: OverwatchRole[] = ["tank", "damage", "support", "open"];

type RoleData = { division: string; tier: number; rank_icon: string; role_icon: string } | null;
type Summary = {
  username: string;
  avatar: string | null;
  endorsement?: { level: number } | null;
  competitive?: { pc?: Partial<Record<OverwatchRole, RoleData>> | null } | null;
};

/** Converte o /summary da OverFast API no formato usado pelo card. */
export function parseOverwatchSummary(data: Summary): OverwatchProfile {
  const pc = data.competitive?.pc ?? {};
  return {
    username: data.username,
    avatar: data.avatar,
    endorsement: data.endorsement?.level ?? null,
    ranks: ROLES.flatMap((role) => {
      const r = pc[role];
      return r ? [{ role, division: r.division, tier: r.tier, rankIcon: r.rank_icon, roleIcon: r.role_icon }] : [];
    }),
  };
}

/** Perfil público do Overwatch via OverFast API (sem chave). BattleTag no formato "Nome-1234". */
export async function getOverwatchProfile(battletag: string): Promise<OverwatchProfile | null> {
  "use cache";
  cacheLife("hours");
  try {
    const res = await fetch(`https://overfast-api.tekrop.fr/players/${encodeURIComponent(battletag)}/summary`);
    if (!res.ok) return null;
    return parseOverwatchSummary(await res.json());
  } catch {
    return null;
  }
}
