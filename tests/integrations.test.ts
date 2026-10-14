import { describe, expect, it } from "vitest";
import { parseOverwatchSummary } from "@/lib/integrations/overwatch";
import { parseStravaActivity } from "@/lib/integrations/strava";
import { parseValorantMmr } from "@/lib/integrations/valorant";

describe("parseOverwatchSummary", () => {
  it("lista só os papéis ranqueados no PC", () => {
    const profile = parseOverwatchSummary({
      username: "Enzo",
      avatar: "a.png",
      endorsement: { level: 3 },
      competitive: {
        pc: {
          tank: null,
          damage: { division: "gold", tier: 2, rank_icon: "gold.png", role_icon: "dps.svg" },
          support: { division: "silver", tier: 4, rank_icon: "silver.png", role_icon: "sup.svg" },
          open: null,
        },
      },
    });
    expect(profile.endorsement).toBe(3);
    expect(profile.ranks.map((r) => `${r.role}:${r.division}${r.tier}`)).toEqual(["damage:gold2", "support:silver4"]);
  });

  it("aguenta perfil sem competitivo", () => {
    expect(parseOverwatchSummary({ username: "X", avatar: null, competitive: null }).ranks).toEqual([]);
  });
});

describe("parseValorantMmr", () => {
  it("extrai rank atual, RR e pico", () => {
    const rank = parseValorantMmr({
      data: {
        current_data: { currenttierpatched: "Gold 2", images: { small: "s.png", large: "l.png" }, ranking_in_tier: 47 },
        highest_rank: { patched_tier: "Platinum 1" },
      },
    });
    expect(rank).toEqual({ tier: "Gold 2", icon: "l.png", rr: 47, peak: "Platinum 1" });
  });

  it("retorna null sem rank (unranked)", () => {
    expect(parseValorantMmr({ data: { current_data: { currenttierpatched: null } } })).toBeNull();
  });
});

describe("parseStravaActivity", () => {
  it("calcula distância em km e pace de corrida", () => {
    const a = parseStravaActivity({ name: "Treino", sport_type: "Run", distance: 5000, moving_time: 1500, start_date: "2026-10-13T10:00:00Z" });
    expect(a.distanceKm).toBe(5);
    expect(a.paceSecondsPerKm).toBe(300);
  });

  it("não calcula pace para treinos que não são corrida", () => {
    const a = parseStravaActivity({ name: "HYROX", sport_type: "Crossfit", distance: 0, moving_time: 3600, start_date: "2026-10-13T10:00:00Z" });
    expect(a.paceSecondsPerKm).toBeNull();
  });
});
