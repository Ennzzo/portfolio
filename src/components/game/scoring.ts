export type RankId = "iron" | "bronze" | "silver" | "gold" | "platinum" | "diamond" | "ascendant" | "immortal" | "radiant";
export type Rank = { id: RankId; color: string };

export const RANKS: (Rank & { min: number })[] = [
  { id: "iron", min: 0, color: "#8b8b93" },
  { id: "bronze", min: 10, color: "#b0743c" },
  { id: "silver", min: 18, color: "#c9d1d9" },
  { id: "gold", min: 25, color: "#e8b73a" },
  { id: "platinum", min: 31, color: "#4fb6c6" },
  { id: "diamond", min: 37, color: "#c38cf0" },
  { id: "ascendant", min: 42, color: "#3fc67a" },
  { id: "immortal", min: 47, color: "#e2475a" },
  { id: "radiant", min: 52, color: "#ffe9a8" },
];

export type Stats = { hits: number; misses: number; expired: number; reactions: number[] };

export const accuracy = ({ hits, misses }: Stats) => (hits + misses === 0 ? 0 : hits / (hits + misses));

export const avgReaction = ({ reactions }: Stats) =>
  reactions.length === 0 ? 0 : Math.round(reactions.reduce((a, b) => a + b, 0) / reactions.length);

export const points = (stats: Stats) => Math.round(stats.hits * accuracy(stats) * 10) / 10;

export function rankFor(pts: number): Rank {
  return [...RANKS].reverse().find((r) => pts >= r.min) ?? RANKS[0];
}
