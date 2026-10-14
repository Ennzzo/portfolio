import { describe, expect, it } from "vitest";
import { negotiateLocale } from "@/i18n/negotiate";

describe("negotiateLocale", () => {
  it("usa português para navegadores em pt-BR", () => {
    expect(negotiateLocale("pt-BR,pt;q=0.9,en;q=0.8")).toBe("pt");
  });

  it("usa inglês quando é o idioma preferido", () => {
    expect(negotiateLocale("en-US,en;q=0.9")).toBe("en");
  });

  it("respeita os pesos q mesmo fora de ordem", () => {
    expect(negotiateLocale("pt;q=0.5,en;q=0.9")).toBe("en");
  });

  it("cai no padrão (pt) para idiomas não suportados ou cabeçalho ausente", () => {
    expect(negotiateLocale("fr-FR,de;q=0.8")).toBe("pt");
    expect(negotiateLocale(null)).toBe("pt");
  });
});
