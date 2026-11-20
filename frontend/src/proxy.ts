import { NextRequest, NextResponse } from "next/server";

const WAITLIST_PATH = "/waitlist";

// Paths that stay reachable. Everything else redirects to the waitlist.
const ALLOWED_PREFIXES = ["/waitlist", "/api/waitlist", "/api/health"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAllowed = ALLOWED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  if (isAllowed) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = WAITLIST_PATH;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Skip Next internals and static files so they still load.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|css|js|txt|xml|woff|woff2)$).*)",
  ],
};
