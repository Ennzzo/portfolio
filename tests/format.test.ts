import { describe, expect, it } from "vitest";
import { formatMonth } from "@/lib/format";

describe("formatMonth", () => {
  it("formata AAAA-MM em português", () => {
    expect(formatMonth("2026-10", "pt")).toBe("out. de 2026");
  });

  it("formata AAAA-MM em inglês", () => {
    expect(formatMonth("2026-10", "en")).toBe("Oct 2026");
  });
});
