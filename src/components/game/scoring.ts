export type RankId = "iron" | "bronze" | "silver" | "gold" | "platinum" | "diamond" | "ascendant" | "immortal" | "radiant";
export type Rank = { id: RankId; color: string };

export const RANKS: (Rank & { min: number })[] = [
  { id: "iron", min: 0, color: "#8b8b93" },
  { id: "bronze", min: 8, color: "#b0743c" },
  { id: "silver", min: 15, color: "#c9d1d9" },
  { id: "gold", min: 21, color: "#e8b73a" },
  { id: "platinum", min: 26, color: "#4fb6c6" },
  { id: "diamond", min: 31, color: "#c38cf0" },
  { id: "ascendant", min: 35, color: "#3fc67a" },
  { id: "immortal", min: 39, color: "#e2475a" },
  { id: "radiant", min: 43, color: "#ffe9a8" },
];

export type Stats = { hits: number; misses: number; expired: number; reactions: number[] };

export const accuracy = ({ hits, misses }: Stats) => (hits + misses === 0 ? 0 : hits / (hits + misses));

export const avgReaction = ({ reactions }: Stats) =>
  reactions.length === 0 ? 0 : Math.round(reactions.reduce((a, b) => a + b, 0) / reactions.length);

// Dificuldade em função do tempo de jogo (s): os alvos nascem mais rápido e duram menos.
export const spawnEvery = (t: number) => Math.max(380, 900 - t * 17);
export const lifeAt = (t: number) => Math.max(1150, 2300 - t * 30);

export const points = (stats: Stats) => Math.round(stats.hits * accuracy(stats) * 10) / 10;

export function rankFor(pts: number): Rank {
  return [...RANKS].reverse().find((r) => pts >= r.min) ?? RANKS[0];
}
