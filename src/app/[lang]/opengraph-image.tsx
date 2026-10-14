import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";
import { hasLocale } from "@/i18n/config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${profile.name} — portfolio`;

export default async function OpengraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  const lang = hasLocale(raw) ? raw : "pt";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#0a0a0b",
          color: "#ededef",
          backgroundImage:
            "linear-gradient(to right, rgba(237,237,239,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(237,237,239,0.06) 1px, transparent 1px)",
          backgroundSize: "104px 104px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="72" height="72" viewBox="0 0 64 64">
            <path fill="#d4ff3f" d="M34 5 12 35h14l-5 24 25-33H32l7-21z" />
            <path fill="#ededef" d="M50 5C51.8 12.2 51.8 12.2 59 14C51.8 15.8 51.8 15.8 50 23C48.2 15.8 48.2 15.8 41 14C48.2 12.2 48.2 12.2 50 5Z" />
            <path fill="#ededef" d="M12 45C13 49 13 49 17 50C13 51 13 51 12 55C11 51 11 51 7 50C11 49 11 49 12 45Z" />
          </svg>
          <span style={{ fontSize: 36, fontWeight: 600 }}>Enzzo</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span style={{ fontSize: 84, fontWeight: 600, letterSpacing: -3 }}>{profile.name}</span>
          <span style={{ fontSize: 40, color: "#8b8b93" }}>{profile.headline[lang]}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#8b8b93" }}>
          <span style={{ color: "#d4ff3f" }}>{profile.role[lang]}</span>
          <span>React · Next.js · TypeScript</span>
        </div>
      </div>
    ),
    size,
  );
}
