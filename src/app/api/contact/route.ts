import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";

// Limite simples por IP (em memória): 5 envios a cada 10 minutos.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (rateLimited(ip)) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "invalid", fields: Object.keys(parsed.error.flatten().fieldErrors) },
      { status: 400 },
    );
  }

  const { name, email, message, company } = parsed.data;
  // Bot preencheu o honeypot: finge sucesso e descarta.
  if (company) return Response.json({ ok: true });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("[contact] RESEND_API_KEY ou CONTACT_TO_EMAIL não configurados");
    return Response.json({ error: "not_configured" }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
    to,
    replyTo: email,
    subject: `Portfolio: nova mensagem de ${name}`,
    text: `Nome: ${name}\nE-mail: ${email}\n\n${message}`,
    html: `<p><strong>Nome:</strong> ${escapeHtml(name)}<br><strong>E-mail:</strong> ${escapeHtml(email)}</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
  });

  if (error) {
    console.error("[contact] Resend:", error);
    return Response.json({ error: "send_failed" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
