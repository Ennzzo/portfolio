import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/contact-schema";

const valid = { name: "Maria", email: "maria@example.com", message: "Olá, vi seu portfolio!" };

describe("contactSchema", () => {
  it("aceita uma mensagem válida", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("remove espaços extras de nome e mensagem", () => {
    const parsed = contactSchema.parse({ ...valid, name: "  Maria  " });
    expect(parsed.name).toBe("Maria");
  });

  it.each([
    ["nome curto", { ...valid, name: "M" }, "name"],
    ["e-mail inválido", { ...valid, email: "maria@" }, "email"],
    ["mensagem curta", { ...valid, message: "oi" }, "message"],
  ])("rejeita %s", (_, input, field) => {
    const result = contactSchema.safeParse(input);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path[0]).toBe(field);
  });

  it("rejeita quando o honeypot é preenchido", () => {
    expect(contactSchema.safeParse({ ...valid, company: "spam" }).success).toBe(false);
  });
});
