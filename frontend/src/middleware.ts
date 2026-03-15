import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const pathname = req.nextUrl.pathname;

  const segments = pathname.split("/");
  const locale = (routing.locales as readonly string[]).includes(segments[1])
    ? segments[1]
    : routing.defaultLocale;

  const isLoginPage = pathname.includes("/login");
  const isRegisterPage = pathname.includes("/register");
  const isAuthPage = isLoginPage || isRegisterPage;

  // Allow through if user has a session: accessToken OR refreshToken (so when accessToken
  // cookie expires, client can load and refresh on first API 401)
  const hasSession = accessToken || !!refreshToken;

  if (!hasSession && !isAuthPage) {
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  if (hasSession && (isLoginPage || isRegisterPage)) {
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}/dashboard`;
    return NextResponse.redirect(url);
  }

  return intlMiddleware(req);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ["/", "/(vi|en)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
