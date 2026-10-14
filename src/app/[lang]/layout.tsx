import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Intro } from "@/components/intro";
import { CustomCursor } from "@/components/fx/custom-cursor";
import { GridBackground } from "@/components/fx/grid-background";
import { GameModal } from "@/components/game/game-modal";
import { profile } from "@/data/profile";
import { hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return {
    title: { default: `${profile.name} — ${profile.role[lang]}`, template: `%s · ${profile.name}` },
    description: profile.bio[lang],
    alternates: { languages: { "pt-BR": "/pt", en: "/en" } },
    openGraph: {
      title: profile.name,
      description: profile.bio[lang],
      locale: lang === "pt" ? "pt_BR" : "en_US",
      type: "website",
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <html lang={lang === "pt" ? "pt-BR" : "en"} suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col font-sans">
        <Intro dict={dict.intro} />
        <GridBackground />
        <CustomCursor />
        <Header lang={lang} dict={dict.nav} />
        <main className="mx-auto w-full max-w-5xl flex-1 px-5 sm:px-8">{children}</main>
        <Footer lang={lang} dict={dict.footer} />
        <GameModal dict={dict.game} />
      </body>
    </html>
  );
}
