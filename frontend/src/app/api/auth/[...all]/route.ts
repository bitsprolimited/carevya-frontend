import { backendUrl } from "@/lib/backend";

type RouteContext = { params: Promise<{ all: string[] }> };

/**
 * Same-origin proxy to the Carevya Better Auth backend.
 * Avoids browser CORS when the frontend (localhost / Vercel) and
 * API (Render) are on different origins.
 */
async function proxyAuth(request: Request, context: RouteContext) {
  const { all } = await context.params;
  const path = all.map(encodeURIComponent).join("/");
  const incoming = new URL(request.url);
  const target = `${backendUrl(`/api/auth/${path}`)}${incoming.search}`;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  const cookie = request.headers.get("cookie");
  const authorization = request.headers.get("authorization");
  const origin =
    request.headers.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "") ??
    incoming.origin;

  if (contentType) headers.set("content-type", contentType);
  if (cookie) headers.set("cookie", cookie);
  if (authorization) headers.set("authorization", authorization);
  headers.set("origin", origin);
  headers.set("accept", request.headers.get("accept") ?? "application/json");

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: "manual",
    cache: "no-store",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  const upstream = await fetch(target, init);
  const responseHeaders = rewriteUpstreamHeaders(upstream.headers, incoming);

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

function rewriteUpstreamHeaders(
  upstream: Headers,
  incoming: URL,
): Headers {
  const headers = new Headers();
  upstream.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (lower === "transfer-encoding" || lower === "content-encoding") return;
    if (lower === "set-cookie") return;
    headers.set(key, value);
  });

  const setCookies =
    typeof upstream.getSetCookie === "function"
      ? upstream.getSetCookie()
      : [];

  for (const cookie of setCookies) {
    headers.append("set-cookie", adaptSetCookie(cookie, incoming));
  }

  return headers;
}

/** Make upstream auth cookies work on the frontend origin (incl. http://localhost). */
function adaptSetCookie(cookie: string, incoming: URL): string {
  let adapted = cookie.replace(/;\s*Domain=[^;]*/gi, "");

  if (incoming.protocol === "http:") {
    adapted = adapted.replace(/;\s*Secure/gi, "");
  }

  if (/;\s*SameSite=None/i.test(adapted) && incoming.protocol === "http:") {
    adapted = adapted.replace(/;\s*SameSite=None/gi, "; SameSite=Lax");
  }

  return adapted;
}

export const GET = proxyAuth;
export const POST = proxyAuth;
export const PUT = proxyAuth;
export const PATCH = proxyAuth;
export const DELETE = proxyAuth;
