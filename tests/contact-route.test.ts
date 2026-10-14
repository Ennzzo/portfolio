import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const send = vi.fn();
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

const { POST } = await import("@/app/api/contact/route");

let ip = 0;
const request = (body: unknown) =>
  new Request("http://localhost/api/contact", {
    method: "POST",
    // IP diferente por teste para não esbarrar no limite de envios.
    headers: { "Content-Type": "application/json", "x-forwarded-for": `10.0.0.${++ip}` },
    body: JSON.stringify(body),
  });

const valid = { name: "Maria", email: "maria@example.com", message: "Olá, vi seu portfolio!" };

describe("POST /api/contact", () => {
  beforeEach(() => {
    send.mockReset().mockResolvedValue({ data: { id: "1" }, error: null });
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("CONTACT_TO_EMAIL", "eu@example.com");
  });
  afterEach(() => vi.unstubAllEnvs());

  it("envia o e-mail com reply-to do visitante", async () => {
    const res = await POST(request(valid));
    expect(res.status).toBe(200);
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({ to: "eu@example.com", replyTo: "maria@example.com" }),
    );
  });

  it("retorna 400 com os campos inválidos", async () => {
    const res = await POST(request({ name: "M", email: "x", message: "oi" }));
    expect(res.status).toBe(400);
    expect((await res.json()).fields).toEqual(["name", "email", "message"]);
    expect(send).not.toHaveBeenCalled();
  });

  it("escapa HTML da mensagem no corpo do e-mail", async () => {
    await POST(request({ ...valid, message: "<script>alert(1)</script> oi" }));
    expect(send.mock.calls[0][0].html).toContain("&#60;script&#62;");
  });

  it("retorna 500 se as variáveis do Resend não estiverem configuradas", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const res = await POST(request(valid));
    expect(res.status).toBe(500);
  });

  it("retorna 502 se o Resend falhar", async () => {
    send.mockResolvedValue({ data: null, error: { message: "boom" } });
    const res = await POST(request(valid));
    expect(res.status).toBe(502);
  });

  it("limita a 5 envios por IP a cada 10 minutos", async () => {
    const sameIp = () =>
      POST(
        new Request("http://localhost/api/contact", {
          method: "POST",
          headers: { "x-forwarded-for": "192.168.0.1" },
          body: JSON.stringify(valid),
        }),
      );
    for (let i = 0; i < 5; i++) expect((await sameIp()).status).toBe(200);
    expect((await sameIp()).status).toBe(429);
  });
});
