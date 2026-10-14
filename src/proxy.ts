import { NextResponse, type NextRequest } from "next/server";
import { locales } from "@/i18n/config";
import { negotiateLocale } from "@/i18n/negotiate";

// Rotas da versão com várias páginas viraram seções da página única.
const SECTIONS = new Set(["about", "projects", "experience", "contact", "github"]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const [, first, second] = pathname.split("/");

  if ((locales as readonly string[]).includes(first)) {
    if (second && SECTIONS.has(second)) {
      const url = request.nextUrl.clone();
      url.pathname = `/${first}`;
      url.hash = second;
      return NextResponse.redirect(url, 308);
    }
    return;
  }

  const locale = negotiateLocale(request.headers.get("accept-language"));
  request.nextUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Ignora API, arquivos internos e qualquer arquivo com extensão (imagens, favicon…).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
