import { NextResponse, type NextRequest } from "next/server";
import { locales } from "@/i18n/config";
import { negotiateLocale } from "@/i18n/negotiate";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return;

  const locale = negotiateLocale(request.headers.get("accept-language"));
  request.nextUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Ignora API, arquivos internos e qualquer arquivo com extensão (imagens, favicon…).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
