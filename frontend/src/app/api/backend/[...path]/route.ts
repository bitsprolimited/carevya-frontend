import { backendUrl } from "@/lib/backend";

type RouteContext = { params: Promise<{ path: string[] }> };

/**
 * Same-origin BFF proxy to the Nest Carevya API.
 * Forwards cookies so Better Auth session works against protected routes
 * (onboarding, care-recipients, dashboard, uploads).
 */
async function proxyBackend(request: Request, context: RouteContext) {
  const { path: segments } = await context.params;
  const path = segments.map(encodeURIComponent).join("/");
  const incoming = new URL(request.url);
  const target = `${backendUrl(`/${path}`)}${incoming.search}`;

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

function rewriteUpstreamHeaders(upstream: Headers, incoming: URL): Headers {
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

export const GET = proxyBackend;
export const POST = proxyBackend;
export const PUT = proxyBackend;
export const PATCH = proxyBackend;
export const DELETE = proxyBackend;
