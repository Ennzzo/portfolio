import { describe, expect, it } from "vitest";
import { accuracy, avgReaction, points, rankFor } from "@/components/game/scoring";

const stats = (hits: number, misses: number, reactions: number[] = []) => ({ hits, misses, expired: 0, reactions });

describe("pontuação do jogo de mira", () => {
  it("calcula precisão e evita divisão por zero", () => {
    expect(accuracy(stats(3, 1))).toBe(0.75);
    expect(accuracy(stats(0, 0))).toBe(0);
  });

  it("calcula a reação média arredondada", () => {
    expect(avgReaction(stats(2, 0, [300, 451]))).toBe(376);
    expect(avgReaction(stats(0, 0))).toBe(0);
  });

  it("pondera os acertos pela precisão", () => {
    expect(points(stats(20, 0))).toBe(20);
    expect(points(stats(20, 20))).toBe(10);
  });

  it("converte pontos em ranks do Ferro ao Radiante", () => {
    expect(rankFor(0).id).toBe("iron");
    expect(rankFor(14).id).toBe("silver");
    expect(rankFor(43.9).id).toBe("immortal");
    expect(rankFor(60).id).toBe("radiant");
  });
});
