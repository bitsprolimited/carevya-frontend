import { NextResponse } from "next/server";
import type { HealthResponse } from "@/features/waitlist/types";
import { backendUrl } from "@/lib/backend";

const WAITLIST_HEALTH_API_URL =
  process.env.WAITLIST_HEALTH_API_URL ?? backendUrl("/health");

function errorResponse(status: number) {
  return NextResponse.json(
    {
      status: "error",
      uptime: 0,
      timestamp: new Date().toISOString(),
    } satisfies HealthResponse,
    { status },
  );
}

export async function GET() {
  try {
    const upstream = await fetch(WAITLIST_HEALTH_API_URL, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(30_000),
    });

    const payload = await upstream.json().catch(() => null);

    if (!upstream.ok || !payload) {
      return errorResponse(upstream.status || 502);
    }

    // Nest wraps as { statusCode, message, data: { status, uptime, timestamp } }
    const data =
      payload &&
      typeof payload === "object" &&
      "data" in payload &&
      payload.data &&
      typeof payload.data === "object"
        ? (payload.data as HealthResponse)
        : (payload as HealthResponse);

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Health upstream error:", err);
    return errorResponse(502);
  }
}